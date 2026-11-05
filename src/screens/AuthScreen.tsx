import React, { useState } from 'react';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import {
  SmartBikeShieldLogo,
  SmartBikeWordmark,
} from '../components/BrandVisuals';
import { LanguageCode, UserProfile } from '../types/smartbike';
import { UI_STRINGS } from '../data/initialState';

interface AuthScreenProps {
  initialTab: 'login' | 'register';
  language: LanguageCode;
  currentUser: UserProfile;
  onBack: () => void;
  onLoginSuccess: (userUpdates?: Partial<UserProfile>) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialTab,
  language,
  currentUser,
  onBack,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Login fields (pre-filled with demo credentials for smooth evaluation while editable)
  const [loginIdentifier, setLoginIdentifier] = useState(currentUser.email);
  const [loginPassword, setLoginPassword] = useState('SmartBike#2026');

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const t = UI_STRINGS[language];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Email or Username.');
      return;
    }
    if (loginPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    const isEmail = loginIdentifier.includes('@');
    onLoginSuccess(
      isEmail
        ? { email: loginIdentifier.trim() }
        : { fullName: loginIdentifier.trim() }
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify Confirm Password.');
      return;
    }

    onLoginSuccess({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your registered email address first.');
      return;
    }
    setResetEmailSent(true);
    setInfoMsg(`Password recovery link dispatched to ${loginIdentifier.trim()} (Demo Mode).`);
  };

  return (
    <div className="min-h-screen w-full bg-[#031326] text-white flex flex-col justify-between relative overflow-hidden px-4 py-6 sm:py-10">
      {/* Subtle Neon Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[550px] h-[380px] rounded-full bg-[#00D5FF]/15 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[350px] rounded-full bg-[#087BFF]/15 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#071D35]/90 border border-[#00D5FF]/30 hover:border-[#00D5FF] flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Back to Welcome Screen"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-xs font-medium text-[#00D5FF]/90">
            {t.demoMode}
          </span>
        </div>

        {/* Shield Logo & Brand Title */}
        <div className="flex flex-col items-center mb-6">
          <SmartBikeShieldLogo size="md" className="mb-2.5" />
          <SmartBikeWordmark size="md" subtitle={t.subtitle} />
        </div>

        {/* Main Auth Card (Matches Reference Image 1 & 3) */}
        <div className="rounded-3xl bg-[#071D35]/95 border border-[#00D5FF]/35 shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-6 sm:p-7 backdrop-blur-md">
          {/* Login / Sign Up Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-[#041223] border border-[#102B46] mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setForgotMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#00D5FF] to-[#087BFF] text-white shadow-[0_0_15px_rgba(0,213,255,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setForgotMode(false);
                setErrorMsg(null);
              }}
              className={`py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-[#00D5FF] to-[#087BFF] text-white shadow-[0_0_15px_rgba(0,213,255,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-5">
            {forgotMode
              ? 'Reset Your Password'
              : tab === 'login'
              ? 'Login to Your Account'
              : 'Create Your Account'}
          </h2>

          {/* Validation Error or Info Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF3B4F]/15 border border-[#FF3B4F]/50 flex items-start gap-2.5 text-xs sm:text-sm text-[#FF8A96]">
              <AlertCircle className="w-4 h-4 text-[#FF3B4F] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#00E676]/15 border border-[#00E676]/50 flex items-start gap-2.5 text-xs sm:text-sm text-[#69F0AE]">
              <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {forgotMode ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 text-center">
                Enter your account email to receive a simulated recovery code and biometric reset token.
              </p>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Email / Username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] text-white font-bold text-base shadow-[0_0_20px_rgba(0,213,255,0.4)] hover:brightness-110 transition-all cursor-pointer"
              >
                {resetEmailSent ? 'Resend Recovery Link' : 'Send Recovery Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setInfoMsg(null);
                  setErrorMsg(null);
                }}
                className="w-full py-2 text-xs font-semibold text-[#00D5FF] hover:underline cursor-pointer"
              >
                Return to Login
              </button>
            </form>
          ) : tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email / Username */}
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Email / Username"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm sm:text-base focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm sm:text-base focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 accent-[#00D5FF]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true);
                    setErrorMsg(null);
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#00D5FF] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-base sm:text-lg shadow-[0_0_24px_rgba(0,213,255,0.45)] transition-all active:scale-[0.99] cursor-pointer mt-2"
              >
                Login
              </button>

              {/* Divider "or" */}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-slate-600/50" />
                <span className="text-xs font-medium text-slate-300">or</span>
                <div className="h-px flex-1 bg-slate-600/50" />
              </div>

              {/* Social Sign-In Buttons matching Reference Image 1 */}
              <div className="flex items-center justify-center gap-6">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => onLoginSuccess()}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                  title="Continue with Google (Demo)"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
                    />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => onLoginSuccess()}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                  title="Continue with Apple (Demo)"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => onLoginSuccess()}
                  className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                  title="Continue with Facebook (Demo)"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V22h3.4z" />
                  </svg>
                </button>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="relative">
                <User className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password (min. 6 chars)"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-200 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#102B46]/80 border border-[#00D5FF]/35 focus:border-[#00D5FF] text-white placeholder-slate-300/75 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Demo Auto-Fill helper */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFullName('Thein Htike');
                    setEmail('theinhtike201032@gmail.com');
                    setPhone('+91 98765 43210');
                    setPassword('SmartBike#2026');
                    setConfirmPassword('SmartBike#2026');
                    setErrorMsg(null);
                  }}
                  className="text-xs text-[#00D5FF] hover:underline cursor-pointer"
                >
                  Auto-fill Demo Profile
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#00EAFF] via-[#00B4FF] to-[#087BFF] hover:brightness-110 text-white font-bold text-base shadow-[0_0_24px_rgba(0,213,255,0.45)] transition-all active:scale-[0.99] cursor-pointer"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {/* Bottom Switch Pill matching Reference Image 1 */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              setTab((prev) => (prev === 'login' ? 'register' : 'login'));
              setForgotMode(false);
              setErrorMsg(null);
            }}
            className="w-full py-3.5 px-6 rounded-full bg-[#071D35]/90 border border-[#00D5FF]/40 hover:border-[#00D5FF] text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="text-slate-200">
              {tab === 'login' ? 'Don’t have an account?' : 'Already have an account?'}
            </span>
            <span className="font-bold text-[#00D5FF]">
              {tab === 'login' ? 'Sign Up' : 'Login'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
