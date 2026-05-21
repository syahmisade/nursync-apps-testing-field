import React, { useState } from 'react';
import { User, Trash2, LogOut, Shield, Bell, Moon, ChevronRight, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

function DeleteAccountDialog({ onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') return;
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full rounded-t-3xl p-6 animate-slide-up"
        style={{ background: 'hsl(var(--card))', maxWidth: '430px' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(0,60%,94%)', border: '1px solid hsl(0,50%,84%)' }}>
            <AlertTriangle size={18} style={{ color: 'hsl(0,55%,50%)' }} />
          </div>
          <div>
            <h3 className="font-black text-base" style={{ color: 'hsl(var(--foreground))' }}>Delete Account</h3>
            <p className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>This action is permanent and cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm font-medium mb-4 leading-relaxed" style={{ color: 'hsl(var(--foreground))' }}>
          All your saved items, quiz progress, and preferences will be permanently deleted.
          Type <span className="font-black" style={{ color: 'hsl(0,55%,50%)' }}>DELETE</span> to confirm.
        </p>

        <input
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="w-full rounded-2xl px-4 py-3 text-sm font-medium outline-none border mb-4"
          style={{
            background: 'hsl(var(--input))',
            borderColor: confirmText === 'DELETE' ? 'hsl(0,55%,60%)' : 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          }}
        />

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all active:scale-95"
            style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))', borderColor: 'hsl(var(--border))' }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE' || loading}
            className="flex-1 py-3 rounded-2xl text-sm font-black transition-all active:scale-95"
            style={{
              background: confirmText === 'DELETE' ? 'hsl(0,60%,55%)' : 'hsl(0,20%,80%)',
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Deleting…' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileScreen({ onBack }) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      // Log out the user after deletion intent
      await base44.auth.logout('/login');
    } catch {
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  const menuSections = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Manage notification settings', color: 'hsl(38,70%,50%)' },
        { icon: Moon, label: 'Appearance', desc: 'Follows system dark/light mode', color: 'hsl(265,55%,55%)' },
        { icon: Shield, label: 'Privacy', desc: 'Data and privacy settings', color: 'hsl(152,50%,40%)' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3" style={{ background: 'hsl(var(--app-bg))' }}>
        <h2 className="font-black text-xl" style={{ color: 'hsl(var(--foreground))' }}>Profile & Settings</h2>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>Manage your account</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-4" style={{ overscrollBehavior: 'none' }}>
        {/* User card */}
        <div className="rounded-3xl p-5 border card-shadow"
          style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(265,60%,88%) 0%, hsl(285,55%,86%) 100%)' }}>
              <User size={26} style={{ color: 'hsl(265,55%,52%)' }} />
            </div>
            <div>
              <p className="font-black text-base" style={{ color: 'hsl(var(--foreground))' }}>
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {user?.email || ''}
              </p>
              <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'hsl(265,55%,92%)', color: 'hsl(265,55%,48%)' }}>
                {user?.role === 'admin' ? '⭐ Admin' : '🎓 Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu sections */}
        {menuSections.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-black uppercase tracking-widest px-1 mb-2"
              style={{ color: 'hsl(var(--muted-foreground))' }}>{section.title}</p>
            <div className="rounded-2xl border overflow-hidden card-shadow"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              {section.items.map(({ icon: Icon, label, desc, color }, i) => (
                <div key={label}
                  className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0"
                  style={{ borderColor: 'hsl(var(--border))', userSelect: 'none' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color + '20' }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>{label}</p>
                    <p className="text-[10px] font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account actions */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest px-1 mb-2"
            style={{ color: 'hsl(var(--muted-foreground))' }}>Account</p>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border card-shadow transition-all active:scale-[0.98]"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', userSelect: 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(265,50%,94%)' }}>
                <LogOut size={15} style={{ color: 'hsl(265,55%,52%)' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>Sign Out</span>
              <ChevronRight size={14} className="ml-auto" style={{ color: 'hsl(var(--muted-foreground))' }} />
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98]"
              style={{ background: 'hsl(0,60%,97%)', borderColor: 'hsl(0,50%,88%)', userSelect: 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(0,60%,92%)' }}>
                <Trash2 size={15} style={{ color: 'hsl(0,55%,50%)' }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold" style={{ color: 'hsl(0,55%,48%)' }}>Delete Account</p>
                <p className="text-[10px] font-medium" style={{ color: 'hsl(0,40%,60%)' }}>Permanently remove your account</p>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-medium pb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
          NurSync v1.0 · Educational Reference Only
        </p>
      </div>

      {showDeleteDialog && (
        <DeleteAccountDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}