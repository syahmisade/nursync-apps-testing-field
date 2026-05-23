import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-start gap-2 px-3 py-2 rounded-2xl text-[10px] border"
        style={{ background: 'hsl(38,85%,96%)', borderColor: 'hsl(38,70%,85%)', color: 'hsl(38,60%,45%)' }}>
        <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(38,70%,52%)' }} />
        <span>Sample content for prototype only. Not for clinical use.</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs border"
      style={{ background: 'hsl(38,80%,96%)', borderColor: 'hsl(38,65%,83%)', color: 'hsl(38,55%,42%)' }}>
      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(38,70%,50%)' }} />
      <span>
        <span className="font-bold" style={{ color: 'hsl(38,65%,42%)' }}>Educational Reference Only.</span>{' '}
        NurSync is not a substitute for current MOH Malaysia guidance, hospital policy, lecturer instruction, or qualified clinical judgment.
      </span>
    </div>
  );
}