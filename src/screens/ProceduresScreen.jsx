import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, CheckCircle2, SlidersHorizontal, Check } from 'lucide-react';
import { procedures, procedureCategories } from '../data/procedures';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const categoryColors = {
  "Vital Signs": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Medication Administration": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Infection Control": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Wound Care": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "Patient Safety": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Emergency Basics": "bg-red-500/15 text-red-400 border-red-500/25",
};

function ProcedureDetail({ procedure, onBack }) {
  const { savedProcedures, toggleSaveProcedure } = useApp();
  const isSaved = savedProcedures.includes(procedure.id);
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (idx) => {
    setCompletedSteps(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <button
          onClick={() => toggleSaveProcedure(procedure.id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-secondary/50'}`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        {/* Title block */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium border mb-2 ${categoryColors[procedure.category]}`}>
            {procedure.category}
          </span>
          <h1 className="text-xl font-bold text-foreground">{procedure.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{procedure.overview}</p>
        </div>

        {/* Indications */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Indications</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{procedure.indications}</p>
        </div>

        {/* Equipment */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Equipment Required</p>
          <div className="space-y-1.5">
            {procedure.equipment.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps — interactive checklist */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Procedure Steps</p>
            <span className="text-[10px] text-muted-foreground">{completedSteps.length}/{procedure.steps.length} done</span>
          </div>
          <div className="space-y-2.5">
            {procedure.steps.map((step, i) => {
              const done = completedSteps.includes(i);
              return (
                <button key={i} onClick={() => toggleStep(i)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${done ? 'bg-primary/10 border-primary/25' : 'bg-secondary/30 border-border'}`}>
                  <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 transition-colors ${done ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  <p className={`text-xs leading-relaxed transition-colors ${done ? 'text-foreground/60 line-through' : 'text-foreground/90'}`}>{step}</p>
                </button>
              );
            })}
          </div>
          {completedSteps.length === procedure.steps.length && procedure.steps.length > 0 && (
            <div className="mt-3 text-center py-2 bg-emerald-400/10 rounded-xl border border-emerald-400/20">
              <span className="text-xs text-emerald-400 font-semibold">✓ All steps completed</span>
            </div>
          )}
        </div>

        {/* Precautions */}
        <div className="bg-amber-400/5 rounded-2xl p-4 border border-amber-400/15">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1.5">Precautions</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{procedure.precautions}</p>
        </div>

        {/* Documentation */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Documentation Notes</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{procedure.documentation}</p>
        </div>

        {/* References */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">References</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{procedure.references}</p>
        </div>

        <DisclaimerBanner />
        <div className="h-2" />
      </div>
    </div>
  );
}

export default function ProceduresScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { savedProcedures, toggleSaveProcedure } = useApp();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return procedures.filter(p => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  if (selected) return <ProcedureDetail procedure={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Procedures</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Step-by-step nursing procedure guides</p>
      </div>

      {/* Search + Filter */}
      <div className="px-4 mb-3 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 bg-secondary/70 rounded-2xl px-4 py-3 border border-border focus-within:border-primary/50 transition-colors">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search procedures..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            {search && <button onClick={() => setSearch('')}><X size={14} className="text-muted-foreground" /></button>}
          </div>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className={`flex items-center justify-center p-3 rounded-2xl border transition-colors flex-shrink-0 ${
              activeCategory !== 'All'
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-secondary/70 border-border text-muted-foreground'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-1.5 z-50 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            {procedureCategories.map(cat => {
              const catColor = {
                "All": "text-foreground",
                "Vital Signs": "text-blue-400",
                "Medication Administration": "text-purple-400",
                "Infection Control": "text-emerald-400",
                "Wound Care": "text-rose-400",
                "Patient Safety": "text-orange-400",
                "Emergency Basics": "text-red-400",
              }[cat] || "text-foreground";
              return (
                <button key={cat} onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm text-left hover:bg-secondary/60 transition-colors border-b border-border/50 last:border-b-0">
                  <span className={`${catColor} ${activeCategory === cat ? 'font-semibold' : 'font-medium'}`}>{cat}</span>
                  {activeCategory === cat && <Check size={14} className={catColor} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3 animate-fade-in">
        {filtered.map(proc => {
          const isSaved = savedProcedures.includes(proc.id);
          return (
            <div key={proc.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setSelected(proc)} className="w-full p-4 text-left hover:bg-secondary/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[proc.category]}`}>
                        {proc.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{proc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{proc.overview}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{proc.steps.length} steps</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }}
                      className={`p-1.5 rounded-lg transition-all ${isSaved ? 'text-primary' : 'text-muted-foreground/50'}`}>
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <ChevronRight size={16} className="text-muted-foreground/50" />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}