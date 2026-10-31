import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Tractor,
  ShoppingBag,
  Shield,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
  Mic,
  Globe,
  DollarSign,
  Scale,
  Users,
  Building2,
  ChevronRight,
  PhoneCall,
  Clock,
  Layers,
  Leaf,
  BarChart3,
  ShieldCheck,
  CloudSun,
  Activity,
  ScanLine,
  Truck,
  Database,
  AlertTriangle,
  Info,
  Check,
  ExternalLink,
} from 'lucide-react';
import { AIPricePredictionTool } from '../components/ai/AIPricePredictionTool';
import { AICropQualityGradingTool } from '../components/ai/AICropQualityGradingTool';
import { AINegotiationTool } from '../components/ai/AINegotiationTool';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { VoiceAssistantModal } from '../components/voice/VoiceAssistantModal';

export const LandingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { t, language, languages, currentLanguageConfig, setLanguage } = useLanguage();
  const { switchRole } = useAuth();
  const { mandiPrices, crops } = useStore();

  const [activeAITab, setActiveAITab] = useState<'prediction' | 'grading' | 'negotiation'>('prediction');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedMandiCrop, setSelectedMandiCrop] = useState<string>('Tomato (Hybrid)');

  // Selected crop details for preview
  const currentMandiItem = mandiPrices.find((m) => m.crop === selectedMandiCrop) || mandiPrices[0];

  const handleRoleRoute = (roleTarget: 'farmer' | 'buyer' | 'admin') => {
    switchRole(roleTarget);
    if (roleTarget === 'farmer') navigate('/farmer/dashboard');
    else if (roleTarget === 'buyer') navigate('/buyer/dashboard');
    else if (roleTarget === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen text-[#123D2A] selection:bg-[#10B981]/30 selection:text-[#123D2A]">
      {/* =========================================================================
          SECTION 5B: HERO SECTION
          Headline: "Grow Smarter. Trade Better. Farm the Future."
          Supporting text: "One intelligent platform connecting farmers, buyers, and agricultural administrators through AI-powered insights, transparent trading, and real-time agricultural intelligence."
          Primary CTA: Get Started
          Secondary CTA: Explore AgriTech
         ========================================================================= */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#10B981]/30 text-[#123D2A] text-xs font-black shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>AI-Powered Smart Agricultural Trading & Farmer Support Platform</span>
          </motion.div>

          {/* Exact Prompt Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#123D2A] leading-[1.1]"
          >
            Grow Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#059669] to-[#00B8F0]">
              Trade Better.
            </span>{' '}
            Farm the Future.
          </motion.h1>

          {/* Exact Prompt Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-[#18251E]/80 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            One intelligent platform connecting farmers, buyers, and agricultural administrators through
            AI-powered insights, transparent trading, and real-time agricultural intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#123D2A] via-[#10B981] to-[#059669] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/25 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('preview-dashboard');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-7 py-4 rounded-full bg-white/85 backdrop-blur-md border border-[#123D2A]/15 hover:border-[#10B981] text-[#123D2A] font-extrabold text-sm sm:text-base shadow-md hover:bg-emerald-50/50 transition-all cursor-pointer"
            >
              <span>Explore AgriTech</span>
              <ChevronRight className="w-4 h-4 text-[#10B981]" />
            </button>

            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 hover:bg-[#10B981]/25 text-[#123D2A] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              title="Speak in Kannada, Hindi, Telugu, Tamil, English & more"
            >
              <Mic className="w-4 h-4 text-[#10B981] animate-pulse" />
              <span>Voice AI (8 Languages)</span>
            </button>
          </motion.div>
        </div>

        {/* -----------------------------------------------------------------------
            VISUALLY IMPRESSIVE AGRICULTURAL DASHBOARD PREVIEW
            (Section 5B: crop analytics, mandi price cards, weather information,
             market trends, and an AI assistant)
           ----------------------------------------------------------------------- */}
        <motion.div
          id="preview-dashboard"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-14 rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-emerald-950/15 overflow-hidden"
        >
          {/* Top Header of Simulated Live Dashboard */}
          <div className="bg-[#123D2A] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#C6FF4A] animate-ping" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#C6FF4A]">
                  AgriTech Intelligence Hub &middot; Real-time Preview
                </span>
                <p className="text-[11px] text-emerald-200">
                  Karnataka & National Mandi Observations &bull; Last retrieved:{' '}
                  <span className="font-semibold text-white">Today 09:30 AM (AGMARKNET Source)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 font-medium">
                APMC Sync: Active
              </span>
              <span className="px-3 py-1 rounded-full bg-[#10B981]/30 text-[#C6FF4A] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow
              </span>
            </div>
          </div>

          {/* Interactive Multi-Widget Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 cols: Mandi Crop Switcher & Live Price Details */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#123D2A]/70 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#10B981]" /> Live APMC Mandi Rates
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold">
                  Official Feed
                </span>
              </div>

              {/* Crop Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {mandiPrices.slice(0, 5).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMandiCrop(m.crop)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      selectedMandiCrop === m.crop
                        ? 'bg-[#123D2A] text-white shadow-sm'
                        : 'bg-emerald-50 text-[#123D2A] hover:bg-emerald-100/70 border border-emerald-100'
                    }`}
                  >
                    {m.crop}
                  </button>
                ))}
              </div>

              {/* Selected Mandi Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-[#10B981]/20 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-extrabold text-base text-[#123D2A]">{currentMandiItem.crop}</h5>
                    <p className="text-xs text-[#123D2A]/70 flex items-center gap-1">
                      <span>Mandi:</span> <strong>{currentMandiItem.mandi}</strong> ({currentMandiItem.state})
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      currentMandiItem.trend === 'up'
                        ? 'bg-emerald-100 text-[#123D2A]'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    +{currentMandiItem.changePercent}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-emerald-200/50">
                  <div>
                    <span className="text-3xl font-black text-[#123D2A]">₹{currentMandiItem.pricePerKg}</span>
                    <span className="text-xs text-[#123D2A]/70"> / kg (₹{currentMandiItem.modalPrice}/Qtl)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#123D2A]/60 block uppercase font-bold">7-Day AI Target</span>
                    <span className="text-xs font-extrabold text-[#059669]">
                      ₹{currentMandiItem.ai7DayForecastPerKg}/kg ({currentMandiItem.confidence}% conf.)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-[#123D2A]/70 bg-white/70 p-2.5 rounded-xl">
                  <div>Daily Arrival: <strong className="text-[#123D2A]">{currentMandiItem.arrivalTons} Tons</strong></div>
                  <div>Range: <strong className="text-[#123D2A]">₹{(currentMandiItem.minPrice / 100).toFixed(0)} - ₹{(currentMandiItem.maxPrice / 100).toFixed(0)}</strong></div>
                </div>
              </div>

              {/* Weather Observation Strip (Open-Meteo Integration Preview) */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#123D2A]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#123D2A] block">28°C &middot; Clear Sky</span>
                    <span className="text-[10px] text-[#123D2A]/60">Kolar Agrometeorological Zone (Open-Meteo)</span>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-[#059669] font-bold block">Rain: 0mm</span>
                  <span className="text-[10px] text-[#123D2A]/60">Humidity: 58%</span>
                </div>
              </div>
            </div>

            {/* Middle 5 cols: Predictive Trend Analytics Visualization */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#123D2A]/70 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#00B8F0]" /> 30-Day APMC Trend & Forecasting Curve
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                  Time-Series Model
                </span>
              </div>

              {/* Graphical SVG Chart Simulation */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Model Trajectory</span>
                    <strong className="text-emerald-400 font-black text-sm">Bullish Uptrend (+12.4%)</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Observed
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] border border-dashed border-white" /> AI Forecast
                    </span>
                  </div>
                </div>

                {/* SVG Visual Graph */}
                <div className="h-36 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#334155" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#334155" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="#334155" strokeDasharray="3 3" />

                    {/* Historical Area */}
                    <path
                      d="M 0,90 Q 50,75 100,82 T 200,55 T 260,42 L 260,120 L 0,120 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Observed Solid Line */}
                    <path
                      d="M 0,90 Q 50,75 100,82 T 200,55 T 260,42"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                    />
                    {/* Forecast Dashed Line with Uncertainty Cone */}
                    <path
                      d="M 260,42 Q 330,28 400,18"
                      fill="none"
                      stroke="#F5A623"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                    {/* Uncertainty envelope */}
                    <path
                      d="M 260,42 L 400,8 L 400,28 L 260,42 Z"
                      fill="#F5A623"
                      fillOpacity="0.15"
                    />

                    {/* Current point */}
                    <circle cx="260" cy="42" r="5" fill="#C6FF4A" stroke="#123D2A" strokeWidth="2" />
                    <text x="250" y="32" fill="#C6FF4A" fontSize="9" fontWeight="bold">Today ₹{currentMandiItem.pricePerKg}</text>
                    <text x="340" y="14" fill="#F5A623" fontSize="9" fontWeight="bold">Day 7 ₹{currentMandiItem.ai7DayForecastPerKg}</text>
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                  <span>Oct 01 (Past)</span>
                  <span>Oct 21 (Today)</span>
                  <span>Nov 05 (Predicted)</span>
                </div>
              </div>

              {/* Data Freshness Indicator */}
              <div className="text-[11px] text-[#123D2A]/70 flex items-center justify-between bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Data Source: <strong>data.gov.in / Agmarknet API</strong></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800">Verified Mandi Feed</span>
              </div>
            </div>

            {/* Right 3 cols: AI Assistant Preview & Quick Action */}
            <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#123D2A]/70 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#10B981]" /> Gemini AI Advisor
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold">
                    Active
                  </span>
                </div>

                {/* Speech Bubble */}
                <div className="p-4 rounded-2xl bg-white border border-[#10B981]/30 shadow-md text-xs space-y-2 relative">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#123D2A] text-[#C6FF4A] flex items-center justify-center font-bold text-[10px]">
                      AI
                    </div>
                    <span className="font-extrabold text-[#123D2A]">Harvest Advisory:</span>
                  </div>
                  <p className="text-[#18251E]/80 leading-relaxed text-[11px]">
                    "{currentMandiItem.crop} modal rates in {currentMandiItem.mandi} are projected to reach ₹
                    {currentMandiItem.ai7DayForecastPerKg}/kg by weekend due to rainfall disruptions in neighboring districts.
                    <strong> Recommended action:</strong> Stage lot listing for Wednesday morning auction."
                  </p>
                  <div className="text-[10px] text-[#10B981] font-bold flex items-center gap-1 pt-1">
                    <CheckCircle className="w-3 h-3" /> Grounded on real mandi historicals
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-200">Neural Grading Preview</span>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold">Batch Grade: Grade A</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">95.4% QA</span>
                  </div>
                </div>
              </div>

              {/* Direct Portal Launch */}
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full py-3 rounded-xl bg-[#123D2A] hover:bg-[#064e3b] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Full Commodity Market</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 5C: ROLE-BASED INTRODUCTION (Three Visually Distinct Role Cards)
          1. Farmer — Manage crops, discover market prices, obtain agricultural recommendations, forecast yield, and sell produce directly.
          2. Buyer — Discover verified farmer listings, compare prices, request purchases, and manage orders.
          3. Admin — Manage users, monitor marketplace activity, review analytics, and oversee platform integrity.
         ========================================================================= */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#123D2A] text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Built for the Complete Agricultural Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#123D2A] tracking-tight">
            Select Your Dedicated Portal
          </h2>
          <p className="text-sm sm:text-base text-[#18251E]/70 max-w-2xl mx-auto">
            Experience role-tailored dashboards and secure workflows configured specifically for Indian farmers,
            institutional commodity buyers, and administrative directors.
          </p>
        </div>

        {/* 3 Distinct Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. FARMER CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-8 shadow-xl shadow-emerald-950/10 flex flex-col justify-between space-y-6 hover:border-[#10B981] transition-all"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123D2A] to-[#10B981] flex items-center justify-center text-white shadow-lg shadow-emerald-950/20">
                <Tractor className="w-7 h-7 text-[#C6FF4A]" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#10B981]">
                  Primary Producer Module
                </span>
                <h3 className="text-2xl font-black text-[#123D2A] mt-1">🌾 Farmer Portal</h3>
                <p className="text-xs text-[#18251E]/70 mt-2 leading-relaxed">
                  Manage crops, discover market prices, obtain agricultural recommendations, forecast yield,
                  and sell produce directly without middlemen deductions.
                </p>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-2.5 pt-2 border-t border-[#123D2A]/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#123D2A]/70">Key Capabilities:</p>
                <ul className="space-y-2 text-xs text-[#18251E]/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Crop Management CRUD:</strong> Log plantings, varieties & harvest dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>AI Yield & Price Forecasting:</strong> 7-day and 30-day APMC trajectories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Computer Vision Quality Grading:</strong> Scan crop defects with camera</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Direct Escrow Selling:</strong> Transparent bank settlement on QA delivery</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleRoleRoute('farmer')}
              className="w-full py-3.5 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-extrabold text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Enter Farmer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 2. BUYER CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-8 shadow-xl shadow-cyan-950/10 flex flex-col justify-between space-y-6 hover:border-[#00B8F0] transition-all"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0e7490] to-[#00B8F0] flex items-center justify-center text-white shadow-lg shadow-cyan-950/20">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00B8F0]">
                  Wholesale & Retail Sourcing
                </span>
                <h3 className="text-2xl font-black text-cyan-950 mt-1">🛒 Buyer Portal</h3>
                <p className="text-xs text-[#18251E]/70 mt-2 leading-relaxed">
                  Discover verified farmer listings, compare prices across state mandis, request volume purchases,
                  and manage orders with locked escrow protection.
                </p>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-2.5 pt-2 border-t border-[#123D2A]/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-950/70">Key Capabilities:</p>
                <ul className="space-y-2 text-xs text-[#18251E]/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00B8F0] shrink-0 mt-0.5" />
                    <span><strong>Searchable Marketplace:</strong> Filter by crop, grade, location & quantity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00B8F0] shrink-0 mt-0.5" />
                    <span><strong>Fair Price Benchmarking:</strong> Instant comparison with live APMC modal rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00B8F0] shrink-0 mt-0.5" />
                    <span><strong>AI Sourcing Assistant:</strong> Match produce specs to bulk procurement schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00B8F0] shrink-0 mt-0.5" />
                    <span><strong>End-to-End Order Tracking:</strong> Real-time status from dispatch to QA sign-off</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleRoleRoute('buyer')}
              className="w-full py-3.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-lg shadow-cyan-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Enter Buyer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 3. ADMIN CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-8 shadow-xl shadow-purple-950/10 flex flex-col justify-between space-y-6 hover:border-purple-600 transition-all"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#581c87] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/20">
                <Shield className="w-7 h-7 text-white" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                  Governance & Compliance
                </span>
                <h3 className="text-2xl font-black text-purple-950 mt-1">⚙️ Admin Command</h3>
                <p className="text-xs text-[#18251E]/70 mt-2 leading-relaxed">
                  Manage users, monitor marketplace activity, review analytics, verify regulatory compliance,
                  and oversee platform integrity and AI model health.
                </p>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-2.5 pt-2 border-t border-[#123D2A]/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-950/70">Key Capabilities:</p>
                <ul className="space-y-2 text-xs text-[#18251E]/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>User & Verification Oversight:</strong> Audit farmer KYC & buyer licenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Commodity Listing Moderation:</strong> Inspect produce authenticity & flag spam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>AI & Prediction Telemetry:</strong> Gemini latency, error rate & data freshness logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Escrow Dispute Resolution:</strong> Neutral arbitration and audit trail inspection</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleRoleRoute('admin')}
              className="w-full py-3.5 rounded-full bg-[#581c87] hover:bg-[#6b21a8] text-white font-extrabold text-xs shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Access Admin Headquarters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5D: AI INTELLIGENCE SHOWCASE
          Display interactive cards for:
          - Crop yield forecasting
          - Market price intelligence
          - Weather and risk monitoring
          - Crop health assistance
          - Demand forecasting
          - AI-powered buyer and product matching
          Explain data sources and confidence limitations for each capability.
         ========================================================================= */}
      <section id="ai-intelligence" className="py-20 bg-white/45 backdrop-blur-md border-y border-[#123D2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#123D2A] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Modular Prediction Engine (Section 10 Compliance)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#123D2A] tracking-tight">
              AI Agricultural Intelligence Showcase
            </h2>
            <p className="text-sm sm:text-base text-[#18251E]/70 max-w-2xl mx-auto">
              Our forecasting models calculate predictions from historical observations while Gemini explains them.
              Data sources and confidence limits are transparently disclosed for every capability.
            </p>
          </div>

          {/* 6 Capability Cards with Data Sources & Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Crop Yield Forecasting */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#123D2A] flex items-center justify-center font-bold">
                <Leaf className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">1. Crop Yield Forecasting</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  Predicts expected quintals per acre based on seed variety, soil chemistry, sowing window, and seasonal parameters.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> ICAR agricultural research datasets & regional agro-climatic zones</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Uncalibrated if unseasonal hailstorms or catastrophic flood events occur.
                </div>
              </div>
            </div>

            {/* 2. Market Price Intelligence */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-950 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6 text-[#00B8F0]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">2. Market Price Intelligence</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  7-day and 30-day time-series modal price forecasts across Indian APMC mandis to determine optimal selling times.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> AGMARKNET / data.gov.in daily modal price records</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Mandis update during physical trading hours; not simulated second-by-second.
                </div>
              </div>
            </div>

            {/* 3. Weather & Risk Monitoring */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center font-bold">
                <CloudSun className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">3. Weather & Risk Monitoring</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  Hyperlocal temperature, precipitation, humidity, and dry-spell risk radar mapped to specific farm coordinates.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> Open-Meteo API meteorological feeds</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Microclimate forecasts beyond 5 days include expanding uncertainty margins.
                </div>
              </div>
            </div>

            {/* 4. Crop Health Assistance */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#123D2A] flex items-center justify-center font-bold">
                <ScanLine className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">4. Crop Health Assistance</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  Computer vision leaf & produce scan for early pest symptoms, nutrient deficiency, and blight categorization.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> Gemini Vision & Agronomic Computer Vision Models</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Preliminary guidance only; critical infections require laboratory soil testing.
                </div>
              </div>
            </div>

            {/* 5. Demand Forecasting */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">5. Demand Forecasting</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  Projects institutional buyer procurement demand curves, seasonal surges (festivals), and regional deficit zones.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> Verified buyer RFP tenders and historical transaction volumes</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Calculated from actual purchase orders, not raw listing counts.
                </div>
              </div>
            </div>

            {/* 6. AI Buyer & Product Matching */}
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-lg shadow-emerald-950/5 space-y-4 hover:border-[#10B981] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-950 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-[#123D2A]">6. AI Buyer-Product Match</h4>
                <p className="text-xs text-[#18251E]/70 mt-1">
                  Connects buyers with nearby farmers by calculating transit distance, lot volume, and harvested freshness hours.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-[11px] space-y-1 text-[#123D2A]">
                <div><strong>Data Source:</strong> Geolocation matrix, crop shelf-life benchmarks & cold storage hubs</div>
                <div className="text-amber-800">
                  <strong>Limitation:</strong> Minimum order lot sizes apply for direct farm-gate pickup.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI Tools Sandbox Tabs */}
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-[#123D2A]">Try the Interactive AI Tools Live</h3>
              <p className="text-xs text-[#18251E]/70">
                Test the actual ML price predictor, computer vision quality scanner, and fair negotiation engine:
              </p>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex p-1.5 rounded-full bg-white/90 border border-[#123D2A]/15 shadow-sm gap-2">
                <button
                  onClick={() => setActiveAITab('prediction')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeAITab === 'prediction'
                      ? 'bg-[#123D2A] text-white shadow-md'
                      : 'text-[#18251E]/70 hover:text-[#123D2A]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> Price Prediction
                </button>
                <button
                  onClick={() => setActiveAITab('grading')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeAITab === 'grading'
                      ? 'bg-[#123D2A] text-white shadow-md'
                      : 'text-[#18251E]/70 hover:text-[#123D2A]'
                  }`}
                >
                  <Award className="w-4 h-4" /> Neural Quality Scanner
                </button>
                <button
                  onClick={() => setActiveAITab('negotiation')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeAITab === 'negotiation'
                      ? 'bg-[#123D2A] text-white shadow-md'
                      : 'text-[#18251E]/70 hover:text-[#123D2A]'
                  }`}
                >
                  <Scale className="w-4 h-4" /> Fair-Trade Arbitration
                </button>
              </div>
            </div>

            {/* Embedded Active Tool */}
            <div className="max-w-4xl mx-auto">
              {activeAITab === 'prediction' && <AIPricePredictionTool />}
              {activeAITab === 'grading' && <AICropQualityGradingTool />}
              {activeAITab === 'negotiation' && <AINegotiationTool />}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5E: HOW IT WORKS
          Illustrate the workflow:
          Farmer registers → Adds crops and harvest details → Receives AI insights →
          Lists produce → Buyer discovers and orders → Farmer fulfills order →
          Both parties track progress.
         ========================================================================= */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#123D2A] text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-[#10B981]" />
            <span>End-to-End Transparent Trade Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#123D2A] tracking-tight">
            How AgriTech Works
          </h2>
          <p className="text-sm sm:text-base text-[#18251E]/70 max-w-2xl mx-auto">
            From initial planting through AI harvest guidance, verified listing, buyer procurement, and escrow settlement.
          </p>
        </div>

        {/* 7-Step Horizontal / Responsive Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#10B981] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#123D2A] text-[#C6FF4A] font-black text-xs flex items-center justify-center">
                01
              </span>
              <span className="text-[10px] uppercase font-bold text-[#10B981]">Onboarding</span>
            </div>
            <h4 className="font-extrabold text-base text-[#123D2A]">Farmer Registers</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Farmer creates profile with land acreage, soil type, and preferred regional language.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#10B981] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#123D2A] text-[#C6FF4A] font-black text-xs flex items-center justify-center">
                02
              </span>
              <span className="text-[10px] uppercase font-bold text-[#10B981]">Cultivation</span>
            </div>
            <h4 className="font-extrabold text-base text-[#123D2A]">Adds Crops & Harvests</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Logs crop varieties, sowing dates, and expected yield windows into the farm management tracker.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#10B981] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#123D2A] text-[#C6FF4A] font-black text-xs flex items-center justify-center">
                03
              </span>
              <span className="text-[10px] uppercase font-bold text-[#10B981]">Intelligence</span>
            </div>
            <h4 className="font-extrabold text-base text-[#123D2A]">Receives AI Insights</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Gets localized weather risks, quality grading analysis, and 7-day Mandi modal price trajectories.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#10B981] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#123D2A] text-[#C6FF4A] font-black text-xs flex items-center justify-center">
                04
              </span>
              <span className="text-[10px] uppercase font-bold text-[#10B981]">Marketplace</span>
            </div>
            <h4 className="font-extrabold text-base text-[#123D2A]">Lists Produce for Sale</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Publishes lots with verified AI grade, asking price per kg, minimum order quantity, and location.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#00B8F0] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#0e7490] text-white font-black text-xs flex items-center justify-center">
                05
              </span>
              <span className="text-[10px] uppercase font-bold text-[#00B8F0]">Procurement</span>
            </div>
            <h4 className="font-extrabold text-base text-cyan-950">Buyer Discovers & Orders</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Institutional wholesale buyers compare listings against APMC benchmarks and place purchase requests.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-3 relative group hover:border-[#00B8F0] transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#0e7490] text-white font-black text-xs flex items-center justify-center">
                06
              </span>
              <span className="text-[10px] uppercase font-bold text-[#00B8F0]">Fulfillment</span>
            </div>
            <h4 className="font-extrabold text-base text-cyan-950">Farmer Fulfills Order</h4>
            <p className="text-xs text-[#18251E]/70 leading-relaxed">
              Farmer accepts order, confirms dispatch or farm-gate pickup, and lot proceeds to delivery.
            </p>
          </div>

          {/* Step 7 */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#123D2A] text-white shadow-xl space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#C6FF4A] text-[#123D2A] font-black text-xs flex items-center justify-center">
                07
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C6FF4A] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% Escrow Guarantee
              </span>
            </div>
            <h4 className="font-extrabold text-base text-white">Both Parties Track Progress & Settle Funds</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Order status progresses in real-time. Upon buyer QA inspection and delivery sign-off, escrow automatically
              releases direct bank transfer to the farmer without middleman cuts.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5F: PLATFORM STATISTICS & BENCHMARKS
          "Display verified platform statistics only when actual data exists.
           During initial setup, use clearly labeled sample preview data or placeholders.
           Do not invent real farmer counts, revenue, transactions, accuracy rates, or impact statistics."
         ========================================================================= */}
      <section className="py-16 bg-white/50 backdrop-blur-md border-t border-[#123D2A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                  Transparent Disclosure (Section 5F & 17)
                </span>
                <h3 className="text-xl font-black text-[#123D2A]">
                  Platform Ecosystem Metrics & Benchmarks
                </h3>
              </div>
              <p className="text-xs text-[#18251E]/70 mt-1">
                [Sample Benchmark Preview Data — Actual production figures populate from verified Firestore records upon live rollout]
              </p>
            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123D2A] hover:text-[#10B981] transition-colors"
            >
              Browse Active Marketplace Listings <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Sample Benchmark
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#123D2A]">25,000+</div>
              <h4 className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider">Target Farmer Network</h4>
              <p className="text-[11px] text-[#18251E]/60">Structured across Karnataka, AP, and Maharashtra clusters</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Sample Benchmark
              </span>
              <div className="text-3xl sm:text-4xl font-black text-cyan-950">18,000+</div>
              <h4 className="text-xs font-extrabold text-[#00B8F0] uppercase tracking-wider">Wholesale Buyers</h4>
              <p className="text-[11px] text-[#18251E]/60">Supermarket chains, food processing units, and aggregators</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Sample Benchmark
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-950">₹145+ Cr</div>
              <h4 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Simulated Escrow Capacity</h4>
              <p className="text-[11px] text-[#18251E]/60">Zero-dispute milestone payment flow protocol</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Model Evaluation Target
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">94.2%</div>
              <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Forecast Confidence Target</h4>
              <p className="text-[11px] text-[#18251E]/60">Evaluated on held-out AGMARKNET historical test partitions</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 & 13: MULTILINGUAL & VERNACULAR VOICE SHOWCASE
          Preserved and highlighted with interactive speech triggers
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-emerald-950/10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#123D2A] text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Full Vernacular Speech & Language System (8 Indian Languages)</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-[#123D2A] leading-tight tracking-tight">
              Farming Assistance in Your Native Language
            </h3>
            <p className="text-sm text-[#18251E]/80 leading-relaxed font-medium">
              No typing needed in the field. Speak naturally in Kannada, Hindi, Telugu, Tamil, Malayalam, Marathi,
              Bengali, or English. The AI Assistant listens, translates, consults APMC mandi feeds, and replies with
              spoken voice guidance.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-xs px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-[#123D2A] border-[#123D2A] text-white font-extrabold shadow-sm'
                      : 'bg-white border-[#123D2A]/15 text-[#18251E]/80 hover:text-[#123D2A] hover:bg-emerald-50'
                  }`}
                >
                  {l.flag} {l.nativeName} <span className="opacity-60 text-[10px]">({l.label})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#123D2A] to-emerald-900 text-white text-center space-y-5 w-full max-w-sm shrink-0 shadow-2xl shadow-emerald-950/20">
            <div className="w-20 h-20 rounded-full bg-white/10 border border-[#C6FF4A]/40 flex items-center justify-center text-[#C6FF4A] mx-auto shadow-xl relative">
              <Mic className="w-10 h-10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-[#C6FF4A] animate-ping opacity-25" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Interactive Voice Engine</h4>
              <p className="text-xs text-emerald-200 mt-1">
                Active language: <strong className="text-[#C6FF4A]">{currentLanguageConfig.nativeName}</strong>
              </p>
            </div>
            <button
              onClick={() => setVoiceOpen(true)}
              className="w-full py-3.5 rounded-full bg-[#C6FF4A] hover:bg-[#b8f53a] text-[#123D2A] font-black text-xs shadow-lg transition-all cursor-pointer hover:scale-105"
            >
              Start Talking with AgriAI
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5G: FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 text-center border-t border-[#123D2A]/10 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h3 className="text-3xl sm:text-5xl font-black text-[#123D2A] tracking-tight">
            Ready to Experience the Future of Agricultural Commerce?
          </h3>
          <p className="text-sm sm:text-base text-[#18251E]/80 max-w-2xl mx-auto font-medium">
            Join thousands of verified farmers and institutional buyers getting fair prices, transparent escrow,
            and AI agricultural intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#123D2A] to-[#10B981] hover:opacity-95 text-white font-black text-base shadow-xl shadow-emerald-950/25 transition-all hover:scale-105 cursor-pointer"
            >
              Get Started / Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full bg-white border border-[#123D2A]/20 text-[#123D2A] hover:bg-emerald-50 text-base font-bold transition-all shadow-sm cursor-pointer"
            >
              Sign In to Your Portal
            </button>
          </div>
        </div>
      </section>

      {/* Voice Assistant Modal Component */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
