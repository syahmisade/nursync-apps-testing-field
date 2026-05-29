import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Reads quiz data from the Base44 `QuizCategory` and `QuizQuestion` entities.
// Maps fields so the existing screen logic keeps working:
//  - category: categoryKey -> id, plus computed `count`
//  - question: categoryKey -> category, legacyId -> id

export function useQuiz() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz'],
    queryFn: async () => {
      const [categories, questions] = await Promise.all([
        base44.entities.QuizCategory.list('categoryKey', 100),
        base44.entities.QuizQuestion.list('legacyId', 1000),
      ]);

      const quizQuestions = questions.map(q => ({ ...q, id: q.legacyId, category: q.categoryKey }));

      const quizCategories = categories.map(c => ({
        ...c,
        id: c.categoryKey,
        count: quizQuestions.filter(q => q.category === c.categoryKey).length,
      }));

      return { quizCategories, quizQuestions };
    },
    initialData: { quizCategories: [], quizQuestions: [] },
  });

  return { quizCategories: data.quizCategories, quizQuestions: data.quizQuestions, isLoading, error };
}