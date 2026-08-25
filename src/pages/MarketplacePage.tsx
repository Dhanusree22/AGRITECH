import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CropListing } from '../types';

export const MarketplacePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { crops } = useStore();
  const { switchRole } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'demand'>('demand');

  const filteredCrops = crops
    .filter((crop) => {
      const matchesSearch =
        crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || crop.category === selectedCategory;
      const matchesGrd = selectedGrade === 'All' || crop.grade === selectedGrade;
      const matchesOrg = !onlyOrganic || crop.organicCertified;
      return matchesSearch && matchesCat && matchesGrd && matchesOrg;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.currentPrice - b.currentPrice;
      if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice;
      if (sortBy === 'rating') return b.farmerRating - a.farmerRating;
      return b.aiDemandIndex - a.aiDemandIndex;
    });

  return (
    <div className="min-h-screen text-[#064e3b] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#064e3b] text-xs font-bold">
          <Package className="w-3.5 h-3.5" />
          <span>Real-Time Indian Agricultural Exchange</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#064e3b] tracking-tight">Direct Farm Produce Marketplace</h1>
        <p className="text-xs sm:text-sm text-[#064e3b70]">
          Source farm-fresh vegetables, fruits, grains, and cash crops directly from verified Indian farmers with verified quality scores.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop, hybrid variety, farmer name, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none placeholder:text-[#064e3b50]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains & Cereals">Grains & Cereals</option>
            <option value="Cash Crops">Cash Crops</option>
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
          >
            <option value="All">All Quality Grades</option>
            <option value="Grade A">Grade A (Score 90+)</option>
            <option value="Grade B">Grade B</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-[#064e3b] focus:outline-none"
          >
            <option value="demand">AI Demand Rank</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Farmer Rating</option>
          </select>

          <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="rounded text-[#064e3b]"
            />
            Organic Certified
          </label>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <motion.div
            key={crop.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-[#064e3b15] hover:border-emerald-500/50 p-5 space-y-4 transition-all shadow-xl shadow-[#064e3b08] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
                <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#064e3b] text-white text-xs font-bold shadow-md">
                  {crop.grade} ({crop.qualityScore}/100)
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                  ★ {crop.farmerRating}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{crop.category}</span>
                <h4 className="font-bold text-base text-[#064e3b]">{crop.cropName}</h4>
                <p className="text-xs text-[#064e3b70]">{crop.variety}</p>
              </div>

              <p className="text-xs text-[#064e3b80] line-clamp-2 leading-relaxed">{crop.description}</p>

              <div className="p-3 bg-emerald-50/40 rounded-2xl border border-[#064e3b10] space-y-1 text-xs text-[#064e3b]">
                <div className="flex justify-between">
                  <span className="text-[#064e3b70]">Farmer:</span>
                  <span className="font-bold text-[#064e3b]">{crop.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#064e3b70]">Farm Gate:</span>
                  <span className="text-[#064e3b]">{crop.farmerLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#064e3b70]">APMC Mandi Rate:</span>
                  <span className="text-emerald-700 font-semibold">₹{crop.mandiBenchmarkPrice}/kg</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#064e3b10]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-[#064e3b]">₹{crop.currentPrice}</span>
                  <span className="text-xs text-[#064e3b70]"> / kg</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#064e3b]">{crop.availableQuantityKg.toLocaleString()} kg</span>
                  <span className="text-[10px] text-[#064e3b70] block">Min MOQ: {crop.minOrderQuantityKg} kg</span>
                </div>
              </div>

              <button
                onClick={() => {
                  switchRole('buyer');
                  navigate('/buyer/dashboard');
                }}
                className="w-full py-3 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Procure Directly (Escrow Protected)</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
