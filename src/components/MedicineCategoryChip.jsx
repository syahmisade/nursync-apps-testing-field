import React from 'react';
import { toneForCategory } from './Semantic';

export default function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      data-tone={toneForCategory(label)}
      className={`semantic-pill whitespace-nowrap transition-all duration-150 ${
        active
          ? 'ring-1 ring-primary/50 scale-105'
          : 'opacity-70 hover:opacity-100'
      }`}
    >
      {label}
    </button>
  );
}
