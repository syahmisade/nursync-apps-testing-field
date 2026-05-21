import React, { useState } from 'react';
import { AppProvider } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import MedicineScreen from '../screens/MedicineScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import ProceduresScreen from '../screens/ProceduresScreen';
import QuizScreen from '../screens/QuizScreen';
import SavedScreen from '../screens/SavedScreen';

export default function NurSync() {
  const [activeTab, setActiveTab] = useState('medicine');

  const screenMap = {
    medicine: MedicineScreen,
    calculators: CalculatorScreen,
    procedures: ProceduresScreen,
    quiz: QuizScreen,
    saved: SavedScreen,
  };

  const ActiveScreen = screenMap[activeTab];

  return (
    <AppProvider>
      {/* Soft lavender desktop background */}
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, hsl(270,35%,88%) 0%, hsl(290,30%,85%) 50%, hsl(260,40%,82%) 100%)' }}>

        {/* Subtle bg blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, hsl(265,60%,75%) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, hsl(300,50%,72%) 0%, transparent 70%)' }} />
        </div>

        {/* Phone frame */}
        <div
          className="relative rounded-[2.8rem] overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '430px',
            height: '100vh',
            maxHeight: '900px',
            minHeight: '600px',
            background: 'hsl(270, 40%, 97%)',
            boxShadow: '0 0 0 1px rgba(147,92,210,0.12), 0 32px 80px rgba(80,40,120,0.30), 0 8px 24px rgba(0,0,0,0.10)',
            zIndex: 1,
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1"
            style={{ background: 'hsl(270, 40%, 97%)' }}>
            <span className="text-[11px] font-bold text-foreground/50">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 items-end">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 rounded-sm" style={{ height: h, background: 'hsl(265,40%,60%)' }} />
                ))}
              </div>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L14 3.2C12.3 1.5 10 0.5 7.5 0.5C5 0.5 2.7 1.5 1 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="hsl(265,40%,60%)"/>
                <path d="M7.5 5.5C8.7 5.5 9.8 6 10.6 6.8L12 5.4C10.8 4.2 9.2 3.5 7.5 3.5C5.8 3.5 4.2 4.2 3 5.4L4.4 6.8C5.2 6 6.3 5.5 7.5 5.5Z" fill="hsl(265,40%,60%)"/>
                <circle cx="7.5" cy="9.5" r="1.5" fill="hsl(265,40%,60%)"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-sm border p-px" style={{ borderColor: 'hsl(265,40%,70%)' }}>
                  <div className="h-full w-4/5 rounded-[1px]" style={{ background: 'hsl(265,50%,58%)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b"
            style={{ background: 'hsl(270, 40%, 97%)', borderColor: 'hsl(270,25%,90%)' }}>
            <div className="flex items-center gap-2.5">
              {/* Logo pill */}
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}>
                <span className="text-[11px] font-black text-white">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight" style={{ color: 'hsl(265,50%,35%)' }}>NurSync</span>
                <span className="text-[9px] font-medium" style={{ color: 'hsl(265,30%,60%)' }}>Sync to better care</span>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
              style={{ color: 'hsl(265,55%,55%)', background: 'hsl(265,55%,94%)', borderColor: 'hsl(265,40%,82%)' }}>
              PROTOTYPE
            </span>
          </div>

          {/* Screen content */}
          <div
            className="overflow-y-auto scrollbar-hide"
            style={{ height: 'calc(100% - 160px)' }}
          >
            <ActiveScreen />
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0">
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}