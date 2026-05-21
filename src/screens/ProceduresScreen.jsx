import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, CheckCircle2, SlidersHorizontal, Check } from 'lucide-react';
import { procedures, procedureCategories } from '../data/procedures';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const catStyles = {
  "Vital Signs":              { bg: 'hsl(220,65%,93%)', text: 'hsl(220,60%,46%)', border: 'hsl(220,50%,80%)' },
  "Medication Administration":{ bg: 'hsl(270,55%,93%)', text: 'hsl(270,50%,46%)', border: 'hsl(270,40%,80%)' },
  "Infection Control":        { bg: 'hsl(152,50%,92%)', text: 'hsl(152,50%,34%)', border: 'hsl(152,40%,76%)' },
  "Wound Care":               { bg: 'hsl(350,60%,93%)', text: 'hsl(350,55%,46%)', border: 'hsl(350,45%,80%)' },
  "Patient Safety":           { bg: 'hsl(28,75%,92%)',  text: 'hsl(28,65%,42%)',  border: 'hsl(28,55%,76%)' },
  "Emergency Basics":         { bg: 'hsl(0,58%,93%)',   text: 'hsl(0,52%,46%)',   border: 'hsl(0,45%,80%)' },
};

const catTextColor = {
  "All":                      'hsl(265,30%,40%)',
  "Vital Signs":              'hsl(220,60%,46%)',
  "Medication Administration":'hsl(270,50%,46%)',
  "Infection Control":        'hsl(152,50%,34%)',
  "Wound Care":               'hsl(350,55%,46%)',
  "Patient Safety":           'hsl(28,65%,42%)',
  "Emergency Basics":         'hsl(0,52%,46%)',
};

function ProcCategoryPill({ category }) {
  const s = catStyles[category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}>
      {category}
    </span>
  );
}

