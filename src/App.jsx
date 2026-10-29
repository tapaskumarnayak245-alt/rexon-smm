import React, { useState } from 'react';
import { 
  Shield, User, DollarSign, Globe, ShoppingCart, ListOrdered, 
  Layers, PlusCircle, Settings, CheckCircle, RefreshCw, AlertTriangle, 
  Smartphone, ExternalLink, ArrowRight, Lock, Key, Percent
} from 'lucide-react';

// --- INITIAL SERVICES DATA (INCLUDING FACEBOOK & MULTI-SUPPLIER) ---
const INITIAL_SERVICES = [
  // Instagram
  { id: 101, provider: 'SMMWIZ', providerServiceId: '1201', platform: 'Instagram', category: 'Instagram Followers', name: 'Instagram Followers [Real & Active]', rateUSD: 2.50, min: 50, max: 10000, speed: 'Fast (5k/day)', guarantee: '30 Days' },
  { id: 102, provider: 'ORANGE', providerServiceId: '3402', platform: 'Instagram', category: 'Instagram Likes', name: 'Instagram Post Likes [Instant Speed]', rateUSD: 0.80, min: 20, max: 50000, speed: 'Instant', guarantee: 'Non-Drop' },
  { id: 103, provider: 'JAP', providerServiceId: '5603', platform: 'Instagram', category: 'Instagram Reels Views', name: 'Instagram Reels Views [High Retention]', rateUSD: 0.20, min: 100, max: 1000000, speed: 'Instant (100k/hr)', guarantee: 'None' },
  
  // Facebook (Fully Integrated)
  { id: 109, provider: 'SMMWIZ', providerServiceId: '7011', platform: 'Facebook', category: 'Facebook Page Likes', name: 'Facebook Page Likes & Followers [High Quality]', rateUSD: 3.20, min: 50, max: 5000, speed: '2k/day', guarantee: '30 Days Refill' },
  { id: 110, provider: 'ORANGE', providerServiceId: '7205', platform: 'Facebook', category: 'Facebook Reels Views', name: 'Facebook Video & Reel Views [Instant Start]', rateUSD: 0.35, min: 100, max: 500000, speed: 'Instant', guarantee: 'None' },
  { id: 111, provider: 'SMMWIZ', providerServiceId: '7310', platform: 'Facebook', category: 'Facebook Post Likes', name: 'Facebook Post Likes & Emoji Reactions', rateUSD: 1.10, min: 50, max: 10000, speed: 'Fast', guarantee: '30 Days' },
  { id: 112, provider: 'JAP', providerServiceId: '7490', platform: 'Facebook', category: 'Facebook Monetization', name: 'Facebook In-Stream Ads Watch Time [Non-Drop]', rateUSD: 12.00, min: 500, max: 10000, speed: '500hrs/day', guarantee: 'Lifetime' },

  // YouTube
  { id: 104, provider: 'JAP', providerServiceId: '2104', platform: 'YouTube', category: 'YouTube Views', name: 'YouTube High Retention Views [Monetization Safe]', rateUSD: 4.50, min: 500, max: 50000, speed: '5k/day', guarantee: 'Lifetime' },
  { id: 105, provider: 'MORETHAN', providerServiceId: '8801', platform: 'YouTube', category: 'YouTube Subscribers', name: 'YouTube Permanent Subscribers [Top Tier]', rateUSD: 15.00, min: 10, max: 5000, speed: '200/day', guarantee: '30 Days' },

  // TikTok & Telegram
  { id: 106, provider: 'ORANGE', providerServiceId: '4102', platform: 'TikTok', category: 'TikTok Views', name: 'TikTok Viral Views [Super Fast]', rateUSD: 0.15, min: 100, max: 2000000, speed: 'Instant', guarantee: 'None' },
  { id: 107, provider: 'SMMWIZ', providerServiceId: '9901', platform: 'Telegram', category: 'Telegram Members', name: 'Telegram Channel Members [Real US/Global]', rateUSD: 3.00, min: 100, max: 50000, speed: '10k/day', guarantee: '30 Days' }
];

