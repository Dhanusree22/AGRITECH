import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  Home,
  Package,
  TrendingUp,
  DollarSign,
  CloudRain,
  Calendar,
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
  Settings as SettingsIcon,
  LogOut,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Plus,
  BarChart3,
  Sparkles,
  Layers,
  Phone,
  Building,
  CreditCard,
  Bell,
  Sun,
  Droplets,
  Wind,
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
import { AIPricePredictionTool } from '../../components/ai/AIPricePredictionTool';
import { AICropQualityGradingTool } from '../../components/ai/AICropQualityGradingTool';
import { AINegotiationTool } from '../../components/ai/AINegotiationTool';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { CropListing } from '../../types';

// Mock Yield Trend Data for Recharts
const yieldTrendData = [
  { season: 'Kharif 2024', yieldTon: 18.5, predictedTon: 17.8, rainfallMm: 620 },
  { season: 'Rabi 2024', yieldTon: 22.0, predictedTon: 21.4, rainfallMm: 180 },
  { season: 'Zaid 2025', yieldTon: 14.2, predictedTon: 15.0, rainfallMm: 95 },
  { season: 'Kharif 2025', yieldTon: 26.8, predictedTon: 25.5, rainfallMm: 740 },
  { season: 'Rabi 2025', yieldTon: 31.4, predictedTon: 30.2, rainfallMm: 210 },
  { season: 'Current Season (Target)', yieldTon: 35.0, predictedTon: 36.2, rainfallMm: 580 },
];

// Price Trajectory Data
const mandiPriceForecastData = [
  { day: 'Day 1 (Observed)', price: 30, forecast: 30, lower: 29, upper: 31 },
  { day: 'Day 2', price: 31, forecast: 31.5, lower: 30, upper: 33 },
  { day: 'Day 3', price: 32, forecast: 33.0, lower: 31, upper: 35 },
  { day: 'Day 4', price: null, forecast: 34.5, lower: 32, upper: 37 },
  { day: 'Day 5', price: null, forecast: 36.0, lower: 33, upper: 39 },
  { day: 'Day 6', price: null, forecast: 37.2, lower: 34, upper: 41 },
  { day: 'Day 7', price: null, forecast: 38.5, lower: 35, upper: 43 },
];

// Expense Pie Breakdown
const expenseBreakdownData = [
  { name: 'Organic Fertilizers', value: 34000, color: '#10B981' },
  { name: 'Drip Irrigation & Power', value: 18500, color: '#00B8F0' },
  { name: 'Certified Seeds & Saplings', value: 22000, color: '#F5A623' },
  { name: 'Farm Labor & Harvesters', value: 29000, color: '#8B5CF6' },
  { name: 'Bio-Pesticides & Sprays', value: 12500, color: '#EC4899' },
];

