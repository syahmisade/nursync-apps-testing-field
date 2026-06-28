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

const neutralCategoryTextColor = 'hsl(265,30%,40%)';

function normalizeCategoryKey(category) {
  return String(category || '').trim().toLowerCase();
}

function categoryTextColorAt(index) {
  const hue = (220 + (index * 137.508)) % 360;
  const saturation = 52 + (index % 4) * 4;
  const lightness = 34 + (index % 3) * 4;

  return `hsl(${hue.toFixed(2)},${saturation}%,${lightness}%)`;
}

export function buildCategoryTextColorMap(categories) {
  const colorMap = {};
  let colorIndex = 0;

  for (const category of categories) {
    const label = String(category || '').trim();
    if (!label) continue;

    const key = normalizeCategoryKey(label);
    if (label === 'All' || label === 'Uncategorized') {
      colorMap[key] = neutralCategoryTextColor;
      continue;
    }

    colorMap[key] = categoryTextColorAt(colorIndex);
    colorIndex += 1;
  }

  return colorMap;
}

export function categoryTextColorFromMap(category, colorMap = {}) {
  const label = String(category || '').trim();
  if (!label || label === 'All' || label === 'Uncategorized') {
    return neutralCategoryTextColor;
  }

  return colorMap[normalizeCategoryKey(label)] || neutralCategoryTextColor;
}

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
