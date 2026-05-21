import React from 'react';
import { Pill, Calculator, ClipboardList, BookOpen, Bookmark } from 'lucide-react';

const tabs = [
  { id: 'medicine', label: 'Medicine', Icon: Pill },
  { id: 'calculators', label: 'Calc', Icon: Calculator },
  { id: 'procedures', label: 'Procedures', Icon: ClipboardList },
  { id: 'quiz', label: 'Quiz', Icon: BookOpen },
  { id: 'saved', label: 'Saved', Icon: Bookmark },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="flex justify-around items-center px-2 pt-2 pb-3 border-t"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderColor: 'hsl(270,25%,90%)',
        boxShadow: '0 -4px 20px rgba(147,92,210,0.07)',
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all duration-200 active:scale-95"
          >
            <div
              className="p-2 rounded-2xl transition-all duration-200"
              style={isActive ? {
                background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)',
                boxShadow: '0 4px 12px rgba(147,92,210,0.30)',
              } : {
                background: 'transparent',
              }}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? 'white' : 'hsl(265,20%,62%)' }}
              />
            </div>
            <span
              className="text-[9px] font-bold transition-colors duration-200"
              style={{ color: isActive ? 'hsl(265,55%,48%)' : 'hsl(265,15%,62%)' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}