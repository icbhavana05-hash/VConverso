import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Award, 
  Activity, 
  Settings, 
  Plus, 
  Trash2, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  CheckCircle, 
  User, 
  Lock, 
  Compass, 
  Globe, 
  PlayCircle,
  HelpCircle,
  X,
  ChevronLeft
} from 'lucide-react';

const LanguagePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Page States
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLanguageToUnenroll, setSelectedLanguageToUnenroll] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // stores 'id' of action in progress

  // Fetch all languages and correlate with user enrollment status
  const fetchCorrelatedLanguages = async () => {
    if (!user) return;
    try {
      // 1. Retrieve all languages from the catalog
      const langResponse = await api.get('/languages');
      const allLangs = langResponse.data.languages;

      // 2. Retrieve user progress to correlate enrolled status
      const progressResponse = await api.get(`/progress/${user.user_id}`);
      const enrolledLangs = progressResponse.data.analytics.languages || [];

      // Map progress metrics into master catalog list
      const correlated = allLangs.map(l => {
        const match = enrolledLangs.find(el => el.language_id === l.language_id);
        return {
          ...l,
          enrolled: match ? match.enrolled : 0,
          progress_percentage: match ? match.progress_percentage : 0,
          total_score: match ? match.total_score : 0
        };
      });

      setLanguages(correlated);
    } catch (err) {
      console.error('[Languages Catalog API Error]:', err);
      setError('Failed to correlate database profiles with current languages. Ensure database is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrelatedLanguages();
  }, [user]);

  // Handle enrolling in a language card
  const handleEnrollLanguage = async (languageId) => {
    setActionLoading(languageId);
    try {
      await api.post('/languages/enroll', { language_id: languageId });
      await fetchCorrelatedLanguages();
    } catch (err) {
      console.error('[Enroll Error]:', err);
      alert(err.response?.data?.message || 'Failed to enroll in selected language.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle unenrolling from a language (drawer/card)
  const handleUnenrollLanguage = async (languageId) => {
    setActionLoading(languageId);
    try {
      await api.post('/languages/unenroll', { language_id: languageId });
      setSelectedLanguageToUnenroll(null);
      await fetchCorrelatedLanguages();
    } catch (err) {
      console.error('[Unenroll Error]:', err);
      alert(err.response?.data?.message || 'Failed to unenroll from selected language.');
    } finally {
      setActionLoading(null);
    }
  };

  // Click handler to study or enroll
  const handleExploreClick = async (languageId, isEnrolled) => {
    if (isEnrolled) {
      navigate(`/topics/${languageId}`);
    } else {
      // Auto enroll first, then navigate immediately for zero friction
      setActionLoading(languageId);
      try {
        await api.post('/languages/enroll', { language_id: languageId });
        navigate(`/topics/${languageId}`);
      } catch (err) {
        console.error('[Explore Auto-Enroll Error]:', err);
        alert('Failed to initialize language classroom. Redirecting standard path...');
        navigate(`/topics/${languageId}`);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Scoped premium theme mappings identical to DashboardPage
  const getLanguageTheme = (name) => {
    switch (name.toLowerCase()) {
      case 'spanish':
        return {
          gradient: 'tw-from-orange-600/20 tw-to-rose-600/20',
          hoverGlow: 'hover:tw-shadow-[0_0_35px_rgba(244,63,94,0.25)]',
          borderColor: 'tw-border-rose-500/30',
          accentColor: 'tw-text-rose-400',
          flag: '🇪🇸',
          tagline: 'Warm Sunset & Passionate Rhythms',
          btnTheme: 'tw-bg-rose-500 hover:tw-bg-rose-400 tw-text-white'
        };
      case 'french':
        return {
          gradient: 'tw-from-indigo-600/20 tw-to-cyan-600/20',
          hoverGlow: 'hover:tw-shadow-[0_0_35px_rgba(6,182,212,0.25)]',
          borderColor: 'tw-border-cyan-500/30',
          accentColor: 'tw-text-cyan-400',
          flag: '🇫🇷',
          tagline: 'Midnight Paris & Romantic Accents',
          btnTheme: 'tw-bg-cyan-500 hover:tw-bg-cyan-400 tw-text-zinc-950'
        };
      case 'german':
        return {
          gradient: 'tw-from-zinc-700/20 tw-to-amber-600/20',
          hoverGlow: 'hover:tw-shadow-[0_0_35px_rgba(245,158,11,0.25)]',
          borderColor: 'tw-border-amber-500/30',
          accentColor: 'tw-text-amber-400',
          flag: '🇩🇪',
          tagline: 'Industrial Slate & Engineered Precision',
          btnTheme: 'tw-bg-amber-500 hover:tw-bg-amber-400 tw-text-zinc-950'
        };
      default:
        return {
          gradient: 'tw-from-purple-600/20 tw-to-pink-600/20',
          hoverGlow: 'hover:tw-shadow-[0_0_35px_rgba(168,85,247,0.25)]',
          borderColor: 'tw-border-purple-500/30',
          accentColor: 'tw-text-purple-400',
          flag: '🌐',
          tagline: 'Global Linguistics Portal',
          btnTheme: 'tw-bg-purple-500 hover:tw-bg-purple-400 tw-text-white'
        };
    }
  };

  const enrolledLanguages = languages.filter(l => l.enrolled === 1);
  const nonEnrolledLanguages = languages.filter(l => l.enrolled === 0);

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
        <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
          <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-purple-900/10 tw-blur-[150px] tw-animate-pulse" />
        </div>
        <div className="tw-text-center tw-z-10 tw-max-w-md tw-px-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="tw-w-16 tw-h-16 tw-border-4 tw-border-purple-500 tw-border-t-transparent tw-rounded-full tw-mx-auto tw-mb-6"
          />
          <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-mb-2">Synching Language Grid...</h2>
          <p className="tw-text-zinc-400 tw-text-sm">Connecting to VConverso global linguistic database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-flex tw-items-center tw-justify-center tw-px-6">
        <div className="tw-max-w-md tw-w-full tw-bg-zinc-900/60 tw-backdrop-blur-md tw-border tw-border-zinc-800 tw-rounded-2xl tw-p-8 tw-text-center tw-shadow-2xl">
          <Activity className="tw-w-16 tw-h-16 tw-text-red-500 tw-mx-auto tw-mb-6 tw-animate-bounce" />
          <h3 className="tw-text-xl tw-font-bold tw-mb-2">Access Restrained</h3>
          <p className="tw-text-zinc-400 tw-text-sm tw-mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="tw-w-full tw-py-3 tw-bg-zinc-100 hover:tw-bg-white tw-text-zinc-950 tw-font-bold tw-rounded-xl tw-transition-all"
          >
            Retry Portal Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-font-sans tw-overflow-x-hidden tw-flex">
      
      {/* Background radial glowing gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-overflow-hidden tw-z-0">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-purple-900/15 tw-blur-[150px] tw-animate-pulse tw-duration-1000" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-cyan-900/15 tw-blur-[150px] tw-animate-pulse tw-duration-700" />
      </div>

      {/* SIDEBAR NAVIGATION CONTROLS */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`tw-hidden md:tw-flex tw-flex-col tw-bg-zinc-900/60 tw-backdrop-blur-xl tw-border-r tw-border-zinc-800/80 tw-h-screen tw-sticky tw-top-0 tw-z-30 tw-overflow-hidden tw-relative`}
      >
        {/* Brand Header */}
        <div className="tw-p-6 tw-border-b tw-border-zinc-800/60 tw-flex tw-items-center tw-justify-between">
          <Link to="/dashboard" className="tw-flex tw-items-center tw-gap-3 tw-no-underline">
            <span className="tw-bg-gradient-to-br tw-from-purple-600 tw-to-pink-600 tw-p-2 tw-rounded-xl tw-inline-flex tw-items-center tw-justify-center tw-shadow-lg tw-shadow-purple-950/40">
              <Globe className="tw-w-5 tw-h-5 tw-text-zinc-100" />
            </span>
            <span className="tw-font-bold tw-text-xl tw-tracking-wider tw-bg-gradient-to-r tw-from-zinc-100 tw-via-zinc-200 tw-to-zinc-300 tw-bg-clip-text tw-text-transparent">
              VConverso
            </span>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <div className="tw-flex-1 tw-p-4 tw-flex tw-flex-col tw-gap-2 tw-mt-4">
          <Link
            to="/dashboard"
            className="tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent tw-no-underline"
          >
            <Activity className="tw-w-4 tw-h-4 tw-text-zinc-400" />
            Dashboard Portal
          </Link>

          <Link
            to="/languages"
            className="tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-bg-zinc-805 tw-bg-zinc-800/80 tw-text-white tw-shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] tw-border tw-border-zinc-700/50 tw-no-underline"
          >
            <Compass className="tw-w-4 tw-h-4 tw-text-purple-400" />
            Language Pathways
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent"
          >
            <Settings className="tw-w-4 tw-h-4 tw-text-zinc-400" />
            Manage Languages
          </button>

          <Link
            to="/welcome"
            className="tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent tw-no-underline"
          >
            <Sparkles className="tw-w-4 tw-h-4" />
            VConverso Core
          </Link>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="tw-p-4 tw-border-t tw-border-zinc-800/60">
          <div className="tw-bg-zinc-950/40 tw-border tw-border-zinc-800/80 tw-rounded-xl tw-p-3.5 tw-mb-3 tw-flex tw-items-center tw-gap-3">
            <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-gradient-to-tr tw-from-purple-600/30 tw-to-pink-600/30 tw-flex tw-items-center tw-justify-center tw-border tw-border-purple-500/20">
              <User className="tw-w-5 tw-h-5 tw-text-purple-300" />
            </div>
            <div className="tw-flex-1 tw-min-w-0">
              <p className="tw-text-xs tw-text-zinc-500 tw-mb-0.5">Logged In As</p>
              <h4 className="tw-text-sm tw-font-semibold tw-text-zinc-200 tw-truncate tw-m-0">{user?.name}</h4>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-2 tw-py-3 tw-rounded-xl tw-bg-red-950/20 hover:tw-bg-red-950/30 tw-border tw-border-red-900/30 hover:tw-border-red-900/50 tw-text-red-400 tw-font-bold tw-text-xs tw-transition-all"
          >
            <LogOut className="tw-w-3.5 tw-h-3.5" />
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT CANVAS */}
      <main className="tw-flex-1 tw-min-h-screen tw-z-10 tw-px-4 md:tw-px-8 tw-py-6 tw-flex tw-flex-col tw-gap-6 tw-max-w-7xl tw-mx-auto">
        
        {/* MOBILE DOCK MENU */}
        <header className="md:tw-hidden tw-bg-zinc-900/60 tw-backdrop-blur-xl tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-4 tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-gap-3">
            <span className="tw-bg-gradient-to-br tw-from-purple-600 tw-to-pink-600 tw-p-2 tw-rounded-lg tw-inline-flex">
              <Globe className="tw-w-4 tw-h-4 tw-text-zinc-100" />
            </span>
            <span className="tw-font-bold tw-text-base tw-tracking-wider">VConverso</span>
          </div>

          <div className="tw-flex tw-items-center tw-gap-2">
            <Link
              to="/languages"
              className="tw-bg-zinc-800 tw-text-zinc-300 tw-p-2 tw-rounded-lg tw-border tw-border-zinc-700/50 hover:tw-bg-zinc-700 tw-transition-all tw-inline-flex tw-items-center tw-justify-center"
            >
              <Compass className="tw-w-4 tw-h-4" />
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="tw-bg-zinc-800 tw-text-zinc-300 tw-p-2 tw-rounded-lg tw-border tw-border-zinc-700/50 hover:tw-bg-zinc-700 tw-transition-all"
            >
              <Settings className="tw-w-4 tw-h-4" />
            </button>
            <button
              onClick={handleLogoutClick}
              className="tw-bg-red-950/20 tw-text-red-400 tw-p-2 tw-rounded-lg tw-border tw-border-red-900/30"
            >
              <LogOut className="tw-w-4 tw-h-4" />
            </button>
          </div>
        </header>

        {/* HERO TITLE SECTION */}
        <section className="tw-relative tw-w-full tw-rounded-3xl tw-bg-gradient-to-br tw-from-purple-950/30 tw-via-zinc-900/40 tw-to-cyan-950/20 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-p-6 md:tw-p-8 tw-overflow-hidden tw-shadow-2xl">
          <div className="tw-relative tw-z-10">
            <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-3">
              <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-purple-900/30 tw-text-purple-300 tw-border tw-border-purple-800/30 tw-uppercase">
                <Compass className="tw-w-3 tw-h-3 tw-text-purple-400 tw-animate-pulse" />
                Linguistic Catalog
              </span>
              <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-cyan-900/30 tw-text-cyan-300 tw-border tw-border-cyan-800/30 tw-uppercase">
                Interactive Syllabi
              </span>
            </div>

            <h1 className="tw-text-3xl md:tw-text-4xl tw-font-extrabold tw-tracking-tight tw-mb-2">
              Choose Your Learning Pathway
            </h1>
            <p className="tw-text-zinc-400 tw-text-sm md:tw-text-base tw-leading-relaxed tw-max-w-3xl tw-m-0">
              Correlate your diagnostics across our beautiful educational channels. Selecting a language unlocks custom-tailored grammar sheets, active contextual dialogue notes, and adaptive evaluation quizzes styled on the clean light-beige study interface.
            </p>
          </div>
        </section>

        {/* HIGH-FIDELITY GRID OF PATHWAYS */}
        <section className="tw-w-full tw-mt-2">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 tw-w-full">
            {languages.map((lang) => {
              const theme = getLanguageTheme(lang.language_name);
              const isEnrolled = lang.enrolled === 1;
              const isActionLoading = actionLoading === lang.language_id;
              
              return (
                <motion.div
                  key={lang.language_id}
                  whileHover={{ y: -6 }}
                  className={`tw-relative tw-rounded-2xl tw-border tw-border-zinc-800/80 tw-bg-zinc-900/40 tw-backdrop-blur-md tw-p-6 tw-flex tw-flex-col tw-justify-between tw-overflow-hidden tw-transition-all tw-duration-300 ${theme.gradient} ${theme.hoverGlow}`}
                >
                  {/* Glass Card Glowing overlay */}
                  <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-from-white/5 tw-to-transparent tw-opacity-[0.03] tw-pointer-events-none" />

                  {/* Flag Header */}
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
                    <span className="tw-text-5xl tw-filter tw-drop-shadow-lg">{theme.flag}</span>
                    <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-[9px] tw-font-bold tw-tracking-widest tw-uppercase tw-border ${
                      isEnrolled 
                        ? 'tw-bg-purple-950/40 tw-text-purple-300 tw-border-purple-800/30'
                        : 'tw-bg-zinc-850 tw-text-zinc-500 tw-border-zinc-800'
                    }`}>
                      {isEnrolled ? 'Active Study' : 'Catalog Option'}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="tw-flex-1 tw-mb-5">
                    <h3 className="tw-text-xl tw-font-extrabold tw-text-zinc-100 tw-mb-2 tw-tracking-tight">
                      {lang.language_name} Pathway
                    </h3>
                    <p className="tw-text-xs tw-text-zinc-400 tw-leading-relaxed tw-mb-3">
                      {lang.description || 'Gain full active conversational mastery and core grammatical capabilities.'}
                    </p>
                    <p className="tw-text-[10px] tw-text-zinc-500 tw-italic tw-mb-0">
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Enrichment Section */}
                  {isEnrolled ? (
                    <div className="tw-mb-5 tw-border-t tw-border-zinc-800/60 tw-pt-4">
                      <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-mb-1.5">
                        <span className="tw-text-zinc-500 tw-uppercase tw-tracking-wider">Path Accuracy</span>
                        <span className={`tw-font-bold ${theme.accentColor}`}>{Math.round(lang.progress_percentage)}%</span>
                      </div>
                      <div className="tw-w-full tw-h-1.5 tw-bg-zinc-850 tw-rounded-full tw-overflow-hidden">
                        <div 
                          className="tw-h-full tw-bg-gradient-to-r tw-from-purple-500 tw-to-pink-500"
                          style={{ width: `${lang.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="tw-mb-5 tw-border-t tw-border-zinc-800/60 tw-pt-4">
                      <div className="tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-text-zinc-500">
                        <span className="tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-zinc-650" />
                        Comprehensive Syllabus: A1 Starter to B2 Expert
                      </div>
                    </div>
                  )}

                  {/* Action CTA Button */}
                  <button
                    onClick={() => handleExploreClick(lang.language_id, isEnrolled)}
                    disabled={isActionLoading}
                    className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-bold tw-text-xs tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-1.5 ${
                      isEnrolled 
                        ? theme.btnTheme 
                        : 'tw-bg-zinc-800 hover:tw-bg-zinc-700 tw-text-zinc-200 tw-border tw-border-zinc-700/40'
                    }`}
                  >
                    {isActionLoading ? (
                      <span className="tw-inline-block tw-w-3.5 tw-h-3.5 tw-rounded-full tw-border-2 tw-border-zinc-200 tw-border-t-transparent tw-animate-spin" />
                    ) : isEnrolled ? (
                      <>
                        <PlayCircle className="tw-w-4 tw-h-4" />
                        Resume Study
                      </>
                    ) : (
                      <>
                        <Plus className="tw-w-4 tw-h-4" />
                        Enroll & Start Syllabus
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

      </main>

      {/* MANAGE LANGUAGES DRAWER SIDEBAR */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Dark Blur Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="tw-fixed tw-inset-0 tw-bg-zinc-950/60 tw-backdrop-blur-md tw-z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-w-full sm:tw-w-[450px] tw-bg-zinc-900/95 tw-backdrop-blur-xl tw-border-l tw-border-zinc-800/80 tw-z-50 tw-shadow-2xl tw-p-6 tw-flex tw-flex-col tw-justify-between"
            >
              <div>
                {/* Header */}
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                  <div>
                    <h3 className="tw-text-lg tw-font-bold tw-tracking-tight tw-m-0">Language Portfolio</h3>
                    <p className="tw-text-xs tw-text-zinc-500 tw-mb-0">Enroll in or unenroll from courses dynamically</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="tw-p-2 tw-rounded-lg tw-bg-zinc-800 hover:tw-bg-zinc-700 tw-text-zinc-400 hover:tw-text-zinc-200 tw-transition-all"
                  >
                    <X className="tw-w-4 tw-h-4" />
                  </button>
                </div>

                {/* Sub-Menu Content */}
                <div className="tw-flex tw-flex-col tw-gap-4">
                  
                  {/* ENROLLED LANGUAGES */}
                  <div>
                    <h4 className="tw-text-xs tw-font-bold tw-text-zinc-500 tw-uppercase tw-tracking-widest tw-mb-2">Enrolled Portals</h4>
                    
                    {enrolledLanguages.length === 0 ? (
                      <p className="tw-text-xs tw-text-zinc-500">No active language courses.</p>
                    ) : (
                      <div className="tw-flex tw-flex-col tw-gap-3">
                        {enrolledLanguages.map((lang) => {
                          const theme = getLanguageTheme(lang.language_name);
                          const isUnenrolling = selectedLanguageToUnenroll === lang.language_id;

                          return (
                            <div 
                              key={lang.language_id}
                              className={`tw-bg-zinc-950/40 tw-border tw-border-zinc-800/80 tw-rounded-xl tw-p-4 tw-flex tw-flex-col tw-gap-3 tw-transition-all`}
                            >
                              <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-flex tw-items-center tw-gap-3">
                                  <span className="tw-text-3xl">{theme.flag}</span>
                                  <div>
                                    <h5 className="tw-text-sm tw-font-bold tw-m-0">{lang.language_name}</h5>
                                    <p className="tw-text-[10px] tw-text-zinc-500 tw-m-0">Syllabus Completion: {Math.round(lang.progress_percentage)}%</p>
                                  </div>
                                </div>

                                {isUnenrolling ? (
                                  <span className="tw-text-[10px] tw-font-bold tw-text-zinc-500">Awaiting Confirm</span>
                                ) : (
                                  <button
                                    onClick={() => setSelectedLanguageToUnenroll(lang.language_id)}
                                    disabled={actionLoading !== null}
                                    className="tw-p-2 tw-rounded-lg tw-bg-red-950/20 hover:tw-bg-red-950/30 tw-border tw-border-red-900/30 hover:tw-border-red-900/50 tw-text-red-400 tw-transition-all"
                                  >
                                    <Trash2 className="tw-w-3.5 tw-h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Warning Confirmations */}
                              <AnimatePresence>
                                {isUnenrolling && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="tw-overflow-hidden tw-border-t tw-border-zinc-800/80 tw-pt-3 tw-flex tw-flex-col tw-gap-2"
                                  >
                                    <p className="tw-text-[10px] tw-text-red-400 tw-leading-relaxed tw-mb-0">
                                      ⚠️ WARNING: Unenrolling permanently deletes all XP scores, completed quiz responses, and metrics. This cannot be undone!
                                    </p>
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                                      <button
                                        onClick={() => handleUnenrollLanguage(lang.language_id)}
                                        disabled={actionLoading === lang.language_id}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-red-500 hover:tw-bg-red-400 tw-text-zinc-950 tw-font-bold tw-text-[10px] tw-rounded-lg tw-transition-all"
                                      >
                                        {actionLoading === lang.language_id ? 'Deleting...' : 'Yes, Wipe Progress'}
                                      </button>
                                      <button
                                        onClick={() => setSelectedLanguageToUnenroll(null)}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-zinc-800 hover:tw-bg-zinc-700 tw-text-zinc-300 tw-font-semibold tw-text-[10px] tw-rounded-lg tw-transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* EXPLORE / ADD LANGUAGE PORTALS */}
                  <div className="tw-mt-4">
                    <h4 className="tw-text-xs tw-font-bold tw-text-zinc-500 tw-uppercase tw-tracking-widest tw-mb-2">Explore New Portals</h4>
                    
                    {nonEnrolledLanguages.length === 0 ? (
                      <div className="tw-p-4 tw-text-center tw-bg-zinc-950/20 tw-border tw-border-zinc-800/80 tw-rounded-xl">
                        <Sparkles className="tw-w-6 tw-h-6 tw-text-purple-400 tw-mx-auto tw-mb-2" />
                        <p className="tw-text-[10px] tw-text-zinc-500 tw-m-0">Incredible! You have enrolled in all active language portals!</p>
                      </div>
                    ) : (
                      <div className="tw-flex tw-flex-col tw-gap-3">
                        {nonEnrolledLanguages.map((lang) => {
                          const theme = getLanguageTheme(lang.language_name);
                          const isEnrolling = actionLoading === lang.language_id;

                          return (
                            <div
                              key={lang.language_id}
                              className="tw-bg-zinc-950/20 tw-border tw-border-zinc-800/60 tw-rounded-xl tw-p-3.5 tw-flex tw-items-center tw-justify-between hover:tw-bg-zinc-950/40 hover:tw-border-zinc-800 tw-transition-all"
                            >
                              <div className="tw-flex tw-items-center tw-gap-3">
                                <span className="tw-text-3xl">{theme.flag}</span>
                                <div>
                                  <h5 className="tw-text-xs tw-font-bold tw-m-0">{lang.language_name}</h5>
                                  <p className="tw-text-[9px] tw-text-zinc-500 tw-m-0">Expand to include this syllabus</p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleEnrollLanguage(lang.language_id)}
                                disabled={actionLoading !== null}
                                className="tw-p-2 tw-rounded-lg tw-bg-purple-950/30 hover:tw-bg-purple-950/50 tw-border tw-border-purple-800/30 hover:tw-border-purple-800/50 tw-text-purple-400 tw-transition-all"
                              >
                                {isEnrolling ? (
                                  <span className="tw-inline-block tw-w-3.5 tw-h-3.5 tw-rounded-full tw-border-2 tw-border-purple-400 tw-border-t-transparent tw-animate-spin" />
                                ) : (
                                  <Plus className="tw-w-3.5 tw-h-3.5" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Drawer footer info */}
              <div className="tw-pt-6 tw-border-t tw-border-zinc-800/60 tw-text-[10px] tw-text-zinc-500 tw-leading-relaxed">
                VConverso syllabus systems auto-scale grids beautifully. Enrolling in multiple portals dynamically unlocks achievements and updates leaderboards instantly.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LanguagePage;
