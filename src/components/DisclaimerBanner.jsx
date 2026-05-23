import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StatusPanel } from './Semantic';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <StatusPanel tone="warning" compact>
        <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
        <span>Sample content for prototype only. Not for clinical use.</span>
      </StatusPanel>
    );
  }

  return (
    <StatusPanel tone="warning">
      <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
      <span>
        <span className="font-bold">Educational Reference Only.</span>{' '}
        NurSync is not a substitute for current MOH Malaysia guidance, hospital policy, lecturer instruction, or qualified clinical judgment.
      </span>
    </StatusPanel>
  );
}
