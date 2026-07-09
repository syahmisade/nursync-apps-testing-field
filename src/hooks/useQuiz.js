import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const QUIZ_QUESTION_FETCH_LIMIT = 5000;

// Reads quiz data from the Base44 `QuizCategory` and `QuizQuestion` entities.
// Maps fields so the existing screen logic keeps working:
//  - category: categoryKey -> id, plus computed `count`
//  - question: categoryKey -> category, legacyId -> id
//  - sets: derived from QuizQuestion.setid, no separate entity required

export function useQuiz() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz'],
    queryFn: async () => {
      const [categories, questions] = await Promise.all([
        base44.entities.QuizCategory.list('categoryKey', 100),
        base44.entities.QuizQuestion.list('legacyId', QUIZ_QUESTION_FETCH_LIMIT),
      ]);

      const quizQuestions = questions.map(q => ({
        ...q,
        id: q.legacyId,
        category: q.categoryKey,
        setid: Number.isFinite(Number(q.setid)) ? Number(q.setid) : q.setid,
      }));

      const quizCategories = categories.map(c => ({
        ...c,
        id: c.categoryKey,
        count: quizQuestions.filter(q => q.category === c.categoryKey).length,
      }));

      const setCounts = new Map();
      for (const question of quizQuestions) {
        const setid = Number(question.setid);
        if (!Number.isFinite(setid) || setid <= 0) continue;
        setCounts.set(setid, (setCounts.get(setid) || 0) + 1);
      }

      const quizSets = Array.from(setCounts.entries())
        .sort(([a], [b]) => a - b)
        .map(([setid, count]) => ({
          id: String(setid),
          setid,
          label: `Set ${setid}`,
          count,
        }));

      return { quizCategories, quizQuestions, quizSets };
    },
  });

  return {
    quizCategories: data?.quizCategories ?? [],
    quizSets: data?.quizSets ?? [],
    quizQuestions: data?.quizQuestions ?? [],
    isLoading,
    error
  };
}
