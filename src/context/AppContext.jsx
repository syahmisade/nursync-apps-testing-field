import React, { createContext, useContext, useState } from 'react';
import { initialSavedState } from '../data/saved';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [savedMedicines, setSavedMedicines] = useState(initialSavedState.medicines);
  const [savedProcedures, setSavedProcedures] = useState(initialSavedState.procedures);
  const [savedQuizQuestions, setSavedQuizQuestions] = useState(initialSavedState.quizQuestions);
  const [recentSearches, setRecentSearches] = useState(initialSavedState.recentSearches);
  const [quizProgress, setQuizProgress] = useState({});

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
      return [term, ...filtered].slice(0, 8);
    });
  };

  const saveQuizProgress = (category, score, total) => {
    setQuizProgress(prev => ({
      ...prev,
      [category]: { score, total, date: new Date().toISOString() }
    }));
  };

  return (
    <AppContext.Provider value={{
      savedMedicines, savedProcedures, savedQuizQuestions, recentSearches, quizProgress,
      toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion, addRecentSearch, saveQuizProgress
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);