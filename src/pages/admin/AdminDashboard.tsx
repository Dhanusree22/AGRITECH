import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Home,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Truck,
  Building,
  Scale,
  RefreshCw,
  Search,
  Lock,
  Radio,
  Eye,
  Award,
  Calendar,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Package,
  Sparkles,
  Server,
  Layers,
  Database,
  CloudSun,
  Bell,
  Cpu,
  BarChart3,
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
import { LanguageSelector } from '../../components/common/LanguageSelector';

// Mock Platform Recharts Data
const platformGrowthData = [
  { month: 'Jun', farmers: 4500, buyers: 1800, escrowCr: 28.5 },
  { month: 'Jul', farmers: 7800, buyers: 3200, escrowCr: 45.2 },
  { month: 'Aug', farmers: 12400, buyers: 5600, escrowCr: 72.8 },
  { month: 'Sep', farmers: 17900, buyers: 8900, escrowCr: 104.0 },
  { month: 'Oct', farmers: 22100, buyers: 13500, escrowCr: 135.6 },
  { month: 'Nov (Current)', farmers: 26400, buyers: 18200, escrowCr: 158.4 },
];

const apiLatencyData = [
  { time: '06:00', agmarknet: 140, openMeteo: 85, gemini: 320 },
  { time: '09:00', agmarknet: 280, openMeteo: 95, gemini: 410 },
  { time: '12:00', agmarknet: 310, openMeteo: 110, gemini: 380 },
  { time: '15:00', agmarknet: 240, openMeteo: 90, gemini: 350 },
  { time: '18:00', agmarknet: 190, openMeteo: 88, gemini: 330 },
  { time: '21:00', agmarknet: 160, openMeteo: 80, gemini: 300 },
];

