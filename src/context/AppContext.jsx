import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const AppContext = createContext(null);

const RECENT_KEY = 'nursync_recent_searches';
const RECENT_SEARCH_LIMIT = 8;

// Saved items and quiz attempts are persisted per-user via the SavedItem and
// QuizAttempt Base44 entities. Recent searches stay in localStorage (device-local,
// no entity needed).

function loadRecentSearches() {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) return JSON.parse(stored).slice(0, RECENT_SEARCH_LIMIT);
  } catch {
    // Malformed/unavailable storage — start empty.
  }
  return [];
}

export function AppProvider({ children }) {
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [savedProcedures, setSavedProcedures] = useState([]);
  const [savedQuizQuestions, setSavedQuizQuestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [quizProgress, setQuizProgress] = useState({});
  const [isLoadingAppData, setIsLoadingAppData] = useState(true);
  // Maps `${itemType}:${legacyId}` -> SavedItem record id, so we can delete on un-save.
  const [savedRecordIds, setSavedRecordIds] = useState({});

  // Load saved items + latest quiz attempt per category from the backend.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [items, attempts] = await Promise.all([
          base44.entities.SavedItem.list('-created_date', 1000),
          base44.entities.QuizAttempt.list('-created_date', 1000),
        ]);
        if (cancelled) return;

        const ids = {};
        const meds = [];
        const procs = [];
        const quizzes = [];
        for (const it of items) {
          ids[`${it.itemType}:${it.itemLegacyId}`] = it.id;
          if (it.itemType === 'medicine') meds.push(it.itemLegacyId);
          else if (it.itemType === 'procedure') procs.push(it.itemLegacyId);
          else if (it.itemType === 'quiz') quizzes.push(it.itemLegacyId);
        }
        setSavedRecordIds(ids);
        setSavedMedicines(meds);
        setSavedProcedures(procs);
        setSavedQuizQuestions(quizzes);

        // Attempts are sorted newest-first; keep the first (latest) per category.
        const progress = {};
        for (const a of attempts) {
          if (!progress[a.categoryKey]) {
            progress[a.categoryKey] = { score: a.score, total: a.total, date: a.created_date };
          }
        }
        setQuizProgress(progress);
      } catch (error) {
        console.error('Failed to load saved NurSync data:', error);
      } finally {
        if (!cancelled) setIsLoadingAppData(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist recent searches locally.
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches));
    } catch {
      // Storage may be unavailable (e.g. private mode) — ignore.
    }
  }, [recentSearches]);

  const toggleSave = useCallback(async (itemType, id, setList) => {
    const key = `${itemType}:${id}`;
    const existingRecordId = savedRecordIds[key];
    if (existingRecordId) {
      // Optimistic remove.
      setList(prev => prev.filter(x => x !== id));
      setSavedRecordIds(prev => { const next = { ...prev }; delete next[key]; return next; });
      await base44.entities.SavedItem.delete(existingRecordId);
    } else {
      setList(prev => prev.includes(id) ? prev : [...prev, id]);
      const record = await base44.entities.SavedItem.create({ itemType, itemLegacyId: id });
      setSavedRecordIds(prev => ({ ...prev, [key]: record.id }));
    }
  }, [savedRecordIds]);

  const toggleSaveMedicine = (id) => toggleSave('medicine', id, setSavedMedicines);
  const toggleSaveProcedure = (id) => toggleSave('procedure', id, setSavedProcedures);
  const toggleSaveQuestion = (id) => toggleSave('quiz', id, setSavedQuizQuestions);

  const addRecentSearch = (term) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, RECENT_SEARCH_LIMIT);
    });
  };

  const saveQuizProgress = async (category, score, total) => {
    setQuizProgress(prev => ({
      ...prev,
      [category]: { score, total, date: new Date().toISOString() }
    }));
    await base44.entities.QuizAttempt.create({ categoryKey: category, score, total });
  };

  // Clears all of the user's saved data on the backend and resets in-memory state.
  const clearAllData = async () => {
    const recordIds = Object.values(savedRecordIds);
    setSavedMedicines([]);
    setSavedProcedures([]);
    setSavedQuizQuestions([]);
    setRecentSearches([]);
    setQuizProgress({});
    setSavedRecordIds({});
    const attempts = await base44.entities.QuizAttempt.list('-created_date', 1000);
    await Promise.all([
      ...recordIds.map(rid => base44.entities.SavedItem.delete(rid)),
      ...attempts.map(a => base44.entities.QuizAttempt.delete(a.id)),
    ]);
  };

  return (
    <AppContext.Provider value={{
      savedMedicines, savedProcedures, savedQuizQuestions, recentSearches, quizProgress,
      toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion, addRecentSearch, saveQuizProgress,
      clearAllData, isLoadingAppData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
