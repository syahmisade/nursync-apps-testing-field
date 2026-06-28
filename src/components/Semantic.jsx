import React from 'react';

export const categoryToneMap = {
  All: 'neutral',
  Analgesic: 'blue',
  Antibiotic: 'success',
  Antidiabetic: 'purple',
  Antihypertensive: 'rose',
  Antilipid: 'orange',
  Bronchodilator: 'cyan',
  'Antacid/PPI': 'amber',
  'Opioid Analgesic': 'danger',
  Anticoagulant: 'pink',
  Corticosteroid: 'cyan',
  'Vital Signs': 'blue',
  'Medication Administration': 'purple',
  'Infection Control': 'success',
  'Wound Care': 'rose',
  'Patient Safety': 'orange',
  'Emergency Basics': 'danger',
};

export const quizToneMap = {
  pharmacology: 'blue',
  fundamentals: 'success',
  medsurg: 'purple',
  maternal: 'rose',
  infection: 'cyan',
  calculations: 'orange',
};

export function toneForCategory(category) {
  return categoryToneMap[category] || 'neutral';
}

const medicineCategoryTextColors = [
  'hsl(220,65%,45%)',
  'hsl(152,55%,32%)',
  'hsl(270,50%,45%)',
  'hsl(350,58%,45%)',
  'hsl(28,70%,40%)',
  'hsl(188,55%,32%)',
  'hsl(38,65%,36%)',
  'hsl(0,58%,45%)',
  'hsl(330,55%,45%)',
  'hsl(195,55%,34%)',
  'hsl(115,42%,34%)',
  'hsl(255,56%,48%)',
];

function hashCategory(category) {
  const normalized = String(category || '').trim().toLowerCase();
  let hash = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function medicineCategoryTextColor(category) {
  const label = String(category || '').trim();
  if (!label || label === 'All' || label === 'Uncategorized') {
    return 'hsl(265,30%,40%)';
  }

  return medicineCategoryTextColors[hashCategory(label) % medicineCategoryTextColors.length];
}

export const procedureCategoryTextColor = medicineCategoryTextColor;

export function toneForQuizCategory(category) {
  return quizToneMap[category] || 'neutral';
}

export function SemanticPill({ tone = 'neutral', className = '', style, children }) {
  return (
    <span className={`semantic-pill ${className}`} data-tone={tone} style={style}>
      {children}
    </span>
  );
}

export function StatusPanel({ tone = 'info', compact = false, className = '', children }) {
  return (
    <div className={`status-panel ${compact ? 'status-panel-compact' : ''} ${className}`} data-tone={tone}>
      {children}
    </div>
  );
}
