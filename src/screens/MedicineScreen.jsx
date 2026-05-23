import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, X, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, AlertTriangle, Check, SlidersHorizontal, Clock } from 'lucide-react';
import { medicines, categories } from '../data/medicines';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

// Category pills use fixed semantic colours (same light/dark) — readable on both themes
const categoryColors = {
  "Analgesic":         { bg: 'hsl(220,75%,94%)', text: 'hsl(220,65%,50%)', border: 'hsl(220,55%,82%)' },
  "Antibiotic":        { bg: 'hsl(152,55%,93%)', text: 'hsl(152,55%,36%)', border: 'hsl(152,45%,78%)' },
  "Antidiabetic":      { bg: 'hsl(270,55%,93%)', text: 'hsl(270,50%,48%)', border: 'hsl(270,40%,80%)' },
  "Antihypertensive":  { bg: 'hsl(350,65%,93%)', text: 'hsl(350,60%,48%)', border: 'hsl(350,50%,80%)' },
  "Antilipid":         { bg: 'hsl(28,80%,93%)',  text: 'hsl(28,70%,45%)',  border: 'hsl(28,60%,78%)' },
  "Bronchodilator":    { bg: 'hsl(188,60%,92%)', text: 'hsl(188,55%,36%)', border: 'hsl(188,45%,76%)' },
  "Antacid/PPI":       { bg: 'hsl(45,80%,92%)',  text: 'hsl(38,65%,40%)',  border: 'hsl(40,60%,76%)' },
  "Opioid Analgesic":  { bg: 'hsl(0,60%,93%)',   text: 'hsl(0,58%,48%)',   border: 'hsl(0,48%,80%)' },
  "Anticoagulant":     { bg: 'hsl(330,60%,93%)', text: 'hsl(330,55%,48%)', border: 'hsl(330,45%,80%)' },
  "Corticosteroid":    { bg: 'hsl(188,55%,92%)', text: 'hsl(195,55%,38%)', border: 'hsl(188,45%,76%)' },
};

const catTextColor = {
  "All":              'hsl(265,30%,40%)',
  "Analgesic":        'hsl(220,65%,50%)',
  "Antibiotic":       'hsl(152,55%,36%)',
  "Antidiabetic":     'hsl(270,50%,48%)',
  "Antihypertensive": 'hsl(350,60%,48%)',
  "Antilipid":        'hsl(28,70%,45%)',
  "Bronchodilator":   'hsl(188,55%,36%)',
  "Antacid/PPI":      'hsl(38,65%,40%)',
  "Opioid Analgesic": 'hsl(0,58%,48%)',
  "Anticoagulant":    'hsl(330,55%,48%)',
  "Corticosteroid":   'hsl(195,55%,38%)',
};

function CategoryPill({ category }) {
  const c = categoryColors[category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {category}
    </span>
  );
}

function MedicineDetail({ medicine, onBack }) {
  const { savedMedicines, toggleSaveMedicine } = useApp();
  const isSaved = savedMedicines.includes(medicine.id);

  const sections = [
    { label: "Generic Name", value: medicine.genericName },
    { label: "Brand Name", value: medicine.brandName },
    { label: "Common / Glamour Name", value: medicine.glamourName },
    { label: "Indications", value: medicine.indications },
    { label: "Adverse Reactions", value: medicine.adverseReactions },
    { label: "Contraindications", value: medicine.contraindications },
    { label: "Drug Interactions", value: medicine.interactions },
    { label: "Precautions", value: medicine.precautions },
    { label: "Dosage", value: medicine.dosage },
    { label: "Prescriber Category", value: medicine.prescriberCategory },
    { label: "Prescribing Restrictions", value: medicine.prescribingRestrictions },
    { label: "NEML Status", value: medicine.nemlStatus },
    { label: "References", value: medicine.references },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-3 bg-background border-b border-border">
        <button onClick={onBack} className="flex items-center gap-1.5 transition-colors rounded-xl px-3 py-1.5 bg-secondary text-primary">
          <ArrowLeft size={15} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <button onClick={() => toggleSaveMedicine(medicine.id)}
          className="p-2 rounded-2xl transition-all active:scale-90"
          style={isSaved
            ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,50%)' }
            : { background: 'hsl(270,25%,93%)', color: 'hsl(265,15%,58%)' }}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        {/* Title block */}
        <div className="rounded-3xl p-5 border card-shadow bg-card border-border">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-lg font-black text-foreground">{medicine.genericName}</h1>
              <p className="text-xs font-medium mt-0.5 text-muted-foreground">{medicine.brandName}</p>
            </div>
            <CategoryPill category={medicine.category} />
          </div>
          {medicine.glamourName && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border">
              <span className="text-[10px] font-medium text-muted-foreground">Also known as:</span>
              <span className="text-[10px] font-bold text-primary">{medicine.glamourName}</span>
            </div>
          )}
        </div>

        {medicine.id === 8 && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs border"
            style={{ background: 'hsl(0,60%,96%)', borderColor: 'hsl(0,55%,85%)', color: 'hsl(0,55%,45%)' }}>
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span><span className="font-bold">Controlled Substance.</span> Strict documentation, prescriber authorisation, and storage protocols apply.</span>
          </div>
        )}

        {sections.filter(({ label }) => !['Generic Name', 'Brand Name', 'Common / Glamour Name'].includes(label)).map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 border card-shadow bg-card border-border">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-primary">{label}</p>
            <p className="text-sm leading-relaxed font-medium text-foreground">{value}</p>
          </div>
        ))}

        <DisclaimerBanner />
        <div className="h-2" />
      </div>
    </div>
  );
}

