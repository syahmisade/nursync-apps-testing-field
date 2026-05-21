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
      <div className="flex flex-col min-h-screen" style={{ background: 'hsl(270, 40%, 97%)' }}>
        {/* App header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b sticky top-0 z-40"
          style={{ background: 'hsl(270, 40%, 97%)', borderColor: 'hsl(270,25%,90%)' }}>
          <div className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/883e60a2e_AppsLogoUpdate.png"
              alt="NurSync logo"
              className="w-8 h-8 rounded-xl object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight" style={{ color: 'hsl(265,50%,35%)' }}>NurSync</span>
              <span className="text-[9px] font-medium" style={{ color: 'hsl(265,30%,60%)' }}>Sync to better care</span>
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <ActiveScreen />
        </div>

        {/* Bottom nav */}
        <div className="flex-shrink-0">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </AppProvider>
  );
}