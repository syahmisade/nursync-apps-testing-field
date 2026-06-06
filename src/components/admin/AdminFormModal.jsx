import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Generic add/edit modal driven by a `fields` config.
// fields: [{ key, label, type: 'text'|'textarea'|'number'|'list'|'select', placeholder, options, required }]
// `options` (for select): [{ value, label }]
// `validate(out)` (optional prop): returns an error string or null.
export default function AdminFormModal({ title, fields, initial, onSave, onClose, saving, validate }) {
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(() => {
    const base = {};
    fields.forEach(f => {
      const v = initial?.[f.key];
      if (f.type === 'list') base[f.key] = Array.isArray(v) ? v.join('\n') : '';
      else base[f.key] = v ?? '';
    });
    return base;
  });

  const setField = (key, value) => setDraft(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const out = {};
    fields.forEach(f => {
      const raw = draft[f.key];
      if (f.type === 'list') {
        out[f.key] = String(raw).split('\n').map(s => s.trim()).filter(Boolean);
      } else if (f.type === 'number') {
        out[f.key] = raw === '' ? null : Number(raw);
      } else {
        out[f.key] = typeof raw === 'string' ? raw.trim() : raw;
      }
    });

    // Required-field check
    const missing = fields.find(f => f.required && (out[f.key] === '' || out[f.key] == null || (Array.isArray(out[f.key]) && out[f.key].length === 0)));
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    // Custom validation
    const customError = validate ? validate(out) : null;
    if (customError) {
      setError(customError);
      return;
    }
    setError('');
    onSave(out);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      style={{ background: 'rgba(20, 16, 28, 0.52)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in max-h-[88vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-start justify-between gap-3 sticky top-0 bg-card pb-2">
          <h2 className="text-lg font-black text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground flex-shrink-0"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-3 mt-3">
          {fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                {f.label}
              </label>
              {f.type === 'select' ? (
                <select
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground outline-none"
                >
                  <option value="">Select…</option>
                  {(f.options || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' || f.type === 'list' ? (
                <textarea
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.type === 'list' ? 5 : 3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none resize-y"
                />
              ) : (
                <Input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="rounded-xl"
                />
              )}
              {f.type === 'list' && (
                <p className="text-[11px] text-muted-foreground">One item per line.</p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-snug">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="py-3 rounded-2xl text-sm font-black bg-primary text-primary-foreground flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Check size={16} />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}