import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Globe,
  Mic,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Shield,
  ShoppingBag,
  Tractor,
  LogOut,
  Check,
  Sparkles,
  ArrowRight,
  LogIn,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenVoice }) => {
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } = useStore();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleOpenVoice = () => {
    if (onOpenVoice) {
      onOpenVoice();
    } else {
      setVoiceOpen(true);
    }
  };

  const navLinks = [
    { label: t('Home', 'Home'), path: '/' },
    { label: t('Features', 'Features'), path: '/#features' },
    { label: t('How It Works', 'How It Works'), path: '/#how-it-works' },
    { label: t('AI Intelligence', 'AI Intelligence'), path: '/#ai-intelligence' },
    { label: t('Marketplace', 'Marketplace'), path: '/marketplace' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (currentPath === '/' || currentPath === '') {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#123D2A]/10 text-[#123D2A] shadow-sm transition-all">
        {/* Top Ticker Notification Banner */}
        <div className="bg-[#123D2A] px-4 py-1.5 text-xs text-emerald-100 flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#C6FF4A] animate-ping" />
            <span className="font-extrabold text-[#C6FF4A] tracking-wider uppercase text-[10px]">
              {t('LIVE MANDI APMC:')}
            </span>
            <span className="text-emerald-100 text-[11px] font-medium">
              {t('Tomato (Hybrid)')} ₹32/kg <span className="text-[#C6FF4A]">(+8.4%)</span> • {t('Red Onion')} ₹28/kg <span className="text-rose-300">(-2.1%)</span> • {t('Potato (Jyoti)')} ₹24/kg <span className="text-[#C6FF4A]">(+4.7%)</span> • {t('Sona Masoori Rice')} ₹58/kg <span className="text-[#C6FF4A]">(+1.8%)</span>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-emerald-200 shrink-0">
            <span>📞 <strong className="text-white">1800-180-1551</strong> (Kisan Toll-Free)</span>
            <span className="text-emerald-400/40">|</span>
            <span className="text-[#00B8F0] font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> 100% Escrow Secured
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* AgriTech Logo with Leaf & AI symbol */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#123D2A] via-[#10B981] to-[#C6FF4A] p-0.5 shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#123D2A] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <Sprout className="w-6 h-6 text-[#C6FF4A] group-hover:rotate-12 transition-transform relative z-10" />
                  <Sparkles className="w-3 h-3 text-[#00B8F0] absolute top-1 right-1 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-[#123D2A]">
                    AGRI<span className="text-[#10B981]">TECH</span>
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#123D2A] border border-[#10B981]/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#10B981]" /> AI 3D
                  </span>
                </div>
                <p className="text-[10px] text-[#123D2A]/70 tracking-widest uppercase font-semibold">
                  Smart Agricultural Trading Platform
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPath === link.path
                      ? 'text-[#123D2A] bg-[#10B981]/15 border border-[#10B981]/30 shadow-xs'
                      : 'text-[#18251E]/80 hover:text-[#123D2A] hover:bg-[#123D2A]/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Controls: Languages, Voice AI, Notifications, Login & Get Started */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Multilingual Selector (8 Indian Languages) */}
              <div className="relative">
                <button
                  onClick={() => {
                    setLangMenuOpen(!langMenuOpen);
                    setRoleMenuOpen(false);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 border border-[#123D2A]/15 hover:border-[#10B981] text-xs font-bold text-[#123D2A] transition-all shadow-xs cursor-pointer"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-sm">{currentLanguageConfig.flag}</span>
                  <span className="hidden sm:inline">{currentLanguageConfig.nativeName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#123D2A]/60" />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#123D2A]/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-bold text-[#123D2A]/60 px-3 py-1 uppercase tracking-wider">
                      Select Language (8)
                    </p>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          language === l.code
                            ? 'bg-[#10B981]/10 text-[#123D2A] font-bold border border-[#10B981]/30'
                            : 'text-gray-700 hover:bg-emerald-50/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                          <span className="text-gray-400 text-[10px]">({l.label})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice AI Assistant Trigger */}
              <button
                onClick={handleOpenVoice}
                className="px-3 py-2 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#123D2A] hover:bg-[#10B981]/25 transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer group"
                title="AgriAI Vernacular Voice Assistant"
              >
                <Mic className="w-4 h-4 text-[#10B981] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline font-bold">Voice AI</span>
              </button>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setLangMenuOpen(false);
                    setRoleMenuOpen(false);
                  }}
                  className="relative p-2.5 rounded-full bg-white/90 border border-[#123D2A]/15 text-[#123D2A] hover:border-[#10B981] transition-all shadow-xs cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#123D2A]/15 shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold text-[#123D2A] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#10B981]" /> Notifications ({notifications.length})
                      </h4>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#10B981] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 py-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-gray-50 border-gray-100 text-gray-500'
                              : 'bg-emerald-50/70 border-emerald-200 text-[#123D2A]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[#123D2A] mb-0.5">
                            <span className="truncate">{n.title}</span>
                            <span className="text-[10px] text-gray-400 font-normal shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] leading-tight text-gray-600">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Login Button (Section 5A requirement) */}
              {role === 'guest' ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#123D2A] bg-white border border-[#123D2A]/20 hover:border-[#10B981] hover:bg-emerald-50/50 shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{t('Login', 'Login')}</span>
                  </button>

                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#123D2A] via-[#10B981] to-[#059669] hover:opacity-95 shadow-lg shadow-emerald-950/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>{t('Get Started', 'Get Started')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                /* Authenticated User / Role Pill */
                <div className="relative">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(!roleMenuOpen);
                      setLangMenuOpen(false);
                      setNotifOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      role === 'farmer'
                        ? 'bg-[#123D2A] text-white hover:bg-[#064e3b]'
                        : role === 'buyer'
                        ? 'bg-[#00B8F0] text-slate-950 hover:bg-[#00a3d4]'
                        : 'bg-purple-800 text-white hover:bg-purple-900'
                    }`}
                  >
                    {role === 'farmer' ? (
                      <Tractor className="w-4 h-4" />
                    ) : role === 'buyer' ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                    <span className="capitalize hidden sm:inline">{role} Portal</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#123D2A]/15 shadow-2xl p-3 z-50 text-[#123D2A]">
                      <div className="pb-2 border-b border-gray-100 mb-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-extrabold text-[#123D2A] truncate">{user?.name || user?.email}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold mt-1 inline-block capitalize">
                          {role}
                        </span>
                      </div>

                      <div className="space-y-1.5 my-2">
                        <button
                          onClick={() => {
                            switchRole('farmer');
                            setRoleMenuOpen(false);
                            navigate('/farmer/dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            role === 'farmer'
                              ? 'bg-emerald-50 border border-emerald-300 text-[#123D2A]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                              <Tractor className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#123D2A]">🌾 Farmer Portal</p>
                              <p className="text-[10px] text-gray-500">Crop CRUD & Mandi Intelligence</p>
                            </div>
                          </div>
                          {role === 'farmer' && <Check className="w-4 h-4 text-[#10B981]" />}
                        </button>

                        <button
                          onClick={() => {
                            switchRole('buyer');
                            setRoleMenuOpen(false);
                            navigate('/buyer/dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            role === 'buyer'
                              ? 'bg-cyan-50 border border-cyan-300 text-cyan-950'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-cyan-950">🛒 Buyer Portal</p>
                              <p className="text-[10px] text-gray-500">Marketplace & Orders</p>
                            </div>
                          </div>
                          {role === 'buyer' && <Check className="w-4 h-4 text-cyan-600" />}
                        </button>

                        <button
                          onClick={() => {
                            switchRole('admin');
                            setRoleMenuOpen(false);
                            navigate('/admin/dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            role === 'admin'
                              ? 'bg-purple-50 border border-purple-300 text-purple-950'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                              <Shield className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-purple-950">⚙️ Admin Headquarters</p>
                              <p className="text-[10px] text-gray-500">Governance & AI Monitoring</p>
                            </div>
                          </div>
                          {role === 'admin' && <Check className="w-4 h-4 text-purple-600" />}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logout();
                            setRoleMenuOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-white border border-[#123D2A]/15 text-[#123D2A] cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#123D2A]/15 p-4 space-y-2 text-[#123D2A]">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  handleNavClick(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
                  currentPath === link.path ? 'bg-emerald-100 text-[#123D2A]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#123D2A]/20 text-xs font-bold text-[#123D2A] text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#123D2A] to-[#10B981] text-xs font-bold text-white text-center shadow-md"
                >
                  Get Started
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => {
                    switchRole('farmer');
                    setMobileMenuOpen(false);
                    navigate('/farmer/dashboard');
                  }}
                  className="p-2 rounded-xl bg-emerald-100 text-xs font-bold text-[#123D2A] text-center"
                >
                  🌾 Farmer
                </button>
                <button
                  onClick={() => {
                    switchRole('buyer');
                    setMobileMenuOpen(false);
                    navigate('/buyer/dashboard');
                  }}
                  className="p-2 rounded-xl bg-cyan-100 text-xs font-bold text-cyan-900 text-center"
                >
                  🛒 Buyer
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setMobileMenuOpen(false);
                    navigate('/admin/dashboard');
                  }}
                  className="p-2 rounded-xl bg-purple-100 text-xs font-bold text-purple-900 text-center"
                >
                  ⚙️ Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
};
