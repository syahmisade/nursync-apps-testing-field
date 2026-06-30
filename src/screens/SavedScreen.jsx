import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Pill, ClipboardList, BookOpen, ChevronRight, BookmarkX, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMedicines } from '../hooks/useMedicines';
import { useProcedures } from '../hooks/useProcedures';
import { useQuiz } from '../hooks/useQuiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { SemanticPill, buildCategoryTextColorMap, categoryTextColorFromMap, toneForCategory, toneForQuizCategory } from '../components/Semantic';
import { useTheme } from '../context/ThemeContext';

const quizCatLabel = {
  "pharmacology": "Pharmacology",
  "fundamentals": "Fundamentals",
  "medsurg":      "Med-Surgical",
  "maternal":     "Maternal & Child",
  "infection":    "Infection Control",
  "calculations": "Calculations",
};

const fromSavedState = (savedTab) => ({ fromSaved: true, savedTab });

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getMedicineCategoryLabel(medicine) {
  return hasText(medicine.category) ? medicine.category.trim() : 'Uncategorized';
}

function getProcedureCategoryLabel(procedure) {
  return hasText(procedure.category) ? procedure.category.trim() : 'Uncategorized';
}

function CategoryPill({ category, colorMap, isDark, fallback = false }) {
  const label = hasText(category) ? category : 'Uncategorized';

  return (
    <SemanticPill
      tone={fallback ? 'neutral' : toneForCategory(label)}
      style={{ color: categoryTextColorFromMap(label, colorMap, isDark) }}
    >
      <span className="max-w-[13rem] truncate">{label}</span>
    </SemanticPill>
  );
}

function MedicineCardMeta({ medicine }) {
  const rows = [
    { label: 'Brand', value: hasText(medicine.brandName) ? medicine.brandName : '-', muted: !hasText(medicine.brandName) },
    { label: 'Also known as', value: hasText(medicine.glamourName) ? medicine.glamourName : '-', muted: !hasText(medicine.glamourName) },
  ];

  return (
    <div className="space-y-1">
      {rows.map(row => (
        <p
          key={row.label}
          className={`text-xs leading-4 line-clamp-1 break-words ${row.muted ? 'font-medium text-muted-foreground/70' : 'font-medium text-muted-foreground'}`}
        >
          <span className="font-bold text-primary">{row.label}: </span>
          {row.value}
        </p>
      ))}
    </div>
  );
}

function getProcedureOverviewText(procedure) {
  if (Array.isArray(procedure.overview)) return procedure.overview.filter(hasText).join(' • ');
  return hasText(procedure.overview) ? procedure.overview : 'No overview listed';
}

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-14 gap-3">
    <div className="text-5xl">🐱</div>
    <div className="rounded-2xl px-5 py-3 text-center bg-secondary border border-border">
      <BookmarkX size={24} className="mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm font-semibold text-foreground">No saved {label} yet</p>
      <p className="text-xs mt-1 text-muted-foreground">Tap the bookmark on any {label.slice(0, -1)}</p>
    </div>
  </div>
);

