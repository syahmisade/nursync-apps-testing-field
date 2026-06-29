import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, AlertTriangle, Search, CheckSquare, Square, X } from 'lucide-react';
import AdminFormModal from './AdminFormModal';
import AdminCsvBar from './AdminCsvBar';

// Reusable CRUD manager for a Base44 entity.
// props:
//   entityName  - e.g. 'Medicine'
//   queryKey    - react-query key, e.g. 'medicines'
//   titleField  - field used as the row title
//   subtitleField - optional field shown under the title
//   fields      - field config passed to AdminFormModal
//   nextLegacyId - given current records, returns next legacyId
export default function AdminEntityManager({ entityName, queryKey, titleField, subtitleField, fields, sortField, validate, noLegacyId }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // record or {} for new
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteError, setDeleteError] = useState('');
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState({ done: 0, total: 0 });

  const { data: records = [], isLoading } = useQuery({
    queryKey: [queryKey, 'admin'],
    queryFn: () => base44.entities[entityName].list(sortField || '-created_date', 500),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: [queryKey, 'admin'] });
    qc.invalidateQueries({ queryKey: [queryKey] });
  };

  const saveMutation = useMutation({
    mutationFn: (values) => {
      if (editing?.id) return base44.entities[entityName].update(editing.id, values);
      if (noLegacyId) return base44.entities[entityName].create(values);
      const maxLegacy = records.reduce((m, r) => Math.max(m, r.legacyId || 0), 0);
      return base44.entities[entityName].create({ ...values, legacyId: maxLegacy + 1 });
    },
    onSuccess: () => { invalidate(); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities[entityName].delete(id),
    onMutate: () => setDeleteError(''),
    onSuccess: () => { invalidate(); setConfirmDelete(null); },
    onError: (error) => {
      setDeleteError(error?.message || `Could not delete this ${entityName.toLowerCase()}. Please try again.`);
    },
  });

  const deleteRecordsInBatches = async (ids) => {
    const batchSize = 10;
    setBulkDeleteProgress({ done: 0, total: ids.length });

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      await Promise.all(batch.map(id => base44.entities[entityName].delete(id)));
      setBulkDeleteProgress({ done: Math.min(i + batch.length, ids.length), total: ids.length });
    }
  };

  const bulkDeleteMutation = useMutation({
    mutationFn: deleteRecordsInBatches,
    onMutate: () => {
      setDeleteError('');
      setBulkDeleteProgress({ done: 0, total: selectedIds.length });
    },
    onSuccess: () => {
      invalidate();
      setSelectedIds([]);
      setConfirmBulkDelete(false);
      setBulkDeleteProgress({ done: 0, total: 0 });
    },
    onError: (error) => {
      setDeleteError(error?.message || `Could not delete selected ${entityName.toLowerCase()} records. Please try again.`);
    },
    onSettled: invalidate,
  });

  const q = search.trim().toLowerCase();
  const filtered = q
    ? records.filter(r =>
        [r[titleField], r[subtitleField]]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      )
    : records;
  const visibleIds = filtered.map(r => r.id);
  const selectedVisibleCount = selectedIds.filter(id => visibleIds.includes(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const selectedCount = selectedIds.length;

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectVisible = () => {
    setSelectedIds(prev => {
      if (allVisibleSelected) return prev.filter(id => !visibleIds.includes(id));
      return Array.from(new Set([...prev, ...visibleIds]));
    });
  };

  const handleImport = async (rows) => {
    let nextLegacy = records.reduce((m, r) => Math.max(m, r.legacyId || 0), 0);
    const payload = rows.map(r => {
      const clean = { ...r };
      delete clean.legacyId;
      if (noLegacyId) return clean;
      nextLegacy += 1;
      return { ...clean, legacyId: nextLegacy };
    });
    await base44.entities[entityName].bulkCreate(payload);
    invalidate();
    return payload.length;
  };

  return (
    <div className="space-y-2.5">
      <button
        onClick={() => setEditing({})}
        className="w-full rounded-2xl py-3 text-sm font-black text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}
      >
        <Plus size={16} /> Add {entityName}
      </button>

      <AdminCsvBar
        entityName={entityName}
        fields={fields}
        records={records}
        onImport={handleImport}
      />

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${entityName.toLowerCase()}…`}
          className="w-full h-10 rounded-2xl border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </div>

      {records.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-2.5 card-shadow">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSelectVisible}
              disabled={filtered.length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-secondary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {allVisibleSelected ? <CheckSquare size={15} /> : <Square size={15} />}
              {allVisibleSelected ? 'Unselect visible' : 'Select visible'}
            </button>
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground"
                aria-label="Clear selection"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {selectedCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <p className="flex-1 text-xs font-bold text-muted-foreground">
                {selectedCount} selected
              </p>
              <button
                type="button"
                onClick={() => { setDeleteError(''); setConfirmBulkDelete(true); }}
                className="flex items-center gap-1.5 rounded-xl bg-destructive px-3 py-2 text-xs font-black text-destructive-foreground"
              >
                <Trash2 size={14} />
                Delete selected
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          {q ? `No matches for “${search.trim()}”.` : 'No records yet.'}
        </p>
      ) : (
        filtered.map(rec => {
          const isSelected = selectedIds.includes(rec.id);
          return (
          <div key={rec.id} className="rounded-2xl border p-3.5 flex items-start gap-3 bg-card border-border card-shadow">
            <button
              type="button"
              onClick={() => toggleSelect(rec.id)}
              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-secondary text-muted-foreground'
              }`}
              aria-label={isSelected ? `Unselect ${rec[titleField]}` : `Select ${rec[titleField]}`}
              aria-pressed={isSelected}
            >
              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{rec[titleField]}</p>
              {subtitleField && (
                <p className="text-xs font-medium text-muted-foreground truncate">{rec[subtitleField]}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setEditing(rec)} className="p-2 rounded-xl bg-secondary text-primary" aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => { setDeleteError(''); setConfirmDelete(rec); }} className="p-2 rounded-xl bg-destructive/10 text-destructive" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          );
        })
      )}

      {editing && (
        <AdminFormModal
          title={editing.id ? `Edit ${entityName}` : `New ${entityName}`}
          fields={fields}
          initial={editing}
          saving={saveMutation.isPending}
          validate={validate}
          onSave={(values) => saveMutation.mutate(values)}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5" style={{ background: 'rgba(20, 16, 28, 0.52)' }} role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-destructive/10 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-black text-foreground">Delete this {entityName.toLowerCase()}?</h2>
            <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
              "{confirmDelete[titleField]}" will be permanently removed for all users. This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {deleteError && (
                <div className="col-span-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold leading-snug text-destructive">
                  {deleteError}
                </div>
              )}
              <button onClick={() => setConfirmDelete(null)} disabled={deleteMutation.isPending} className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border disabled:opacity-60">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(confirmDelete.id)} disabled={deleteMutation.isPending} className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground disabled:opacity-60">
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmBulkDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5" style={{ background: 'rgba(20, 16, 28, 0.52)' }} role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-destructive/10 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-black text-foreground">Delete selected {entityName.toLowerCase()} records?</h2>
            <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
              {selectedCount} selected record{selectedCount === 1 ? '' : 's'} will be permanently removed for all users. This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {bulkDeleteMutation.isPending && bulkDeleteProgress.total > 0 && (
                <p className="col-span-2 text-xs font-bold text-muted-foreground">
                  Deleted {bulkDeleteProgress.done} of {bulkDeleteProgress.total} records...
                </p>
              )}
              {deleteError && (
                <div className="col-span-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold leading-snug text-destructive">
                  {deleteError}
                </div>
              )}
              <button onClick={() => setConfirmBulkDelete(false)} disabled={bulkDeleteMutation.isPending} className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border disabled:opacity-60">
                Cancel
              </button>
              <button
                onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                disabled={bulkDeleteMutation.isPending}
                className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground disabled:opacity-60"
              >
                {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete selected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
