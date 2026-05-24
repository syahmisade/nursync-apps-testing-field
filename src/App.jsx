import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import NurSync from './pages/NurSync';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MedicineScreen from './screens/MedicineScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import ProceduresScreen from './screens/ProceduresScreen';
import QuizScreen from './screens/QuizScreen';
import SavedScreen from './screens/SavedScreen';
import ProfileScreen from './screens/ProfileScreen';

const DEFAULT_START_SECTIONS = {
  medicine: '/medicine',
  calculators: '/calculators',
  procedures: '/procedures',
  quiz: '/quiz',
  saved: '/saved'
};

const DefaultStartRedirect = () => {
  const savedSection = localStorage.getItem('nursync_default_start_section') || 'medicine';
  const targetPath = DEFAULT_START_SECTIONS[savedSection] || DEFAULT_START_SECTIONS.medicine;

  return <Navigate to={targetPath} replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Allow auth pages to render without redirecting
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!authPaths.includes(window.location.pathname)) {
        navigateToLogin();
        return null;
      }
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<NurSync />}>
        <Route index element={<DefaultStartRedirect />} />
        <Route path="medicine" element={<MedicineScreen />} />
        <Route path="medicine/:id" element={<MedicineScreen />} />
        <Route path="calculators" element={<CalculatorScreen />} />
        <Route path="procedures" element={<ProceduresScreen />} />
        <Route path="procedures/:id" element={<ProceduresScreen />} />
        <Route path="quiz" element={<QuizScreen />} />
        <Route path="quiz/:id" element={<QuizScreen />} />
        <Route path="saved" element={<SavedScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
