import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  ShoppingBag,
  Shield,
  Check,
  ArrowRight,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Layers,
  Sprout,
  HelpCircle,
  X,
  Send,
  Globe,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { UserRole, LanguageCode } from '../types';

interface AuthPageProps {
  navigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigate, initialMode = 'login' }) => {
  const { login, registerUser, role: currentLoggedInRole } = useAuth();
  const { t, language, languages, setLanguage, currentLanguageConfig } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Common credentials
  const [email, setEmail] = useState(initialMode === 'login' ? 'farmer@agritech.in' : '');
  const [password, setPassword] = useState(initialMode === 'login' ? 'agritech2026' : '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('Karnataka');
  const [district, setDistrict] = useState('Kolar');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(language);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Farmer specific fields
  const [farmName, setFarmName] = useState('');
  const [village, setVillage] = useState('Malur Hobli');
  const [farmSize, setFarmSize] = useState('12');
  const [farmUnit, setFarmUnit] = useState<'Acres' | 'Hectares' | 'Guntha'>('Acres');
  const [soilType, setSoilType] = useState('Red Sandy Loam');
  const [cropsCultivated, setCropsCultivated] = useState('Tomato, Red Onion, Rice');

  // Buyer specific fields
  const [buyerType, setBuyerType] = useState<'Individual' | 'Business'>('Business');
  const [businessName, setBusinessName] = useState('GreenMart Supermarket Logistics');
  const [productInterests, setProductInterests] = useState('Vegetables, Grains, Pulses');
  const [purchaseQuantity, setPurchaseQuantity] = useState('100 Metric Tons / Month');

  // Admin specific fields (Section 6 & 15: Restricted Admin Access)
  const [adminSecurityKey, setAdminSecurityKey] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Synchronize mode from URL hash
  useEffect(() => {
    if (window.location.hash.includes('register')) {
      setMode('register');
    } else if (window.location.hash.includes('login')) {
      setMode('login');
    }
  }, []);

  // Update default email when switching roles in login mode
  useEffect(() => {
    if (mode === 'login') {
      if (selectedRole === 'farmer') setEmail('farmer@agritech.in');
      else if (selectedRole === 'buyer') setEmail('buyer@agritech.in');
      else if (selectedRole === 'admin') setEmail('admin@agritech.gov.in');
    }
  }, [selectedRole, mode]);

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setAdminKeyError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full legal name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter identical passwords.');
        return;
      }
      if (!acceptTerms) {
        setErrorMsg('Please accept the AgriTech Terms of Service to proceed.');
        return;
      }

      // Admin verification check: NEVER allow unrestricted admin creation
      if (selectedRole === 'admin') {
        if (adminSecurityKey.trim() !== 'AGRI-ADMIN-2026') {
          setAdminKeyError('Invalid Admin Authorization Key. Unrestricted admin account creation is forbidden. Use "AGRI-ADMIN-2026" or register as Farmer / Buyer.');
          return;
        }
      }

      setIsSubmitting(true);
      setTimeout(() => {
        registerUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone || '+91 98450 12345',
          role: selectedRole,
          location: `${district}, ${stateName}`,
          state: stateName,
          preferredLanguage: preferredLang,
          farmName: selectedRole === 'farmer' ? (farmName || 'GreenFields Agro Farm') : undefined,
          farmSizeAcres: selectedRole === 'farmer' ? Number(farmSize) : undefined,
          businessName: selectedRole === 'buyer' ? businessName : undefined,
        });

        setIsSubmitting(false);
        setSuccessMsg(`Account created successfully! Redirecting to ${selectedRole.toUpperCase()} Dashboard...`);
        setTimeout(() => {
          if (selectedRole === 'farmer') navigate('/farmer/dashboard');
          else if (selectedRole === 'buyer') navigate('/buyer/dashboard');
          else if (selectedRole === 'admin') navigate('/admin/dashboard');
        }, 600);
      }, 500);
    } else {
      // Login mode with Role Validation against account role
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your account password.');
        return;
      }

      // Simulated role validation check
      const lowerEmail = email.toLowerCase();
      let detectedRole: UserRole = selectedRole;
      if (lowerEmail.includes('farmer') && selectedRole !== 'farmer') {
        setErrorMsg(`Role Mismatch: This account (${email}) is registered as a Farmer. Please select the "Farmer" card above to continue.`);
        return;
      }
      if (lowerEmail.includes('buyer') && selectedRole !== 'buyer') {
        setErrorMsg(`Role Mismatch: This account (${email}) is registered as a Buyer. Please select the "Buyer" card above to continue.`);
        return;
      }
      if (selectedRole === 'admin') {
        // Admin requires authorized credential or admin email
        if (!lowerEmail.includes('admin') && password !== 'agritech2026') {
          setErrorMsg('Administrative Access Denied: This account does not possess verified administrator credentials.');
          return;
        }
      }

      setIsSubmitting(true);
      setTimeout(() => {
        login(selectedRole, email, name);
        setIsSubmitting(false);
        setSuccessMsg(`Authenticated as ${selectedRole.toUpperCase()}. Loading your dashboard...`);
        setTimeout(() => {
          if (selectedRole === 'farmer') navigate('/farmer/dashboard');
          else if (selectedRole === 'buyer') navigate('/buyer/dashboard');
          else if (selectedRole === 'admin') navigate('/admin/dashboard');
        }, 400);
      }, 400);
    }
  };

  const handleQuickDemo = (roleTarget: UserRole) => {
    setSelectedRole(roleTarget);
    login(roleTarget);
    if (roleTarget === 'farmer') navigate('/farmer/dashboard');
    else if (roleTarget === 'buyer') navigate('/buyer/dashboard');
    else if (roleTarget === 'admin') navigate('/admin/dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-[92vh] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center text-[#123D2A]">
      {/* Return to Home & Language Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#123D2A]/15 text-xs font-bold text-[#123D2A] hover:bg-emerald-50 hover:border-[#10B981] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#10B981]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-white/90 rounded-full border border-[#123D2A]/15 shadow-xs">
            <button
              onClick={() => {
                setMode('login');
                window.location.hash = '/login';
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-[#123D2A]/70 hover:text-[#123D2A]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                window.location.hash = '/register';
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-[#123D2A]/70 hover:text-[#123D2A]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Language Selector */}
          <LanguageSelector variant="compact" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            LEFT COLUMN (5 cols): ROLE SELECTION CARDS & 1-CLICK TEST LOGIN
           ===================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'login' ? 'Role-Based Authentication' : 'Create Verified Account'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123D2A] tracking-tight">
              {mode === 'login' ? 'Welcome Back to AgriTech' : 'Join the Future of Smart Agriculture'}
            </h2>
            <p className="text-xs text-[#18251E]/75 leading-relaxed font-medium">
              {mode === 'login'
                ? 'Select your user role below to access your customized dashboard, mandi intelligence, and escrow contract portal.'
                : 'Choose your account type to register as a farmer, institutional buyer, or submit an administrator verification request.'}
            </p>
          </div>

          {/* Three Role Cards */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Step 1: Choose Your Portal Role
            </span>

            {/* 1. Farmer Card */}
            <div
              onClick={() => setSelectedRole('farmer')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'farmer'
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-[#10B981] shadow-lg shadow-emerald-950/5 ring-2 ring-[#10B981]/20'
                  : 'bg-white/80 border-[#123D2A]/15 hover:border-[#10B981]/60 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'farmer' ? 'bg-[#123D2A] text-[#C6FF4A]' : 'bg-emerald-100 text-[#123D2A]'
                  }`}
                >
                  <Tractor className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#123D2A]">🌾 {t('Farmer Portal')}</h4>
                    {selectedRole === 'farmer' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t('Selected')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#18251E]/70 mt-0.5 leading-snug">
                    {t('List crops, view mandi modal prices, receive AI disease advice, and sell with 100% escrow protection.')}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Buyer Card */}
            <div
              onClick={() => setSelectedRole('buyer')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'buyer'
                  ? 'bg-gradient-to-br from-cyan-50 to-blue-50/50 border-[#00B8F0] shadow-lg shadow-cyan-950/5 ring-2 ring-[#00B8F0]/20'
                  : 'bg-white/80 border-[#123D2A]/15 hover:border-[#00B8F0]/60 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'buyer' ? 'bg-cyan-900 text-[#00B8F0]' : 'bg-cyan-100 text-cyan-950'
                  }`}
                >
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#123D2A]">🛒 {t('Wholesale Buyer Portal')}</h4>
                    {selectedRole === 'buyer' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00B8F0] text-slate-950 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t('Selected')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#18251E]/70 mt-0.5 leading-snug">
                    {t('Direct farm-gate sourcing, quality graded batches, reverse bidding, and automated logistics booking.')}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Admin Card */}
            <div
              onClick={() => setSelectedRole('admin')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50/50 border-purple-600 shadow-lg shadow-purple-950/5 ring-2 ring-purple-600/20'
                  : 'bg-white/80 border-[#123D2A]/15 hover:border-purple-400 hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#123D2A]">🛡️ {t('Administrator Command')}</h4>
                    {selectedRole === 'admin' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-700 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t('Selected')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#18251E]/70 mt-0.5 leading-snug">
                    {t('Restricted regulatory portal for marketplace integrity, dispute arbitration, and Agmarknet feeds.')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Credentials (1-Click Evaluation) */}
          <div className="p-4 rounded-2xl bg-white/80 border border-[#123D2A]/15 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                1-Click Fast Demo Login
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Instant Access
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#123D2A] text-center transition-all cursor-pointer flex flex-col items-center gap-1"
              >
                <Tractor className="w-4 h-4 text-emerald-600" />
                <span>Farmer Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('buyer')}
                className="p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs font-bold text-cyan-950 text-center transition-all cursor-pointer flex flex-col items-center gap-1"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-600" />
                <span>Buyer Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-purple-950 text-center transition-all cursor-pointer flex flex-col items-center gap-1"
              >
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (7 cols): AUTHENTICATION & REGISTRATION FORM
           ===================================================================== */}
        <div className="lg:col-span-7">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-[#123D2A]">
                  {mode === 'login'
                    ? `${selectedRole.toUpperCase()} Login`
                    : `${selectedRole.toUpperCase()} Registration`}
                </h3>
                <p className="text-xs text-[#18251E]/60 mt-0.5">
                  {mode === 'login'
                    ? 'Enter your credentials to access your verified portal.'
                    : 'Complete your profile to trade on the national agricultural network.'}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                  selectedRole === 'farmer'
                    ? 'bg-emerald-100 text-[#123D2A]'
                    : selectedRole === 'buyer'
                    ? 'bg-cyan-100 text-cyan-900'
                    : 'bg-purple-100 text-purple-900'
                }`}
              >
                {selectedRole === 'farmer' ? (
                  <Tractor className="w-5 h-5" />
                ) : selectedRole === 'buyer' ? (
                  <ShoppingBag className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-pulse">
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span className="font-bold">{successMsg}</span>
              </div>
            )}

            {/* Registration Role Restriction Warning for Admin */}
            {mode === 'register' && selectedRole === 'admin' && (
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-purple-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-purple-900">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Restricted Administrator Bootstrap Policy</span>
                </div>
                <p className="text-[11px] text-purple-900/80 leading-relaxed">
                  As per platform security policies, administrator accounts cannot be created openly without verified authorization.
                  Please enter the authorized <strong>Admin Security Key</strong> below (for testing, use <code className="bg-purple-200/80 px-1.5 py-0.5 rounded font-mono font-bold">AGRI-ADMIN-2026</code>).
                </p>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Specific: Name & Phone */}
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#10B981]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'farmer' ? 'Ramesh Patel' : 'Priya Sundaram'}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#10B981]" /> Mobile Number (OTP Verified) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#10B981]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'farmer'
                      ? 'farmer@agritech.in'
                      : selectedRole === 'buyer'
                      ? 'buyer@agritech.in'
                      : 'admin@agritech.gov.in'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                />
              </div>

              {/* Password Field with Show/Hide */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#10B981]" /> Password *
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] font-bold text-[#10B981] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#123D2A]/15 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator for Register */}
                {mode === 'register' && password && (
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span className="text-gray-500 font-medium">Strength:</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'} flex-1`} />
                    </div>
                    <span className="font-bold text-gray-700">{pwdStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password for Register */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#10B981]" /> Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#123D2A]/15 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Farmer Dedicated Fields in Registration */}
              {mode === 'register' && selectedRole === 'farmer' && (
                <div className="p-4 rounded-2xl bg-[#F7F9F4] border border-[#123D2A]/10 space-y-3">
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider block">
                    🌾 Farm Details & Land Specs
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Farm / Estate Name</label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Kolar Agro Fields"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Farm Size ({farmUnit})</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                        />
                        <select
                          value={farmUnit}
                          onChange={(e) => setFarmUnit(e.target.value as any)}
                          className="px-2 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                        >
                          <option value="Acres">Acres</option>
                          <option value="Hectares">Hectares</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">State & District</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="Karnataka"
                          className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Kolar"
                          className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Village / Taluk</label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Malur Taluk"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Main Crops Cultivated</label>
                    <input
                      type="text"
                      value={cropsCultivated}
                      onChange={(e) => setCropsCultivated(e.target.value)}
                      placeholder="Tomato, Red Onion, Rice, Capsicum"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Buyer Dedicated Fields in Registration */}
              {mode === 'register' && selectedRole === 'buyer' && (
                <div className="p-4 rounded-2xl bg-[#F7F9F4] border border-[#123D2A]/10 space-y-3">
                  <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
                    🛒 Procurement & Business Profile
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Buyer Type</label>
                      <select
                        value={buyerType}
                        onChange={(e) => setBuyerType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
                      >
                        <option value="Business">Wholesale / Supermarket Chain</option>
                        <option value="Individual">Aggregator / Processing Unit</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Business Name / Firm</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="GreenMart Wholesale Logistics"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Products Needed</label>
                      <input
                        type="text"
                        value={productInterests}
                        onChange={(e) => setProductInterests(e.target.value)}
                        placeholder="Vegetables, Grains, Pulses"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Monthly Procurement Volume</label>
                      <input
                        type="text"
                        value={purchaseQuantity}
                        onChange={(e) => setPurchaseQuantity(e.target.value)}
                        placeholder="100 Metric Tons / Month"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Authorization Key Field for Registration */}
              {mode === 'register' && selectedRole === 'admin' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-700" /> Authorized Admin Key *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminSecurityKey}
                    onChange={(e) => setAdminSecurityKey(e.target.value)}
                    placeholder="Enter security authorization code (e.g., AGRI-ADMIN-2026)"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-300 bg-white text-xs text-[#123D2A] focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                  />
                  {adminKeyError && (
                    <p className="text-[11px] text-rose-600 font-bold">{adminKeyError}</p>
                  )}
                </div>
              )}

              {/* Remember Me & Terms Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span>Remember me on this device</span>
                </label>

                {mode === 'register' && (
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="rounded text-[#10B981] focus:ring-[#10B981]"
                    />
                    <span>Accept Terms & Escrow Agreement</span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#123D2A] via-[#10B981] to-[#059669] text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Authorization...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {mode === 'login'
                        ? `Sign In to ${selectedRole.toUpperCase()} Portal`
                        : `Create ${selectedRole.toUpperCase()} Account`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode Footer */}
            <div className="pt-2 text-center text-xs text-[#18251E]/75">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      window.location.hash = '/register';
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#10B981] hover:underline cursor-pointer"
                  >
                    Register / Create Free Account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an AgriTech account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      window.location.hash = '/login';
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#10B981] hover:underline cursor-pointer"
                  >
                    Sign In to Existing Account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-[#123D2A]">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#10B981]" /> Reset Account Password
              </h4>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Enter your registered email address below. We will dispatch a secure password reset link to your inbox.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered email..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981]"
              />

              {resetSent && (
                <p className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  Password reset link sent! Check your email inbox.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Send Password Reset Instructions
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
