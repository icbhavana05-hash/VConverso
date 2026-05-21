import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-zinc-950 tw-overflow-hidden tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-zinc-100 tw-py-12 tw-px-4">
      
      {/* Background Ambient Glowing Orbs matching the mockup */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-z-0 tw-overflow-hidden">
        {/* Soft deep purple glow on the left */}
        <div className="tw-absolute tw-top-[20%] tw-left-[-250px] tw-w-[500px] tw-h-[500px] tw-rounded-full tw-bg-purple-950/20 tw-blur-[120px]" />
        {/* Soft deep teal/cyan glow on the right */}
        <div className="tw-absolute tw-bottom-[20%] tw-right-[-250px] tw-w-[500px] tw-h-[500px] tw-rounded-full tw-bg-teal-950/20 tw-blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="tw-relative tw-z-10 tw-max-w-[440px] tw-w-full tw-flex tw-flex-col tw-items-center"
      >
        
        {/* Mockup Logo & Branding Header */}
        <div className="tw-text-center tw-mb-8 tw-flex tw-flex-col tw-items-center">
          <Link to="/" className="tw-flex tw-items-center tw-justify-center tw-gap-3.5 tw-no-underline">
            {/* Dark box with white icon and purple glow */}
            <div className="tw-w-14 tw-h-14 tw-rounded-2xl tw-bg-zinc-950 tw-border tw-border-zinc-800/80 tw-flex tw-items-center tw-justify-center tw-shadow-[0_0_30px_rgba(168,85,247,0.35)] tw-transition-transform hover:tw-rotate-[3deg]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="tw-text-zinc-100">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M7 14V10c0-1 1-1.5 2-1.5s2 .5 2 1.5v4" />
                <path d="M7 12h4" />
                <path d="M13 9h4" />
                <path d="M13 12h4" />
                <path d="M13 15h2" />
              </svg>
            </div>
            <span className="tw-text-4xl tw-font-bold tw-tracking-tight tw-font-sans tw-text-[#C084FC]">
              VConverso
            </span>
          </Link>
          <p className="tw-mt-3 tw-text-xs tw-text-zinc-400 tw-tracking-wider tw-font-medium">
            Learn Languages Beautifully
          </p>
        </div>

        {/* Premium Mockup Auth Card */}
        <div className="tw-w-full tw-rounded-3xl tw-border tw-border-zinc-800/80 tw-bg-zinc-900/60 tw-backdrop-blur-xl tw-p-8 md:tw-p-10 tw-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          
          <h3 className="tw-text-3xl tw-font-bold tw-text-zinc-100 tw-tracking-tight tw-mb-2">
            Welcome Back
          </h3>
          <p className="tw-text-xs tw-text-zinc-400 tw-leading-relaxed tw-mb-8">
            Enter your details to access your personalized language dashboard.
          </p>

          {/* Error notifications */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="tw-mb-6 tw-bg-red-950/20 tw-border tw-border-red-900/50 tw-rounded-xl tw-p-3.5 tw-text-red-300 tw-text-xs tw-flex tw-items-center tw-gap-2.5"
            >
              <AlertCircle className="tw-w-4 tw-h-4 tw-text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            
            {/* Email field */}
            <div>
              <label className="tw-block tw-text-[11px] tw-font-bold tw-tracking-widest tw-text-zinc-400 tw-uppercase tw-mb-2.5">
                Email Address
              </label>
              <div className="tw-relative">
                <span className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-4 tw-flex tw-items-center tw-text-zinc-500">
                  <Mail className="tw-w-4 tw-h-4" />
                </span>
                <input
                  type="email"
                  className="tw-w-full tw-pl-11 tw-pr-4 tw-py-4 tw-rounded-xl tw-border tw-border-zinc-800/80 tw-bg-zinc-950 tw-text-sm tw-text-zinc-100 placeholder-zinc-500 focus:tw-outline-none focus:tw-border-purple-500/80 focus:tw-ring-1 focus:tw-ring-purple-500/30 tw-transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  id="emailInput"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="tw-block tw-text-[11px] tw-font-bold tw-tracking-widest tw-text-zinc-400 tw-uppercase tw-mb-2.5">
                Password
              </label>
              <div className="tw-relative tw-flex tw-items-center">
                <span className="tw-absolute tw-left-4 tw-text-zinc-500">
                  <Lock className="tw-w-4 tw-h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="tw-w-full tw-pl-11 tw-pr-14 tw-py-4 tw-rounded-xl tw-border tw-border-zinc-800/80 tw-bg-zinc-950 tw-text-sm tw-text-zinc-100 placeholder-zinc-500 focus:tw-outline-none focus:tw-border-purple-500/80 focus:tw-ring-1 focus:tw-ring-purple-500/30 tw-transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  id="passwordInput"
                />
                
                {/* White square eye button as shown in the mockup */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tw-absolute tw-right-[1px] tw-h-[calc(100%-2px)] tw-w-12 tw-bg-zinc-100 hover:tw-bg-white tw-rounded-r-[11px] tw-flex tw-items-center tw-justify-center tw-transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="tw-w-4 tw-h-4 tw-text-zinc-650" />
                  ) : (
                    <Eye className="tw-w-4 tw-h-4 tw-text-zinc-650" />
                  )}
                </button>
              </div>
            </div>

            {/* Premium rounded off-white Sign In button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="tw-w-full tw-py-4 tw-rounded-xl tw-font-bold tw-text-sm tw-text-zinc-950 tw-bg-zinc-100 hover:tw-bg-white tw-shadow-xl tw-shadow-purple-950/15 tw-transition-all tw-mt-6 tw-flex tw-justify-center tw-items-center tw-gap-1.5"
              disabled={loading}
              id="loginBtn"
            >
              {loading ? (
                <>
                  <span className="tw-inline-block tw-w-4 tw-h-4 tw-rounded-full tw-border-2 tw-border-zinc-950 tw-border-t-transparent tw-animate-spin" />
                  Accessing Account...
                </>
              ) : (
                <span className="tw-flex tw-items-center tw-gap-2">
                  Sign In <span className="tw-text-base">→</span>
                </span>
              )}
            </motion.button>
          </form>

          {/* Link redirect matching mockup */}
          <div className="tw-text-center tw-mt-8">
            <span className="tw-text-xs tw-text-zinc-550">New to VConverso? </span>
            <Link to="/register" className="tw-text-xs tw-text-[#C084FC] hover:tw-text-purple-300 tw-font-semibold tw-no-underline">
              Create an account
            </Link>
          </div>

          {/* Quick Demo shortcuts at bottom */}
          <div className="tw-relative tw-my-6">
            <div className="tw-absolute tw-inset-0 tw-flex tw-items-center">
              <div className="tw-w-full tw-border-t tw-border-zinc-800/40" />
            </div>
            <div className="tw-relative tw-flex tw-justify-center tw-text-[9px] tw-uppercase tw-tracking-widest">
              <span className="tw-bg-zinc-900/90 tw-px-3 tw-text-zinc-500">
                Demo Quick Access
              </span>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-2 tw-gap-3">
            <button
              onClick={() => {
                setEmail('test@vconverso.com');
                setPassword('password123');
              }}
              className="tw-py-2 tw-rounded-xl tw-border tw-border-zinc-800/80 tw-bg-zinc-950/40 hover:tw-bg-zinc-950/80 tw-text-[10px] tw-font-semibold tw-text-zinc-500 hover:tw-text-zinc-300 tw-transition-all"
            >
              Demo Profile
            </button>
            <button
              onClick={() => {
                setEmail('bhavana@vconverso.com');
                setPassword('password123');
              }}
              className="tw-py-2 tw-rounded-xl tw-border tw-border-zinc-800/80 tw-bg-zinc-950/40 hover:tw-bg-zinc-950/80 tw-text-[10px] tw-font-semibold tw-text-zinc-500 hover:tw-text-zinc-300 tw-transition-all"
            >
              Bhavana (XP Demo)
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  );
};

export default LoginPage;
