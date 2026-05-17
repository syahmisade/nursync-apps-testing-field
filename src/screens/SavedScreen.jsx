import React, { useState } from 'react';
import { Bookmark, Pill, ClipboardList, BookOpen, Clock, ChevronRight, BookmarkX } from 'lucide-react';
import { medicines } from '../data/medicines';
import { procedures } from '../data/procedures';
import { quizQuestions } from '../data/quiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const tabs = [
  { id: 'medicines', label: 'Medicines', Icon: Pill },
  { id: 'procedures', label: 'Procedures', Icon: ClipboardList },
  { id: 'quiz', label: 'Quiz', Icon: BookOpen },
  { id: 'recent', label: 'Recent', Icon: Clock },
];

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState('medicines');
  const { savedMedicines, savedProcedures, savedQuizQuestions, recentSearches, toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion } = useApp();

  const savedMeds = medicines.filter(m => savedMedicines.includes(m.id));
  const savedProcs = procedures.filter(p => savedProcedures.includes(p.id));
  const savedQuestions = quizQuestions.filter(q => savedQuizQuestions.includes(q.id));

  const catColors = {
    "Analgesic": "bg-blue-500/15 text-blue-400",
    "Antibiotic": "bg-emerald-500/15 text-emerald-400",
    "Antidiabetic": "bg-purple-500/15 text-purple-400",
    "Antihypertensive": "bg-rose-500/15 text-rose-400",
    "Antilipid": "bg-orange-500/15 text-orange-400",
    "Bronchodilator": "bg-cyan-500/15 text-cyan-400",
    "Antacid/PPI": "bg-yellow-500/15 text-yellow-400",
    "Opioid Analgesic": "bg-red-500/15 text-red-400",
    "Vital Signs": "bg-blue-500/15 text-blue-400",
    "Medication Administration": "bg-purple-500/15 text-purple-400",
    "Infection Control": "bg-emerald-500/15 text-emerald-400",
    "Wound Care": "bg-rose-500/15 text-rose-400",
    "Patient Safety": "bg-orange-500/15 text-orange-400",
    "Emergency Basics": "bg-red-500/15 text-red-400",
  };

  const quizCatColors = {
    "pharmacology": "bg-blue-500/15 text-blue-400",
    "fundamentals": "bg-emerald-500/15 text-emerald-400",
    "medsurg": "bg-purple-500/15 text-purple-400",
    "maternal": "bg-rose-500/15 text-rose-400",
    "infection": "bg-cyan-500/15 text-cyan-400",
    "calculations": "bg-orange-500/15 text-orange-400",
  };

  const quizCatLabel = {
    "pharmacology": "Pharmacology",
    "fundamentals": "Fundamentals",
    "medsurg": "Med-Surgical",
    "maternal": "Maternal & Child",
    "infection": "Infection Control",
    "calculations": "Calculations",
  };

  const EmptyState = ({ label }) => (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <BookmarkX size={36} className="text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">No saved {label} yet</p>
      <p className="text-xs text-muted-foreground/60">Tap the bookmark icon on any {label.slice(0, -1)}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your bookmarked items</p>
      </div>

      {/* Stats row */}
      <div className="px-4 mb-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Medicines', count: savedMeds.length, Icon: Pill, color: 'text-blue-400' },
            { label: 'Procedures', count: savedProcs.length, Icon: ClipboardList, color: 'text-purple-400' },
            { label: 'Quiz Qs', count: savedQuestions.length, Icon: BookOpen, color: 'text-emerald-400' },
            { label: 'Searches', count: recentSearches.length, Icon: Clock, color: 'text-orange-400' },
          ].map(({ label, count, Icon, color }) => (
            <div key={label} className="bg-card rounded-2xl p-2.5 border border-border text-center">
              <Icon size={15} className={`${color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${color}`}>{count}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-3">
        <div className="flex bg-secondary/50 rounded-2xl p-1 gap-1">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}>
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3 animate-fade-in">
        {/* Medicines */}
        {activeTab === 'medicines' && (
          savedMeds.length === 0 ? <EmptyState label="medicines" /> :
          savedMeds.map(med => (
            <div key={med.id} className="bg-card rounded-2xl border border-border p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-semibold text-sm text-foreground">{med.genericName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[med.category]}`}>{med.category}</span>
                </div>
                <p className="text-xs text-muted-foreground">{med.brandName}</p>
              </div>
              <button onClick={() => toggleSaveMedicine(med.id)} className="text-primary p-1.5">
                <Bookmark size={16} fill="currentColor" />
              </button>
            </div>
          ))
        )}

        {/* Procedures */}
        {activeTab === 'procedures' && (
          savedProcs.length === 0 ? <EmptyState label="procedures" /> :
          savedProcs.map(proc => (
            <div key={proc.id} className="bg-card rounded-2xl border border-border p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-semibold text-sm text-foreground">{proc.title}</h3>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[proc.category]}`}>{proc.category}</span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{proc.steps.length} steps</p>
              </div>
              <button onClick={() => toggleSaveProcedure(proc.id)} className="text-primary p-1.5">
                <Bookmark size={16} fill="currentColor" />
              </button>
            </div>
          ))
        )}

        {/* Quiz Questions */}
        {activeTab === 'quiz' && (
          savedQuestions.length === 0 ? <EmptyState label="quiz questions" /> :
          savedQuestions.map(q => (
            <div key={q.id} className="bg-card rounded-2xl border border-border p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${quizCatColors[q.category]}`}>
                  {quizCatLabel[q.category]}
                </span>
                <p className="text-xs text-foreground leading-relaxed line-clamp-3">{q.question}</p>
                <p className="text-[10px] text-emerald-400 mt-1.5">✓ {q.options[q.correctIndex]}</p>
              </div>
              <button onClick={() => toggleSaveQuestion(q.id)} className="text-primary p-1.5 flex-shrink-0">
                <Bookmark size={16} fill="currentColor" />
              </button>
            </div>
          ))
        )}

        {/* Recent Searches */}
        {activeTab === 'recent' && (
          recentSearches.length === 0 ? <EmptyState label="searches" /> :
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recentSearches.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 px-4 py-3 ${i < recentSearches.length - 1 ? 'border-b border-border' : ''}`}>
                <Clock size={14} className="text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-foreground">{s}</p>
              </div>
            ))}
          </div>
        )}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}