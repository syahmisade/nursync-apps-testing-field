import React from "react";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-nunito"
      style={{ background: 'hsl(270, 40%, 97%)' }}>

      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(265,60%,88%) 0%, transparent 70%)', opacity: 0.5, transform: 'translate(-30%, -30%)' }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(300,45%,88%) 0%, transparent 70%)', opacity: 0.45, transform: 'translate(30%, 30%)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4"
            style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)', boxShadow: '0 6px 24px hsla(265,55%,70%,0.4)' }}>
            <img
              src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/883e60a2e_AppsLogoUpdate.png"
              alt="NurSync"
              className="w-9 h-9 object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-2xl font-black" style={{ color: 'hsl(265,45%,28%)' }}>NurSync</span>
            <span className="text-lg">🩺</span>
          </div>
          <h1 className="text-base font-bold mt-0.5" style={{ color: 'hsl(265,35%,38%)' }}>{title}</h1>
          {subtitle && <p className="text-xs font-medium mt-1" style={{ color: 'hsl(265,15%,58%)' }}>{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 border"
          style={{ background: 'white', borderColor: 'hsl(270,25%,88%)', boxShadow: '0 4px 32px hsla(265,50%,80%,0.2), 0 1px 6px rgba(0,0,0,0.04)' }}>
          {children}
        </div>

        {footer && (
          <p className="text-center text-xs font-medium mt-5" style={{ color: 'hsl(265,15%,58%)' }}>{footer}</p>
        )}
      </div>
    </div>
  );
}