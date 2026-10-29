
import React, { useMemo, useState } from 'react';

const catalog = [
  { id: 101, platform: 'Instagram', icon: '◎', name: 'Instagram Ads Campaign', detail: 'Promote posts and reach new audiences', rate: 5, unit: 'per campaign', category: 'Advertising' },
  { id: 102, platform: 'Instagram', icon: '◎', name: 'Instagram Content Promotion', detail: 'Reach a relevant target audience', rate: 3, unit: 'per campaign', category: 'Advertising' },
  { id: 201, platform: 'Facebook', icon: 'f', name: 'Facebook Ads Campaign', detail: 'Campaign setup and audience targeting', rate: 5, unit: 'per campaign', category: 'Advertising' },
  { id: 202, platform: 'Facebook', icon: 'f', name: 'Facebook Page Promotion', detail: 'Promote your page and content', rate: 3, unit: 'per campaign', category: 'Advertising' },
  { id: 301, platform: 'YouTube', icon: '▶', name: 'YouTube Video Promotion', detail: 'Promote videos to relevant audiences', rate: 5, unit: 'per campaign', category: 'Advertising' },
  { id: 302, platform: 'YouTube', icon: '▶', name: 'YouTube Channel Promotion', detail: 'Campaign to increase channel discovery', rate: 5, unit: 'per campaign', category: 'Advertising' },
  { id: 401, platform: 'Telegram', icon: '➤', name: 'Telegram Channel Promotion', detail: 'Promote your public channel', rate: 3, unit: 'per campaign', category: 'Advertising' },
  { id: 402, platform: 'Telegram', icon: '➤', name: 'Telegram Community Campaign', detail: 'Promote your community to relevant users', rate: 3, unit: 'per campaign', category: 'Advertising' },
  { id: 501, platform: 'All platforms', icon: '✦', name: 'Marketing Consultation', detail: 'Plan your campaign and content strategy', rate: 2, unit: 'per session', category: 'Consulting' },
];

const money = (amount, region) =>
  region === 'IN'
    ? '₹' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : '$' + Number(amount).toFixed(2);

