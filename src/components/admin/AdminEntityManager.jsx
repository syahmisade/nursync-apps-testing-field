import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import AdminFormModal from './AdminFormModal';

// Reusable CRUD manager for a Base44 entity.
// props:
//   entityName  - e.g. 'Medicine'
//   queryKey    - react-query key, e.g. 'medicines'
//   titleField  - field used as the row title
//   subtitleField - optional field shown under the title
//   fields      - field config passed to AdminFormModal
//   nextLegacyId - given current records, returns next legacyId
export default function AdminEntityManager({ entityName, queryKey, titleField, subtitleField, fields, sortField }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // record or {} for new
  const [confirmDelete, setConfirmDelete] = useState(null);

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
      const maxLegacy = records.reduce((m, r) => Math.max(m, r.legacyId || 0), 0);
      return base44.entities[entityName].create({ ...values, legacyId: maxLegacy + 1 });
    },
    onSuccess: () => { invalidate(); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities[entityName].delete(id),
    onSuccess: () => { invalidate(); setConfirmDelete(null); },
  });

  return (
    <div className="space-y-2.5">
      <button
        onClick={() => setEditing({})}
        className="w-full rounded-2xl py-3 text-sm font-black text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}
      >
        <Plus size={16} /> Add {entityName}
      </button>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        records.map(rec => (
          <div key={rec.id} className="rounded-2xl border p-3.5 flex items-start gap-3 bg-card border-border card-shadow">
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
              <button onClick={() => setConfirmDelete(rec)} className="p-2 rounded-xl bg-destructive/10 text-destructive" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))
      )}

      {editing && (
        <AdminFormModal
          title={editing.id ? `Edit ${entityName}` : `New ${entityName}`}
          fields={fields}
          initial={editing}
          saving={saveMutation.isPending}
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
              <button onClick={() => setConfirmDelete(null)} className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(confirmDelete.id)} disabled={deleteMutation.isPending} className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground disabled:opacity-60">
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}