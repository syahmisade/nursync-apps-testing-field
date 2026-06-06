import React, { useState } from 'react';
import { X, Check, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Input } from '@/components/ui/input';

// Modal that submits a Feedback record to the backend.
// props:
//   type    - 'medicine_suggestion' | 'procedure_suggestion' | 'content_report'
//   title   - heading shown to the user
//   onClose - close handler
const PLACEHOLDERS = {
  medicine_suggestion: 'Which medicine should we add? Include generic/brand name and any references.',
  procedure_suggestion: 'Which procedure should we add? Describe it briefly.',
  content_report: 'What looks incorrect? Tell us the item and what needs fixing.',
};

export default function FeedbackModal({ type, title, onClose }) {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await base44.entities.Feedback.create({
        feedbackType: type,
        subject: subject.trim(),
        message: message.trim(),
        submitterEmail: user?.email || '',
        status: 'new',
      });
      setDone(true);
    } catch (err) {
      setError(err?.message || 'Could not send feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5" style={{ background: 'rgba(20, 16, 28, 0.52)' }} role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
        {done ? (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 size={30} />
            </div>
            <h2 className="text-lg font-black text-foreground">Thank you!</h2>
            <p className="text-sm leading-relaxed mt-1.5 text-muted-foreground">
              Your feedback was sent. We review every submission to improve NurSync.
            </p>
            <button onClick={onClose} className="w-full mt-5 py-3 rounded-2xl text-sm font-black bg-primary text-primary-foreground flex items-center justify-center gap-1.5">
              <Check size={16} /> Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-black text-foreground">{title}</h2>
              <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground flex-shrink-0" aria-label="Close">
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">Subject (optional)</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Short title" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">Details</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={PLACEHOLDERS[type]}
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none resize-y"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-snug">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button type="button" onClick={onClose} className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} disabled={saving} className="py-3 rounded-2xl text-sm font-black bg-primary text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-60">
                <Send size={15} /> {saving ? 'Sending…' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}