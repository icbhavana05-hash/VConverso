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
      colorClass: 'tw-from-v-brown-dark/10 tw-to-v-brown-med/10',
      badgeText: 'Castilian Accent'
    },
    {
      id: 2, // French
      name: 'French',
      flag: '🇫🇷',
      tagline: 'Unveil the elegant accents of romance, cuisine, and philosophy.',
      colorClass: 'tw-from-v-brown-dark/10 tw-to-v-brown-med/10',
      badgeText: 'Parisian Accent'
    },
    {
      id: 3, // German
      name: 'German',
      flag: '🇩🇪',
      tagline: 'Discover the engineered precision of thought, structure, and history.',
      colorClass: 'tw-from-v-brown-dark/10 tw-to-v-brown-med/10',
      badgeText: 'Standard Accent'
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
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-v-bg tw-overflow-hidden tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-v-text-prim tw-py-12 tw-px-4">
      
      {/* Background Soft Gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
        <div className="tw-absolute tw-top-[5%] tw-left-[10%] tw-w-[40%] tw-h-[40%] tw-rounded-full tw-bg-v-bg-sec/50 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[5%] tw-right-[10%] tw-w-[40%] tw-h-[40%] tw-rounded-full tw-bg-v-navbar/40 tw-blur-[120px]" />
      </div>

      {/* Title Header */}
      <div className="tw-text-center tw-z-10 tw-max-w-2xl tw-mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tw-px-4 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-semibold tw-tracking-widest tw-bg-v-brown-dark/10 tw-text-v-brown-dark tw-border tw-border-v-brown-dark/25 tw-uppercase">
            Onboarding Phase
          </span>
          <h2 className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-tracking-tight tw-mt-4 tw-mb-3 tw-text-v-brown-dark">
            Choose Your First Language
          </h2>
          <p className="tw-text-v-text-sec tw-text-base md:tw-text-lg">
            Every great journey begins with a single step. Select your active learning path to sculpt your personalized VConverso experience.
          </p>
        </motion.div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="tw-z-10 tw-max-w-md tw-w-full tw-mb-6 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-xl tw-p-4 tw-text-red-800 tw-flex tw-items-center tw-gap-3">
          <i className="bi bi-exclamation-triangle-fill tw-text-xl tw-text-red-650"></i>
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`tw-group tw-cursor-pointer tw-relative tw-rounded-2xl tw-border tw-bg-v-card tw-p-6 tw-transition-all tw-duration-300 ${
                isSelected 
                  ? 'tw-border-v-brown-dark tw-shadow-[0_12px_30px_rgba(107,62,46,0.12)]' 
                  : 'tw-border-v-brown-dark/10 hover:tw-border-v-brown-med/40 hover:tw-shadow-md'
              }`}
            >
              
              {/* Soft Gradient Backdrop */}
              <div className={`tw-absolute tw-inset-0 tw-rounded-2xl tw-bg-gradient-to-br ${lang.colorClass} tw-opacity-[0.05] group-hover:tw-opacity-15 tw-transition-opacity tw-duration-500`} />

              {/* Card Header */}
              <div className="tw-flex tw-justify-between tw-items-start tw-mb-6 tw-relative tw-z-10">
                <span className="tw-text-5xl tw-filter tw-drop-shadow-sm">{lang.flag}</span>
                <span className="tw-px-2.5 tw-py-1 tw-rounded-md tw-text-[10px] tw-font-semibold tw-tracking-wider tw-uppercase tw-bg-v-bg-sec tw-text-v-brown-dark tw-border tw-border-v-brown-dark/10">
                  {lang.badgeText}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="tw-relative tw-z-10 tw-mb-6">
                <h3 className="tw-text-2xl tw-font-bold tw-text-v-text-prim">
                  {lang.name}
                </h3>
                <p className="tw-mt-2 tw-text-xs tw-text-v-text-sec tw-leading-relaxed">
                  {lang.tagline}
                </p>
              </div>

              {/* Progress Bar Placeholder Skeleton */}
              <div className="tw-relative tw-z-10 tw-border-t tw-border-v-brown-dark/10 tw-pt-5">
                <div className="tw-flex tw-justify-between tw-text-[10px] tw-uppercase tw-tracking-widest tw-text-v-text-muted tw-mb-1.5 font-semibold">
                  <span>Syllabus Level</span>
                  <span>0%</span>
                </div>
                <div className="tw-w-full tw-h-1.5 tw-bg-v-bg-sec tw-rounded-full tw-overflow-hidden">
                  <div className="tw-w-0 tw-h-full tw-bg-v-brown-med" />
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Bottom CTA */}
      <div className="tw-z-10 tw-text-center">
        <motion.button
          onClick={handleEnroll}
          disabled={!selectedId || loading}
          whileHover={selectedId ? { scale: 1.02 } : {}}
          whileTap={selectedId ? { scale: 0.98 } : {}}
          className={`tw-px-10 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-base tw-transition-all tw-duration-300 ${
            selectedId 
              ? 'tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-text-white tw-shadow-[0_4px_12px_rgba(107,62,46,0.15)]' 
              : 'tw-bg-v-bg-sec tw-text-v-text-muted tw-border tw-border-v-brown-dark/10 tw-cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="tw-flex tw-items-center tw-gap-2">
              <span className="tw-inline-block tw-w-4 tw-h-4 tw-rounded-full tw-border-2 tw-border-white tw-border-t-transparent tw-animate-spin" />
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
