import React from "react";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 font-nunito bg-background text-foreground">
      <div
        className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.24) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.28) 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-7">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 gradient-primary"
            style={{ boxShadow: '0 6px 24px hsl(var(--primary) / 0.28)' }}
          >
            <img
              src="https://media.base44.com/images/public/6a09fb9ae5c8de3d68cfbc57/883e60a2e_AppsLogoUpdate.png"
              alt="NurSync"
              className="w-9 h-9 object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-2xl font-black text-foreground">NurSync</span>
            <span className="text-lg">+</span>
          </div>
          <h1 className="text-base font-bold mt-0.5 text-foreground">{title}</h1>
          {subtitle && <p className="text-sm font-medium mt-1 text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="rounded-3xl p-6 border bg-card text-card-foreground border-border card-shadow">
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm font-medium mt-5 text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}
