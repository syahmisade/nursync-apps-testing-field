import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { AppProvider } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import MedicineScreen from '../screens/MedicineScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import ProceduresScreen from '../screens/ProceduresScreen';
import QuizScreen from '../screens/QuizScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default function NurSync() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <AppProvider>
      {/* Full-screen background */}
      <div className="min-h-screen w-full" style={{ background: 'var(--app-outer-bg)' }}>
        {/* Centered phone-width container */}
        <div
          className="relative flex flex-col h-screen mx-auto overflow-hidden"
          style={{ maxWidth: '430px', background: 'var(--app-bg)' }}
        >
          {/* App header */}
          <div
            className="flex items-center justify-between px-5 py-2.5 border-b flex-shrink-0 z-40"
            style={{
              background: 'var(--app-bg)',
              borderColor: 'var(--header-border)',
              paddingTop: 'max(10px, env(safe-area-inset-top))',
            }}
          >
            <div className="flex items-center gap-2.5" style={{ userSelect: 'none' }}>
              <img
                src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/883e60a2e_AppsLogoUpdate.png"
                alt="NurSync logo"
                className="w-8 h-8 rounded-xl object-contain"
                draggable={false}
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight" style={{ color: 'hsl(265,50%,35%)' }}>NurSync</span>
                <span className="text-[9px] font-medium" style={{ color: 'hsl(265,30%,60%)' }}>Sync to better care</span>
              </div>
            </div>
            <button
              onClick={() => setShowProfile(p => !p)}
              className="w-8 h-8 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: showProfile ? 'hsl(265,55%,92%)' : 'hsl(265,30%,92%)',
                userSelect: 'none',
              }}
            >
              <User size={15} style={{ color: 'hsl(265,50%,48%)' }} />
            </button>
          </div>

          {/* Screen content */}
          <div className="flex-1 min-h-0" style={{ overscrollBehavior: 'none' }}>
            {showProfile ? (
              <div className="h-full overflow-y-auto scrollbar-hide">
                <ProfileScreen onBack={() => setShowProfile(false)} />
              </div>
            ) : (
              <div className="h-full overflow-y-auto scrollbar-hide">
                <Routes>
                  <Route path="/" element={<Navigate to="/medicine" replace />} />
                  <Route path="/medicine/*" element={<MedicineScreen />} />
                  <Route path="/calculators/*" element={<CalculatorScreen />} />
                  <Route path="/procedures/*" element={<ProceduresScreen />} />
                  <Route path="/quiz/*" element={<QuizScreen />} />
                  <Route path="/saved/*" element={<SavedScreen />} />
                </Routes>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          {!showProfile && (
            <div className="flex-shrink-0">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </AppProvider>
  );
}