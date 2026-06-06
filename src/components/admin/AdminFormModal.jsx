import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MobileSelect from '@/components/MobileSelect';

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

    const missing = fields.find(f => f.required && (out[f.key] === '' || out[f.key] == null || (Array.isArray(out[f.key]) && out[f.key].length === 0)));
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    const customError = validate ? validate(out) : null;
    if (customError) {
      setError(customError);
      return;
    }

    setError('');
    onSave(out);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center px-3 sm:items-center sm:px-5"
      style={{ background: 'rgba(20, 16, 28, 0.56)', backdropFilter: 'blur(10px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-md max-h-[92dvh] flex-col overflow-hidden rounded-t-[28px] border border-border bg-card shadow-2xl animate-pop-in sm:rounded-3xl">
        <div
          className="flex items-start justify-between gap-4 border-b border-border bg-card px-5 pb-4 pt-5"
          style={{ paddingTop: 'max(20px, env(safe-area-inset-top))' }}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">
              Content Manager
            </p>
            <h2 className="mt-1 truncate text-xl font-black leading-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-xs font-medium leading-snug text-muted-foreground">
              Fill in the fields below, then save your changes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition-all active:scale-95"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-hide">
          {fields.map(f => (
            <div key={f.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </label>
                {f.required && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary">
                    Required
                  </span>
                )}
              </div>
              {f.type === 'select' ? (
                <MobileSelect
                  value={draft[f.key]}
                  onChange={nextValue => setField(f.key, nextValue)}
                  placeholder="Select..."
                  label={f.label}
                  options={f.options || []}
                  buttonClassName="min-h-11 rounded-2xl border-border bg-background px-3.5"
                />
              ) : f.type === 'textarea' || f.type === 'list' ? (
                <textarea
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.type === 'list' ? 6 : 4}
                  className="w-full rounded-2xl border border-border bg-background px-3.5 py-3 text-sm font-medium leading-relaxed text-foreground outline-none resize-y placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              ) : (
                <Input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={draft[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="h-11 rounded-2xl border-border bg-background px-3.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              )}
              {f.type === 'list' && (
                <p className="rounded-xl bg-secondary/70 px-3 py-2 text-[11px] font-semibold leading-snug text-muted-foreground">
                  One item per line. Each line becomes a separate list item.
                </p>
              )}
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-destructive">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-snug">{error}</p>
            </div>
          )}
        </div>

        <div
          className="grid grid-cols-2 gap-2 border-t border-border bg-card px-5 pb-5 pt-3"
          style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border bg-secondary py-3.5 text-sm font-black text-secondary-foreground transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3.5 text-sm font-black text-primary-foreground shadow-sm transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <Check size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
