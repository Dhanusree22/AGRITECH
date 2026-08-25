import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Sparkles, Check, ArrowRight, ShieldCheck, DollarSign, Users, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AINegotiationTool: React.FC = () => {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState('Tomato (Hybrid)');
  const [quantityKg, setQuantityKg] = useState(2500);
  const [farmerAskPrice, setFarmerAskPrice] = useState(34);
  const [buyerOfferPrice, setBuyerOfferPrice] = useState(29);
  const [mandiModalPrice] = useState(31.5);
  const [isArbitrating, setIsArbitrating] = useState(false);

  const [dealResult, setDealResult] = useState<{
    suggestedPrice: number;
    fairnessScore: number;
    farmerProfitGain: number;
    buyerSavingsPercent: number;
    arbitrationRationale: string;
    suggestedTerms: string[];
    winWinMetrics: { farmerTotal: number; buyerTotal: number; platformEscrowFee: number };
  }>({
    suggestedPrice: 32.2,
    fairnessScore: 97,
    farmerProfitGain: 3000,
    buyerSavingsPercent: 5.3,
    arbitrationRationale:
      'Mediated balance aligns +₹0.70/kg above Mandi modal rate, rewarding Grade-A verified purity while preserving buyer wholesale bulk transport margin.',
    suggestedTerms: [
      '50% Advance Escrow locked upon order placement',
      'Farmer delivers within 36 hours in sanitized ventilated crates',
      'Remaining 50% released immediately upon delivery QA verification',
    ],
    winWinMetrics: {
      farmerTotal: 80500,
      buyerTotal: 80500,
      platformEscrowFee: 805,
    },
  });

  const handleArbitrate = async () => {
    setIsArbitrating(true);
    try {
      const res = await fetch('/api/gemini/negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          farmerAskPrice,
          buyerOfferPrice,
          mandiBenchmark: mandiModalPrice,
          quantityKg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const fairPrice = data.suggestedFairPrice || ((farmerAskPrice + buyerOfferPrice) / 2);
        const total = fairPrice * quantityKg;
        setDealResult({
          suggestedPrice: Number(fairPrice.toFixed(2)),
          fairnessScore: data.fairnessScore || 96,
          farmerProfitGain: Math.round((fairPrice - buyerOfferPrice) * quantityKg),
          buyerSavingsPercent: Number((((farmerAskPrice - fairPrice) / farmerAskPrice) * 100).toFixed(1)),
          arbitrationRationale: data.arbitrationRationale || 'Equitable clearing rate matching current wholesale arrival pressure.',
          suggestedTerms: data.suggestedTerms || [
            'Direct farm gate pickup by buyer fleet',
            'Immediate UPI / Bank Escrow settlement',
          ],
          winWinMetrics: {
            farmerTotal: total,
            buyerTotal: total,
            platformEscrowFee: Math.round(total * 0.01),
          },
        });
      }
    } catch (e) {
      console.warn('Negotiation arbitration fallback:', e);
    } finally {
      setIsArbitrating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#064e3b15] shadow-xl shadow-[#064e3b08] p-6 text-[#064e3b] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#064e3b10]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
            <Scale className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#064e3b]">AI Fair-Trade Negotiation & Arbitration Assistant</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-bold">
                Win-Win Algorithm
              </span>
            </div>
            <p className="text-xs text-[#064e3b70]">Instant algorithmic compromise based on live APMC rates, transport cost & crop shelf life</p>
          </div>
        </div>

        <button
          onClick={handleArbitrate}
          disabled={isArbitrating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isArbitrating ? 'animate-spin' : ''}`} />
          {isArbitrating ? 'Arbitrating Deal...' : 'Run AI Deal Settlement'}
        </button>
      </div>

      {/* Input Price Comparison Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#064e3b80] mb-1.5">Crop Commodity</label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#064e3b20] text-[#064e3b] text-xs shadow-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#064e3b80] mb-1.5">Quantity (kg)</label>
          <input
            type="number"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#064e3b20] text-[#064e3b] text-xs shadow-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#064e3b] mb-1.5">🌾 Farmer Asking Price (₹/kg)</label>
          <input
            type="number"
            value={farmerAskPrice}
            onChange={(e) => setFarmerAskPrice(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[#064e3b] font-bold text-xs shadow-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyan-800 mb-1.5">🛒 Buyer Offer Price (₹/kg)</label>
          <input
            type="number"
            value={buyerOfferPrice}
            onChange={(e) => setBuyerOfferPrice(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 font-bold text-xs shadow-xs focus:outline-none focus:border-cyan-600"
          />
        </div>
      </div>

      {/* Arbitration Outcome Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggested Fair Price Card */}
        <div className="bg-emerald-50/40 rounded-3xl border border-[#064e3b15] p-5 space-y-4 shadow-xs">
          <span className="text-xs text-[#064e3b70] uppercase tracking-wider font-semibold">AI Arbitrated Fair Price</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#064e3b]">₹{dealResult.suggestedPrice}</span>
            <span className="text-xs text-[#064e3b70] font-medium">/ kg</span>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#064e3b15] text-xs">
            <div className="flex justify-between text-[#064e3b80]">
              <span>Total Contract Value:</span>
              <span className="font-bold text-[#064e3b]">₹{dealResult.winWinMetrics.farmerTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#064e3b80]">
              <span>Farmer Margin Gain:</span>
              <span className="font-bold text-emerald-800">+₹{dealResult.farmerProfitGain.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#064e3b80]">
              <span>Buyer Discount vs Ask:</span>
              <span className="font-bold text-cyan-800">{dealResult.buyerSavingsPercent}% Savings</span>
            </div>
            <div className="flex justify-between text-[#064e3b70] text-[11px]">
              <span>Escrow Protection Fee (1%):</span>
              <span>₹{dealResult.winWinMetrics.platformEscrowFee}</span>
            </div>
          </div>
        </div>

        {/* AI Rationale & Logic */}
        <div className="lg:col-span-2 bg-emerald-50/40 rounded-3xl border border-[#064e3b15] p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Mediation Rationale & Suggested Contract Clauses
            </h4>
            <p className="text-xs text-[#064e3b] leading-relaxed bg-white p-3.5 rounded-2xl border border-[#064e3b15] shadow-xs">
              "{dealResult.arbitrationRationale}"
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#064e3b70] uppercase tracking-wider block">Recommended Settlement Clauses:</span>
            {dealResult.suggestedTerms.map((term, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#064e3b]">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{term}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
