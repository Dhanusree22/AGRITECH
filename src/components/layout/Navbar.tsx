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
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead } = useStore();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const navLinks = [
    { label: t('home', 'Home'), path: '/' },
    { label: t('marketplace', 'Marketplace'), path: '/marketplace' },
    { label: t('aiIntelligence', 'AI Intelligence'), path: '/ai-intelligence' },
    { label: t('howItWorks', 'How It Works'), path: '/how-it-works' },
    { label: t('about', 'About'), path: '/about' },
    { label: t('contact', 'Contact'), path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-[#064e3b15] text-[#064e3b] shadow-sm">
        {/* Top Ticker Notification Banner */}
        <div className="bg-[#064e3b] px-4 py-1.5 text-xs text-emerald-100 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-amber-300">{t('LIVE MANDI TICKER:')}</span>
            <span className="text-emerald-100">{t('Tomato (Hybrid)')} ₹32/kg (↑ 8.4%) • {t('Red Onion')} ₹28/kg (↓ 2.1%) • {t('Potato (Jyoti)')} ₹24/kg (↑ 4.7%) • {t('Sona Masoori Rice')} ₹58/kg (↑ 1.8%)</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-emerald-200">
            <span>📞 {t('Kisan Helpline: 1800-180-1551 (Toll-Free)')}</span>
            <span className="text-emerald-400">•</span>
            <span className="font-semibold text-amber-300">{t('Escrow Protected Trading')}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#064e3b] to-emerald-600 p-0.5 shadow-md group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-[#064e3b] group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[#064e3b]">
                    AGRITECH
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#064e3b] border border-emerald-200">
                    3D AI
                  </span>
                </div>
                <p className="text-[10px] text-[#064e3b80] tracking-wider uppercase font-semibold">Agricultural Trading Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                    currentPath === link.path
                      ? 'text-[#064e3b] bg-emerald-100/80 border border-emerald-200 shadow-xs'
                      : 'text-[#064e3b90] hover:text-[#064e3b] hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Controls (Language, Voice, Role Switcher, Auth) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Multilingual Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setLangMenuOpen(!langMenuOpen);
                    setRoleMenuOpen(false);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#064e3b15] hover:border-emerald-500/50 text-xs font-bold text-[#064e3b] transition-all shadow-xs"
                  title="Select Language"
                >
                  <span className="text-sm">{currentLanguageConfig.flag}</span>
                  <span className="hidden sm:inline">{currentLanguageConfig.nativeName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#064e3b70]" />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#064e3b15] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-bold text-[#064e3b70] px-3 py-1 uppercase tracking-wider">Select Language (8)</p>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          language === l.code
                            ? 'bg-emerald-50 text-[#064e3b] font-bold border border-emerald-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                          <span className="text-gray-400 text-[10px]">({l.label})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Assistant Button */}
              <button
                onClick={() => setVoiceOpen(true)}
                className="px-3 py-2 rounded-full bg-[#10b98115] border border-[#10b98130] text-[#059669] hover:bg-[#10b98125] transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="AgriAI Voice Assistant"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span className="hidden md:inline">{t('voiceAssistant', 'Voice AI')}</span>
              </button>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setLangMenuOpen(false);
                    setRoleMenuOpen(false);
                  }}
                  className="relative p-2.5 rounded-full bg-white border border-[#064e3b15] text-[#064e3b] hover:border-emerald-500/40 transition-all shadow-xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#064e3b15] shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-bold text-[#064e3b] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-emerald-600" /> Notifications ({notifications.length})
                      </h4>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-emerald-700 hover:underline font-semibold"
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
                              : 'bg-emerald-50/70 border-emerald-200 text-[#064e3b]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[#064e3b] mb-0.5">
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

              {/* Role Switcher & User Dashboard Link */}
              <div className="relative">
                <button
                  onClick={() => {
                    setRoleMenuOpen(!roleMenuOpen);
                    setLangMenuOpen(false);
                    setNotifOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    role === 'farmer'
                      ? 'bg-[#064e3b] text-white hover:bg-[#065f46]'
                      : role === 'buyer'
                      ? 'bg-[#0e7490] text-white hover:bg-[#0891b2]'
                      : role === 'admin'
                      ? 'bg-[#581c87] text-white hover:bg-[#6b21a8]'
                      : 'bg-white border border-[#064e3b20] text-[#064e3b] hover:bg-gray-50'
                  }`}
                >
                  {role === 'farmer' ? (
                    <Tractor className="w-4 h-4" />
                  ) : role === 'buyer' ? (
                    <ShoppingBag className="w-4 h-4" />
                  ) : role === 'admin' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}

                  <span className="capitalize hidden sm:inline">
                    {role === 'guest' ? 'Select Role' : `${role}`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#064e3b15] shadow-2xl p-3 z-50 text-[#064e3b]">
                    <p className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                      Switch Role Portal
                    </p>

                    <div className="space-y-1.5 my-2">
                      {/* Farmer Role */}
                      <button
                        onClick={() => {
                          switchRole('farmer');
                          setRoleMenuOpen(false);
                          navigate('/farmer/dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                          role === 'farmer'
                            ? 'bg-emerald-50 border border-emerald-300 text-[#064e3b]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Tractor className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#064e3b]">🌾 Farmer Portal</p>
                            <p className="text-[10px] text-gray-500">12 AI & Crop Features</p>
                          </div>
                        </div>
                        {role === 'farmer' && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>

                      {/* Buyer Role */}
                      <button
                        onClick={() => {
                          switchRole('buyer');
                          setRoleMenuOpen(false);
                          navigate('/buyer/dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                          role === 'buyer'
                            ? 'bg-cyan-50 border border-cyan-300 text-cyan-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-cyan-900">🛒 Buyer Portal</p>
                            <p className="text-[10px] text-gray-500">12 Procurement Features</p>
                          </div>
                        </div>
                        {role === 'buyer' && <Check className="w-4 h-4 text-cyan-600" />}
                      </button>

                      {/* Admin Role */}
                      <button
                        onClick={() => {
                          switchRole('admin');
                          setRoleMenuOpen(false);
                          navigate('/admin/dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                          role === 'admin'
                            ? 'bg-purple-50 border border-purple-300 text-purple-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-purple-900">⚙️ Admin Command</p>
                            <p className="text-[10px] text-gray-500">12 Oversight Tools</p>
                          </div>
                        </div>
                        {role === 'admin' && <Check className="w-4 h-4 text-purple-600" />}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      {role !== 'guest' ? (
                        <button
                          onClick={() => {
                            logout();
                            setRoleMenuOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout ({user?.name})
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            navigate('/login');
                          }}
                          className="w-full py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-xs font-bold text-white"
                        >
                          Login / Register
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-white border border-[#064e3b15] text-[#064e3b]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#064e3b15] p-4 space-y-2 text-[#064e3b]">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentPath === link.path ? 'bg-emerald-100 text-[#064e3b]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  switchRole('farmer');
                  setMobileMenuOpen(false);
                  navigate('/farmer/dashboard');
                }}
                className="p-2 rounded-xl bg-emerald-100 text-xs font-bold text-[#064e3b] text-center"
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
        )}
      </header>

      {/* Voice Assistant Modal Component */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
};
