import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const IntroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Floating greetings configuration
  const floatingGreetings = [
    { text: 'Bonjour', x: '15%', y: '20%', delay: 0, scale: 1.1, color: 'tw-text-cyan-400' },
    { text: 'Hola', x: '80%', y: '15%', delay: 1, scale: 1.3, color: 'tw-text-rose-400' },
    { text: 'Hallo', x: '10%', y: '75%', delay: 2, scale: 1.0, color: 'tw-text-amber-400' },
    { text: 'Welcome', x: '85%', y: '70%', delay: 1.5, scale: 1.2, color: 'tw-text-purple-400' },
    { text: 'Ciao', x: '25%', y: '50%', delay: 3, scale: 0.9, color: 'tw-text-emerald-400' },
    { text: 'Konnichiwa', x: '70%', y: '45%', delay: 2.5, scale: 0.95, color: 'tw-text-pink-400' }
  ];

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-zinc-950 tw-overflow-hidden tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-zinc-100">
      
      {/* Background Cinematic Gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none">
        <div className="tw-absolute tw-top-[-10%] tw-left-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-purple-900/20 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[-10%] tw-right-[-10%] tw-w-[50%] tw-h-[50%] tw-rounded-full tw-bg-cyan-900/15 tw-blur-[120px]" />
        <div className="tw-absolute tw-top-[30%] tw-left-[40%] tw-w-[30%] tw-h-[30%] tw-rounded-full tw-bg-rose-900/10 tw-blur-[100px]" />
        
        {/* Animated Tech Grid overlay */}
        <div 
          className="tw-absolute tw-inset-0 tw-opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Floating Multilingual Words */}
      {floatingGreetings.map((greet, idx) => (
        <motion.div
          key={idx}
          className={`tw-absolute tw-font-semibold tw-pointer-events-none tw-font-sans ${greet.color} tw-opacity-35`}
          style={{
            left: greet.x,
            top: greet.y,
            scale: greet.scale,
            filter: 'blur(0.5px)'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: [0.15, 0.45, 0.15],
            y: [0, -25, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 8 + idx * 2,
            repeat: Infinity,
            delay: greet.delay,
            ease: "easeInOut"
          }}
        >
          {greet.text}
        </motion.div>
      ))}

      {/* World Map Outline Overlay */}
      <div className="tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center tw-pointer-events-none tw-opacity-[0.06] tw-scale-110">
        <svg className="tw-w-full tw-h-full" viewBox="0 0 1000 600" fill="none" stroke="currentColor" strokeWidth="1">
          {/* Mock premium geographic contour waves */}
          <path d="M150 250 C 300 200, 450 300, 600 250 C 750 200, 850 280, 950 240" />
          <path d="M100 350 C 250 300, 380 420, 550 380 C 720 340, 800 450, 900 400" />
          <path d="M200 150 C 350 100, 420 180, 600 130 C 780 80, 850 200, 920 150" />
          
          {/* Scattered glowing particle nodes */}
          <circle cx="200" cy="220" r="3" className="tw-animate-pulse" fill="#22d3ee" />
          <circle cx="480" cy="180" r="4" className="tw-animate-pulse" fill="#c084fc" />
          <circle cx="750" cy="280" r="3" className="tw-animate-pulse" fill="#fb7185" />
          <circle cx="850" cy="420" r="4" className="tw-animate-pulse" fill="#34d399" />
          <circle cx="350" cy="380" r="3" className="tw-animate-pulse" fill="#fbbf24" />
        </svg>
      </div>

      {/* Center Cinematic Branding Card */}
      <div className="tw-relative tw-z-10 tw-text-center tw-px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="tw-flex tw-flex-col tw-items-center"
        >
          {/* Animated Glowing Logo Orb */}
          <motion.div 
            className="tw-relative tw-mb-8 tw-p-6 tw-rounded-full tw-bg-gradient-to-tr tw-from-purple-600/30 tw-to-cyan-600/30 tw-border tw-border-zinc-800 tw-shadow-[0_0_50px_rgba(168,85,247,0.25)]"
            animate={{ 
              boxShadow: [
                "0 0 50px rgba(168,85,247,0.25)", 
                "0 0 70px rgba(34,211,238,0.35)", 
                "0 0 50px rgba(168,85,247,0.25)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <i className="bi bi-translate tw-text-5xl tw-bg-gradient-to-r tw-from-purple-400 tw-to-cyan-400 tw-bg-clip-text tw-text-transparent"></i>
          </motion.div>

          {/* VConverso Premium Typography */}
          <h1 className="tw-text-6xl md:tw-text-8xl tw-font-bold tw-tracking-tight tw-font-sans tw-mb-4">
            <span className="tw-bg-gradient-to-r tw-from-zinc-100 tw-via-zinc-300 tw-to-zinc-500 tw-bg-clip-text tw-text-transparent">
              VConverso
            </span>
          </h1>

          <p className="tw-text-lg md:tw-text-2xl tw-text-zinc-400 tw-font-medium tw-tracking-wide tw-mb-12">
            Learn Languages Beautifully
          </p>

          {/* Spring Interactive Start Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(168,85,247,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="tw-relative tw-group tw-px-8 tw-py-4 tw-rounded-full tw-font-semibold tw-text-zinc-950 tw-bg-zinc-100 tw-shadow-lg tw-transition-all tw-duration-300 tw-overflow-hidden"
          >
            {/* Sliding Glowing Gradient Overlay */}
            <div className="tw-absolute tw-inset-0 tw-opacity-0 group-hover:tw-opacity-100 tw-bg-gradient-to-r tw-from-purple-500 tw-to-cyan-500 tw-transition-opacity tw-duration-500 tw-z-0" />
            
            <span className="tw-relative tw-z-10 group-hover:tw-text-zinc-100 tw-flex tw-items-center tw-gap-2 tw-text-lg">
              Get Started
              <i className="bi bi-arrow-right-short tw-text-2xl tw-transition-transform tw-duration-300 group-hover:tw-translate-x-1"></i>
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="tw-absolute tw-bottom-10 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-flex-col tw-items-center tw-opacity-40">
        <span className="tw-text-xs tw-uppercase tw-tracking-widest tw-text-zinc-500 tw-mb-2">Immersion Platform</span>
        <motion.div 
          className="tw-w-1.5 tw-h-6 tw-bg-zinc-700 tw-rounded-full tw-relative tw-overflow-hidden"
        >
          <motion.div 
            className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-2 tw-bg-zinc-300 tw-rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

    </div>
  );
};

export default IntroPage;
