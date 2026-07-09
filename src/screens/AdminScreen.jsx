import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShieldAlert, Pill, ClipboardList, HelpCircle, Tags, Inbox } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import AdminEntityManager from '../components/admin/AdminEntityManager';
import AdminFeedbackList from '../components/admin/AdminFeedbackList';
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
  { key: 'overview', label: 'Overview', type: 'list' },
  { key: 'equipment', label: 'Equipment', type: 'list' },
  { key: 'steps', label: 'Steps', type: 'list' },
  { key: 'references', label: 'References', type: 'textarea' },
];

const categoryFields = [
  { key: 'label', label: 'Label', type: 'text', placeholder: 'e.g. Pharmacology', required: true },
  { key: 'categoryKey', label: 'Category key', type: 'text', placeholder: 'lowercase, e.g. pharmacology', required: true },
  { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: 'e.g. 💊' },
];

function validateQuiz(out) {
  if (!out.categoryKey) return 'Please choose a category.';
  if (!out.options || out.options.length !== 4) return 'Quiz must have exactly 4 options (one per line).';
  if (out.correctIndex == null || Number.isNaN(out.correctIndex) || out.correctIndex < 0 || out.correctIndex > 3) {
    return 'Correct option index must be between 0 and 3.';
  }
  return null;
}

export default function AdminScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('medicines');
  const isAdmin = user?.role === 'admin';

  const { data: categories = [] } = useQuery({
    queryKey: ['quizCategories', 'admin'],
    queryFn: () => base44.entities.QuizCategory.list('label', 100),
    enabled: isAdmin,
  });

  const quizFields = [
    {
      key: 'categoryKey',
      label: 'Category',
      type: 'select',
      required: true,
      options: categories.map(c => ({ value: c.categoryKey, label: `${c.icon || ''} ${c.label}`.trim() })),
    },
    { key: 'question', label: 'Question', type: 'textarea', required: true },
    { key: 'options', label: 'Options (exactly 4)', type: 'list', placeholder: 'Option A\nOption B\nOption C\nOption D' },
    { key: 'correctIndex', label: 'Correct option index (0–3)', type: 'number', placeholder: '0 = first option' },
    { key: 'explanation', label: 'Explanation', type: 'textarea' },
    { key: 'reference', label: 'Reference', type: 'text' },
    { key: 'setid', label: 'Set ID', type: 'number', placeholder: 'e.g. 1' },
  ];

  if (!isAdmin) {
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
              { key: 'categories', label: 'Categories', Icon: Tags, color: 'hsl(28,70%,45%)', bg: 'hsl(28,80%,93%)' },
              { key: 'feedback', label: 'Feedback', Icon: Inbox, color: 'hsl(330,55%,48%)', bg: 'hsl(330,60%,94%)' },
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

      <div className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pt-1 pb-4">
        {tab === 'medicines' && (
          <AdminEntityManager
            entityName="Medicine"
            queryKey="medicines"
            titleField="genericName"
            subtitleField="brandName"
            fields={medicineFields}
            sortField="legacyId"
            fetchLimit={5000}
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
            fetchLimit={5000}
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
            validate={validateQuiz}
            fetchLimit={5000}
          />
        )}
        {tab === 'categories' && (
          <AdminEntityManager
            entityName="QuizCategory"
            queryKey="quizCategories"
            titleField="label"
            subtitleField="categoryKey"
            fields={categoryFields}
            sortField="label"
            noLegacyId
          />
        )}
        {tab === 'feedback' && <AdminFeedbackList />}
        <div className="h-2" />
      </div>
    </div>
  );
}