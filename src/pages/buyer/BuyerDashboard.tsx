import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Home,
  Package,
  Search,
  Filter,
  Plus,
  TrendingDown,
  TrendingUp,
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
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Heart,
  BarChart3,
  FileText,
  CreditCard,
  Phone,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { AINegotiationTool } from '../../components/ai/AINegotiationTool';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { CropListing } from '../../types';

// Mock Procurement Recharts Data
const monthlyProcurementData = [
  { month: 'Jun', volumeTons: 42, spendLakhs: 13.8, savingsLakhs: 2.1 },
  { month: 'Jul', volumeTons: 58, spendLakhs: 18.2, savingsLakhs: 3.4 },
  { month: 'Aug', volumeTons: 74, spendLakhs: 23.5, savingsLakhs: 4.8 },
  { month: 'Sep', volumeTons: 65, spendLakhs: 20.1, savingsLakhs: 3.9 },
  { month: 'Oct', volumeTons: 92, spendLakhs: 29.4, savingsLakhs: 6.2 },
  { month: 'Nov (Projected)', volumeTons: 110, spendLakhs: 34.0, savingsLakhs: 7.5 },
];

const categorySpendData = [
  { name: 'Fresh Vegetables', value: 45, color: '#10B981' },
  { name: 'Commercial Fruits', value: 25, color: '#00B8F0' },
  { name: 'Pulses & Grains', value: 20, color: '#F5A623' },
  { name: 'Spices & Cash Crops', value: 10, color: '#8B5CF6' },
];

