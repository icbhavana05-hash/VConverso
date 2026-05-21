import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const LanguageSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Course configuration with unique themed styles
  const languageOptions = [
    {
      id: 4, // Spanish
      name: 'Spanish',
      flag: '🇪🇸',
      tagline: 'Embark on a sun-drenched journey of rhythm, passion, and culture.',
      colorClass: 'tw-from-orange-600/35 tw-to-rose-600/35',
      glowColor: 'group-hover:tw-shadow-rose-500/40 group-hover:tw-border-rose-400',
      activeBorder: 'tw-border-rose-500 tw-shadow-[0_0_35px_rgba(244,63,94,0.4)]',
      bgTheme: 'tw-bg-rose-950/20',
      badgeText: 'Sunset Accent'
    },
    {
      id: 2, // French
      name: 'French',
      flag: '🇫🇷',
      tagline: 'Unveil the elegant accents of romance, cuisine, and philosophy.',
      colorClass: 'tw-from-indigo-600/35 tw-to-cyan-600/35',
      glowColor: 'group-hover:tw-shadow-cyan-500/40 group-hover:tw-border-cyan-400',
      activeBorder: 'tw-border-cyan-500 tw-shadow-[0_0_35px_rgba(6,182,212,0.4)]',
      bgTheme: 'tw-bg-cyan-950/20',
      badgeText: 'Midnight Paris'
    },
    {
      id: 3, // German
      name: 'German',
      flag: '🇩🇪',
      tagline: 'Discover the engineered precision of thought, structure, and history.',
      colorClass: 'tw-from-zinc-700/35 tw-to-amber-600/35',
      glowColor: 'group-hover:tw-shadow-amber-500/40 group-hover:tw-border-amber-400',
      activeBorder: 'tw-border-amber-500 tw-shadow-[0_0_35px_rgba(245,158,11,0.4)]',
      bgTheme: 'tw-bg-amber-950/20',
      badgeText: 'Industrial Slate'
    }
  ];

  const handleSelection = (id) => {
    setSelectedId(id);
  };

  const handleEnroll = async () => {
    if (!selectedId) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/languages/enroll', { language_id: selectedId });
      // Redirect to personalized dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('[Language Onboarding Enroll Error]:', err);
      setError(err.response?.data?.message || 'Could not save language. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-zinc-950 tw-overflow-hidden tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-zinc-100 tw-py-12 tw-px-4">
      
      {/* Background Orbs */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
        <div className="tw-absolute tw-top-[5%] tw-left-[10%] tw-w-[40%] tw-h-[40%] tw-rounded-full tw-bg-rose-900/10 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[5%] tw-right-[10%] tw-w-[40%] tw-h-[40%] tw-rounded-full tw-bg-cyan-900/10 tw-blur-[120px]" />
      </div>

      {/* Title Header */}
      <div className="tw-text-center tw-z-10 tw-max-w-2xl tw-mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-tracking-widest tw-bg-purple-900/30 tw-text-purple-300 tw-border tw-border-purple-800/30 tw-uppercase">
            Onboarding Phase
          </span>
          <h2 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-tracking-tight tw-mt-4 tw-mb-3">
            Choose Your First Language
          </h2>
          <p className="tw-text-zinc-400 tw-text-base md:tw-text-lg">
            Every great journey begins with a single step. Select your active learning path to sculpt your personalized VConverso experience.
          </p>
        </motion.div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="tw-z-10 tw-max-w-md tw-w-full tw-mb-6 tw-bg-red-950/20 tw-border tw-border-red-900/50 tw-rounded-xl tw-p-4 tw-text-red-300 tw-flex tw-items-center tw-gap-3">
          <i className="bi bi-exclamation-triangle-fill tw-text-xl"></i>
          <span className="tw-text-sm">{error}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="tw-z-10 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-max-w-5xl tw-w-full tw-mb-12">
        {languageOptions.map((lang, idx) => {
          const isSelected = selectedId === lang.id;
          return (
            <motion.div
              key={lang.id}
              onClick={() => handleSelection(lang.id)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className={`tw-group tw-cursor-pointer tw-relative tw-rounded-2xl tw-border tw-border-zinc-800/60 tw-bg-zinc-900/40 tw-backdrop-blur-md tw-p-6 tw-transition-all tw-duration-300 ${lang.bgTheme} ${isSelected ? lang.activeBorder : 'hover:tw-border-zinc-700/80'} ${lang.glowColor}`}
            >
              
              {/* Country Gradient Glow Backdrop */}
              <div className={`tw-absolute tw-inset-0 tw-rounded-2xl tw-bg-gradient-to-br ${lang.colorClass} tw-opacity-[0.03] group-hover:tw-opacity-10 tw-transition-opacity tw-duration-500`} />

              {/* Card Header */}
              <div className="tw-flex tw-justify-between tw-items-start tw-mb-6 tw-relative tw-z-10">
                <span className="tw-text-5xl tw-filter tw-drop-shadow-lg">{lang.flag}</span>
                <span className="tw-px-2.5 tw-py-0.5 tw-rounded-md tw-text-[10px] tw-font-semibold tw-tracking-wider tw-uppercase tw-bg-zinc-800/60 tw-text-zinc-300 tw-border tw-border-zinc-700/30">
                  {lang.badgeText}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="tw-relative tw-z-10 tw-mb-6">
                <h3 className="tw-text-2xl tw-font-bold tw-text-zinc-100 group-hover:tw-text-white tw-transition-colors">
                  {lang.name}
                </h3>
                <p className="tw-mt-2 tw-text-xs tw-text-zinc-400 tw-leading-relaxed">
                  {lang.tagline}
                </p>
              </div>

              {/* Progress Bar Placeholder Skeleton */}
              <div className="tw-relative tw-z-10 tw-border-t tw-border-zinc-800/60 tw-pt-5">
                <div className="tw-flex tw-justify-between tw-text-[10px] tw-uppercase tw-tracking-widest tw-text-zinc-500 tw-mb-1.5">
                  <span>Syllabus Level</span>
                  <span>0%</span>
                </div>
                <div className="tw-w-full tw-h-1.5 tw-bg-zinc-800/80 tw-rounded-full tw-overflow-hidden">
                  <div className="tw-w-0 tw-h-full tw-bg-gradient-to-r tw-from-zinc-600 tw-to-zinc-500" />
                </div>
              </div>

              {/* Active Selection Glow Ring */}
              {isSelected && (
                <motion.div 
                  layoutId="activeRing"
                  className="tw-absolute tw-inset-0 tw-rounded-2xl tw-border-2 tw-border-transparent tw-pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 12px rgba(255, 255, 255, 0.05)"
                  }}
                />
              )}

            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Bottom CTA */}
      <div className="tw-z-10 tw-text-center">
        <motion.button
          onClick={handleEnroll}
          disabled={!selectedId || loading}
          whileHover={selectedId ? { scale: 1.04 } : {}}
          whileTap={selectedId ? { scale: 0.98 } : {}}
          className={`tw-px-10 tw-py-4 tw-rounded-full tw-font-semibold tw-text-base tw-transition-all tw-duration-300 ${
            selectedId 
              ? 'tw-bg-zinc-100 tw-text-zinc-950 tw-shadow-xl tw-shadow-purple-950/20 hover:tw-bg-white' 
              : 'tw-bg-zinc-800 tw-text-zinc-500 tw-cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="tw-flex tw-items-center tw-gap-2">
              <span className="tw-inline-block tw-w-4 tw-h-4 tw-rounded-full tw-border-2 tw-border-zinc-950 tw-border-t-transparent tw-animate-spin" />
              Initializing Course...
            </span>
          ) : (
            <span>Confirm Selection</span>
          )}
        </motion.button>
      </div>

    </div>
  );
};

export default LanguageSelectionPage;
