import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tractor, ShoppingBag, Shield, Check, ArrowRight, User, Lock, Mail, Phone, MapPin, Building, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const AuthPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { login, registerUser } = useAuth();
  const { t, language } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('10');
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      registerUser({
        name: name || (selectedRole === 'farmer' ? 'Ramesh Patel' : selectedRole === 'buyer' ? 'Priya Sundaram' : 'Admin'),
        email: email || `${selectedRole}@agritech.in`,
        phone: phone || '+91 98450 12345',
        role: selectedRole,
        location: location || 'Bengaluru Rural / Kolar',
        state: 'Karnataka',
        farmSizeAcres: selectedRole === 'farmer' ? Number(farmSize) : undefined,
        businessName: selectedRole === 'buyer' ? (businessName || 'GreenMart Wholesale') : undefined,
      });
    } else {
      login(selectedRole, email, name);
    }

    if (selectedRole === 'farmer') navigate('/farmer/dashboard');
    else if (selectedRole === 'buyer') navigate('/buyer/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    login(role);
    if (role === 'farmer') navigate('/farmer/dashboard');
    else if (role === 'buyer') navigate('/buyer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 text-[#064e3b]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Role Selector & Instant Demo Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Secure Access Gateway</span>
            <h2 className="text-3xl font-extrabold text-[#064e3b]">Choose Your Portal</h2>
            <p className="text-xs text-[#064e3b70] leading-relaxed">
              Experience customized trading dashboards tailored for Indian farmers, institutional buyers, and market administrators.
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            {/* Farmer Card */}
            <div
              onClick={() => setSelectedRole('farmer')}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedRole === 'farmer'
                  ? 'bg-white border-[#064e3b] text-[#064e3b] shadow-xl shadow-[#064e3b10]'
                  : 'bg-white/60 border-[#064e3b15] text-[#064e3b80] hover:border-[#064e3b30]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064e3b] flex items-center justify-center">
                  <Tractor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#064e3b]">🌾 Farmer Portal</h4>
                  <p className="text-[11px] text-[#064e3b70]">Sell crops, AI price prediction, cooperative pooling</p>
                </div>
              </div>
              {selectedRole === 'farmer' && <Check className="w-5 h-5 text-[#064e3b]" />}
            </div>

            {/* Buyer Card */}
            <div
              onClick={() => setSelectedRole('buyer')}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedRole === 'buyer'
                  ? 'bg-white border-cyan-700 text-cyan-950 shadow-xl shadow-cyan-900/10'
                  : 'bg-white/60 border-[#064e3b15] text-[#064e3b80] hover:border-[#064e3b30]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cyan-950">🛒 Wholesale Buyer Portal</h4>
                  <p className="text-[11px] text-[#064e3b70]">Direct sourcing, group buying, reverse bidding</p>
                </div>
              </div>
              {selectedRole === 'buyer' && <Check className="w-5 h-5 text-cyan-700" />}
            </div>

            {/* Admin Card */}
            <div
              onClick={() => setSelectedRole('admin')}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedRole === 'admin'
                  ? 'bg-white border-purple-700 text-purple-950 shadow-xl shadow-purple-900/10'
                  : 'bg-white/60 border-[#064e3b15] text-[#064e3b80] hover:border-[#064e3b30]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-950">⚙️ Admin Headquarters</h4>
                  <p className="text-[11px] text-[#064e3b70]">KYC audits, dispute escrow, AI health monitoring</p>
                </div>
              </div>
              {selectedRole === 'admin' && <Check className="w-5 h-5 text-purple-700" />}
            </div>
          </div>

          {/* 1-Click Instant Demo Credentials */}
          <div className="p-4 rounded-3xl bg-white border border-[#064e3b15] space-y-2 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-amber-700 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-600" /> Instant Demo Tester (1-Click)
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer')}
                className="py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] font-bold text-[11px] hover:bg-emerald-200 transition-all cursor-pointer"
              >
                Farmer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 font-bold text-[11px] hover:bg-cyan-200 transition-all cursor-pointer"
              >
                Buyer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 font-bold text-[11px] hover:bg-purple-200 transition-all cursor-pointer"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication / Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#064e3b15] p-6 sm:p-8 shadow-xl shadow-[#064e3b08] space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-[#064e3b10] pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#064e3b]">
                {isRegisterMode ? `Register as ${selectedRole.toUpperCase()}` : `Login to ${selectedRole.toUpperCase()} Portal`}
              </h3>
              <p className="text-xs text-[#064e3b70]">
                {isRegisterMode ? 'Enter credentials to set up your verified profile' : 'Welcome back to your agricultural dashboard'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {isRegisterMode ? 'Already have account? Login' : 'Need account? Register'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Full Name / Trade Entity</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patel' : 'e.g. Priya Sundaram'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={`${selectedRole}@agritech.in`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Phone Number (OTP Verification)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {isRegisterMode && selectedRole === 'farmer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">District / Mandi Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Kolar, Karnataka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {isRegisterMode && selectedRole === 'buyer' && (
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Company / Supermarket Chain Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. GreenMart Wholesale Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  defaultValue="agritech2026"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-sm text-white shadow-xl bg-[#064e3b] hover:bg-[#065f46] shadow-emerald-950/20 transition-all cursor-pointer"
            >
              {isRegisterMode ? `Create ${selectedRole.toUpperCase()} Account` : `Sign In to ${selectedRole.toUpperCase()} Portal`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