export const BuyerDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user, logout } = useAuth();
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
    mandiPrices,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Settings State
  const [savedSettings, setSavedSettings] = useState(false);
  const [buyerNameInput, setBuyerNameInput] = useState(user?.name || 'Priya Sundaram');
  const [firmNameInput, setFirmNameInput] = useState(user?.businessName || 'GreenMart Retail Organics Ltd');
  const [gstInput, setGstInput] = useState('29AABCU9603R1ZM');
  const [deliveryHub, setDeliveryHub] = useState('GreenMart Central Cold Hub, Hosur Road, Bengaluru 560068');

  // Favorites state
  const [favoriteCropIds, setFavoriteCropIds] = useState<string[]>([]);

  // Order Placement Modal State
  const [selectedCropForOrder, setSelectedCropForOrder] = useState<CropListing | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState(1000);
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState(deliveryHub);

  // Post Requirement Modal State
  const [showPostReqModal, setShowPostReqModal] = useState(false);
  const [reqCrop, setReqCrop] = useState('Tomato (Hybrid)');
  const [reqQty, setReqQty] = useState(5000);
  const [reqMaxPrice, setReqMaxPrice] = useState(31);
  const [reqUrgency, setReqUrgency] = useState('Within 7 days');
  const [reqLocation, setReqLocation] = useState('Bengaluru APMC Zone');

  // Compare Crops State
  const [compareList, setCompareList] = useState<CropListing[]>([]);

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

  const toggleFavorite = (cropId: string) => {
    setFavoriteCropIds((prev) =>
      prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
    );
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

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropForOrder) return;
    const agreedPrice = selectedCropForOrder.currentPrice;
    const total = agreedPrice * orderQuantityKg;

    createOrder({
      cropId: selectedCropForOrder.id,
      cropName: selectedCropForOrder.cropName,
      farmerId: selectedCropForOrder.farmerId,
      farmerName: selectedCropForOrder.farmerName,
      buyerId: user?.id || 'usr-buyer-01',
      buyerName: buyerNameInput,
      quantityKg: Number(orderQuantityKg),
      pricePerKg: agreedPrice,
      totalAmount: total,
      status: 'Confirmed',
      paymentStatus: 'Escrow Secured',
      deliveryAddress: orderDeliveryAddress,
      logisticsPartner: 'AgriTech Cold-Chain Logistics',
      trackingNumber: `AGRI-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDelivery: '2026-11-18',
    });

    setSelectedCropForOrder(null);
    setActiveTab('orders');
  };

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    createBuyerRequirement({
      buyerId: user?.id || 'usr-buyer-01',
      buyerName: buyerNameInput,
      businessName: firmNameInput,
      cropName: reqCrop,
      requiredQuantityKg: Number(reqQty),
      targetPricePerKg: Number(reqMaxPrice),
      deliveryLocation: reqLocation,
      urgency: reqUrgency,
      qualityRequired: 'Grade A',
    });
    setShowPostReqModal(false);
    setActiveTab('requests');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 14 Specific Navigation Sections
  const buyerSidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'marketplace', label: 'Agricultural Marketplace', icon: Package, badge: filteredCrops.length },
    { id: 'browse', label: 'Browse Products', icon: Search },
    { id: 'farmers', label: 'Find Farmers', icon: Users },
    { id: 'comparison', label: 'Product Comparison', icon: Scale, badge: compareList.length },
    { id: 'intelligence', label: 'Market Intelligence', icon: BarChart3 },
    { id: 'advisor', label: 'AI Procurement Assistant', icon: Sparkles },
    { id: 'requests', label: 'Purchase Requests', icon: Layers, badge: buyerRequirements.length },
    { id: 'orders', label: 'My Orders', icon: ShieldCheck, badge: myOrders.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteCropIds.length },
    { id: 'analytics', label: 'Analytics and Reports', icon: FileText },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'logout', label: 'Logout', icon: LogOut, isAction: true },
  ];

  return (
    <div className="min-h-screen text-[#123D2A] flex bg-gradient-to-br from-[#f8faf9] via-cyan-50/20 to-emerald-50/30">
      {/* -----------------------------------------------------------------------
          PERSISTENT MODERN SIDEBAR (14 Items)
         ----------------------------------------------------------------------- */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-2xl border-r border-cyan-950/10 shadow-2xl lg:shadow-none z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-cyan-950/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0e7490] to-[#00B8F0] flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-cyan-950 block">BUYER PORTAL</span>
                <span className="text-[10px] uppercase font-bold text-[#00B8F0] tracking-wider">Wholesale Sourcing Hub</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Buyer Quick Info */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'}
              alt="Buyer"
              className="w-11 h-11 rounded-xl object-cover border border-cyan-400"
            />
            <div className="truncate">
              <h5 className="font-extrabold text-xs text-cyan-950 truncate">{buyerNameInput}</h5>
              <p className="text-[11px] text-cyan-900/70 truncate">{firmNameInput}</p>
              <span className="text-[9px] font-black uppercase text-[#0e7490] flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" /> Licensed Buyer &bull; GST Valid
              </span>
            </div>
          </div>

          {/* 14 Navigation Items */}
          <nav className="px-3 py-2 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto scrollbar-thin">
            {buyerSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      handleLogout();
                    } else if (item.id === 'voice') {
                      setVoiceOpen(true);
                    } else {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0e7490] text-white shadow-md shadow-cyan-950/20'
                      : item.id === 'logout'
                      ? 'text-rose-700 hover:bg-rose-50'
                      : 'text-cyan-950/75 hover:text-cyan-950 hover:bg-cyan-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-cyan-950/10 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-cyan-950/70 mb-2">
            <span>Escrow Guarantee:</span>
            <strong className="text-cyan-950">100% Protected</strong>
          </div>
          <button
            onClick={() => setVoiceOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#00B8F0] animate-pulse" />
            <span>Voice Sourcing AI</span>
          </button>
        </div>
      </aside>

      {/* -----------------------------------------------------------------------
          MAIN BUYER WORKSPACE
         ----------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-cyan-950/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-cyan-950"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-cyan-950 capitalize">
                {buyerSidebarItems.find((s) => s.id === activeTab)?.label || 'Buyer Command'}
              </h1>
              <p className="text-[11px] text-cyan-950/70">
                Direct Farm-Gate Sourcing &bull; Zero Middleman Escrow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowPostReqModal(true)}
              className="px-4 py-2 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Bulk Requirement</span>
            </button>

            <button
              onClick={() => setVoiceOpen(true)}
              className="p-2.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 hover:bg-cyan-100 transition-all cursor-pointer"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 text-[#00B8F0]" />
            </button>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Logout to Home"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* ===================================================================
              1. OVERVIEW SECTION (KPIs + RECHARTS PROCUREMENT + CATEGORY PIE)
             =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Profile Banner */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl shadow-cyan-950/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0e7490] to-[#00B8F0] p-0.5 shadow-md">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                      alt="Buyer profile"
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-cyan-950">{buyerNameInput}</h2>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 font-bold border border-cyan-300">
                        Institutional Aggregator ★ 4.95
                      </span>
                    </div>
                    <p className="text-xs text-cyan-950/70">
                      {firmNameInput} &bull; GSTIN: {gstInput} &bull; Central Distribution Hub: Bengaluru
                    </p>
                    <p className="text-[11px] text-[#0e7490] font-semibold mt-0.5">
                      Procurement Score: 98.4% &bull; 100% On-Time Escrow Release &bull; 12 Cold-Chain Fleets Linked
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="px-4 py-2.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Source Commodities</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('advisor')}
                    className="px-4 py-2.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-950 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-200 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#00B8F0]" />
                    <span>AI Procurement Advisor</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-cyan-950/70 text-xs">
                    <span className="font-semibold">Active Purchases & Orders</span>
                    <Package className="w-4 h-4 text-[#0e7490]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-cyan-950">{myOrders.length}</span>
                    <span className="text-xs text-cyan-950/70">Active Batches</span>
                  </div>
                  <p className="text-[10px] text-[#0e7490] font-semibold">Tracked with real-time GPS cold chain</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-cyan-950/70 text-xs">
                    <span className="font-semibold">Volume Procured (MT)</span>
                    <Layers className="w-4 h-4 text-[#00B8F0]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-cyan-950">{(totalVolumeProcuredKg / 1000).toFixed(1)}</span>
                    <span className="text-xs text-cyan-950/70">Metric Tons</span>
                  </div>
                  <p className="text-[10px] text-cyan-700 font-semibold">Across Karnataka & AP farms</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-cyan-950/70 text-xs">
                    <span className="font-semibold">Locked in Escrow</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-900">₹{activeEscrowAmount.toLocaleString()}</span>
                    <span className="text-xs text-emerald-700 font-bold">100% Protected</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Released upon delivery QA sign-off</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-cyan-950/70 text-xs">
                    <span className="font-semibold">Sourcing Cost Savings</span>
                    <TrendingDown className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-950">14.8%</span>
                    <span className="text-xs text-amber-700 font-bold">vs Mandi Middlemen</span>
                  </div>
                  <p className="text-[10px] text-amber-700 font-semibold">₹6.2 Lakhs saved this season</p>
                </div>
              </div>

              {/* Recharts Sourcing Volume and Spend */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-cyan-950 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#00B8F0]" /> Monthly Procurement Volume (MT) &amp; Spend (₹ Lakhs)
                      </h3>
                      <p className="text-[11px] text-cyan-950/70">
                        Month-on-month aggregation from verified farm-gate direct contracts
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyProcurementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#083344', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Bar dataKey="volumeTons" fill="#00B8F0" radius={[6, 6, 0, 0]} name="Volume (Metric Tons)" />
                        <Bar dataKey="spendLakhs" fill="#10B981" radius={[6, 6, 0, 0]} name="Total Spend (₹ Lakhs)" />
                        <Bar dataKey="savingsLakhs" fill="#F5A623" radius={[6, 6, 0, 0]} name="Savings Achieved (₹ Lakhs)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-cyan-950 flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#0e7490]" /> Sourcing Category Distribution
                    </h3>
                    <p className="text-[11px] text-cyan-950/70">Breakdown of active procurement budget</p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySpendData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {categorySpendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [`${value}%`, 'Allocation']}
                          contentStyle={{ backgroundColor: '#083344', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Quick Action Produce Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-cyan-950">Featured Direct Farm Listings</h3>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="text-xs font-bold text-[#0e7490] hover:underline"
                  >
                    View All {filteredCrops.length} Produce Lots &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredCrops.slice(0, 3).map((crop) => (
                    <div
                      key={crop.id}
                      className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 p-5 space-y-4 shadow-lg shadow-cyan-950/5 hover:border-[#00B8F0] transition-all"
                    >
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100">
                        <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-cyan-900 text-white text-[10px] font-black">
                          {crop.grade} ({crop.qualityScore}/100)
                        </span>
                        <button
                          onClick={() => toggleFavorite(crop.id)}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                            favoriteCropIds.includes(crop.id)
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:text-rose-500'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-cyan-950">{crop.cropName}</h4>
                        <p className="text-xs text-cyan-950/70">{crop.farmerName} &bull; {crop.farmerLocation}</p>
                      </div>

                      <div className="flex items-baseline justify-between pt-2 border-t border-cyan-950/10">
                        <div>
                          <span className="text-2xl font-black text-cyan-950">₹{crop.currentPrice}</span>
                          <span className="text-xs text-cyan-950/70"> / kg</span>
                        </div>
                        <span className="text-xs font-bold text-cyan-900">{crop.availableQuantityKg} kg available</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-cyan-950/10">
                        <button
                          onClick={() => setSelectedCropForOrder(crop)}
                          className="flex-1 py-2.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                        >
                          Direct Procure (Escrow)
                        </button>
                        <button
                          onClick={() => toggleCompare(crop)}
                          className={`p-2.5 rounded-full border text-xs font-bold transition-colors ${
                            compareList.find((c) => c.id === crop.id)
                              ? 'bg-cyan-100 border-cyan-400 text-cyan-950'
                              : 'border-cyan-950/20 text-cyan-950 hover:bg-cyan-50'
                          }`}
                          title="Add to Compare"
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              2. AGRICULTURAL MARKETPLACE & 3. BROWSE PRODUCTS
             =================================================================== */}
          {(activeTab === 'marketplace' || activeTab === 'browse') && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-cyan-950/50 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search produce by name, region, or variety (e.g. Tomato, Kolar, Shivam Red)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-cyan-950/15 text-xs outline-none bg-white font-medium"
                    >
                      <option value="All">All Categories</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains & Cereals">Grains &amp; Cereals</option>
                      <option value="Cash Crops">Cash Crops</option>
                    </select>

                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-cyan-950/15 text-xs outline-none bg-white font-medium"
                    >
                      <option value="All">All Grades</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                    </select>

                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-950/15 bg-white text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyOrganic}
                        onChange={(e) => setOnlyOrganic(e.target.checked)}
                        className="rounded text-[#0e7490]"
                      />
                      <span className="font-semibold text-cyan-950">Organic Only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Crops Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 p-5 space-y-4 shadow-lg shadow-cyan-950/5 hover:border-[#00B8F0] transition-all"
                  >
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
                      <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-cyan-950 text-white text-[10px] font-black">
                        {crop.grade} ({crop.qualityScore}/100)
                      </span>
                      {crop.organicCertified && (
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                          NPOP Organic
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(crop.id)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                          favoriteCropIds.includes(crop.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:text-rose-500'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-black text-base text-cyan-950">{crop.cropName}</h4>
                      <p className="text-xs text-cyan-950/70">{crop.variety} &bull; {crop.category}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#0e7490] font-semibold mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{crop.farmerLocation} ({crop.farmerName})</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-cyan-950/10">
                      <div>
                        <span className="text-2xl font-black text-cyan-950">₹{crop.currentPrice}</span>
                        <span className="text-xs text-cyan-950/70"> / kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-cyan-950">{crop.availableQuantityKg} kg</span>
                        <span className="text-[10px] text-cyan-950/60 block">Min order: {crop.minOrderQuantityKg} kg</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-cyan-950/10">
                      <button
                        onClick={() => setSelectedCropForOrder(crop)}
                        className="flex-1 py-2.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Lock in Escrow
                      </button>
                      <button
                        onClick={() => toggleCompare(crop)}
                        className={`p-2.5 rounded-full border text-xs font-bold transition-colors ${
                          compareList.find((c) => c.id === crop.id)
                            ? 'bg-cyan-100 border-cyan-400 text-cyan-950'
                            : 'border-cyan-950/20 text-cyan-950 hover:bg-cyan-50'
                        }`}
                        title="Add to Compare"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              4. FIND FARMERS DIRECTORY
             =================================================================== */}
          {activeTab === 'farmers' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00B8F0]" /> Verified Farmer Partners Directory
                  </h2>
                  <p className="text-xs text-cyan-950/70 mt-1">
                    Direct access to Aadhaar &amp; Land Registry verified producers across major agro-clusters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-3xl bg-cyan-50/60 border border-cyan-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                        alt="Farmer"
                        className="w-14 h-14 rounded-2xl object-cover border border-cyan-400"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-cyan-950">Ramesh Patel</h4>
                        <p className="text-xs text-cyan-950/70">GreenFields Organic Agro</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                          KYC Verified ★ 4.9
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-950/80 space-y-1 bg-white/80 p-3 rounded-2xl">
                      <div>Location: <strong>Kolar Belt, Karnataka</strong></div>
                      <div>Farm Size: <strong>14.5 Acres (Drip Irrigated)</strong></div>
                      <div>Primary Crops: <strong>Tomato, Capsicum, Rice</strong></div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('Vegetables');
                        setActiveTab('marketplace');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0e7490] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Browse Harvest Lots
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-cyan-50/60 border border-cyan-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                        alt="Farmer"
                        className="w-14 h-14 rounded-2xl object-cover border border-cyan-400"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-cyan-950">Suresh Gowda</h4>
                        <p className="text-xs text-cyan-950/70">Mandya Sugarcane &amp; Paddy FPO</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                          KYC Verified ★ 4.8
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-950/80 space-y-1 bg-white/80 p-3 rounded-2xl">
                      <div>Location: <strong>Mandya District, Karnataka</strong></div>
                      <div>Farm Size: <strong>22.0 Acres</strong></div>
                      <div>Primary Crops: <strong>Sona Masoori Rice, Jaggery</strong></div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('Grains & Cereals');
                        setActiveTab('marketplace');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0e7490] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Browse Harvest Lots
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-cyan-50/60 border border-cyan-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                        alt="Farmer"
                        className="w-14 h-14 rounded-2xl object-cover border border-cyan-400"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-cyan-950">Anil Patil</h4>
                        <p className="text-xs text-cyan-950/70">Nashik Onion &amp; Grape Cluster</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                          KYC Verified ★ 4.85
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-950/80 space-y-1 bg-white/80 p-3 rounded-2xl">
                      <div>Location: <strong>Nashik, Maharashtra</strong></div>
                      <div>Farm Size: <strong>18.0 Acres</strong></div>
                      <div>Primary Crops: <strong>Red Onion, Table Grapes</strong></div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('Vegetables');
                        setActiveTab('marketplace');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0e7490] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Browse Harvest Lots
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              5. PRODUCT COMPARISON MATRIX
             =================================================================== */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#00B8F0]" /> Side-by-Side Produce Comparison Matrix
                    </h2>
                    <p className="text-xs text-cyan-950/70 mt-1">
                      Compare pricing, AI quality scores, batch moisture, and farm distances before committing escrow funds.
                    </p>
                  </div>
                  {compareList.length > 0 && (
                    <button
                      onClick={() => setCompareList([])}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Comparison ({compareList.length})
                    </button>
                  )}
                </div>

                {compareList.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-cyan-950/15 rounded-3xl space-y-3">
                    <Scale className="w-10 h-10 text-cyan-950/40 mx-auto" />
                    <p className="text-sm font-bold text-cyan-950">No produce lots selected for comparison</p>
                    <p className="text-xs text-cyan-950/60 max-w-sm mx-auto">
                      Click the scale icon on any crop card in the marketplace to compare up to 3 lots side-by-side.
                    </p>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="px-5 py-2.5 rounded-full bg-[#0e7490] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Go to Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {compareList.map((c) => (
                      <div key={c.id} className="p-5 rounded-3xl bg-cyan-50/60 border border-cyan-200 space-y-4">
                        <img src={c.images[0]} alt={c.cropName} className="w-full h-40 rounded-2xl object-cover" />
                        <div>
                          <h4 className="font-black text-base text-cyan-950">{c.cropName}</h4>
                          <p className="text-xs text-cyan-950/70">{c.variety}</p>
                        </div>
                        <div className="space-y-2 text-xs divide-y divide-cyan-950/10">
                          <div className="flex justify-between py-1">
                            <span>Price / kg:</span> <strong className="text-cyan-950 text-sm">₹{c.currentPrice}</strong>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>AI Quality Grade:</span> <strong className="text-[#0e7490]">{c.grade} ({c.qualityScore}%)</strong>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Farmer:</span> <strong>{c.farmerName}</strong>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Location:</span> <strong>{c.farmerLocation}</strong>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Available Stock:</span> <strong>{c.availableQuantityKg} kg</strong>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCropForOrder(c)}
                          className="w-full py-2.5 rounded-full bg-[#0e7490] text-white text-xs font-extrabold shadow-md cursor-pointer"
                        >
                          Select for Escrow Purchase
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              6. MARKET INTELLIGENCE
             =================================================================== */}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-950">APMC Mandi Intelligence &amp; Sourcing Arbitrage</h2>
                  <p className="text-xs text-cyan-950/70">
                    Real-time market rates across state mandis. Compare farm-gate asking prices against live modal rates.
                  </p>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-100 text-cyan-950 font-bold border border-cyan-300">
                  Agmarknet Verified API
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mandiPrices.map((m) => (
                  <div key={m.id} className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-base text-cyan-950">{m.crop}</h4>
                        <p className="text-xs text-cyan-950/70">{m.mandi}, {m.state}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        +{m.changePercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-cyan-950/10">
                      <div>
                        <span className="text-2xl font-black text-cyan-950">₹{m.pricePerKg}</span>
                        <span className="text-xs text-cyan-950/70"> / kg modal</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00B8F0]">₹{m.ai7DayForecastPerKg}/kg</span>
                        <span className="text-[10px] text-cyan-950/60 block">7-Day Target</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-cyan-950/70 bg-cyan-50/50 p-2.5 rounded-xl">
                      <div>Arrival: <strong>{m.arrivalTons} Tons</strong></div>
                      <div>Modal: <strong>₹{m.modalPrice}/Qtl</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              7. AI PROCUREMENT ASSISTANT
             =================================================================== */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#00B8F0]" /> AI Procurement Assistant &amp; Price Negotiator
                    </h2>
                    <p className="text-xs text-cyan-950/70">
                      Automated fair-price validation, mandi arbitrage suggestions, and bulk order contract formulation.
                    </p>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold">
                    Gemini Sourcing Model
                  </span>
                </div>
                <AINegotiationTool />
              </div>
            </div>
          )}

          {/* ===================================================================
              8. PURCHASE REQUESTS & REVERSE BIDDING
             =================================================================== */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-950">Purchase Requests &amp; Reverse Bidding Portal</h2>
                  <p className="text-xs text-cyan-950/70">
                    Broadcast your bulk procurement specs. Multiple verified farmers submit competitive supply bids.
                  </p>
                </div>
                <button
                  onClick={() => setShowPostReqModal(true)}
                  className="px-5 py-2.5 rounded-full bg-[#0e7490] text-white text-xs font-black shadow-md cursor-pointer"
                >
                  + Post New Bulk Demand
                </button>
              </div>

              {/* Active Requirements List */}
              <div className="space-y-4">
                {buyerRequirements.map((req) => (
                  <div key={req.id} className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-950/10">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">REQ #{req.id}</span>
                        <h4 className="font-extrabold text-base text-cyan-950">{req.cropName} &bull; {req.requiredQuantityKg} kg</h4>
                        <p className="text-xs text-cyan-950/70">Delivery Location: {req.deliveryLocation} &bull; Urgency: {req.urgency}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-cyan-950">Target Max: ₹{req.targetPricePerKg}/kg</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 font-bold block mt-0.5">
                          Open for Farmer Bids
                        </span>
                      </div>
                    </div>

                    {/* Received Bids */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-xs text-cyan-950">Farmer Bids Received:</h5>
                      {reverseBids.filter((b) => b.requirementId === req.id).length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No direct bids yet. Farmers are reviewing your request.</p>
                      ) : (
                        reverseBids
                          .filter((b) => b.requirementId === req.id)
                          .map((bid) => (
                            <div
                              key={bid.id}
                              className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-cyan-950">{bid.farmerName} ({bid.farmerLocation})</span>
                                <span className="text-cyan-950/60 block text-[11px]">Offered: {bid.farmerOfferedQtyKg} kg</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-[#0e7490]">₹{bid.farmerBidPrice}/kg</span>
                                <button
                                  onClick={() => {
                                    alert(`Supply contract of ${bid.farmerOfferedQtyKg}kg awarded to ${bid.farmerName}! Escrow funded.`);
                                  }}
                                  className="px-3 py-1.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Award &amp; Escrow
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              9. MY ORDERS & ESCROW TRACKING
             =================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-950">Orders, Invoices &amp; Escrow Settlement</h2>
                  <p className="text-xs text-cyan-950/70">
                    Funds remain in neutral banking escrow until your QA team verifies crop grade at delivery.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold">
                  Active Escrow: ₹{activeEscrowAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-950/10">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono block">ORDER #{ord.id}</span>
                        <h4 className="font-extrabold text-base text-cyan-950">{ord.cropName} &bull; {ord.quantityKg} kg</h4>
                        <p className="text-xs text-cyan-950/70">Farmer: <strong>{ord.farmerName}</strong> &bull; Logistics: {ord.logisticsPartner}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-cyan-950">₹{ord.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 font-bold block mt-0.5">
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-cyan-950/70">
                      <div>Status: <strong className="text-cyan-950">{ord.status}</strong></div>
                      <div>Tracking Ref: <strong className="text-cyan-950">{ord.trackingNumber}</strong></div>
                      <div>Delivery Hub: <strong className="text-cyan-950">{ord.deliveryAddress}</strong></div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-950/10">
                      <span className="text-[11px] text-gray-500 font-medium">
                        Inspection window: 24h upon truck arrival at loading bay.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Invoice PDF for Order #${ord.id} downloaded!`)}
                          className="px-3.5 py-1.5 rounded-full border border-cyan-950/20 text-xs font-bold hover:bg-cyan-50 cursor-pointer"
                        >
                          Download Invoice
                        </button>
                        <button
                          onClick={() => alert(`Escrow funds for Order #${ord.id} released directly to farmer ${ord.farmerName} bank account!`)}
                          className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                        >
                          Approve QA &amp; Release Escrow
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              10. FAVORITES
             =================================================================== */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-current" /> Bookmarked Lots &amp; Preferred Farmers
                  </h2>
                  <p className="text-xs text-cyan-950/70 mt-1">
                    Save lots to watch price changes or re-order from high-performing farmers.
                  </p>
                </div>

                {favoriteCropIds.length === 0 ? (
                  <div className="p-10 text-center border-2 border-dashed border-cyan-950/15 rounded-3xl space-y-2">
                    <Heart className="w-8 h-8 text-rose-300 mx-auto" />
                    <p className="text-sm font-bold text-cyan-950">No favorite lots saved yet</p>
                    <p className="text-xs text-cyan-950/60">Click the heart button on any crop card to save it here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {crops
                      .filter((c) => favoriteCropIds.includes(c.id))
                      .map((crop) => (
                        <div key={crop.id} className="p-5 rounded-3xl bg-white border border-cyan-200 space-y-3">
                          <img src={crop.images[0]} alt={crop.cropName} className="w-full h-36 rounded-2xl object-cover" />
                          <h4 className="font-extrabold text-sm text-cyan-950">{crop.cropName}</h4>
                          <div className="flex justify-between text-xs">
                            <span>₹{crop.currentPrice}/kg</span>
                            <span>{crop.availableQuantityKg} kg</span>
                          </div>
                          <button
                            onClick={() => setSelectedCropForOrder(crop)}
                            className="w-full py-2 rounded-xl bg-[#0e7490] text-white text-xs font-bold cursor-pointer"
                          >
                            Order Now
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              11. ANALYTICS AND REPORTS
             =================================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#00B8F0]" /> Procurement Analytics &amp; GST Invoicing Reports
                  </h2>
                  <p className="text-xs text-cyan-950/70 mt-1">
                    Export complete supply chain audits, e-way bills, and farm-origin certifications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-cyan-950/15 space-y-3">
                    <h4 className="font-bold text-sm text-cyan-950">Monthly GST Sourcing Annexure</h4>
                    <p className="text-xs text-cyan-950/70">Complete line-item breakdown of farm transactions with TDS/TCS filings.</p>
                    <button
                      onClick={() => alert('GST Annexure downloaded!')}
                      className="text-xs font-bold text-[#0e7490] hover:underline cursor-pointer"
                    >
                      Download CSV &darr;
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-cyan-950/15 space-y-3">
                    <h4 className="font-bold text-sm text-cyan-950">Escrow Settlement Ledger</h4>
                    <p className="text-xs text-cyan-950/70">Verified audit trail of ₹{totalSpend.toLocaleString()} escrow settlements.</p>
                    <button
                      onClick={() => alert('Escrow Ledger PDF downloaded!')}
                      className="text-xs font-bold text-[#0e7490] hover:underline cursor-pointer"
                    >
                      Download PDF &darr;
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-cyan-950/15 space-y-3">
                    <h4 className="font-bold text-sm text-cyan-950">Farm Traceability Manifest</h4>
                    <p className="text-xs text-cyan-950/70">Farm plot coordinates, pesticide testing logs, and QA batch barcodes.</p>
                    <button
                      onClick={() => alert('Traceability Manifest downloaded!')}
                      className="text-xs font-bold text-[#0e7490] hover:underline cursor-pointer"
                    >
                      Download PDF &darr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              12. VOICE ASSISTANT TAB
             =================================================================== */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#083344] to-[#0e7490] text-white shadow-2xl text-center space-y-6 max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#00B8F0]/40 flex items-center justify-center text-[#00B8F0] mx-auto shadow-xl relative">
                  <Mic className="w-10 h-10 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#00B8F0] animate-ping opacity-25" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Voice Procurement Assistant</h3>
                  <p className="text-xs text-cyan-200 mt-2 max-w-sm mx-auto">
                    Speak instructions like "Find 5000 kg Grade A tomatoes in Kolar under ₹30" in Kannada, Hindi, or English.
                  </p>
                </div>
                <button
                  onClick={() => setVoiceOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-[#00B8F0] hover:bg-[#00a3d4] text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer hover:scale-105"
                >
                  Start Spoken Procurement
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              13. SETTINGS
             =================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-xl font-black text-cyan-950 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-[#00B8F0]" /> Buyer Profile &amp; Cold-Chain Delivery Settings
                  </h2>
                  <p className="text-xs text-cyan-950/70 mt-1">
                    Manage institutional license details, central receiving hub addresses, and automated payment limits.
                  </p>
                </div>

                {savedSettings && (
                  <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Buyer settings successfully saved!</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Procurement Officer Name</label>
                    <input
                      type="text"
                      value={buyerNameInput}
                      onChange={(e) => setBuyerNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Corporate / Enterprise Entity</label>
                    <input
                      type="text"
                      value={firmNameInput}
                      onChange={(e) => setFirmNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">GSTIN Identification Number</label>
                    <input
                      type="text"
                      value={gstInput}
                      onChange={(e) => setGstInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">
                      Primary Cold-Storage Central Receiving Hub
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryHub}
                      onChange={(e) => setDeliveryHub(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSavedSettings(true);
                      setTimeout(() => setSavedSettings(false), 3000);
                    }}
                    className="px-6 py-3 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Buyer Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ORDER PLACEMENT MODAL */}
      <AnimatePresence>
        {selectedCropForOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-cyan-950/15"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-950/10">
                <h3 className="font-black text-base text-cyan-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Secure Escrow Procurement Order
                </h3>
                <button
                  onClick={() => setSelectedCropForOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center gap-3">
                  <img src={selectedCropForOrder.images[0]} alt="Crop" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-black text-sm text-cyan-950">{selectedCropForOrder.cropName}</h4>
                    <p className="text-[11px] text-cyan-950/70">{selectedCropForOrder.variety} &bull; {selectedCropForOrder.grade}</p>
                    <p className="text-[11px] text-[#0e7490] font-bold">Farmer: {selectedCropForOrder.farmerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Price per kg</label>
                    <input
                      type="text"
                      value={`₹${selectedCropForOrder.currentPrice}`}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 bg-gray-50 text-cyan-950 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Order Quantity (kg)</label>
                    <input
                      type="number"
                      min={selectedCropForOrder.minOrderQuantityKg}
                      max={selectedCropForOrder.availableQuantityKg}
                      value={orderQuantityKg}
                      onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-cyan-950 block mb-1">Cold-Chain Delivery Address</label>
                  <textarea
                    rows={2}
                    value={orderDeliveryAddress}
                    onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Purchase Value:</span>
                    <strong className="text-emerald-400 text-base">
                      ₹{(selectedCropForOrder.currentPrice * orderQuantityKg).toLocaleString()}
                    </strong>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Funds deposited directly into neutral banking escrow</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Deposit to Escrow &amp; Confirm Order
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POST REQUIREMENT MODAL */}
      <AnimatePresence>
        {showPostReqModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-cyan-950/15"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-950/10">
                <h3 className="font-black text-base text-cyan-950 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#0e7490]" /> Post Bulk Procurement Demand
                </h3>
                <button
                  onClick={() => setShowPostReqModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostRequirement} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-cyan-950 block mb-1">Target Crop</label>
                  <input
                    type="text"
                    value={reqCrop}
                    onChange={(e) => setReqCrop(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Required Quantity (kg)</label>
                    <input
                      type="number"
                      value={reqQty}
                      onChange={(e) => setReqQty(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Max Target Price / kg (₹)</label>
                    <input
                      type="number"
                      value={reqMaxPrice}
                      onChange={(e) => setReqMaxPrice(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Urgency Window</label>
                    <select
                      value={reqUrgency}
                      onChange={(e) => setReqUrgency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    >
                      <option value="Immediate (48h)">Immediate (48h)</option>
                      <option value="Within 7 days">Within 7 days</option>
                      <option value="Seasonal Contract (30d)">Seasonal Contract (30d)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-cyan-950 block mb-1">Delivery Destination</label>
                    <input
                      type="text"
                      value={reqLocation}
                      onChange={(e) => setReqLocation(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-cyan-950/15 focus:border-[#00B8F0] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0e7490] hover:bg-[#0891b2] text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Broadcast Requirement to Farmers
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
