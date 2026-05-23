import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, RotateCcw, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

function BMICalculator({ onBack }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const heightM = parseFloat(height) / 100;
  const weightKg = parseFloat(weight);
  const bmi = height && weight && heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : null;

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', colorHsl: 'hsl(220,60%,46%)', bgHsl: 'hsl(220,60%,95%)', borderHsl: 'hsl(220,50%,82%)' };
    if (bmi < 23) return { label: 'Normal weight', colorHsl: 'hsl(152,50%,38%)', bgHsl: 'hsl(152,50%,95%)', borderHsl: 'hsl(152,40%,78%)' };
    if (bmi < 27.5) return { label: 'Overweight', colorHsl: 'hsl(38,65%,42%)', bgHsl: 'hsl(38,75%,95%)', borderHsl: 'hsl(38,60%,78%)' };
    if (bmi < 35) return { label: 'Obese', colorHsl: 'hsl(28,65%,45%)', bgHsl: 'hsl(28,70%,95%)', borderHsl: 'hsl(28,58%,78%)' };
    return { label: 'Morbidly Obese', colorHsl: 'hsl(0,52%,48%)', bgHsl: 'hsl(0,55%,95%)', borderHsl: 'hsl(0,45%,80%)' };
  };

  const reset = () => { setHeight(''); setWeight(''); };

  const bmiCatData = bmi ? getBmiCategory(parseFloat(bmi)) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">BMI Calculator ⚖️</h2>
            <p className="text-xs font-medium text-muted-foreground">Body Mass Index</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          {[
            { label: 'Height (cm)', value: height, set: setHeight, placeholder: 'e.g. 165' },
            { label: 'Weight (kg)', value: weight, set: setWeight, placeholder: 'e.g. 68' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border transition-colors font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
          ))}
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {bmi && bmiCatData && (
          <div className="rounded-2xl p-5 border animate-slide-up"
            style={{ background: bmiCatData.bgHsl, borderColor: bmiCatData.borderHsl }}>
            <p className="text-xs font-semibold mb-1 text-muted-foreground">Your BMI</p>
            <p className="text-4xl font-black" style={{ color: bmiCatData.colorHsl }}>{bmi}</p>
            <p className="text-sm font-bold mt-1" style={{ color: bmiCatData.colorHsl }}>{bmiCatData.label}</p>
            <p className="text-xs mt-2 text-muted-foreground">Formula: BMI = weight (kg) ÷ height² (m²)</p>
          </div>
        )}

        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-primary">BMI Categories (Asian)</p>
          {[
            ['< 18.5', 'Underweight', 'hsl(220,60%,46%)'],
            ['18.5 – 22.9', 'Normal weight', 'hsl(152,50%,38%)'],
            ['23.0 – 27.4', 'Overweight', 'hsl(38,65%,42%)'],
            ['27.5 – 34.9', 'Obese', 'hsl(28,65%,45%)'],
            ['≥ 35.0', 'Morbidly Obese', 'hsl(0,52%,48%)'],
          ].map(([range, label, color]) => (
            <div key={range} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
              <span className="text-xs font-medium text-muted-foreground">{range}</span>
              <span className="text-xs font-bold" style={{ color }}>{label}</span>
            </div>
          ))}
          <p className="text-[10px] mt-2 font-medium text-muted-foreground">Using WHO Asian-specific cut-offs</p>
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
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const reset = () => { setVolume(''); setHours(''); setDropFactor('20'); };

  const dropsPerMin = volume && hours && dropFactor
    ? ((parseFloat(volume) * parseFloat(dropFactor)) / (parseFloat(hours) * 60)).toFixed(1)
    : null;
  const mlPerHour = volume && hours
    ? (parseFloat(volume) / parseFloat(hours)).toFixed(1)
    : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">IV Drip Rate 💉</h2>
            <p className="text-xs font-medium text-muted-foreground">Gravity infusion calculator</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-2xl text-xs border border-destructive/30 bg-destructive/8"
          style={{ color: 'hsl(0,52%,46%)' }}>
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-destructive" />
          <span><span className="font-bold">Safety Warning:</span> Always verify drip rate calculations with a second nurse before administration.</span>
        </div>

        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          {[
            { label: 'Volume (mL)', value: volume, set: setVolume, placeholder: 'e.g. 500' },
            { label: 'Time (hours)', value: hours, set: setHours, placeholder: 'e.g. 4' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border transition-colors font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Drop Factor</label>
            <div className="flex gap-2 mt-1.5">
              {[['15', 'Blood set'], ['20', 'Standard'], ['60', 'Microdrip']].map(([val, lbl]) => (
                <button key={val} onClick={() => setDropFactor(val)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95"
                  style={dropFactor === val
                    ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,48%)', borderColor: 'hsl(265,45%,75%)' }
                    : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }}>
                  <span className="block">{val}</span>
                  <span className="block text-[9px] opacity-70 font-medium">{lbl}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {dropsPerMin && (
          <div className="rounded-2xl p-5 border animate-slide-up bg-secondary border-border">
            <p className="text-xs font-semibold mb-1 text-muted-foreground">Drip Rate</p>
            <p className="text-4xl font-black text-primary">
              {dropsPerMin} <span className="text-lg font-semibold text-muted-foreground">gtt/min</span>
            </p>
            <p className="text-sm font-medium mt-1 text-muted-foreground">{mlPerHour} mL/hour</p>
            <p className="text-xs mt-2 text-muted-foreground">Formula: (Volume × Drop factor) ÷ (Time in minutes)</p>
          </div>
        )}

        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info size={13} className="text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Formula</p>
          </div>
          <p className="text-xs font-mono rounded-xl p-2.5 leading-relaxed bg-muted text-foreground">
            Drip rate (gtt/min) =<br />Volume (mL) × Drop factor<br />÷ Time (minutes)
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
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const reset = () => { setIntake(''); setOutput(''); };
  const balance = intake && output ? (parseFloat(intake) - parseFloat(output)).toFixed(0) : null;

  const balVal = balance !== null ? parseFloat(balance) : 0;
  const balColor = balVal > 0 ? 'hsl(220,60%,46%)' : balVal < 0 ? 'hsl(28,65%,45%)' : 'hsl(152,50%,38%)';
  const balBg = balVal > 0 ? 'hsl(220,60%,95%)' : balVal < 0 ? 'hsl(28,70%,95%)' : 'hsl(152,50%,95%)';
  const balBorder = balVal > 0 ? 'hsl(220,50%,82%)' : balVal < 0 ? 'hsl(28,58%,80%)' : 'hsl(152,40%,78%)';

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">Fluid Balance 🌊</h2>
            <p className="text-xs font-medium text-muted-foreground">24-hour balance calculator</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          {[
            { label: 'Total Intake (mL)', value: intake, set: setIntake, placeholder: 'e.g. 2400' },
            { label: 'Total Output (mL)', value: output, set: setOutput, placeholder: 'e.g. 1800' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border transition-colors font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
          ))}
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {balance !== null && (
          <div className="rounded-2xl p-5 border animate-slide-up" style={{ background: balBg, borderColor: balBorder }}>
            <p className="text-xs font-semibold mb-1 text-muted-foreground">Fluid Balance</p>
            <p className="text-4xl font-black" style={{ color: balColor }}>
              {balVal > 0 ? '+' : ''}{balance} mL
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: balColor }}>
              {balVal > 500 ? '⚠️ Positive — monitor for fluid overload' : balVal < -500 ? '⚠️ Negative — monitor for dehydration' : '✓ Roughly balanced'}
            </p>
            <p className="text-xs mt-2 text-muted-foreground">Intake – Output = {intake} – {output} = {balance} mL</p>
          </div>
        )}
        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-primary">What counts as intake?</p>
          <p className="text-xs font-medium text-muted-foreground">IV fluids, oral intake, nasogastric feeds, blood products, IV medications in large volumes.</p>
          <p className="text-[10px] font-black uppercase tracking-widest mt-3 mb-1.5 text-primary">What counts as output?</p>
          <p className="text-xs font-medium text-muted-foreground">Urine, stool, nasogastric drainage, drain losses, vomit, estimated insensible losses (~800 mL/day).</p>
        </div>
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

const calculators = [
  { id: 'bmi', name: 'Body Mass Index (BMI)', desc: 'Calculate BMI using height and weight', icon: '⚖️', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
  { id: 'ivdrip', name: 'IV Drip Rate', desc: 'Gravity infusion drip rate calculator', icon: '💉', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' },
  { id: 'fluidbalance', name: 'Fluid Balance', desc: '24-hour fluid balance calculation', icon: '🌊', color: 'from-sky-500/20 to-sky-600/10 border-sky-500/20' },
  { id: 'dose', name: 'Dose Calculation', desc: 'Weight-based dose calculator', icon: '💊', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
  { id: 'infusiontime', name: 'Infusion Time', desc: 'Calculate total infusion duration', icon: '⏱️', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20' },
  { id: 'bloodtransfusion', name: 'Blood Transfusion Rate', desc: 'Transfusion drip rate calculator', icon: '🩸', color: 'from-red-500/20 to-red-600/10 border-red-500/20' },
  { id: 'edd', name: 'Estimated Delivery Date', desc: 'Calculate EDD from LMP', icon: '🤰', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/20' },
];

function DoseCalculator({ onBack }) {
  const [weight, setWeight] = useState('');
  const [dosePerKg, setDosePerKg] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const reset = () => { setWeight(''); setDosePerKg(''); setFrequency('1'); };

  const singleDose = weight && dosePerKg ? (parseFloat(weight) * parseFloat(dosePerKg)).toFixed(2) : null;
  const dailyDose = singleDose ? (parseFloat(singleDose) * parseFloat(frequency)).toFixed(2) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">Dose Calculation 💊</h2>
            <p className="text-xs font-medium text-muted-foreground">Weight-based dosing</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-2xl text-xs border border-destructive/30"
          style={{ background: 'hsl(0,60%,96%)', color: 'hsl(0,52%,46%)' }}>
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-destructive" />
          <span><span className="font-bold">Safety Warning:</span> Always verify doses with prescriber orders, BNF, or local formulary. Double-check with a second nurse.</span>
        </div>
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          {[
            { label: 'Patient Weight (kg)', value: weight, set: setWeight, placeholder: 'e.g. 70' },
            { label: 'Prescribed Dose (mg/kg)', value: dosePerKg, set: setDosePerKg, placeholder: 'e.g. 10' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Frequency (doses/day)</label>
            <div className="flex gap-2 mt-1.5">
              {[['1','OD'],['2','BD'],['3','TDS'],['4','QDS']].map(([val, lbl]) => (
                <button key={val} onClick={() => setFrequency(val)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95"
                  style={frequency === val
                    ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,48%)', borderColor: 'hsl(265,45%,75%)' }
                    : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }}>
                  <span className="block">{lbl}</span>
                  <span className="block text-[9px] opacity-70 font-medium">{val}x</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {singleDose && (
          <div className="rounded-2xl p-5 border animate-slide-up space-y-3 bg-secondary border-border">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Single Dose</p>
              <p className="text-4xl font-black text-primary">
                {singleDose} <span className="text-lg font-semibold text-muted-foreground">mg</span>
              </p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground">Total Daily Dose</p>
              <p className="text-2xl font-black text-primary">{dailyDose} mg/day</p>
            </div>
            <p className="text-xs text-muted-foreground">Formula: {weight} kg × {dosePerKg} mg/kg = {singleDose} mg</p>
          </div>
        )}
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

function InfusionTimeCalculator({ onBack }) {
  const [volume, setVolume] = useState('');
  const [rate, setRate] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const reset = () => { setVolume(''); setRate(''); };

  const totalMinutes = volume && rate && parseFloat(rate) > 0 ? (parseFloat(volume) / parseFloat(rate)) * 60 : null;
  const hours = totalMinutes ? Math.floor(totalMinutes / 60) : null;
  const minutes = totalMinutes ? Math.round(totalMinutes % 60) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">Infusion Time ⏱️</h2>
            <p className="text-xs font-medium text-muted-foreground">Total infusion duration</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          {[
            { label: 'Volume to Infuse (mL)', value: volume, set: setVolume, placeholder: 'e.g. 500' },
            { label: 'Infusion Rate (mL/hour)', value: rate, set: setRate, placeholder: 'e.g. 125' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</label>
              <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
            </div>
          ))}
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {totalMinutes !== null && (
          <div className="rounded-2xl p-5 border animate-slide-up bg-secondary border-border">
            <p className="text-xs font-semibold mb-1 text-muted-foreground">Infusion Duration</p>
            <p className="text-4xl font-black text-primary">{hours}h {minutes}m</p>
            <p className="text-sm font-medium mt-1 text-muted-foreground">{totalMinutes.toFixed(0)} minutes total</p>
            <p className="text-xs mt-2 text-muted-foreground">Formula: {volume} ÷ {rate} × 60</p>
          </div>
        )}
        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info size={13} className="text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Formula</p>
          </div>
          <p className="text-xs font-mono rounded-xl p-2.5 bg-muted text-foreground">
            Time (hours) = Volume (mL) ÷ Rate (mL/hr)
          </p>
        </div>
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

function BloodTransfusionCalculator({ onBack }) {
  const [volume, setVolume] = useState('');
  const [hours, setHours] = useState('4');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const reset = () => { setVolume(''); setHours('4'); };

  const mlPerHour = volume && hours ? (parseFloat(volume) / parseFloat(hours)).toFixed(1) : null;
  const dropsPerMin = mlPerHour ? ((parseFloat(mlPerHour) * 15) / 60).toFixed(1) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">Blood Transfusion 🩸</h2>
            <p className="text-xs font-medium text-muted-foreground">Transfusion drip rate calculator</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="flex items-start gap-2.5 px-3 py-3 rounded-2xl text-xs border border-destructive/30"
          style={{ background: 'hsl(0,60%,96%)', color: 'hsl(0,52%,46%)' }}>
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5 text-destructive" />
          <span><span className="font-bold">Clinical Note:</span> Always follow local blood transfusion protocol. Monitor patient closely. Standard blood set = 15 gtt/mL.</span>
        </div>
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Volume (mL)</label>
            <input type="number" value={volume} onChange={e => setVolume(e.target.value)} placeholder="e.g. 450 (1 unit PRBC)"
              className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border font-medium bg-muted border-border text-foreground placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Duration (hours)</label>
            <div className="flex gap-2 mt-1.5">
              {[['2','2h'],['3','3h'],['4','4h'],['6','6h']].map(([val, lbl]) => (
                <button key={val} onClick={() => setHours(val)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95"
                  style={hours === val
                    ? { background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,48%)', borderColor: 'hsl(265,45%,75%)' }
                    : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {mlPerHour && (
          <div className="rounded-2xl p-5 border animate-slide-up space-y-3"
            style={{ background: 'hsl(0,55%,96%)', borderColor: 'hsl(0,45%,82%)' }}>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Infusion Rate</p>
              <p className="text-4xl font-black" style={{ color: 'hsl(0,52%,48%)' }}>
                {mlPerHour} <span className="text-lg font-semibold text-muted-foreground">mL/hr</span>
              </p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground">Drip Rate (15 gtt/mL set)</p>
              <p className="text-2xl font-black" style={{ color: 'hsl(0,48%,52%)' }}>{dropsPerMin} gtt/min</p>
            </div>
            <p className="text-xs text-muted-foreground">Volume ÷ Duration = {volume} ÷ {hours}h = {mlPerHour} mL/hr</p>
          </div>
        )}
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

function EDDCalculator({ onBack }) {
  const [lmp, setLmp] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const calcEDD = () => {
    if (!lmp) return null;
    const date = new Date(lmp);
    date.setDate(date.getDate() + 280);
    return date;
  };

  const edd = calcEDD();
  const today = new Date();
  const weeksPregnant = lmp ? Math.floor((today - new Date(lmp)) / (1000 * 60 * 60 * 24 * 7)) : null;
  const daysPregnant = lmp ? Math.floor((today - new Date(lmp)) / (1000 * 60 * 60 * 24)) : null;

  const formatDate = (date) => date.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  const getTrimester = (weeks) => {
    if (weeks < 0) return null;
    if (weeks <= 12) return { label: '1st Trimester', colorHsl: 'hsl(152,50%,38%)', bgHsl: 'hsl(152,50%,93%)', borderHsl: 'hsl(152,40%,76%)' };
    if (weeks <= 28) return { label: '2nd Trimester', colorHsl: 'hsl(220,60%,46%)', bgHsl: 'hsl(220,60%,93%)', borderHsl: 'hsl(220,50%,78%)' };
    if (weeks <= 40) return { label: '3rd Trimester', colorHsl: 'hsl(340,52%,48%)', bgHsl: 'hsl(340,55%,94%)', borderHsl: 'hsl(340,45%,80%)' };
    return { label: 'Post-term', colorHsl: 'hsl(28,65%,45%)', bgHsl: 'hsl(28,70%,94%)', borderHsl: 'hsl(28,58%,78%)' };
  };

  const trimester = weeksPregnant !== null ? getTrimester(weeksPregnant) : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-shrink-0 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-secondary text-primary">
            <ArrowLeft size={15} /><span className="text-xs font-semibold">Back</span>
          </button>
          <div>
            <h2 className="font-black text-foreground">Estimated Delivery Date 🤰</h2>
            <p className="text-xs font-medium text-muted-foreground">Naegele's Rule (LMP + 280 days)</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-3">
        <div className="rounded-2xl p-4 border card-shadow space-y-3 bg-card border-border">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Last Menstrual Period (LMP)</label>
            <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} max={new Date().toISOString().split('T')[0]}
              className="w-full mt-1.5 rounded-xl px-4 py-3 text-sm outline-none border font-medium bg-muted border-border text-foreground" />
          </div>
          {lmp && <button onClick={() => setLmp('')} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <RotateCcw size={13} /> Reset
          </button>}
        </div>
        {edd && (
          <div className="rounded-2xl p-5 border animate-slide-up space-y-3"
            style={{ background: 'hsl(340,55%,96%)', borderColor: 'hsl(340,45%,82%)' }}>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Estimated Due Date</p>
              <p className="text-2xl font-black" style={{ color: 'hsl(340,52%,48%)' }}>{formatDate(edd)}</p>
            </div>
            {weeksPregnant !== null && weeksPregnant >= 0 && (
              <div className="pt-3 border-t space-y-1.5" style={{ borderColor: 'hsl(340,40%,86%)' }}>
                <p className="text-xs font-semibold text-muted-foreground">Gestational Age Today</p>
                <p className="text-xl font-black" style={{ color: 'hsl(340,48%,52%)' }}>{weeksPregnant}w {daysPregnant % 7}d</p>
                {trimester && (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold border"
                    style={{ background: trimester.bgHsl, color: trimester.colorHsl, borderColor: trimester.borderHsl }}>
                    {trimester.label}
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">LMP + 280 days (Naegele's Rule)</p>
          </div>
        )}
        <div className="rounded-2xl p-4 border card-shadow bg-card border-border">
          <p className="text-[10px] font-black uppercase tracking-widest mb-2.5 text-primary">Trimester Guide</p>
          {[
            ['1st Trimester', 'Weeks 1–12', 'hsl(152,50%,38%)'],
            ['2nd Trimester', 'Weeks 13–28', 'hsl(220,60%,46%)'],
            ['3rd Trimester', 'Weeks 29–40', 'hsl(340,52%,48%)'],
          ].map(([label, range, color]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-xs font-bold" style={{ color }}>{label}</span>
              <span className="text-xs font-medium text-muted-foreground">{range}</span>
            </div>
          ))}
        </div>
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}

export default function CalculatorScreen() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (activeCalc === 'bmi') return <BMICalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'ivdrip') return <IVDripCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'fluidbalance') return <FluidBalanceCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'dose') return <DoseCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'infusiontime') return <InfusionTimeCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'bloodtransfusion') return <BloodTransfusionCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'edd') return <EDDCalculator onBack={() => setActiveCalc(null)} />;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 flex-shrink-0 bg-background">
        <div className="px-5 pt-4 pb-2 flex items-center gap-1">
          <div style={{ width: 72, height: 72, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src="https://media.base44.com/images/public/6a0f188f950f15d08b991324/5b6745fd0_ChatGPTImageMay23202604_49_53PM-Edited.png" alt="" style={{ position: 'absolute', width: 280, height: 'auto', top: -108, left: -100 }} />
          </div>
          <div className="animate-fade-in">
            <h1 className="text-2xl font-black text-foreground">Calculators</h1>
            <p className="text-xs font-medium text-muted-foreground">Nursing clinical calculators</p>
          </div>
        </div>
        <div className="h-1.5 pointer-events-none transition-opacity duration-200"
          style={{ background: 'linear-gradient(to bottom, rgba(147,92,210,0.07) 0%, transparent 100%)', opacity: isScrolled ? 1 : 0 }} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-2.5 animate-fade-in">
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs border"
          style={{ background: 'hsl(38,80%,96%)', borderColor: 'hsl(38,60%,82%)', color: 'hsl(38,55%,42%)' }}>
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(38,65%,48%)' }} />
          <span>Always verify clinical calculations with a qualified practitioner. Educational reference only.</span>
        </div>

        {calculators.map(calc => (
          <button
            key={calc.id}
            onClick={() => setActiveCalc(calc.id)}
            className="w-full rounded-2xl p-4 border text-left flex items-center justify-between transition-all active:scale-[0.98] card-shadow bg-card border-border hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-secondary border border-border">
                {calc.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{calc.name}</p>
                <p className="text-xs font-medium mt-0.5 text-muted-foreground">{calc.desc}</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        ))}

        <DisclaimerBanner />
        <div className="h-2" />
      </div>
    </div>
  );
}