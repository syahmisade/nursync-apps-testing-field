import React, { useState } from 'react';
import {
  AlertTriangle, ChevronRight, ShieldCheck, Trash2,
  LogOut, UserRound, Info, BookOpen, Bell, Moon
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest px-1 pb-1.5"
      style={{ color: 'hsl(265,30%,62%)' }}>
      {children}
    </p>
  );
}

function SettingsRow({ icon: Icon, iconColor, iconBg, label, sublabel, onClick, chevron = true, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:scale-[0.99] transition-all"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, color: iconColor }}>
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight"
          style={{ color: danger ? 'hsl(0,58%,45%)' : 'hsl(var(--foreground))' }}>
          {label}
        </p>
        {sublabel && (
          <p className="text-[11px] mt-0.5 leading-tight" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {sublabel}
          </p>
        )}
      </div>
      {chevron && <ChevronRight size={15} style={{ color: 'hsl(var(--muted-foreground))' }} />}
    </button>
  );
}

function SettingsCard({ children }) {
  return (
    <div className="rounded-2xl border overflow-hidden card-shadow app-card divide-y"
      style={{ borderColor: 'hsl(var(--border))' }}>
      {children}
    </div>
  );
}

export default function ProfileScreen() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { user, logout } = useAuth();

  // ── Existing deletion logic — untouched ──
  const handleDelete = () => {
    localStorage.removeItem('nursync_saved_state');
    setDeleted(true);
    setConfirmOpen(false);
  };

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto scrollbar-hide main-scroll">

      {/* ── Hero / Avatar section ── */}
      <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-3 animate-fade-in"
        style={{ background: 'linear-gradient(160deg, hsl(270,50%,96%) 0%, hsl(265,40%,97%) 100%)' }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}>
          <UserRound size={34} color="white" strokeWidth={1.8} />
        </div>
        <div className="text-center">
          <p className="text-lg font-black leading-tight" style={{ color: 'hsl(265,50%,30%)' }}>
            {user?.full_name || 'Student Nurse'}
          </p>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(265,30%,58%)' }}>
            {user?.email || 'Local demo account'}
          </p>
        </div>
        {/* Role badge */}
        <div className="px-3 py-1 rounded-full text-[10px] font-black"
          style={{ background: 'hsl(265,60%,92%)', color: 'hsl(265,55%,42%)' }}>
          {user?.role === 'admin' ? '⚙️ Admin' : '🎓 Nursing Student'}
        </div>
      </div>

      {/* ── Settings body ── */}
      <div className="px-4 pb-8 space-y-4 animate-fade-in">

        {deleted && (
          <div className="rounded-2xl border p-3.5 flex items-center gap-2.5"
            style={{ background: 'hsl(152,50%,94%)', borderColor: 'hsl(152,40%,78%)', color: 'hsl(152,50%,32%)' }}>
            <ShieldCheck size={16} />
            <p className="text-sm font-bold">Local account data cleared.</p>
          </div>
        )}

        {/* App section */}
        <div>
          <SectionLabel>App</SectionLabel>
          <SettingsCard>
            <SettingsRow
              icon={Info}
              iconColor="hsl(265,55%,48%)"
              iconBg="hsl(265,55%,92%)"
              label="About NurSync"
              sublabel="Version 1.0 · Educational reference only"
              onClick={() => {}}
            />
            <SettingsRow
              icon={BookOpen}
              iconColor="hsl(152,50%,38%)"
              iconBg="hsl(152,50%,92%)"
              label="Disclaimer"
              sublabel="Not for clinical use. Always follow MOH guidance."
              onClick={() => {}}
            />
          </SettingsCard>
        </div>

        {/* Account section */}
        <div>
          <SectionLabel>Account</SectionLabel>
          <SettingsCard>
            <SettingsRow
              icon={ShieldCheck}
              iconColor="hsl(38,70%,45%)"
              iconBg="hsl(38,85%,92%)"
              label="Local demo mode"
              sublabel="Data is saved on this device only"
              chevron={false}
            />
            <SettingsRow
              icon={LogOut}
              iconColor="hsl(265,55%,48%)"
              iconBg="hsl(265,55%,92%)"
              label="Log Out"
              sublabel="Return to the login screen"
              onClick={() => logout()}
            />
            <SettingsRow
              icon={Trash2}
              iconColor="hsl(0,58%,48%)"
              iconBg="hsl(0,60%,95%)"
              label="Delete Account Data"
              sublabel="Clear all local saved data and app state"
              danger
              onClick={() => setConfirmOpen(true)}
            />
          </SettingsCard>
        </div>

      </div>

      </div>{/* end single scroll container */}

      {/* ── Confirm deletion modal — logic untouched ── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: 'rgba(20, 16, 28, 0.52)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
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