export default function App() {
  const [region, setRegion] = useState('IN');
  const [tab, setTab] = useState('Dashboard');
  const [platform, setPlatform] = useState('All');
  const [serviceId, setServiceId] = useState(101);
  const [link, setLink] = useState('');
  const [budget, setBudget] = useState(500);
  const [notes, setNotes] = useState('');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notice, setNotice] = useState('');

  const selected = catalog.find(s => s.id === Number(serviceId)) || catalog[0];

  const shown = useMemo(
    () => catalog.filter(s => platform === 'All' || s.platform === platform),
    [platform]
  );

  const show = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4000);
  };

  function submitOrder(e) {
    e.preventDefault();
    if (!link.trim() || !/^https?:\/\/\S+/i.test(link.trim())) {
      show('Enter a valid public webpage or social media link.');
      return;
    }
    const item = {
      id: 'RX-' + Date.now().toString().slice(-7),
      service: selected.name,
      platform: selected.platform,
      link: link.trim(),
      budget: Number(budget),
      status: 'Draft — not submitted',
      date: new Date().toLocaleDateString()
    };
    setOrders(prev => [item, ...prev]);
    setTab('Orders');
    setLink('');
    setNotes('');
    show('Draft saved in this browser. Connect a backend to submit real orders.');
  }

  function submitDeposit(e) {
    e.preventDefault();
    if (!Number(budget) || Number(budget) <= 0) {
      show('Enter a valid amount.');
      return;
    }
    setRequests(prev => [{
      id: 'PAY-' + Date.now().toString().slice(-7),
      amount: Number(budget),
      status: 'Awaiting payment integration',
      date: new Date().toLocaleDateString()
    }, ...prev]);
    show('Request saved as a demo. No payment was taken and no balance was credited.');
    setTab('Payments');
  }

  const css = `
    *{box-sizing:border-box}
    body{margin:0;background:#080d19;color:#e8edf8;font-family:Inter,Arial,sans-serif}
    button,input,select,textarea{font:inherit}
    button{cursor:pointer}
    .app{min-height:100vh;background:radial-gradient(ellipse at 75% 0%,#132344 0,transparent 42%),#080d19}
    .shell{max-width:1250px;margin:auto;padding:18px}
    .top{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:15px 18px;background:#101827;border:1px solid #263247;border-radius:18px}
    .brand{display:flex;align-items:center;gap:12px;font-weight:900;letter-spacing:.5px}
    .logo{width:42px;height:42px;display:grid;place-items:center;background:linear-gradient(135deg,#22d3ee,#818cf8);border-radius:13px;color:#07111d;font-size:22px}
    .muted{color:#94a3b8}.small{font-size:12px}.topright{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .pill,.btn,.select,.field{border:1px solid #344155;border-radius:10px;background:#151f30;color:#e8edf8;padding:10px 12px}
    .pill{font-size:12px;font-weight:800;color:#67e8f9}
    .layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px;margin-top:18px}
    .side,.panel,.stat{background:#101827;border:1px solid #263247;border-radius:17px}
    .side{padding:12px;height:max-content;position:sticky;top:12px}
    .navlabel{padding:10px 12px;color:#64748b;font-size:10px;font-weight:900;letter-spacing:1.5px}
    .nav{width:100%;border:0;background:transparent;color:#9eacc1;padding:12px;border-radius:10px;text-align:left;margin:2px 0;font-weight:700;font-size:13px}
    .nav.active,.nav:hover{background:#183044;color:#67e8f9}
    .content{min-width:0}.heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:3px 0 18px}
    h1{font-size:25px;margin:0 0 6px;letter-spacing:-.7px}h2{font-size:16px;margin:0 0 6px}h3{font-size:14px;margin:0 0 7px}
    p{line-height:1.55}.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px}
    .stat{padding:17px}.statname{font-size:12px;color:#9eacc1}.statvalue{font-size:24px;font-weight:900;margin-top:10px}
    .panel{padding:19px;margin-bottom:16px}.panelhead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}
    .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .service{border:1px solid #2c394e;background:#0d1523;padding:15px;border-radius:14px}
    .serviceicon{width:36px;height:36px;border-radius:11px;background:#183044;color:#67e8f9;display:grid;place-items:center;font-size:19px;font-weight:900;margin-bottom:12px}
    .servicefoot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:15px}
    .price{font-weight:900;color:#6ee7b7}.btn{font-size:12px;font-weight:800}.btn.primary{background:#22d3ee;color:#07111d;border-color:#22d3ee}.btn:hover{filter:brightness(1.08)}
    .field{width:100%;margin-top:7px;outline:none}.field:focus{border-color:#22d3ee}
    label{display:block;font-size:12px;color:#b4c0d3;font-weight:700;margin-top:14px}
    .formrow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .notice{position:sticky;top:8px;z-index:5;background:#163349;border:1px solid #22d3ee;color:#d9fbff;padding:12px 15px;border-radius:12px;margin:12px 0;font-size:13px}
    .tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:12px;min-width:540px}th,td{text-align:left;padding:13px 10px;border-bottom:1px solid #263247}th{color:#94a3b8;font-weight:700}td{color:#dce5f4}
    .tag{font-size:10px;background:#1c293b;color:#b7c6db;border-radius:7px;padding:5px 7px;white-space:nowrap}
    .empty{padding:28px;text-align:center;color:#94a3b8;font-size:13px}
    .footer{text-align:center;color:#64748b;font-size:11px;padding:22px 8px}
    @media(max-width:760px){.shell{padding:10px}.layout{grid-template-columns:1fr;gap:12px}.side{position:static;display:flex;gap:5px;overflow-x:auto;padding:7px}.navlabel{display:none}.nav{white-space:nowrap;width:auto;padding:11px 12px}.stats{grid-template-columns:1fr 1fr}.stat:last-child{grid-column:1/-1}.grid2{grid-template-columns:1fr}.top{padding:12px}.topright{justify-content:flex-end}.heading{align-items:flex-start}h1{font-size:22px}}
    @media(max-width:420px){.formrow{grid-template-columns:1fr}.top{align-items:flex-start}.topright{max-width:145px}.brand{font-size:12px}.logo{width:35px;height:35px}}
  `;

  const navItems = [
    ['OVERVIEW', [['Dashboard', '▦'], ['New Order', '+'], ['Orders', '≡']]],
    ['BUSINESS', [['Services', '◇'], ['Payments', '₹'], ['Campaign Guide', '✦']]]
  ];

  return (
    <div className="app">
      <style>{css}</style>
      <div className="shell">
        <header className="top">
          <div className="brand">
            <div className="logo">R</div>
            <div>REXON <span style={{color:'#67e8f9'}}>REACH</span><div className="muted small" style={{marginTop:4}}>SOCIAL CAMPAIGN PANEL</div></div>
          </div>
          <div className="topright">
            <button className="pill" onClick={() => setRegion(region === 'IN' ? 'INT' : 'IN')}>
              {region === 'IN' ? '🇮🇳 INR ₹' : '🌍 USD $'}
            </button>
            <span className="tag">DEMO MODE</span>
          </div>
        </header>

        {notice && <div className="notice" role="status">{notice}</div>}

        <div className="layout">
          <aside className="side">
            {navItems.map(([group, items]) => (
              <React.Fragment key={group}>
                <div className="navlabel">{group}</div>
                {items.map(([name, icon]) => (
                  <button key={name} className={'nav ' + (tab === name ? 'active' : '')} onClick={() => setTab(name)}>
                    <span style={{display:'inline-block',width:25}}>{icon}</span>{name}
                  </button>
                ))}
              </React.Fragment>
            ))}
            <div style={{marginTop:16,padding:12,borderRadius:12,background:'#0b1422'}}>
              <div className="small" style={{color:'#67e8f9',fontWeight:800}}>GET STARTED</div>
              <p className="muted small">Choose a campaign service and save a draft to begin.</p>
            </div>
          </aside>

          <main className="content">
            <div className="heading">
              <div>
                <h1>{tab === 'Dashboard' ? 'Dashboard' : tab}</h1>
                <div className="muted small">Manage your social promotion workflow.</div>
              </div>
              <button className="btn primary" onClick={() => setTab('New Order')}>+ New Order</button>
            </div>

            {tab === 'Dashboard' && <>
              <div className="stats">
                <div className="stat"><div className="statname">Saved order drafts</div><div className="statvalue">{orders.length}</div><div className="muted small">Stored in this browser session</div></div>
                <div className="stat"><div className="statname">Payment requests</div><div className="statvalue">{requests.length}</div><div className="muted small">No money collected</div></div>
                <div className="stat"><div className="statname">Available services</div><div className="statvalue">{catalog.length}</div><div className="muted small">Illustrative catalog</div></div>
              </div>
              <section className="panel">
                <div className="panelhead"><div><h2>Welcome to REXON</h2><div className="muted small">Your workspace for campaign planning.</div></div><span className="tag">PROTOTYPE</span></div>
                <p className="muted small">Plan campaigns for Instagram, Facebook, YouTube and Telegram. These sample listings are for interface testing; they do not promise followers, views or campaign results.</p>
                <button className="btn primary" onClick={() => setTab('New Order')}>Create a campaign draft →</button>
              </section>
              <section className="panel">
                <div className="panelhead"><div><h2>Explore services</h2><div className="muted small">Select a platform to browse sample services.</div></div><button className="btn" onClick={() => setTab('Services')}>View all</button></div>
                <div className="grid2">
                  {catalog.slice(0,4).map(s => <div className="service" key={s.id}>
                    <div className="serviceicon">{s.icon}</div><h3>{s.name}</h3><div className="muted small">{s.detail}</div>
                    <div className="servicefoot"><span className="price">{money(s.rate,region)} <span className="muted small">/{s.unit}</span></span><button className="btn" onClick={() => {setServiceId(s.id);setTab('New Order')}}>Select</button></div>
                  </div>)}
                </div>
              </section>
            </>}

            {tab === 'New Order' && <section className="panel">
              <h2>Create campaign draft</h2><p className="muted small">Choose a service and enter the public page or post link. Saving creates a local draft only.</p>
              <form onSubmit={submitOrder}>
                <label>Platform</label>
                <select className="field" value={platform} onChange={e => {setPlatform(e.target.value);const first=catalog.find(s=>e.target.value==='All'||s.platform===e.target.value);if(first)setServiceId(first.id)}}>
                  {['All','Instagram','Facebook','YouTube','Telegram','All platforms'].map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <label>Select service</label>
                <select className="field" value={serviceId} onChange={e => setServiceId(Number(e.target.value))}>
                  {catalog.filter(s=>platform==='All'||s.platform===platform||s.platform==='All platforms').map(s=><option key={s.id} value={s.id}>{s.name} — {money(s.rate,region)} / {s.unit}</option>)}
                </select>
                <label>Public campaign link</label>
                <input className="field" type="url" placeholder="https://..." required value={link} onChange={e=>setLink(e.target.value)} />
                <div className="formrow">
                  <div><label>Campaign budget ({region==='IN'?'₹':'$'})</label><input className="field" type="number" min="1" step="1" value={budget} onChange={e=>setBudget(e.target.value)} required /></div>
                  <div><label>Estimated service fee</label><div className="field" style={{color:'#6ee7b7'}}>{money(selected.rate,region)} <span className="muted small">sample fee</span></div></div>
                </div>
                <label>Campaign notes (optional)</label>
                <textarea className="field" rows="3" placeholder="Audience, location, objective..." value={notes} onChange={e=>setNotes(e.target.value)} />
                <p className="muted small">Sample rates are not quotes. Ad spend, service fees, taxes and platform eligibility must be confirmed before launching a real campaign.</p>
                <button className="btn primary" type="submit">Save draft</button>
              </form>
            </section>}

            {tab === 'Services' && <section className="panel">
              <div className="panelhead"><div><h2>Service catalog</h2><div className="muted small">Illustrative services for campaign planning.</div></div></div>
              <label style={{marginTop:0}}>Filter by platform</label>
              <select className="field" value={platform} onChange={e=>setPlatform(e.target.value)}>
                {['All','Instagram','Facebook','YouTube','Telegram','All platforms'].map(p=><option key={p}>{p}</option>)}
              </select>
              <div className="grid2" style={{marginTop:15}}>
                {shown.map(s=><div className="service" key={s.id}><div className="serviceicon">{s.icon}</div><h3>{s.name}</h3><div className="muted small">{s.detail}</div><div className="servicefoot"><span className="price">{money(s.rate,region)} <span className="muted small">/{s.unit}</span></span><button className="btn" onClick={()=>{setServiceId(s.id);setTab('New Order')}}>Choose</button></div></div>)}
              </div>
            </section>}

            {tab === 'Orders' && <section className="panel">
              <h2>Order drafts</h2><p className="muted small">These drafts are kept in React state only and may disappear on refresh. They have not been sent to a provider.</p>
              {orders.length===0 ? <div className="empty">No drafts yet. Choose New Order to create one.</div> : <div className="tablewrap"><table><thead><tr><th>Draft ID</th><th>Service</th><th>Budget</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.id}</td><td>{o.service}<div className="muted small">{o.link}</div></td><td>{money(o.budget,region)}</td><td><span className="tag">{o.status}</span></td></tr>)}</tbody></table></div>}
            </section>}

            {tab === 'Payments' && <section className="panel">
              <h2>Payments & deposits</h2>
              <p className="muted small">Payment collection is not connected yet. This form records a demo request only. Do not enter banking passwords, OTPs, or card details.</p>
              <form onSubmit={submitDeposit}>
                <label>Requested amount ({region==='IN'?'₹':'$'})</label>
                <input className="field" type="number" min="1" step="1" required value={budget} onChange={e=>setBudget(e.target.value)} />
                <div style={{marginTop:14}}><button className="btn primary" type="submit">Save demo request</button></div>
              </form>
              <div style={{marginTop:20}}><h3>Payment requests</h3>
                {requests.length===0?<div className="empty">No payment requests.</div>:<div className="tablewrap"><table><thead><tr><th>Request</th><th>Amount</th><th>Status</th></tr></thead><tbody>{requests.map(r=><tr key={r.id}><td>{r.id}<div className="muted small">{r.date}</div></td><td>{money(r.amount,region)}</td><td><span className="tag">{r.status}</span></td></tr>)}</tbody></table></div>}
              </div>
            </section>}

            {tab === 'Campaign Guide' && <section className="panel">
              <h2>Launch a legitimate campaign</h2>
              <p className="muted small">Use authorized advertising tools and follow each platform's rules.</p>
              <ol className="muted small" style={{lineHeight:2,paddingLeft:20}}>
                <li>Choose a business objective, such as leads, sales, website visits or awareness.</li>
                <li>Confirm that you own or are authorized to promote the account and content.</li>
                <li>Agree the advertising budget, service fee, target audience and duration with the customer.</li>
                <li>Launch through the platform's approved advertising tools or authorized API.</li>
                <li>Report actual spend and campaign results. Never guarantee followers or engagement.</li>
              </ol>
              <button className="btn primary" onClick={()=>setTab('New Order')}>Plan a campaign</button>
            </section>}

            <div className="footer">REXON • Prototype interface • Sample rates only • No real payments or provider delivery connected</div>
          </main>
        </div>
      </div>
    </div>
  );
                                                                                                                                                       }
