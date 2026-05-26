import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pill, Calculator, ClipboardList, BookOpen, Bookmark } from 'lucide-react';

const tabs = [
  { path: '/medicine', label: 'Medicine', Icon: Pill },
  { path: '/calculators', label: 'Calc', Icon: Calculator },
  { path: '/procedures', label: 'Procedures', Icon: ClipboardList },
  { path: '/quiz', label: 'Quiz', Icon: BookOpen },
  { path: '/saved', label: 'Saved', Icon: Bookmark },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="flex justify-around items-center px-2 pt-2 border-t border-border w-full z-50 bg-card/90 backdrop-blur-xl"
      style={{
        boxShadow: '0 -4px 20px rgba(147,92,210,0.07)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(({ path, label, Icon }) => {
        // Active when on the tab root or any of its detail pages (e.g.
        // /medicine/123 keeps the Medicine tab highlighted).
        const isActive = pathname === path || pathname.startsWith(`${path}/`);

        // Tapping the tab always returns to its root path; from a detail page
        // this pops back to the list. If already at the root, it's a no-op.
        const handleClick = () => {
          if (pathname !== path) navigate(path);
        };

        return (
          <button
            key={path}
            type="button"
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
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
                style={{ color: isActive ? 'white' : 'hsl(var(--muted-foreground))' }}
              />
            </div>
            <span
              className="text-[11px] font-bold transition-colors duration-200"
              style={{ color: isActive ? 'hsl(265,55%,48%)' : 'hsl(var(--muted-foreground))' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
