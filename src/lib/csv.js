// Lightweight CSV helpers for the admin Content Manager.
// `fields` is the same config used by AdminFormModal:
//   [{ key, type: 'text'|'textarea'|'number'|'list'|'select', ... }]
// List fields are stored in a single CSV cell, items separated by " | ".

const LIST_SEP = ' | ';

function escapeCell(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convert an array of records into a CSV string based on field config.
export function recordsToCsv(records, fields) {
  const headers = fields.map(f => f.key);
  const lines = [headers.map(escapeCell).join(',')];

  records.forEach(rec => {
    const row = fields.map(f => {
      const v = rec[f.key];
      if (f.type === 'list') {
        return escapeCell(Array.isArray(v) ? v.join(LIST_SEP) : '');
      }
      return escapeCell(v);
    });
    lines.push(row.join(','));
  });

  return lines.join('\n');
}

// Parse a CSV string into raw rows (array of string arrays), handling quotes.
function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell); cell = '';
    } else if (ch === '\n') {
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else {
      cell += ch;
    }
  }
  if (inQuotes) throw new Error('CSV contains an unterminated quoted field.');
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

// Convert a CSV string into typed records ready for entity.create().
export function csvToRecords(text, fields) {
  const rows = parseCsvRows(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim());
  const fieldByKey = Object.fromEntries(fields.map(f => [f.key, f]));

  const duplicateHeader = headers.find((header, index) => headers.indexOf(header) !== index);
  if (duplicateHeader) throw new Error(`CSV contains a duplicate "${duplicateHeader}" column.`);

  const unknownHeaders = headers.filter(header => header && !fieldByKey[header]);
  if (unknownHeaders.length) throw new Error(`Unknown CSV column${unknownHeaders.length === 1 ? '' : 's'}: ${unknownHeaders.join(', ')}.`);

  const missingHeaders = fields.filter(f => f.required && !headers.includes(f.key));
  if (missingHeaders.length) throw new Error(`Missing required CSV column${missingHeaders.length === 1 ? '' : 's'}: ${missingHeaders.map(f => f.key).join(', ')}.`);

  return rows.slice(1).map((cols, rowIndex) => {
    if (cols.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} has ${cols.length} columns; expected ${headers.length}. Check commas and quotation marks.`);
    }
    const out = {};
    headers.forEach((key, idx) => {
      const f = fieldByKey[key];
      if (!f) return;
      const raw = (cols[idx] ?? '').trim();
      if (f.type === 'list') {
        out[key] = raw ? raw.split(LIST_SEP).map(s => s.trim()).filter(Boolean) : [];
      } else if (f.type === 'number') {
        const number = raw === '' ? null : Number(raw);
        if (number !== null && !Number.isFinite(number)) {
          throw new Error(`CSV row ${rowIndex + 2} has an invalid number in "${key}".`);
        }
        out[key] = number;
      } else {
        out[key] = raw;
      }
    });
    return out;
  });
}

// Trigger a browser download of a CSV string.
export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
