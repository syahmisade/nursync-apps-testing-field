import React from 'react';

const categoryColors = {
  "All": "bg-secondary text-secondary-foreground",
  "Analgesic": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Antibiotic": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Antidiabetic": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Antihypertensive": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "Antilipid": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Bronchodilator": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Antacid/PPI": "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  "Opioid Analgesic": "bg-red-500/15 text-red-400 border-red-500/25",
  "Anticoagulant": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Corticosteroid": "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
};

export default function CategoryChip({ label, active, onClick }) {
  const colorClass = categoryColors[label] || "bg-secondary text-secondary-foreground";
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
        active
          ? `${colorClass} ring-1 ring-primary/50 scale-105`
          : `${colorClass} opacity-60 hover:opacity-100`
      }`}
    >
      {label}
    </button>
  );
}