export default function MedicineScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const { savedMedicines, toggleSaveMedicine, addRecentSearch, recentSearches } = useApp();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return medicines.filter(m => {
      const matchSearch = !q || m.genericName.toLowerCase().includes(q) || m.brandName.toLowerCase().includes(q) || m.glamourName.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || m.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleSelect = (medicine) => {
    addRecentSearch(medicine.genericName);
    navigate(`/medicine/${medicine.id}`);
  };

  const selectedMedicine = id ? medicines.find(m => String(m.id) === id) : null;
  if (id) {
    return selectedMedicine
      ? <MedicineDetail medicine={selectedMedicine} onBack={() => navigate(-1)} />
      : <MedicineDetail medicine={medicines[0]} onBack={() => navigate('/medicine', { replace: true })} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header + search */}
      <div className="flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-1">
          <img src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/f1fd0031d_generated_image.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ mixBlendMode: 'multiply', transform: 'scale(1.5)', transformOrigin: 'center' }} />
          <div className="animate-fade-in">
            <h1 className="text-2xl font-black text-foreground">Medicine</h1>
            <p className="text-xs font-medium text-muted-foreground">Drug reference guide</p>
          </div>
        </div>

      {/* Search + Filter */}
      <div className="px-4 mb-3 relative animate-fade-in" ref={dropdownRef}>
        <div className="flex items-center gap-2" ref={searchRef}>
          <div className="flex-1 flex items-center gap-2.5 rounded-2xl px-4 py-3 border transition-colors relative bg-card border-border"
            style={{
              borderColor: searchFocused ? 'hsl(265,50%,68%)' : undefined,
              boxShadow: searchFocused ? '0 0 0 3px hsl(265,55%,92%)' : '0 1px 4px rgba(147,92,210,0.06)'
            }}>
            <Search size={15} className="text-muted-foreground flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => { setSearchFocused(true); setDropdownOpen(false); }}
              placeholder="Search medicines..."
              className="flex-1 bg-transparent text-sm outline-none font-medium text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => { setDropdownOpen(o => !o); setSearchFocused(false); }}
            className="flex items-center justify-center p-3 rounded-2xl border transition-all active:scale-95"
            style={activeCategory !== 'All'
              ? { background: 'hsl(265,55%,92%)', borderColor: 'hsl(265,45%,75%)', color: 'hsl(265,55%,48%)' }
              : undefined}
            {...(activeCategory === 'All' ? { className: "flex items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 bg-card border-border text-muted-foreground" } : {})}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Recent searches */}
        {searchFocused && !search && recentSearches.length > 0 && (
          <div className="absolute left-4 right-16 top-full mt-2 z-50 rounded-2xl overflow-hidden bg-card border border-border"
            style={{ boxShadow: '0 8px 32px rgba(147,92,210,0.14)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest px-4 pt-3 pb-1 text-muted-foreground">Recent</p>
            {recentSearches.slice(0, 5).map(s => (
              <button key={s}
                onMouseDown={e => { e.preventDefault(); setSearch(s); setSearchFocused(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors border-t border-border hover:bg-muted">
                <Clock size={12} className="text-muted-foreground" />
                <span className="font-medium text-foreground">{s}</span>
              </button>
            ))}
          </div>
        )}

        {/* Category dropdown */}
        {dropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 z-50 rounded-2xl overflow-hidden bg-card border border-border"
            style={{ boxShadow: '0 8px 32px rgba(147,92,210,0.14)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest px-4 pt-3 pb-1 text-muted-foreground">Filter by Category</p>
            {categories.map(cat => (
              <button key={cat}
                onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-left transition-colors border-t border-border hover:bg-muted"
                style={{ color: catTextColor[cat] || 'hsl(265,30%,40%)' }}>
                <span className={activeCategory === cat ? 'font-black' : ''}>{cat}</span>
                {activeCategory === cat && <Check size={14} style={{ color: catTextColor[cat] }} />}
              </button>
            ))}
          </div>
        )}
      </div>
        {/* Scroll shadow */}
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{
            background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)',
            opacity: isScrolled ? 1 : 0,
          }} />
      </div>{/* end sticky wrapper */}

      {/* Medicine list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-2.5 animate-fade-in">
        {filtered.length === 0 && (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">🐱</p>
            <p className="text-sm font-semibold text-muted-foreground">No medicines found</p>
            <p className="text-xs mt-1 text-muted-foreground">Try a different search term</p>
          </div>
        )}
        {filtered.map(medicine => {
          const isSaved = savedMedicines.includes(medicine.id);
          return (
            <div key={medicine.id} className="rounded-2xl border overflow-hidden card-shadow bg-card border-border">
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(medicine)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(medicine);
                  }
                }}
                className="w-full p-4 text-left transition-all active:scale-[0.99] cursor-pointer hover:bg-muted">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground">{medicine.genericName}</h3>
                      <CategoryPill category={medicine.category} />
                    </div>
                    <p className="text-xs font-medium mt-0.5 text-muted-foreground">{medicine.brandName}</p>
                    {medicine.glamourName && (
                      <p className="text-xs mt-0.5 font-medium text-primary">Also: {medicine.glamourName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); toggleSaveMedicine(medicine.id); }}
                      className="p-1.5 rounded-xl transition-all active:scale-90"
                      style={{ color: isSaved ? 'hsl(265,55%,52%)' : 'hsl(265,15%,68%)' }}>
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <ChevronRight size={15} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}