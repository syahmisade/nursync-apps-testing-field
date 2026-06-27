import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, BookOpen, Calculator, Check, ChevronRight, ClipboardList,
  Database, GraduationCap, Info, Lightbulb, LogOut, MailQuestion, Moon, Pill, School,
  ShieldAlert, ShieldCheck, Sparkles, Trash2, UserRound, X
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { base44 } from '@/api/base44Client';
import { StatusPanel } from '@/components/Semantic';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import MobileSelect from '@/components/MobileSelect';

const LEARNING_PROFILE_KEY = 'nursync_learning_profile';
const DEFAULT_START_SECTION_KEY = 'nursync_default_start_section';

const defaultLearningProfile = {
  institution: '',
  studyLevel: 'General nursing learning'
};

const studyLevelOptions = [
  'General nursing learning',
  'Year 1 nursing student',
  'Year 2 nursing student',
  'Year 3 nursing student',
  'Clinical placement',
  'Staff nurse revision'
].map(value => ({ value, label: value }));

const startSectionOptions = [
  { value: 'medicine', label: 'Medicine', path: '/medicine' },
  { value: 'calculators', label: 'Calculators', path: '/calculators' },
  { value: 'procedures', label: 'Procedures', path: '/procedures' },
  { value: 'quiz', label: 'Quiz', path: '/quiz' },
  { value: 'saved', label: 'Saved', path: '/saved' }
];

function loadLearningProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEARNING_PROFILE_KEY) || '{}');
    return { ...defaultLearningProfile, ...saved };
  } catch {
    return defaultLearningProfile;
  }
}

function loadDefaultStartSection() {
  const saved = localStorage.getItem(DEFAULT_START_SECTION_KEY);
  return startSectionOptions.some(option => option.value === saved) ? saved : 'medicine';
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-black uppercase tracking-widest px-1 pb-1.5 text-muted-foreground">
      {children}
    </p>
  );
}

function SettingsRow({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  sublabel,
  onClick,
  chevron = true,
  danger = false,
  disabled = false,
  accessory = null
}) {
  const interactive = Boolean(onClick) && !disabled;
  const content = (
    <>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold leading-tight"
          style={{ color: danger ? 'hsl(0,58%,45%)' : 'hsl(var(--foreground))' }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-[11px] mt-0.5 leading-tight text-muted-foreground">
            {sublabel}
          </p>
        )}
      </div>
      {accessory}
      {chevron && interactive && <ChevronRight size={15} className="text-muted-foreground" />}
    </>
  );

  if (!interactive) {
    return (
      <div
        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all cursor-default ${
          disabled ? 'opacity-75' : ''
        }`}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all active:scale-[0.99] ${
        disabled ? 'opacity-75' : ''
      }`}
    >
      {content}
    </button>
  );
}

function SettingsCard({ children }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden card-shadow app-card divide-y"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      {children}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const toneStyles = {
    purple: ['hsl(265,55%,92%)', 'hsl(265,55%,48%)'],
    green: ['hsl(152,50%,92%)', 'hsl(152,50%,38%)'],
    blue: ['hsl(205,70%,92%)', 'hsl(205,70%,38%)'],
    amber: ['hsl(38,85%,92%)', 'hsl(38,70%,45%)']
  };
  const [bg, color] = toneStyles[tone] || toneStyles.purple;

  return (
    <div className="rounded-2xl border p-3 bg-card border-border">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ background: bg, color }}
      >
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <p className="text-xl font-black leading-none text-foreground">{value}</p>
      <p className="text-[11px] font-bold mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}

