import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC<{ navigate: (path: string) => void; initialTab?: string }> = ({
  navigate,
  initialTab = 'overview',
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    crops,
    updateCropStatus,
    orders,
    kycRequests,
    verifyKYC,
    disputes,
    resolveDispute,
    mandiPrices,
    advisoryAlerts,
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Metrics
  const totalVolumeCr = 145.8;
  const activeEscrowCr = 12.4;
  const platformRevenueLakhs = 84.5;
  const pendingKycCount = kycRequests.filter((k) => k.status === 'Pending').length;
  const pendingDisputesCount = disputes.filter((d) => d.status === 'Under Review').length;

  const adminTabs = [
    { id: 'overview', label: '⚙️ Admin Headquarters', icon: Shield },
    { id: 'kyc', label: '🆔 KYC Verification Desk', icon: Users },
    { id: 'moderation', label: '📦 Produce Moderation', icon: CheckCircle },
    { id: 'disputes', label: '⚖️ Escrow Dispute Center', icon: Scale },
    { id: 'mandi', label: '📈 Mandi Benchmark Feeds', icon: TrendingUp },
    { id: 'ai-health', label: '🤖 AI Model Health & Telemetry', icon: Activity },
    { id: 'advisories', label: '📢 Emergency Broadcasts', icon: Radio },
  ];

  return (
    <div className="min-h-screen text-[#064e3b] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-xl shadow-[#064e3b08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 border-2 border-purple-300 flex items-center justify-center shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#064e3b]">AGRITECH Regulatory Command Headquarters</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 font-bold border border-purple-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-[#064e3b80]">
              National Agricultural Commerce Governance • Escrow Safeguards & Anti-Fraud Security
            </p>
            <p className="text-[11px] text-purple-800 font-semibold mt-0.5">
              System Uptime: 99.98% • Active APMC Feeds: 48 • 0 Security Breaches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#f1f5f2] border border-[#064e3b20] text-xs font-mono text-[#064e3b]">
            Node: IN-BLR-AGRI-01
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {adminTabs.map((tab) => {
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

      {/* 1. MASTER OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <span className="text-[#064e3b70] text-xs">Total Platform GMV</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#064e3b]">₹{totalVolumeCr} Cr</span>
              </div>
              <p className="text-[10px] text-purple-700 font-semibold">+22.4% MoM growth</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <span className="text-[#064e3b70] text-xs">Locked Escrow Vaults</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-800">₹{activeEscrowCr} Cr</span>
              </div>
              <p className="text-[10px] text-cyan-700 font-semibold">100% Solvency Guaranteed</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <span className="text-[#064e3b70] text-xs">Pending KYC Approvals</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-800">{pendingKycCount}</span>
                <span className="text-xs text-[#064e3b70]">Farmers & Buyers</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">SLA: &lt; 2 hrs turn-around</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-2">
              <span className="text-[#064e3b70] text-xs">Open Escrow Disputes</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-800">{pendingDisputesCount}</span>
                <span className="text-xs text-[#064e3b70]">Claims</span>
              </div>
              <p className="text-[10px] text-rose-700 font-semibold">Quality & delivery mediation</p>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending KYC Desk */}
            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" /> Recent KYC Verification Submissions
                </h3>
                <button onClick={() => setActiveTab('kyc')} className="text-xs text-purple-700 font-semibold hover:underline cursor-pointer">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {kycRequests.map((k) => (
                  <div key={k.id} className="p-3.5 bg-[#f1f5f2]/70 rounded-2xl border border-[#064e3b10] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#064e3b]">{k.userName} ({k.userRole.toUpperCase()})</div>
                      <span className="text-[#064e3b70]">{k.docType}: {k.docNumber}</span>
                    </div>
                    {k.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => verifyKYC(k.id, 'Approved')}
                          className="px-3 py-1 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-[11px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => verifyKYC(k.id, 'Rejected')}
                          className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px] border border-emerald-300">
                        {k.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Escrow Disputes */}
            <div className="p-6 rounded-3xl bg-white border border-[#064e3b15] shadow-lg shadow-[#064e3b05] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#064e3b] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-700" /> Escrow Dispute Arbitration Queue
                </h3>
                <button onClick={() => setActiveTab('disputes')} className="text-xs text-purple-700 font-semibold hover:underline cursor-pointer">
                  Arbitrate
                </button>
              </div>

              <div className="space-y-3">
                {disputes.map((d) => (
                  <div key={d.id} className="p-3.5 bg-[#f1f5f2]/70 rounded-2xl border border-[#064e3b10] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#064e3b]">{d.cropName} ({d.buyerName} vs {d.farmerName})</span>
                      <span className="text-amber-800 font-bold">₹{d.disputedAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[#064e3b70] text-[11px]">{d.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KYC VERIFICATION DESK */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">National Farmer & Wholesale Buyer KYC Registry</h3>
            <p className="text-xs text-[#064e3b70]">Validate Kisan Cards, Aadhaar land titles, and Corporate GSTIN certifications</p>
          </div>

          <div className="rounded-3xl border border-[#064e3b15] bg-white overflow-hidden shadow-lg shadow-[#064e3b05]">
            <table className="w-full text-left text-xs text-[#064e3b]">
              <thead className="bg-[#f1f5f2] text-[#064e3b80] uppercase text-[10px] border-b border-[#064e3b15]">
                <tr>
                  <th className="p-4">User Entity</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Document Type & Number</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064e3b10]">
                {kycRequests.map((k) => (
                  <tr key={k.id} className="hover:bg-[#f1f5f2]/50 transition-colors">
                    <td className="p-4 font-bold text-[#064e3b]">{k.userName}</td>
                    <td className="p-4 uppercase text-purple-700 font-bold">{k.userRole}</td>
                    <td className="p-4">
                      <div>{k.docType}</div>
                      <span className="text-[11px] text-[#064e3b70] font-mono">{k.docNumber}</span>
                    </td>
                    <td className="p-4 text-[#064e3b70]">{k.submittedDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          k.status === 'Approved'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                            : k.status === 'Pending'
                            ? 'bg-amber-100 border-amber-300 text-amber-950'
                            : 'bg-rose-100 border-rose-300 text-rose-950'
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {k.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => verifyKYC(k.id, 'Approved')}
                            className="px-3 py-1 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => verifyKYC(k.id, 'Rejected')}
                            className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PRODUCE MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Crop Listing Moderation & Anti-Gouging Auditing</h3>
            <p className="text-xs text-[#064e3b70]">Ensure fair benchmark price ceilings and authentic quality score disclosures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((c) => (
              <div key={c.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05] space-y-3">
                <div className="flex items-center gap-3">
                  <img src={c.images[0]} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-[#064e3b]">{c.cropName}</h4>
                    <p className="text-xs text-[#064e3b70]">{c.farmerName} • {c.farmerLocation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#f1f5f2]/70 p-2.5 rounded-2xl text-xs text-[#064e3b]">
                  <div>
                    <span className="text-[#064e3b70]">Listed Price:</span> <span className="font-bold text-emerald-800">₹{c.currentPrice}/kg</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70]">Mandi Benchmark:</span> <span className="font-bold text-[#064e3b]">₹{c.mandiBenchmarkPrice}/kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#064e3b10]">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-[10px]">
                    Status: {c.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateCropStatus(c.id, 'Approved')}
                      className="px-3 py-1 rounded-full bg-[#064e3b] text-white font-bold text-[11px] cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateCropStatus(c.id, 'Rejected')}
                      className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DISPUTE & ESCROW ARBITRATION */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">Escrow Dispute Arbitration Panel</h3>
            <p className="text-xs text-[#064e3b70]">Investigate quality claims, review lab reports, and release locked escrow funds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disputes.map((d) => (
              <div key={d.id} className="p-6 rounded-3xl bg-white border border-rose-300 shadow-lg shadow-rose-950/5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-rose-700 font-bold uppercase">Dispute #{d.orderId}</span>
                    <h4 className="text-lg font-bold text-[#064e3b]">{d.cropName}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold">
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#f1f5f2]/70 p-4 rounded-2xl border border-[#064e3b10] text-xs">
                  <div>
                    <span className="text-[#064e3b70] block">Buyer (Complainant)</span>
                    <span className="font-bold text-[#064e3b]">{d.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-[#064e3b70] block">Farmer (Supplier)</span>
                    <span className="font-bold text-[#064e3b]">{d.farmerName}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[#064e3b10]">
                    <span className="text-[#064e3b70] block">Disputed Escrow Fund</span>
                    <span className="text-lg font-black text-amber-800">₹{d.disputedAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#f1f5f2]/70 rounded-2xl border border-[#064e3b10] text-xs text-[#064e3b]">
                  <span className="font-bold text-[#064e3b] block mb-1">Claim Summary:</span>
                  {d.reason}
                </div>

                {d.status === 'Under Review' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => resolveDispute(d.id, 'Full Refund to Buyer', 'Lab evidence verified grade mismatch')}
                      className="py-2.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      Refund Buyer (100%)
                    </button>
                    <button
                      onClick={() => resolveDispute(d.id, 'Release to Farmer', 'Delivery met digital contract tolerance')}
                      className="py-2.5 rounded-full bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      Release to Farmer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MANDI BENCHMARK FEEDS */}
      {activeTab === 'mandi' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#064e3b]">APMC Mandi Price Feeds</h3>
              <p className="text-xs text-[#064e3b70]">Live feeds from major Indian commodity markets (Kolar, Azadpur, Vashi, Guntur, Nashik)</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" /> Real-Time Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mandiPrices.map((m) => (
              <div key={m.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-[#064e3b]">{m.crop}</h4>
                    <p className="text-xs text-[#064e3b70]">{m.mandi} ({m.state})</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold">
                    ₹{m.pricePerKg}/kg
                  </span>
                </div>

                <div className="text-xs text-[#064e3b80] space-y-1 bg-[#f1f5f2]/70 p-3 rounded-2xl border border-[#064e3b10]">
                  <div className="flex justify-between">
                    <span>Daily Arrival:</span>
                    <span className="font-bold text-[#064e3b]">{m.arrivalTons} Tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Range:</span>
                    <span className="text-[#064e3b80]">₹{(m.minPrice / 100).toFixed(0)} - ₹{(m.maxPrice / 100).toFixed(0)}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI 7-Day Forecast:</span>
                    <span className="text-emerald-800 font-bold">₹{m.ai7DayForecastPerKg}/kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI MODEL HEALTH & TELEMETRY */}
      {activeTab === 'ai-health' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">AI Neural Network & Model Diagnostics</h3>
            <p className="text-xs text-[#064e3b70]">Continuous telemetry on Price Prediction, Computer Vision Grading, and Multilingual LLM Engines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-md shadow-[#064e3b05] space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase">Model #1</span>
              <h4 className="text-base font-bold text-[#064e3b]">AgriMandi-Forecast-v4</h4>
              <p className="text-xs text-[#064e3b70]">APMC 7-Day Price Trajectory & Weather Vector Engine</p>
              <div className="pt-2 border-t border-[#064e3b10] text-xs space-y-1 text-[#064e3b80]">
                <div className="flex justify-between"><span>Inference Accuracy:</span><span className="text-emerald-800 font-bold">94.2%</span></div>
                <div className="flex justify-between"><span>Avg Latency:</span><span className="text-[#064e3b] font-bold">142 ms</span></div>
                <div className="flex justify-between"><span>24h Inferences:</span><span className="text-[#064e3b] font-bold">18,420</span></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-teal-200 shadow-md shadow-[#064e3b05] space-y-3">
              <span className="text-xs font-bold text-teal-800 uppercase">Model #2</span>
              <h4 className="text-base font-bold text-[#064e3b]">NeuralCrop-Vision-QA</h4>
              <p className="text-xs text-[#064e3b70]">Surface Defect, Brix Firmness & Morphological Grading</p>
              <div className="pt-2 border-t border-[#064e3b10] text-xs space-y-1 text-[#064e3b80]">
                <div className="flex justify-between"><span>Classification Precision:</span><span className="text-teal-800 font-bold">96.8%</span></div>
                <div className="flex justify-between"><span>Avg Latency:</span><span className="text-[#064e3b] font-bold">380 ms</span></div>
                <div className="flex justify-between"><span>24h Scans:</span><span className="text-[#064e3b] font-bold">4,120</span></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-md shadow-[#064e3b05] space-y-3">
              <span className="text-xs font-bold text-amber-800 uppercase">Model #3</span>
              <h4 className="text-base font-bold text-[#064e3b]">VernacularSpeech-LLM</h4>
              <p className="text-xs text-[#064e3b70]">8 Indian Languages Voice Tokenizer & Fair-Trade Arbitrator</p>
              <div className="pt-2 border-t border-[#064e3b10] text-xs space-y-1 text-[#064e3b80]">
                <div className="flex justify-between"><span>Speech WER:</span><span className="text-amber-800 font-bold">4.2%</span></div>
                <div className="flex justify-between"><span>Languages:</span><span className="text-[#064e3b] font-bold">8 Native</span></div>
                <div className="flex justify-between"><span>24h Dialogues:</span><span className="text-[#064e3b] font-bold">9,830</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. EMERGENCY BROADCASTS */}
      {activeTab === 'advisories' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#064e3b]">National Agro Advisory & Red Alert Broadcasts</h3>
            <p className="text-xs text-[#064e3b70]">Push emergency notifications to all registered farmers via SMS and WhatsApp</p>
          </div>

          <div className="space-y-4">
            {advisoryAlerts.map((a) => (
              <div key={a.id} className="p-5 rounded-3xl bg-white border border-[#064e3b15] shadow-md shadow-[#064e3b05] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-950 font-bold text-[10px]">
                      {a.type}
                    </span>
                    <h4 className="font-bold text-sm text-[#064e3b]">{a.title}</h4>
                  </div>
                  <p className="text-xs text-[#064e3b80]">{a.description}</p>
                  <p className="text-xs text-emerald-800 font-semibold">Action: {a.actionRequired}</p>
                </div>
                <span className="text-xs text-[#064e3b70] shrink-0">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
