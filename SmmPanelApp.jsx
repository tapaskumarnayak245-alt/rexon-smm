<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REXON SMM Panel - Wholesale Social Media Marketing</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            slate: { 750: '#203049', 850: '#131d2e', 950: '#0a0f1d' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    const generateMassServices = () => {
      const platforms = [
        { name: 'Instagram', cat: 'Followers', base: 2.10, prefix: 'IG Real Active Followers' },
        { name: 'Instagram', cat: 'Likes', base: 0.50, prefix: 'IG Instant Post Likes' },
        { name: 'Instagram', cat: 'Reels Views', base: 0.15, prefix: 'IG High Retention Reels Views' },
        { name: 'Facebook', cat: 'Page Likes', base: 3.00, prefix: 'FB Page Followers & Likes' },
        { name: 'Facebook', cat: 'Video Views', base: 0.30, prefix: 'FB Monetization Video Views' },
        { name: 'YouTube', cat: 'Views', base: 3.50, prefix: 'YT High Retention Watchtime Views' },
        { name: 'YouTube', cat: 'Subscribers', base: 12.00, prefix: 'YT Permanent Subs [Non-Drop]' },
        { name: 'TikTok', cat: 'Views', base: 0.12, prefix: 'TikTok Viral Super Fast Views' },
        { name: 'TikTok', cat: 'Followers', base: 4.00, prefix: 'TikTok Active Profile Followers' },
        { name: 'Telegram', cat: 'Members', base: 2.50, prefix: 'Telegram Global Channel Members' },
        { name: 'Twitter', cat: 'Followers', base: 3.20, prefix: 'X / Twitter Targeted Followers' },
        { name: 'Spotify', cat: 'Streams', base: 1.10, prefix: 'Spotify Monthly Listeners & Streams' },
        { name: 'LinkedIn', cat: 'Connections', base: 8.50, prefix: 'LinkedIn Professional Followers' },
        { name: 'Twitch', cat: 'Channel Followers', base: 5.00, prefix: 'Twitch Live Stream Viewers' },
        { name: 'Threads', cat: 'Followers', base: 2.80, prefix: 'Threads Engagement Pack' }
      ];

      let list = [];
      let idCounter = 101;
      const providers = ['SMMWIZ', 'JAP', 'ORANGE', 'MORETHAN'];

      platforms.forEach((p, pIdx) => {
        for (let i = 1; i <= 20; i++) {
          list.push({
            id: idCounter++,
            provider: providers[(idCounter + pIdx) % providers.length],
            providerServiceId: `${2000 + idCounter}`,
            platform: p.name,
            category: `${p.name} ${p.cat}`,
            name: `${p.prefix} (#${i} - Tier ${Math.ceil(i/5)})`,
            rateUSD: Number((p.base + (i * 0.05)).toFixed(2)),
            min: i % 2 === 0 ? 50 : 100,
            max: i % 2 === 0 ? 10000 : 50000,
            speed: i % 3 === 0 ? 'Instant' : 'Fast (10k/day)',
            guarantee: i % 4 === 0 ? '30 Days Refill' : 'Lifetime Guarantee'
          });
        }
      });
      return list;
    };

    const INITIAL_SERVICES = generateMassServices();

    function App() {
      const [showInitialModal, setShowInitialModal] = useState(true);
      const [userRegion, setUserRegion] = useState('IN');
      const [viewMode, setViewMode] = useState('client');
      const [activeTab, setActiveTab] = useState('order');
      
      const [balanceUSD, setBalanceUSD] = useState(25.00);
      const exchangeRateINR = 85.00;
      
      const [markupPercent, setMarkupPercent] = useState(75); 
      const [services, setServices] = useState(INITIAL_SERVICES);
      const [providerKeys, setProviderKeys] = useState({
        SMMWIZ: 'key_smmwiz_9982x',
        JAP: 'key_jap_4411z',
        ORANGE: 'key_orange_7733a',
        MORETHAN: 'key_mtp_5522b'
      });

      const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
      const [selectedCategory, setSelectedCategory] = useState('Instagram Followers');
      const [selectedServiceId, setSelectedServiceId] = useState(101);
      const [orderLink, setOrderLink] = useState('');
      const [orderQuantity, setOrderQuantity] = useState(1000);
      const [massOrderText, setMassOrderText] = useState('');
      const [serviceSearchQuery, setServiceSearchQuery] = useState('');
      
      const [orderHistory, setOrderHistory] = useState([
        { id: 8812, service: 'IG Real Active Followers (#1 - Tier 1)', link: 'https://instagram.com/sample', qty: 1000, cost: 3.68, status: 'Completed', date: '2026-03-30' },
        { id: 8813, service: 'FB Page Followers & Likes (#2 - Tier 1)', link: 'https://facebook.com/samplepage', qty: 500, cost: 2.63, status: 'Processing', date: '2026-03-30' }
      ]);

      const [depositAmount, setDepositAmount] = useState(500);
      const [utrNumber, setUtrNumber] = useState('');
      const [depositSuccess, setDepositSuccess] = useState(false);

      const currentService = services.find(s => s.id === Number(selectedServiceId)) || services[0];
      const retailRatePer1k = currentService.rateUSD * (1 + markupPercent / 100);
      const calculatedTotalUSD = (retailRatePer1k * (orderQuantity / 1000)).toFixed(2);
      const calculatedTotalINR = (calculatedTotalUSD * exchangeRateINR).toFixed(2);

      const displayBalance = userRegion === 'IN' 
        ? `₹${(balanceUSD * exchangeRateINR).toLocaleString('en-IN', {maximumFractionDigits: 2})}` 
        : `$${balanceUSD.toFixed(2)}`;

      const filteredPlatforms = ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Telegram', 'Twitter', 'Spotify', 'LinkedIn', 'Twitch', 'Threads'];
      const currentPlatformServices = services.filter(s => s.platform === selectedPlatform);
      const categoriesForPlatform = Array.from(new Set(currentPlatformServices.map(s => s.category)));
      const servicesForCategory = currentPlatformServices.filter(s => s.category === selectedCategory);

      useEffect(() => {
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });

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

      const searchedServicesList = useMemo(() => {
        if(!serviceSearchQuery) return services;
        return services.filter(s => s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) || s.platform.toLowerCase().includes(serviceSearchQuery.toLowerCase()));
      }, [services, serviceSearchQuery]);

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
          {showInitialModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl shadow-cyan-950/50">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <i data-lucide="globe" className="w-8 h-8 animate-pulse"></i>
                </div>
                <h1 className="text-2xl font-black tracking-wider text-white mb-2">REXON SMM PANEL</h1>
                <p className="text-slate-400 text-sm mb-6">Select your region to load local payment gateways and currency formatting.</p>
                
                <div className="space-y-3">
                  <button 
                    type="button"
                    onClick={() => { setUserRegion('IN'); setShowInitialModal(false); }}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">🇮🇳</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-300">Indian Client</div>
                        <div className="text-xs text-slate-400">Pay via UPI / Paytm QR (INR ₹)</div>
                      </div>
                    </div>
                    <i data-lucide="arrow-right" className="w-5 h-5 text-cyan-400"></i>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setUserRegion('INT'); setShowInitialModal(false); }}
                    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-300">International Client</div>
                        <div className="text-xs text-slate-400">Pay via USDT / Crypto / Cards ($)</div>
                      </div>
                    </div>
                    <i data-lucide="arrow-right" className="w-5 h-5 text-slate-400"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 text-black font-black px-3 py-1 rounded-lg tracking-wider text-sm shadow-lg shadow-cyan-500/20">
                REXON SMM
              </div>
              <button 
                type="button"
                onClick={() => setUserRegion(userRegion === 'IN' ? 'INT' : 'IN')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-400 cursor-pointer"
              >
                <i data-lucide="globe" className="w-3.5 h-3.5"></i>
                {userRegion === 'IN' ? '🇮🇳 IN (₹)' : '🌍 INT ($)'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs text-emerald-400 font-bold">{displayBalance}</span>
              </div>

              <button 
                type="button"
                onClick={() => setViewMode(viewMode === 'client' ? 'admin' : 'client')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  viewMode === 'admin' 
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
                title="Toggle Admin Panel"
              >
                {viewMode === 'admin' ? <i data-lucide="shield" className="w-4 h-4"></i> : <i data-lucide="settings" className="w-4 h-4"></i>}
              </button>
            </div>
          </header>

          <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
            {viewMode === 'admin' ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                      <i data-lucide="shield" className="w-5 h-5"></i> Executive Admin Dashboard
                    </h2>
                    <p className="text-xs text-slate-400">Manage supplier API keys, profit margins, and global exchange rates for 300+ services.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setViewMode('client')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Exit Admin
                  </button>
                </div>

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

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <i data-lucide="key" className="w-4 h-4 text-cyan-400"></i> Wholesale Supplier API Integration ({services.length} Active Services)
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
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('order')}
                    className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === 'order' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <i data-lucide="shopping-cart" className="w-4 h-4"></i> <span className="text-[10px] sm:text-xs">Order</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('mass')}
                    className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === 'mass' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <i data-lucide="layers" className="w-4 h-4"></i> <span className="text-[10px] sm:text-xs">Mass</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === 'services' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <i data-lucide="list-ordered" className="w-4 h-4"></i> <span className="text-[10px] sm:text-xs">Services</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('addfunds')}
                    className={`py-2 px-1 text-xs font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === 'addfunds' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <i data-lucide="plus-circle" className="w-4 h-4"></i> <span className="text-[10px] sm:text-xs">Deposit</span>
                  </button>
                  <button 
   