export default function ProfileScreen() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accountConfirmOpen, setAccountConfirmOpen] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [accountDeleteError, setAccountDeleteError] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null); // { type, title }
  const [profileOpen, setProfileOpen] = useState(false);
  const [learningProfile, setLearningProfile] = useState(loadLearningProfile);
  const [profileDraft, setProfileDraft] = useState(learningProfile);
  const [defaultStartSection, setDefaultStartSection] = useState(loadDefaultStartSection);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    savedMedicines,
    savedProcedures,
    savedQuizQuestions,
    quizProgress,
    clearAllData,
    isLoadingAppData
  } = useApp();
  const { isDark, toggleTheme } = useTheme();

  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Nursing Student';
  const quizStats = useMemo(() => {
    const attempts = Object.values(quizProgress || {});
    if (attempts.length === 0) {
      return {
        label: 'No quiz progress yet',
        bestScore: 'Start'
      };
    }

    const bestPercent = Math.max(
      ...attempts.map(item => Math.round((item.score / item.total) * 100))
    );
    const totalAnswered = attempts.reduce((sum, item) => sum + item.total, 0);

    return {
      label: `${attempts.length} quiz set${attempts.length === 1 ? '' : 's'} completed`,
      bestScore: `${bestPercent}%`,
      totalAnswered
    };
  }, [quizProgress]);

  const deleteUserProfile = async () => {
    const deleteMethods = ['deleteMe', 'deleteAccount', 'deleteUser', 'removeMe'];
    const methodName = deleteMethods.find(name => typeof base44.auth?.[name] === 'function');

    if (methodName) {
      await base44.auth[methodName]();
      return;
    }

    const currentUser = await base44.auth.me();
    if (!currentUser?.id) {
      throw new Error('Could not identify the current user profile.');
    }
    await base44.entities.User.delete(currentUser.id);
  };

  const handleDelete = async () => {
    await clearAllData();
    localStorage.removeItem(LEARNING_PROFILE_KEY);
    localStorage.removeItem(DEFAULT_START_SECTION_KEY);
    setLearningProfile(defaultLearningProfile);
    setDefaultStartSection('medicine');
    setDeleted(true);
    setConfirmOpen(false);
  };

  const openProfileEditor = () => {
    setProfileDraft(learningProfile);
    setProfileOpen(true);
  };

  const saveLearningProfile = () => {
    const nextProfile = {
      institution: profileDraft.institution.trim(),
      studyLevel: profileDraft.studyLevel
    };

    localStorage.setItem(LEARNING_PROFILE_KEY, JSON.stringify(nextProfile));
    setLearningProfile(nextProfile);
    setProfileOpen(false);
  };

  const saveDefaultStartSection = (value) => {
    localStorage.setItem(DEFAULT_START_SECTION_KEY, value);
    setDefaultStartSection(value);
  };

  const handleDeleteAccount = async () => {
    setAccountDeleteError('');
    setAccountDeleting(true);
    try {
      await clearAllData();
      await deleteUserProfile();
      localStorage.removeItem(LEARNING_PROFILE_KEY);
      localStorage.removeItem(DEFAULT_START_SECTION_KEY);
      logout('/login');
    } catch (error) {
      setAccountDeleteError(error?.message || 'Could not delete your account. Please try again.');
      setAccountDeleting(false);
    }
  };

  const selectedStartSection = startSectionOptions.find(option => option.value === defaultStartSection)
    || startSectionOptions[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide main-scroll pt-2">
        <div className="mx-4 rounded-3xl px-5 pt-5 pb-5 flex flex-col items-center gap-3 animate-fade-in bg-secondary border border-border">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, hsl(265,60%,58%) 0%, hsl(285,55%,62%) 100%)' }}
          >
            <UserRound size={34} color="white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="text-lg font-black leading-tight text-foreground">
              {user?.full_name || 'Student Nurse'}
            </p>
            <p className="text-xs font-medium mt-0.5 text-muted-foreground">
              {user?.email || 'Local demo account'}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-black bg-card text-primary border border-border">
            {roleLabel}
          </div>
        </div>

        <div className="px-4 pt-4 pb-8 space-y-4 animate-fade-in">
          {deleted && (
            <StatusPanel tone="success">
              <ShieldCheck size={16} />
              <p className="text-sm font-bold">Local account data cleared.</p>
            </StatusPanel>
          )}

          <div>
            <SectionLabel>Learning Summary</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              <SummaryCard icon={Pill} label="Saved medicines" value={isLoadingAppData ? '...' : savedMedicines.length} tone="purple" />
              <SummaryCard icon={ClipboardList} label="Saved procedures" value={isLoadingAppData ? '...' : savedProcedures.length} tone="green" />
              <SummaryCard icon={BookOpen} label="Saved quiz items" value={isLoadingAppData ? '...' : savedQuizQuestions.length} tone="blue" />
              <SummaryCard icon={Sparkles} label={isLoadingAppData ? 'Loading quiz progress' : quizStats.label} value={isLoadingAppData ? '...' : quizStats.bestScore} tone="amber" />
            </div>
          </div>

          <div>
            <SectionLabel>Learning Profile</SectionLabel>
            <SettingsCard>
              <SettingsRow
                icon={GraduationCap}
                iconColor="hsl(265,55%,48%)"
                iconBg="hsl(265,55%,92%)"
                label="Role"
                sublabel={roleLabel}
                onClick={openProfileEditor}
              />
              <SettingsRow
                icon={School}
                iconColor="hsl(205,70%,38%)"
                iconBg="hsl(205,70%,92%)"
                label="Institution"
                sublabel={learningProfile.institution || 'Not set yet'}
                onClick={openProfileEditor}
              />
              <SettingsRow
                icon={BookOpen}
                iconColor="hsl(152,50%,38%)"
                iconBg="hsl(152,50%,92%)"
                label="Study level"
                sublabel={learningProfile.studyLevel}
                onClick={openProfileEditor}
              />
            </SettingsCard>
          </div>

          {user?.role === 'admin' && (
            <div>
              <SectionLabel>Admin</SectionLabel>
              <SettingsCard>
                <SettingsRow
                  icon={Database}
                  iconColor="hsl(265,55%,48%)"
                  iconBg="hsl(265,55%,92%)"
                  label="Content Manager"
                  sublabel="Add, edit & remove medicines and procedures"
                  onClick={() => navigate('/admin')}
                />
              </SettingsCard>
            </div>
          )}

          <div>
            <SectionLabel>Preferences</SectionLabel>
            <SettingsCard>
              <SettingsRow
                icon={Moon}
                iconColor="hsl(265,55%,48%)"
                iconBg="hsl(265,55%,92%)"
                label="Dark mode"
                sublabel={isDark ? 'Dark theme is active' : 'Light theme is active'}
                onClick={toggleTheme}
                chevron={false}
                accessory={(
                  <span onClick={event => event.stopPropagation()}>
                    <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
                  </span>
                )}
              />
              <SettingsRow
                icon={Calculator}
                iconColor="hsl(205,70%,38%)"
                iconBg="hsl(205,70%,92%)"
                label="Default start section"
                sublabel={`Open ${selectedStartSection.label} when launching NurSync`}
                chevron={false}
                accessory={(
                  <span className="w-[142px]" onClick={event => event.stopPropagation()}>
                    <MobileSelect
                    value={defaultStartSection}
                    onChange={saveDefaultStartSection}
                    label="Default start section"
                    description="Choose the first section NurSync opens."
                    options={startSectionOptions}
                    buttonClassName="min-h-8 px-2 py-1.5 text-xs"
                  />
                  </span>
                )}
              />
            </SettingsCard>
          </div>

          <div>
            <SectionLabel>Safety & Disclaimer</SectionLabel>
            <SettingsCard>
              <SettingsRow
                icon={ShieldAlert}
                iconColor="hsl(0,58%,48%)"
                iconBg="hsl(0,60%,95%)"
                label="Educational use only"
                sublabel="NurSync supports learning and revision. It is not for clinical decision-making."
                chevron={false}
              />
              <SettingsRow
                icon={BookOpen}
                iconColor="hsl(152,50%,38%)"
                iconBg="hsl(152,50%,92%)"
                label="Follow local policy"
                sublabel="Always verify with current MOH guidance, institutional SOPs, and your clinical supervisor."
                chevron={false}
              />
              <SettingsRow
                icon={Info}
                iconColor="hsl(38,70%,45%)"
                iconBg="hsl(38,85%,92%)"
                label="About NurSync"
                sublabel="Version 1.0 - prototype educational reference"
                chevron={false}
              />
            </SettingsCard>
          </div>

          <div>
            <SectionLabel>Feedback</SectionLabel>
            <SettingsCard>
              <SettingsRow
                icon={Lightbulb}
                iconColor="hsl(38,70%,45%)"
                iconBg="hsl(38,85%,92%)"
                label="Suggest medicine"
                sublabel="Tell us about a medicine we should add"
                onClick={() => setFeedbackModal({ type: 'medicine_suggestion', title: 'Suggest a medicine' })}
              />
              <SettingsRow
                icon={ClipboardList}
                iconColor="hsl(152,50%,38%)"
                iconBg="hsl(152,50%,92%)"
                label="Suggest procedure"
                sublabel="Tell us about a procedure we should add"
                onClick={() => setFeedbackModal({ type: 'procedure_suggestion', title: 'Suggest a procedure' })}
              />
              <SettingsRow
                icon={Sparkles}
                iconColor="hsl(265,55%,48%)"
                iconBg="hsl(265,55%,92%)"
                label="Suggest feature"
                sublabel="Tell us what NurSync should add next"
                onClick={() => setFeedbackModal({ type: 'feature_suggestion', title: 'Suggest a feature' })}
              />
              <SettingsRow
                icon={MailQuestion}
                iconColor="hsl(0,58%,48%)"
                iconBg="hsl(0,60%,95%)"
                label="Report incorrect content"
                sublabel="Flag something that needs fixing"
                onClick={() => setFeedbackModal({ type: 'content_report', title: 'Report incorrect content' })}
              />
            </SettingsCard>
          </div>

          <div>
            <SectionLabel>Account</SectionLabel>
            <SettingsCard>
              <SettingsRow
                icon={ShieldCheck}
                iconColor="hsl(38,70%,45%)"
                iconBg="hsl(38,85%,92%)"
                label="Plan"
                sublabel="Free educational prototype"
                chevron={false}
              />
              <SettingsRow
                icon={ShieldCheck}
                iconColor="hsl(152,50%,38%)"
                iconBg="hsl(152,50%,92%)"
                label="Cloud sync"
                sublabel="Saved items and quiz progress sync to your account"
                chevron={false}
              />
              <SettingsRow
                icon={LogOut}
                iconColor="hsl(265,55%,48%)"
                iconBg="hsl(265,55%,92%)"
                label="Log Out"
                sublabel="Return to the login screen"
                onClick={() => logout()}
              />
              <SettingsRow
                icon={Trash2}
                iconColor="hsl(0,58%,48%)"
                iconBg="hsl(0,60%,95%)"
                label="Delete Data"
                sublabel="Clear all your saved items and quiz progress"
                danger
                onClick={() => setConfirmOpen(true)}
              />
              <SettingsRow
                icon={ShieldAlert}
                iconColor="hsl(0,58%,48%)"
                iconBg="hsl(0,60%,95%)"
                label="Delete Account"
                sublabel="Permanently delete your user profile"
                danger
                onClick={() => setAccountConfirmOpen(true)}
              />
            </SettingsCard>
          </div>
        </div>
      </div>

      {feedbackModal && (
        <FeedbackModal
          type={feedbackModal.type}
          title={feedbackModal.title}
          onClose={() => setFeedbackModal(null)}
        />
      )}

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: 'rgba(20, 16, 28, 0.52)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="learning-profile-title"
        >
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="learning-profile-title" className="text-lg font-black text-foreground">
                  Learning profile
                </h2>
                <p className="text-sm leading-relaxed mt-1 text-muted-foreground">
                  These details stay on this device and help personalize the profile page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground"
                aria-label="Close learning profile editor"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3 mt-5">
              <div className="space-y-1.5">
                <FieldLabel>Institution</FieldLabel>
                <Input
                  value={profileDraft.institution}
                  onChange={event => setProfileDraft(prev => ({ ...prev, institution: event.target.value }))}
                  placeholder="e.g. Nursing college or hospital"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Study level</FieldLabel>
                <MobileSelect
                  value={profileDraft.studyLevel}
                  onChange={nextValue => setProfileDraft(prev => ({ ...prev, studyLevel: nextValue }))}
                  label="Study level"
                  options={studyLevelOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLearningProfile}
                className="py-3 rounded-2xl text-sm font-black bg-primary text-primary-foreground flex items-center justify-center gap-1.5"
              >
                <Check size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: 'rgba(20, 16, 28, 0.52)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-destructive/10 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h2 id="delete-account-title" className="text-lg font-black text-foreground">
              Delete account data?
            </h2>
            <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
              This permanently clears all your saved items and quiz progress from your account. This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {accountConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          style={{ background: 'rgba(20, 16, 28, 0.52)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-account-title"
        >
          <div className="w-full max-w-sm rounded-3xl border p-5 app-card animate-pop-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-destructive/10 text-destructive">
              <ShieldAlert size={24} />
            </div>
            <h2 id="delete-user-account-title" className="text-lg font-black text-foreground">
              Delete account?
            </h2>
            <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
              This permanently deletes your user profile. Saved items and quiz progress will be cleared before deletion.
            </p>
            {accountDeleteError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-snug">{accountDeleteError}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setAccountConfirmOpen(false);
                  setAccountDeleteError('');
                }}
                disabled={accountDeleting}
                className="py-3 rounded-2xl text-sm font-black border bg-secondary text-secondary-foreground border-border disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={accountDeleting}
                className="py-3 rounded-2xl text-sm font-black bg-destructive text-destructive-foreground disabled:opacity-60"
              >
                {accountDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