export default function SavedScreen() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.activeTab || 'medicines';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const {
    savedMedicines,
    savedProcedures,
    savedQuizQuestions,
    toggleSaveMedicine,
    toggleSaveProcedure,
    toggleSaveQuestion,
    isLoadingAppData
  } = useApp();
  const { medicines, isLoading: isLoadingMedicines } = useMedicines();
  const { procedures, isLoading: isLoadingProcedures } = useProcedures();
  const { quizQuestions, isLoading: isLoadingQuiz } = useQuiz();
  const medicineCategoryColorMap = React.useMemo(
    () => buildCategoryTextColorMap(['All', ...medicines.map(getMedicineCategoryLabel)]),
    [medicines]
  );
  const procedureCategoryColorMap = React.useMemo(
    () => buildCategoryTextColorMap(['All', ...procedures.map(getProcedureCategoryLabel)]),
    [procedures]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const savedMeds = medicines.filter(m => savedMedicines.includes(m.id));
  const savedProcs = procedures.filter(p => savedProcedures.includes(p.id));
  const savedQuestions = quizQuestions.filter(q => savedQuizQuestions.includes(q.id));
  const isLoadingSavedContent = isLoadingAppData || isLoadingMedicines || isLoadingProcedures || isLoadingQuiz;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/ac180ff1e_Pic5.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ transform: 'scale(1.1)', transformOrigin: 'center' }} />
          <div className="">
            <h1 className="text-2xl font-black text-foreground">Saved</h1>
            <p className="text-xs font-medium text-muted-foreground">Your bookmarked items</p>
          </div>
        </div>

        {/* Tab stats */}
        <div className="px-4 mb-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Medicines', count: savedMeds.length, Icon: Pill, color: 'hsl(220,60%,46%)', tab: 'medicines', activeBg: 'hsl(220,60%,93%)' },
              { label: 'Procedures', count: savedProcs.length, Icon: ClipboardList, color: 'hsl(270,50%,48%)', tab: 'procedures', activeBg: 'hsl(270,50%,93%)' },
              { label: 'Quiz Qs', count: savedQuestions.length, Icon: BookOpen, color: 'hsl(152,50%,38%)', tab: 'quiz', activeBg: 'hsl(152,50%,92%)' },
            ].map(({ label, count, Icon, color, tab, activeBg }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="rounded-2xl p-2.5 border text-center transition-all active:scale-95"
                style={activeTab === tab
                  ? { background: activeBg, borderColor: color + '55', boxShadow: `0 2px 12px ${color}22` }
                  : { background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <Icon size={14} className="mx-auto mb-1" style={{ color }} />
                <p className="text-lg font-black" style={{ color }}>{count}</p>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: activeTab === tab ? color : 'hsl(var(--muted-foreground))' }}>{label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pt-2 pb-4 space-y-2.5">
        {isLoadingSavedContent && (
          <div className="text-center py-14">
            <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-semibold mt-3 text-muted-foreground">Loading saved items...</p>
          </div>
        )}

        {/* Medicines */}
        {!isLoadingSavedContent && activeTab === 'medicines' && (
          savedMeds.length === 0 ? <EmptyState label="medicines" /> :
          savedMeds.map(med => {
            return (
              <div key={med.id} className="rounded-2xl border overflow-hidden card-shadow bg-card border-border">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/medicine/${med.id}`, { state: fromSavedState('medicines') })}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/medicine/${med.id}`, { state: fromSavedState('medicines') });
                    }
                  }}
                  className="w-full min-h-[150px] p-4 text-left transition-all active:scale-[0.99] cursor-pointer hover:bg-muted"
                >
                  <div className="grid grid-cols-[1fr_auto] gap-4 h-full">
                    <div className="min-w-0 flex flex-col gap-2.5">
                      <div className="flex items-center overflow-hidden">
                        <CategoryPill
                          category={getMedicineCategoryLabel(med)}
                          colorMap={medicineCategoryColorMap}
                          isDark={isDark}
                          fallback={!hasText(med.category)}
                        />
                      </div>
                      <div className="h-[36px] flex items-center">
                        <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2 break-words">{med.genericName}</h3>
                      </div>
                      <MedicineCardMeta medicine={med} />
                    </div>
                    <div className="w-12 flex items-start justify-end gap-1 pt-0.5">
                      <button onClick={e => { e.stopPropagation(); toggleSaveMedicine(med.id); }} className="p-1.5 rounded-xl transition-all active:scale-90" style={{ color: 'hsl(265,55%,52%)' }}>
                        <Bookmark size={16} fill="currentColor" />
                      </button>
                      <ChevronRight size={15} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Procedures */}
        {!isLoadingSavedContent && activeTab === 'procedures' && (
          savedProcs.length === 0 ? <EmptyState label="procedures" /> :
          savedProcs.map(proc => {
            return (
              <div key={proc.id} className="rounded-2xl border overflow-hidden card-shadow bg-card border-border">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/procedures/${proc.id}`, { state: fromSavedState('procedures') })}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/procedures/${proc.id}`, { state: fromSavedState('procedures') });
                    }
                  }}
                  className="w-full min-h-[164px] p-4 text-left transition-all active:scale-[0.99] cursor-pointer hover:bg-muted"
                >
                  <div className="grid grid-cols-[1fr_auto] gap-4 h-full">
                    <div className="min-w-0 flex flex-col gap-2.5">
                      <div className="flex items-center overflow-hidden">
                        <CategoryPill
                          category={getProcedureCategoryLabel(proc)}
                          colorMap={procedureCategoryColorMap}
                          isDark={isDark}
                          fallback={!hasText(proc.category)}
                        />
                      </div>
                      <div className="h-[36px] flex items-center">
                        <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2 break-words">{proc.title}</h3>
                      </div>
                      <p className="text-xs font-medium leading-[15px] line-clamp-2 text-muted-foreground">
                        {getProcedureOverviewText(proc)}
                      </p>
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-black leading-none text-primary">
                          <CheckCircle2 size={12} />
                          {Array.isArray(proc.steps) ? proc.steps.length : 0} steps
                        </span>
                      </div>
                    </div>
                    <div className="w-12 flex items-start justify-end gap-1 pt-0.5">
                      <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }} className="p-1.5 rounded-xl transition-all active:scale-90" style={{ color: 'hsl(265,55%,52%)' }}>
                        <Bookmark size={16} fill="currentColor" />
                      </button>
                      <ChevronRight size={15} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Quiz */}
        {!isLoadingSavedContent && activeTab === 'quiz' && (
          savedQuestions.length === 0 ? <EmptyState label="quiz questions" /> :
          savedQuestions.map(q => {
            return (
              <div key={q.id} role="button" tabIndex={0}
                onClick={() => navigate(`/quiz/${q.category}`, { state: fromSavedState('quiz') })}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/quiz/${q.category}`, { state: fromSavedState('quiz') });
                  }
                }}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99] cursor-pointer bg-card border-border hover:bg-muted">
                <div className="flex-1 min-w-0">
                  <SemanticPill tone={toneForQuizCategory(q.category)} className="mb-1.5">{quizCatLabel[q.category]}</SemanticPill>
                  <p className="text-xs font-medium leading-relaxed line-clamp-3 text-foreground">{q.question}</p>
                  <p className="text-xs font-bold mt-1.5" style={{ color: 'hsl(152,50%,38%)' }}>✓ {q.options[q.correctIndex]}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveQuestion(q.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} className="text-muted-foreground" />
                </div>
              </div>
            );
          })
        )}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}
