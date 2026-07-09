import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Bookmark, BookmarkCheck, CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy, BookOpen, Layers } from 'lucide-react';
import { useApp, quizProgressKey } from '../context/AppContext';
import { useQuiz } from '../hooks/useQuiz';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { SemanticPill, StatusPanel, toneForQuizCategory } from '../components/Semantic';
import { AnimatePresence, motion, slideTransition, detailVariants, listVariants } from '../components/PageTransition';
import EmptyContentState from '../components/EmptyContentState';

function toneForQuizSource(source) {
  return source?.mode === 'category' ? toneForQuizCategory(source.id) : 'neutral';
}

function QuizSession({ source, onBack, onFinish }) {
  const questions = source.questions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const { savedQuizQuestions, toggleSaveQuestion } = useApp();

  useEffect(() => {
    setCurrentIdx(0);
    setSelected(null);
    setShowExplanation(false);
    setAnswers([]);
  }, [source.mode, source.id]);

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
    <div className="flex flex-col h-full">
      <div
        className="px-4 pt-4 pb-3 sticky top-0 z-30 bg-background border-b border-border"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
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

        <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }} />
        </div>
        <div className="mt-2">
          <SemanticPill tone={toneForQuizSource(source)} className="py-1">
            {source.icon ? `${source.icon} ` : ''}{source.label}
          </SemanticPill>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-4 space-y-3">
        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <p className="text-sm font-semibold leading-relaxed text-foreground">{current.question}</p>
        </div>

        <div className="space-y-2">
          {current.options.map((option, idx) => {
            let state = 'default';
            if (selected !== null) {
              if (idx === current.correctIndex) state = 'correct';
              else if (idx === selected) state = 'wrong';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)}
                data-state={state === 'default' && selected !== null ? 'muted' : state}
                className="choice-option w-full p-3.5 rounded-2xl border text-left text-sm transition-all duration-200 flex items-start gap-3 active:scale-[0.98]">
                <span className="choice-option-badge w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  {['A','B','C','D'][idx]}
                </span>
                <span className="leading-relaxed font-medium">{option}</span>
                {state === 'correct' && <CheckCircle2 size={16} className="ml-auto flex-shrink-0 mt-0.5" />}
                {state === 'wrong' && <XCircle size={16} className="ml-auto flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <StatusPanel tone={isCorrect ? 'success' : 'danger'} className="status-panel-block animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              <p className="text-sm font-black">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
            </div>
            <p className="text-xs leading-relaxed font-medium text-foreground">{current.explanation}</p>
            {current.reference && <p className="text-xs mt-2 italic text-muted-foreground">Ref: {current.reference}</p>}
          </StatusPanel>
        )}

        {showExplanation && (
          <button onClick={handleNext}
            className="w-full py-3.5 rounded-2xl text-sm font-black animate-slide-up active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', color: 'white', boxShadow: '0 4px 16px rgba(147,92,210,0.30)' }}>
            {isLast ? 'See Results' : 'Next Question'}
          </button>
        )}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}

