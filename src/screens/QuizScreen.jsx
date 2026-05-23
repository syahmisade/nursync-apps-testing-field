import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import { quizCategories, quizQuestions } from '../data/quiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import PullToRefreshIndicator from '../components/PullToRefreshIndicator';

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
  const progress = (currentIdx / questions.length) * 100;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pt-4 pb-3 sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-secondary text-primary">
            <ArrowLeft size={14} /> Exit
          </button>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-primary">
            {currentIdx + 1} / {questions.length}
          </span>
          <button onClick={() => toggleSaveQuestion(current.id)}
            className="p-1.5 rounded-xl transition-all active:scale-90"
            style={{ color: isSaved ? 'hsl(265,55%,52%)' : 'hsl(var(--muted-foreground))' }}>
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }} />
        </div>
        <div className="mt-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-secondary text-primary border-border">
            {category.icon} {category.label}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3">
        {/* Question */}
        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <p className="text-sm font-semibold leading-relaxed text-foreground">{current.question}</p>
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
                className="w-full p-3.5 rounded-2xl border text-left text-sm transition-all duration-200 flex items-start gap-3 active:scale-[0.98]"
                style={
                  state === 'correct' ? { background: 'hsl(152,50%,93%)', borderColor: 'hsl(152,45%,70%)', color: 'hsl(152,50%,28%)' } :
                  state === 'wrong'   ? { background: 'hsl(0,55%,94%)', borderColor: 'hsl(0,48%,75%)', color: 'hsl(0,52%,40%)' } :
                  selected === null   ? { background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' } :
                  { background: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }
                }>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                  style={
                    state === 'correct' ? { background: 'hsl(152,45%,82%)', color: 'hsl(152,50%,32%)' } :
                    state === 'wrong'   ? { background: 'hsl(0,48%,88%)', color: 'hsl(0,52%,45%)' } :
                    { background: 'hsl(var(--secondary))', color: 'hsl(var(--primary))' }
                  }>
                  {['A','B','C','D'][idx]}
                </span>
                <span className="leading-relaxed font-medium">{option}</span>
                {state === 'correct' && <CheckCircle2 size={16} className="ml-auto flex-shrink-0 mt-0.5" style={{ color: 'hsl(152,50%,38%)' }} />}
                {state === 'wrong'   && <XCircle size={16} className="ml-auto flex-shrink-0 mt-0.5" style={{ color: 'hsl(0,52%,48%)' }} />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="rounded-2xl p-4 border animate-slide-up"
            style={isCorrect
              ? { background: 'hsl(152,50%,94%)', borderColor: 'hsl(152,40%,76%)' }
              : { background: 'hsl(0,55%,95%)', borderColor: 'hsl(0,45%,80%)' }}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect
                ? <CheckCircle2 size={15} style={{ color: 'hsl(152,50%,38%)' }} />
                : <XCircle size={15} style={{ color: 'hsl(0,52%,48%)' }} />}
              <p className="text-xs font-black"
                style={{ color: isCorrect ? 'hsl(152,50%,36%)' : 'hsl(0,52%,46%)' }}>
                {isCorrect ? '✓ Correct!' : 'Not quite.'}
              </p>
            </div>
            <p className="text-xs leading-relaxed font-medium text-foreground">{current.explanation}</p>
            <p className="text-[10px] mt-2 italic text-muted-foreground">Ref: {current.reference}</p>
          </div>
        )}

        {/* Next */}
        {showExplanation && (
          <button onClick={handleNext}
            className="w-full py-3.5 rounded-2xl text-sm font-black animate-slide-up active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', color: 'white', boxShadow: '0 4px 16px rgba(147,92,210,0.30)' }}>
            {isLast ? '🎉 See Results' : 'Next Question →'}
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
  const grade = percentage >= 80 ? 'Excellent! 🌟' : percentage >= 60 ? 'Good Job! 👍' : 'Keep Practising 💪';
  const gradeColor = percentage >= 80 ? 'hsl(152,50%,38%)' : percentage >= 60 ? 'hsl(38,65%,42%)' : 'hsl(28,65%,45%)';
  const gradeBg = percentage >= 80 ? 'hsl(152,50%,93%)' : percentage >= 60 ? 'hsl(38,80%,93%)' : 'hsl(28,70%,93%)';

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div className="px-4 pt-4 pb-1 sticky top-0 z-30 bg-background border-b border-border">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-secondary text-primary">
          <ArrowLeft size={14} /> Quiz Menu
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 pt-4 space-y-4 flex flex-col items-center">
        {/* Trophy */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-secondary border-2 border-border">
          <Trophy size={40} className="text-primary" />
        </div>

        {/* Score */}
        <div className="text-center w-full rounded-3xl p-5 border card-shadow bg-card border-border">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{category.label}</p>
          <h2 className="text-5xl font-black mt-2 text-foreground">
            {score}<span className="text-2xl font-bold text-muted-foreground">/{total}</span>
          </h2>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full"
            style={{ background: gradeBg, color: gradeColor }}>
            <p className="text-sm font-black">{grade}</p>
          </div>
          <p className="text-sm font-semibold mt-2 text-muted-foreground">{percentage}% correct</p>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-2xl p-4 border card-shadow bg-card border-border">
          <div className="w-full h-3 rounded-full overflow-hidden bg-muted">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, background: percentage >= 80 ? 'linear-gradient(90deg, hsl(152,50%,52%) 0%, hsl(152,55%,45%) 100%)' : percentage >= 60 ? 'linear-gradient(90deg, hsl(38,70%,55%) 0%, hsl(38,75%,48%) 100%)' : 'linear-gradient(90deg, hsl(28,65%,58%) 0%, hsl(28,70%,50%) 100%)' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] font-semibold text-muted-foreground">
            <span>0%</span><span>100%</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 border card-shadow text-center bg-card border-border">
            <p className="text-3xl font-black" style={{ color: 'hsl(152,50%,42%)' }}>{score}</p>
            <p className="text-xs font-semibold text-muted-foreground">Correct ✓</p>
          </div>
          <div className="rounded-2xl p-4 border card-shadow text-center bg-card border-border">
            <p className="text-3xl font-black" style={{ color: 'hsl(0,52%,52%)' }}>{total - score}</p>
            <p className="text-xs font-semibold text-muted-foreground">Incorrect ✗</p>
          </div>
        </div>

        <button onClick={onRetry}
          className="w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', color: 'white', boxShadow: '0 4px 16px rgba(147,92,210,0.28)' }}>
          <RotateCcw size={16} /> Try Again
        </button>
        <button onClick={onBack}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-all bg-secondary text-primary border border-border">
          Back to Categories
        </button>
      </div>
    </div>
  );
}

