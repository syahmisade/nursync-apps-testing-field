import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Pill, ClipboardList, BookOpen, ChevronRight, BookmarkX, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { medicines } from '../data/medicines';
import { procedures } from '../data/procedures';
import { quizQuestions } from '../data/quiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const catColors = {
  "Analgesic":         { bg: 'hsl(220,65%,93%)', text: 'hsl(220,60%,46%)', border: 'hsl(220,50%,80%)' },
  "Antibiotic":        { bg: 'hsl(152,55%,93%)', text: 'hsl(152,55%,36%)', border: 'hsl(152,45%,78%)' },
  "Antidiabetic":      { bg: 'hsl(270,55%,93%)', text: 'hsl(270,50%,48%)', border: 'hsl(270,40%,80%)' },
  "Antihypertensive":  { bg: 'hsl(350,65%,93%)', text: 'hsl(350,60%,48%)', border: 'hsl(350,50%,80%)' },
  "Antilipid":         { bg: 'hsl(28,80%,93%)',  text: 'hsl(28,70%,45%)',  border: 'hsl(28,60%,78%)' },
  "Bronchodilator":    { bg: 'hsl(188,60%,92%)', text: 'hsl(188,55%,36%)', border: 'hsl(188,45%,76%)' },
  "Antacid/PPI":       { bg: 'hsl(45,80%,92%)',  text: 'hsl(38,65%,40%)',  border: 'hsl(40,60%,76%)' },
  "Opioid Analgesic":  { bg: 'hsl(0,60%,93%)',   text: 'hsl(0,58%,48%)',   border: 'hsl(0,48%,80%)' },
  "Anticoagulant":     { bg: 'hsl(330,60%,93%)', text: 'hsl(330,55%,48%)', border: 'hsl(330,45%,80%)' },
  "Corticosteroid":    { bg: 'hsl(188,55%,92%)', text: 'hsl(195,55%,38%)', border: 'hsl(188,45%,76%)' },
  "Vital Signs":               { bg: 'hsl(220,65%,93%)', text: 'hsl(220,60%,46%)', border: 'hsl(220,50%,80%)' },
  "Medication Administration": { bg: 'hsl(270,55%,93%)', text: 'hsl(270,50%,46%)', border: 'hsl(270,40%,80%)' },
  "Infection Control":         { bg: 'hsl(152,50%,92%)', text: 'hsl(152,50%,34%)', border: 'hsl(152,40%,76%)' },
  "Wound Care":                { bg: 'hsl(350,60%,93%)', text: 'hsl(350,55%,46%)', border: 'hsl(350,45%,80%)' },
  "Patient Safety":            { bg: 'hsl(28,75%,92%)',  text: 'hsl(28,65%,42%)',  border: 'hsl(28,55%,76%)' },
  "Emergency Basics":          { bg: 'hsl(0,58%,93%)',   text: 'hsl(0,52%,46%)',   border: 'hsl(0,45%,80%)' },
};

const quizCatColors = {
  "pharmacology": { bg: 'hsl(220,65%,93%)', text: 'hsl(220,60%,46%)' },
  "fundamentals": { bg: 'hsl(152,55%,93%)', text: 'hsl(152,55%,36%)' },
  "medsurg":      { bg: 'hsl(270,55%,93%)', text: 'hsl(270,50%,48%)' },
  "maternal":     { bg: 'hsl(350,65%,93%)', text: 'hsl(350,60%,48%)' },
  "infection":    { bg: 'hsl(188,60%,92%)', text: 'hsl(188,55%,36%)' },
  "calculations": { bg: 'hsl(28,80%,93%)',  text: 'hsl(28,70%,45%)' },
};

const quizCatLabel = {
  "pharmacology": "Pharmacology",
  "fundamentals": "Fundamentals",
  "medsurg":      "Med-Surgical",
  "maternal":     "Maternal & Child",
  "infection":    "Infection Control",
  "calculations": "Calculations",
};

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medicines');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const { savedMedicines, savedProcedures, savedQuizQuestions, toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion } = useApp();

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

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/ac180ff1e_Pic5.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ transform: 'scale(1.1)', transformOrigin: 'center' }} />
          <div className="animate-fade-in">
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
                <p className="text-[9px] font-semibold leading-tight" style={{ color: activeTab === tab ? color : 'hsl(var(--muted-foreground))' }}>{label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pb-4 space-y-2.5 animate-fade-in">
        {/* Medicines */}
        {activeTab === 'medicines' && (
          savedMeds.length === 0 ? <EmptyState label="medicines" /> :
          savedMeds.map(med => {
            const c = catColors[med.category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
            return (
              <div key={med.id} role="button" tabIndex={0}
                onClick={() => navigate(`/medicine/${med.id}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/medicine/${med.id}`);
                  }
                }}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99] cursor-pointer bg-card border-border hover:bg-muted">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-sm text-foreground">{med.genericName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{med.category}</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{med.brandName}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveMedicine(med.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} className="text-muted-foreground" />
                </div>
              </div>
            );
          })
        )}

        {/* Procedures */}
        {activeTab === 'procedures' && (
          savedProcs.length === 0 ? <EmptyState label="procedures" /> :
          savedProcs.map(proc => {
            const c = catColors[proc.category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
            return (
              <div key={proc.id} role="button" tabIndex={0}
                onClick={() => navigate(`/procedures/${proc.id}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/procedures/${proc.id}`);
                  }
                }}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99] cursor-pointer bg-card border-border hover:bg-muted">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-sm text-foreground">{proc.title}</h3>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{proc.category}</span>
                  <p className="text-xs font-medium mt-1 text-muted-foreground">{proc.steps.length} steps</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} className="text-muted-foreground" />
                </div>
              </div>
            );
          })
        )}

        {/* Quiz */}
        {activeTab === 'quiz' && (
          savedQuestions.length === 0 ? <EmptyState label="quiz questions" /> :
          savedQuestions.map(q => {
            const c = quizCatColors[q.category] || { bg: 'hsl(265,40%,92%)', text: 'hsl(265,40%,48%)' };
            return (
              <div key={q.id} role="button" tabIndex={0}
                onClick={() => navigate(`/quiz/${q.category}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/quiz/${q.category}`);
                  }
                }}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99] cursor-pointer bg-card border-border hover:bg-muted">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5" style={{ background: c.bg, color: c.text }}>{quizCatLabel[q.category]}</span>
                  <p className="text-xs font-medium leading-relaxed line-clamp-3 text-foreground">{q.question}</p>
                  <p className="text-[10px] font-bold mt-1.5" style={{ color: 'hsl(152,50%,38%)' }}>✓ {q.options[q.correctIndex]}</p>
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