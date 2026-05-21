import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LanguagePage from './pages/LanguagePage';
import TopicsPage from './pages/TopicsPage';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage';
import IntroPage from './pages/IntroPage';
import LanguageSelectionPage from './pages/LanguageSelectionPage';

/**
 * Route guard for private/session endpoints
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Restoring session...</span>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * Route guard for public/auth endpoints to prevent redundant signins
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking credentials...</span>
        </div>
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />;
};

/**
 * Selective Footer component based on route to maintain dark full-screen immersion
 */
const FooterWithRouteCheck = () => {
  const location = useLocation();
  const hiddenRoutes = ['/', '/login', '/register', '/select-language', '/dashboard', '/languages'];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="py-4 text-center mt-auto border-top border-secondary" style={{ background: 'rgba(15, 23, 42, 0.4)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
      <div className="container">
        <p className="text-secondary small mb-0">
          &copy; {new Date().getFullYear()} VConverso Language Learning Management System. Built for DBMS + Full Stack Project evaluation.
        </p>
      </div>
    </footer>
  );
};

function AppContent() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar />
      
      {/* Page Routing */}
      <main className="flex-grow-1">
        <Routes>
          
          {/* Cinematic Intro Page (Root Route) */}
          <Route path="/" element={<IntroPage />} />

          {/* Public Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          {/* First Time Onboarding Language Selection */}
          <Route 
            path="/select-language" 
            element={
              <PrivateRoute>
                <LanguageSelectionPage />
              </PrivateRoute>
            } 
          />

          {/* Welcome Page Route */}
          <Route 
            path="/welcome" 
            element={<WelcomePage />} 
          />
          
          {/* Private Learner Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/languages" 
            element={
              <PrivateRoute>
                <LanguagePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/topics/:language_id" 
            element={
              <PrivateRoute>
                <TopicsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/notes/:topic_id" 
            element={
              <PrivateRoute>
                <NotesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/quiz/:topic_id" 
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Routes>
      </main>
      
      {/* Footer */}
      <FooterWithRouteCheck />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;