export default function App() {
  // --- STATES ---
  // Mandatory First-Load Region Prompt
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [userRegion, setUserRegion] = useState('IN'); // 'IN' or 'INT'
  
  const [viewMode, setViewMode] = useState('client'); // 'client' or 'admin'
  const [activeTab, setActiveTab] = useState('order'); // 'order', 'mass', 'services', 'addfunds', 'history'
  
  // Wallet & Currency
  const [balanceUSD, setBalanceUSD] = useState(25.00);
  const exchangeRateINR = 85.00; // $1 = ₹85
  
  // Admin Config
  const [markupPercent, setMarkupPercent] = useState(75); // Default +75% profit
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [providerKeys, setProviderKeys] = useState({
    SMMWIZ: 'key_smmwiz_9982x',
    JAP: 'key_jap_4411z',
    ORANGE: 'key_orange_7733a',
    MORETHAN: 'key_mtp_5522b'
  });

  // Client Order States
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [selectedCategory, setSelectedCategory] = useState('Instagram Followers');
  const [selectedServiceId, setSelectedServiceId] = useState(101);
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1000);
  const [massOrderText, setMassOrderText] = useState('');
  const [orderHistory, setOrderHistory] = useState([
    { id: 8812, service: 'Instagram Followers [Real & Active]', link: 'https://instagram.com/p/sample', qty: 1000, cost: 4.38, status: 'Completed', date: '2026-03-30' },
    { id: 8813, service: 'Facebook Page Likes & Followers', link: 'https://facebook.com/samplepage', qty: 500, cost: 2.80, status: 'Processing', date: '2026-03-30' }
  ]);

  // Add Funds States
  const [depositAmount, setDepositAmount] = useState(10);
  const [utrNumber, setUtrNumber] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);

  // --- CALCULATIONS ---
  const currentService = services.find(s => s.id === Number(selectedServiceId)) || services[0];
  const retailRatePer1k = currentService.rateUSD * (1 + markupPercent / 100);
  const calculatedTotalUSD = (retailRatePer1k * (orderQuantity / 1000)).toFixed(2);
  const calculatedTotalINR = (calculatedTotalUSD * exchangeRateINR).toFixed(2);

  const displayBalance = userRegion === 'IN' 
    ? `₹${(balanceUSD * exchangeRateINR).toLocaleString('en-IN', {maximumFractionDigits: 2})}` 
    : `$${balanceUSD.toFixed(2)}`;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const cost = parseFloat(calculatedTotalUSD);
    if (balanceUSD < cost) {
      alert("Insufficient wallet balance! Please add funds.");
      setActiveTab('addfunds');
      return;
    }
    setBalanceUSD(prev => prev - cost);
    const newOrder = {
      id: Math.floor(Math.random() * 89999 + 10000),
      service: currentService.name,
      link: orderLink || 'https://example.com/target',
      qty: Number(orderQuantity),
      cost: cost,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setOrderHistory([newOrder, ...orderHistory]);
    alert("Order placed successfully and routed to wholesale provider API!");
    setOrderLink('');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const usdValue = userRegion === 'IN' ? depositAmount / exchangeRateINR : depositAmount;
    setBalanceUSD(prev => prev + usdValue);
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setUtrNumber('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">

      {/* ================= FIRST-LOAD REGION SELECTION MODAL ================= */}
      {showInitialModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl shadow-cyan-950/50">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Globe className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white mb-2">REXON SMM PANEL</h1>
            <p className="text-slate-400 text-sm mb-6">Select your region to load local payment gateways and currency formatting.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => { setUserRegion('IN'); setShowInitialModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">🇮🇳</span>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300">Indian Client</div>
                    <div className="text-xs text-slate-400">Pay via UPI / Paytm QR (INR ₹)</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </button>

              <button 
                onClick={() => { setUserRegion('INT'); setShowInitialModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300">International Client</div>
                    <div className="text-xs text-slate-400">Pay via USDT / Crypto / Cards ($)</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NAVIGATION HEADER ================= */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 text-black font-black px-3 py-1 rounded-lg tracking-wider text-sm shadow-lg shadow-cyan-500/20">
            REXON
          </div>
          <button 
            onClick={() => setUserRegion(userRegion === 'IN' ? 'INT' : 'IN')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-400"
          >
            <Globe className="w-3.5 h-3.5" />
            {userRegion === 'IN' ? '🇮🇳 IN (₹)' : '🌍 INT ($)'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs text-emerald-400 font-bold">{displayBalance}</span>
          </div>

          <button 
            onClick={() => setViewMode(viewMode === 'client' ? 'admin' : 'client')}
            className={`p-2 rounded-xl border transition-all ${
              viewMode === 'admin' 
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Toggle Admin Panel"
          >
            {viewMode === 'admin' ? <Shield className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">

        {/* --- VIEW MODE: ADMIN PANEL --- */}
        {viewMode === 'admin' ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Executive Admin Dashboard
                </h2>
                <p className="text-xs text-slate-400">Manage supplier API keys, profit margins, and global exchange rates.</p>
              </div>
              <button 
                onClick={() => setViewMode('client')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold"
              >
                Exit Admin
              </button>
            </div>

            {/* Profit Margin & Exchange Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Global Profit Markup Slider (+{markupPercent}%)
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="300" 
                  value={markupPercent} 
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>+10% (Low)</span>
                  <span>+75% (Recommended)</span>
                  <span>+300% (High)</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  USD to INR Exchange Rate
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-400">$1 =</span>
                  <input 
                    type="number" 
                    value={exchangeRateINR} 
                    disabled 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-sm font-bold text-emerald-400">₹</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Automatically converts Indian UPI deposits to USD base balance.</p>
              </div>
            </div>

            {/* Supplier API Keys Config */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" /> Wholesale Supplier API Integration (v2 Protocol)
              </h3>
              <div className="space-y-3">
                {Object.entries(providerKeys).map(([prov, keyVal]) => (
                  <div key={prov} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-750">
                    <span className="text-xs font-bold text-cyan-400 w-32">{prov} API Key</span>
                    <input 
                      type="password" 
                      value={keyVal} 
                      onChange={(e) => setProviderKeys({...providerKeys, [prov]: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
                    />
                    <span className="text-[10px] text-emerald-400 px-2 py-1 bg-emerald-950/50 rounded border border-emerald-500/20 text-center">Connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* --- VIEW MODE: CLIENT PANEL --- */
          <div className="space-y-6">

            {/* Client Navigation Tabs */}
            <div className="grid grid-cols-5 gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('order')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${activeTab === 'order' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <ShoppingCart className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Order</span>
              </button>
              <button 
                onClick={() => setActiveTab('mass')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${activeTab === 'mass' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Layers className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Mass</span>
              </button>
              <button 
                onClick={() => setActiveTab('services')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${activeTab === 'services' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <ListOrdered className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Services</span>
              </button>
              <button 
                onClick={() => setActiveTab('addfunds')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${activeTab === 'addfunds' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <PlusCircle className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">Deposit</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${activeTab === 'history' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <RefreshCw className="w-4 h-4" /> <span className="text-[10px] sm:text-xs">History</span>
              </button>
            </div>

            {/* --- TAB 1: NEW ORDER --- */}
            {activeTab === 'order' && (
              <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" /> New Order
                </h2>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  {/* Platform Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Platform</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Telegram'].map(plat => (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => {
                            setSelectedPlatform(plat);
                            const firstMatch = services.find(s => s.platform === plat);
                            if(firstMatch) {
                              setSelectedCategory(firstMatch.category);
                              setSelectedServiceId(firstMatch.id);
                            }
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${selectedPlatform === plat ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'}`}
                        >
                          {plat}
                        </buttom>
                     </div>
                   </div>
                  );
                 }
                      
              
