import React, { useState, useMemo } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import { quizCategories, quizQuestions } from '../data/quiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

function QuizSession({ category, onBack, onFinish }) {
  const questions = useMemo(() =>
    quizQuestions.filter(q => q.category === category.id), [category]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const { savedQuizQuestions, toggleSaveQuestion } = useApp();

  const current = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCorrect = selected === current?.correctIndex;

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswers(prev => [...prev, { questionId: current.id, correct: idx === current.correctIndex }]);
  };

  const handleNext = () => {
    if (isLast) {
      const score = answers.filter(a => a.correct).length + (selected === current?.correctIndex ? 0 : 0);
      const correctCount = answers.filter(a => a.correct).length;
      onFinish(correctCount, questions.length, answers);
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (!current) return null;
  const isSaved = savedQuizQuestions.includes(current.id);
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm">
            <ArrowLeft size={16} /> Exit
          </button>
          <span className="text-xs text-muted-foreground">{currentIdx + 1} / {questions.length}</span>
          <button onClick={() => toggleSaveQuestion(current.id)}
            className={`p-1.5 rounded-lg transition-all ${isSaved ? 'text-primary' : 'text-muted-foreground/50'}`}>
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20`}>
            {category.icon} {category.label}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3">
        {/* Question */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm font-medium text-foreground leading-relaxed">{current.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {current.options.map((option, idx) => {
            let state = 'default';
            if (selected !== null) {
              if (idx === current.correctIndex) state = 'correct';
              else if (idx === selected) state = 'wrong';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm transition-all duration-200 flex items-start gap-3 ${
                  state === 'correct' ? 'bg-emerald-400/10 border-emerald-400/40 text-foreground' :
                  state === 'wrong' ? 'bg-red-400/10 border-red-400/40 text-foreground' :
                  selected === null ? 'bg-card border-border hover:bg-secondary/30 hover:border-primary/30 text-foreground' :
                  'bg-card border-border/30 text-muted-foreground'
                }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                  state === 'correct' ? 'bg-emerald-400/20 text-emerald-400' :
                  state === 'wrong' ? 'bg-red-400/20 text-red-400' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {['A','B','C','D'][idx]}
                </span>
                <span className="leading-relaxed">{option}</span>
                {state === 'correct' && <CheckCircle2 size={16} className="text-emerald-400 ml-auto flex-shrink-0 mt-0.5" />}
                {state === 'wrong' && <XCircle size={16} className="text-red-400 ml-auto flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-2xl p-4 border animate-slide-up ${isCorrect ? 'bg-emerald-400/5 border-emerald-400/25' : 'bg-red-400/5 border-red-400/25'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle2 size={15} className="text-emerald-400" /> : <XCircle size={15} className="text-red-400" />}
              <p className={`text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{current.explanation}</p>
            <p className="text-[10px] text-muted-foreground mt-2 italic">Ref: {current.reference}</p>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <button onClick={handleNext}
            className="w-full py-3.5 bg-primary rounded-2xl text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all animate-slide-up">
            {isLast ? 'See Results' : 'Next Question →'}
          </button>
        )}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}

function QuizResults({ category, score, total, onRetry, onBack }) {
  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Keep Practising';
  const gradeColor = percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="px-4 pt-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft size={16} /> Quiz Menu
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 pt-4 space-y-4 flex flex-col items-center justify-start">
        <Trophy size={48} className="text-primary opacity-80" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{category.label}</p>
          <h2 className="text-4xl font-bold text-foreground mt-1">{score}<span className="text-xl text-muted-foreground">/{total}</span></h2>
          <p className={`text-xl font-semibold mt-1 ${gradeColor}`}>{grade}</p>
          <p className="text-sm text-muted-foreground mt-1">{percentage}% correct</p>
        </div>
        <div className="w-full bg-card rounded-2xl p-4 border border-border">
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${percentage >= 80 ? 'bg-emerald-400' : percentage >= 60 ? 'bg-yellow-400' : 'bg-orange-400'}`}
              style={{ width: `${percentage}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-3 border border-border text-center">
            <p className="text-2xl font-bold text-emerald-400">{score}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border text-center">
            <p className="text-2xl font-bold text-red-400">{total - score}</p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </div>
        </div>
        <button onClick={onRetry}
          className="w-full py-3.5 bg-primary rounded-2xl text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
          <RotateCcw size={16} /> Try Again
        </button>
        <button onClick={onBack}
          className="w-full py-3.5 bg-secondary rounded-2xl text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all">
          Back to Categories
        </button>
      </div>
    </div>
  );
}

export default function QuizScreen() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [quizState, setQuizState] = useState('menu'); // menu, session, results
  const [lastResult, setLastResult] = useState(null);
  const { quizProgress } = useApp();

  const handleFinish = (score, total) => {
    setLastResult({ score, total });
    setQuizState('results');
  };

  if (quizState === 'session' && activeCategory) {
    return <QuizSession category={activeCategory} onBack={() => { setQuizState('menu'); setActiveCategory(null); }} onFinish={handleFinish} />;
  }
  if (quizState === 'results' && lastResult) {
    return <QuizResults category={activeCategory} score={lastResult.score} total={lastResult.total}
      onRetry={() => setQuizState('session')}
      onBack={() => { setQuizState('menu'); setActiveCategory(null); }} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Quiz</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Exam-style practice questions</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3 animate-fade-in">
        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Questions', value: quizQuestions.length, color: 'text-primary' },
            { label: 'Categories', value: quizCategories.length, color: 'text-purple-400' },
            { label: 'Completed', value: Object.keys(quizProgress).length, color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl p-3 border border-border text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Select a category</p>

        {quizCategories.map(cat => {
          const progress = quizProgress[cat.id];
          const pct = progress ? Math.round((progress.score / progress.total) * 100) : null;
          return (
            <button key={cat.id} onClick={() => { setActiveCategory(cat); setQuizState('session'); }}
              className="w-full bg-card rounded-2xl border border-border p-4 text-left flex items-center gap-4 hover:bg-secondary/20 hover:border-primary/30 transition-all group">
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{cat.label}</p>
                <p className="text-[10px] text-muted-foreground">{cat.count} questions</p>
                {pct !== null && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-primary">{pct}%</span>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </button>
          );
        })}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}