import React, { useState } from 'react';
import { Pill, ClipboardList, Calculator, GraduationCap, ShieldAlert, ArrowRight } from 'lucide-react';

const SEEN_KEY = 'nursync_welcome_seen_v1';

const FEATURES = [
  { Icon: Pill, label: 'Medicine reference', color: 'hsl(265,55%,52%)', bg: 'hsl(265,55%,93%)' },
  { Icon: ClipboardList, label: 'Procedure guides', color: 'hsl(270,50%,48%)', bg: 'hsl(270,50%,93%)' },
  { Icon: Calculator, label: 'Clinical calculators', color: 'hsl(205,70%,42%)', bg: 'hsl(205,70%,93%)' },
  { Icon: GraduationCap, label: 'Exam-style quizzes', color: 'hsl(152,50%,38%)', bg: 'hsl(152,50%,93%)' },
];

export default function WelcomeOverlay() {
  const [open, setOpen] = useState(() => localStorage.getItem(SEEN_KEY) !== 'true');

  if (!open) return null;

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, 'true');
    setOpen(false);
  };

  return (
    <div className="absolute inset-0 z-[120] flex flex-col bg-background animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-10 pb-4 flex flex-col">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 mx-auto shadow-md"
          style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}>
          <GraduationCap size={32} color="white" />
        </div>

        <h1 id="welcome-title" className="text-2xl font-black text-center text-foreground">Welcome to NurSync</h1>
        <p className="text-sm text-center text-muted-foreground mt-1.5 leading-relaxed">
          Your study companion for nursing — medicines, procedures, calculators and quizzes in one place.
        </p>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          {FEATURES.map(({ Icon, label, color, bg }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-3.5 flex flex-col items-start gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>
                <Icon size={17} strokeWidth={2.2} />
              </div>
              <p className="text-xs font-bold text-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <div className="status-panel mt-5" data-tone="warning">
          <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            <span className="font-bold">Educational use only.</span>{' '}
            NurSync is not a substitute for current MOH guidance, hospital policy, or qualified clinical judgment. Always verify before clinical use.
          </span>
        </div>
      </div>

      <div className="px-6 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        <button
          onClick={dismiss}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', boxShadow: '0 4px 16px rgba(147,92,210,0.30)' }}
        >
          I understand — Get started <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}