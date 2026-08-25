import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tractor,
  TrendingUp,
  Plus,
  Package,
  Sparkles,
  DollarSign,
  Calendar,
  CloudRain,
  Users,
  Truck,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Mic,
  AlertTriangle,
  FileText,
  Scale,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { AIPricePredictionTool } from '../../components/ai/AIPricePredictionTool';
import { AICropQualityGradingTool } from '../../components/ai/AICropQualityGradingTool';
import { AINegotiationTool } from '../../components/ai/AINegotiationTool';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { CropListing } from '../../types';

export const FarmerDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const {
    crops,
    addCrop,
    deleteCrop,
    orders,
    expenses,
    addExpense,
    deleteExpense,
    buyerRequirements,
    submitReverseBid,
    cooperativeGroups,
    joinCooperative,
    logisticsVehicles,
    bookLogistics,
    advisoryAlerts,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Add Crop Form State
  const [newCropName, setNewCropName] = useState('Tomato (Hybrid)');
  const [newCropCategory, setNewCropCategory] = useState<'Vegetables' | 'Fruits' | 'Grains & Cereals' | 'Cash Crops'>('Vegetables');
  const [newVariety, setNewVariety] = useState('Shivam Red Special');
  const [newGrade, setNewGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [newPrice, setNewPrice] = useState(32);
  const [newMinPrice, setNewMinPrice] = useState(28);
  const [newQuantity, setNewQuantity] = useState(3000);
  const [newMinOrder, setNewMinOrder] = useState(500);
  const [newHarvestDate, setNewHarvestDate] = useState('2026-08-25');
  const [newOrganic, setNewOrganic] = useState(true);
  const [newDesc, setNewDesc] = useState('Freshly harvested under drip irrigation. High firmness and uniform red color.');

  // Add Expense State
  const [expCategory, setExpCategory] = useState('Fertilizers & Nutrients');
  const [expAmount, setExpAmount] = useState(8500);
  const [expCrop, setExpCrop] = useState('Tomato (Hybrid)');
  const [expNotes, setExpNotes] = useState('Organic bio-fertilizer and micro-nutrients');

  // Reverse Bid Modal State
  const [selectedReqForBid, setSelectedReqForBid] = useState<any>(null);
  const [bidPrice, setBidPrice] = useState(31);
  const [bidQty, setBidQty] = useState(2000);

  // My farmer crops
  const myCrops = crops.filter((c) => c.farmerId === user?.id || c.farmerName === user?.name || true); // show crops

  // Financial Stats
  const totalListedQuantity = myCrops.reduce((acc, c) => acc + c.availableQuantityKg, 0);
  const totalSalesRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const escrowSecured = orders.filter((o) => o.paymentStatus === 'Escrow Secured').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netEstimatedProfit = totalSalesRevenue - totalExpensesAmount;

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCrop({
      farmerId: user?.id || 'usr-farmer-01',
      farmerName: user?.name || 'Ramesh Patel',
      farmerLocation: user?.location || 'Kolar Agro Belt',
      farmerRating: user?.rating || 4.9,
      farmerPhone: user?.phone || '+91 98450 12345',
      cropName: newCropName,
      category: newCropCategory,
      variety: newVariety,
      grade: newGrade,
      qualityScore: newGrade === 'Grade A' ? 95 : 88,
      currentPrice: Number(newPrice),
      minSellingPrice: Number(newMinPrice),
      availableQuantityKg: Number(newQuantity),
      minOrderQuantityKg: Number(newMinOrder),
      harvestDate: newHarvestDate,
      expiryEstimate: '2026-09-15',
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      ],
      organicCertified: newOrganic,
      mandiBenchmarkPrice: Number(newPrice) - 1.5,
      description: newDesc,
    });
    setShowAddCropModal(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category: expCategory,
      cropName: expCrop,
      amount: Number(expAmount),
      date: new Date().toISOString().slice(0, 10),
      notes: expNotes,
    });
    setShowAddExpenseModal(false);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForBid) return;
    submitReverseBid({
      requirementId: selectedReqForBid.id,
      buyerName: selectedReqForBid.businessName,
      cropName: selectedReqForBid.cropName,
      targetQuantityKg: selectedReqForBid.requiredQuantityKg,
      buyerMaxPrice: selectedReqForBid.targetPricePerKg,
      farmerId: user?.id || 'usr-farmer-01',
      farmerName: user?.name || 'Ramesh Patel',
      farmerBidPrice: Number(bidPrice),
      farmerOfferedQtyKg: Number(bidQty),
      farmerLocation: user?.location || 'Kolar Agro Belt',
    });
    setSelectedReqForBid(null);
  };

  const navTabs = [
    { id: 'overview', label: '🌾 Overview Dashboard', icon: Tractor },
    { id: 'crops', label: '📦 Crop Management', icon: Package },
    { id: 'prediction', label: '📈 AI Price Forecasting', icon: TrendingUp },
    { id: 'grading', label: '🔬 Neural Quality Grading', icon: Award },
    { id: 'bidding', label: '🎯 Buyer Match & Bidding', icon: Scale },
    { id: 'finance', label: '💰 Profit & Expense Ledger', icon: DollarSign },
    { id: 'coop', label: '🤝 Cooperative Pooling', icon: Users },
    { id: 'logistics', label: '🚚 Logistics Booking', icon: Truck },
    { id: 'advisory', label: '🌦️ Weather & Smart Advisory', icon: CloudRain },
    { id: 'orders', label: '📜 Orders & Escrow Contracts', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen text-[#064e3b] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Farmer Profile Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-xl shadow-[#064e3b08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt="Farmer profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#064e3b]">{user?.name || 'Ramesh Patel'}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064e3b] font-bold border border-emerald-300">
                Verified Farmer ★ {user?.rating || 4.9}
              </span>
            </div>
            <p className="text-xs text-[#064e3b80]">{user?.farmName || 'GreenFields Organic Agro'} • {user?.location || 'Kolar Agro Belt, Karnataka'} ({user?.farmSizeAcres || 14.5} Acres)</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Trust Score: 96% • Aadhaar & Land Record Verified</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceOpen(true)}
            className="px-4 py-2.5 rounded-full bg-emerald-50 border border-[#064e3b20] text-[#064e3b] text-xs font-bold hover:bg-emerald-100 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-emerald-600" />
            <span>Voice Command</span>
          </button>

          <button
            onClick={() => setShowAddCropModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List New Crop</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {navTabs.map((tab) => {
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

      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Total Listed Harvest</span>
                <Package className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#064e3b]">{(totalListedQuantity / 1000).toFixed(1)}</span>
                <span className="text-xs text-[#064e3b70]">Metric Tons ({myCrops.length} batches)</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">94% AI Quality Grade Average</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Escrow Secured Payments</span>
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-900">₹{escrowSecured.toLocaleString()}</span>
                <span className="text-xs text-cyan-700 font-semibold">100% Guaranteed</span>
              </div>
              <p className="text-[10px] text-[#064e3b70]">Released upon buyer delivery inspection</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Cumulative Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-900">₹{totalSalesRevenue.toLocaleString()}</span>
                <span className="text-xs text-emerald-700 font-bold">+18.4% vs Mandi</span>
              </div>
              <p className="text-[10px] text-[#064e3b70]">{orders.length} total direct fulfilled orders</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <div className="flex items-center justify-between text-[#064e3b70] text-xs">
                <span>Estimated Net Profit</span>
                <TrendingUp className="w-4 h-4 text-purple-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-900">₹{netEstimatedProfit.toLocaleString()}</span>
                <span className="text-xs text-[#064e3b70]">Net of inputs</span>
              </div>
              <p className="text-[10px] text-purple-700 font-semibold">Expenses: ₹{totalExpensesAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Active Listings Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" /> My Active Produce Listings ({myCrops.length})
              </h3>
              <button
                onClick={() => setShowAddCropModal(true)}
                className="text-xs text-emerald-700 hover:text-[#064e3b] font-semibold flex items-center gap-1 cursor-pointer"
              >
                + Add Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-[#064e3b15] hover:border-emerald-500/40 p-4 space-y-3 transition-all shadow-md shadow-[#064e3b05]"
                >
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#064e3b] text-white text-[10px] font-bold">
                      {crop.grade} ({crop.qualityScore}/100)
                    </span>
                    {crop.organicCertified && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-teal-100 border border-teal-300 text-teal-900 text-[10px] font-bold">
                        Organic
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#064e3b]">{crop.cropName}</h4>
                    <p className="text-xs text-[#064e3b70]">{crop.variety}</p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#064e3b10]">
                    <div>
                      <span className="text-xl font-black text-[#064e3b]">₹{crop.currentPrice}</span>
                      <span className="text-xs text-[#064e3b70]"> / kg</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#064e3b]">{crop.availableQuantityKg} kg</span>
                      <span className="text-[10px] text-[#064e3b70] block">Available</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#064e3b10] text-xs">
                    <span className="text-amber-800 text-[11px] font-semibold">AI Demand: {crop.aiDemandIndex}%</span>
                    <button
                      onClick={() => deleteCrop(crop.id)}
                      className="p-1.5 rounded-full text-[#064e3b60] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CROP MANAGEMENT CRUD */}
      {activeTab === 'crops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Full Crop Inventory & Field Listings</h3>
              <p className="text-xs text-[#064e3b70]">Manage crop varieties, photos, harvest schedules, and pricing</p>
            </div>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-4 py-2 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Produce Batch
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#064e3b15] bg-white shadow-md shadow-[#064e3b05]">
            <table className="w-full text-left text-xs text-[#064e3b]">
              <thead className="bg-[#f1f5f2] text-[#064e3b80] uppercase text-[10px] border-b border-[#064e3b10]">
                <tr>
                  <th className="p-4">Crop Produce</th>
                  <th className="p-4">Category / Variety</th>
                  <th className="p-4">Grade & Score</th>
                  <th className="p-4">Price / kg</th>
                  <th className="p-4">Quantity Available</th>
                  <th className="p-4">Harvest Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064e3b10]">
                {myCrops.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f1f5f2]/50">
                    <td className="p-4 font-bold text-[#064e3b] flex items-center gap-3">
                      <img src={c.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div>{c.cropName}</div>
                        <span className="text-[10px] text-emerald-700 font-normal">Mandi Ref: ₹{c.mandiBenchmarkPrice}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{c.category}</div>
                      <span className="text-[10px] text-[#064e3b70]">{c.variety}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064e3b] font-bold border border-emerald-300">
                        {c.grade} ({c.qualityScore})
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#064e3b]">₹{c.currentPrice}</td>
                    <td className="p-4 font-bold text-[#064e3b]">{c.availableQuantityKg.toLocaleString()} kg</td>
                    <td className="p-4 text-[#064e3b70]">{c.harvestDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCrop(c.id)}
                        className="p-1.5 rounded-full text-[#064e3b60] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AI PRICE FORECASTING */}
      {activeTab === 'prediction' && (
        <div className="space-y-4">
          <AIPricePredictionTool />
        </div>
      )}

      {/* 4. NEURAL QUALITY GRADING */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <AICropQualityGradingTool />
        </div>
      )}

      {/* 5. BUYER MATCH & REVERSE BIDDING */}
      {activeTab === 'bidding' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Reverse Bidding & Direct Buyer Procurement Demands</h3>
              <p className="text-xs text-[#064e3b70]">Institutional buyers post bulk requirements. Farmers submit direct competitive bids without middlemen cuts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerRequirements.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-white border border-[#064e3b15] hover:border-cyan-500/40 space-y-4 transition-all shadow-md shadow-[#064e3b05]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-800">{req.businessName}</span>
                    <h4 className="font-bold text-base text-[#064e3b]">{req.cropName}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {req.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-emerald-50/40 p-3 rounded-2xl border border-[#064e3b10] text-xs">
                  <div>
                    <span className="text-[10px] text-[#064e3b70] block">Required Quantity</span>
                    <span className="font-bold text-[#064e3b]">{req.requiredQuantityKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#064e3b70] block">Target Max Price</span>
                    <span className="font-bold text-cyan-800">₹{req.targetPricePerKg}/kg</span>
                  </div>
                </div>

                <div className="text-xs text-[#064e3b80]">
                  <span>📍 Delivery: {req.deliveryLocation}</span>
                  <span className="block mt-0.5">⭐ Quality: {req.qualityRequired} • {req.offersReceived} offers received</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedReqForBid(req);
                    setBidPrice(req.targetPricePerKg + 1);
                    setBidQty(req.requiredQuantityKg);
                  }}
                  className="w-full py-2.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Counter-Bid
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PROFIT & EXPENSE LEDGER */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Farm Input Expenses & Net Margin Ledger</h3>
              <p className="text-xs text-[#064e3b70]">Track seed, fertilizer, labor, irrigation costs vs sales revenue</p>
            </div>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05]">
              <span className="text-xs text-[#064e3b70] block mb-1">Total Crop Sales</span>
              <span className="text-2xl font-extrabold text-[#064e3b]">₹{totalSalesRevenue.toLocaleString()}</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05]">
              <span className="text-xs text-[#064e3b70] block mb-1">Total Input Expenses</span>
              <span className="text-2xl font-extrabold text-rose-700">₹{totalExpensesAmount.toLocaleString()}</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05]">
              <span className="text-xs text-[#064e3b70] block mb-1">Estimated Net Earnings</span>
              <span className="text-2xl font-extrabold text-purple-900">₹{netEstimatedProfit.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-[#064e3b15] bg-white shadow-md shadow-[#064e3b05] overflow-hidden">
            <table className="w-full text-left text-xs text-[#064e3b]">
              <thead className="bg-[#f1f5f2] text-[#064e3b80] uppercase text-[10px] border-b border-[#064e3b10]">
                <tr>
                  <th className="p-4">Expense Category</th>
                  <th className="p-4">Associated Crop</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064e3b10]">
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="p-4 font-bold text-[#064e3b]">{e.category}</td>
                    <td className="p-4">{e.cropName}</td>
                    <td className="p-4 text-[#064e3b70]">{e.date}</td>
                    <td className="p-4 text-[#064e3b70]">{e.notes}</td>
                    <td className="p-4 font-bold text-rose-700">₹{e.amount.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="p-1 rounded text-[#064e3b60] hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. COOPERATIVE POOLING */}
      {activeTab === 'coop' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Farmer Cooperative Bargaining Collectives</h3>
              <p className="text-xs text-[#064e3b70]">Combine smaller harvests with neighboring farmers to fulfill large 20+ Ton institutional buyer orders at premium rates.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cooperativeGroups.map((g) => (
              <div key={g.id} className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-emerald-700 font-bold uppercase">{g.region}</span>
                    <h4 className="text-lg font-bold text-[#064e3b]">{g.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#064e3b] text-xs font-bold">
                    {g.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-[#f1f5f2]/70 p-3.5 rounded-2xl border border-[#064e3b10] text-center">
                  <div>
                    <span className="text-[10px] text-[#064e3b70] block">Total Members</span>
                    <span className="text-lg font-bold text-[#064e3b]">{g.totalMembers}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#064e3b70] block">Pooled Crop Vol</span>
                    <span className="text-lg font-bold text-emerald-800">{(g.pooledQuantityKg / 1000).toFixed(1)} T</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#064e3b70] block">Target Wholesale</span>
                    <span className="text-lg font-bold text-amber-800">₹{g.targetWholesalePricePerKg}/kg</span>
                  </div>
                </div>

                <p className="text-xs text-[#064e3b80]">Lead Representative: <span className="text-[#064e3b] font-semibold">{g.leadFarmer}</span></p>

                <button
                  onClick={() => joinCooperative(g.id, user?.name || 'Ramesh Patel', 2000)}
                  className="w-full py-3 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  Pool +2,000 kg Into Collective
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. LOGISTICS & TRANSPORT */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">Logistics & Cold-Chain Fleet Booking</h3>
              <p className="text-xs text-[#064e3b70]">Book verified agricultural refrigerated trucks and mini-pickups with GPS tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {logisticsVehicles.map((v) => (
              <div key={v.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] hover:border-emerald-500/40 space-y-3 transition-all shadow-md shadow-[#064e3b05]">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064e3b] flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amber-800">★ {v.rating} ({v.completedTrips} trips)</span>
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
                    <span>Rate:</span>
                    <span className="font-bold text-emerald-800">₹{v.ratePerKm}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refrigerated:</span>
                    <span className={v.temperatureControlled ? 'text-emerald-800 font-bold' : 'text-[#064e3b70]'}>
                      {v.temperatureControlled ? 'Yes (Cold Chain)' : 'Standard'}
                    </span>
                  </div>
                </div>

                <button
                  disabled={!v.available}
                  onClick={() => bookLogistics(v.id, 'Kolar Farm Gate', 'Bengaluru APMC', 'Tomato', 2.5)}
                  className="w-full py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {v.available ? 'Book Vehicle Now' : 'Assigned to Trip'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. WEATHER & SMART ADVISORY */}
      {activeTab === 'advisory' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Smart Crop Advisory, Weather & Disease Defense</h3>
            <p className="text-xs text-[#064e3b70]">Real-time localized agromet alerts, pest outbreak warnings, and government subsidy advisories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisoryAlerts.map((adv) => (
              <div
                key={adv.id}
                className={`p-5 rounded-3xl border space-y-3 shadow-md shadow-[#064e3b05] ${
                  adv.severity === 'High'
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                    : 'bg-white border-[#064e3b15] text-[#064e3b]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f1f5f2] text-[#064e3b]">
                    {adv.type}
                  </span>
                  <span className="text-[11px] text-[#064e3b70]">{adv.date}</span>
                </div>

                <h4 className="font-bold text-base text-[#064e3b]">{adv.title}</h4>
                <p className="text-xs leading-relaxed text-[#064e3b80]">{adv.description}</p>

                <div className="p-3 rounded-2xl bg-[#f1f5f2]/80 border border-[#064e3b10] text-xs text-[#064e3b]">
                  <span className="font-bold text-[#064e3b] block mb-0.5">Recommended Farmer Action:</span>
                  {adv.actionRequired}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. ORDERS & ESCROW CONTRACTS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Direct Buyer Orders & Escrow Smart Contracts</h3>
            <p className="text-xs text-[#064e3b70]">Digital legally-binding agreements, dispute escrow locks, and delivery fulfillment</p>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#064e3b70] font-mono">Order #{ord.orderNumber}</span>
                    <h4 className="text-lg font-bold text-[#064e3b]">{ord.cropName} ({ord.quantityKg.toLocaleString()} kg)</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] text-xs font-bold">
                      {ord.status}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-bold">
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f1f5f2]/70 p-4 rounded-2xl border border-[#064e3b10] text-xs">
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Procuring Buyer</span>
                    <span className="font-bold text-[#064e3b]">{ord.buyerBusiness} ({ord.buyerName})</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Contract Total Value</span>
                    <span className="font-bold text-emerald-800 text-sm">₹{ord.totalAmount.toLocaleString()} (@ ₹{ord.agreedPricePerKg}/kg)</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70] block mb-0.5">Driver & Vehicle</span>
                    <span className="font-bold text-[#064e3b]">{ord.driverVehicleNo || 'Assigned Rapid ColdFleet'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#064e3b70] pt-2 border-t border-[#064e3b10]">
                  <span>📍 Pickup: {ord.pickupAddress}</span>
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Digital Fair-Trade Agreement Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD CROP MODAL */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#064e3b15] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#064e3b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#064e3b10]">
              <h3 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" /> List New Crop Batch
              </h3>
              <button onClick={() => setShowAddCropModal(false)} className="text-[#064e3b60] hover:text-[#064e3b] cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCropSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Crop Produce Name</label>
                  <input
                    type="text"
                    required
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Category</label>
                  <select
                    value={newCropCategory}
                    onChange={(e) => setNewCropCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Variety / Hybrid</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Quality Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  >
                    <option value="Grade A">Grade A (Premium Export)</option>
                    <option value="Grade B">Grade B (Standard Market)</option>
                    <option value="Grade C">Grade C (Processing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Asking Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Minimum Floor Price (₹/kg)</label>
                  <input
                    type="number"
                    value={newMinPrice}
                    onChange={(e) => setNewMinPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Available Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Description & Quality Notes</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={newOrganic}
                  onChange={(e) => setNewOrganic(e.target.checked)}
                  className="rounded text-[#064e3b]"
                />
                <label htmlFor="organicCheck" className="text-xs text-[#064e3b80]">
                  Organic Certified / Zero Chemical Residue
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                Publish Crop to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOG EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#064e3b15] p-6 shadow-2xl space-y-4 text-[#064e3b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#064e3b10]">
              <h3 className="text-base font-bold text-[#064e3b]">Log Farm Input Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-[#064e3b60] hover:text-[#064e3b] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                >
                  <option value="Seeds & Saplings">Seeds & Saplings</option>
                  <option value="Fertilizers & Nutrients">Fertilizers & Nutrients</option>
                  <option value="Irrigation & Electricity">Irrigation & Electricity</option>
                  <option value="Labor & Harvesting">Labor & Harvesting</option>
                  <option value="Machinery & Fuel">Machinery & Fuel</option>
                  <option value="Packaging & Crates">Packaging & Crates</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Notes</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-xs text-[#064e3b]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
              >
                Save Expense Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVERSE BID MODAL */}
      {selectedReqForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#064e3b15] p-6 shadow-2xl space-y-4 text-[#064e3b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#064e3b10]">
              <h3 className="text-base font-bold text-[#064e3b]">Submit Counter-Bid to Buyer</h3>
              <button onClick={() => setSelectedReqForBid(null)} className="text-[#064e3b60] hover:text-[#064e3b] cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#064e3b80]">
              Buyer <span className="text-cyan-800 font-bold">{selectedReqForBid.businessName}</span> requests{' '}
              {selectedReqForBid.requiredQuantityKg} kg of {selectedReqForBid.cropName} at target ₹{selectedReqForBid.targetPricePerKg}/kg.
            </p>
            <form onSubmit={handleBidSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Your Offered Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-cyan-500 text-cyan-900 font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#064e3b80] mb-1">Offered Quantity (kg)</label>
                <input
                  type="number"
                  required
                  value={bidQty}
                  onChange={(e) => setBidQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-full bg-[#f1f5f2]/70 border border-[#064e3b20] text-[#064e3b] text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs cursor-pointer"
              >
                Send Proposal to Buyer
              </button>
            </form>
          </div>
        </div>
      )}

      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
