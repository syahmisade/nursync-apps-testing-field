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
      {/* Mobile frame wrapper */}
      <div className="min-h-screen bg-[hsl(220,30%,5%)] flex items-center justify-center p-4">
        {/* Phone frame */}
        <div
          className="relative bg-background rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{
            width: '100%',
            maxWidth: '430px',
            height: '100vh',
            maxHeight: '900px',
            minHeight: '600px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)'
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1" style={{ background: 'hsl(222, 47%, 8%)' }}>
            <span className="text-[11px] font-semibold text-foreground/60">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 items-end">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 rounded-sm bg-foreground/50" style={{ height: h }} />
                ))}
              </div>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L14 3.2C12.3 1.5 10 0.5 7.5 0.5C5 0.5 2.7 1.5 1 3.2L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill="currentColor" className="text-foreground/50"/>
                <path d="M7.5 5.5C8.7 5.5 9.8 6 10.6 6.8L12 5.4C10.8 4.2 9.2 3.5 7.5 3.5C5.8 3.5 4.2 4.2 3 5.4L4.4 6.8C5.2 6 6.3 5.5 7.5 5.5Z" fill="currentColor" className="text-foreground/50"/>
                <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" className="text-foreground/50"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-sm border border-foreground/40 p-px">
                  <div className="h-full w-4/5 bg-foreground/60 rounded-[1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* App name bar */}
          <div className="flex items-center justify-center py-2 border-b border-border/40" style={{ background: 'hsl(222, 47%, 8%)' }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-teal flex items-center justify-center">
                <span className="text-[10px] font-black text-white">N</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">NurSync</span>
              <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium border border-primary/20">PROTOTYPE</span>
            </div>
          </div>

          {/* Screen content */}
          <div
            className="overflow-y-auto scrollbar-hide"
            style={{ height: 'calc(100% - 158px)' }}
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