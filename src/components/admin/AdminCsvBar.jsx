import React, { useRef, useState } from 'react';
import { Download, Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { recordsToCsv, csvToRecords, downloadCsv } from '@/lib/csv';

// Import/export bar for the admin Content Manager.
// props:
//   entityName, fields  - field config (matches AdminFormModal)
//   records             - current records (for export)
//   onImport(records)   - async; receives parsed records to bulk-create
export default function AdminCsvBar({ entityName, fields, records, onImport }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok, message }

  const handleExport = () => {
    const csv = recordsToCsv(records, fields);
    downloadCsv(`${entityName.toLowerCase()}-export.csv`, csv);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setResult(null);
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = csvToRecords(text, fields);
      if (parsed.length === 0) {
        setResult({ ok: false, message: 'No rows found. Check that the CSV has a header row matching the export format.' });
        return;
      }
      const count = await onImport(parsed);
      setResult({ ok: true, message: `Imported ${count} ${entityName.toLowerCase()} record${count === 1 ? '' : 's'}.` });
    } catch (err) {
      setResult({ ok: false, message: err?.message || 'Import failed. Please check your CSV file.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-2.5 space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleExport}
          className="rounded-xl py-2.5 text-xs font-black flex items-center justify-center gap-1.5 bg-card text-foreground border border-border active:scale-[0.98] transition-all"
        >
          <Download size={14} /> Export CSV
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-xl py-2.5 text-xs font-black flex items-center justify-center gap-1.5 bg-card text-foreground border border-border active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy ? 'Importing…' : 'Import CSV'}
        </button>
      </div>

      <p className="text-[11px] leading-snug text-muted-foreground px-0.5">
        Tip: Export first to get the correct column format. Multi-value fields use “|” between items.
      </p>

      {result && (
        <div
          className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs font-bold leading-snug ${
            result.ok
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {result.ok ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />}
          <span>{result.message}</span>
        </div>
      )}

      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
    </div>
  );
}