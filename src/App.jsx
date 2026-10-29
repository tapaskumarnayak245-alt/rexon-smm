import React, { useState, useEffect } from 'react';

export default function App() {
  const [userRegion, setUserRegion] = useState('IN');
  const [activeTab, setActiveTab] = useState('order');
  const [balance, setBalance] = useState(25.00);
  const exchangeRate = 85.00;

  const [services, setServices] = useState([
    { id: 101, name: 'IG Real Active Followers', category: 'Instagram', rate: 3.50, min: 50, max: 10000 },
    { id: 102, name: 'YT High Retention Views', category: 'YouTube', rate: 4.20, min: 100, max: 50000 }
  ]);

  const [selectedService, setSelectedService] = useState(services[0]);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(1000);
  const [depositAmount, setDepositAmount] = useState(500);
  const [utr, setUtr] = useState('');

  const formatMoney = (usd) => {
    return userRegion === 'IN' 
      ? `₹${(usd * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` 
      : `$${Number(usd).toFixed(2)}`;
  };

  const calculatedTotalUSD = (selectedService.rate * (quantity / 1000)).toFixed(2);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (balance < calculatedTotalUSD) {
      alert("Insufficient balance! Please add funds.");
      setActiveTab('deposit');
      return;
    }
    
    // Deduct locally for prototype preview (or send to backend API)
    setBalance(prev => prev - calculatedTotalUSD);
    alert("Order successfully placed and routed to provider API!");
    setLink('');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const addedUSD = userRegion === 'IN' ? depositAmount / exchangeRate : depositAmount;
    setBalance(prev => prev + addedUSD);
    alert("Deposit verified and credited to wallet!");
    setUtr('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="font-black text-cyan-400 text-lg">REXON SMM PANEL</div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setUserRegion(userRegion === 'IN' ? 'INT' : 'IN')}
              className="px-3 py-1 bg-slate-800 text-xs font-bold rounded-lg text-cyan-400 cursor-pointer"
            >
              {userRegion === 'IN' ? '🇮🇳 INR (₹)' : '🌍 USD ($)'}
            </button>
            <div className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">
              Balance: {formatMoney(balance)}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveTab('order')} className={`py-2 text-xs font-bold rounded-xl cursor-pointer ${activeTab === 'order' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}>New Order</button>
          <button onClick={() => setActiveTab('deposit')} className={`py-2 text-xs font-bold rounded-xl cursor-pointer ${activeTab === 'deposit' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}>Add Funds</button>
          <button onClick={() => setActiveTab('services')} className={`py-2 text-xs font-bold rounded-xl cursor-pointer ${activeTab === 'services' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}>Services List</button>
        </div>

        {/* Tab Content: Order */}
        {activeTab === 'order' && (
          <form onSubmit={handleOrderSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-md font-bold text-white">Create New Order</h2>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Select Service</label>
              <select 
                onChange={(e) => setSelectedService(services.find(s => s.id === Number(e.target.value)))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {formatMoney(s.rate)}/1k</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Target Link</label>
              <input type="url" required placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Quantity</label>
              <input type="number" min={selectedService.min} max={selectedService.max} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <div className="text-lg font-black text-cyan-400">Total: {formatMoney(calculatedTotalUSD)}</div>
              <button type="submit" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl cursor-pointer">Place Order</button>
            </div>
          </form>
        )}

        {/* Tab Content: Deposit */}
        {activeTab === 'deposit' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-center max-w-md mx-auto">
            <h2 className="text-md font-bold text-white">Add Funds to Wallet</h2>
            {userRegion === 'IN' ? (
              <div className="space-y-3">
                <div className="p-4 bg-slate-800 rounded-xl font-mono text-cyan-400 text-xs">UPI ID: rexonsmm@ybl</div>
                <form onSubmit={handleDepositSubmit} className="space-y-3 text-left">
                  <label className="text-xs font-bold text-slate-400 block">Amount (₹)</label>
                  <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono" />
                  <label className="text-xs font-bold text-slate-400 block">UTR / Transaction Reference</label>
                  <input type="text" required placeholder="Enter UPI Ref ID" value={utr} onChange={(e) => setUtr(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono" />
                  <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl cursor-pointer">Verify & Credit Funds</button>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-slate-800 rounded-xl font-mono text-cyan-400 text-xs">USDT TRC20: TQz9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
            )}
          </div>
        )}

        {/* Tab Content: Services */}
        {activeTab === 'services' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <h2 className="text-md font-bold text-white">Live Services Price Catalog</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="text-slate-400 border-b border-slate-800"><th className="pb-2">ID</th><th className="pb-2">Service Name</th><th className="pb-2">Rate/1k</th></tr></thead>
                <tbody className="divide-y divide-slate-800/50">
                  {services.map(s => (
                    <tr key={s.id}><td className="py-2 text-cyan-400">#{s.id}</td><td className="py-2 text-white">{s.name}</td><td className="py-2 text-emerald-400">{formatMoney(s.rate)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
                    }