export const AdminDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const {
    crops = [],
    updateCropStatus,
    orders = [],
    kycRequests = [],
    verifyKYC,
    disputes = [],
    resolveDispute,
    mandiPrices = [],
    advisoryAlerts = [],
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [emergencyAlertText, setEmergencyAlertText] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'Warning' | 'Urgent' | 'Info'>('Warning');

  // Platform Commission Setting State
  const [platformCommission, setPlatformCommission] = useState(1.2);
  const [kycAutoVerification, setKycAutoVerification] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Key platform stats
  const totalVolumeCr = 158.4;
  const activeEscrowCr = 14.8;
  const platformRevenueLakhs = 98.2;
  const pendingKycCount = (kycRequests || []).filter((k) => k.status === 'Pending').length;
  const pendingDisputesCount = (disputes || []).filter((d) => d.status === 'Under Review').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDisputeResolution = (disputeId: string, resolution: 'Release to Farmer' | 'Refund Buyer') => {
    resolveDispute(disputeId, resolution, resolutionNotes || 'Neutral administrative arbitration completed.');
    setSelectedDispute(null);
    setResolutionNotes('');
  };

  // 15 Specific Navigation Sections
  const adminSidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'User Management', icon: Users, badge: kycRequests.length },
    { id: 'farmers', label: 'Farmer Management', icon: Award },
    { id: 'buyers', label: 'Buyer Management', icon: Building },
    { id: 'products', label: 'Product Management', icon: Package, badge: crops.length },
    { id: 'orders', label: 'Order Management', icon: Shield, badge: orders.length },
    { id: 'marketplace', label: 'Marketplace Monitoring', icon: Scale },
    { id: 'analytics', label: 'Agricultural Analytics', icon: BarChart3 },
    { id: 'ai-health', label: 'AI and ML Monitoring', icon: Sparkles },
    { id: 'api-monitor', label: 'API Integration Monitoring', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'audit', label: 'Audit Logs', icon: Layers },
    { id: 'settings', label: 'Platform Settings', icon: SettingsIcon },
    { id: 'logout', label: 'Logout', icon: LogOut, isAction: true },
  ];

  return (
    <div className="min-h-screen text-[#123D2A] flex bg-gradient-to-br from-[#f8faf9] via-purple-50/20 to-emerald-50/20">
      {/* -----------------------------------------------------------------------
          PERSISTENT MODERN SIDEBAR (15 Items)
         ----------------------------------------------------------------------- */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/95 backdrop-blur-2xl border-r border-purple-950/10 shadow-2xl lg:shadow-none z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-purple-950/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#581c87] to-purple-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-purple-950 block">ADMIN COMMAND</span>
                <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Regulatory Oversight</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin Status */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black text-xs">
              SEC
            </div>
            <div className="truncate">
              <h5 className="font-extrabold text-xs text-purple-950 truncate">Dr. K. S. Murthy</h5>
              <p className="text-[11px] text-purple-900/70 truncate">Chief Agri-Tech Officer</p>
              <span className="text-[9px] font-black uppercase text-purple-700 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> 2FA Hardware Token Active
              </span>
            </div>
          </div>

          {/* 15 Navigation Items */}
          <nav className="px-3 py-2 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto scrollbar-thin">
            {adminSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      handleLogout();
                    } else {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#581c87] text-white shadow-md shadow-purple-950/20'
                      : item.id === 'logout'
                      ? 'text-rose-700 hover:bg-rose-50'
                      : 'text-purple-950/75 hover:text-purple-950 hover:bg-purple-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-950'
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

        {/* Sidebar Footer Node Status */}
        <div className="p-4 border-t border-purple-950/10 bg-slate-50/50 text-[11px]">
          <div className="flex items-center justify-between text-purple-950/70 mb-1">
            <span>Primary Node:</span>
            <strong className="text-purple-950 font-mono">IN-BLR-AGRI-01</strong>
          </div>
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span>System Status:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              99.98% Uptime
            </span>
          </div>
        </div>
      </aside>

      {/* -----------------------------------------------------------------------
          MAIN ADMIN WORKSPACE
         ----------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-purple-950/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-purple-950"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-purple-950 capitalize">
                {adminSidebarItems.find((s) => s.id === activeTab)?.label || 'Admin Headquarters'}
              </h1>
              <p className="text-[11px] text-purple-950/70">
                Ministry of Agriculture APMC e-NAM Interface &bull; Direct Escrow Arbitrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> APMC Sync 100%
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-600" /> Latency 88ms
              </span>
            </div>

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

        {/* Workspace Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* ===================================================================
              1. OVERVIEW (System Health + Recharts Volume + API Latency)
             =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Telemetry Health Strip */}
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl shadow-purple-950/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#581c87] to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-purple-950">
                        National Agricultural Commerce Telemetry Command
                      </h2>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 font-bold border border-purple-300">
                        Super Admin Level 3
                      </span>
                    </div>
                    <p className="text-xs text-purple-950/70">
                      Live cluster oversight across 48 National APMC Mandis &bull; Multi-party escrow enforcement
                    </p>
                    <p className="text-[11px] text-purple-800 font-semibold mt-0.5">
                      Open-Meteo Weather: OK &bull; Gemini AI: Healthy &bull; Sentinel Hub: Synchronized
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="px-4 py-2 rounded-full bg-purple-100 border border-purple-300 text-purple-950 text-xs font-bold hover:bg-purple-200 transition-all cursor-pointer"
                  >
                    KYC Desk ({pendingKycCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="px-4 py-2 rounded-full bg-[#581c87] text-white text-xs font-bold hover:bg-[#6b21a8] transition-all cursor-pointer"
                  >
                    Arbitration ({pendingDisputesCount})
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <span className="text-xs text-purple-950/70 font-semibold">Registered Ecosystem Users</span>
                  <div className="text-2xl font-black text-purple-950">44,600+</div>
                  <p className="text-[10px] text-emerald-700 font-semibold">26.4k Farmers &bull; 18.2k Buyers</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <span className="text-xs text-purple-950/70 font-semibold">24h Escrow Throughput</span>
                  <div className="text-2xl font-black text-emerald-900">₹{activeEscrowCr} Cr</div>
                  <p className="text-[10px] text-emerald-700 font-semibold">Zero unresolved defaults</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <span className="text-xs text-purple-950/70 font-semibold">Cumulative Platform Volume</span>
                  <div className="text-2xl font-black text-purple-950">₹{totalVolumeCr} Cr</div>
                  <p className="text-[10px] text-purple-700 font-semibold">Direct-from-farm contracts</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md space-y-2">
                  <span className="text-xs text-purple-950/70 font-semibold">AI Inferences Today</span>
                  <div className="text-2xl font-black text-cyan-950">142,800</div>
                  <p className="text-[10px] text-cyan-700 font-semibold">Average latency 320ms</p>
                </div>
              </div>

              {/* Recharts Platform Growth & API Latency */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-700" /> Platform Registration &amp; Escrow Growth (₹ Cr)
                      </h3>
                      <p className="text-[11px] text-purple-950/70">
                        Monthly active registered farmers, wholesale buyers, and cumulative escrow volume
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="escrowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#3b0764', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="escrowCr" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#escrowGrad)" name="Escrow Throughput (₹ Cr)" />
                        <Line type="monotone" dataKey="farmers" stroke="#10B981" strokeWidth={2} name="Farmer Base" />
                        <Line type="monotone" dataKey="buyers" stroke="#00B8F0" strokeWidth={2} name="Buyer Base" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-600" /> API Integration Latency (ms)
                    </h3>
                    <p className="text-[11px] text-purple-950/70">Response times across third-party endpoints</p>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={apiLatencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="ms" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="agmarknet" stroke="#10B981" strokeWidth={2} name="Agmarknet API" />
                        <Line type="monotone" dataKey="openMeteo" stroke="#00B8F0" strokeWidth={2} name="Open-Meteo" />
                        <Line type="monotone" dataKey="gemini" stroke="#F5A623" strokeWidth={2} name="Gemini AI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              2. USER MANAGEMENT, 3. FARMER MGMT & 4. BUYER MGMT (KYC DESK)
             =================================================================== */}
          {(activeTab === 'users' || activeTab === 'farmers' || activeTab === 'buyers') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-purple-950">
                    Identity Verification Desk (KYC &amp; Licensing)
                  </h2>
                  <p className="text-xs text-purple-950/70">
                    Audit government documents (Aadhaar, Land Registry, APMC License, GSTIN) and approve verified badges.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {pendingKycCount} Approvals Pending
                </span>
              </div>

              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#581c87] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Entity Name</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Document Type</th>
                        <th className="py-3.5 px-4">Doc / License ID</th>
                        <th className="py-3.5 px-4">Submission Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/10">
                      {kycRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-purple-50/50">
                          <td className="py-3.5 px-4 font-bold text-purple-950">{req.userName}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold capitalize">
                              {req.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">{req.documentType}</td>
                          <td className="py-3.5 px-4 font-mono">{req.documentNumber}</td>
                          <td className="py-3.5 px-4 text-gray-500">{req.submittedAt}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                                req.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : req.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => verifyKYC(req.id, true)}
                                  className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => verifyKYC(req.id, false)}
                                  className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-400 text-[10px] italic">Verified</span>
                            )}
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
              5. PRODUCT MANAGEMENT & 7. MARKETPLACE MONITORING
             =================================================================== */}
          {(activeTab === 'products' || activeTab === 'marketplace') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-purple-950">Produce Moderation &amp; Quality Enforcement</h2>
                  <p className="text-xs text-purple-950/70">
                    Inspect marketplace produce listings, verify AI grade certificates, and suppress deceptive entries.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-950 font-bold">
                  {crops.length} Total Lots in Network
                </span>
              </div>

              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#581c87] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Crop Name</th>
                        <th className="py-3 px-4">Producer Name</th>
                        <th className="py-3 px-4">Grade &amp; AI Score</th>
                        <th className="py-3 px-4">Ask Price</th>
                        <th className="py-3 px-4">Available Qty</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/10">
                      {crops.map((c) => (
                        <tr key={c.id} className="hover:bg-purple-50/50">
                          <td className="py-3 px-4 font-bold text-purple-950">{c.cropName}</td>
                          <td className="py-3 px-4">{c.farmerName} ({c.farmerLocation})</td>
                          <td className="py-3 px-4 font-bold text-emerald-700">{c.grade} ({c.qualityScore}%)</td>
                          <td className="py-3 px-4 font-black">₹{c.currentPrice}/kg</td>
                          <td className="py-3 px-4">{c.availableQuantityKg} kg</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => updateCropStatus(c.id, 'Approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateCropStatus(c.id, 'Rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold cursor-pointer"
                            >
                              Flag
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
              6. ORDER MANAGEMENT & DISPUTE ARBITRATION
             =================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-purple-950">Escrow Dispute Resolution Desk</h2>
                  <p className="text-xs text-purple-950/70">
                    Arbitrate delivery disputes between wholesale buyers and farmers with binding neutral determination.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-950 font-bold">
                  {disputes.length} Registered Arbitration Cases
                </span>
              </div>

              <div className="space-y-4">
                {disputes.map((disp) => (
                  <div
                    key={disp.id}
                    className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-950/10">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">CASE #{disp.id} &bull; ORDER #{disp.orderId}</span>
                        <h4 className="font-extrabold text-base text-purple-950">{disp.cropName} &bull; ₹{disp.amount.toLocaleString()} in Escrow</h4>
                        <p className="text-xs text-purple-950/70">Farmer: {disp.farmerName} vs Buyer: {disp.buyerName}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold self-start sm:self-center">
                        {disp.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1">
                      <span className="font-bold">Claim Summary:</span>
                      <p>{disp.reason}</p>
                    </div>

                    {disp.status === 'Under Review' ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <input
                          type="text"
                          placeholder="Arbitration notes / reason for determination..."
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-purple-950/20 text-xs outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDisputeResolution(disp.id, 'Release to Farmer')}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Release to Farmer
                          </button>
                          <button
                            onClick={() => handleDisputeResolution(disp.id, 'Refund Buyer')}
                            className="px-3.5 py-1.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold cursor-pointer"
                          >
                            Refund Buyer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-800 font-bold">
                        Determined: {disp.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              8. AGRICULTURAL ANALYTICS
             =================================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-4">
                <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-700" /> National Agricultural Price Analytics
                </h2>
                <p className="text-xs text-purple-950/70">
                  Real-time arrival volumes, mandi price spread, and cross-state price disparity indexes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                    <span className="text-[10px] font-bold uppercase text-purple-800 block">Kolar Hybrid Tomato</span>
                    <div className="text-2xl font-black text-purple-950 mt-1">₹32/kg</div>
                    <p className="text-[11px] text-gray-500">Spread vs Delhi: +₹9/kg arbitrage</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                    <span className="text-[10px] font-bold uppercase text-purple-800 block">Nashik Red Onion</span>
                    <div className="text-2xl font-black text-purple-950 mt-1">₹28/kg</div>
                    <p className="text-[11px] text-gray-500">Arrivals up 14% this morning</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                    <span className="text-[10px] font-bold uppercase text-purple-800 block">Mandya Sona Masoori</span>
                    <div className="text-2xl font-black text-purple-950 mt-1">₹58/kg</div>
                    <p className="text-[11px] text-gray-500">Stable demand profile</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              9. AI & ML MONITORING & 10. API INTEGRATION MONITORING
             =================================================================== */}
          {(activeTab === 'ai-health' || activeTab === 'api-monitor') && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-700" /> AI &amp; External API Health Telemetry
                  </h2>
                  <p className="text-xs text-purple-950/70 mt-1">
                    Continuous uptime monitoring across Google Gemini, Agmarknet API, Open-Meteo, and Sentinel Hub.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-purple-950/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-950">Agmarknet / data.gov.in</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xl font-black text-purple-950">99.8% Online</div>
                    <p className="text-[10px] text-gray-500">Latency: 190ms &bull; 48 Mandis</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-purple-950/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-950">Open-Meteo Weather</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xl font-black text-purple-950">100.0% Online</div>
                    <p className="text-[10px] text-gray-500">Latency: 85ms &bull; Kolar Agrometeorology</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-purple-950/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-950">Google Gemini Models</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xl font-black text-purple-950">99.9% Online</div>
                    <p className="text-[10px] text-gray-500">Latency: 320ms &bull; Multilingual Prompting</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-purple-950/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-950">Cloud Firestore DB</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xl font-black text-purple-950">100.0% Online</div>
                    <p className="text-[10px] text-gray-500">Latency: 28ms &bull; Asia-East1</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              11. REPORTS & 13. AUDIT LOGS
             =================================================================== */}
          {(activeTab === 'reports' || activeTab === 'audit') && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-700" /> Tamper-Evident Administrative Audit Ledger
                  </h2>
                  <p className="text-xs text-purple-950/70 mt-1">
                    Immutable log of all regulatory KYC verifications, escrow releases, and platform parameter adjustments.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 flex items-center justify-between">
                    <span>[2026-11-01 09:30:12] APMC Mandi sync executed (48 nodes refreshed, 0 errors)</span>
                    <span className="text-emerald-400">SUCCESS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 flex items-center justify-between">
                    <span>[2026-11-01 08:45:22] Escrow contract #ord-001 released ₹96,000 to Farmer ID usr-farmer-01</span>
                    <span className="text-emerald-400">ESCROW_PAID</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 flex items-center justify-between">
                    <span>[2026-11-01 07:15:05] KYC verified for Ramesh Patel (Aadhaar KA-7891238901)</span>
                    <span className="text-cyan-400">KYC_APPROVED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              12. NOTIFICATIONS & EMERGENCY BROADCASTS
             =================================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-purple-700" /> Emergency Agricultural Broadcast Center
                  </h2>
                  <p className="text-xs text-purple-950/70 mt-1">
                    Send high-priority push notifications and SMS warnings to thousands of farmers and buyers instantly.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-purple-950 block mb-1">Severity Category</label>
                    <select
                      value={broadcastSeverity}
                      onChange={(e: any) => setBroadcastSeverity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-950/15 outline-none"
                    >
                      <option value="Warning">Warning (Pest / Market Fluctuation)</option>
                      <option value="Urgent">Urgent (Hailstorm / Cyclone Advisory)</option>
                      <option value="Info">Info (Government Subsidy Notification)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-purple-950 block mb-1">Broadcast Message Body</label>
                    <textarea
                      rows={3}
                      placeholder="Type the message to be translated and broadcast across 8 Indian languages..."
                      value={emergencyAlertText}
                      onChange={(e) => setEmergencyAlertText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-950/15 outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!emergencyAlertText) return;
                      alert(`Emergency broadcast successfully queued for 26,400 farmers!`);
                      setEmergencyAlertText('');
                    }}
                    className="w-full py-3 rounded-full bg-[#581c87] hover:bg-[#6b21a8] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Broadcast Alert Across 8 Languages
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              14. PLATFORM SETTINGS
             =================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-purple-700" /> Platform Governance Settings
                  </h2>
                  <p className="text-xs text-purple-950/70 mt-1">
                    Configure escrow commission percentage, AI rate limits, and verification policies.
                  </p>
                </div>

                {settingsSaved && (
                  <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Platform parameters saved and applied across cluster!</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-purple-950 block mb-1">Escrow Commission Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={platformCommission}
                      onChange={(e) => setPlatformCommission(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-purple-950/15 outline-none font-bold"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Current platform fee deducted from wholesale buyer transactions.
                    </span>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-950">
                      <input
                        type="checkbox"
                        checked={kycAutoVerification}
                        onChange={(e) => setKycAutoVerification(e.target.checked)}
                        className="rounded text-purple-800"
                      />
                      <span>Enable Automated OCR Land Record Verification</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setSettingsSaved(true);
                      setTimeout(() => setSettingsSaved(false), 3000);
                    }}
                    className="px-6 py-3 rounded-full bg-[#581c87] hover:bg-[#6b21a8] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Platform Parameters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
