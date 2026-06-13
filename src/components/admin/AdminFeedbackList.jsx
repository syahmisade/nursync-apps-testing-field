import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Lightbulb, ClipboardList, MailQuestion, MessageSquare, Sparkles } from 'lucide-react';
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
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['feedback', 'admin'],
    queryFn: () => base44.entities.Feedback.list('-created_date', 200),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['feedback', 'admin'] });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Feedback.update(id, { status }),
    onSuccess: invalidate,
  });

  const deleteItem = useMutation({
    mutationFn: (id) => base44.entities.Feedback.delete(id),
    onSuccess: invalidate,
  });

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
      {items.map(item => {
        const meta = TYPE_META[item.feedbackType] || TYPE_META.general;
        return (
          <div key={item.id} className="rounded-2xl border p-3.5 bg-card border-border card-shadow">
            <div className="flex items-start gap-2.5">
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
    </div>
  );
}
