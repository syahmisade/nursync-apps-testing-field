import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search, X, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, AlertTriangle, Check, SlidersHorizontal, Clock, Pill } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMedicines } from '../hooks/useMedicines';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { SemanticPill, StatusPanel, buildCategoryTextColorMap, categoryTextColorFromMap, toneForCategory } from '../components/Semantic';
import PullToRefresh from '../components/PullToRefresh';
import { AnimatePresence, motion, slideTransition, detailVariants, listVariants } from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import EmptyContentState from '../components/EmptyContentState';

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

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function getMedicineSearchText(medicine) {
  return [
    medicine.genericName,
    medicine.brandName,
    medicine.glamourName,
    medicine.category,
  ].filter(hasText).join(' ').toLowerCase();
}

function getCategoryLabel(medicine) {
  return hasText(medicine.category) ? medicine.category.trim() : 'Uncategorized';
}

function buildCategoryCounts(items) {
  return items.reduce((counts, item) => {
    const category = getCategoryLabel(item);
    counts.All += 1;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, { All: 0 });
}

function getMedicineMetaRows(medicine) {
  return [
    {
      label: 'Brand',
      value: hasText(medicine.brandName) ? medicine.brandName : '-',
      muted: !hasText(medicine.brandName),
    },
    {
      label: 'Also known as',
      value: hasText(medicine.glamourName) ? medicine.glamourName : '-',
      muted: !hasText(medicine.glamourName),
    },
  ];
}

function MedicineCardMeta({ medicine }) {
  return (
    <div className="space-y-1">
      {getMedicineMetaRows(medicine).map((row, index) => (
        <p
          key={`${row.label || 'placeholder'}-${index}`}
          className={`text-xs leading-4 line-clamp-1 break-words ${row.muted ? 'font-medium text-muted-foreground/70' : 'font-medium text-muted-foreground'}`}
        >
          {row.label && <span className="font-bold text-primary">{row.label}: </span>}
          {row.value}
        </p>
      ))}
    </div>
  );
}

function MedicineMeta({ medicine, compact = false, reserveSpace = false }) {
  const items = [
    hasText(medicine.brandName) ? { label: 'Brand', value: medicine.brandName } : null,
    hasText(medicine.glamourName) ? { label: 'Also known as', value: medicine.glamourName } : null,
  ].filter(Boolean);

  if (items.length === 0) {
    if (!reserveSpace) return null;

    return (
      <div className={compact ? 'mt-2 min-h-[2rem] flex items-center' : 'mt-3 flex flex-col gap-1.5'}>
        <p className="text-xs font-medium text-muted-foreground">No brand/common name listed</p>
      </div>
    );
  }

  const rows = reserveSpace ? items.slice(0, 2) : items;

  return (
    <div className={compact ? 'mt-2 min-h-[2rem] space-y-0.5' : 'mt-3 flex flex-col gap-1.5'}>
      {rows.map(({ label, value }) => (
        <p key={label} className="text-xs font-medium text-muted-foreground line-clamp-1 break-words">
          <span className="font-bold text-primary">{label}:</span> {value}
        </p>
      ))}
    </div>
  );
}

// Driven by data fields rather than a hardcoded id, so it keeps working after
// the move to a backend where record ids will differ.
function isControlledSubstance(medicine) {
  return /controlled/i.test(medicine.prescriberCategory || '')
    || /controlled/i.test(medicine.nemlStatus || '');
}

function MedicineDetail({ medicine, onBack, categoryColorMap, isDark }) {
  const { savedMedicines, toggleSaveMedicine } = useApp();
  const isSaved = savedMedicines.includes(medicine.id);

  const sections = [
    { label: "Generic Name", value: medicine.genericName },
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
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 pt-3 pb-3 bg-background border-b border-border"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
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

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-6 space-y-3">
        {/* Title block */}
        <div className="rounded-3xl p-5 border card-shadow bg-card border-border">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-lg font-black text-foreground">{medicine.genericName}</h1>
            <CategoryPill category={medicine.category} colorMap={categoryColorMap} isDark={isDark} />
          </div>
          <MedicineMeta medicine={medicine} />
        </div>

        {isControlledSubstance(medicine) && (
          <StatusPanel tone="danger">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span><span className="font-bold">Controlled Substance.</span> Strict documentation, prescriber authorisation, and storage protocols apply.</span>
          </StatusPanel>
        )}

        {sections.filter(({ value }) => hasText(value)).map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 border card-shadow bg-card border-border">
            <p className="text-xs font-black uppercase tracking-widest mb-1.5 text-primary">{label}</p>
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
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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
  const { medicines, categories, isLoading, error } = useMedicines();
  const categoryColorMap = useMemo(() => buildCategoryTextColorMap(categories), [categories]);
  const categoryCounts = useMemo(() => buildCategoryCounts(medicines), [medicines]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory('All');
  }, [categories, activeCategory]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return medicines.filter(m => {
      const matchSearch = !q || getMedicineSearchText(m).includes(q);
      const matchCat = activeCategory === 'All' || getCategoryLabel(m) === activeCategory;
      return matchSearch && matchCat;
    });
  }, [medicines, search, activeCategory]);

  const handleSelect = (medicine) => {
    addRecentSearch(medicine.genericName);
    navigate(`/medicine/${medicine.id}`);
  };

  // Data is static today; this is the hook to swap in a real backend fetch.
  const handleRefresh = () => new Promise(res => setTimeout(res, 600));

  const selectedMedicine = id ? medicines.find(m => String(m.id) === id) : null;
  const handleBack = () => {
    if (location.state?.fromSaved) {
      navigate('/saved', { state: { activeTab: location.state.savedTab || 'medicines' } });
      return;
    }
    navigate('/medicine');
  };

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={Boolean(id)}>
        {id ? (
          <motion.div
            key="detail"
            className="absolute inset-0 overflow-hidden bg-background"
            variants={detailVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
          >
            {selectedMedicine
              ? <MedicineDetail medicine={selectedMedicine} onBack={handleBack} categoryColorMap={categoryColorMap} isDark={isDark} />
              : !isLoading && medicines[0]
                ? <MedicineDetail medicine={medicines[0]} onBack={() => navigate('/medicine', { replace: true })} categoryColorMap={categoryColorMap} isDark={isDark} />
                : <div className="flex items-center justify-center h-full"><div className="w-7 h-7 border-4 border-secondary border-t-primary rounded-full animate-spin" /></div>}
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
      {/* Sticky header + search */}
      <div className="flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/0d9983c47_Pic1.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ transform: 'scale(1.1)', transformOrigin: 'center' }} />
          <div className="">
            <h1 className="text-2xl font-black text-foreground">Medicine</h1>
            <p className="text-xs font-medium text-muted-foreground">Drug reference guide</p>
          </div>
        </div>

      {/* Search + Filter */}
      <div className="px-4 mb-3 relative" ref={dropdownRef}>
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
            <p className="text-[11px] font-black uppercase tracking-widest px-4 pt-3 pb-1 text-muted-foreground">Recent</p>
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
          <div className="absolute left-4 right-4 top-full mt-2 z-50 rounded-2xl overflow-hidden bg-card border border-border flex flex-col max-h-[55vh]"
            style={{ boxShadow: '0 8px 32px rgba(147,92,210,0.14)' }}>
            <p className="text-[11px] font-black uppercase tracking-widest px-4 pt-3 pb-1 text-muted-foreground flex-shrink-0">Filter by Category</p>
            <div className="overflow-y-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-left transition-colors border-t border-border hover:bg-muted"
                style={{ color: categoryTextColorFromMap(cat, categoryColorMap, isDark) }}>
                <span className="min-w-0 flex-1 flex items-center gap-2">
                  <span className={`min-w-0 truncate ${activeCategory === cat ? 'font-black' : ''}`}>{cat}</span>
                  <span className="min-w-7 rounded-full bg-secondary px-2 py-0.5 text-center text-[11px] font-black text-muted-foreground">
                    {categoryCounts[cat] || 0}
                  </span>
                </span>
                {activeCategory === cat && <Check size={14} className="ml-3 flex-shrink-0" style={{ color: categoryTextColorFromMap(cat, categoryColorMap, isDark) }} />}
              </button>
            ))}
            </div>
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
      <PullToRefresh scrollRef={scrollRef} onRefresh={handleRefresh} className="px-4 pt-2 pb-4 space-y-2.5">
        {isLoading && (
          <div className="text-center py-14">
            <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-semibold mt-3 text-muted-foreground">Loading medicines…</p>
          </div>
        )}
        {!isLoading && error && (
          <StatusPanel tone="danger" className="status-panel-block">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span>Could not load medicines. Please check your connection and try again.</span>
          </StatusPanel>
        )}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyContentState
            icon={Pill}
            title={medicines.length === 0 ? 'No medicines available' : 'No medicines found'}
            description={medicines.length === 0 ? 'Add medicine records in Content Manager or import a CSV.' : 'Try a different search term or category.'}
          />
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
                className="w-full min-h-[150px] p-4 text-left transition-all active:scale-[0.99] cursor-pointer hover:bg-muted">
                <div className="grid grid-cols-[1fr_auto] gap-4 h-full">
                  <div className="min-w-0 flex flex-col gap-2.5">
                    <div className="flex items-center overflow-hidden">
                      <CategoryPill category={getCategoryLabel(medicine)} colorMap={categoryColorMap} isDark={isDark} fallback={!hasText(medicine.category)} />
                    </div>
                    <div className="h-[36px] flex items-center">
                      <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2 break-words">{medicine.genericName}</h3>
                    </div>
                    <MedicineCardMeta medicine={medicine} />
                  </div>
                  <div className="w-12 flex items-start justify-end gap-1 pt-0.5">
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
      </PullToRefresh>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
