import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { Farm3DScene } from '../components/3d/Farm3DScene';
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

  return (
    <div className="min-h-screen text-[#064e3b] selection:bg-emerald-200 selection:text-[#064e3b]">
      {/* 1. HERO SECTION WITH 3D AGRICULTURAL SCENE */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="space-y-6 text-center max-w-3xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b98115] border border-[#10b98130] text-[#059669] text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation 3D & Multilingual AI Agricultural Commerce</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#064e3b] leading-tight"
          >
            {t('heroTitle', 'Empowering Indian Agriculture with 3D AI & Direct Fair Trade')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#064e3b85] max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'heroSubtitle',
              'Eliminate middlemen. Connect directly with institutional buyers, predict APMC Mandi prices with 94% accuracy, grade harvest quality via neural vision, and settle trades via secured escrow.'
            )}
          </motion.p>

          {/* Quick Action Role Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={() => {
                switchRole('farmer');
                navigate('/farmer/dashboard');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-sm shadow-xl shadow-[#064e3b25] transition-all hover:scale-105 cursor-pointer"
            >
              <Tractor className="w-5 h-5" />
              <span>{t('farmerPortal', 'Enter Farmer Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                switchRole('buyer');
                navigate('/buyer/dashboard');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-bold text-sm shadow-xl shadow-cyan-900/20 transition-all hover:scale-105 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t('buyerPortal', 'Enter Buyer Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-[#064e3b20] hover:border-emerald-500 text-[#064e3b] font-bold text-sm shadow-xs hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{t('voiceAssistant', 'Voice Assistant (8 Languages)')}</span>
            </button>
          </motion.div>
        </div>

        {/* 3D Farm Visual Experience */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <Farm3DScene />
        </motion.div>
      </section>

      {/* 2. LIVE APMC MANDI PRICE TICKER MATRIX */}
      <section className="py-12 bg-white/60 backdrop-blur-sm border-y border-[#064e3b10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xl font-extrabold text-[#064e3b]">Live APMC Mandi Price Intelligence</h3>
              </div>
              <p className="text-xs text-[#064e3b70]">Real-time daily modal rates & AI 7-day predictive trajectory across Indian agricultural hubs</p>
            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064e3b] hover:text-emerald-700 transition-colors"
            >
              View Full Commodity Exchange <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mandiPrices.slice(0, 6).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="p-4 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b08] hover:border-emerald-500/40 transition-all text-[#064e3b] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#064e3b]">{item.crop}</h4>
                    <span className="text-[11px] text-[#064e3b70]">{item.mandi}</span>
                  </div>
                  <span
                    className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.trend === 'up' ? 'bg-emerald-100 text-[#064e3b]' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : null}
                    {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-[#064e3b10]">
                  <div>
                    <span className="text-2xl font-extrabold text-[#064e3b]">₹{item.pricePerKg}</span>
                    <span className="text-xs text-[#064e3b70]"> / kg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#064e3b70] block">7-Day AI Target</span>
                    <span className="text-xs font-bold text-emerald-800">₹{item.ai7DayForecastPerKg}/kg ({item.confidence}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#064e3b70] bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <span>Daily Arrival: {item.arrivalTons} Tons</span>
                  <span>Range: ₹{(item.minPrice / 100).toFixed(0)} - ₹{(item.maxPrice / 100).toFixed(0)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE AI INTELLIGENCE SUITE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#064e3b] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Super-Engine Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064e3b]">
            Transforming Farming with Machine Learning
          </h2>
          <p className="text-xs sm:text-sm text-[#064e3b70]">
            Interactive AI tools for price prediction, harvest computer vision scanning, and fair-trade negotiation
          </p>
        </div>

        {/* AI Tab Selector */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#064e3b15] shadow-sm gap-2">
            <button
              onClick={() => setActiveAITab('prediction')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeAITab === 'prediction'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'text-[#064e3b80] hover:text-[#064e3b]'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Price Prediction
            </button>
            <button
              onClick={() => setActiveAITab('grading')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeAITab === 'grading'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'text-[#064e3b80] hover:text-[#064e3b]'
              }`}
            >
              <Award className="w-4 h-4" /> Neural Quality Scanner
            </button>
            <button
              onClick={() => setActiveAITab('negotiation')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeAITab === 'negotiation'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'text-[#064e3b80] hover:text-[#064e3b]'
              }`}
            >
              <Scale className="w-4 h-4" /> Fair-Trade Arbitration
            </button>
          </div>
        </div>

        {/* Active AI Tool Component */}
        <div>
          {activeAITab === 'prediction' && <AIPricePredictionTool />}
          {activeAITab === 'grading' && <AICropQualityGradingTool />}
          {activeAITab === 'negotiation' && <AINegotiationTool />}
        </div>
      </section>

      {/* 4. ECOSYSTEM IMPACT STATISTICS BENTO GRID */}
      <section className="py-16 bg-white/60 border-t border-[#064e3b10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b]">Verified Impact Across Indian Agriculture</h3>
            <p className="text-xs sm:text-sm text-[#064e3b70]">Transforming agricultural trading with transparency and guaranteed farmer settlements</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b08] space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-[#064e3b] flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">25,400+</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Verified Farmers</h4>
              <p className="text-[11px] text-[#064e3b70]">Active across 140+ agricultural clusters and APMC zones</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b08] space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-800 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">18,200+</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800">Wholesale Buyers</h4>
              <p className="text-[11px] text-[#064e3b70]">Supermarket retail chains, food processors & export houses</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b08] space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">₹145+ Cr</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Escrow Volume</h4>
              <p className="text-[11px] text-[#064e3b70]">100% dispute-free digital settlement guarantee</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b08] space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">+18.4%</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800">Farmer Net Realization</h4>
              <p className="text-[11px] text-[#064e3b70]">Higher earnings by eliminating unauthorized middlemen cuts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MULTILINGUAL VOICE INITIATIVE SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#064e3b15] shadow-xl shadow-[#064e3b0a] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#064e3b] text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Full Vernacular Speech Support</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#064e3b] leading-tight">
              Designed for Every Indian Farmer in Their Native Language
            </h3>
            <p className="text-xs sm:text-sm text-[#064e3b75] leading-relaxed">
              No typing needed in the field. Speak naturally in Kannada, Hindi, Telugu, Tamil, Malayalam, Marathi, Bengali, or English to list produce, query prices, and negotiate with buyers.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                    language === l.code
                      ? 'bg-emerald-100 border-emerald-300 text-[#064e3b] font-bold'
                      : 'bg-white border-gray-200 text-[#064e3b80] hover:text-[#064e3b]'
                  }`}
                >
                  {l.flag} {l.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4 w-full max-w-sm shrink-0 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#064e3b] flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-900/20 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#064e3b]">Interactive Voice Engine</h4>
              <p className="text-xs text-[#064e3b70] mt-1">Active language: <span className="text-[#064e3b] font-bold">{currentLanguageConfig.nativeName}</span></p>
            </div>
            <button
              onClick={() => setVoiceOpen(true)}
              className="w-full py-3 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              Start Talking with AgriAI
            </button>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-16 text-center border-t border-[#064e3b10] bg-white/40">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#064e3b]">
            Ready to Experience the Future of Agricultural Commerce?
          </h3>
          <p className="text-xs sm:text-sm text-[#064e3b70] max-w-xl mx-auto">
            Join thousands of verified farmers and institutional buyers getting fair prices, transparent escrow, and AI intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-sm shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
            >
              Create Free Account / Login
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3.5 rounded-full bg-white border border-[#064e3b20] text-[#064e3b] hover:bg-emerald-50 text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              Browse Active Marketplace
            </button>
          </div>
        </div>
      </section>

      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
