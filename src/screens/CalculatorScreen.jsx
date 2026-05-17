import React, { useState } from 'react';
import { Calculator, AlertTriangle, RotateCcw, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

function BMICalculator({ onBack }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const heightM = parseFloat(height) / 100;
  const weightKg = parseFloat(weight);
  const bmi = height && weight && heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : null;

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' };
    if (bmi < 23) return { label: 'Normal weight', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' };
    if (bmi < 27.5) return { label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' };
    if (bmi < 35) return { label: 'Obese', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' };
    return { label: 'Morbidly Obese', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
  };

  const reset = () => { setHeight(''); setWeight(''); };
  const cat = bmi ? getBmiCategory(parseFloat(bmi)) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-bold text-foreground">BMI Calculator</h2>
          <p className="text-xs text-muted-foreground">Body Mass Index</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <div>
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="e.g. 165"
              className="w-full mt-1.5 bg-secondary/70 rounded-xl px-4 py-3 text-foreground text-sm outline-none border border-border focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 68"
              className="w-full mt-1.5 bg-secondary/70 rounded-xl px-4 py-3 text-foreground text-sm outline-none border border-border focus:border-primary/50 transition-colors"
            />
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {bmi && cat && (
          <div className={`rounded-2xl p-5 border ${cat.bg} animate-slide-up`}>
            <p className="text-xs text-muted-foreground mb-1">Your BMI</p>
            <p className={`text-4xl font-bold ${cat.color}`}>{bmi}</p>
            <p className={`text-sm font-semibold mt-1 ${cat.color}`}>{cat.label}</p>
            <p className="text-xs text-muted-foreground mt-2">Formula: BMI = weight (kg) ÷ height² (m²)</p>
          </div>
        )}

        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">BMI Categories (Asian)</p>
          {[
            ['< 18.5', 'Underweight', 'text-blue-400'],
            ['18.5 – 22.9', 'Normal weight', 'text-emerald-400'],
            ['23.0 – 27.4', 'Overweight', 'text-yellow-400'],
            ['27.5 – 34.9', 'Obese', 'text-orange-400'],
            ['≥ 35.0', 'Morbidly Obese', 'text-red-400'],
          ].map(([range, label, color]) => (
            <div key={range} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
              <span className="text-xs text-muted-foreground">{range}</span>
              <span className={`text-xs font-medium ${color}`}>{label}</span>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground mt-2">Using WHO Asian-specific cut-offs</p>
        </div>

        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

function IVDripCalculator({ onBack }) {
  const [volume, setVolume] = useState('');
  const [hours, setHours] = useState('');
  const [dropFactor, setDropFactor] = useState('20');

  const reset = () => { setVolume(''); setHours(''); setDropFactor('20'); };

  const dropsPerMin = volume && hours && dropFactor
    ? ((parseFloat(volume) * parseFloat(dropFactor)) / (parseFloat(hours) * 60)).toFixed(1)
    : null;
  const mlPerHour = volume && hours
    ? (parseFloat(volume) / parseFloat(hours)).toFixed(1)
    : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-bold text-foreground">IV Drip Rate</h2>
          <p className="text-xs text-muted-foreground">Gravity infusion calculator</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-xl text-xs bg-red-500/10 border border-red-500/25 text-red-400">
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
          <span><span className="font-semibold">Safety Warning:</span> Always verify drip rate calculations with a second nurse before administration. This tool is for educational reference only.</span>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          {[
            { label: 'Volume (mL)', value: volume, set: setVolume, placeholder: 'e.g. 500' },
            { label: 'Time (hours)', value: hours, set: setHours, placeholder: 'e.g. 4' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 bg-secondary/70 rounded-xl px-4 py-3 text-foreground text-sm outline-none border border-border focus:border-primary/50 transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Drop Factor</label>
            <div className="flex gap-2 mt-1.5">
              {[['15', 'Blood set'], ['20', 'Standard'], ['60', 'Microdrip']].map(([val, lbl]) => (
                <button key={val} onClick={() => setDropFactor(val)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${dropFactor === val ? 'bg-primary/15 text-primary border-primary/40' : 'bg-secondary/60 text-muted-foreground border-border'}`}>
                  <span className="block font-bold">{val}</span>
                  <span className="block text-[10px] opacity-70">{lbl}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {dropsPerMin && (
          <div className="bg-primary/10 rounded-2xl p-5 border border-primary/25 animate-slide-up">
            <p className="text-xs text-muted-foreground mb-1">Drip Rate</p>
            <p className="text-4xl font-bold text-primary">{dropsPerMin} <span className="text-lg font-normal">gtt/min</span></p>
            <p className="text-sm text-muted-foreground mt-1">{mlPerHour} mL/hour</p>
            <p className="text-xs text-muted-foreground/60 mt-2">Formula: (Volume × Drop factor) ÷ (Time in minutes)</p>
          </div>
        )}

        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info size={13} className="text-primary" />
            <p className="text-xs font-semibold text-primary">Formula Reminder</p>
          </div>
          <p className="text-xs text-muted-foreground font-mono bg-secondary/50 p-2 rounded-lg">
            Drip rate (gtt/min) = <br />Volume (mL) × Drop factor<br />÷ Time (minutes)
          </p>
        </div>

        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

function FluidBalanceCalculator({ onBack }) {
  const [intake, setIntake] = useState('');
  const [output, setOutput] = useState('');
  const reset = () => { setIntake(''); setOutput(''); };
  const balance = intake && output ? (parseFloat(intake) - parseFloat(output)).toFixed(0) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-bold text-foreground">Fluid Balance</h2>
          <p className="text-xs text-muted-foreground">24-hour balance calculator</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4">
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          {[
            { label: 'Total Intake (mL)', value: intake, set: setIntake, placeholder: 'e.g. 2400' },
            { label: 'Total Output (mL)', value: output, set: setOutput, placeholder: 'e.g. 1800' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 bg-secondary/70 rounded-xl px-4 py-3 text-foreground text-sm outline-none border border-border focus:border-primary/50 transition-colors" />
            </div>
          ))}
          <button onClick={reset} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {balance !== null && (
          <div className={`rounded-2xl p-5 border animate-slide-up ${parseFloat(balance) > 0 ? 'bg-blue-500/10 border-blue-500/25' : parseFloat(balance) < 0 ? 'bg-orange-500/10 border-orange-500/25' : 'bg-emerald-500/10 border-emerald-500/25'}`}>
            <p className="text-xs text-muted-foreground mb-1">Fluid Balance</p>
            <p className={`text-4xl font-bold ${parseFloat(balance) > 0 ? 'text-blue-400' : parseFloat(balance) < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {parseFloat(balance) > 0 ? '+' : ''}{balance} mL
            </p>
            <p className="text-sm font-medium mt-1 text-muted-foreground">
              {parseFloat(balance) > 500 ? '⚠️ Positive — monitor for fluid overload' : parseFloat(balance) < -500 ? '⚠️ Negative — monitor for dehydration' : '✓ Roughly balanced'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">Intake – Output = {intake} – {output} = {balance} mL</p>
          </div>
        )}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">What counts as intake?</p>
          <p className="text-xs text-muted-foreground">IV fluids, oral intake, nasogastric feeds, blood products, IV medications in large volumes.</p>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-3 mb-2">What counts as output?</p>
          <p className="text-xs text-muted-foreground">Urine, stool, nasogastric drainage, drain losses, vomit, estimated insensible losses (~800 mL/day).</p>
        </div>
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

const calculators = [
  { id: 'bmi', name: 'Body Mass Index (BMI)', desc: 'Calculate BMI using height and weight', icon: '⚖️', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
  { id: 'ivdrip', name: 'IV Drip Rate', desc: 'Gravity infusion drip rate calculator', icon: '💉', color: 'from-teal-500/20 to-teal-600/10 border-teal-500/20' },
  { id: 'fluidbalance', name: 'Fluid Balance', desc: '24-hour fluid balance calculation', icon: '🌊', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' },
  { id: 'dose', name: 'Dose Calculation', desc: 'Weight-based dose calculator (coming soon)', icon: '💊', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20', disabled: true },
];

export default function CalculatorScreen() {
  const [activeCalc, setActiveCalc] = useState(null);

  if (activeCalc === 'bmi') return <BMICalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'ivdrip') return <IVDripCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'fluidbalance') return <FluidBalanceCalculator onBack={() => setActiveCalc(null)} />;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Calculators</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Nursing clinical calculators</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-3">
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs bg-amber-400/5 border border-amber-400/15 text-amber-400/80">
          <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <span>Always verify clinical calculations with a qualified practitioner. These calculators are for educational reference only.</span>
        </div>

        {calculators.map(calc => (
          <button
            key={calc.id}
            onClick={() => !calc.disabled && setActiveCalc(calc.id)}
            disabled={calc.disabled}
            className={`w-full bg-gradient-to-r ${calc.color} rounded-2xl p-4 border text-left flex items-center justify-between transition-all duration-200 ${calc.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{calc.icon}</span>
              <div>
                <p className="font-semibold text-sm text-foreground">{calc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{calc.desc}</p>
              </div>
            </div>
            {!calc.disabled && <ChevronRight size={16} className="text-muted-foreground/60" />}
            {calc.disabled && <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-full">Soon</span>}
          </button>
        ))}

        <DisclaimerBanner />
        <div className="h-2" />
      </div>
    </div>
  );
}