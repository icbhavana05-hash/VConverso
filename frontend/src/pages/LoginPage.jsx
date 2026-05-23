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
    <div className="tw-relative tw-w-full tw-min-h-screen tw-bg-v-bg tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-v-text-prim tw-py-12 tw-px-4">
      
      {/* Background Soft Gradients */}
      <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-z-0 tw-overflow-hidden">
        <div className="tw-absolute tw-top-[20%] tw-left-[-250px] tw-w-[500px] tw-h-[500px] tw-rounded-full tw-bg-v-bg-sec/50 tw-blur-[120px]" />
        <div className="tw-absolute tw-bottom-[20%] tw-right-[-250px] tw-w-[500px] tw-h-[500px] tw-rounded-full tw-bg-v-navbar/45 tw-blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="tw-relative tw-z-10 tw-max-w-[440px] tw-w-full tw-flex tw-flex-col tw-items-center"
      >
        
        {/* Mockup Logo & Branding Header */}
        <div className="tw-text-center tw-mb-8 tw-flex tw-flex-col tw-items-center">
          <Link to="/" className="tw-flex tw-items-center tw-justify-center tw-gap-3.5 tw-no-underline">
            {/* Dark box with white icon */}
            <div className="tw-w-12 tw-h-12 tw-rounded-2xl tw-bg-gradient-to-tr tw-from-v-brown-dark tw-to-v-brown-med tw-flex tw-items-center tw-justify-center tw-shadow-md tw-transition-transform hover:tw-rotate-[3deg]">
              <i className="bi bi-translate tw-text-2xl tw-text-white"></i>
            </div>
            <span className="tw-text-3xl tw-font-bold tw-tracking-tight tw-font-sans tw-text-v-brown-dark">
              VConverso
            </span>
          </Link>
          <p className="tw-mt-3 tw-text-xs tw-text-v-text-sec tw-tracking-wider tw-font-medium">
            Learn Languages Beautifully
          </p>
        </div>

        {/* Premium Mockup Auth Card */}
        <div className="tw-w-full tw-rounded-3xl tw-border tw-border-v-brown-dark/10 tw-bg-v-card tw-p-8 md:tw-p-10 tw-shadow-[0_12px_40px_rgba(107,62,46,0.06)]">
          
          <h3 className="tw-text-2xl tw-font-bold tw-text-v-text-prim tw-tracking-tight tw-mb-2">
            Welcome Back
          </h3>
          <p className="tw-text-xs tw-text-v-text-sec tw-leading-relaxed tw-mb-8">
            Enter your details to access your personalized language dashboard.
          </p>

          {/* Error notifications */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="tw-mb-6 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-xl tw-p-3.5 tw-text-red-800 tw-text-xs tw-flex tw-items-center tw-gap-2.5"
            >
              <AlertCircle className="tw-w-4 tw-h-4 tw-text-red-600" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="tw-space-y-5">
            
            {/* Email field */}
            <div>
              <label className="tw-block tw-text-[11px] tw-font-bold tw-tracking-widest tw-text-v-text-sec tw-uppercase tw-mb-2">
                Email Address
              </label>
              <div className="tw-relative">
                <span className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-4 tw-flex tw-items-center tw-text-v-text-muted">
                  <Mail className="tw-w-4 tw-h-4" />
                </span>
                <input
                  type="email"
                  className="tw-w-full tw-pl-11 tw-pr-4 tw-py-3.5 tw-rounded-xl tw-border tw-border-v-brown-med/20 tw-bg-white tw-text-sm tw-text-v-text-prim placeholder-v-text-muted focus:tw-outline-none focus:tw-border-v-brown-dark focus:tw-ring-2 focus:tw-ring-v-brown-dark/10 tw-transition-all"
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
              <label className="tw-block tw-text-[11px] tw-font-bold tw-tracking-widest tw-text-v-text-sec tw-uppercase tw-mb-2">
                Password
              </label>
              <div className="tw-relative tw-flex tw-items-center">
                <span className="tw-absolute tw-left-4 tw-text-v-text-muted">
                  <Lock className="tw-w-4 tw-h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="tw-w-full tw-pl-11 tw-pr-14 tw-py-3.5 tw-rounded-xl tw-border tw-border-v-brown-med/20 tw-bg-white tw-text-sm tw-text-v-text-prim placeholder-v-text-muted focus:tw-outline-none focus:tw-border-v-brown-dark focus:tw-ring-2 focus:tw-ring-v-brown-dark/10 tw-transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  id="passwordInput"
                />
                
                {/* White square eye button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tw-absolute tw-right-[1px] tw-h-[calc(100%-2px)] tw-w-12 tw-bg-v-bg-sec hover:tw-bg-v-navbar tw-rounded-r-[11px] tw-flex tw-items-center tw-justify-center tw-transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="tw-w-4 tw-h-4 tw-text-v-brown-dark" />
                  ) : (
                    <Eye className="tw-w-4 tw-h-4 tw-text-v-brown-dark" />
                  )}
                </button>
              </div>
            </div>

            {/* Premium primary Sign In button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="tw-w-full tw-py-3.5 tw-rounded-xl tw-font-bold tw-text-sm tw-text-white tw-bg-gradient-to-r tw-from-v-brown-dark tw-to-v-brown-med hover:tw-from-v-brown-hover hover:tw-to-v-brown-dark tw-shadow-[0_4px_12px_rgba(107,62,46,0.15)] tw-transition-all tw-mt-6 tw-flex tw-justify-center tw-items-center tw-gap-1.5"
              disabled={loading}
              id="loginBtn"
            >
              {loading ? (
                <>
                  <span className="tw-inline-block tw-w-4 tw-h-4 tw-rounded-full tw-border-2 tw-border-white tw-border-t-transparent tw-animate-spin" />
                  Accessing Account...
                </>
              ) : (
                <span className="tw-flex tw-items-center tw-gap-2">
                  Sign In <span className="tw-text-base">→</span>
                </span>
              )}
            </motion.button>
          </form>

          {/* Link redirect */}
          <div className="tw-text-center tw-mt-8">
            <span className="tw-text-xs tw-text-v-text-muted">New to VConverso? </span>
            <Link to="/register" className="tw-text-xs tw-text-v-brown-dark hover:tw-text-v-brown-hover tw-font-semibold tw-no-underline">
              Create an account
            </Link>
          </div>

        </div>
      </motion.div>

    </div>
  );
};

export default LoginPage;
