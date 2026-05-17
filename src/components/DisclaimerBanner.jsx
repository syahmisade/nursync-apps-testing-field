import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-start gap-2 px-3 py-2 rounded-lg text-[10px] text-amber-400/80 bg-amber-400/5 border border-amber-400/15">
        <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <span>Sample content for prototype only. Not for clinical use.</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/15">
      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <span>
        <span className="font-semibold text-amber-400">Educational Reference Only.</span>{' '}
        NurSync is not a substitute for current MOH Malaysia guidance, hospital policy, lecturer instruction, or qualified clinical judgment.
      </span>
    </div>
  );
}