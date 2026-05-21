import React, { useState } from 'react';
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

function CatPill({ category, isQuizCat = false }) {
  const c = isQuizCat
    ? (quizCatColors[category] || { bg: 'hsl(265,40%,92%)', text: 'hsl(265,40%,48%)' })
    : (catColors[category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' });
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
      style={{ background: c.bg, color: c.text, borderColor: c.border || 'transparent' }}>
      {isQuizCat ? quizCatLabel[category] : category}
    </span>
  );
}

function MedicineDetail({ medicine, onBack }) {
  const { savedMedicines, toggleSaveMedicine } = useApp();
  const isSaved = savedMedicines.includes(medicine.id);
  const sections = [
    { label: "Generic Name", value: medicine.genericName },
    { label: "Brand Name", value: medicine.brandName },
    { label: "Indications", value: medicine.indications },
    { label: "Adverse Reactions", value: medicine.adverseReactions },
    { label: "Contraindications", value: medicine.contraindications },
    { label: "Dosage", value: medicine.dosage },
  ];
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ color: 'hsl(265,40%,52%)', background: 'hsl(265,50%,94%)' }}>
          <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
        </button>
        <button onClick={() => toggleSaveMedicine(medicine.id)} className="p-2 rounded-2xl transition-all active:scale-90"
          style={isSaved ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,50%)' } : { background: 'hsl(270,25%,93%)', color: 'hsl(265,15%,58%)' }}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-3xl p-5 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,25%,90%)' }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-lg font-black" style={{ color: 'hsl(265,40%,22%)' }}>{medicine.genericName}</h1>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(265,15%,56%)' }}>{medicine.brandName}</p>
            </div>
            <CatPill category={medicine.category} />
          </div>
        </div>
        {medicine.id === 8 && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs"
            style={{ background: 'hsl(0,60%,96%)', border: '1px solid hsl(0,55%,85%)', color: 'hsl(0,55%,45%)' }}>
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span><span className="font-bold">Controlled Substance.</span> Strict documentation, prescriber authorisation, and storage protocols apply.</span>
          </div>
        )}
        {sections.map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(265,55%,54%)' }}>{label}</p>
            <p className="text-sm leading-relaxed font-medium" style={{ color: 'hsl(265,25%,28%)' }}>{value}</p>
          </div>
        ))}
        <DisclaimerBanner /><div className="h-2" />
      </div>
    </div>
  );
}

function ProcedureDetail({ procedure, onBack }) {
  const { savedProcedures, toggleSaveProcedure } = useApp();
  const isSaved = savedProcedures.includes(procedure.id);
  const [completedSteps, setCompletedSteps] = useState([]);
  const toggleStep = (idx) => setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ color: 'hsl(265,40%,52%)', background: 'hsl(265,50%,94%)' }}>
          <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
        </button>
        <button onClick={() => toggleSaveProcedure(procedure.id)} className="p-2 rounded-2xl transition-all active:scale-90"
          style={isSaved ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,50%)' } : { background: 'hsl(270,25%,93%)', color: 'hsl(265,15%,58%)' }}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-3xl p-5 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,25%,90%)' }}>
          <CatPill category={procedure.category} />
          <h1 className="text-lg font-black mt-2" style={{ color: 'hsl(265,40%,22%)' }}>{procedure.title}</h1>
          <p className="text-sm leading-relaxed mt-1 font-medium" style={{ color: 'hsl(265,15%,48%)' }}>{procedure.overview}</p>
        </div>
        <div className="rounded-2xl p-4 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,22%,91%)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: 'hsl(265,55%,54%)' }}>Procedure Steps</p>
          <div className="space-y-2">
            {procedure.steps.map((step, i) => {
              const done = completedSteps.includes(i);
              return (
                <button key={i} onClick={() => toggleStep(i)}
                  className="w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all active:scale-[0.98]"
                  style={done ? { background: 'hsl(265,50%,95%)', borderColor: 'hsl(265,40%,82%)' } : { background: 'hsl(270,25%,97%)', borderColor: 'hsl(270,20%,90%)' }}>
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5"
                    style={{ color: done ? 'hsl(265,55%,55%)' : 'hsl(265,15%,75%)' }} />
                  <p className="text-xs leading-relaxed font-medium"
                    style={{ color: done ? 'hsl(265,20%,60%)' : 'hsl(265,25%,28%)', textDecoration: done ? 'line-through' : 'none' }}>{step}</p>
                </button>
              );
            })}
          </div>
        </div>
        <DisclaimerBanner /><div className="h-2" />
      </div>
    </div>
  );
}