function ProcedureDetail({ procedure, onBack }) {
  const { savedProcedures, toggleSaveProcedure } = useApp();
  const isSaved = savedProcedures.includes(procedure.id);
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (idx) =>
    setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sticky top-0 z-30" style={{ background: 'hsl(270, 40%, 97%)' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors"
          style={{ color: 'hsl(265,40%,52%)', background: 'hsl(265,50%,94%)' }}>
          <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
        </button>
        <button onClick={() => toggleSaveProcedure(procedure.id)}
          className="p-2 rounded-2xl transition-all active:scale-90"
          style={isSaved
            ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,50%)' }
            : { background: 'hsl(270,25%,93%)', color: 'hsl(265,15%,58%)' }}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        {/* Title */}
        <div className="rounded-3xl p-5 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,25%,90%)' }}>
          <ProcCategoryPill category={procedure.category} />
          <h1 className="text-lg font-black mt-2" style={{ color: 'hsl(265,40%,22%)' }}>{procedure.title}</h1>
          <p className="text-sm leading-relaxed mt-1 font-medium" style={{ color: 'hsl(265,15%,48%)' }}>{procedure.overview}</p>
        </div>

        {/* Indications */}
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(265,55%,54%)' }}>Indications</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: 'hsl(265,25%,28%)' }}>{procedure.indications}</p>
        </div>

        {/* Equipment */}
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: 'hsl(265,55%,54%)' }}>Equipment Required</p>
          <div className="space-y-2">
            {procedure.equipment.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'hsl(265,55%,60%)' }} />
                <p className="text-sm font-medium" style={{ color: 'hsl(265,20%,32%)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'hsl(265,55%,54%)' }}>Procedure Steps</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'hsl(265,45%,93%)', color: 'hsl(265,45%,50%)' }}>
              {completedSteps.length}/{procedure.steps.length} done
            </span>
          </div>
          <div className="space-y-2">
            {procedure.steps.map((step, i) => {
              const done = completedSteps.includes(i);
              return (
                <button key={i} onClick={() => toggleStep(i)}
                  className="w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all active:scale-[0.98]"
                  style={done
                    ? { background: 'hsl(265,50%,95%)', borderColor: 'hsl(265,40%,82%)' }
                    : { background: 'hsl(270,25%,97%)', borderColor: 'hsl(270,20%,90%)' }}>
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 transition-colors"
                    style={{ color: done ? 'hsl(265,55%,55%)' : 'hsl(265,15%,75%)' }} />
                  <p className="text-xs leading-relaxed font-medium transition-colors"
                    style={{ color: done ? 'hsl(265,20%,60%)' : 'hsl(265,25%,28%)', textDecoration: done ? 'line-through' : 'none' }}>
                    {step}
                  </p>
                </button>
              );
            })}
          </div>
          {completedSteps.length === procedure.steps.length && procedure.steps.length > 0 && (
            <div className="mt-3 text-center py-2.5 rounded-2xl animate-pop-in"
              style={{ background: 'hsl(152,50%,94%)', border: '1px solid hsl(152,40%,78%)' }}>
              <span className="text-xs font-bold" style={{ color: 'hsl(152,50%,36%)' }}>🎉 All steps completed!</span>
            </div>
          )}
        </div>

        {/* Precautions */}
        <div className="rounded-2xl p-4 border" style={{ background: 'hsl(38,80%,96%)', borderColor: 'hsl(38,60%,82%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(38,65%,42%)' }}>Precautions</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: 'hsl(38,40%,32%)' }}>{procedure.precautions}</p>
        </div>

        {/* Documentation */}
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(265,55%,54%)' }}>Documentation Notes</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: 'hsl(265,25%,28%)' }}>{procedure.documentation}</p>
        </div>

        {/* References */}
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(265,55%,54%)' }}>References</p>
          <p className="text-xs leading-relaxed" style={{ color: 'hsl(265,15%,58%)' }}>{procedure.references}</p>
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
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
      <div className="px-5 pt-4 pb-2 flex items-center gap-1">
        <img src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/83c26fcba_generated_image.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ mixBlendMode: 'multiply', transform: 'scale(1.8)', transformOrigin: 'center' }} />
        <div className="animate-fade-in">
          <h1 className="text-2xl font-black" style={{ color: 'hsl(265,45%,22%)' }}>Procedures</h1>
          <p className="text-xs font-medium" style={{ color: 'hsl(265,15%,56%)' }}>Step-by-step nursing guides</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-4 mb-3 relative animate-fade-in" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 rounded-2xl px-4 py-3 border transition-colors"
            style={{ background: 'white', borderColor: 'hsl(270,22%,88%)', boxShadow: '0 1px 4px rgba(147,92,210,0.06)' }}>
            <Search size={15} style={{ color: 'hsl(265,30%,62%)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search procedures..."
              className="flex-1 bg-transparent text-sm outline-none font-medium" style={{ color: 'hsl(265,30%,25%)' }} />
            {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'hsl(265,20%,62%)' }} /></button>}
          </div>
          <button onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center justify-center p-3 rounded-2xl border transition-all active:scale-95"
            style={activeCategory !== 'All'
              ? { background: 'hsl(265,55%,92%)', borderColor: 'hsl(265,45%,75%)', color: 'hsl(265,55%,48%)' }
              : { background: 'white', borderColor: 'hsl(270,22%,88%)', color: 'hsl(265,20%,60%)', boxShadow: '0 1px 4px rgba(147,92,210,0.06)' }}>
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 z-50 rounded-2xl overflow-hidden"
            style={{ background: 'white', border: '1px solid hsl(270,22%,88%)', boxShadow: '0 8px 32px rgba(147,92,210,0.14)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest px-4 pt-3 pb-1" style={{ color: 'hsl(265,30%,62%)' }}>Filter by Category</p>
            {procedureCategories.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-left transition-colors border-t"
                style={{ borderColor: 'hsl(270,20%,93%)', color: catTextColor[cat] || 'hsl(265,30%,40%)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsl(270,30%,97%)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span className={activeCategory === cat ? 'font-black' : ''}>{cat}</span>
                {activeCategory === cat && <Check size={14} style={{ color: catTextColor[cat] }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-2.5 animate-fade-in">
        {filtered.length === 0 && (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">🐱</p>
            <p className="text-sm font-semibold" style={{ color: 'hsl(265,20%,58%)' }}>No procedures found</p>
          </div>
        )}
        {filtered.map(proc => {
          const isSaved = savedProcedures.includes(proc.id);
          return (
            <div key={proc.id} className="rounded-2xl border overflow-hidden card-shadow"
              style={{ background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
              <button onClick={() => setSelected(proc)} className="w-full p-4 text-left transition-all"
                style={{ background: 'white' }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsl(270,30%,98%)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <ProcCategoryPill category={proc.category} />
                    <h3 className="font-bold text-sm mt-1.5" style={{ color: 'hsl(265,35%,22%)' }}>{proc.title}</h3>
                    <p className="text-xs font-medium mt-1 line-clamp-2" style={{ color: 'hsl(265,15%,54%)' }}>{proc.overview}</p>
                    <p className="text-[10px] font-semibold mt-1" style={{ color: 'hsl(265,30%,62%)' }}>{proc.steps.length} steps</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }}
                      className="p-1.5 rounded-xl transition-all active:scale-90"
                      style={{ color: isSaved ? 'hsl(265,55%,52%)' : 'hsl(265,15%,68%)' }}>
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <ChevronRight size={15} style={{ color: 'hsl(265,20%,72%)' }} />
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