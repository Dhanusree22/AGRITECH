import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Package,
  Search,
  Filter,
  Plus,
  TrendingDown,
  Users,
  Scale,
  Truck,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  Mic,
  DollarSign,
  Building,
  Star,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { AINegotiationTool } from '../../components/ai/AINegotiationTool';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { CropListing } from '../../types';

export const BuyerDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const {
    crops,
    orders,
    createOrder,
    buyerRequirements,
    createBuyerRequirement,
    reverseBids,
    groupBuyingPools,
    joinGroupBuyingPool,
    logisticsVehicles,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  // Order Placement Modal State
  const [selectedCropForOrder, setSelectedCropForOrder] = useState<CropListing | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState(1000);
  const [deliveryAddress, setDeliveryAddress] = useState(
    'GreenMart Central Cold Hub, Hosur Road, Bengaluru 560068'
  );

  // Post Requirement Modal State
  const [showPostReqModal, setShowPostReqModal] = useState(false);
  const [reqCrop, setReqCrop] = useState('Tomato (Hybrid)');
  const [reqQty, setReqQty] = useState(5000);
  const [reqMaxPrice, setReqMaxPrice] = useState(31);
  const [reqUrgency, setReqUrgency] = useState('Within 7 days');
  const [reqLocation, setReqLocation] = useState('Bengaluru APMC Zone');

  // Compare Crops State
  const [compareList, setCompareList] = useState<CropListing[]>([]);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Metrics
  const myOrders = (orders || []).filter((o) => o.buyerId === user?.id || true);
  const totalVolumeProcuredKg = myOrders.reduce((acc, o) => acc + (o.quantityKg || 0), 0);
  const totalSpend = myOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const activeEscrowAmount = myOrders.filter((o) => o.paymentStatus === 'Escrow Secured').reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // Filtered Marketplace Crops
  const filteredCrops = (crops || []).filter((crop) => {
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || crop.grade === selectedGrade;
    const matchesOrganic = !onlyOrganic || crop.organicCertified;
    return matchesSearch && matchesCategory && matchesGrade && matchesOrganic && crop.status === 'Approved';
  });

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropForOrder) return;
    const agreedPrice = selectedCropForOrder.currentPrice;
    const total = agreedPrice * orderQuantityKg;

    createOrder({
      cropId: selectedCropForOrder.id,
      cropName: selectedCropForOrder.cropName,
      cropCategory: selectedCropForOrder.category,
      cropImage: selectedCropForOrder.images[0],
      farmerId: selectedCropForOrder.farmerId,
      farmerName: selectedCropForOrder.farmerName,
      farmerPhone: selectedCropForOrder.farmerPhone,
      buyerId: user?.id || 'usr-buyer-01',
      buyerName: user?.name || 'Priya Sundaram',
      buyerBusiness: user?.businessName || 'GreenMart Wholesale',
      buyerPhone: user?.phone || '+91 99001 88765',
      quantityKg: orderQuantityKg,
      agreedPricePerKg: agreedPrice,
      totalAmount: total,
      platformFee: Math.round(total * 0.01),
      taxAmount: 0,
      status: 'Confirmed',
      paymentStatus: 'Escrow Secured',
      deliveryAddress,
      pickupAddress: selectedCropForOrder.farmerLocation,
      estimatedDelivery: '2026-08-27',
      trackingNumber: `TRK-KA-${Math.floor(Math.random() * 8999 + 1000)}`,
    });

    setSelectedCropForOrder(null);
    setActiveTab('orders');
  };

  const handlePostReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBuyerRequirement({
      buyerId: user?.id || 'usr-buyer-01',
      buyerName: user?.name || 'Priya Sundaram',
      businessName: user?.businessName || 'GreenMart Wholesale',
      cropName: reqCrop,
      requiredQuantityKg: Number(reqQty),
      targetPricePerKg: Number(reqMaxPrice),
      deliveryLocation: reqLocation,
      urgency: reqUrgency,
      qualityRequired: 'Grade A',
    });
    setShowPostReqModal(false);
    setActiveTab('reverse-bidding');
  };

  const toggleCompare = (crop: CropListing) => {
    if (compareList.find((c) => c.id === crop.id)) {
      setCompareList((prev) => prev.filter((c) => c.id !== crop.id));
    } else {
      if (compareList.length < 3) {
        setCompareList((prev) => [...prev, crop]);
      }
    }
  };

  const buyerTabs = [
    { id: 'overview', label: '🛒 Buyer Command', icon: ShoppingBag },
    { id: 'marketplace', label: '🌾 Direct Crop Sourcing', icon: Package },
    { id: 'group-buying', label: '🤝 Group Buying Pools', icon: Users },
    { id: 'reverse-bidding', label: '🎯 Reverse Bidding Portal', icon: Scale },
    { id: 'comparison', label: '⚖️ Crop Comparison Matrix', icon: Layers },
    { id: 'orders', label: '📜 Orders & Escrow Tracking', icon: ShieldCheck },
    { id: 'logistics', label: '🚚 Fleet & Cold Chain', icon: Truck },
  ];

  return (
    <div className="min-h-screen text-[#064e3b] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Buyer Profile Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-xl shadow-[#064e3b08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt="Buyer profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-600/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#064e3b]">{user?.name || 'Priya Sundaram'}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 font-bold border border-cyan-300">
                Institutional Buyer ★ {user?.rating || 4.8}
              </span>
            </div>
            <p className="text-xs text-[#064e3b80]">
              {user?.businessName || 'GreenMart Wholesale & Retail Chain'} • Monthly Volume: {user?.monthlyVolumeTons || 120} Tons
            </p>
            <p className="text-[11px] text-cyan-700 font-semibold mt-0.5">Credit Rating: AAA (840) • GSTIN & APMC Trade License Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceOpen(true)}
            className="px-4 py-2.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold hover:bg-cyan-100 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-cyan-700" />
            <span>Voice Search</span>
          </button>

          <button
            onClick={() => setShowPostReqModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bulk Requirement</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {buyerTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#064e3b] text-white shadow-md border border-[#064e3b]'
                  : 'bg-white/80 border border-[#064e3b15] text-[#064e3b80] hover:text-[#064e3b] hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. BUYER OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Total Procured Volume</span>
                <Package className="w-4 h-4 text-cyan-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#064e3b]">{(totalVolumeProcuredKg / 1000).toFixed(1)}</span>
                <span className="text-xs text-[#064e3b70]">Metric Tons</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">Average savings vs Mandi: 14.8%</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Active Escrow Protected</span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-800">₹{activeEscrowAmount.toLocaleString()}</span>
                <span className="text-xs text-emerald-700 font-bold">Protected</span>
              </div>
              <p className="text-[10px] text-[#064e3b70]">Locked until QA sign-off</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Cumulative Spend</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-900">₹{totalSpend.toLocaleString()}</span>
                <span className="text-xs text-[#064e3b70]">FY 2026</span>
              </div>
              <p className="text-[10px] text-[#064e3b70]">{myOrders.length} verified trade contracts</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Active Group Pools</span>
                <Users className="w-4 h-4 text-purple-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-900">{groupBuyingPools.length}</span>
                <span className="text-xs text-purple-700 font-semibold">Bulk Pools</span>
              </div>
              <p className="text-[10px] text-[#064e3b70]">Up to 16.7% bulk discounts</p>
            </div>
          </div>

          {/* AI Recommended Direct Farmer Listings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" /> Top AI Verified Harvest Batches for Direct Procurement
              </h3>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="text-xs text-emerald-700 hover:text-[#064e3b] font-semibold flex items-center gap-1 cursor-pointer"
              >
                Browse Full Catalog ({crops.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crops.slice(0, 3).map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-[#064e3b15] hover:border-emerald-500/40 p-4 space-y-3 transition-all shadow-md shadow-[#064e3b05]"
                >
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#064e3b] text-white text-[10px] font-bold">
                      {crop.grade} ({crop.qualityScore}/100)
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 border border-emerald-300 text-emerald-900 text-[10px] font-bold">
                      ★ {crop.farmerRating}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#064e3b]">{crop.cropName}</h4>
                    <p className="text-xs text-[#064e3b70]">Farmer: {crop.farmerName} • {crop.farmerLocation}</p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#064e3b10]">
                    <div>
                      <span className="text-xl font-black text-[#064e3b]">₹{crop.currentPrice}</span>
                      <span className="text-xs text-[#064e3b70]"> / kg</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#064e3b]">{crop.availableQuantityKg.toLocaleString()} kg</span>
                      <span className="text-[10px] text-[#064e3b70] block">Available</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCropForOrder(crop);
                      setOrderQuantityKg(Math.min(2000, crop.availableQuantityKg));
                    }}
                    className="w-full py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Procure with Escrow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DIRECT CROP SOURCING MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05] space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#064e3b60] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crop produce, variety, farmer or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b] focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
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
                className="px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
              >
                <option value="All">All Quality Grades</option>
                <option value="Grade A">Grade A Only (Score 90+)</option>
                <option value="Grade B">Grade B</option>
              </select>

              <label className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b80] cursor-pointer">
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

          {/* Crop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => {
              const isCompared = !!compareList.find((c) => c.id === crop.id);
              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-[#064e3b15] hover:border-emerald-500/50 p-5 space-y-4 transition-all shadow-lg shadow-[#064e3b05] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
                      <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#064e3b] text-white text-xs font-bold shadow-md">
                        {crop.grade} ({crop.qualityScore}/100)
                      </span>
                      {crop.organicCertified && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-teal-100 border border-teal-300 text-teal-900 text-[10px] font-bold">
                          Organic
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{crop.category}</span>
                      <h4 className="font-bold text-base text-[#064e3b]">{crop.cropName}</h4>
                      <p className="text-xs text-[#064e3b70]">{crop.variety}</p>
                    </div>

                    <p className="text-xs text-[#064e3b80] line-clamp-2 leading-relaxed">{crop.description}</p>

                    <div className="p-3 bg-[#f1f5f2]/70 rounded-2xl border border-[#064e3b10] space-y-1.5 text-xs text-[#064e3b]">
                      <div className="flex justify-between">
                        <span>Farmer:</span>
                        <span className="font-bold text-[#064e3b] flex items-center gap-1">
                          {crop.farmerName} <span className="text-amber-700 text-[10px]">★{crop.farmerRating}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Farm Location:</span>
                        <span className="font-semibold text-[#064e3b80]">{crop.farmerLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mandi Benchmark:</span>
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

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => toggleCompare(crop)}
                        className={`py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isCompared
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white border-[#064e3b20] text-[#064e3b80] hover:text-[#064e3b]'
                        }`}
                      >
                        {isCompared ? '✓ Added' : '⚖️ Compare'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCropForOrder(crop);
                          setOrderQuantityKg(Math.min(1000, crop.availableQuantityKg));
                        }}
                        className="py-2 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Buy Directly
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GROUP BUYING BULK POOLS */}
      {activeTab === 'group-buying' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Group Buying Wholesale Pools</h3>
            <p className="text-xs text-[#064e3b70]">Join other buyers to reach bulk volume thresholds and unlock 15% - 20% direct farm gate discounts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupBuyingPools.map((pool) => {
              const progressPct = Math.round((pool.currentQuantityKg / pool.targetQuantityKg) * 100);
              return (
                <div key={pool.id} className="p-6 rounded-3xl bg-white border border-[#064e3b15] space-y-4 shadow-xl shadow-[#064e3b05]">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={pool.image} alt={pool.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-700 text-white text-xs font-bold shadow-md">
                      {pool.discountPercent}% Discount
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-[#064e3b] text-xs font-bold border border-[#064e3b15]">
                      {pool.membersCount} Buyers Joined
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-[#064e3b]">{pool.cropName}</h4>
                    <p className="text-xs text-[#064e3b70]">{pool.originLocation} • {pool.farmerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-[#f1f5f2]/70 p-3 rounded-2xl border border-[#064e3b10] text-xs">
                    <div>
                      <span className="text-[10px] text-[#064e3b70] block">Base Price</span>
                      <span className="text-[#064e3b60] line-through">₹{pool.basePricePerKg}/kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-700 block font-bold">Group Pool Rate</span>
                      <span className="text-base font-extrabold text-purple-900">₹{pool.discountedPricePerKg}/kg</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#064e3b80]">Target Progress: {progressPct}%</span>
                      <span className="text-purple-800 font-bold">{pool.currentQuantityKg.toLocaleString()} / {pool.targetQuantityKg.toLocaleString()} kg</span>
                    </div>
                    <div className="w-full bg-[#f1f5f2] rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-emerald-600 h-2 rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => joinGroupBuyingPool(pool.id, 1000)}
                    className="w-full py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Join Pool (+1,000 kg)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. REVERSE BIDDING PORTAL */}
      {activeTab === 'reverse-bidding' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Reverse Bidding Procurement Center</h3>
              <p className="text-xs text-[#064e3b70]">Review customized farmer proposals submitted for your bulk trade requirements</p>
            </div>
            <button
              onClick={() => setShowPostReqModal(true)}
              className="px-4 py-2 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Post New Procurement Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyerRequirements.map((req) => (
              <div key={req.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] space-y-3 shadow-md shadow-[#064e3b05]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#064e3b]">{req.cropName}</h4>
                    <span className="text-xs text-[#064e3b70]">Target: {req.requiredQuantityKg.toLocaleString()} kg at max ₹{req.targetPricePerKg}/kg</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-950 text-xs font-bold">
                    {req.offersReceived} Farmer Bids
                  </span>
                </div>

                <div className="text-xs text-[#064e3b70]">
                  <span>📍 Destination: {req.deliveryLocation} • Urgency: {req.urgency}</span>
                </div>

                {/* Sub-bids received */}
                <div className="space-y-2 pt-2 border-t border-[#064e3b10]">
                  <span className="text-[11px] font-bold text-[#064e3b] uppercase block">Incoming Farmer Proposals:</span>
                  {reverseBids
                    .filter((b) => b.requirementId === req.id || true)
                    .slice(0, 2)
                    .map((bid) => (
                      <div key={bid.id} className="p-3 bg-[#f1f5f2]/70 rounded-2xl border border-[#064e3b10] flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#064e3b]">{bid.farmerName} ({bid.farmerLocation})</div>
                          <span className="text-[#064e3b70]">Offered {bid.farmerOfferedQtyKg.toLocaleString()} kg at ₹{bid.farmerBidPrice}/kg</span>
                        </div>
                        <button
                          onClick={() => {
                            createOrder({
                              cropId: 'crop-01',
                              cropName: bid.cropName,
                              cropCategory: 'Vegetables',
                              cropImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80',
                              farmerId: bid.farmerId,
                              farmerName: bid.farmerName,
                              farmerPhone: '+91 98450 12345',
                              buyerId: user?.id || 'usr-buyer-01',
                              buyerName: user?.name || 'Priya Sundaram',
                              buyerBusiness: user?.businessName || 'GreenMart Wholesale',
                              buyerPhone: user?.phone || '+91 99001 88765',
                              quantityKg: bid.farmerOfferedQtyKg,
                              agreedPricePerKg: bid.farmerBidPrice,
                              totalAmount: bid.farmerBidPrice * bid.farmerOfferedQtyKg,
                              platformFee: Math.round(bid.farmerBidPrice * bid.farmerOfferedQtyKg * 0.01),
                              taxAmount: 0,
                              status: 'Confirmed',
                              paymentStatus: 'Escrow Secured',
                              deliveryAddress: req.deliveryLocation,
                              pickupAddress: bid.farmerLocation,
                              estimatedDelivery: '2026-08-28',
                              trackingNumber: `TRK-KA-${Math.floor(Math.random() * 8999 + 1000)}`,
                            });
                            setActiveTab('orders');
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-[11px] cursor-pointer"
                        >
                          Accept Bid
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CROP COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Side-by-Side Crop Quality & Pricing Matrix</h3>
            <p className="text-xs text-[#064e3b70]">Select up to 3 produce batches from the marketplace to compare morphological attributes</p>
          </div>

          {compareList.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#064e3b15] text-center space-y-3 shadow-md shadow-[#064e3b05]">
              <Layers className="w-12 h-12 text-[#064e3b40] mx-auto" />
              <h4 className="text-base font-bold text-[#064e3b]">No Produce Selected for Comparison</h4>
              <p className="text-xs text-[#064e3b70]">Go to the Direct Crop Sourcing tab and click "⚖️ Compare" on any listing.</p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2 rounded-full bg-[#064e3b] text-white text-xs font-bold cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-[#064e3b15] bg-white p-4 shadow-md shadow-[#064e3b05]">
              <div className="grid grid-cols-4 gap-4 text-xs text-[#064e3b] min-w-[700px]">
                <div className="space-y-4 pt-24 font-bold text-[#064e3b70]">
                  <div>Price / kg</div>
                  <div>Quality Grade & Score</div>
                  <div>Available Stock</div>
                  <div>Farmer & Location</div>
                  <div>Organic Certified</div>
                  <div>Mandi Benchmark</div>
                  <div>Action</div>
                </div>

                {compareList.map((crop) => (
                  <div key={crop.id} className="space-y-4 bg-[#f1f5f2]/70 p-4 rounded-2xl border border-[#064e3b10] text-center">
                    <img src={crop.images[0]} alt="" className="w-full h-24 rounded-xl object-cover" />
                    <h5 className="font-bold text-[#064e3b]">{crop.cropName}</h5>
                    <div className="font-black text-[#064e3b] text-lg">₹{crop.currentPrice}/kg</div>
                    <div>{crop.grade} ({crop.qualityScore}/100)</div>
                    <div>{crop.availableQuantityKg.toLocaleString()} kg</div>
                    <div className="text-[11px] text-[#064e3b70]">{crop.farmerName} ({crop.farmerLocation})</div>
                    <div>{crop.organicCertified ? '✅ Yes' : '❌ No'}</div>
                    <div className="text-emerald-700 font-semibold">₹{crop.mandiBenchmarkPrice}/kg</div>
                    <button
                      onClick={() => {
                        setSelectedCropForOrder(crop);
                        setOrderQuantityKg(Math.min(1000, crop.availableQuantityKg));
                      }}
                      className="w-full py-2 rounded-full bg-[#064e3b] text-white font-bold text-xs cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. ORDERS & ESCROW TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Active Procurement Orders & Escrow Security</h3>
            <p className="text-xs text-[#064e3b70]">Track shipments, view digital legally-binding bills of lading, and release payment upon delivery verification</p>
          </div>

          <div className="space-y-4">
            {myOrders.map((ord) => (
              <div key={ord.id} className="p-6 rounded-3xl bg-white border border-[#064e3b15] space-y-4 shadow-lg shadow-[#064e3b05]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#064e3b70] font-mono">Order #{ord.orderNumber} • Tracking {ord.trackingNumber}</span>
                    <h4 className="text-lg font-bold text-[#064e3b]">{ord.cropName} ({ord.quantityKg.toLocaleString()} kg)</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-950 text-xs font-bold">
                      {ord.status}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] text-xs font-bold">
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f1f5f2]/70 p-4 rounded-2xl border border-[#064e3b10] text-xs">
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Farmer & Contact</span>
                    <span className="font-bold text-[#064e3b]">{ord.farmerName} ({ord.farmerPhone})</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Total Settlement</span>
                    <span className="font-bold text-emerald-800 text-sm">₹{ord.totalAmount.toLocaleString()} (@ ₹{ord.agreedPricePerKg}/kg)</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Destination Hub</span>
                    <span className="font-bold text-[#064e3b]">{ord.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#064e3b70] pt-2 border-t border-[#064e3b10]">
                  <span>Assigned Transport: {ord.driverVehicleNo || 'Rapid ColdFleet'}</span>
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Escrow Locked (100% Insured)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. LOGISTICS & COLD CHAIN */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Logistics & Refrigerated Cold-Chain Fleet</h3>
            <p className="text-xs text-[#064e3b70]">Real-time telemetry, cold-storage container monitoring and direct transport dispatch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {logisticsVehicles.map((v) => (
              <div key={v.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] space-y-3 shadow-md shadow-[#064e3b05]">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-900 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amber-800">★ {v.rating}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#064e3b]">{v.vehicleType}</h4>
                  <p className="text-xs text-[#064e3b70]">{v.providerName}</p>
                </div>

                <div className="text-xs text-[#064e3b80] space-y-1 bg-[#f1f5f2]/70 p-3 rounded-2xl border border-[#064e3b10]">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-bold text-[#064e3b]">{v.capacityTons} Tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-[#064e3b80]">{v.currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cold Chain:</span>
                    <span className="text-emerald-800 font-bold">{v.temperatureControlled ? 'Active (4°C)' : 'Ambient'}</span>
                  </div>
                </div>

                <button
                  className="w-full py-2 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs cursor-pointer"
                >
                  Dispatch Fleet
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLACE ORDER MODAL */}
      {selectedCropForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#064e3b15] p-6 shadow-2xl space-y-4 text-[#064e3b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#064e3b10]">
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" /> Direct Farm Gate Escrow Order
              </h3>
              <button onClick={() => setSelectedCropForOrder(null)} className="text-[#064e3b60] hover:text-[#064e3b] cursor-pointer">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-[#f1f5f2]/70 p-3 rounded-2xl border border-[#064e3b10]">
              <img src={selectedCropForOrder.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-sm text-[#064e3b]">{selectedCropForOrder.cropName}</h4>
                <p className="text-xs text-[#064e3b70]">{selectedCropForOrder.farmerName} • {selectedCropForOrder.farmerLocation}</p>
                <span className="text-xs font-bold text-[#064e3b]">₹{selectedCropForOrder.currentPrice}/kg (Grade {selectedCropForOrder.grade})</span>
              </div>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Procurement Quantity (kg)</label>
                <input
                  type="number"
                  required
                  min={selectedCropForOrder.minOrderQuantityKg}
                  max={selectedCropForOrder.availableQuantityKg}
                  value={orderQuantityKg}
                  onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Warehouse / DC Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-[#064e3b15] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#064e3b80]">
                  <span>Subtotal:</span>
                  <span>₹{(selectedCropForOrder.currentPrice * orderQuantityKg).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#064e3b80]">
                  <span>Escrow Protection Fee (1%):</span>
                  <span>₹{Math.round(selectedCropForOrder.currentPrice * orderQuantityKg * 0.01)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#064e3b] pt-1 border-t border-[#064e3b10]">
                  <span>Total Escrow Lock:</span>
                  <span className="text-emerald-900 text-sm">₹{(selectedCropForOrder.currentPrice * orderQuantityKg * 1.01).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                Confirm & Lock Escrow Settlement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POST REQUIREMENT MODAL */}
      {showPostReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#064e3b15] p-6 shadow-2xl space-y-4 text-[#064e3b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#064e3b10]">
              <h3 className="text-base font-bold text-[#064e3b]">Post Bulk Procurement Demand</h3>
              <button onClick={() => setShowPostReqModal(false)} className="text-[#064e3b60] hover:text-[#064e3b] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handlePostReqSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Crop Needed</label>
                <input
                  type="text"
                  required
                  value={reqCrop}
                  onChange={(e) => setReqCrop(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Required Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Target Max Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    value={reqMaxPrice}
                    onChange={(e) => setReqMaxPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Broadcast Request to Farmers
              </button>
            </form>
          </div>
        </div>
      )}

      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
