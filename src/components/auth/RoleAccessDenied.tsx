import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, LogIn, Lock, Tractor, ShoppingBag, Shield, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface RoleAccessDeniedProps {
  currentRole: UserRole;
  targetRole: UserRole;
  navigate: (path: string) => void;
}

export const RoleAccessDenied: React.FC<RoleAccessDeniedProps> = ({ currentRole, targetRole, navigate }) => {
  const { login } = useAuth();

  const getRoleTitle = (r: UserRole) => {
    switch (r) {
      case 'farmer':
        return 'Primary Producer / Farmer';
      case 'buyer':
        return 'Institutional Commodity Buyer';
      case 'admin':
        return 'System Administrator';
      default:
        return 'Guest Visitor';
    }
  };

  const getTargetIcon = (r: UserRole) => {
    switch (r) {
      case 'farmer':
        return <Tractor className="w-8 h-8 text-emerald-600" />;
      case 'buyer':
        return <ShoppingBag className="w-8 h-8 text-cyan-600" />;
      case 'admin':
        return <Shield className="w-8 h-8 text-purple-600" />;
      default:
        return <Lock className="w-8 h-8 text-amber-600" />;
    }
  };

  const isGuest = currentRole === 'guest';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white/95 backdrop-blur-xl border border-[#123D2A]/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#123D2A] text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300 inline-block">
            {isGuest ? 'Authentication Required' : 'Role Mismatch / Access Restricted'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#123D2A] tracking-tight">
            {isGuest ? `Sign In to Access ${getRoleTitle(targetRole)} Dashboard` : 'Access Denied For Current Account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#18251E]/75 max-w-md mx-auto leading-relaxed">
            {isGuest
              ? `You must be logged in as an authorized ${getRoleTitle(targetRole)} to view this portal and manage operations.`
              : `You are currently authenticated as "${getRoleTitle(currentRole)}". The dashboard you requested requires verified "${getRoleTitle(targetRole)}" privileges.`}
          </p>
        </div>

        {/* Current vs Required Indicator */}
        <div className="p-4 rounded-2xl bg-[#F7F9F4] border border-[#123D2A]/10 grid grid-cols-2 gap-3 text-left">
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Current Status</span>
            <span className="text-xs font-extrabold capitalize text-gray-700 block mt-0.5 truncate">{currentRole}</span>
          </div>
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Required Role</span>
            <span className="text-xs font-black capitalize text-emerald-900 block mt-0.5 truncate">{targetRole}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/login`)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#123D2A] to-[#10B981] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with {targetRole.toUpperCase()} Account</span>
          </button>

          {/* Instant 1-Click Switcher for Demo testing */}
          <button
            onClick={() => {
              login(targetRole);
              if (targetRole === 'farmer') navigate('/farmer/dashboard');
              else if (targetRole === 'buyer') navigate('/buyer/dashboard');
              else if (targetRole === 'admin') navigate('/admin/dashboard');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-300 text-[#123D2A] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Switch to Demo {targetRole.toUpperCase()}</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123D2A]/70 hover:text-[#123D2A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to AgriTech Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
