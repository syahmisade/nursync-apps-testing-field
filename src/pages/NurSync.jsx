import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { Settings } from 'lucide-react';

export default function NurSync() {
  return (
    <AppProvider>
      {/* Full-screen background */}
      <div className="min-h-screen w-full" style={{ background: 'hsl(265,25%,88%)' }}>
        {/* Centered phone-width container */}
        <div className="relative flex flex-col h-screen mx-auto overflow-hidden"
          style={{ maxWidth: '430px', background: 'hsl(270, 40%, 97%)' }}>

          {/* App header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b sticky top-0 z-40"
            style={{ background: 'hsl(270, 40%, 97%)', borderColor: 'hsl(270,25%,90%)', paddingTop: 'max(10px, env(safe-area-inset-top))' }}>
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
            <Link
              to="/profile"
              aria-label="Open profile settings"
              className="p-2 rounded-2xl transition-all active:scale-95"
              style={{ color: 'hsl(265,45%,48%)', background: 'hsl(265,50%,94%)' }}
            >
              <Settings size={17} />
            </Link>
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
