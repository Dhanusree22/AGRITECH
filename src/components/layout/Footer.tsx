import React from 'react';
import { Sprout, ShieldCheck, PhoneCall, Award, Heart, Mail, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { t, currentLanguageConfig } = useLanguage();

  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-[#064e3b15] text-[#064e3b80] text-sm">
      {/* Top Value Proposition Strip */}
      <div className="border-b border-[#064e3b10] bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[#064e3b] font-bold text-xs uppercase tracking-wider">100% Escrow Secured</h5>
              <p className="text-[11px] text-[#064e3b70]">Guaranteed payment to farmers upon QA delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[#064e3b] font-bold text-xs uppercase tracking-wider">AI Quality Grading</h5>
              <p className="text-[11px] text-[#064e3b70]">Neural computer vision crop defect detection</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 shrink-0 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[#064e3b] font-bold text-xs uppercase tracking-wider">8 Indian Languages</h5>
              <p className="text-[11px] text-[#064e3b70]">Voice assistant in Kannada, Hindi, Telugu & more</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-800 shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[#064e3b] font-bold text-xs uppercase tracking-wider">Toll-Free Helpline</h5>
              <p className="text-[11px] text-emerald-800 font-bold">1800-180-1551 (24x7 Agri Support)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#064e3b] flex items-center justify-center text-white shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[#064e3b] tracking-tight">AGRITECH</span>
              <p className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase">3D AI Agricultural Trading</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#064e3b80] max-w-sm">
            Empowering Indian farmers and institutional buyers through 3D agricultural visualization, real-time APMC Mandi price discovery, AI price forecasting, and transparent digital contracts.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] px-3 py-1 rounded-full bg-white border border-[#064e3b15] text-[#064e3b] font-semibold">
              APMC e-NAM Compatible
            </span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white border border-[#064e3b15] text-[#064e3b] font-semibold">
              Digital India Initiative
            </span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white border border-[#064e3b15] text-[#064e3b] font-semibold">
              ISO 27001 Certified
            </span>
          </div>
        </div>

        {/* Farmer Module Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#064e3b] mb-3">🌾 Farmer Features</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/farmer/dashboard')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                Farmer Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/farmer/crops')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                Crop Management
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/farmer/ai-intelligence')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                AI Price Prediction
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/farmer/profit-simulator')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                Profit Simulator
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/farmer/buyers')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                Buyer Matching
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/farmer/advisory')} className="hover:text-[#064e3b] hover:font-semibold transition-colors">
                Smart Advisory
              </button>
            </li>
          </ul>
        </div>

        {/* Buyer Module Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 mb-3">🛒 Buyer Features</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/buyer/dashboard')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Buyer Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/buyer/marketplace')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Smart Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/buyer/crop-intelligence')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Crop Comparison
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/buyer/group-buying')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Group Buying Pools
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/buyer/reverse-bidding')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Reverse Bidding
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/buyer/logistics')} className="hover:text-cyan-900 hover:font-semibold transition-colors">
                Logistics Tracking
              </button>
            </li>
          </ul>
        </div>

        {/* Admin & System Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-3">⚙️ Admin Command</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/admin/dashboard')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                Command Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/users')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                User Management
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/verification')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                KYC Verification
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/ai-monitoring')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                AI Monitoring Center
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/analytics')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                Analytics Command
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/admin/security')} className="hover:text-purple-900 hover:font-semibold transition-colors">
                Fraud & Security
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#064e3b10] py-6 text-center text-xs text-[#064e3b70]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AGRITECH Systems Inc. All rights reserved. Made for Indian Agriculture.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-800 font-bold">Active Language: {currentLanguageConfig.nativeName} ({currentLanguageConfig.label})</span>
            <span>•</span>
            <button onClick={() => navigate('/about')} className="hover:text-[#064e3b]">Privacy Policy</button>
            <button onClick={() => navigate('/about')} className="hover:text-[#064e3b]">Terms of Fair Trade</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
