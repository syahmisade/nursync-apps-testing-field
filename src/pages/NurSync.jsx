import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NurSync() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <AppProvider>
      {/* Full-screen background */}
      <div className="min-h-dvh w-full bg-background">
        {/* Centered phone-width container */}
        <div className="relative flex flex-col h-dvh min-h-dvh mx-auto overflow-hidden bg-background border-x border-border"
          style={{ maxWidth: '430px' }}>

          {/* App header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-border sticky top-0 z-40 bg-background"
            style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}>
            <div className="flex items-center gap-2.5">
              <img
                src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/883e60a2e_AppsLogoUpdate.png"
                alt="NurSync logo"
                className="w-8 h-8 rounded-xl object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-primary">NurSync</span>
                <span className="text-[11px] font-medium text-muted-foreground">Sync to better care</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="p-2 rounded-2xl transition-all active:scale-95 text-primary bg-secondary"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <Link
                to="/profile"
                aria-label="Open profile settings"
                className="p-2 rounded-2xl transition-all active:scale-95 text-primary bg-secondary"
              >
                <Settings size={17} />
              </Link>
            </div>
          </div>

          {/* Screen content */}
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto scrollbar-hide main-scroll">
              <Outlet />
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex-shrink-0">
            <BottomNav />
          </div>

        </div>
      </div>
    </AppProvider>
  );
}
