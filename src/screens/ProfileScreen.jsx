import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, ShieldCheck, Trash2, UserRound } from 'lucide-react';

export default function ProfileScreen() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    localStorage.removeItem('nursync_saved_state');
    setDeleted(true);
    setConfirmOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 app-surface">
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,48%)' }}>
            <UserRound size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>Profile</h1>
            <p className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>Settings and account controls</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide main-scroll px-4 pb-6 space-y-3 animate-fade-in">
        <div className="rounded-2xl border p-4 card-shadow app-card">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(152,50%,38%)' }} />
            <div>
              <p className="text-sm font-black" style={{ color: 'hsl(var(--foreground))' }}>Local-only demo account</p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Saved items and quiz progress are kept on this device for now. When Supabase or another backend is added, connect the same button to your authenticated account deletion API.
              </p>
            </div>
          </div>
        </div>

        {deleted && (
          <div className="rounded-2xl border p-4"
            style={{ background: 'hsl(152,50%,94%)', borderColor: 'hsl(152,40%,78%)', color: 'hsl(152,50%,32%)' }}>
            <p className="text-sm font-bold">Local account data cleared.</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="w-full rounded-2xl border p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-all app-card"
          style={{ borderColor: 'hsl(0,55%,82%)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(0,60%,95%)', color: 'hsl(0,58%,48%)' }}>
            <Trash2 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black" style={{ color: 'hsl(0,58%,45%)' }}>Account Deletion</p>
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Clear local profile data and saved app state</p>
          </div>
          <ChevronRight size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: 'rgba(20, 16, 28, 0.48)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'hsl(0,60%,95%)', color: 'hsl(0,58%,48%)' }}>
              <AlertTriangle size={24} />
            </div>
            <h2 id="delete-account-title" className="text-lg font-black" style={{ color: 'hsl(var(--foreground))' }}>
              Delete account data?
            </h2>
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
              This clears local saved data on this device. It does not call a backend yet, so it is safe to wire into Supabase later.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="py-3 rounded-2xl text-sm font-black border"
                style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))', borderColor: 'hsl(var(--border))' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-3 rounded-2xl text-sm font-black"
                style={{ background: 'hsl(0,58%,52%)', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
