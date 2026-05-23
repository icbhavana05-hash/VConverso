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
  Zap, 
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

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Interactive Daily Challenge States
  const [challengeClaimed, setChallengeClaimed] = useState(false);
  const [bonusXP, setBonusXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLanguageToUnenroll, setSelectedLanguageToUnenroll] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // 'enroll-id' or 'unenroll-id'

  // Dynamic welcome greetings array
  const greetings = ['Bonjour', 'Hola', 'Hallo', 'Welcome', 'Salve', 'Konnichiwa'];
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Quotes rotation state
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate greetings cinematic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes effect
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/progress/${user.user_id}`);
      setData(response.data.analytics);
    } catch (err) {
      console.error('[Dashboard API Error]:', err);
      setError('Failed to establish connection to premium syllabus networks. Ensure database services are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Redirection Gate: If user has 0 enrolled languages, force redirect to onboarding select-language page
  const enrolledLanguages = data?.languages?.filter(l => l.enrolled === 1) || [];
  const nonEnrolledLanguages = data?.languages?.filter(l => l.enrolled === 0) || [];

  useEffect(() => {
    if (!loading && data) {
      if (enrolledLanguages.length === 0) {
        navigate('/select-language');
      }
    }
  }, [loading, data, enrolledLanguages.length, navigate]);

  // Handle enrolling in a language from Manage Languages drawer
  const handleEnrollLanguage = async (languageId) => {
    setActionLoading(`enroll-${languageId}`);
    try {
      await api.post('/languages/enroll', { language_id: languageId });
      await fetchDashboardData();
      // Reset daily challenge mockup claim when a new language is enrolled
      setChallengeClaimed(false);
    } catch (err) {
      console.error('[Enroll Drawer Error]:', err);
      alert(err.response?.data?.message || 'Failed to enroll in selected language.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle unenrolling from a language
  const handleUnenrollLanguage = async (languageId) => {
    setActionLoading(`unenroll-${languageId}`);
    try {
      await api.post('/languages/unenroll', { language_id: languageId });
      setSelectedLanguageToUnenroll(null);
      await fetchDashboardData();
    } catch (err) {
      console.error('[Unenroll Drawer Error]:', err);
      alert(err.response?.data?.message || 'Failed to unenroll from selected language.');
    } finally {
      setActionLoading(null);
    }
  };

  // Claim Daily Challenge simulation
  const claimDailyChallenge = () => {
    if (challengeClaimed) return;
    setChallengeClaimed(true);
    setBonusXP(150);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  // Theming definitions based on course name
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

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

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
          <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-mb-2 tw-text-v-brown-dark">Retrieving User Syllabi...</h2>
          <p className="tw-text-v-text-sec tw-text-sm">Connecting to VConverso premium language pathways...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tw-min-h-screen tw-bg-v-bg tw-text-v-text-prim tw-flex tw-items-center tw-justify-center tw-px-6">
        <div className="tw-max-w-md tw-w-full tw-bg-v-card tw-border tw-border-v-brown-med/20 tw-rounded-2xl tw-p-8 tw-text-center tw-shadow-md">
          <Activity className="tw-w-16 tw-h-16 tw-text-red-500 tw-mx-auto tw-mb-6 tw-animate-bounce" />
          <h3 className="tw-text-xl tw-font-bold tw-mb-2 tw-text-v-brown-dark">Connection Disturbed</h3>
          <p className="tw-text-v-text-sec tw-text-sm tw-mb-6">{error || 'Unable to fetch progress metrics.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-font-bold tw-rounded-xl tw-shadow-sm tw-transition-all"
          >
            Retry Portal Connection
          </button>
        </div>
      </div>
    );
  }

  const {
    total_attempts,
    unique_quizzes_attempted,
    average_score,
    overall_progress_percentage,
    languages,
    recent_activity
  } = data;

  // Calculate dynamic classroom metrics
  const totalClassroomXP = (languages?.reduce((sum, lang) => sum + (lang.total_score || 0), 0) || 0) + bonusXP;
  const isPolyglotLegend = enrolledLanguages.length >= 2;

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-v-bg tw-text-v-text-prim tw-font-sans tw-overflow-x-hidden tw-flex">
      
      {/* Subtle warm ambient decorations */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-overflow-hidden tw-z-0">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-bg-sec/40 tw-blur-[150px]" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-bg-sec/30 tw-blur-[150px]" />
      </div>

      {/* Floating Sparkle/Confetti Effect when challenge claimed */}
      <AnimatePresence>
        {showConfetti && (
          <div className="tw-fixed tw-inset-0 tw-pointer-events-none tw-z-50 tw-overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 300, 
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                  scale: Math.random() * 0.6 + 0.4 
                }}
                animate={{ 
                  opacity: 0, 
                  y: -100 + (Math.random() - 0.5) * 300,
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 600,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: Math.random() * 1.5 + 1.2, ease: "easeOut" }}
                className="tw-absolute tw-w-4 tw-h-4 tw-rounded-full"
                style={{ 
                  backgroundColor: ['#6B3E2E', '#8B5A3C', '#7A4B39', '#2D1F18', '#5C4A42', '#8A7B70'][Math.floor(Math.random() * 6)],
                  boxShadow: '0 0 8px rgba(107, 62, 46, 0.2)'
                }}
              />
            ))}
            <div className="tw-fixed tw-inset-0 tw-bg-v-bg-sec/20 tw-backdrop-blur-[1px]" />
          </div>
        )}
      </AnimatePresence>

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
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tw-w-full tw-h-12 tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-duration-250 tw-border-none tw-outline-none ${
              activeTab === 'dashboard'
                ? 'tw-bg-[#6B3E2E] tw-text-white tw-shadow-sm'
                : 'tw-text-[#6B3E2E] tw-bg-transparent hover:tw-bg-[#EFE4D6]'
            }`}
          >
            <Activity className={`tw-w-4 tw-h-4 ${activeTab === 'dashboard' ? 'tw-text-white' : 'tw-text-[#6B3E2E]'}`} />
            Dashboard Portal
          </button>

          <Link
            to="/languages"
            className="tw-w-full tw-h-12 tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-duration-250 tw-text-[#6B3E2E] tw-bg-transparent hover:tw-bg-[#EFE4D6] tw-no-underline"
          >
            <Compass className="tw-w-4 tw-h-4 tw-text-[#6B3E2E]" />
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
            <h2 className="tw-text-xl tw-font-bold tw-text-[#2D1F18]">Dashboard Portal</h2>
          </div>
          <button
            onClick={handleLogoutClick}
            className="tw-bg-[#F5ECE2] hover:tw-bg-[#EADDC9] tw-text-[#991B1B] tw-px-4 tw-py-2 tw-rounded-xl tw-text-sm tw-font-bold tw-transition-all tw-duration-250 tw-border tw-border-red-500/10 tw-flex tw-items-center tw-gap-2 tw-shadow-sm"
          >
            <LogOut className="tw-w-4 tw-h-4" />
            Logout
          </button>
        </header>

        {/* MOBILE DOCK MENU (Active only on small screens) */}
        <header className="md:tw-hidden tw-bg-v-navbar tw-border tw-border-v-brown-med/10 tw-rounded-2xl tw-p-4 tw-flex tw-items-center tw-justify-between tw-shadow-sm">
          <div className="tw-flex tw-items-center tw-gap-3">
            <span className="tw-bg-gradient-to-br tw-from-v-brown-dark tw-to-v-brown-med tw-p-2 tw-rounded-lg tw-inline-flex">
              <Globe className="tw-w-4 tw-h-4 tw-text-white" />
            </span>
            <span className="tw-font-bold tw-text-base tw-tracking-wider tw-text-v-brown-dark">VConverso</span>
          </div>

          <div className="tw-flex tw-items-center tw-gap-2">
            <Link
              to="/languages"
              className="tw-bg-[#EFE4D6] tw-text-[#6B3E2E] tw-p-2 tw-rounded-lg tw-border tw-border-[#C7B299]/30 hover:tw-bg-[#F5EFE6] tw-transition-all tw-inline-flex tw-items-center tw-justify-center"
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

        {/* SECTION 1: CINEMATIC WELCOME BANNER */}
        <section className="tw-relative tw-w-full tw-rounded-3xl tw-bg-v-card tw-border tw-border-v-brown-med/15 tw-p-6 md:tw-p-8 tw-overflow-hidden tw-shadow-md">
          <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-v-brown-dark/5 tw-to-v-brown-med/5 tw-pointer-events-none" />
          
          <div className="tw-relative tw-z-10 tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-justify-between tw-gap-6">
            <div>
              <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-3">
                <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-v-brown-dark/10 tw-text-v-brown-dark tw-border tw-border-v-brown-dark/20 tw-uppercase">
                  <Flame className="tw-w-3 tw-h-3 tw-text-v-brown-dark" />
                  Active Portal
                </span>
                <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-v-brown-med/10 tw-text-v-brown-med tw-border tw-border-v-brown-med/20 tw-uppercase">
                  🔥 5-Day Streak
                </span>
              </div>

              {/* Multilingual rotating greeting logo */}
              <h1 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-tracking-tight tw-mb-2 tw-text-v-text-prim">
                <motion.span
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med tw-bg-clip-text tw-text-transparent tw-mr-3 tw-font-extrabold"
                >
                  {greetings[greetingIndex]}!
                </motion.span>
                {user?.name}
              </h1>

              <p className="tw-text-v-text-sec tw-text-sm md:tw-text-base tw-leading-relaxed tw-max-w-xl tw-m-0">
                Welcome back to your gorgeous VConverso language classroom. You have enrolled in <span className="tw-text-v-brown-dark tw-font-bold">{enrolledLanguages.length}</span> course{enrolledLanguages.length > 1 ? 's' : ''}. Complete daily milestones to climb the leaderboards beautifully.
              </p>
            </div>

            {/* Overall progress visualizer widget */}
            <div className="tw-flex tw-items-center tw-gap-4 tw-bg-v-bg-sec tw-border tw-border-v-brown-med/15 tw-rounded-2xl tw-p-4 tw-relative tw-overflow-hidden">
              <div className="tw-relative tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center">
                <svg className="tw-w-full tw-h-full" viewBox="0 0 36 36">
                  <path
                     className="tw-text-v-bg"
                     strokeWidth="3.5"
                     stroke="currentColor"
                     fill="none"
                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="tw-text-v-brown-dark"
                    strokeWidth="3.5"
                    strokeDasharray={`${overall_progress_percentage}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${overall_progress_percentage}, 100` }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  />
                </svg>
                <div className="tw-absolute tw-text-[11px] tw-font-bold tw-text-v-text-prim">
                  {Math.round(overall_progress_percentage)}%
                </div>
              </div>

              <div>
                <h5 className="tw-text-xs tw-font-bold tw-tracking-widest tw-uppercase tw-text-v-text-muted tw-mb-0.5">
                  Overall Completion
                </h5>
                <h3 className="tw-text-lg tw-font-bold tw-text-v-text-prim tw-m-0">
                  {totalClassroomXP} <span className="tw-text-xs tw-text-v-brown-med tw-font-normal">Total XP</span>
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS ROW (Quick Stats Overview) */}
        <section className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
          
          <div className="tw-bg-v-card tw-border tw-border-v-brown-med/15 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-v-brown-med/25 tw-transition-all tw-shadow-sm">
            <div>
              <p className="tw-text-xs tw-font-bold tw-text-v-text-muted tw-uppercase tw-tracking-wider tw-mb-1">
                Completed Milestones
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-v-text-prim tw-m-0">
                {unique_quizzes_attempted}
              </h3>
              <p className="tw-text-[10px] tw-text-v-text-muted tw-mb-0 tw-mt-0.5">
                ({total_attempts} total quiz attempt submissions)
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-v-brown-dark/10 tw-border tw-border-v-brown-dark/20 tw-flex tw-items-center tw-justify-center">
              <CheckCircle className="tw-w-5 tw-h-5 tw-text-v-brown-dark" />
            </div>
          </div>

          <div className="tw-bg-v-card tw-border tw-border-v-brown-med/15 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-v-brown-med/25 tw-transition-all tw-shadow-sm">
            <div>
              <p className="tw-text-xs tw-font-bold tw-text-v-text-muted tw-uppercase tw-tracking-wider tw-mb-1">
                Classroom Scores
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-v-text-prim tw-m-0">
                {totalClassroomXP} XP
              </h3>
              <p className="tw-text-[10px] tw-text-v-text-muted tw-mb-0 tw-mt-0.5">
                Accumulated across active portals
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-v-brown-dark/10 tw-border tw-border-v-brown-dark/20 tw-flex tw-items-center tw-justify-center">
              <Trophy className="tw-w-5 tw-h-5 tw-text-v-brown-dark" />
            </div>
          </div>

          <div className="tw-bg-v-card tw-border tw-border-v-brown-med/15 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-v-brown-med/25 tw-transition-all tw-shadow-sm">
            <div>
              <p className="tw-text-xs tw-font-bold tw-text-v-text-muted tw-uppercase tw-tracking-wider tw-mb-1">
                Active Classrooms
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-v-text-prim tw-m-0">
                {enrolledLanguages.length}
              </h3>
              <p className="tw-text-[10px] tw-text-v-text-muted tw-mb-0 tw-mt-0.5">
                Pathways enrolled and currently open
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-v-brown-dark/10 tw-border tw-border-v-brown-dark/20 tw-flex tw-items-center tw-justify-center">
              <BookOpen className="tw-w-5 tw-h-5 tw-text-v-brown-dark" />
            </div>
          </div>

        </section>

        {/* TWO COLUMN GRID: Left (Courses / Challenges) & Right (Daily Widget / Leaderboard) */}
        <section className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">
          
          {/* LEFT 8-COLUMNS */}
          <div className="lg:tw-col-span-8 tw-flex tw-flex-col tw-gap-6">
            
            {/* CONTINUE LEARNING / COURSE PROGRESS SECTION */}
            <div className="tw-flex tw-flex-col tw-gap-3">
              <div className="tw-flex tw-items-center tw-justify-between animate-fade-in">
                <div>
                  <h3 className="tw-text-lg tw-font-bold tw-tracking-tight tw-m-0 tw-text-v-brown-dark">Continue Learning</h3>
                  <p className="tw-text-xs tw-text-v-text-muted tw-mb-0">Pick up exactly where you left off in your courses</p>
                </div>
                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-v-bg-sec hover:tw-bg-v-card tw-border tw-border-v-brown-med/20 tw-text-xs tw-font-semibold tw-text-v-brown-dark hover:tw-text-v-brown-hover tw-transition-all"
                >
                  <Plus className="tw-w-3.5 tw-h-3.5" />
                  Manage
                </button>
              </div>

              {/* Grid of Netflix-themed dynamic language progress cards */}
              <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                {enrolledLanguages.map((lang) => {
                  const theme = getLanguageTheme(lang.language_name);
                  return (
                    <motion.div
                      key={lang.language_id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className={`tw-relative tw-rounded-2xl tw-border tw-border-v-brown-med/15 tw-bg-v-card tw-p-5 tw-flex tw-flex-col tw-justify-between tw-overflow-hidden tw-transition-all tw-duration-300 ${theme.gradient} ${theme.hoverGlow}`}
                    >
                      <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                        <span className="tw-text-4xl tw-filter tw-drop-shadow-lg">{theme.flag}</span>
                        <span className="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[9px] tw-font-semibold tw-tracking-wider tw-uppercase tw-bg-v-bg-sec tw-text-v-text-sec tw-border tw-border-v-brown-med/10">
                          Active Course
                        </span>
                      </div>

                      <div className="tw-mb-4">
                        <h4 className="tw-text-lg tw-font-bold tw-text-v-brown-dark tw-mb-1">{lang.language_name} Syllabus</h4>
                        <p className="tw-text-[10px] tw-text-v-text-sec tw-leading-relaxed tw-mb-0">{theme.tagline}</p>
                      </div>

                      {/* Syllabus Progress */}
                      <div className="tw-mb-5 tw-border-t tw-border-v-brown-med/10 tw-pt-4">
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-mb-1.5">
                          <span className="tw-text-v-text-muted tw-uppercase tw-tracking-widest">Syllabus Accuracy</span>
                          <span className="tw-font-bold tw-text-v-brown-dark">{Math.round(lang.progress_percentage)}%</span>
                        </div>
                        <div className="tw-w-full tw-h-1.5 tw-bg-v-bg-sec tw-rounded-full tw-overflow-hidden">
                          <motion.div 
                            className="tw-h-full tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med"
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.progress_percentage}%` }}
                            transition={{ duration: 1.2 }}
                          />
                        </div>
                      </div>

                      {/* Enter Classroom Link Button */}
                      <Link
                        to={`/topics/${lang.language_id}`}
                        className={`tw-w-full tw-py-2.5 tw-rounded-xl tw-font-bold tw-text-xs tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-1.5 tw-no-underline ${theme.btnTheme}`}
                      >
                        <PlayCircle className="tw-w-4 tw-h-4" />
                        Resume Study
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 4-COLUMNS */}
          <div className="lg:tw-col-span-4 tw-flex tw-flex-col tw-gap-6">
            
            {/* SECTION: DAILY CHALLENGE WIDGET */}
            <div className="tw-bg-v-card tw-border tw-border-v-brown-med/15 tw-rounded-2xl tw-p-5 tw-relative tw-overflow-hidden tw-shadow-sm animate-fade-in">
              <div className="tw-absolute tw-top-0 tw-right-0 tw-w-24 tw-h-24 tw-bg-v-brown-med/5 tw-rounded-full tw-blur-xl" />
              
              <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-4">
                <div className="tw-p-2 tw-rounded-lg tw-bg-v-brown-dark/10 tw-border tw-border-v-brown-dark/20">
                  <Zap className="tw-w-4 tw-h-4 tw-text-v-brown-dark" />
                </div>
                <div>
                  <h3 className="tw-text-sm tw-font-bold tw-tracking-wider tw-uppercase tw-text-v-brown-dark tw-m-0">Daily Milestones</h3>
                  <p className="tw-text-[10px] tw-text-v-text-muted tw-mb-0">Accelerate your XP index for today</p>
                </div>
              </div>

              <div className="tw-bg-v-bg-sec tw-border tw-border-v-brown-med/15 tw-rounded-xl tw-p-4 tw-mb-4">
                <div className="tw-flex tw-justify-between tw-items-start tw-mb-2">
                  <h4 className="tw-text-xs tw-font-bold tw-text-v-text-prim">Daily Vocabulary Workout</h4>
                  <span className="tw-text-xs tw-font-bold tw-text-v-brown-dark">+150 XP</span>
                </div>
                <p className="tw-text-[10px] tw-text-v-text-sec tw-leading-relaxed tw-mb-3">
                  Translate 5 grammar phrases with absolute accuracy inside your active classrooms.
                </p>

                {/* Progress bar */}
                <div className="tw-flex tw-justify-between tw-items-center tw-text-[9px] tw-text-v-text-muted tw-mb-1.5">
                  <span>Workout status</span>
                  <span className="tw-text-v-text-prim">1 / 1 Completed</span>
                </div>
                <div className="tw-w-full tw-h-1.5 tw-bg-v-bg tw-rounded-full tw-overflow-hidden">
                  <div className="tw-w-full tw-h-full tw-bg-v-brown-dark" />
                </div>
              </div>

              {/* Claim Challenge Button with click microinteraction */}
              <motion.button
                onClick={claimDailyChallenge}
                disabled={challengeClaimed}
                whileHover={!challengeClaimed ? { scale: 1.02 } : {}}
                whileTap={!challengeClaimed ? { scale: 0.98 } : {}}
                className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-bold tw-text-xs tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-1.5 ${
                  challengeClaimed
                    ? 'tw-bg-v-bg-sec tw-text-v-text-muted tw-border tw-border-v-brown-med/15 tw-cursor-default'
                    : 'tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-shadow-sm'
                }`}
              >
                {challengeClaimed ? (
                  <>
                    <CheckCircle className="tw-w-3.5 tw-h-3.5 tw-text-v-brown-med" />
                    XP Claimed (+150 XP Active)
                  </>
                ) : (
                  <>
                    <Sparkles className="tw-w-3.5 tw-h-3.5 tw-text-white" />
                    Claim Challenge XP
                  </>
                )}
              </motion.button>
            </div>

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

      {/* STEP 6 — SLIDE-OUT MANAGE LANGUAGES SIDEBAR DRAWER */}
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
                    <h4 className="tw-text-xs tw-font-bold tw-text-[#8A7B70] tw-uppercase tw-tracking-widest tw-mb-2">Enrolled Portals</h4>
                    
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
                                    <p className="tw-text-[10px] tw-text-[#5C4A42] tw-m-0">Syllabus Completion: {Math.round(lang.progress_percentage)}%</p>
                                  </div>
                                </div>

                                {isUnenrolling ? (
                                  <span className="tw-text-[10px] tw-font-bold tw-text-[#8A7B70]">Awaiting Confirm</span>
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

                              {/* Warning confirmations */}
                              <AnimatePresence>
                                {isUnenrolling && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="tw-overflow-hidden tw-border-t tw-border-[#C7B299]/20 tw-pt-3 tw-flex tw-flex-col tw-gap-2"
                                  >
                                    <p className="tw-text-[10px] tw-text-[#991B1B] tw-bg-[#F5ECE2] tw-p-3 tw-rounded-xl tw-border tw-border-red-500/10 tw-leading-relaxed tw-mb-0 tw-font-medium">
                                      ⚠️ WARNING: Unenrolling permanently deletes all XP scores, completed quiz responses, and metrics. This cannot be undone!
                                    </p>
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                                      <button
                                        onClick={() => handleUnenrollLanguage(lang.language_id)}
                                        disabled={actionLoading === `unenroll-${lang.language_id}`}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-[#991B1B] hover:tw-bg-red-700 tw-text-white tw-font-bold tw-text-[10px] tw-rounded-lg tw-transition-all tw-shadow-sm"
                                      >
                                        {actionLoading === `unenroll-${lang.language_id}` ? 'Deleting...' : 'Yes, Wipe Progress'}
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
                    <h4 className="tw-text-xs tw-font-bold tw-text-[#8A7B70] tw-uppercase tw-tracking-widest tw-mb-2">Explore New Portals</h4>
                    
                    {nonEnrolledLanguages.length === 0 ? (
                      <div className="tw-p-4 tw-text-center tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-rounded-xl tw-shadow-sm">
                        <Sparkles className="tw-w-6 tw-h-6 tw-text-[#6B3E2E] tw-mx-auto tw-mb-2" />
                        <p className="tw-text-[10px] tw-text-[#5C4A42] tw-m-0">Incredible! You have enrolled in all active language portals!</p>
                      </div>
                    ) : (
                      <div className="tw-flex tw-flex-col tw-gap-3">
                        {nonEnrolledLanguages.map((lang) => {
                          const theme = getLanguageTheme(lang.language_name);
                          const isEnrolling = actionLoading === `enroll-${lang.language_id}`;

                          return (
                            <div
                              key={lang.language_id}
                              className="tw-bg-[#F5EFE6] tw-border tw-border-[#C7B299]/30 tw-rounded-xl tw-p-3.5 tw-flex tw-items-center tw-justify-between hover:tw-bg-[#EFE4D6] hover:tw-border-[#C7B299]/50 tw-transition-all tw-shadow-sm"
                            >
                              <div className="tw-flex tw-items-center tw-gap-3">
                                <span className="tw-text-3xl">{theme.flag}</span>
                                <div>
                                  <h5 className="tw-text-xs tw-font-bold tw-m-0 tw-text-[#2D1F18]">{lang.language_name}</h5>
                                  <p className="tw-text-[9px] tw-text-[#5C4A42] tw-m-0">Expand to include this syllabus</p>
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
              <div className="tw-pt-6 tw-border-t tw-border-[#C7B299]/20 tw-text-[10px] tw-text-[#8A7B70] tw-leading-relaxed">
                VConverso syllabus systems auto-scale grids beautifully. Enrolling in multiple portals dynamically unlocks achievements and updates leaderboards instantly.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardPage;

