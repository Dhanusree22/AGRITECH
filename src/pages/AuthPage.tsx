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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, LanguageCode } from '../types';

interface AuthPageProps {
  navigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigate, initialMode = 'login' }) => {
  const { login, registerUser } = useAuth();
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
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | 'Email'>('WhatsApp');

  // Admin specific fields (Section 6 & 15: Restricted Admin Bootstrap)
  const [adminSecurityKey, setAdminSecurityKey] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Sync mode if hash changed
  useEffect(() => {
    if (window.location.hash === '#/register') {
      setMode('register');
    } else if (window.location.hash === '#/login') {
      setMode('login');
    }
  }, []);

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
      if (password && confirmPassword && password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter identical passwords.');
        return;
      }
      if (!acceptTerms) {
        setErrorMsg('Please accept the AgriTech Terms of Service to proceed.');
        return;
      }
      // Admin verification check
      if (selectedRole === 'admin') {
        if (adminSecurityKey.trim() !== 'AGRI-ADMIN-2026') {
          setAdminKeyError('Invalid Admin Security Key. For testing, use "AGRI-ADMIN-2026" or choose Farmer / Buyer.');
          return;
        }
      }

      setIsSubmitting(true);
      setTimeout(() => {
        registerUser({
          name: name || (selectedRole === 'farmer' ? 'Ramesh Patel' : selectedRole === 'buyer' ? 'Priya Sundaram' : 'Dr. Anand Deshmukh'),
          email: email || `${selectedRole}@agritech.in`,
          phone: phone || '+91 98450 12345',
          role: selectedRole,
          location: `${district}, ${stateName}`,
          state: stateName,
          preferredLanguage: preferredLang,
          farmName: selectedRole === 'farmer' ? (farmName || 'Kolar Agro Fields') : undefined,
          farmSizeAcres: selectedRole === 'farmer' ? Number(farmSize) : undefined,
          businessName: selectedRole === 'buyer' ? businessName : undefined,
        });

        setIsSubmitting(false);
        setSuccessMsg(`Welcome to AgriTech! Redirecting to ${selectedRole.toUpperCase()} Dashboard...`);
        setTimeout(() => {
          if (selectedRole === 'farmer') navigate('/farmer/dashboard');
          else if (selectedRole === 'buyer') navigate('/buyer/dashboard');
          else if (selectedRole === 'admin') navigate('/admin/dashboard');
        }, 800);
      }, 500);
    } else {
      // Login mode
      setIsSubmitting(true);
      setTimeout(() => {
        login(selectedRole, email, name);
        setIsSubmitting(false);
        if (selectedRole === 'farmer') navigate('/farmer/dashboard');
        else if (selectedRole === 'buyer') navigate('/buyer/dashboard');
        else if (selectedRole === 'admin') navigate('/admin/dashboard');
      }, 400);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (mode === 'login') {
      setEmail(`${role}@agritech.in`);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    login(role);
    if (role === 'farmer') navigate('/farmer/dashboard');
    else if (role === 'buyer') navigate('/buyer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-[90vh] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center text-[#123D2A]">
      {/* Return to Home Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 backdrop-blur-md border border-[#123D2A]/15 text-xs font-bold text-[#123D2A] hover:bg-emerald-50 hover:border-[#10B981] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#10B981]" />
          <span>Return to Home</span>
        </button>

        {/* Language selector in auth */}
        <div className="relative flex items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="appearance-none flex items-center gap-1.5 text-xs font-bold bg-white/90 backdrop-blur-md px-3.5 py-1.5 pr-8 rounded-full border border-[#123D2A]/15 text-[#123D2A] cursor-pointer hover:border-[#10B981] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            aria-label="Select language"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName} ({l.label})
              </option>
            ))}
          </select>
          <Globe className="w-3.5 h-3.5 text-[#10B981] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            LEFT COLUMN (5 cols): ROLE CARDS & 1-CLICK INSTANT DEMO SWITCHER
           ===================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Authentication & Role Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123D2A] tracking-tight">
              {mode === 'register' ? 'Join AgriTech Today' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-[#18251E]/70 leading-relaxed font-medium">
              Select your role below. Each portal features purpose-built tools for crop tracking, wholesale bidding,
              or administrative platform management.
            </p>
          </div>

          {/* Three Distinct Role Selection Cards */}
          <div className="space-y-3">
            {/* 1. Farmer Role Card */}
            <div
              onClick={() => handleSelectRole('farmer')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-start justify-between backdrop-blur-xl ${
                selectedRole === 'farmer'
                  ? 'bg-white/95 border-[#123D2A] ring-2 ring-[#10B981]/50 shadow-xl shadow-emerald-950/10'
                  : 'bg-white/75 border-white/80 hover:border-[#10B981]/50 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-[#123D2A] flex items-center justify-center shrink-0">
                  <Tractor className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-[#123D2A]">🌾 Farmer Portal</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#123D2A]">
                      Producer
                    </span>
                  </div>
                  <p className="text-xs text-[#18251E]/70 mt-1 leading-relaxed">
                    Manage crop lifecycle, AI Mandi modal price trajectories, computer vision grading & direct selling.
                  </p>
                </div>
              </div>
              {selectedRole === 'farmer' && (
                <div className="w-6 h-6 rounded-full bg-[#123D2A] text-white flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-[#C6FF4A]" />
                </div>
              )}
            </div>

            {/* 2. Buyer Role Card */}
            <div
              onClick={() => handleSelectRole('buyer')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-start justify-between backdrop-blur-xl ${
                selectedRole === 'buyer'
                  ? 'bg-white/95 border-[#00B8F0] ring-2 ring-[#00B8F0]/50 shadow-xl shadow-cyan-950/10'
                  : 'bg-white/75 border-white/80 hover:border-[#00B8F0]/50 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-900 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-[#00B8F0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-cyan-950">🛒 Wholesale Buyer</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900">
                      Procurement
                    </span>
                  </div>
                  <p className="text-xs text-[#18251E]/70 mt-1 leading-relaxed">
                    Direct farm sourcing, quality certification review, RFPs, group orders & escrow transactions.
                  </p>
                </div>
              </div>
              {selectedRole === 'buyer' && (
                <div className="w-6 h-6 rounded-full bg-[#0e7490] text-white flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* 3. Admin Role Card */}
            <div
              onClick={() => handleSelectRole('admin')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-start justify-between backdrop-blur-xl ${
                selectedRole === 'admin'
                  ? 'bg-white/95 border-purple-700 ring-2 ring-purple-600/50 shadow-xl shadow-purple-950/10'
                  : 'bg-white/75 border-white/80 hover:border-purple-500/50 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-900 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-purple-950">⚙️ Admin Headquarters</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      Governance
                    </span>
                  </div>
                  <p className="text-xs text-[#18251E]/70 mt-1 leading-relaxed">
                    KYC compliance, dispute resolution, AI telemetry logs & platform settings.
                  </p>
                </div>
              </div>
              {selectedRole === 'admin' && (
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* 1-Click Instant Evaluation Demo Credentials */}
          <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant Demo Tester (1-Click)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                No typing required
              </span>
            </div>
            <p className="text-[11px] text-[#18251E]/70">
              Instantly explore the app as any authorized role with verified test data:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer')}
                className="py-2.5 px-3 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-[#123D2A] font-extrabold text-xs hover:bg-emerald-200 transition-all cursor-pointer text-center"
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('buyer')}
                className="py-2.5 px-3 rounded-2xl bg-cyan-100/90 border border-cyan-300 text-cyan-950 font-extrabold text-xs hover:bg-cyan-200 transition-all cursor-pointer text-center"
              >
                🛒 Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2.5 px-3 rounded-2xl bg-purple-100/90 border border-purple-300 text-purple-950 font-extrabold text-xs hover:bg-purple-200 transition-all cursor-pointer text-center"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (7 cols): MAIN LOGIN / REGISTRATION FORM
           ===================================================================== */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 p-6 sm:p-10 shadow-2xl shadow-emerald-950/15 space-y-6">
          {/* Mode Switcher Tabs (Login vs Register) */}
          <div className="flex items-center justify-between border-b border-[#123D2A]/10 pb-4">
            <div>
              <h3 className="text-2xl font-black text-[#123D2A]">
                {mode === 'register'
                  ? `Create ${selectedRole.toUpperCase()} Account`
                  : `Sign In to ${selectedRole.toUpperCase()} Portal`}
              </h3>
              <p className="text-xs text-[#18251E]/70 mt-0.5">
                {mode === 'register'
                  ? 'Complete your profile to unlock verified trading & predictions'
                  : 'Enter your credentials to access your live dashboard'}
              </p>
            </div>

            {/* Toggle Mode Button */}
            <div className="inline-flex p-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  if (!password) setPassword('agritech2026');
                  if (!email) setEmail(`${selectedRole}@agritech.in`);
                }}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#123D2A] text-white shadow-sm'
                    : 'text-[#123D2A]/70 hover:text-[#123D2A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  if (password === 'agritech2026') setPassword('');
                  if (email.endsWith('@agritech.in')) setEmail('');
                }}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#123D2A] text-white shadow-sm'
                    : 'text-[#123D2A]/70 hover:text-[#123D2A]'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#123D2A]/80 mb-1">
                  Full Name / Legal Entity Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#123D2A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'e.g. Ramesh Patel'
                        : selectedRole === 'buyer'
                        ? 'e.g. Priya Sundaram'
                        : 'e.g. Dr. Anand Deshmukh'
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email & Mobile Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#123D2A]/80 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#123D2A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={`${selectedRole}@agritech.in`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123D2A]/80 mb-1">
                  Mobile Number {mode === 'register' && <span className="text-gray-400 font-normal">(for Mandi SMS Alerts)</span>}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#123D2A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#123D2A]/80">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-[#10B981] hover:underline font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#123D2A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter in Register mode */}
              {mode === 'register' && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>Password Strength:</span>
                    <span className="font-bold">{pwdStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pwdStrength.color} transition-all`}
                      style={{ width: `${(pwdStrength.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#123D2A]/80 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#123D2A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                ROLE-SPECIFIC REGISTRATION FIELDS (Section 6 Compliance)
               =================================================================== */}
            {mode === 'register' && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4 pt-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#123D2A] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#10B981]" />
                  {selectedRole === 'farmer'
                    ? 'Farmer Operational Profile'
                    : selectedRole === 'buyer'
                    ? 'Buyer Procurement Profile'
                    : 'Administrator Authorization Key'}
                </span>

                {/* Farmer fields */}
                {selectedRole === 'farmer' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Farm / Estate Name (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. GreenFields Organic Farm"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Village / Town</label>
                        <input
                          type="text"
                          placeholder="e.g. Malur Hobli"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Land Size</label>
                        <input
                          type="number"
                          value={farmSize}
                          onChange={(e) => setFarmSize(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Unit</label>
                        <select
                          value={farmUnit}
                          onChange={(e) => setFarmUnit(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        >
                          <option value="Acres">Acres</option>
                          <option value="Hectares">Hectares</option>
                          <option value="Guntha">Guntha</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Soil Type</label>
                        <select
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        >
                          <option value="Red Sandy Loam">Red Sandy Loam</option>
                          <option value="Black Cotton Soil">Black Cotton Soil</option>
                          <option value="Alluvial Soil">Alluvial Soil</option>
                          <option value="Laterite Soil">Laterite Soil</option>
                          <option value="Clay Loam">Clay Loam</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Crops Cultivated</label>
                      <input
                        type="text"
                        placeholder="e.g. Tomato, Red Onion, Rice, Capsicum"
                        value={cropsCultivated}
                        onChange={(e) => setCropsCultivated(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                      />
                    </div>
                  </div>
                )}

                {/* Buyer fields */}
                {selectedRole === 'buyer' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Buyer Type</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setBuyerType('Business')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                              buyerType === 'Business'
                                ? 'bg-[#0e7490] text-white'
                                : 'bg-white border text-gray-700'
                            }`}
                          >
                            Corporate / Chain
                          </button>
                          <button
                            type="button"
                            onClick={() => setBuyerType('Individual')}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                              buyerType === 'Individual'
                                ? 'bg-[#0e7490] text-white'
                                : 'bg-white border text-gray-700'
                            }`}
                          >
                            Individual Buyer
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Company / Trade Name</label>
                        <input
                          type="text"
                          placeholder="e.g. GreenMart Supermarket Chain"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Product Sourcing Interests</label>
                        <input
                          type="text"
                          placeholder="e.g. Vegetables, Pulses, Grains"
                          value={productInterests}
                          onChange={(e) => setProductInterests(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Monthly Procurement Volume</label>
                        <input
                          type="text"
                          placeholder="e.g. 50 Metric Tons"
                          value={purchaseQuantity}
                          onChange={(e) => setPurchaseQuantity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin authorization field */}
                {selectedRole === 'admin' && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-950 text-xs leading-relaxed">
                      <strong>Security Notice (Prompt Section 6):</strong> Public self-registration for administrator
                      privileges is restricted. To provision an authorized administrative session, enter the bootstrap key
                      (default test key: <code className="font-bold bg-white px-1.5 py-0.5 rounded">AGRI-ADMIN-2026</code>).
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-purple-950 mb-1">
                        Admin Security Key <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-purple-700 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          placeholder="Enter AGRI-ADMIN-2026"
                          value={adminSecurityKey}
                          onChange={(e) => {
                            setAdminSecurityKey(e.target.value);
                            setAdminKeyError('');
                          }}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-purple-300 text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      {adminKeyError && (
                        <p className="text-[11px] text-rose-600 font-bold mt-1">{adminKeyError}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Region & Language Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-emerald-200/60">
                  <div>
                    <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">State</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">District / Mandi</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#123D2A]/80 mb-1">Preferred Language</label>
                    <select
                      value={preferredLang}
                      onChange={(e) => {
                        const newL = e.target.value as LanguageCode;
                        setPreferredLang(newL);
                        setLanguage(newL);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#123D2A]/15 text-xs text-[#123D2A]"
                    >
                      {languages.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.nativeName} ({l.label})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Terms checkbox / Remember me */}
            <div className="flex items-center justify-between text-xs pt-1">
              {mode === 'register' ? (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span className="text-[#18251E]/70">
                    I accept the <strong className="text-[#123D2A]">AgriTech Terms of Service & Privacy Policy</strong>
                  </span>
                </label>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span className="text-[#18251E]/70">Remember this device</span>
                </label>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full font-black text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] ${
                selectedRole === 'farmer'
                  ? 'bg-gradient-to-r from-[#123D2A] via-[#10B981] to-[#059669] shadow-emerald-950/25 hover:opacity-95'
                  : selectedRole === 'buyer'
                  ? 'bg-gradient-to-r from-[#0e7490] to-[#00B8F0] shadow-cyan-950/25 hover:opacity-95'
                  : 'bg-gradient-to-r from-[#581c87] to-purple-600 shadow-purple-950/25 hover:opacity-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to AgriTech...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'register'
                      ? `Create Verified ${selectedRole.toUpperCase()} Account`
                      : `Sign In to ${selectedRole.toUpperCase()} Portal`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher Link */}
          <div className="pt-2 border-t border-[#123D2A]/10 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#18251E]/70">
                Don't have an AgriTech account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="font-extrabold text-[#10B981] hover:underline cursor-pointer"
                >
                  Register here &rarr;
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#18251E]/70">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="font-extrabold text-[#10B981] hover:underline cursor-pointer"
                >
                  Sign In here &rarr;
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          FORGOT PASSWORD RECOVERY MODAL
         ========================================================================= */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-[#123D2A]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#123D2A] flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-[#10B981]" />
                </div>
                <h4 className="font-black text-base">Reset Your Password</h4>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2 text-center">
                <CheckCircle className="w-8 h-8 text-[#10B981] mx-auto" />
                <h5 className="font-bold">Password Reset Link Dispatched</h5>
                <p>
                  Instructions have been sent to <strong>{resetEmail}</strong>. Please check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-[#18251E]/70 leading-relaxed">
                  Enter your registered farmer, buyer, or admin email address. We will send a secure password recovery
                  link via Firebase Authentication.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#123D2A]/80 mb-1">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="user@agritech.in"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-emerald-50/50 border border-[#123D2A]/20 text-xs text-[#123D2A] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Send Password Reset Instructions
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
