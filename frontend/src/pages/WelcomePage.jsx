import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const WelcomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Premium quotes list
  const quotes = [
    { text: "To have another language is to possess a second soul.", author: "Charlemagne" },
    { text: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith" },
    { text: "Learning a language is not just words; it is learning another way to think about things.", author: "Flora Lewis" },
    { text: "Limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" }
  ];

  useEffect(() => {
    // Quote rotation interval
    const quoteInterval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 7000);

    const fetchWelcomeData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/progress/${user.user_id}`);
        setData(response.data.analytics);
      } catch (err) {
        console.error('[Welcome Page Data Error]:', err);
        setError('Could not establish connection to the progress dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeData();
    return () => clearInterval(quoteInterval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to resolve flag icons
  const getFlagIcon = (langName) => {
    switch (langName.toLowerCase()) {
      case 'english': return '🇬🇧';
      case 'french': return '🇫🇷';
      case 'german': return '🇩🇪';
      case 'spanish': return '🇪🇸';
      default: return '🌐';
    }
  };

  // Safe color boundaries for glow accents matching language aesthetics
  const getLanguageGlowClass = (langName) => {
    switch (langName.toLowerCase()) {
      case 'english': return 'group-hover:tw-shadow-blue-500/20 group-hover:tw-border-blue-500/40';
      case 'french': return 'group-hover:tw-shadow-cyan-500/20 group-hover:tw-border-cyan-500/40';
      case 'german': return 'group-hover:tw-shadow-amber-500/20 group-hover:tw-border-amber-500/40';
      case 'spanish': return 'group-hover:tw-shadow-rose-500/20 group-hover:tw-border-rose-500/40';
      default: return 'group-hover:tw-shadow-terracotta/20 group-hover:tw-border-terracotta/40';
    }
  };

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-bg-zinc-950 tw-flex tw-flex-col tw-align-middle tw-justify-center tw-items-center">
        <div className="tw-relative tw-w-24 tw-h-24">
          <div className="tw-absolute tw-inset-0 tw-rounded-full tw-border-4 tw-border-t-terracotta tw-border-zinc-800 tw-animate-spin"></div>
          <div className="tw-absolute tw-inset-2 tw-rounded-full tw-border-4 tw-border-b-sand tw-border-zinc-900 tw-animate-spin tw-animation-reverse tw-opacity-70"></div>
        </div>
        <p className="tw-mt-8 tw-text-sand tw-font-medium tw-text-lg tw-tracking-wider tw-animate-pulse">
          INITIALIZING STAGE...
        </p>
      </div>
    );
  }

  // Aggregate user statistics
  const totalScore = data?.languages?.reduce((acc, curr) => acc + curr.total_score, 0) || 0;
  const userLevel = Math.floor(totalScore / 300) + 1;
  const currentLevelXP = totalScore % 300;
  const targetLevelXP = 300;
  const xpPercentage = (currentLevelXP / targetLevelXP) * 100;

  // Mock list of recent learning activities if no real database history exists
  const mockActivities = [
    { id: 1, title: 'English Definite Articles', lang: 'English', progress: 75, type: 'Quiz', code: 'EN' },
    { id: 2, title: 'French Present Conjugation', lang: 'French', progress: 90, type: 'Grammar', code: 'FR' },
    { id: 3, title: 'German Accusative Case', lang: 'German', progress: 40, type: 'Quiz', code: 'DE' },
    { id: 4, title: 'Spanish Conversational Dialogue', lang: 'Spanish', progress: 60, type: 'Vocabulary', code: 'ES' }
  ];

  const recentActivities = data?.recent_activity?.length > 0
    ? data.recent_activity.map((act, idx) => ({
        id: act.attempt_id || idx,
        title: act.quiz_title || 'Vocabulary Drills',
        lang: act.language_name,
        progress: act.score * 10 || 70,
        type: act.topic_name || 'Evaluation',
        code: act.language_name.substring(0, 2).toUpperCase()
      }))
    : mockActivities;

  return (
    <div className="tw-min-h-screen tw-bg-zinc-950 tw-text-zinc-100 tw-font-sans tw-overflow-x-hidden tw-relative tw-pb-16 selection:tw-bg-terracotta selection:tw-text-white">
      
      {/* 🌌 Modern Ambient Glows / Mesh Gradients */}
      <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-terracotta/10 tw-blur-[120px] tw-pointer-events-none"></div>
      <div className="tw-absolute tw-bottom-[10%] tw-right-[-10%] tw-w-[40%] tw-h-[50%] tw-rounded-full tw-bg-sand/10 tw-blur-[120px] tw-pointer-events-none"></div>
      <div className="tw-absolute tw-top-[30%] tw-left-[40%] tw-w-[30%] tw-h-[30%] tw-rounded-full tw-bg-zinc-800/20 tw-blur-[100px] tw-pointer-events-none"></div>

      {/* 🚀 Header */}
      <nav className="tw-sticky tw-top-0 tw-z-50 tw-bg-zinc-950/70 tw-backdrop-blur-md tw-border-b tw-border-zinc-900 tw-py-4">
        <div className="tw-max-w-7xl tw-mx-auto tw-px-6 tw-flex tw-justify-between tw-items-center">
          
          {/* Logo brand */}
          <Link to="/dashboard" className="tw-flex tw-items-center tw-gap-2.5 tw-no-underline">
            <span className="tw-bg-gradient-to-br tw-from-terracotta tw-to-sand tw-p-2 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-shadow-terracotta/20">
              <i className="bi bi-translate tw-text-white tw-text-xl"></i>
            </span>
            <span className="tw-text-2xl tw-font-bold tw-tracking-wide tw-text-white">
              V<span className="tw-text-sand">Converso</span>
            </span>
          </Link>

          {/* Right Header Navigation */}
          <div className="tw-flex tw-items-center tw-gap-6">
            {user ? (
              <div className="tw-flex tw-items-center tw-gap-4">
                <span className="tw-text-zinc-400 tw-text-sm tw-hidden tw-md-inline-block">
                  Logged in as <span className="tw-text-white tw-font-medium">{user.name}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="tw-bg-zinc-900 hover:tw-bg-zinc-800 tw-border tw-border-zinc-800 tw-text-white tw-px-4 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-transition-all tw-duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="tw-flex tw-items-center tw-gap-4">
                <Link to="/login" className="tw-text-zinc-300 hover:tw-text-white tw-text-sm tw-font-medium tw-no-underline">Login</Link>
                <Link to="/register" className="tw-bg-terracotta hover:tw-bg-terracotta/90 tw-text-white tw-px-5 tw-py-2.5 tw-rounded-xl tw-text-sm tw-font-medium tw-transition-all tw-duration-200 tw-no-underline">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🏠 Main Body Container */}
      <main className="tw-max-w-7xl tw-mx-auto tw-px-6 tw-pt-12 tw-relative tw-z-10">
        
        {/* Row 1: Profile & Widget Layout */}
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8 tw-mb-12">
          
          {/* Column A: Greeting & XP Gauge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:tw-col-span-2 tw-bg-zinc-900/40 tw-backdrop-blur-xl tw-border tw-border-zinc-800/80 tw-p-8 tw-rounded-3xl tw-flex tw-flex-col tw-justify-between tw-relative tw-overflow-hidden"
          >
            {/* Soft decorative spot */}
            <div className="tw-absolute -tw-top-24 -tw-left-24 tw-w-48 tw-h-48 tw-bg-terracotta/10 tw-rounded-full tw-blur-3xl"></div>

            <div>
              <div className="tw-flex tw-items-center tw-gap-2.5 tw-mb-4">
                <span className="tw-flex tw-h-3 tw-w-3 tw-relative">
                  <span className="tw-animate-ping tw-absolute tw-inline-flex tw-h-full tw-w-full tw-rounded-full tw-bg-emerald-400 tw-opacity-75"></span>
                  <span className="tw-relative tw-inline-flex tw-rounded-full tw-h-3 tw-w-3 tw-bg-emerald-500"></span>
                </span>
                <span className="tw-text-xs tw-text-emerald-400 tw-font-semibold tw-tracking-wider tw-uppercase">
                  ONLINE CLASSROOM STATUS
                </span>
              </div>

              <h1 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-tracking-tight tw-leading-none tw-mb-4">
                Ready to speak the world, <span className="tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-terracotta tw-to-sand">{user?.name || 'Guest'}</span>?
              </h1>
              <p className="tw-text-zinc-400 tw-text-base tw-leading-relaxed tw-max-w-xl tw-mb-6">
                Your immersive language journey awaits. Explore modules across four core European syllabi, practice custom grammar rules, and complete your scoreboard.
              </p>
            </div>

            {/* XP Level Progress Indicator */}
            <div className="tw-bg-zinc-950/60 tw-border tw-border-zinc-800/60 tw-p-5 tw-rounded-2xl">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-3.5">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-bg-sand/20 tw-text-sand tw-text-xs tw-font-bold tw-px-2.5 tw-py-1 tw-rounded-md">
                    LVL {userLevel}
                  </span>
                  <span className="tw-text-sm tw-text-zinc-400">XP Progress Tracker</span>
                </div>
                <span className="tw-text-sm tw-font-semibold tw-text-white">
                  {totalScore} <span className="tw-text-zinc-500">/ {userLevel * 300} XP</span>
                </span>
              </div>
              
              {/* Progress track */}
              <div className="tw-w-full tw-h-3 tw-bg-zinc-900 tw-rounded-full tw-overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="tw-h-full tw-bg-gradient-to-r tw-from-terracotta tw-to-sand tw-rounded-full tw-shadow-[0_0_8px_rgba(110,71,56,0.5)]"
                ></motion.div>
              </div>

              <div className="tw-flex tw-justify-between tw-items-center tw-mt-2.5">
                <span className="tw-text-xs tw-text-zinc-500">Accumulated Score</span>
                <span className="tw-text-xs tw-text-sand tw-font-medium">
                  {targetLevelXP - currentLevelXP} XP to Level {userLevel + 1}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Column B: Streak and Metrics Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="tw-bg-zinc-900/40 tw-backdrop-blur-xl tw-border tw-border-zinc-800/80 tw-p-8 tw-rounded-3xl tw-flex tw-flex-col tw-justify-between tw-relative tw-overflow-hidden"
          >
            {/* Sparkle spot */}
            <div className="tw-absolute -tw-bottom-24 -tw-right-24 tw-w-48 tw-h-48 tw-bg-sand/10 tw-rounded-full tw-blur-3xl"></div>

            {/* Streak Counter Header */}
            <div>
              <div className="tw-flex tw-justify-between tw-items-start tw-mb-6">
                <div>
                  <span className="tw-text-zinc-500 tw-text-xs tw-font-bold tw-tracking-widest tw-uppercase tw-block tw-mb-1">
                    STUDENT DRILL STREAK
                  </span>
                  <h3 className="tw-text-3xl tw-font-bold tw-text-white tw-flex tw-items-center tw-gap-2">
                    🔥 5 Days
                  </h3>
                </div>
                <span className="tw-bg-terracotta/20 tw-text-terracotta tw-text-xs tw-font-bold tw-px-3 tw-py-1.5 tw-rounded-full">
                  ACTIVE
                </span>
              </div>

              {/* Day badges */}
              <div className="tw-flex tw-justify-between tw-gap-2 tw-mb-6">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const isCompleted = idx < 5; // Mon to Fri
                  const isCurrent = idx === 4; // Friday active
                  return (
                    <div key={idx} className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-flex-1">
                      <div className={`tw-w-9 tw-h-9 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-transition-all ${
                        isCompleted 
                          ? isCurrent
                            ? 'tw-bg-gradient-to-br tw-from-terracotta tw-to-sand tw-text-white tw-ring-2 tw-ring-terracotta/30'
                            : 'tw-bg-terracotta/25 tw-text-sand tw-border tw-border-terracotta/30'
                          : 'tw-bg-zinc-950/60 tw-text-zinc-600 tw-border tw-border-zinc-800'
                      }`}>
                        {isCompleted ? '✓' : day}
                      </div>
                      <span className={`tw-text-[10px] ${isCurrent ? 'tw-text-white tw-font-bold' : 'tw-text-zinc-500'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Summary */}
            <div className="tw-grid tw-grid-cols-2 tw-gap-3.5 tw-mt-4">
              <div className="tw-bg-zinc-950/50 tw-p-3.5 tw-rounded-xl tw-border tw-border-zinc-800/40">
                <span className="tw-text-zinc-500 tw-text-[10px] tw-font-bold tw-tracking-wider tw-uppercase tw-block tw-mb-1">
                  QUIZZES DRILLS
                </span>
                <span className="tw-text-xl tw-font-bold tw-text-white">
                  {data?.unique_quizzes_attempted || 0}
                </span>
              </div>
              <div className="tw-bg-zinc-950/50 tw-p-3.5 tw-rounded-xl tw-border tw-border-zinc-800/40">
                <span className="tw-text-zinc-500 tw-text-[10px] tw-font-bold tw-tracking-wider tw-uppercase tw-block tw-mb-1">
                  AVG ACCURACY
                </span>
                <span className="tw-text-xl tw-font-bold tw-text-white">
                  {data?.average_score ? `${data.average_score}/10` : '0/10'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Row CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="tw-bg-gradient-to-r tw-from-zinc-900/60 tw-to-zinc-900/20 tw-backdrop-blur-xl tw-border tw-border-zinc-800/70 tw-p-6 tw-rounded-2xl tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-4 tw-mb-16"
        >
          <div className="tw-flex tw-items-center tw-gap-4">
            <span className="tw-bg-terracotta/20 tw-text-terracotta tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-lg">
              <i className="bi bi-play-circle-fill"></i>
            </span>
            <div className="tw-text-center md:tw-text-left">
              <span className="tw-text-zinc-400 tw-text-xs">RECENT ACTIVITY DRILL DETECTED</span>
              <h4 className="tw-text-white tw-font-semibold tw-text-sm tw-mb-0">
                Ready to continue your language pathway modules?
              </h4>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="tw-w-full md:tw-w-auto tw-bg-gradient-to-r tw-from-terracotta tw-to-sand hover:tw-opacity-95 tw-text-white tw-font-semibold tw-px-8 tw-py-3.5 tw-rounded-xl tw-shadow-lg tw-shadow-terracotta/25 tw-transition-all tw-duration-300 active:tw-scale-98"
          >
            Continue Learning <i className="bi bi-arrow-right-short tw-text-lg tw-align-middle"></i>
          </button>
        </motion.div>

        {/* Section 2: Recent Activities Carousel (Netflix style!) */}
        <div className="tw-mb-16">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <h2 className="tw-text-xl tw-font-bold tw-text-white tw-flex tw-items-center tw-gap-2.5">
              <span className="tw-w-1 tw-h-5 tw-bg-terracotta tw-rounded-full"></span>
              Recent Learning Activities
            </h2>
            <span className="tw-text-zinc-500 tw-text-xs">Mouse drag or swipe to explore</span>
          </div>

          {/* Swipeable Horizontal track container */}
          <div className="tw-overflow-x-auto tw-pb-4 tw-scrollbar-thin tw-scrollbar-thumb-zinc-800">
            <div className="tw-flex tw-gap-6 tw-min-w-max">
              {recentActivities.map((act, index) => (
                <motion.div 
                  key={act.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="tw-w-72 tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-900 hover:tw-border-zinc-800/80 tw-p-5 tw-rounded-2xl tw-group tw-relative tw-overflow-hidden tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:tw-shadow-black/20"
                >
                  {/* Subtle hover accent element */}
                  <div className="tw-absolute tw-inset-x-0 tw-top-0 tw-h-1 tw-bg-gradient-to-r tw-from-terracotta/40 tw-to-sand/40 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity"></div>

                  <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                    <span className="tw-bg-zinc-950 tw-text-zinc-400 tw-text-[10px] tw-font-bold tw-px-2.5 tw-py-1 tw-rounded-md">
                      {act.type.toUpperCase()}
                    </span>
                    <span className="tw-text-xl">{getFlagIcon(act.lang)}</span>
                  </div>

                  <h4 className="tw-text-white tw-font-semibold tw-text-base tw-mb-1 tw-line-clamp-1 group-hover:tw-text-sand tw-transition-colors">
                    {act.title}
                  </h4>
                  <p className="tw-text-zinc-500 tw-text-xs tw-mb-4">
                    Active Syllabus: {act.lang}
                  </p>

                  {/* Progress Indicator inside carousel card */}
                  <div className="tw-space-y-1.5 tw-mb-4">
                    <div className="tw-flex tw-justify-between tw-text-[10px] tw-text-zinc-400">
                      <span>Module progress</span>
                      <span>{act.progress}%</span>
                    </div>
                    <div className="tw-w-full tw-h-1.5 tw-bg-zinc-950 tw-rounded-full tw-overflow-hidden">
                      <div className="tw-h-full tw-bg-terracotta tw-rounded-full" style={{ width: `${act.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Resume Overlay trigger button */}
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="tw-w-full tw-bg-zinc-950/80 hover:tw-bg-terracotta tw-text-zinc-300 hover:tw-text-white tw-py-2.5 tw-rounded-xl tw-text-xs tw-font-semibold tw-flex tw-items-center tw-justify-center tw-gap-1.5 tw-transition-all tw-duration-300"
                  >
                    <i className="bi bi-play-fill tw-text-sm"></i> Resume Module
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Horizontal Language Selection Cards */}
        <div className="tw-mb-16">
          <div className="tw-mb-6">
            <h2 className="tw-text-xl tw-font-bold tw-text-white tw-flex tw-items-center tw-gap-2.5">
              <span className="tw-w-1 tw-h-5 tw-bg-terracotta tw-rounded-full"></span>
              Core Language Pathways
            </h2>
            <p className="tw-text-zinc-500 tw-text-sm tw-mt-1">
              Select one of our premium European language syllabi to launch intensive learning modules.
            </p>
          </div>

          {/* Grid Layout of Language Cards */}
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
            {[
              { name: 'English', desc: 'Unlock international standard grammar drills, auxiliary structures, and conversational models.', theme: 'English' },
              { name: 'French', desc: 'Master beautiful phonetic conjugations, gender classifications, and accent paradigms.', theme: 'French' },
              { name: 'German', desc: 'Navigate composite articles, complex verb splits, and sentence structure indices.', theme: 'German' },
              { name: 'Spanish', desc: 'Dive into vibrant subjunctive moods, reflexive particles, and active dialect expressions.', theme: 'Spanish' }
            ].map((lang, idx) => {
              // Find matching database course stats if logged in
              const dbStats = data?.languages?.find(l => l.language_name.toLowerCase() === lang.name.toLowerCase());
              const progPercent = dbStats ? Math.round(dbStats.progress_percentage) : 0;
              const points = dbStats ? dbStats.total_score : 0;

              return (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => navigate('/languages')}
                  className={`tw-bg-zinc-900/30 tw-backdrop-blur-md tw-border tw-border-zinc-900 tw-p-6 tw-rounded-2xl tw-cursor-pointer tw-flex tw-flex-col tw-justify-between tw-group tw-transition-all tw-duration-300 tw-shadow-md hover:tw-shadow-2xl ${getLanguageGlowClass(lang.theme)}`}
                >
                  <div>
                    {/* Badge flag indicator */}
                    <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                      <span className="tw-text-3xl tw-filter tw-drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                        {getFlagIcon(lang.name)}
                      </span>
                      <span className="tw-bg-zinc-950 tw-text-zinc-500 tw-text-[10px] tw-font-bold tw-px-2 tw-py-1 tw-rounded-md">
                        A1 - B2
                      </span>
                    </div>

                    <h3 className="tw-text-white tw-font-bold tw-text-lg tw-mb-2 group-hover:tw-text-sand tw-transition-colors">
                      {lang.name} Syllabus
                    </h3>
                    
                    <p className="tw-text-zinc-400 tw-text-xs tw-leading-relaxed tw-mb-6">
                      {lang.desc}
                    </p>
                  </div>

                  {/* Card bottom metrics */}
                  <div className="tw-bg-zinc-950/70 tw-border tw-border-zinc-800/40 tw-p-3 tw-rounded-xl tw-space-y-2">
                    <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px]">
                      <span className="tw-text-zinc-500">DRILL PROGRESS</span>
                      <span className="tw-text-white tw-font-semibold">{progPercent}%</span>
                    </div>
                    {/* progress mini bar */}
                    <div className="tw-w-full tw-h-1 tw-bg-zinc-900 tw-rounded-full tw-overflow-hidden">
                      <div className="tw-h-full tw-bg-sand tw-rounded-full" style={{ width: `${progPercent}%` }}></div>
                    </div>
                    <div className="tw-flex tw-justify-between tw-items-center tw-text-[10px] tw-text-zinc-500 tw-pt-1">
                      <span>ACCUMULATED SCORE</span>
                      <span className="tw-text-sand tw-font-bold">{points} PTS</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Dynamic Motivational Quote Bar (Rotating animations) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="tw-w-full tw-bg-gradient-to-b tw-from-zinc-900/20 tw-to-zinc-900/40 tw-backdrop-blur-md tw-border-t tw-border-b tw-border-zinc-900 tw-py-8 tw-text-center tw-px-4 tw-relative tw-overflow-hidden"
        >
          {/* Subtle light effect in background */}
          <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-r tw-from-transparent tw-via-terracotta/5 tw-to-transparent tw-pointer-events-none"></div>

          <div className="tw-max-w-2xl tw-mx-auto tw-relative z-1">
            <span className="tw-text-terracotta tw-text-2xl tw-font-serif tw-block tw-mb-2">“</span>
            
            <div className="tw-min-h-[50px] tw-flex tw-align-middle tw-justify-center tw-items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeQuoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="tw-text-zinc-300 tw-italic tw-text-sm tw-leading-relaxed tw-mb-2"
                >
                  {quotes[activeQuoteIndex].text}
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.span
                key={activeQuoteIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tw-text-zinc-500 tw-text-xs tw-font-semibold tw-tracking-wider tw-uppercase"
              >
                — {quotes[activeQuoteIndex].author}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

      </main>

    </div>
  );
};

export default WelcomePage;
