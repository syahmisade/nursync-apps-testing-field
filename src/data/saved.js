// This file manages saved state across the app
// In a real app, this would be persisted to storage

export const initialSavedState = {
  medicines: [3], // metformin saved by default
  procedures: [3], // hand hygiene saved by default  
  quizQuestions: [1, 8], // first and last pharmacology questions
  recentSearches: ["paracetamol", "amoxicillin", "blood pressure", "hand hygiene"]
};