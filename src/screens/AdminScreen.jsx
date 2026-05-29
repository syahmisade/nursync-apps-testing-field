import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Pill, ClipboardList, HelpCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AdminEntityManager from '../components/admin/AdminEntityManager';
import { StatusPanel } from '../components/Semantic';

const medicineFields = [
  { key: 'genericName', label: 'Generic name', type: 'text', placeholder: 'e.g. Paracetamol' },
  { key: 'brandName', label: 'Brand name', type: 'text', placeholder: 'e.g. Panadol, Tylenol' },
  { key: 'glamourName', label: 'Common name', type: 'text', placeholder: 'e.g. PCM' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Analgesic' },
  { key: 'indications', label: 'Indications', type: 'textarea' },
  { key: 'dosage', label: 'Dosage', type: 'textarea' },
  { key: 'adverseReactions', label: 'Adverse reactions', type: 'textarea' },
  { key: 'contraindications', label: 'Contraindications', type: 'textarea' },
  { key: 'interactions', label: 'Interactions', type: 'textarea' },
  { key: 'precautions', label: 'Precautions', type: 'textarea' },
  { key: 'prescriberCategory', label: 'Prescriber category', type: 'text' },
  { key: 'prescribingRestrictions', label: 'Prescribing restrictions', type: 'textarea' },
  { key: 'nemlStatus', label: 'NEML status', type: 'text' },
  { key: 'references', label: 'References', type: 'textarea' },
];

const procedureFields = [
  { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. IV Cannulation' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Vital Signs' },
  { key: 'overview', label: 'Overview', type: 'textarea' },
  { key: 'indications', label: 'Indications', type: 'textarea' },
  { key: 'equipment', label: 'Equipment', type: 'list' },
  { key: 'steps', label: 'Steps', type: 'list' },
  { key: 'precautions', label: 'Precautions', type: 'textarea' },
  { key: 'documentation', label: 'Documentation', type: 'textarea' },
  { key: 'references', label: 'References', type: 'textarea' },
];

const quizFields = [
  { key: 'categoryKey', label: 'Category key', type: 'text', placeholder: 'e.g. pharmacology, infection' },
  { key: 'question', label: 'Question', type: 'textarea' },
  { key: 'options', label: 'Options (4)', type: 'list', placeholder: 'Option A\nOption B\nOption C\nOption D' },
  { key: 'correctIndex', label: 'Correct option index (0–3)', type: 'number', placeholder: '0 = first option' },
  { key: 'explanation', label: 'Explanation', type: 'textarea' },
  { key: 'reference', label: 'Reference', type: 'text' },
];

export default function AdminScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('medicines');

  if (user && user.role !== 'admin') {
    return (
      <div className="p-5">
        <StatusPanel tone="danger">
          <ShieldAlert size={16} />
          <p className="text-sm font-bold">Admin access only. You do not have permission to manage content.</p>
        </StatusPanel>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="p-2 rounded-2xl bg-secondary text-primary active:scale-95" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Content Manager</h1>
            <p className="text-xs font-medium text-muted-foreground">Add, edit & remove app content</p>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'medicines', label: 'Medicines', Icon: Pill, color: 'hsl(220,60%,46%)', bg: 'hsl(220,60%,93%)' },
              { key: 'procedures', label: 'Procedures', Icon: ClipboardList, color: 'hsl(270,50%,48%)', bg: 'hsl(270,50%,93%)' },
              { key: 'quiz', label: 'Quiz', Icon: HelpCircle, color: 'hsl(152,50%,38%)', bg: 'hsl(152,50%,93%)' },
            ].map(({ key, label, Icon, color, bg }) => (
              <button key={key} onClick={() => setTab(key)}
                className="rounded-2xl p-2.5 border flex items-center justify-center gap-1.5 transition-all active:scale-95"
                style={tab === key ? { background: bg, borderColor: color + '55' } : { background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <Icon size={15} style={{ color }} />
                <span className="text-sm font-bold" style={{ color: tab === key ? color : 'hsl(var(--muted-foreground))' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pt-1 pb-4 animate-fade-in">
        {tab === 'medicines' && (
          <AdminEntityManager
            entityName="Medicine"
            queryKey="medicines"
            titleField="genericName"
            subtitleField="brandName"
            fields={medicineFields}
            sortField="legacyId"
          />
        )}
        {tab === 'procedures' && (
          <AdminEntityManager
            entityName="Procedure"
            queryKey="procedures"
            titleField="title"
            subtitleField="category"
            fields={procedureFields}
            sortField="legacyId"
          />
        )}
        {tab === 'quiz' && (
          <AdminEntityManager
            entityName="QuizQuestion"
            queryKey="quiz"
            titleField="question"
            subtitleField="categoryKey"
            fields={quizFields}
            sortField="legacyId"
          />
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}