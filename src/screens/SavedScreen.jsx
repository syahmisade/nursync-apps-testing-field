import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Pill, ClipboardList, BookOpen, ChevronRight, BookmarkX, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { medicines } from '../data/medicines';
import { procedures } from '../data/procedures';
import { quizQuestions } from '../data/quiz';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

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

// ── Medicine Detail ──────────────────────────────────────────────────────────
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
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </button>
        <button onClick={() => toggleSaveMedicine(medicine.id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-secondary/50'}`}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">{medicine.genericName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{medicine.brandName}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${catColors[medicine.category] || 'bg-secondary text-secondary-foreground'}`}>
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

// ── Procedure Detail ─────────────────────────────────────────────────────────
const procCategoryColors = {
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

  const toggleStep = (idx) =>
    setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </button>
        <button onClick={() => toggleSaveProcedure(procedure.id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-secondary/50'}`}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium border mb-2 ${procCategoryColors[procedure.category]}`}>
            {procedure.category}
          </span>
          <h1 className="text-xl font-bold text-foreground">{procedure.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{procedure.overview}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Indications</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{procedure.indications}</p>
        </div>
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
        <div className="bg-amber-400/5 rounded-2xl p-4 border border-amber-400/15">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1.5">Precautions</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{procedure.precautions}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Documentation Notes</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{procedure.documentation}</p>
        </div>
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

// ── Quiz Detail ──────────────────────────────────────────────────────────────
function QuizDetail({ question, onBack }) {
  const { savedQuizQuestions, toggleSaveQuestion } = useApp();
  const isSaved = savedQuizQuestions.includes(question.id);
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </button>
        <button onClick={() => toggleSaveQuestion(question.id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-secondary/50'}`}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium mb-3 ${quizCatColors[question.category]}`}>
            {quizCatLabel[question.category]}
          </span>
          <p className="text-sm font-medium text-foreground leading-relaxed">{question.question}</p>
        </div>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = selected === i;
            let style = 'bg-card border-border text-foreground/80';
            if (selected !== null) {
              if (isCorrect) style = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';
              else if (isSelected) style = 'bg-red-500/15 border-red-500/40 text-red-400';
            }
            return (
              <button key={i} onClick={() => setSelected(i)} disabled={selected !== null}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left text-sm transition-all ${style}`}>
                <span className="w-5 h-5 rounded-full border border-current flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Explanation</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{question.explanation}</p>
            {question.reference && (
              <p className="text-[10px] text-muted-foreground mt-2">{question.reference}</p>
            )}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

// ── Main SavedScreen ─────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <BookmarkX size={36} className="text-muted-foreground/30" />
    <p className="text-sm text-muted-foreground">No saved {label} yet</p>
    <p className="text-xs text-muted-foreground/60">Tap the bookmark icon on any {label.slice(0, -1)}</p>
  </div>
);

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState('medicines');
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedProc, setSelectedProc] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { savedMedicines, savedProcedures, savedQuizQuestions, toggleSaveMedicine, toggleSaveProcedure, toggleSaveQuestion } = useApp();

  const savedMeds = medicines.filter(m => savedMedicines.includes(m.id));
  const savedProcs = procedures.filter(p => savedProcedures.includes(p.id));
  const savedQuestions = quizQuestions.filter(q => savedQuizQuestions.includes(q.id));

  if (selectedMed) return <MedicineDetail medicine={selectedMed} onBack={() => setSelectedMed(null)} />;
  if (selectedProc) return <ProcedureDetail procedure={selectedProc} onBack={() => setSelectedProc(null)} />;
  if (selectedQuiz) return <QuizDetail question={selectedQuiz} onBack={() => setSelectedQuiz(null)} />;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your bookmarked items</p>
      </div>

      {/* Stats row — doubles as tab selector */}
      <div className="px-4 mb-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Medicines', count: savedMeds.length, Icon: Pill, color: 'text-blue-400', tab: 'medicines' },
            { label: 'Procedures', count: savedProcs.length, Icon: ClipboardList, color: 'text-purple-400', tab: 'procedures' },
            { label: 'Quiz Qs', count: savedQuestions.length, Icon: BookOpen, color: 'text-emerald-400', tab: 'quiz' },
          ].map(({ label, count, Icon, color, tab }) => (
            <button key={label} onClick={() => setActiveTab(tab)} className={`rounded-2xl p-2.5 border text-center transition-all active:scale-95 ${
              activeTab === tab
                ? 'bg-card border-primary/60 ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/30'
            }`}>
              <Icon size={15} className={`${color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${color}`}>{count}</p>
              <p className={`text-[9px] leading-tight ${activeTab === tab ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3 animate-fade-in">
        {/* Medicines */}
        {activeTab === 'medicines' && (
          savedMeds.length === 0 ? <EmptyState label="medicines" /> :
          savedMeds.map(med => (
            <button key={med.id} onClick={() => setSelectedMed(med)}
              className="w-full bg-card rounded-2xl border border-border p-4 flex items-start gap-3 text-left hover:bg-secondary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-semibold text-sm text-foreground">{med.genericName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[med.category]}`}>{med.category}</span>
                </div>
                <p className="text-xs text-muted-foreground">{med.brandName}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); toggleSaveMedicine(med.id); }} className="text-primary p-1.5">
                  <Bookmark size={16} fill="currentColor" />
                </button>
                <ChevronRight size={16} className="text-muted-foreground/50" />
              </div>
            </button>
          ))
        )}

        {/* Procedures */}
        {activeTab === 'procedures' && (
          savedProcs.length === 0 ? <EmptyState label="procedures" /> :
          savedProcs.map(proc => (
            <button key={proc.id} onClick={() => setSelectedProc(proc)}
              className="w-full bg-card rounded-2xl border border-border p-4 flex items-start gap-3 text-left hover:bg-secondary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-semibold text-sm text-foreground">{proc.title}</h3>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${catColors[proc.category]}`}>{proc.category}</span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{proc.steps.length} steps</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }} className="text-primary p-1.5">
                  <Bookmark size={16} fill="currentColor" />
                </button>
                <ChevronRight size={16} className="text-muted-foreground/50" />
              </div>
            </button>
          ))
        )}

        {/* Quiz Questions */}
        {activeTab === 'quiz' && (
          savedQuestions.length === 0 ? <EmptyState label="quiz questions" /> :
          savedQuestions.map(q => (
            <button key={q.id} onClick={() => setSelectedQuiz(q)}
              className="w-full bg-card rounded-2xl border border-border p-4 flex items-start gap-3 text-left hover:bg-secondary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${quizCatColors[q.category]}`}>
                  {quizCatLabel[q.category]}
                </span>
                <p className="text-xs text-foreground leading-relaxed line-clamp-3">{q.question}</p>
                <p className="text-[10px] text-emerald-400 mt-1.5">✓ {q.options[q.correctIndex]}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); toggleSaveQuestion(q.id); }} className="text-primary p-1.5">
                  <Bookmark size={16} fill="currentColor" />
                </button>
                <ChevronRight size={16} className="text-muted-foreground/50" />
              </div>
            </button>
          ))
        )}


        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}