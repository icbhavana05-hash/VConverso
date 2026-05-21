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
  ChevronLeft
} from 'lucide-react';

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

  // Rotate greetings cinematic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
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
    switch (name.toLowerCase()) {
      case 'spanish':
        return {
          gradient: 'tw-from-orange-600/20 tw-to-rose-600/20',
          hoverGlow: 'hover:tw-shadow-[0_0_35px_rgba(244,63,94,0.25)]',
          borderColor: 'tw-border-rose-500/30',
          activeGlow: 'tw-shadow-[0_0_20px_rgba(244,63,94,0.2)]',
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
          activeGlow: 'tw-shadow-[0_0_20px_rgba(6,182,212,0.2)]',
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
          activeGlow: 'tw-shadow-[0_0_20px_rgba(245,158,11,0.2)]',
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
          activeGlow: 'tw-shadow-[0_0_20px_rgba(168,85,247,0.2)]',
          accentColor: 'tw-text-purple-400',
          flag: '🌐',
          tagline: 'Global Linguistics Portal',
          btnTheme: 'tw-bg-purple-500 hover:tw-bg-purple-400 tw-text-white'
        };
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

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
          <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-mb-2">Retrieving User Syllabi...</h2>
          <p className="tw-text-zinc-400 tw-text-sm">Connecting to VConverso premium language pathways...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-flex tw-items-center tw-justify-center tw-px-6">
        <div className="tw-max-w-md tw-w-full tw-bg-zinc-900/60 tw-backdrop-blur-md tw-border tw-border-zinc-800 tw-rounded-2xl tw-p-8 tw-text-center tw-shadow-2xl">
          <Activity className="tw-w-16 tw-h-16 tw-text-red-500 tw-mx-auto tw-mb-6 tw-animate-bounce" />
          <h3 className="tw-text-xl tw-font-bold tw-mb-2">Connection Disturbed</h3>
          <p className="tw-text-zinc-400 tw-text-sm tw-mb-6">{error || 'Unable to fetch progress metrics.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="tw-w-full tw-py-3 tw-bg-zinc-100 hover:tw-bg-white tw-text-zinc-950 tw-font-bold tw-rounded-xl tw-transition-all"
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
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-font-sans tw-overflow-x-hidden tw-flex">
      
      {/* Background radial glowing gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-overflow-hidden tw-z-0">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-purple-900/15 tw-blur-[150px] tw-animate-pulse tw-duration-1000" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-5%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-cyan-900/15 tw-blur-[150px] tw-animate-pulse tw-duration-700" />
        <div className="tw-absolute tw-top-[40%] tw-right-[15%] tw-w-[30%] tw-h-[30%] tw-rounded-full tw-bg-rose-900/10 tw-blur-[130px]" />
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
                  backgroundColor: ['#A78D78', '#F59E0B', '#10B981', '#EC4899', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 6)],
                  boxShadow: '0 0 10px currentColor'
                }}
              />
            ))}
            <div className="tw-fixed tw-inset-0 tw-bg-purple-950/20 tw-backdrop-blur-[1px]" />
          </div>
        )}
      </AnimatePresence>

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
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all ${
              activeTab === 'dashboard'
                ? 'tw-bg-zinc-800/80 tw-text-white tw-shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] tw-border tw-border-zinc-700/50'
                : 'tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent'
            }`}
          >
            <Activity className={`tw-w-4 tw-h-4 ${activeTab === 'dashboard' ? 'tw-text-purple-400' : ''}`} />
            Dashboard Portal
          </button>

          <Link
            to="/languages"
            className="tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent tw-no-underline"
          >
            <Compass className="tw-w-4 tw-h-4 tw-text-zinc-400" />
            Language Pathways
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className={`tw-w-full tw-flex tw-items-center tw-gap-3.5 tw-px-4 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-sm tw-transition-all tw-text-zinc-400 hover:tw-text-zinc-200 hover:tw-bg-zinc-800/30 tw-border tw-border-transparent`}
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
        
        {/* MOBILE DOCK MENU (Active only on small screens) */}
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

        {/* SECTION 1: CINEMATIC WELCOME BANNER */}
        <section className="tw-relative tw-w-full tw-rounded-3xl tw-bg-gradient-to-br tw-from-purple-950/30 tw-via-zinc-900/40 tw-to-cyan-950/20 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-p-6 md:tw-p-8 tw-overflow-hidden tw-shadow-2xl">
          <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-purple-900/5 tw-to-cyan-900/5 tw-pointer-events-none" />
          
          <div className="tw-relative tw-z-10 tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-justify-between tw-gap-6">
            <div>
              <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-3">
                <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-purple-900/30 tw-text-purple-300 tw-border tw-border-purple-800/30 tw-uppercase">
                  <Flame className="tw-w-3 tw-h-3 tw-text-pink-400 tw-animate-pulse" />
                  Active Portal
                </span>
                <span className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-[10px] tw-font-semibold tw-tracking-widest tw-bg-amber-900/30 tw-text-amber-300 tw-border tw-border-amber-800/30 tw-uppercase">
                  🔥 5-Day Streak
                </span>
              </div>

              {/* Multilingual rotating greeting logo */}
              <h1 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-tracking-tight tw-mb-2">
                <motion.span
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="tw-bg-gradient-to-r tw-from-purple-400 tw-to-pink-400 tw-bg-clip-text tw-text-transparent tw-mr-3 tw-font-extrabold"
                >
                  {greetings[greetingIndex]}!
                </motion.span>
                {user?.name}
              </h1>

              <p className="tw-text-zinc-400 tw-text-sm md:tw-text-base tw-leading-relaxed tw-max-w-xl tw-m-0">
                Welcome back to your gorgeous VConverso language classroom. You have enrolled in <span className="tw-text-white tw-font-bold">{enrolledLanguages.length}</span> course{enrolledLanguages.length > 1 ? 's' : ''}. Complete daily milestones to climb the leaderboards beautifully.
              </p>
            </div>

            {/* Overall progress visualizer widget */}
            <div className="tw-flex tw-items-center tw-gap-4 tw-bg-zinc-900/60 tw-border tw-border-zinc-800 tw-rounded-2xl tw-p-4 tw-relative tw-overflow-hidden">
              <div className="tw-relative tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center">
                <svg className="tw-w-full tw-h-full" viewBox="0 0 36 36">
                  <path
                    className="tw-text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="tw-text-purple-500"
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
                <div className="tw-absolute tw-text-[11px] tw-font-bold tw-text-zinc-100">
                  {Math.round(overall_progress_percentage)}%
                </div>
              </div>

              <div>
                <h5 className="tw-text-xs tw-font-bold tw-tracking-widest tw-uppercase tw-text-zinc-500 tw-mb-0.5">
                  Overall Completion
                </h5>
                <h3 className="tw-text-lg tw-font-bold tw-text-zinc-100 tw-m-0">
                  {totalClassroomXP} <span className="tw-text-xs tw-text-purple-400 tw-font-normal">Total XP</span>
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS ROW (Quick Stats Overview) */}
        <section className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
          
          <div className="tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-zinc-700/50 tw-transition-all">
            <div>
              <p className="tw-text-xs tw-font-semibold tw-text-zinc-500 tw-uppercase tw-tracking-wider tw-mb-1">
                Completed Milestones
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-zinc-100 tw-m-0">
                {unique_quizzes_attempted}
              </h3>
              <p className="tw-text-[10px] tw-text-zinc-500 tw-mb-0 tw-mt-0.5">
                ({total_attempts} total quiz attempt submissions)
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-purple-950/40 tw-border tw-border-purple-800/30 tw-flex tw-items-center tw-justify-center">
              <CheckCircle className="tw-w-5 tw-h-5 tw-text-purple-400" />
            </div>
          </div>

          <div className="tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-zinc-700/50 tw-transition-all">
            <div>
              <p className="tw-text-xs tw-font-semibold tw-text-zinc-500 tw-uppercase tw-tracking-wider tw-mb-1">
                Classroom Scores
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-zinc-100 tw-m-0">
                {totalClassroomXP} XP
              </h3>
              <p className="tw-text-[10px] tw-text-zinc-500 tw-mb-0 tw-mt-0.5">
                Accumulated across active portals
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-pink-950/40 tw-border tw-border-pink-800/30 tw-flex tw-items-center tw-justify-center">
              <Trophy className="tw-w-5 tw-h-5 tw-text-pink-400" />
            </div>
          </div>

          <div className="tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-5 tw-flex tw-items-center tw-justify-between hover:tw-border-zinc-700/50 tw-transition-all">
            <div>
              <p className="tw-text-xs tw-font-semibold tw-text-zinc-500 tw-uppercase tw-tracking-wider tw-mb-1">
                Active Classrooms
              </p>
              <h3 className="tw-text-2xl tw-font-bold tw-text-zinc-100 tw-m-0">
                {enrolledLanguages.length}
              </h3>
              <p className="tw-text-[10px] tw-text-zinc-500 tw-mb-0 tw-mt-0.5">
                Pathways enrolled and currently open
              </p>
            </div>
            <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-cyan-950/40 tw-border tw-border-cyan-800/30 tw-flex tw-items-center tw-justify-center">
              <BookOpen className="tw-w-5 tw-h-5 tw-text-cyan-400" />
            </div>
          </div>

        </section>

        {/* TWO COLUMN GRID: Left (Courses / Challenges) & Right (Daily Widget / Leaderboard) */}
        <section className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">
          
          {/* LEFT 7-COLUMNS */}
          <div className="lg:tw-col-span-7 tw-flex tw-flex-col tw-gap-6">
            
            {/* CONTINUE LEARNING / COURSE PROGRESS SECTION */}
            <div className="tw-flex tw-flex-col tw-gap-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div>
                  <h3 className="tw-text-lg tw-font-bold tw-tracking-tight tw-m-0">Continue Learning</h3>
                  <p className="tw-text-xs tw-text-zinc-500 tw-mb-0">Pick up exactly where you left off in your courses</p>
                </div>
                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-zinc-800/60 hover:tw-bg-zinc-700 tw-border tw-border-zinc-700/40 tw-text-xs tw-font-semibold tw-text-zinc-300 hover:tw-text-white tw-transition-all"
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
                      className={`tw-relative tw-rounded-2xl tw-border tw-border-zinc-800/80 tw-bg-zinc-900/40 tw-backdrop-blur-md tw-p-5 tw-flex tw-flex-col tw-justify-between tw-overflow-hidden tw-transition-all tw-duration-300 ${theme.gradient} ${theme.hoverGlow}`}
                    >
                      {/* Neon glow backdrop */}
                      <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br tw-opacity-[0.02] group-hover:tw-opacity-5 tw-transition-opacity" />

                      <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                        <span className="tw-text-4xl tw-filter tw-drop-shadow-lg">{theme.flag}</span>
                        <span className="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[9px] tw-font-semibold tw-tracking-wider tw-uppercase tw-bg-zinc-800/80 tw-text-zinc-300 tw-border tw-border-zinc-700/30">
                          Active Course
                        </span>
                      </div>

                      <div className="tw-mb-4">
                        <h4 className="tw-text-lg tw-font-bold tw-text-zinc-100 tw-mb-1">{lang.language_name} Syllabus</h4>
                        <p className="tw-text-[10px] tw-text-zinc-400 tw-leading-relaxed tw-mb-0">{theme.tagline}</p>
                      </div>

                      {/* Syllabus Progress */}
                      <div className="tw-mb-5 tw-border-t tw-border-zinc-800/60 tw-pt-4">
                        <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-mb-1.5">
                          <span className="tw-text-zinc-500 tw-uppercase tw-tracking-widest">Syllabus Accuracy</span>
                          <span className={`tw-font-bold ${theme.accentColor}`}>{Math.round(lang.progress_percentage)}%</span>
                        </div>
                        <div className="tw-w-full tw-h-1.5 tw-bg-zinc-850 tw-rounded-full tw-overflow-hidden">
                          <motion.div 
                            className={`tw-h-full tw-bg-gradient-to-r tw-from-purple-500 tw-to-pink-500`}
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

          {/* RIGHT 5-COLUMNS */}
          <div className="lg:tw-col-span-5 tw-flex tw-flex-col tw-gap-6">
            
            {/* SECTION: DAILY CHALLENGE WIDGET */}
            <div className="tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-5 tw-relative tw-overflow-hidden">
              <div className="tw-absolute tw-top-0 tw-right-0 tw-w-24 tw-h-24 tw-bg-purple-600/5 tw-rounded-full tw-blur-xl" />
              
              <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-4">
                <div className="tw-p-2 tw-rounded-lg tw-bg-purple-950/30 tw-border tw-border-purple-800/20">
                  <Zap className="tw-w-4 tw-h-4 tw-text-purple-400" />
                </div>
                <div>
                  <h3 className="tw-text-sm tw-font-bold tw-tracking-wider tw-uppercase tw-text-zinc-400 tw-m-0">Daily Milestones</h3>
                  <p className="tw-text-[10px] tw-text-zinc-500 tw-mb-0">Accelerate your XP index for today</p>
                </div>
              </div>

              <div className="tw-bg-zinc-950/40 tw-border tw-border-zinc-800/80 tw-rounded-xl tw-p-4 tw-mb-4">
                <div className="tw-flex tw-justify-between tw-items-start tw-mb-2">
                  <h4 className="tw-text-xs tw-font-bold tw-text-zinc-200">Daily Vocabulary Workout</h4>
                  <span className="tw-text-xs tw-font-bold tw-text-purple-400">+150 XP</span>
                </div>
                <p className="tw-text-[10px] tw-text-zinc-400 tw-leading-relaxed tw-mb-3">
                  Translate 5 grammar phrases with absolute accuracy inside your active classrooms.
                </p>

                {/* Progress bar */}
                <div className="tw-flex tw-justify-between tw-items-center tw-text-[9px] tw-text-zinc-500 tw-mb-1.5">
                  <span>Workout status</span>
                  <span className="tw-text-zinc-300">1 / 1 Completed</span>
                </div>
                <div className="tw-w-full tw-h-1.5 tw-bg-zinc-900 tw-rounded-full tw-overflow-hidden">
                  <div className="tw-w-full tw-h-full tw-bg-purple-500" />
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
                    ? 'tw-bg-zinc-800/40 tw-text-zinc-500 tw-border tw-border-zinc-800 tw-cursor-default'
                    : 'tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-600 tw-text-zinc-100 hover:tw-opacity-95 tw-shadow-lg tw-shadow-purple-950/20'
                }`}
              >
                {challengeClaimed ? (
                  <>
                    <CheckCircle className="tw-w-3.5 tw-h-3.5 tw-text-pink-400" />
                    XP Claimed (+150 XP Active)
                  </>
                ) : (
                  <>
                    <Sparkles className="tw-w-3.5 tw-h-3.5 tw-text-amber-400 tw-animate-spin" />
                    Claim Challenge XP
                  </>
                )}
              </motion.button>
            </div>



            {/* RECENT ACTIVITIES TIMELINE */}
            <div className="tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-800/80 tw-rounded-2xl tw-p-5">
              <h3 className="tw-text-sm tw-font-bold tw-tracking-wider tw-uppercase tw-text-zinc-400 tw-mb-4 d-flex tw-items-center tw-gap-2">
                <Activity className="tw-w-4 tw-h-4 tw-text-zinc-500" />
                Recent Diagnostic Activities
              </h3>

              {recent_activity.length === 0 ? (
                <div className="tw-text-center tw-py-8">
                  <BookOpen className="tw-w-10 tw-h-10 tw-text-zinc-700 tw-mx-auto tw-mb-3" />
                  <p className="tw-text-zinc-500 tw-text-xs tw-mb-4">Launch your first grammar quiz to begin tracking diagnostics.</p>
                  <button 
                    onClick={() => {
                      if (enrolledLanguages.length > 0) {
                        navigate(`/topics/${enrolledLanguages[0].language_id}`);
                      }
                    }} 
                    className="tw-px-4 tw-py-2 tw-bg-zinc-800 hover:tw-bg-zinc-700 tw-border tw-border-zinc-700/60 tw-text-zinc-300 tw-font-bold tw-text-[10px] tw-rounded-lg tw-transition-all"
                  >
                    Enter Active Classroom
                  </button>
                </div>
              ) : (
                <div className="tw-flex tw-flex-col tw-gap-3">
                  {recent_activity.map((act) => {
                    const theme = getLanguageTheme(act.language_name);
                    return (
                      <div className="tw-pb-3 tw-border-b tw-border-zinc-800/60 last:tw-border-none last:tw-pb-0" key={act.attempt_id}>
                        <div className="tw-flex tw-justify-between tw-items-start tw-mb-1">
                          <h4 className="tw-text-xs tw-font-bold tw-text-zinc-200 tw-m-0 tw-leading-snug">{act.quiz_title}</h4>
                          <span className="tw-px-2 tw-py-0.5 tw-rounded-full tw-text-[9px] tw-font-bold tw-bg-emerald-950/40 tw-text-emerald-400 tw-border tw-border-emerald-900/40">
                            Score: {act.score}
                          </span>
                        </div>
                        <div className="tw-flex tw-justify-between tw-items-center">
                          <span className="tw-text-[10px] tw-text-zinc-500">
                            {theme.flag} {act.language_name} &bull; {act.topic_name}
                          </span>
                          <span className="tw-text-[9px] tw-text-zinc-650">
                            {new Date(act.attempt_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </section>

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

                              {/* Warning confirmations */}
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
                                        disabled={actionLoading === `unenroll-${lang.language_id}`}
                                        className="tw-flex-1 tw-py-1.5 tw-bg-red-500 hover:tw-bg-red-400 tw-text-zinc-950 tw-font-bold tw-text-[10px] tw-rounded-lg tw-transition-all"
                                      >
                                        {actionLoading === `unenroll-${lang.language_id}` ? 'Deleting...' : 'Yes, Wipe Progress'}
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
                          const isEnrolling = actionLoading === `enroll-${lang.language_id}`;

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

export default DashboardPage;