function QuizResults({ source, score, total, onRetry, onBack }) {
  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practising';
  const gradeColor = percentage >= 80 ? 'hsl(152,50%,38%)' : percentage >= 60 ? 'hsl(38,65%,42%)' : 'hsl(28,65%,45%)';
  const gradeBg = percentage >= 80 ? 'hsl(152,50%,93%)' : percentage >= 60 ? 'hsl(38,80%,93%)' : 'hsl(28,70%,93%)';

  return (
    <div className="flex flex-col h-full animate-slide-up">
      <div
        className="px-4 pt-4 pb-1 sticky top-0 z-30 bg-background border-b border-border"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-secondary text-primary">
          <ArrowLeft size={14} /> Quiz Menu
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 pt-4 space-y-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-secondary border-2 border-border">
          <Trophy size={40} className="text-primary" />
        </div>

        <div className="text-center w-full rounded-3xl p-5 border card-shadow bg-card border-border">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{source.label}</p>
          <h2 className="text-5xl font-black mt-2 text-foreground">
            {score}<span className="text-2xl font-bold text-muted-foreground">/{total}</span>
          </h2>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full"
            style={{ background: gradeBg, color: gradeColor }}>
            <p className="text-sm font-black">{grade}</p>
          </div>
          <p className="text-sm font-semibold mt-2 text-muted-foreground">{percentage}% correct</p>
        </div>

        <div className="w-full rounded-2xl p-4 border card-shadow bg-card border-border">
          <div className="w-full h-3 rounded-full overflow-hidden bg-muted">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, background: percentage >= 80 ? 'linear-gradient(90deg, hsl(152,50%,52%) 0%, hsl(152,55%,45%) 100%)' : percentage >= 60 ? 'linear-gradient(90deg, hsl(38,70%,55%) 0%, hsl(38,75%,48%) 100%)' : 'linear-gradient(90deg, hsl(28,65%,58%) 0%, hsl(28,70%,50%) 100%)' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs font-semibold text-muted-foreground">
            <span>0%</span><span>100%</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 border card-shadow text-center bg-card border-border">
            <p className="text-3xl font-black" style={{ color: 'hsl(152,50%,42%)' }}>{score}</p>
            <p className="text-xs font-semibold text-muted-foreground">Correct</p>
          </div>
          <div className="rounded-2xl p-4 border card-shadow text-center bg-card border-border">
            <p className="text-3xl font-black" style={{ color: 'hsl(0,52%,52%)' }}>{total - score}</p>
            <p className="text-xs font-semibold text-muted-foreground">Incorrect</p>
          </div>
        </div>

        <button onClick={onRetry}
          className="w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', color: 'white', boxShadow: '0 4px 16px rgba(147,92,210,0.28)' }}>
          <RotateCcw size={16} /> Try Again
        </button>
        <button onClick={onBack}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-all bg-secondary text-primary border border-border">
          Back to Quiz Menu
        </button>
      </div>
    </div>
  );
}

function QuizSourceCard({ source, progress, onClick }) {
  const pct = progress ? Math.round((progress.score / progress.total) * 100) : null;
  const isSet = source.mode === 'set';

  return (
    <button onClick={onClick}
      className="w-full rounded-2xl border p-4 text-left flex items-center gap-4 transition-all active:scale-[0.98] card-shadow bg-card border-border hover:bg-muted">
      <span className="w-9 h-9 rounded-2xl flex items-center justify-center bg-secondary text-primary flex-shrink-0">
        {isSet ? <Layers size={18} /> : <span className="text-2xl">{source.icon}</span>}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground">{source.label}</p>
        <p className="text-xs font-medium text-muted-foreground">{source.count} questions</p>
        {pct !== null && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-bold text-primary">{pct}%</span>
          </div>
        )}
      </div>
      <ChevronRight size={15} className="text-muted-foreground" />
    </button>
  );
}

