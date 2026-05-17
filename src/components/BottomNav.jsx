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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 border-t border-border"
      style={{ background: 'hsl(222, 42%, 10%)', backdropFilter: 'blur(20px)', maxWidth: '430px', margin: '0 auto' }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/15' : ''}`}>
              <Icon
                size={20}
                className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </div>
            <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}