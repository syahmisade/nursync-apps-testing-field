import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSavedState } from '../data/saved';

const AppContext = createContext(null);

const STORAGE_KEY = 'nursync_saved_state';
const RECENT_SEARCH_LIMIT = 8;

// Read persisted state on first load. If nothing is stored yet (very first run),
// seed from the demo data so the app looks populated. After the user clears their
// data, the stored state takes over and we no longer re-seed.
function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        medicines: parsed.medicines ?? [],
        procedures: parsed.procedures ?? [],
        quizQuestions: parsed.quizQuestions ?? [],
        recentSearches: parsed.recentSearches ?? [],
        quizProgress: parsed.quizProgress ?? {},
      };
    }
  } catch {
    // Malformed/unavailable storage — fall through to the demo seed.
  }
  return {
    medicines: initialSavedState.medicines,
    procedures: initialSavedState.procedures,
    quizQuestions: initialSavedState.quizQuestions,
    recentSearches: initialSavedState.recentSearches.slice(0, RECENT_SEARCH_LIMIT),
    quizProgress: {},
  };
}

export function AppProvider({ children }) {
  const [initial] = useState(loadInitialState);
  const [savedMedicines, setSavedMedicines] = useState(initial.medicines);
  const [savedProcedures, setSavedProcedures] = useState(initial.procedures);
  const [savedQuizQuestions, setSavedQuizQuestions] = useState(initial.quizQuestions);
  const [recentSearches, setRecentSearches] = useState(initial.recentSearches);
  const [quizProgress, setQuizProgress] = useState(initial.quizProgress);

  // Persist on any change. This is the single place that writes saved state,
  // which keeps the shape stable for the later swap to a Base44 backend.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        medicines: savedMedicines,
        procedures: savedProcedures,
        quizQuestions: savedQuizQuestions,
        recentSearches,
        quizProgress,
      }));
    } catch {
      // Storage may be unavailable (e.g. private mode) — ignore.
    }
  }, [savedMedicines, savedProcedures, savedQuizQuestions, recentSearches, quizProgress]);

  const toggleSaveMedicine = (id) => {
    setSavedMedicines(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveProcedure = (id) => {
    setSavedProcedures(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveQuestion = (id) => {
    setSavedQuizQuestions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addRecentSearch = (term) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, RECENT_SEARCH_LIMIT);
    });
  };

  const saveQuizProgress = (category, score, total) => {
    setQuizProgress(prev => ({
      ...prev,
      [category]: { score, total, date: new Date().toISOString() }
    }));
  };

  // Clears all locally saved data. Resets in-memory state (so the UI updates
  // immediately) and the persistence effect writes the empty state to storage.
  const clearAllData = () => {
    setSavedMedicines([]);
    setSavedProcedures([]);
    setSavedQuizQuestions([]);
    setRecentSearches([]);
    setQuizProgress({});
  };

  return (
    <AppContext.Provider value={{
      savedMedicines, savedProcedures, savedQuizQuestions, recentSearches, quizProgress,
      toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion, addRecentSearch, saveQuizProgress,
      clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
