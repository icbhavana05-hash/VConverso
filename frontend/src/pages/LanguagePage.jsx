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
} from 'lucide-react';

const quotes = [
  { text: "A different language is a different vision of life.", author: "Federico Fellini" },
  { text: "To learn a language is to have one more window from which to look at the world.", author: "Chinese Proverb" },
  { text: "Language is the road map of a culture.", author: "Rita Mae Brown" },
  { text: "Every new language opens another world.", author: "Unknown" }
];

const LanguagePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Page States
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quotes rotation state
  const [quoteIndex, setQuoteIndex] = useState(0);

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLanguageToUnenroll, setSelectedLanguageToUnenroll] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // stores 'id' of action in progress

  // Rotate quotes effect
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    const lower = name.toLowerCase();
    let flag = '🇩🇪';
    let tagline = 'Structured Logic & Precision';

    if (lower === 'spanish') {
      flag = '🇪🇸';
      tagline = 'Sunset Accents & Culture';
    } else if (lower === 'french') {
      flag = '🇫🇷';
      tagline = 'Romance Accents & Cinema';
    } else if (lower === 'english') {
      flag = '🇬🇧';
      tagline = 'Universal Grammar & Expressions';
    } else if (lower === 'german') {
      flag = '🇩🇪';
      tagline = 'Structured Logic & Precision';
    }

    return {
      gradient: 'tw-from-v-brown-dark/5 tw-to-v-brown-med/5',
      hoverGlow: 'hover:tw-shadow-md',
      borderColor: 'tw-border-v-brown-med/20',
      activeGlow: 'tw-shadow-[0_8px_24px_rgba(107,62,46,0.06)]',
      accentColor: 'tw-text-v-brown-dark',
      flag,
      tagline,
      btnTheme: 'tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-shadow-sm'
    };
  };

  const enrolledLanguages = languages.filter(l => l.enrolled === 1);
  const nonEnrolledLanguages = languages.filter(l => l.enrolled === 0);

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-bg-v-bg tw-text-v-text-prim tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
        <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
          <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-bg-sec/55 tw-blur-[150px] tw-animate-pulse" />
        </div>
        <div className="tw-text-center tw-z-10 tw-max-w-md tw-px-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="tw-w-16 tw-h-16 tw-border-4 tw-border-v-brown-dark tw-border-t-transparent tw-rounded-full tw-mx-auto tw-mb-6"
          />
          <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-mb-2 tw-text-v-brown-dark">Synching Language Grid...</h2>
          <p className="tw-text-v-text-sec tw-text-sm">Connecting to VConverso global linguistic database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-min-h-screen tw-bg-v-bg tw-text-v-text-prim tw-flex tw-items-center tw-justify-center tw-px-6">
        <div className="tw-max-w-md tw-w-full tw-bg-v-card tw-border tw-border-v-brown-med/20 tw-rounded-2xl tw-p-8 tw-text-center tw-shadow-md">
          <Activity className="tw-w-16 tw-h-16 tw-text-red-500 tw-mx-auto tw-mb-6 tw-animate-bounce" />
          <h3 className="tw-text-xl tw-font-bold tw-mb-2 tw-text-v-brown-dark">Access Restrained</h3>
          <p className="tw-text-v-text-sec tw-text-sm tw-mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-font-bold tw-rounded-xl tw-transition-all tw-shadow-sm"
          >
            Retry Portal Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-v-bg tw-text-v-text-prim tw-font-sans tw-overflow-x-hidden tw-flex">
      
      {/* Background Soft Warm Gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-z-0 tw-overflow-hidden">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-bg-sec/40 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-navbar/30 tw-blur-[120px]" />
      </div>

      {/* SIDEBAR NAVIGATION CONTROLS */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="tw-hidden md:tw-flex tw-flex-col tw-bg-v-navbar tw-border-r tw-border-v-brown-med/10 tw-h-screen tw-sticky tw-top-0 tw-z-30 tw-overflow-hidden tw-relative"
      >
        {/* Brand Header */}
        <div className="tw-p-6 tw-border-b tw-border-v-brown-med/10 tw-flex tw-items-center">
          <Link to="/dashboard" className="tw-flex tw-items-center tw-gap-2.5 tw-no-underline">
            <Globe className="tw-w-5 tw-h-5 tw-text-[#6B3E2E]" />
            <span className="tw-font-bold tw-text-xl tw-tracking-wider tw-text-[#6B3E2E]">
              VConverso
            </span>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <div className="tw-flex-1 tw-p-4 tw-flex tw-flex-col tw-gap-2 tw-mt-4">
          <Link
            to="/dashboard"
            className="tw-w-full tw-h-12 tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-duration-250 tw-text-[#6B3E2E] tw-bg-transparent hover:tw-bg-[#EFE4D6] tw-no-underline"
          >
            <Activity className="tw-w-4 tw-h-4 tw-text-[#6B3E2E]" />
            Dashboard Portal
          </Link>

          <Link
            to="/languages"
            className="tw-w-full tw-h-12 tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-duration-250 tw-bg-[#6B3E2E] tw-text-white tw-shadow-sm tw-no-underline"
          >
            <Compass className="tw-w-4 tw-h-4 tw-text-white" />
            Language Pathways
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="tw-w-full tw-h-12 tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-duration-250 tw-text-[#6B3E2E] tw-bg-transparent hover:tw-bg-[#EFE4D6] tw-border-none tw-outline-none"
          >
            <Settings className="tw-w-4 tw-h-4 tw-text-[#6B3E2E]" />
            Manage Languages
          </button>
        </div>

        {/* User Card Bottom */}
        <div className="tw-p-4 tw-border-t tw-border-v-brown-med/10">
          <div className="tw-bg-[#F5EFE6] tw-border tw-border-v-brown-med/15 tw-rounded-xl tw-p-3.5 tw-flex tw-items-center tw-gap-3">
            <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-gradient-to-tr tw-from-v-brown-dark/20 tw-to-v-brown-med/20 tw-flex tw-items-center tw-justify-center tw-border tw-border-v-brown-med/10">
              <User className="tw-w-5 tw-h-5 tw-text-v-brown-dark" />
            </div>
            <div className="tw-flex-1 tw-min-w-0">
              <p className="tw-text-[10px] tw-text-[#8B5A3C] tw-mb-0.5 tw-font-semibold tw-uppercase">Logged In As</p>
              <h4 className="tw-text-sm tw-font-bold tw-text-[#2D1F18] tw-truncate tw-m-0">{user?.name}</h4>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* MAIN CONTENT CANVAS */}
      <main className="tw-flex-1 tw-min-h-screen tw-z-10 tw-px-4 md:tw-px-8 tw-py-6 tw-flex tw-flex-col tw-gap-6 tw-max-w-7xl tw-mx-auto">
        
        {/* DESKTOP HEADER (Visible only on medium/large screens) */}
        <header className="tw-hidden md:tw-flex tw-items-center tw-justify-between tw-pb-4 tw-border-b tw-border-[#C7B299]/20 tw-mb-2">
          <div>
            <h2 className="tw-text-xl tw-font-bold tw-text-[#2D1F18]">Language Pathways</h2>
          </div>
          <button
            onClick={handleLogoutClick}
            className="tw-bg-[#F5ECE2] hover:tw-bg-[#EADDC9] tw-text-[#991B1B] tw-px-4 tw-py-2 tw-rounded-xl tw-text-sm tw-font-bold tw-transition-all tw-duration-250 tw-border tw-border-red-500/10 tw-flex tw-items-center tw-gap-2 tw-shadow-sm"
          >
            <LogOut className="tw-w-4 tw-h-4" />
            Logout
          </button>
        </header>

        {/* MOBILE DOCK MENU */}
        <header className="md:tw-hidden tw-bg-v-navbar tw-border tw-border-v-brown-med/10 tw-rounded-2xl tw-p-4 tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-items-center tw-gap-3">
            <span className="tw-bg-gradient-to-br tw-from-v-brown-dark tw-to-v-brown-med tw-p-2.5 tw-rounded-lg tw-inline-flex">
              <Globe className="tw-w-4 tw-h-4 tw-text-white" />
            </span>
            <span className="tw-font-bold tw-text-base tw-tracking-wider tw-text-v-brown-dark">VConverso</span>
          </div>

          <div className="tw-flex tw-items-center tw-gap-2">
            <Link
              to="/languages"
              className="tw-bg-[#6B3E2E] tw-text-white tw-p-2 tw-rounded-lg tw-border tw-border-[#6B3E2E] tw-transition-all tw-inline-flex tw-items-center tw-justify-center"
            >
              <Compass className="tw-w-4 tw-h-4" />
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="tw-bg-[#EFE4D6] tw-text-[#6B3E2E] tw-p-2 tw-rounded-lg tw-border tw-border-[#C7B299]/30 hover:tw-bg-[#F5EFE6] tw-transition-all"
            >
              <Settings className="tw-w-4 tw-h-4" />
            </button>
            <button
              onClick={handleLogoutClick}
              className="tw-bg-[#F5ECE2] hover:tw-bg-[#EADDC9] tw-text-[#991B1B] tw-p-2 tw-rounded-lg tw-border tw-border-red-500/10 tw-transition-all tw-inline-flex tw-items-center tw-justify-center"
            >
              <LogOut className="tw-w-4 tw-h-4" />
            </button>
          </div>
        </header>

        {/* HERO TITLE SECTION */}
        <section className="tw-relative tw-w-full tw-rounded-3xl tw-bg-v-card tw-border tw-border-v-brown-med/10 tw-p-6 md:tw-p-8 tw-overflow-hidden tw-shadow-[0_8px_24px_rgba(107,62,46,0.03)]">
          <div className="tw-relative tw-z-10">
            <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-3">
              <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-bold tw-tracking-widest tw-bg-v-brown-dark/10 tw-text-v-brown-dark tw-border tw-border-v-brown-med/10 tw-uppercase">
                <Compass className="tw-w-3 tw-h-3 tw-text-v-brown-med tw-animate-pulse" />
                Linguistic Catalog
              </span>
              <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-bold tw-tracking-widest tw-bg-v-brown-med/10 tw-text-v-brown-med tw-border tw-border-v-brown-med/10 tw-uppercase">
                Interactive Syllabi
              </span>
            </div>

            <h1 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-tracking-tight tw-mb-2 tw-text-v-brown-dark">
              Choose Your Learning Pathway
            </h1>
            <p className="tw-text-v-text-sec tw-text-sm md:tw-text-base tw-leading-relaxed tw-max-w-3xl tw-m-0">
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
                  className="tw-relative tw-rounded-2xl tw-border tw-border-v-brown-med/10 tw-bg-v-card tw-p-6 tw-flex tw-flex-col tw-justify-between tw-overflow-hidden tw-transition-all tw-duration-300 tw-shadow-sm hover:tw-shadow-md"
                >
                  {/* Flag Header */}
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
                    <span className="tw-text-5xl tw-filter tw-drop-shadow-sm">{theme.flag}</span>
                    <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-[9px] tw-font-bold tw-tracking-widest tw-uppercase tw-border ${
                      isEnrolled 
                        ? 'tw-bg-v-brown-dark/10 tw-text-v-brown-dark tw-border-v-brown-dark/20'
                        : 'tw-bg-v-bg tw-text-v-text-muted tw-border-v-brown-med/10'
                    }`}>
                      {isEnrolled ? 'Active Study' : 'Catalog Option'}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="tw-flex-1 tw-mb-5">
                    <h3 className="tw-text-xl tw-font-bold tw-text-v-text-prim tw-mb-2 tw-tracking-tight">
                      {lang.language_name} Pathway
                    </h3>
                    <p className="tw-text-xs tw-text-v-text-sec tw-leading-relaxed tw-mb-3">
                      {lang.description || 'Gain full active conversational mastery and core grammatical capabilities.'}
                    </p>
                    <p className="tw-text-[10px] tw-text-v-text-muted tw-italic tw-mb-0 font-medium">
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Enrichment Section */}
                  {isEnrolled ? (
                    <div className="tw-mb-5 tw-border-t tw-border-v-brown-med/10 tw-pt-4">
                      <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-mb-1.5 tw-font-semibold tw-uppercase">
                        <span className="tw-text-v-text-sec tw-tracking-wider">Path Accuracy</span>
                        <span className="tw-text-v-brown-dark">{Math.round(lang.progress_percentage)}%</span>
                      </div>
                      <div className="tw-w-full tw-h-1.5 tw-bg-v-bg-sec tw-rounded-full tw-overflow-hidden">
                        <div 
                          className="tw-h-full tw-bg-gradient-to-r tw-from-v-brown-med tw-to-v-brown-dark"
                          style={{ width: `${lang.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="tw-mb-5 tw-border-t tw-border-v-brown-med/10 tw-pt-4">
                      <div className="tw-flex tw-items-center tw-gap-1.5 tw-text-[10px] tw-text-v-text-sec tw-font-medium">
                        <span className="tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-v-brown-med" />
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
                        ? 'tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-shadow-[0_4px_12px_rgba(107,62,46,0.1)]'
                        : 'tw-bg-v-bg-sec hover:tw-bg-v-navbar tw-text-v-brown-dark tw-border tw-border-v-brown-med/20'
                    }`}
                  >
                    {isActionLoading ? (
                      <span className="tw-inline-block tw-w-3.5 tw-h-3.5 tw-rounded-full tw-border-2 tw-border-v-brown-dark tw-border-t-transparent tw-animate-spin" />
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

        {/* DYNAMIC LANGUAGE QUOTES SECTION */}
        <div className="tw-mt-auto tw-pt-8 tw-pb-4">
          <div className="tw-w-full tw-h-px tw-bg-[#C7B299]/20 tw-mb-8" />
          <div className="tw-text-center tw-max-w-2xl tw-mx-auto tw-px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="tw-flex tw-flex-col tw-gap-3"
              >
                <p className="tw-text-[#6B3E2E] tw-text-lg md:tw-text-xl tw-font-serif tw-italic tw-leading-relaxed tw-m-0">
                  “{quotes[quoteIndex].text}”
                </p>
                <span className="tw-text-[#8A7B70] tw-text-xs md:tw-text-sm tw-font-semibold tw-tracking-wider tw-uppercase">
                  — {quotes[quoteIndex].author}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

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
              className="tw-fixed tw-inset-0 tw-bg-v-text-prim/40 tw-backdrop-blur-sm tw-z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-w-full sm:tw-w-[450px] tw-bg-[#E9DDCD] tw-border-l tw-border-[#C7B299]/30 tw-z-50 tw-shadow-[0_0_30px_rgba(0,0,0,0.08)] tw-p-6 tw-flex tw-flex-col tw-justify-between"
              style={{ backgroundColor: '#E9DDCD', opacity: 1 }}
            >
              <div>
                {/* Header */}
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                  <div>
                    <h3 className="tw-text-lg tw-font-bold tw-tracking-tight tw-m-0 tw-text-[#2D1F18]">Language Portfolio</h3>
                    <p className="tw-text-xs tw-text-[#8A7B70] tw-mb-0">Enroll in or unenroll from courses dynamically</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="tw-p-2 tw-rounded-lg tw-bg-[#EFE4D6] hover:tw-bg-[#F5EFE6] tw-text-[#5C4A42] hover:tw-text-[#6B3E2E] tw-transition-all"
                  >
                    <X className="tw-w-4 tw-h-4" />
                  </button>
                </div>

                {/* Sub-Menu Content */}
                <div className="tw-flex tw-flex-col tw-gap-4">
                  
                  {/* ENROLLED LANGUAGES */}
                  <div>
                    <h4 className="tw-text-xs tw-font-bold tw-text-[#8A7B70] tw-uppercase tw-tracking-widest tw-mb-2 font-sans">Enrolled Portals</h4>
                    
                    {enrolledLanguages.length === 0 ? (
                      <p className="tw-text-xs tw-text-[#8A7B70]">No active language courses.</p>
                    ) : (
                      <div className="tw-flex tw-flex-col tw-gap-3">
                        {enrolledLanguages.map((lang) => {
                          const theme = getLanguageTheme(lang.language_name);
                          const isUnenrolling = selectedLanguageToUnenroll === lang.language_id;

                          return (
                            <div 
                              key={lang.language_id}
                              className="tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-rounded-xl tw-p-4 tw-flex tw-flex-col tw-gap-3 tw-transition-all tw-shadow-sm"
                            >
                              <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-flex tw-items-center tw-gap-3">
                                  <span className="tw-text-3xl">{theme.flag}</span>
                                  <div>
                                    <h5 className="tw-text-sm tw-font-bold tw-m-0 tw-text-[#2D1F18]">{lang.language_name}</h5>
                                    <p className="tw-text-[10px] tw-text-[#5C4A42] tw-m-0 font-medium">Syllabus Completion: {Math.round(lang.progress_percentage)}%</p>
                                  </div>
                                </div>

                                {isUnenrolling ? (
                                  <span className="tw-text-[10px] tw-font-bold tw-text-[#8A7B70] tw-bg-[#EFE4D6] tw-px-2 tw-py-1 tw-rounded-md tw-border tw-border-[#C7B299]/30">Awaiting Confirm</span>
                                ) : (
                                  <button
                                    onClick={() => setSelectedLanguageToUnenroll(lang.language_id)}
                                    disabled={actionLoading !== null}
                                    className="tw-p-2 tw-rounded-lg tw-bg-red-500/10 hover:tw-bg-red-500/20 tw-border tw-border-red-500/20 tw-text-[#991B1B] tw-transition-all"
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
                                    className="tw-overflow-hidden tw-border-t tw-border-[#C7B299]/20 tw-pt-3 tw-flex tw-flex-col tw-gap-2"
                                  >
                                    <p className="tw-text-[10px] tw-text-[#991B1B] tw-bg-[#F5ECE2] tw-p-3 tw-rounded-xl tw-border tw-border-red-500/10 tw-leading-relaxed tw-mb-0 tw-font-semibold">
                                      ⚠️ WARNING: Unenrolling permanently deletes all XP scores, completed quiz responses, and metrics. This cannot be undone!
                                    </p>
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                                      <button
                                        onClick={() => handleUnenrollLanguage(lang.language_id)}
                                        disabled={actionLoading === lang.language_id}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-[#991B1B] hover:tw-bg-red-700 tw-text-white tw-font-bold tw-text-[10px] tw-rounded-lg tw-transition-all tw-shadow-sm"
                                      >
                                        {actionLoading === lang.language_id ? 'Deleting...' : 'Yes, Wipe Progress'}
                                      </button>
                                      <button
                                        onClick={() => setSelectedLanguageToUnenroll(null)}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-[#EFE4D6] hover:tw-bg-[#F5EFE6] tw-text-[#6B3E2E] tw-font-semibold tw-text-[10px] tw-rounded-lg tw-transition-all tw-border tw-border-[#C7B299]/30"
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
                    <h4 className="tw-text-xs tw-font-bold tw-[#8A7B70] tw-uppercase tw-tracking-widest tw-mb-2 font-sans">Explore New Portals</h4>
                    
                    {nonEnrolledLanguages.length === 0 ? (
                      <div className="tw-p-4 tw-text-center tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-rounded-xl tw-shadow-sm">
                        <Sparkles className="tw-w-6 tw-h-6 tw-text-[#6B3E2E] tw-mx-auto tw-mb-2 tw-animate-pulse" />
                        <p className="tw-text-[10px] tw-text-[#5C4A42] tw-font-semibold tw-m-0">Incredible! You have enrolled in all active language portals!</p>
                      </div>
                    ) : (
                      <div className="tw-flex tw-flex-col tw-gap-3">
                        {nonEnrolledLanguages.map((lang) => {
                          const theme = getLanguageTheme(lang.language_name);
                          const isEnrolling = actionLoading === lang.language_id;

                          return (
                            <div
                              key={lang.language_id}
                              className="tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-rounded-xl tw-p-3.5 tw-flex tw-items-center tw-justify-between hover:tw-bg-[#EFE4D6] hover:tw-border-[#C7B299]/50 tw-transition-all tw-shadow-sm"
                            >
                              <div className="tw-flex tw-items-center tw-gap-3">
                                <span className="tw-text-3xl">{theme.flag}</span>
                                <div>
                                  <h5 className="tw-text-xs tw-font-bold tw-m-0 tw-text-[#2D1F18]">{lang.language_name}</h5>
                                  <p className="tw-text-[9px] tw-text-[#5C4A42] tw-m-0 font-medium">Expand to include this syllabus</p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleEnrollLanguage(lang.language_id)}
                                disabled={actionLoading !== null}
                                className="tw-p-2 tw-rounded-lg tw-bg-[#EFE4D6] hover:tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-text-[#6B3E2E] tw-transition-all"
                              >
                                {isEnrolling ? (
                                  <span className="tw-inline-block tw-w-3.5 tw-h-3.5 tw-rounded-full tw-border-2 tw-border-[#6B3E2E] tw-border-t-transparent tw-animate-spin" />
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
              <div className="tw-pt-6 tw-border-t tw-border-[#C7B299]/20 tw-text-[10px] tw-text-[#8A7B70] tw-leading-relaxed tw-font-medium">
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