export const FarmerDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user, logout } = useAuth();
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
    mandiPrices,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Settings state
  const [savedSettings, setSavedSettings] = useState(false);
  const [farmerNameInput, setFarmerNameInput] = useState(user?.name || 'Ramesh Patel');
  const [farmNameInput, setFarmNameInput] = useState(user?.farmName || 'GreenFields Organic Agro');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+91 98450 12345');
  const [bankAccount, setBankAccount] = useState('SBI - 409823901823 (IFSC: SBIN0001234)');
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Add Crop Form State
  const [newCropName, setNewCropName] = useState('Tomato (Hybrid)');
  const [newCropCategory, setNewCropCategory] = useState<'Vegetables' | 'Fruits' | 'Grains & Cereals' | 'Cash Crops'>('Vegetables');
  const [newVariety, setNewVariety] = useState('Shivam Red Special');
  const [newGrade, setNewGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [newPrice, setNewPrice] = useState(32);
  const [newMinPrice, setNewMinPrice] = useState(28);
  const [newQuantity, setNewQuantity] = useState(3000);
  const [newMinOrder, setNewMinOrder] = useState(500);
  const [newHarvestDate, setNewHarvestDate] = useState('2026-11-15');
  const [newOrganic, setNewOrganic] = useState(true);
  const [newDesc, setNewDesc] = useState('Freshly harvested under drip irrigation. High firmness and uniform red color.');

  // Add Expense State
  const [expCategory, setExpCategory] = useState('Organic Fertilizers');
  const [expAmount, setExpAmount] = useState(8500);
  const [expCrop, setExpCrop] = useState('Tomato (Hybrid)');
  const [expNotes, setExpNotes] = useState('Micro-nutrient foliar spray batch 4');

  // Filtered crops
  const myCrops = (crops || []).filter((c) => c.farmerId === user?.id || c.farmerName === user?.name || true);

  // Financial calculations
  const totalListedQuantity = myCrops.reduce((acc, c) => acc + (c.availableQuantityKg || 0), 0);
  const totalSalesRevenue = (orders || []).reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const escrowSecured = (orders || []).filter((o) => o.paymentStatus === 'Escrow Secured').reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalExpensesAmount = (expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0) + 116000;
  const netEstimatedProfit = totalSalesRevenue - totalExpensesAmount;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCrop({
      farmerId: user?.id || 'usr-farmer-01',
      farmerName: farmerNameInput,
      farmerLocation: user?.location || 'Kolar Agro Belt, Karnataka',
      farmerRating: user?.rating || 4.9,
      farmerPhone: phoneInput,
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
      expiryEstimate: '2026-12-01',
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      ],
      description: newDesc,
      status: 'Approved',
      aiDemandIndex: 92,
      organicCertified: newOrganic,
    });
    setShowAddCropModal(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      farmerId: user?.id || 'usr-farmer-01',
      category: expCategory,
      amount: Number(expAmount),
      crop: expCrop,
      date: new Date().toISOString().split('T')[0],
      notes: expNotes,
    });
    setShowAddExpenseModal(false);
  };

  // 15 Specific Navigation Sections
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'my-farm', label: 'My Farm', icon: Tractor },
    { id: 'crops', label: 'Crop Management', icon: Package, badge: myCrops.length },
    { id: 'prediction', label: 'AI Crop Predictions', icon: TrendingUp },
    { id: 'market-prices', label: 'Market Prices', icon: BarChart3 },
    { id: 'marketplace', label: 'Marketplace', icon: Scale },
    { id: 'advisor', label: 'AI Agricultural Advisor', icon: Sparkles },
    { id: 'weather', label: 'Weather Monitoring', icon: CloudRain },
    { id: 'calendar', label: 'Crop Calendar', icon: Calendar },
    { id: 'expenses', label: 'Expense Management', icon: DollarSign },
    { id: 'orders', label: 'Orders and Sales', icon: ShieldCheck, badge: orders.length },
    { id: 'analytics', label: 'Analytics and Reports', icon: Layers },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'logout', label: 'Logout', icon: LogOut, isAction: true },
  ];

  return (
    <div className="min-h-screen text-[#123D2A] flex bg-gradient-to-br from-[#f8faf9] via-emerald-50/20 to-teal-50/30">
      {/* -----------------------------------------------------------------------
          PERSISTENT MODERN SIDEBAR (15 Items)
         ----------------------------------------------------------------------- */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-2xl border-r border-[#123D2A]/10 shadow-2xl lg:shadow-none z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-[#123D2A]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#123D2A] to-[#10B981] flex items-center justify-center text-white shadow-md">
                <Tractor className="w-5 h-5 text-[#C6FF4A]" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-[#123D2A] block">FARMER PORTAL</span>
                <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-wider">AgriTech Intelligent Suite</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Farmer Quick Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-emerald-50/80 border border-[#10B981]/20 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
              alt="Farmer"
              className="w-11 h-11 rounded-xl object-cover border border-[#10B981]/40"
            />
            <div className="truncate">
              <h5 className="font-extrabold text-xs text-[#123D2A] truncate">{farmerNameInput}</h5>
              <p className="text-[11px] text-[#123D2A]/70 truncate">{farmNameInput}</p>
              <span className="text-[9px] font-black uppercase text-[#059669] flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" /> KYC Verified ★ 4.9
              </span>
            </div>
          </div>

          {/* 15 Navigation Items */}
          <nav className="px-3 py-2 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto scrollbar-thin">
            {sidebarItems.map((item) => {
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
                      ? 'bg-[#123D2A] text-white shadow-md shadow-emerald-950/20'
                      : item.id === 'logout'
                      ? 'text-rose-700 hover:bg-rose-50'
                      : 'text-[#18251E]/75 hover:text-[#123D2A] hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C6FF4A]' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#123D2A]'
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

        {/* Sidebar Footer Support Contact */}
        <div className="p-4 border-t border-[#123D2A]/10 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-[#123D2A]/70 mb-2">
            <span>Kisan Toll-Free:</span>
            <strong className="text-[#123D2A]">1800-180-1551</strong>
          </div>
          <button
            onClick={() => setVoiceOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#123D2A] text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
            <span>Vernacular Voice AI</span>
          </button>
        </div>
      </aside>

      {/* -----------------------------------------------------------------------
          MAIN DASHBOARD WORKSPACE
         ----------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#123D2A]/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#123D2A]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#123D2A] capitalize">
                {sidebarItems.find((s) => s.id === activeTab)?.label || 'Farmer Command'}
              </h1>
              <p className="text-[11px] text-[#123D2A]/70">
                Kolar Agro Belt, Karnataka &bull; APMC e-NAM Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-4 py-2 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List New Crop</span>
            </button>

            <button
              onClick={() => setVoiceOpen(true)}
              className="p-2.5 rounded-full bg-emerald-50 border border-[#10B981]/30 text-[#123D2A] hover:bg-emerald-100 transition-all cursor-pointer"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 text-[#10B981]" />
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

        {/* Dashboard Workspace Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* ===================================================================
              1. OVERVIEW SECTION (KPIs + RECHARTS YIELD + FORECAST + EXPENSES)
             =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Farm Summary Banner */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl shadow-emerald-950/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#123D2A] to-[#10B981] p-0.5 shadow-md">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                      alt="Farmer profile"
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#123D2A]">{farmerNameInput}</h2>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold border border-emerald-300">
                        Verified Farmer ★ 4.9
                      </span>
                    </div>
                    <p className="text-xs text-[#18251E]/70">
                      {farmNameInput} &bull; Kolar Agro Belt, Karnataka (14.5 Acres Drip Irrigated)
                    </p>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      Trust Score: 96% &bull; Aadhaar &amp; Land Record Verified &bull; 0 Middleman Deductions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('prediction')}
                    className="px-4 py-2.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 hover:bg-[#10B981]/25 text-[#123D2A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    <span>Run AI Price Forecast</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('advisor')}
                    className="px-4 py-2.5 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C6FF4A]" />
                    <span>AI Agronomist</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[#18251E]/70 text-xs">
                    <span className="font-semibold">Total Crops Listed</span>
                    <Package className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#123D2A]">{(totalListedQuantity / 1000).toFixed(1)}</span>
                    <span className="text-xs text-[#18251E]/70">Metric Tons ({myCrops.length} lots)</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold">94% AI Quality Grade Average</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[#18251E]/70 text-xs">
                    <span className="font-semibold">Active Orders & Escrow</span>
                    <ShieldCheck className="w-4 h-4 text-[#00B8F0]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-cyan-950">₹{escrowSecured.toLocaleString()}</span>
                    <span className="text-xs text-cyan-700 font-bold">100% Escrow</span>
                  </div>
                  <p className="text-[10px] text-[#18251E]/70">{orders.length} orders in delivery pipeline</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[#18251E]/70 text-xs">
                    <span className="font-semibold">Cumulative Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-950">₹{totalSalesRevenue.toLocaleString()}</span>
                    <span className="text-xs text-emerald-700 font-bold">+18.4% vs Local Mandi</span>
                  </div>
                  <p className="text-[10px] text-[#18251E]/70">Direct-to-buyer bank transfers</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[#18251E]/70 text-xs">
                    <span className="font-semibold">AI Model Confidence</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-purple-950">94.2%</span>
                    <span className="text-xs text-purple-700 font-bold">High Precision</span>
                  </div>
                  <p className="text-[10px] text-purple-700 font-semibold">Grounded on real AGMARKNET data</p>
                </div>
              </div>

              {/* Recharts Interactive Visualizations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Harvest Yield Trends Across Seasons */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#123D2A] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#10B981]" /> Harvest Yield Trends Across Seasons (Tons)
                      </h3>
                      <p className="text-[11px] text-[#18251E]/70">
                        Comparing actual harvest harvest tons against AI seasonal yield predictions
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-[#123D2A] font-bold">
                      Target: 36.2 Tons
                    </span>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yieldTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00B8F0" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00B8F0" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="season" tick={{ fontSize: 10 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#64748b" unit="T" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#123D2A', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="yieldTon" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#yieldGrad)" name="Actual Yield (Tons)" />
                        <Area type="monotone" dataKey="predictedTon" stroke="#00B8F0" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#predGrad)" name="AI Target Yield (Tons)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right 5 cols: Expense Breakdown by Category */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#123D2A] flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-600" /> Operational Expense Distribution
                      </h3>
                      <p className="text-[11px] text-[#18251E]/70">Total Season Outlay: ₹1,16,000</p>
                    </div>
                    <button
                      onClick={() => setShowAddExpenseModal(true)}
                      className="text-xs font-bold text-[#10B981] hover:underline"
                    >
                      + Log Expense
                    </button>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                          contentStyle={{ backgroundColor: '#123D2A', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 7-Day APMC Price Forecast Line Chart with Uncertainty Range */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C6FF4A]">
                      Forecasting Engine Grounded in Agmarknet Feed
                    </span>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#C6FF4A]" /> 7-Day Mandi Price Prediction Curve (₹/kg)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300">Tomato (Hybrid)</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[#C6FF4A] font-bold">Bullish +20.3%</span>
                  </div>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mandiPriceForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} unit="₹" domain={[25, 45]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} name="Observed Mandi Price" />
                      <Line type="monotone" dataKey="forecast" stroke="#F5A623" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} name="AI Model Forecast" />
                      <Line type="monotone" dataKey="upper" stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" dot={false} name="Upper Uncertainty (95% CI)" />
                      <Line type="monotone" dataKey="lower" stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" dot={false} name="Lower Uncertainty (95% CI)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Produce Listings Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#123D2A] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#10B981]" /> Active Farm Produce Lots ({myCrops.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('crops')}
                    className="text-xs font-bold text-[#10B981] hover:underline"
                  >
                    View All in Crop Management &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myCrops.slice(0, 3).map((crop) => (
                    <div
                      key={crop.id}
                      className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 p-5 space-y-4 shadow-lg shadow-emerald-950/5 hover:border-[#10B981] transition-all"
                    >
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100">
                        <img src={crop.images[0]} alt={crop.cropName} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#123D2A] text-white text-[10px] font-black">
                          {crop.grade} ({crop.qualityScore}/100)
                        </span>
                        {crop.organicCertified && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-bold">
                            Organic
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-[#123D2A]">{crop.cropName}</h4>
                        <p className="text-xs text-[#18251E]/70">{crop.variety}</p>
                      </div>

                      <div className="flex items-baseline justify-between pt-2 border-t border-[#123D2A]/10">
                        <div>
                          <span className="text-2xl font-black text-[#123D2A]">₹{crop.currentPrice}</span>
                          <span className="text-xs text-[#18251E]/70"> / kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#123D2A]">{crop.availableQuantityKg} kg</span>
                          <span className="text-[10px] text-[#18251E]/70 block">Harvest Available</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#123D2A]/10 text-xs">
                        <span className="text-emerald-800 text-[11px] font-bold">AI Demand: {crop.aiDemandIndex}%</span>
                        <button
                          onClick={() => deleteCrop(crop.id)}
                          className="p-1.5 rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              2. MY FARM
             =================================================================== */}
          {activeTab === 'my-farm' && (
            <div className="space-y-6">
              <div className="p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#123D2A]/10">
                  <div>
                    <h2 className="text-2xl font-black text-[#123D2A]">{farmNameInput}</h2>
                    <p className="text-xs text-[#18251E]/70 mt-1">
                      Plot #184/B, Kolar Agro-Tech Belt, Karnataka &bull; Lat 13.1362° N, Long 78.1291° E
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#123D2A] font-extrabold text-xs border border-emerald-300">
                    Aadhaar Land Registry Linked: KA-KLR-2024-8901
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-[#123D2A]/70 block">Total Cultivated Area</span>
                    <strong className="text-xl font-black text-[#123D2A]">14.5 Acres</strong>
                    <p className="text-[11px] text-emerald-800 mt-1">100% Drip Automation</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-[#123D2A]/70 block">Soil Classification</span>
                    <strong className="text-xl font-black text-[#123D2A]">Red Sandy Loam</strong>
                    <p className="text-[11px] text-emerald-800 mt-1">pH 6.8 &bull; Rich Organic Carbon</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-[#123D2A]/70 block">Primary Water Source</span>
                    <strong className="text-xl font-black text-[#123D2A]">Solar Borewell + Pond</strong>
                    <p className="text-[11px] text-emerald-800 mt-1">Recharge Pit Certified</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-[#123D2A]/70 block">Certification Status</span>
                    <strong className="text-xl font-black text-[#123D2A]">NPOP Organic</strong>
                    <p className="text-[11px] text-emerald-800 mt-1">Renewed valid till 2028</p>
                  </div>
                </div>

                {/* Farm Field Zones */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-[#123D2A]">Designated Farm Plots &amp; Crop Rotations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-[#123D2A]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#123D2A]">Block Alpha (6.0 Acres)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold">Active</span>
                      </div>
                      <p className="text-xs text-[#18251E]/70">Crop: Tomato (Hybrid) - Flowering Stage</p>
                      <div className="text-[11px] text-[#123D2A]">Soil Moisture: 64% &bull; Drip scheduled 06:00 AM</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#123D2A]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#123D2A]">Block Beta (4.5 Acres)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">Pre-Harvest</span>
                      </div>
                      <p className="text-xs text-[#18251E]/70">Crop: Capsicum (Green) - Final Sizing</p>
                      <div className="text-[11px] text-[#123D2A]">Soil Moisture: 58% &bull; Harvest Date: Nov 18</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#123D2A]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#123D2A]">Block Gamma (4.0 Acres)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold">Nursery</span>
                      </div>
                      <p className="text-xs text-[#18251E]/70">Crop: Sona Masoori Rice - Seedling Bed</p>
                      <div className="text-[11px] text-[#123D2A]">Water Level: 4cm &bull; Bio-fertilizer applied</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              3. CROP MANAGEMENT (CRUD)
             =================================================================== */}
          {activeTab === 'crops' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A]">Crop Management &amp; Inventory</h2>
                  <p className="text-xs text-[#18251E]/70">Add new harvest lots, manage pricing thresholds, and track active buyer availability.</p>
                </div>
                <button
                  onClick={() => setShowAddCropModal(true)}
                  className="px-5 py-2.5 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Crop Lot</span>
                </button>
              </div>

              {/* Crop Table */}
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#123D2A] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Crop Name</th>
                        <th className="py-3.5 px-4">Category &amp; Variety</th>
                        <th className="py-3.5 px-4">AI Quality Grade</th>
                        <th className="py-3.5 px-4">Available Qty</th>
                        <th className="py-3.5 px-4">Ask Price / kg</th>
                        <th className="py-3.5 px-4">Harvest Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#123D2A]/10">
                      {myCrops.map((c) => (
                        <tr key={c.id} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#123D2A]">
                            <div className="flex items-center gap-3">
                              <img src={c.images[0]} alt={c.cropName} className="w-9 h-9 rounded-lg object-cover" />
                              <span>{c.cropName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#18251E]/80">
                            <span>{c.category}</span>
                            <span className="block text-[10px] text-gray-400">{c.variety}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#123D2A] font-bold text-[10px]">
                              {c.grade} ({c.qualityScore}%)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-[#123D2A]">{c.availableQuantityKg.toLocaleString()} kg</td>
                          <td className="py-3.5 px-4 font-extrabold text-[#123D2A]">₹{c.currentPrice}</td>
                          <td className="py-3.5 px-4 text-[#18251E]/70">{c.harvestDate}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => deleteCrop(c.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete Crop"
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
            </div>
          )}

          {/* ===================================================================
              4. AI CROP PREDICTIONS
             =================================================================== */}
          {activeTab === 'prediction' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#10B981]" /> AI Price Forecasting Tool (APMC Grounded)
                    </h2>
                    <p className="text-xs text-[#18251E]/70">
                      Predict mandi modal prices 7 to 30 days ahead based on arrivals, rainfall patterns, and holiday demand.
                    </p>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                    Official Agmarknet Feed
                  </span>
                </div>
                <AIPricePredictionTool />
              </div>
            </div>
          )}

          {/* ===================================================================
              5. MARKET PRICES (APMC Mandi Rates)
             =================================================================== */}
          {activeTab === 'market-prices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A]">National APMC Mandi Benchmark Rates</h2>
                  <p className="text-xs text-[#18251E]/70">
                    Live market prices retrieved from Agmarknet / data.gov.in official government feeds.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#123D2A] border border-emerald-300">
                  Last Sync: Today 09:30 AM
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mandiPrices.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-base text-[#123D2A]">{m.crop}</h4>
                        <p className="text-xs text-[#18251E]/70">{m.mandi}, {m.state}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        +{m.changePercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-[#123D2A]/10">
                      <div>
                        <span className="text-2xl font-black text-[#123D2A]">₹{m.pricePerKg}</span>
                        <span className="text-xs text-[#18251E]/70"> / kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#059669]">₹{m.ai7DayForecastPerKg}/kg</span>
                        <span className="text-[10px] text-[#18251E]/60 block font-semibold">7-Day Target</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#18251E]/70 bg-emerald-50/50 p-2.5 rounded-xl">
                      <div>Arrival: <strong>{m.arrivalTons} Tons</strong></div>
                      <div>Modal: <strong>₹{m.modalPrice}/Qtl</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              6. MARKETPLACE (Direct Produce Sourcing / Trading)
             =================================================================== */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A]">AgriTech Commodity Marketplace</h2>
                  <p className="text-xs text-[#18251E]/70">
                    Discover wholesale buyer requirements, reverse bidding lots, and cooperative pooling orders.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCropModal(true)}
                  className="px-4 py-2 rounded-full bg-[#123D2A] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  + Post Produce to Market
                </button>
              </div>

              {/* Active Buyer Requirements for Reverse Bidding */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#123D2A] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#10B981]" /> Active Institutional Buyer Purchase Demands
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyerRequirements.map((req) => (
                    <div key={req.id} className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-[#123D2A]">{req.cropName}</h4>
                          <p className="text-xs text-[#18251E]/70">{req.businessName} &bull; {req.deliveryLocation}</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                          {req.urgency}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-2 border-t border-[#123D2A]/10 text-xs">
                        <div>
                          <span>Demand: <strong>{req.requiredQuantityKg} kg</strong></span>
                        </div>
                        <div>
                          <span>Buyer Max: <strong className="text-emerald-700">₹{req.targetPricePerKg}/kg</strong></span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          submitReverseBid({
                            requirementId: req.id,
                            buyerName: req.businessName,
                            cropName: req.cropName,
                            targetQuantityKg: req.requiredQuantityKg,
                            buyerMaxPrice: req.targetPricePerKg,
                            farmerId: user?.id || 'usr-farmer-01',
                            farmerName: farmerNameInput,
                            farmerBidPrice: req.targetPricePerKg,
                            farmerOfferedQtyKg: Math.min(2000, req.requiredQuantityKg),
                            farmerLocation: 'Kolar Agro Belt',
                          });
                          alert(`Bid of ₹${req.targetPricePerKg}/kg submitted to ${req.businessName}!`);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#123D2A] hover:bg-[#064e3b] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Submit Direct Supply Offer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              7. AI AGRICULTURAL ADVISOR
             =================================================================== */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#10B981]" /> AI Agricultural Agronomist &amp; Advisor
                  </h2>
                  <p className="text-xs text-[#18251E]/70 mt-1">
                    Powered by Google Gemini models trained on ICAR agricultural agronomy datasets and regional weather data.
                  </p>
                </div>

                {/* Interactive Diagnostic Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <h4 className="font-extrabold text-sm text-[#123D2A]">🌾 Pest &amp; Fungal Disease Advisory</h4>
                    <p className="text-xs text-[#18251E]/80 leading-relaxed">
                      "Recent 82% humidity in Kolar increases Early Blight (Alternaria solani) risk in solanaceous crops. Spray Mancozeb (2g/L) or Copper Oxychloride prior to forecasted weekend rainfall."
                    </p>
                    <div className="text-[11px] text-emerald-800 font-bold">Severity: Low / Preventative Action Required</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3">
                    <h4 className="font-extrabold text-sm text-cyan-950">💧 Irrigation &amp; Fertigation Schedule</h4>
                    <p className="text-xs text-[#18251E]/80 leading-relaxed">
                      "Soil sensor indicates 64% field capacity in Block Alpha. With 0mm rain predicted for the next 4 days, run drip fertigation with 19-19-19 water-soluble NPK on Thursday for 45 minutes."
                    </p>
                    <div className="text-[11px] text-cyan-800 font-bold">Efficiency Target: 98% Water Conservation</div>
                  </div>
                </div>

                <div className="pt-2">
                  <AICropQualityGradingTool />
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              8. WEATHER MONITORING
             =================================================================== */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                      <CloudRain className="w-5 h-5 text-[#00B8F0]" /> Agro-Meteorological Weather Station
                    </h2>
                    <p className="text-xs text-[#18251E]/70 mt-1">
                      Direct observations from Open-Meteo High-Resolution Agro Forecast Model for Kolar District.
                    </p>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                    Open-Meteo Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5" /> Air Temperature
                    </span>
                    <strong className="text-3xl font-black text-[#123D2A]">28.4°C</strong>
                    <p className="text-[11px] text-gray-500">Min: 19.2°C &bull; Max: 31.0°C</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-800 uppercase flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" /> Relative Humidity
                    </span>
                    <strong className="text-3xl font-black text-cyan-950">58%</strong>
                    <p className="text-[11px] text-gray-500">Optimal transpiration zone</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5" /> Rainfall Forecast
                    </span>
                    <strong className="text-3xl font-black text-blue-950">0.0 mm</strong>
                    <p className="text-[11px] text-gray-500">Dry 72-hour window ahead</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5" /> Wind Speed
                    </span>
                    <strong className="text-3xl font-black text-emerald-950">12 km/h</strong>
                    <p className="text-[11px] text-gray-500">Direction: South-West</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              9. CROP CALENDAR
             =================================================================== */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#10B981]" /> Seasonal Crop Harvest Calendar
                  </h2>
                  <p className="text-xs text-[#18251E]/70 mt-1">
                    Scheduled farm events, sowing deadlines, fertigation dates, and market auction days.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800">November 10, 2026</span>
                      <h4 className="font-black text-sm text-[#123D2A]">Tomato Harvest Batch 2 Stage A</h4>
                      <p className="text-xs text-[#18251E]/70">Target: 3,000 kg Grade A produce staging for GreenMart order</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#123D2A] text-white font-bold">In 3 Days</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-800">November 14, 2026</span>
                      <h4 className="font-black text-sm text-cyan-950">Drip Fertigation &amp; Micronutrient Spray</h4>
                      <p className="text-xs text-[#18251E]/70">Application of Zinc sulphate and potassium schoenite in Block Beta</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-800 text-white font-bold">Scheduled</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-800">November 22, 2026</span>
                      <h4 className="font-black text-sm text-purple-950">APMC Kolar Mega Seasonal Auction</h4>
                      <p className="text-xs text-[#18251E]/70">Expected arrival spike for hybrid vegetables; price target ₹38/kg</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-800 text-white font-bold">Market Event</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              10. EXPENSE MANAGEMENT
             =================================================================== */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A]">Expense Management &amp; P&amp;L Ledger</h2>
                  <p className="text-xs text-[#18251E]/70">Log fertilizer, labor, irrigation, and seed investments against harvest sales.</p>
                </div>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-5 py-2.5 rounded-full bg-[#123D2A] text-white text-xs font-black shadow-md cursor-pointer"
                >
                  + Add Expense Entry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md">
                  <span className="text-xs text-[#18251E]/70">Total Revenue Received</span>
                  <div className="text-2xl font-black text-[#123D2A] mt-1">₹{totalSalesRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-700 font-bold">Direct bank deposits</span>
                </div>

                <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md">
                  <span className="text-xs text-[#18251E]/70">Total Farm Expenses</span>
                  <div className="text-2xl font-black text-rose-800 mt-1">₹{totalExpensesAmount.toLocaleString()}</div>
                  <span className="text-[10px] text-rose-600 font-bold">5 major categories tracked</span>
                </div>

                <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md">
                  <span className="text-xs text-[#18251E]/70">Net Operating Surplus</span>
                  <div className="text-2xl font-black text-[#059669] mt-1">₹{netEstimatedProfit.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-800 font-bold">Profit Margin: ~32%</span>
                </div>
              </div>

              {/* Expense Table */}
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#123D2A] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Crop</th>
                        <th className="py-3 px-4">Notes</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#123D2A]/10">
                      {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-emerald-50/50">
                          <td className="py-3 px-4 text-[#18251E]/70">{e.date}</td>
                          <td className="py-3 px-4 font-bold text-[#123D2A]">{e.category}</td>
                          <td className="py-3 px-4">{e.crop}</td>
                          <td className="py-3 px-4 text-[#18251E]/70">{e.notes}</td>
                          <td className="py-3 px-4 font-black text-rose-700">₹{e.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => deleteExpense(e.id)}
                              className="text-rose-600 hover:text-rose-800 cursor-pointer"
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
            </div>
          )}

          {/* ===================================================================
              11. ORDERS AND SALES (Escrow Contracts)
             =================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A]">Orders, Invoices &amp; Escrow Contracts</h2>
                  <p className="text-xs text-[#18251E]/70">
                    Track buyer procurement orders, delivery milestones, and automated escrow bank payouts.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                  Escrow Guarantee Active
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#123D2A]/10">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono block">ORDER #{ord.id}</span>
                        <h4 className="font-extrabold text-base text-[#123D2A]">{ord.cropName} &bull; {ord.quantityKg} kg</h4>
                        <p className="text-xs text-[#18251E]/70">Buyer: <strong>{ord.buyerName}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#123D2A]">₹{ord.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold block mt-0.5">
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#18251E]/70">
                      <div>Status: <strong className="text-[#123D2A]">{ord.status}</strong></div>
                      <div>Delivery To: <strong className="text-[#123D2A]">{ord.deliveryAddress}</strong></div>
                      <div>Created: <strong className="text-[#123D2A]">{ord.createdAt}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              12. ANALYTICS AND REPORTS
             =================================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#10B981]" /> Farm Analytics &amp; Yield Audit Reports
                  </h2>
                  <p className="text-xs text-[#18251E]/70 mt-1">
                    Download formal PDF reports for agricultural bank loans, crop insurance claims, and organic compliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#123D2A]/15 space-y-3">
                    <h4 className="font-bold text-sm text-[#123D2A]">Annual Harvest Statement</h4>
                    <p className="text-xs text-[#18251E]/70">Complete summary of 35.0 MT harvest yield and gross realizations.</p>
                    <button
                      onClick={() => alert('Harvest Statement PDF generated and downloaded!')}
                      className="text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                    >
                      Download PDF &darr;
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#123D2A]/15 space-y-3">
                    <h4 className="font-bold text-sm text-[#123D2A]">APMC Price Realization Audit</h4>
                    <p className="text-xs text-[#18251E]/70">Demonstrates +18.4% premium gained over conventional mandi middleman auction.</p>
                    <button
                      onClick={() => alert('Price Realization Audit PDF downloaded!')}
                      className="text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                    >
                      Download PDF &darr;
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#123D2A]/15 space-y-3">
                    <h4 className="font-bold text-sm text-[#123D2A]">Soil &amp; Chemical Residue Log</h4>
                    <p className="text-xs text-[#18251E]/70">Zero-chemical pesticide verification log for certified organic produce buyers.</p>
                    <button
                      onClick={() => alert('Organic Soil Certificate downloaded!')}
                      className="text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                    >
                      Download PDF &darr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              13. VOICE ASSISTANT TAB
             =================================================================== */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#123D2A] to-emerald-900 text-white shadow-2xl text-center space-y-6 max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#C6FF4A]/40 flex items-center justify-center text-[#C6FF4A] mx-auto shadow-xl relative">
                  <Mic className="w-10 h-10 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#C6FF4A] animate-ping opacity-25" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Vernacular Voice AI</h3>
                  <p className="text-xs text-emerald-200 mt-2 max-w-sm mx-auto">
                    Speak naturally in Kannada, Hindi, Telugu, Tamil, Malayalam, Marathi, Bengali, or English.
                  </p>
                </div>
                <button
                  onClick={() => setVoiceOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-[#C6FF4A] hover:bg-[#b8f53a] text-[#123D2A] font-black text-sm shadow-xl transition-all cursor-pointer hover:scale-105"
                >
                  Start Spoken Conversation
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              14. SETTINGS
             =================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-xl font-black text-[#123D2A] flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-[#10B981]" /> Farm Profile &amp; Escrow Settlement Settings
                  </h2>
                  <p className="text-xs text-[#18251E]/70 mt-1">
                    Manage bank account credentials for escrow direct transfers and communication alerts.
                  </p>
                </div>

                {savedSettings && (
                  <div className="p-3.5 rounded-2xl bg-emerald-100 text-[#123D2A] text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    <span>Settings successfully saved!</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      value={farmerNameInput}
                      onChange={(e) => setFarmerNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Farm Enterprise Name</label>
                    <input
                      type="text"
                      value={farmNameInput}
                      onChange={(e) => setFarmNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Registered Kisan Mobile Number</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">
                      Direct Escrow Bank Payout Account (Aadhaar Seeded)
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Funds from escrow are automatically dispatched to this account upon delivery QA sign-off.
                    </span>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#123D2A]">
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                        className="rounded text-[#10B981] focus:ring-[#10B981]"
                      />
                      <span>Receive Instant SMS &amp; WhatsApp Alerts for New Buyer Orders &amp; Escrow Releases</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setSavedSettings(true);
                      setTimeout(() => setSavedSettings(false), 3000);
                    }}
                    className="px-6 py-3 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Farm Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD CROP MODAL */}
      <AnimatePresence>
        {showAddCropModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#123D2A]/15"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#123D2A]/10">
                <h3 className="font-black text-base text-[#123D2A] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#10B981]" /> List New Harvest Lot
                </h3>
                <button
                  onClick={() => setShowAddCropModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCropSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[#123D2A] block mb-1">Crop Name</label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Category</label>
                    <select
                      value={newCropCategory}
                      onChange={(e: any) => setNewCropCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains & Cereals">Grains &amp; Cereals</option>
                      <option value="Cash Crops">Cash Crops</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Variety</label>
                    <input
                      type="text"
                      value={newVariety}
                      onChange={(e) => setNewVariety(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Quality Grade</label>
                    <select
                      value={newGrade}
                      onChange={(e: any) => setNewGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    >
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Grade C">Grade C</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Price / kg (₹)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Quantity (kg)</label>
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Harvest Date</label>
                    <input
                      type="date"
                      value={newHarvestDate}
                      onChange={(e) => setNewHarvestDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Min Order Qty (kg)</label>
                    <input
                      type="number"
                      value={newMinOrder}
                      onChange={(e) => setNewMinOrder(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#123D2A]">
                    <input
                      type="checkbox"
                      checked={newOrganic}
                      onChange={(e) => setNewOrganic(e.target.checked)}
                      className="rounded text-[#10B981]"
                    />
                    <span>NPOP Certified Organic Lot</span>
                  </label>
                </div>

                <div>
                  <label className="font-bold text-[#123D2A] block mb-1">Description &amp; Produce Notes</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Publish Produce Listing to Marketplace
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD EXPENSE MODAL */}
      <AnimatePresence>
        {showAddExpenseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#123D2A]/15"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#123D2A]/10">
                <h3 className="font-black text-base text-[#123D2A] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" /> Log Farm Expense
                </h3>
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[#123D2A] block mb-1">Expense Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                  >
                    <option value="Organic Fertilizers">Organic Fertilizers</option>
                    <option value="Drip Irrigation & Power">Drip Irrigation &amp; Power</option>
                    <option value="Certified Seeds & Saplings">Certified Seeds &amp; Saplings</option>
                    <option value="Farm Labor & Harvesters">Farm Labor &amp; Harvesters</option>
                    <option value="Bio-Pesticides & Sprays">Bio-Pesticides &amp; Sprays</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#123D2A] block mb-1">Associated Crop</label>
                    <input
                      type="text"
                      value={expCrop}
                      onChange={(e) => setExpCrop(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#123D2A] block mb-1">Expense Notes / Invoice Ref</label>
                  <input
                    type="text"
                    value={expNotes}
                    onChange={(e) => setExpNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#123D2A]/15 focus:border-[#10B981] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#123D2A] hover:bg-[#064e3b] text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Save to P&amp;L Ledger
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vernacular Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};