function QuizDetail({ question, onBack }) {
  const { savedQuizQuestions, toggleSaveQuestion } = useApp();
  const isSaved = savedQuizQuestions.includes(question.id);
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ color: 'hsl(265,40%,52%)', background: 'hsl(265,50%,94%)' }}>
          <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
        </button>
        <button onClick={() => toggleSaveQuestion(question.id)} className="p-2 rounded-2xl transition-all active:scale-90"
          style={isSaved ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,50%)' } : { background: 'hsl(270,25%,93%)', color: 'hsl(265,15%,58%)' }}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-3xl p-5 border card-shadow" style={{ background: 'white', borderColor: 'hsl(270,25%,90%)' }}>
          <CatPill category={question.category} isQuizCat />
          <p className="text-sm font-semibold leading-relaxed mt-3" style={{ color: 'hsl(265,30%,22%)' }}>{question.question}</p>
        </div>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = selected === i;
            let style = { background: 'white', borderColor: 'hsl(270,22%,88%)', color: 'hsl(265,25%,28%)' };
            if (selected !== null) {
              if (isCorrect) style = { background: 'hsl(152,50%,93%)', borderColor: 'hsl(152,45%,72%)', color: 'hsl(152,50%,32%)' };
              else if (isSelected) style = { background: 'hsl(0,55%,94%)', borderColor: 'hsl(0,48%,75%)', color: 'hsl(0,52%,45%)' };
            }
            return (
              <button key={i} onClick={() => setSelected(i)} disabled={selected !== null}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left text-sm font-medium transition-all active:scale-[0.98]"
                style={style}>
                <span className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] font-black"
                  style={{ borderColor: 'currentColor' }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="rounded-2xl p-4 border card-shadow animate-slide-up" style={{ background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'hsl(265,55%,54%)' }}>Explanation</p>
            <p className="text-sm leading-relaxed font-medium" style={{ color: 'hsl(265,25%,28%)' }}>{question.explanation}</p>
            {question.reference && <p className="text-[10px] mt-2 italic" style={{ color: 'hsl(265,15%,58%)' }}>{question.reference}</p>}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-14 gap-3">
    <div className="text-5xl">🐱</div>
    <div className="rounded-2xl px-5 py-3 text-center" style={{ background: 'hsl(265,45%,95%)', border: '1px solid hsl(265,35%,86%)' }}>
      <BookmarkX size={24} className="mx-auto mb-2" style={{ color: 'hsl(265,35%,68%)' }} />
      <p className="text-sm font-semibold" style={{ color: 'hsl(265,30%,48%)' }}>No saved {label} yet</p>
      <p className="text-xs mt-1" style={{ color: 'hsl(265,15%,62%)' }}>Tap the bookmark on any {label.slice(0, -1)}</p>
    </div>
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
      <div className="px-5 pt-4 pb-2 flex items-center gap-1">
        <img src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/9745fab6d_generated_image.png" alt="" className="w-20 h-20 object-contain flex-shrink-0" style={{ mixBlendMode: 'multiply', transform: 'scale(1.5)', transformOrigin: 'center' }} />
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'hsl(265,45%,22%)' }}>Saved</h1>
          <p className="text-xs font-medium" style={{ color: 'hsl(265,15%,56%)' }}>Your bookmarked items</p>
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
                : { background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
              <Icon size={14} className="mx-auto mb-1" style={{ color }} />
              <p className="text-lg font-black" style={{ color }}>{count}</p>
              <p className="text-[9px] font-semibold leading-tight" style={{ color: activeTab === tab ? color : 'hsl(265,15%,60%)' }}>{label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-2.5 animate-fade-in">
        {/* Medicines */}
        {activeTab === 'medicines' && (
          savedMeds.length === 0 ? <EmptyState label="medicines" /> :
          savedMeds.map(med => {
            const c = catColors[med.category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
            return (
              <button key={med.id} onClick={() => setSelectedMed(med)}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99]"
                style={{ background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-sm" style={{ color: 'hsl(265,35%,22%)' }}>{med.genericName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{med.category}</span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'hsl(265,15%,58%)' }}>{med.brandName}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveMedicine(med.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} style={{ color: 'hsl(265,20%,72%)' }} />
                </div>
              </button>
            );
          })
        )}

        {/* Procedures */}
        {activeTab === 'procedures' && (
          savedProcs.length === 0 ? <EmptyState label="procedures" /> :
          savedProcs.map(proc => {
            const c = catColors[proc.category] || { bg: 'hsl(270,30%,92%)', text: 'hsl(265,30%,48%)', border: 'hsl(270,25%,82%)' };
            return (
              <button key={proc.id} onClick={() => setSelectedProc(proc)}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99]"
                style={{ background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-sm" style={{ color: 'hsl(265,35%,22%)' }}>{proc.title}</h3>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{proc.category}</span>
                  <p className="text-xs font-medium mt-1" style={{ color: 'hsl(265,15%,60%)' }}>{proc.steps.length} steps</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveProcedure(proc.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} style={{ color: 'hsl(265,20%,72%)' }} />
                </div>
              </button>
            );
          })
        )}

        {/* Quiz */}
        {activeTab === 'quiz' && (
          savedQuestions.length === 0 ? <EmptyState label="quiz questions" /> :
          savedQuestions.map(q => {
            const c = quizCatColors[q.category] || { bg: 'hsl(265,40%,92%)', text: 'hsl(265,40%,48%)' };
            return (
              <button key={q.id} onClick={() => setSelectedQuiz(q)}
                className="w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-all card-shadow active:scale-[0.99]"
                style={{ background: 'white', borderColor: 'hsl(270,22%,90%)' }}>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5" style={{ background: c.bg, color: c.text }}>{quizCatLabel[q.category]}</span>
                  <p className="text-xs font-medium leading-relaxed line-clamp-3" style={{ color: 'hsl(265,25%,30%)' }}>{q.question}</p>
                  <p className="text-[10px] font-bold mt-1.5" style={{ color: 'hsl(152,50%,38%)' }}>✓ {q.options[q.correctIndex]}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleSaveQuestion(q.id); }} className="p-1.5" style={{ color: 'hsl(265,55%,52%)' }}>
                    <Bookmark size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={15} style={{ color: 'hsl(265,20%,72%)' }} />
                </div>
              </button>
            );
          })
        )}

        <DisclaimerBanner compact />
        <div className="h-2" />
      </div>
    </div>
  );
}