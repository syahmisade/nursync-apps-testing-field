import React, { useState, useMemo } from 'react';
import { Search, X, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { medicines, categories } from '../data/medicines';
import { useApp } from '../context/AppContext';
import CategoryChip from '../components/MedicineCategoryChip';
import DisclaimerBanner from '../components/DisclaimerBanner';

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

  const categoryColors = {
    "Analgesic": "bg-blue-500/15 text-blue-400",
    "Antibiotic": "bg-emerald-500/15 text-emerald-400",
    "Antidiabetic": "bg-purple-500/15 text-purple-400",
    "Antihypertensive": "bg-rose-500/15 text-rose-400",
    "Antilipid": "bg-orange-500/15 text-orange-400",
    "Bronchodilator": "bg-cyan-500/15 text-cyan-400",
    "Antacid/PPI": "bg-yellow-500/15 text-yellow-400",
    "Opioid Analgesic": "bg-red-500/15 text-red-400",
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <button
          onClick={() => toggleSaveMedicine(medicine.id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-secondary/50'}`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        {/* Title block */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">{medicine.genericName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{medicine.brandName}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[medicine.category] || 'bg-secondary text-secondary-foreground'}`}>
              {medicine.category}
            </span>
          </div>
          {medicine.glamourName && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/60 rounded-lg">
              <span className="text-xs text-muted-foreground">Also known as:</span>
              <span className="text-xs font-medium text-foreground">{medicine.glamourName}</span>
            </div>
          )}
        </div>

        {medicine.id === 8 && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs bg-red-500/10 border border-red-500/25 text-red-400">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span><span className="font-semibold">Controlled Substance.</span> Strict documentation, prescriber authorisation, and storage protocols apply.</span>
          </div>
        )}

        {/* Info sections */}
        {sections.map(({ label, value }) => (
          <div key={label} className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">{label}</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{value}</p>
          </div>
        ))}

        <DisclaimerBanner />
        <div className="h-2" />
      </div>
    </div>
  );
}

export default function MedicineScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { savedMedicines, toggleSaveMedicine, addRecentSearch, recentSearches } = useApp();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return medicines.filter(m => {
      const matchSearch = !q ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.glamourName.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || m.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleSelect = (medicine) => {
    if (search) addRecentSearch(medicine.genericName);
    setSelectedMedicine(medicine);
  };

  if (selectedMedicine) {
    return <MedicineDetail medicine={selectedMedicine} onBack={() => setSelectedMedicine(null)} />;
  }

  const categoryColors = {
    "Analgesic": "bg-blue-500/15 text-blue-400",
    "Antibiotic": "bg-emerald-500/15 text-emerald-400",
    "Antidiabetic": "bg-purple-500/15 text-purple-400",
    "Antihypertensive": "bg-rose-500/15 text-rose-400",
    "Antilipid": "bg-orange-500/15 text-orange-400",
    "Bronchodilator": "bg-cyan-500/15 text-cyan-400",
    "Antacid/PPI": "bg-yellow-500/15 text-yellow-400",
    "Opioid Analgesic": "bg-red-500/15 text-red-400",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Medicine</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Quick drug reference for nursing students</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2.5 bg-secondary/70 rounded-2xl px-4 py-3 border border-border focus-within:border-primary/50 transition-colors">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Generic name, brand, or common name..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Recent searches */}
      {!search && recentSearches.length > 0 && (
        <div className="px-4 mb-3">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Recent searches</p>
          <div className="flex gap-2 flex-wrap">
            {recentSearches.slice(0, 5).map(s => (
              <button
                key={s}
                onClick={() => setSearch(s)}
                className="px-3 py-1.5 bg-secondary/60 rounded-full text-xs text-muted-foreground hover:text-foreground border border-border transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Medicine list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No medicines found.</div>
        )}
        {filtered.map(medicine => {
          const isSaved = savedMedicines.includes(medicine.id);
          return (
            <div key={medicine.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => handleSelect(medicine)}
                className="w-full p-4 text-left hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground text-sm">{medicine.genericName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[medicine.category] || 'bg-secondary text-secondary-foreground'}`}>
                        {medicine.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{medicine.brandName}</p>
                    <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{medicine.indications}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); toggleSaveMedicine(medicine.id); }}
                      className={`p-1.5 rounded-lg transition-all ${isSaved ? 'text-primary' : 'text-muted-foreground/50'}`}
                    >
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