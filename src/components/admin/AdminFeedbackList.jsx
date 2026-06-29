import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Lightbulb, ClipboardList, MailQuestion, MessageSquare, Sparkles, CheckSquare, Square, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const TYPE_META = {
  medicine_suggestion: { label: 'Medicine', Icon: Lightbulb, tone: 'amber' },
  procedure_suggestion: { label: 'Procedure', Icon: ClipboardList, tone: 'success' },
  feature_suggestion: { label: 'Feature', Icon: Sparkles, tone: 'blue' },
  content_report: { label: 'Report', Icon: MailQuestion, tone: 'danger' },
  general: { label: 'General', Icon: MessageSquare, tone: 'blue' },
};

const STATUSES = ['new', 'reviewed', 'resolved'];

export default function AdminFeedbackList() {
  const qc = useQueryClient();
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['feedback', 'admin'],
    queryFn: () => base44.entities.Feedback.list('-created_date', 200),
  });

  const refreshFeedback = async () => {
    await qc.invalidateQueries({ queryKey: ['feedback'], exact: false, refetchType: 'all' });
    await qc.refetchQueries({ queryKey: ['feedback'], exact: false, type: 'all' });
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Feedback.update(id, { status }),
    onSuccess: refreshFeedback,
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ ids, status }) => Promise.all(ids.map(id => base44.entities.Feedback.update(id, { status }))),
    onSuccess: async () => {
      await refreshFeedback();
      setSelectedIds([]);
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id) => base44.entities.Feedback.delete(id),
    onSuccess: refreshFeedback,
  });

  const bulkDelete = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => base44.entities.Feedback.delete(id))),
    onSuccess: async () => {
      await refreshFeedback();
      setSelectedIds([]);
      setConfirmBulkDelete(false);
    },
  });

  const visibleIds = items.map(item => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));
  const selectedCount = selectedIds.length;

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectVisible = () => {
    setSelectedIds(prev => allVisibleSelected ? [] : Array.from(new Set([...prev, ...visibleIds])));
  };

  const markSelected = (status) => {
    if (selectedCount === 0) return;
    bulkUpdateStatus.mutate({ ids: selectedIds, status });
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="w-7 h-7 mx-auto border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-secondary text-muted-foreground">
          <MessageSquare size={26} />
        </div>
        <p className="text-sm font-bold text-foreground">No feedback yet</p>
        <p className="text-xs text-muted-foreground mt-1">User suggestions and reports will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="rounded-2xl border border-border bg-card p-2.5 card-shadow">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectVisible}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-secondary-foreground transition-all active:scale-[0.98]"
          >
            {allVisibleSelected ? <CheckSquare size={15} /> : <Square size={15} />}
            {allVisibleSelected ? 'Unselect all' : 'Select all'}
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
          <div className="mt-2 space-y-2">
            <p className="text-xs font-bold text-muted-foreground">
              {selectedCount} selected
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => markSelected('reviewed')}
                disabled={bulkUpdateStatus.isPending}
                className="flex items-center justify-center gap-1 rounded-xl bg-secondary px-2 py-2 text-[11px] font-black text-primary disabled:opacity-60"
              >
                <CheckCircle2 size={13} />
                Reviewed
              </button>
              <button
                type="button"
                onClick={() => markSelected('resolved')}
                disabled={bulkUpdateStatus.isPending}
                className="flex items-center justify-center gap-1 rounded-xl bg-primary px-2 py-2 text-[11px] font-black text-primary-foreground disabled:opacity-60"
              >
                <CheckCircle2 size={13} />
                Resolved
              </button>
              <button
                type="button"
                onClick={() => setConfirmBulkDelete(true)}
                className="flex items-center justify-center gap-1 rounded-xl bg-destructive px-2 py-2 text-[11px] font-black text-destructive-foreground"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {items.map(item => {
        const meta = TYPE_META[item.feedbackType] || TYPE_META.general;
        const isSelected = selectedIds.includes(item.id);
        return (
          <div key={item.id} className="rounded-2xl border p-3.5 bg-card border-border card-shadow">
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => toggleSelect(item.id)}
                className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-secondary text-muted-foreground'
                }`}
                aria-label={isSelected ? 'Unselect feedback' : 'Select feedback'}
                aria-pressed={isSelected}
              >
                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="semantic-pill" data-tone={meta.tone}>
                    <meta.Icon size={11} className="mr-1" /> {meta.label}
                  </span>
                  {item.created_date && (
                    <span className="text-[11px] text-muted-foreground">{format(new Date(item.created_date), 'd MMM yyyy')}</span>
                  )}
                </div>
                {item.subject && <p className="font-bold text-sm text-foreground">{item.subject}</p>}
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                {item.submitterEmail && (
                  <p className="text-[11px] text-muted-foreground mt-1.5">From: {item.submitterEmail}</p>
                )}
              </div>
              <button
                onClick={() => deleteItem.mutate(item.id)}
                className="p-2 rounded-xl bg-destructive/10 text-destructive flex-shrink-0"
                aria-label="Delete feedback"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus.mutate({ id: item.id, status: s })}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-black capitalize transition-all ${
                    (item.status || 'new') === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {confirmBulkDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5" style={{ background: 'rgba(20, 16, 28, 0.52)' }} role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-destructive/10 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-black text-foreground">Delete selected feedback?</h2>
            <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
              {selectedCount} selected feedback item{selectedCount === 1 ? '' : 's'} will be permanently removed. This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => setConfirmBulkDelete(false)} className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border">
                Cancel
              </button>
              <button
                onClick={() => bulkDelete.mutate(selectedIds)}
                disabled={bulkDelete.isPending}
                className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground disabled:opacity-60"
              >
                {bulkDelete.isPending ? 'Deleting...' : 'Delete selected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