export default function QuizScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const activeCategory = id ? quizCategories.find(cat => cat.id === id) : null;
  const [quizState, setQuizState] = useState(id ? 'session' : 'menu');
  const [lastResult, setLastResult] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const { quizProgress } = useApp();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setQuizState(id ? 'session' : 'menu');
    setLastResult(null);
  }, [id]);

  const handleFinish = (score, total) => {
    setLastResult({ score, total });
    setQuizState('results');
  };

  if (quizState === 'session' && activeCategory)
    return <QuizSession category={activeCategory} onBack={() => navigate('/quiz')} onFinish={handleFinish} />;
  if (quizState === 'results' && lastResult)
    return <QuizResults category={activeCategory} score={lastResult.score} total={lastResult.total}
      onRetry={() => setQuizState('session')}
      onBack={() => navigate('/quiz')} />;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-1">
          <div style={{ width: 72, height: 72, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/5b6745fd0_ChatGPTImageMay23202604_49_53PM-Edited.png" alt="" style={{ position: 'absolute', width: 280, height: 'auto', top: -210, left: -10 }} />
          </div>
          <div className="animate-fade-in">
            <h1 className="text-2xl font-black text-foreground">Quiz</h1>
            <p className="text-xs font-medium text-muted-foreground">Exam-style practice questions</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Questions', value: quizQuestions.length, color: 'hsl(265,55%,52%)' },
            { label: 'Categories', value: quizCategories.length, color: 'hsl(270,50%,48%)' },
            { label: 'Completed', value: Object.keys(quizProgress).length, color: 'hsl(152,50%,38%)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-3 border card-shadow text-center bg-card border-border">
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest px-1 text-muted-foreground">Select a Category</p>

        {quizCategories.map(cat => {
          const progress = quizProgress[cat.id];
          const pct = progress ? Math.round((progress.score / progress.total) * 100) : null;
          return (
            <button key={cat.id} onClick={() => navigate(`/quiz/${cat.id}`)}
              className="w-full rounded-2xl border p-4 text-left flex items-center gap-4 transition-all active:scale-[0.98] card-shadow bg-card border-border hover:bg-muted">
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{cat.label}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{cat.count} questions</p>
                {pct !== null && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-primary">{pct}%</span>
                  </div>
                )}
              </div>
              <ChevronRight size={15} className="text-muted-foreground" />
            </button>
          );
        })}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}