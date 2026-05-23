import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const IntroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Floating greetings configuration with warm muted brand colors
  const floatingGreetings = [
    { text: 'Bonjour', x: '15%', y: '20%', delay: 0, scale: 1.1, color: 'tw-text-v-text-sec' },
    { text: 'Hola', x: '80%', y: '15%', delay: 1, scale: 1.3, color: 'tw-text-v-brown-med' },
    { text: 'Hallo', x: '10%', y: '75%', delay: 2, scale: 1.0, color: 'tw-text-v-text-muted' },
    { text: 'Welcome', x: '85%', y: '70%', delay: 1.5, scale: 1.2, color: 'tw-text-v-brown-med' },
    { text: 'Ciao', x: '25%', y: '50%', delay: 3, scale: 0.9, color: 'tw-text-v-text-sec' },
    { text: 'Konnichiwa', x: '70%', y: '45%', delay: 2.5, scale: 0.95, color: 'tw-text-v-text-muted' }
  ];

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-v-bg tw-overflow-hidden tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-v-text-prim">
      
      {/* Background Soft Warm Gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-bg-sec/40 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-v-navbar/30 tw-blur-[120px]" />
        
        {/* Soft elegant grid overlay */}
        <div 
          className="tw-absolute tw-inset-0 tw-opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--color-brown-med) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Floating Multilingual Words */}
      {floatingGreetings.map((greet, idx) => (
        <motion.div
          key={idx}
          className={`tw-absolute tw-font-semibold tw-pointer-events-none tw-font-sans ${greet.color} tw-opacity-30`}
          style={{
            left: greet.x,
            top: greet.y,
            scale: greet.scale,
            filter: 'blur(0.2px)'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: [0.15, 0.4, 0.15],
            y: [0, -20, 0],
            x: [0, 8, 0]
          }}
          transition={{
            duration: 9 + idx * 2,
            repeat: Infinity,
            delay: greet.delay,
            ease: "easeInOut"
          }}
        >
          {greet.text}
        </motion.div>
      ))}

      {/* Center Cinematic Branding Card */}
      <div className="tw-relative tw-z-10 tw-text-center tw-px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="tw-flex tw-flex-col tw-items-center"
        >
          {/* Subtle minimal logo icon above title */}
          <motion.div 
            className="tw-mb-4 tw-text-[#6B3E2E]"
            initial={{ y: -5 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <i className="bi bi-translate tw-text-5xl"></i>
          </motion.div>

          {/* VConverso Premium Typography */}
          <h1 className="tw-text-6xl md:tw-text-7xl tw-font-bold tw-tracking-tight tw-font-sans tw-mb-4 tw-text-[#6B3E2E]">
            VConverso
          </h1>

          <p className="tw-text-lg md:tw-text-2xl tw-text-v-text-sec tw-font-medium tw-tracking-wide tw-mb-10">
            Learn Languages Beautifully
          </p>

          {/* Spring Interactive Start Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.03, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            className="tw-px-8 tw-py-3.5 tw-rounded-xl tw-font-semibold tw-text-white tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med tw-shadow-[0_4px_12px_rgba(107,62,46,0.15)] tw-transition-all tw-duration-300 tw-flex tw-items-center tw-gap-2 tw-text-lg hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark"
          >
            <span>Get Started</span>
            <i className="bi bi-arrow-right-short tw-text-2xl tw-transition-transform tw-duration-300"></i>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="tw-absolute tw-bottom-10 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-flex-col tw-items-center tw-opacity-50">
        <span className="tw-text-xs tw-uppercase tw-tracking-widest tw-text-v-text-muted tw-mb-2">Immersion Platform</span>
        <div className="tw-w-1.5 tw-h-6 tw-bg-v-brown-med/20 tw-rounded-full tw-relative tw-overflow-hidden">
          <motion.div 
            className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-2 tw-bg-v-brown-dark tw-rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

    </div>
  );
};

export default IntroPage;
