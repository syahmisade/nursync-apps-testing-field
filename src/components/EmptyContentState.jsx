import React from 'react';

export default function EmptyContentState({ icon: Icon, title, description, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-14 gap-3 ${className}`}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-border bg-secondary text-primary">
          <Icon size={28} strokeWidth={1.8} />
        </div>
      )}
      <div className="w-full max-w-[16rem] rounded-2xl border border-border bg-secondary/70 px-5 py-4 text-center">
        {Icon && <Icon size={22} className="mx-auto mb-2 text-muted-foreground" strokeWidth={1.8} />}
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