export default function QuizScreen() {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const routeMode = mode === 'set' ? 'set' : 'category';
  const routeId = id;
  const { quizCategories, quizSets, quizQuestions, isLoading, error } = useQuiz();
  const [activeMenu, setActiveMenu] = useState('category');
  const [quizState, setQuizState] = useState(routeId ? 'session' : 'menu');
  const [lastResult, setLastResult] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const { quizProgress, saveQuizProgress } = useApp();

  const availableQuizCategories = useMemo(
    () => quizCategories.filter(cat => cat.count > 0),
    [quizCategories]
  );

  const availableQuizSets = useMemo(
    () => quizSets.filter(set => set.count > 0),
    [quizSets]
  );

  const activeSource = useMemo(() => {
    if (!routeId) return null;
    if (routeMode === 'set') {
      const set = availableQuizSets.find(item => item.id === String(routeId));
      if (!set) return null;
      return {
        ...set,
        mode: 'set',
        icon: '',
        questions: quizQuestions.filter(q => Number(q.setid) === set.setid),
      };
    }

    const category = availableQuizCategories.find(cat => cat.id === routeId);
    if (!category) return null;
    return {
      ...category,
      mode: 'category',
      questions: quizQuestions.filter(q => q.category === category.id),
    };
  }, [availableQuizCategories, availableQuizSets, quizQuestions, routeId, routeMode]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setQuizState(routeId ? 'session' : 'menu');
    setLastResult(null);
    if (routeMode === 'set') setActiveMenu('set');
  }, [routeId, routeMode]);

  const handleFinish = (score, total) => {
    if (activeSource) {
      saveQuizProgress(activeSource.mode, activeSource.id, score, total);
    }
    setLastResult({ score, total });
    setQuizState('results');
  };

  const handleBackToMenu = () => {
    setLastResult(null);
    setQuizState('menu');
    navigate('/quiz');
  };

  const showSession = quizState === 'session' && activeSource;
  const showResults = quizState === 'results' && activeSource && lastResult;
  const isDetail = showSession || showResults;
  const completableProgressKeys = useMemo(() => {
    const keys = new Set();
    availableQuizCategories.forEach(cat => keys.add(quizProgressKey('category', cat.id)));
    availableQuizSets.forEach(set => keys.add(quizProgressKey('set', set.id)));
    return keys;
  }, [availableQuizCategories, availableQuizSets]);
  const completedCount = useMemo(
    () => Object.keys(quizProgress).filter(key => completableProgressKeys.has(key)).length,
    [quizProgress, completableProgressKeys]
  );
  const activeList = activeMenu === 'set' ? availableQuizSets : availableQuizCategories;
  const activeListLabel = activeMenu === 'set' ? 'Select a Set' : 'Select a Category';
  const emptyTitle = activeMenu === 'set' ? 'No quiz sets available' : 'No quiz questions available';
  const emptyDescription = activeMenu === 'set'
    ? 'Add Set ID values to quiz question records in Content Manager.'
    : 'Add quiz question records in Content Manager or import a CSV.';

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={Boolean(routeId)}>
        {isDetail ? (
          <motion.div
            key="detail"
            className="absolute inset-0 overflow-hidden bg-background"
            variants={detailVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            {showSession && (
              <QuizSession source={activeSource} onBack={handleBackToMenu} onFinish={handleFinish} />
            )}
            {showResults && (
              <QuizResults source={activeSource} score={lastResult.score} total={lastResult.total}
                onRetry={() => setQuizState('session')}
                onBack={handleBackToMenu} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="absolute inset-0"
            variants={listVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
                <div className="px-5 pt-4 pb-2 flex items-center gap-3">
                  <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/27e4b79cb_Pic4.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ transform: 'scale(1.1)', transformOrigin: 'center' }} />
                  <div>
                    <h1 className="text-2xl font-black text-foreground">Quiz</h1>
                    <p className="text-xs font-medium text-muted-foreground">Exam-style practice questions</p>
                  </div>
                </div>
                <div className="h-1.5 pointer-events-none transition-opacity duration-200"
                  style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pt-2 pb-4 space-y-3">
                {isLoading ? (
                  <div className="text-center py-14">
                    <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-semibold mt-3 text-muted-foreground">Loading quiz...</p>
                  </div>
                ) : error ? (
                  <StatusPanel tone="danger" className="status-panel-block">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>Could not load quiz content. Please check your connection and try again.</span>
                  </StatusPanel>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Questions', value: quizQuestions.length, color: 'hsl(265,55%,52%)' },
                        { label: 'Categories', value: availableQuizCategories.length, color: 'hsl(270,50%,48%)' },
                        { label: 'Sets', value: availableQuizSets.length, color: 'hsl(205,70%,38%)' },
                        { label: 'Done', value: completedCount, color: 'hsl(152,50%,38%)' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl p-2.5 border card-shadow text-center bg-card border-border">
                          <p className="text-lg font-black" style={{ color }}>{value}</p>
                          <p className="text-[11px] font-semibold leading-tight text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-2xl p-1 bg-secondary">
                      {[
                        { key: 'category', label: 'Category', Icon: BookOpen },
                        { key: 'set', label: 'Set', Icon: Layers },
                      ].map(({ key, label, Icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveMenu(key)}
                          className={`h-10 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${activeMenu === key ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
                        >
                          <Icon size={15} />
                          {label}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs font-black uppercase tracking-widest px-1 text-muted-foreground">{activeListLabel}</p>

                    {activeList.length === 0 ? (
                      <EmptyContentState
                        icon={activeMenu === 'set' ? Layers : BookOpen}
                        title={emptyTitle}
                        description={emptyDescription}
                      />
                    ) : activeList.map(item => {
                      const source = { ...item, mode: activeMenu };
                      const progress = quizProgress[quizProgressKey(activeMenu, item.id)];
                      const path = activeMenu === 'set' ? `/quiz/set/${item.id}` : `/quiz/category/${item.id}`;
                      return (
                        <QuizSourceCard
                          key={`${activeMenu}:${item.id}`}
                          source={source}
                          progress={progress}
                          onClick={() => navigate(path)}
                        />
                      );
                    })}

                    <DisclaimerBanner compact />
                    <div className="h-2" />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
