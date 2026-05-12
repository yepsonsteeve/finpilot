import * as React from 'react';
const { useState, useEffect } = React;
import { AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'finpilot_data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const NOW = new Date();
const CURRENT_MONTH = `${NOW.getFullYear()}-${String(NOW.getMonth()+1).padStart(2,'0')}`;

const DEFAULT_DATA = {
  income: 4800,
  expenses: [
    { id:1, label:"Loyer",          amount:1200, category:"Logement",     date:"2026-05-01", icon:"🏠" },
    { id:2, label:"Courses",        amount:340,  category:"Alimentation", date:"2026-05-03", icon:"🛒" },
    { id:3, label:"Netflix",        amount:17,   category:"Loisirs",      date:"2026-05-05", icon:"📺" },
    { id:4, label:"Essence",        amount:80,   category:"Transport",    date:"2026-05-06", icon:"⛽" },
    { id:5, label:"Restaurant",     amount:65,   category:"Alimentation", date:"2026-05-07", icon:"🍽" },
    { id:6, label:"Abonnement gym", amount:45,   category:"Sante",        date:"2026-05-08", icon:"💪" },
  ],
  investments: [
    { id:1, name:"PEA",       value:12400, color:"#00e5a0", icon:"📈" },
    { id:2, name:"PEE",       value:8000,  color:"#6c8eff", icon:"🏢" },
    { id:3, name:"Livret A",  value:6500,  color:"#a78bfa", icon:"🏦" },
    { id:4, name:"Crypto",    value:3200,  color:"#ff6c8e", icon:"₿"  },
    { id:5, name:"Immobilier",value:45000, color:"#ffd700", icon:"🏠" },
  ],
  debts: [
    { id:1, label:"Pret auto",             total:12000, remaining:8400, monthly:280, icon:"🚗", color:"#ff6c8e" },
    { id:2, label:"Credit consommation",   total:3000,  remaining:1200, monthly:120, icon:"💳", color:"#ffd700" },
    { id:3, label:"Decouvert bancaire",    total:500,   remaining:500,  monthly:0,   icon:"🏦", color:"#a78bfa" },
  ],
  charges: [
    { id:1, label:"Assurance auto", amount:95,  due:"15", icon:"🚗", status:"upcoming" },
    { id:2, label:"Telephone",      amount:30,  due:"20", icon:"📱", status:"upcoming" },
    { id:3, label:"Internet",       amount:35,  due:"22", icon:"🌐", status:"upcoming" },
    { id:4, label:"Electricite",    amount:120, due:"28", icon:"⚡", status:"pending"  },
    { id:5, label:"Mutuelle sante", amount:75,  due:"01", icon:"❤️", status:"future"   },
  ],
  history: [],
};

const CAT_COLORS = { Logement:"#6c8eff", Alimentation:"#00e5a0", Loisirs:"#ff6c8e", Transport:"#ffd700", Sante:"#a78bfa", Autre:"#888" };
const CAT_ICONS =  { Logement:"🏠", Alimentation:"🛒", Loisirs:"🎮", Transport:"🚗", Sante:"💊", Autre:"💳" };

const card = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 20px" };
const input_style = { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%" };
const btn_green = { background:"#00e5a0", border:"none", borderRadius:10, padding:"11px 16px", color:"#000", fontWeight:800, fontSize:14, cursor:"pointer" };

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ data, setData }) {
  const totalExp  = data.expenses.reduce((s,e) => s+e.amount, 0);
  const totalInvest = data.investments.reduce((s,i) => s+i.value, 0);
  const totalDebt = data.debts.reduce((s,d) => s+d.remaining, 0);
  const balance   = data.income - totalExp;
  const [editIncome, setEditIncome] = useState(false);
  const [incomeVal, setIncomeVal] = useState(String(data.income));

  const saveIncome = () => {
    setData(p => ({ ...p, income: +incomeVal }));
    setEditIncome(false);
  };

  // Historique pour graphique
  const chartData = [...data.history.slice(-5), {
    month: CURRENT_MONTH.slice(5),
    revenus: data.income,
    depenses: totalExp,
    epargne: Math.max(0, data.income - totalExp),
  }];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, paddingBottom:16 }}>

      {/* Hero */}
      <div style={{ ...card, background:"linear-gradient(135deg,rgba(0,229,160,0.12),rgba(108,142,255,0.12))", textAlign:"center", padding:"24px 20px" }}>
        <div style={{ fontSize:11, color:"#888", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Solde disponible</div>
        <div style={{ fontSize:42, fontWeight:800, color:"#fff", letterSpacing:-2 }}>{balance.toLocaleString()} EUR</div>

        {/* Revenus modifiables */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginTop:8 }}>
          {editIncome ? (
            <>
              <input value={incomeVal} onChange={e=>setIncomeVal(e.target.value)} type="number"
                style={{ ...input_style, width:120, textAlign:"center", padding:"6px 10px" }} />
              <button onClick={saveIncome} style={{ ...btn_green, padding:"6px 12px", fontSize:12 }}>OK</button>
            </>
          ) : (
            <div style={{ fontSize:13, color:"#00e5a0", cursor:"pointer" }} onClick={()=>setEditIncome(true)}>
              Revenus : {data.income.toLocaleString()} EUR ✏️
            </div>
          )}
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:16 }}>
          {[
            { label:"DEPENSES", val:`${totalExp.toLocaleString()} EUR`, color:"#ff6c8e" },
            { label:"PLACEMENTS", val:`${(totalInvest/1000).toFixed(0)}k EUR`, color:"#ffd700" },
            { label:"DETTES", val:`${totalDebt.toLocaleString()} EUR`, color:"#a78bfa" },
          ].map((k,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:k.color, letterSpacing:1 }}>{k.label}</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique evolution */}
      <div style={{ ...card }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:14 }}>Evolution mensuelle</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#555", fontSize:10 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background:"#111", border:"1px solid #222", borderRadius:8, color:"#fff", fontSize:12 }} />
            <Line type="monotone" dataKey="revenus"  stroke="#00e5a0" strokeWidth={2} dot={false} name="Revenus" />
            <Line type="monotone" dataKey="depenses" stroke="#ff6c8e" strokeWidth={2} dot={false} name="Depenses" />
            <Line type="monotone" dataKey="epargne"  stroke="#ffd700" strokeWidth={2} dot={false} name="Epargne" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Score */}
      <div style={{ ...card }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Score sante financiere</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#00e5a0" }}>
            {Math.max(0, Math.min(100, Math.round(100 - (totalExp/data.income)*100 + (totalInvest/100000)*20)))}/100
          </div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
          <div style={{ width:`${Math.max(0,Math.min(100,Math.round(100-(totalExp/data.income)*100+(totalInvest/100000)*20)))}%`, height:"100%", background:"linear-gradient(90deg,#00e5a0,#6c8eff)", borderRadius:3 }} />
        </div>
      </div>

      {/* Dernieres transactions */}
      <div style={{ ...card }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:12 }}>Dernieres transactions</div>
        {data.expenses.slice(-4).reverse().map(e => (
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize:22 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.label}</div>
              <div style={{ fontSize:11, color:"#555" }}>{e.category} · {e.date}</div>
            </div>
            <div style={{ fontSize:14, color:"#ff6c8e", fontWeight:700 }}>-{e.amount} EUR</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
function Expenses({ data, setData }) {
  const [form, setForm] = useState({ label:"", amount:"", category:"Alimentation" });
  const [showForm, setShowForm] = useState(false);
  const total = data.expenses.reduce((s,e) => s+e.amount, 0);
  const byCategory = data.expenses.reduce((acc,e) => { acc[e.category]=(acc[e.category]||0)+e.amount; return acc; }, {});

  const add = () => {
    if (!form.label || !form.amount) return;
    setData(p => ({ ...p, expenses: [...p.expenses, {
      ...form, id:Date.now(), amount:+form.amount,
      date:new Date().toISOString().split("T")[0],
      icon: CAT_ICONS[form.category]||"💳"
    }]}));
    setForm({ label:"", amount:"", category:"Alimentation" });
    setShowForm(false);
  };

  const remove = (id) => setData(p => ({ ...p, expenses: p.expenses.filter(x=>x.id!==id) }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Depenses</div>
          <div style={{ fontSize:12, color:"#ff6c8e" }}>Total : {total.toLocaleString()} EUR</div>
        </div>
        <button onClick={() => setShowForm(p=>!p)} style={{ ...btn_green, fontSize:20, padding:"8px 16px" }}>+</button>
      </div>

      {showForm && (
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="Description" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Montant (EUR)" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={input_style} />
          <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{ ...input_style, background:"#111" }}>
            {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={add} style={btn_green}>Ajouter</button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {Object.entries(byCategory).map(([cat,amt]) => (
          <div key={cat} style={{ ...card, padding:"14px 16px" }}>
            <div style={{ fontSize:10, color:"#666", marginBottom:4 }}>{cat.toUpperCase()}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{amt} EUR</div>
            <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, marginTop:8 }}>
              <div style={{ width:`${Math.min(100,(amt/total)*100*1.5)}%`, height:"100%", background:CAT_COLORS[cat]||"#888", borderRadius:2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card }}>
        {data.expenses.slice().reverse().map(e => (
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize:22 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.label}</div>
              <div style={{ fontSize:10, color:"#555" }}>{e.category} · {e.date}</div>
            </div>
            <div style={{ fontSize:14, color:"#ff6c8e", fontWeight:700 }}>-{e.amount} EUR</div>
            <button onClick={()=>remove(e.id)} style={{ background:"rgba(255,100,100,0.1)", border:"none", borderRadius:8, width:28, height:28, color:"#ff6c8e", cursor:"pointer", fontSize:14 }}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Investments ──────────────────────────────────────────────────────────────
function Investments({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name:"", value:"", color:"#00e5a0", icon:"📈" });
  const total = data.investments.reduce((s,i) => s+i.value, 0);

  const save = () => {
    if (!form.name || !form.value) return;
    if (editId) {
      setData(p => ({ ...p, investments: p.investments.map(i => i.id===editId ? {...i,...form,value:+form.value} : i) }));
      setEditId(null);
    } else {
      setData(p => ({ ...p, investments: [...p.investments, {...form, id:Date.now(), value:+form.value}] }));
    }
    setForm({ name:"", value:"", color:"#00e5a0", icon:"📈" });
    setShowForm(false);
  };

  const startEdit = (inv) => { setForm({...inv, value:String(inv.value)}); setEditId(inv.id); setShowForm(true); };
  const remove = (id) => setData(p => ({ ...p, investments: p.investments.filter(i=>i.id!==id) }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Placements</div>
          <div style={{ fontSize:12, color:"#00e5a0" }}>Total : {total.toLocaleString()} EUR</div>
        </div>
        <button onClick={()=>{setShowForm(p=>!p);setEditId(null);setForm({name:"",value:"",color:"#00e5a0",icon:"📈"});}} style={{ ...btn_green, fontSize:20, padding:"8px 16px" }}>+</button>
      </div>

      {showForm && (
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="Nom (PEA, Livret A...)" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Valeur (EUR)" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} style={input_style} />
          <select value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={{ ...input_style, background:"#111" }}>
            {["📈","🏦","🏠","₿","📊","💰","🌍","⚡"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <button onClick={save} style={btn_green}>{editId ? "Modifier" : "Ajouter"}</button>
        </div>
      )}

      <div style={{ ...card }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data.investments} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
              {data.investments.map((e,i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background:"#111", border:"1px solid #222", borderRadius:8, color:"#fff", fontSize:12 }} formatter={v=>[`${v.toLocaleString()} EUR`]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data.investments.map((inv) => {
        const pct = ((inv.value/total)*100).toFixed(1);
        return (
          <div key={inv.id} style={{ ...card }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{inv.icon}</span>
                <span style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{inv.name}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:inv.color, fontWeight:700, fontSize:16 }}>{inv.value.toLocaleString()} EUR</span>
                <button onClick={()=>startEdit(inv)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:6, width:26, height:26, color:"#fff", cursor:"pointer", fontSize:12 }}>✏️</button>
                <button onClick={()=>remove(inv.id)} style={{ background:"rgba(255,100,100,0.1)", border:"none", borderRadius:6, width:26, height:26, color:"#ff6c8e", cursor:"pointer" }}>x</button>
              </div>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:inv.color, borderRadius:2 }} />
            </div>
            <div style={{ fontSize:11, color:"#555", marginTop:4 }}>{pct}% du portefeuille</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Debts ────────────────────────────────────────────────────────────────────
function Debts({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label:"", total:"", remaining:"", monthly:"", icon:"💳", color:"#ff6c8e" });
  const totalDebt = data.debts.reduce((s,d) => s+d.remaining, 0);
  const totalMonthly = data.debts.reduce((s,d) => s+d.monthly, 0);

  const save = () => {
    if (!form.label || !form.remaining) return;
    if (editId) {
      setData(p => ({ ...p, debts: p.debts.map(d => d.id===editId ? {...d,...form,total:+form.total,remaining:+form.remaining,monthly:+form.monthly} : d) }));
      setEditId(null);
    } else {
      setData(p => ({ ...p, debts: [...p.debts, {...form,id:Date.now(),total:+form.total,remaining:+form.remaining,monthly:+form.monthly}] }));
    }
    setForm({ label:"", total:"", remaining:"", monthly:"", icon:"💳", color:"#ff6c8e" });
    setShowForm(false);
  };

  const startEdit = (d) => { setForm({...d,total:String(d.total),remaining:String(d.remaining),monthly:String(d.monthly)}); setEditId(d.id); setShowForm(true); };
  const remove = (id) => setData(p => ({ ...p, debts: p.debts.filter(d=>d.id!==id) }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Dettes & Prets</div>
          <div style={{ fontSize:12, color:"#ff6c8e" }}>Restant : {totalDebt.toLocaleString()} EUR · {totalMonthly} EUR/mois</div>
        </div>
        <button onClick={()=>{setShowForm(p=>!p);setEditId(null);setForm({label:"",total:"",remaining:"",monthly:"",icon:"💳",color:"#ff6c8e"});}} style={{ ...btn_green, fontSize:20, padding:"8px 16px" }}>+</button>
      </div>

      {showForm && (
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="Nom (Pret auto...)" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Montant total (EUR)" value={form.total} onChange={e=>setForm(p=>({...p,total:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Reste a payer (EUR)" value={form.remaining} onChange={e=>setForm(p=>({...p,remaining:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Mensualite (EUR)" value={form.monthly} onChange={e=>setForm(p=>({...p,monthly:e.target.value}))} style={input_style} />
          <select value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={{ ...input_style, background:"#111" }}>
            {["💳","🚗","🏠","🎓","🏦","💊"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <button onClick={save} style={btn_green}>{editId ? "Modifier" : "Ajouter"}</button>
        </div>
      )}

      <div style={{ ...card, background:"linear-gradient(135deg,rgba(255,108,142,0.08),rgba(167,139,250,0.08))" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#ff6c8e", marginBottom:4 }}>TOTAL RESTANT</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{totalDebt.toLocaleString()} EUR</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#a78bfa", marginBottom:4 }}>MENSUALITES</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{totalMonthly} EUR</div>
          </div>
        </div>
      </div>

      {data.debts.map((d) => {
        const pct = d.total > 0 ? ((d.remaining/d.total)*100).toFixed(0) : 0;
        return (
          <div key={d.id} style={{ ...card }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{d.label}</div>
                  <div style={{ fontSize:11, color:"#555" }}>{d.monthly > 0 ? `${d.monthly} EUR/mois` : "Pas de mensualite"}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:"#ff6c8e", fontWeight:700, fontSize:15 }}>{d.remaining.toLocaleString()} EUR</span>
                <button onClick={()=>startEdit(d)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:6, width:26, height:26, color:"#fff", cursor:"pointer", fontSize:12 }}>✏️</button>
                <button onClick={()=>remove(d.id)} style={{ background:"rgba(255,100,100,0.1)", border:"none", borderRadius:6, width:26, height:26, color:"#ff6c8e", cursor:"pointer" }}>x</button>
              </div>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:"#ff6c8e", borderRadius:2 }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <div style={{ fontSize:11, color:"#555" }}>{pct}% restant</div>
              <div style={{ fontSize:11, color:"#555" }}>sur {d.total.toLocaleString()} EUR</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Charges ──────────────────────────────────────────────────────────────────
function Charges({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label:"", amount:"", due:"01", icon:"📋", status:"upcoming" });
  const total = data.charges.reduce((s,c) => s+c.amount, 0);

  const add = () => {
    if (!form.label || !form.amount) return;
    setData(p => ({ ...p, charges: [...p.charges, {...form, id:Date.now(), amount:+form.amount}] }));
    setForm({ label:"", amount:"", due:"01", icon:"📋", status:"upcoming" });
    setShowForm(false);
  };

  const remove = (id) => setData(p => ({ ...p, charges: p.charges.filter(c=>c.id!==id) }));

  const statusStyle = {
    upcoming:{ bg:"#ffd70018", border:"#ffd70033", text:"#ffd700", label:"A venir" },
    pending: { bg:"#ff6c8e18", border:"#ff6c8e33", text:"#ff6c8e", label:"En attente" },
    future:  { bg:"#6c8eff18", border:"#6c8eff33", text:"#6c8eff", label:"Futur" },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Charges</div>
          <div style={{ fontSize:12, color:"#a78bfa" }}>Total mensuel : {total} EUR</div>
        </div>
        <button onClick={()=>setShowForm(p=>!p)} style={{ ...btn_green, fontSize:20, padding:"8px 16px" }}>+</button>
      </div>

      {showForm && (
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="Nom (Internet...)" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={input_style} />
          <input type="number" placeholder="Montant (EUR)" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={input_style} />
          <input placeholder="Jour echeance (ex: 15)" value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} style={input_style} />
          <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{ ...input_style, background:"#111" }}>
            <option value="upcoming">A venir</option>
            <option value="pending">En attente</option>
            <option value="future">Futur</option>
          </select>
          <button onClick={add} style={btn_green}>Ajouter</button>
        </div>
      )}

      {data.charges.map((c) => {
        const st = statusStyle[c.status] || statusStyle.upcoming;
        return (
          <div key={c.id} style={{ ...card, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:26 }}>{c.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{c.label}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:2 }}>Echeance : {c.due} du mois</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <div style={{ background:st.bg, border:`1px solid ${st.border}`, borderRadius:20, padding:"2px 10px", fontSize:10, color:st.text }}>{st.label}</div>
              <div style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{c.amount} EUR</div>
            </div>
            <button onClick={()=>remove(c.id)} style={{ background:"rgba(255,100,100,0.1)", border:"none", borderRadius:8, width:28, height:28, color:"#ff6c8e", cursor:"pointer" }}>x</button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Conseils ─────────────────────────────────────────────────────────────────
function Conseils({ data }) {
  const total = data.expenses.reduce((s,e) => s+e.amount, 0);
  const income = data.income;
  const ratio = Math.round((total/income)*100);
  const totalDebt = data.debts.reduce((s,d) => s+d.remaining, 0);
  const totalMonthly = data.debts.reduce((s,d) => s+d.monthly, 0);
  const tips = [];
  if (ratio > 70) tips.push({ icon:"⚠️", text:`Tu depenses ${ratio}% de tes revenus. Objectif : sous 70%.`, color:"#ff6c8e" });
  if (ratio <= 70) tips.push({ icon:"✅", text:`Tu depenses ${ratio}% de tes revenus. Bonne gestion !`, color:"#00e5a0" });
  if (totalMonthly > income * 0.33) tips.push({ icon:"🔴", text:`Tes mensualites de dettes (${totalMonthly} EUR) depassent 33% de tes revenus. Attention !`, color:"#ff6c8e" });
  if (totalDebt > 0) tips.push({ icon:"💳", text:`Tu as ${totalDebt.toLocaleString()} EUR de dettes. Priorise les remboursements a taux eleve.`, color:"#ffd700" });
  tips.push({ icon:"💡", text:"Regle 50/30/20 : 50% besoins, 30% envies, 20% epargne.", color:"#6c8eff" });
  tips.push({ icon:"📈", text:"Le PEA est ideal pour investir en bourse avec avantage fiscal apres 5 ans.", color:"#00e5a0" });
  tips.push({ icon:"🏦", text:"Le Livret A est garanti et disponible : ideal pour ton epargne de precaution (3-6 mois de depenses).", color:"#a78bfa" });

  const claudePrompt = encodeURIComponent(`Bonjour ! Voici ma situation :\n- Revenus: ${income} EUR\n- Depenses: ${total} EUR\n- Dettes restantes: ${totalDebt} EUR\n- Mensualites: ${totalMonthly} EUR\n\nAide-moi a optimiser mes finances.`);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, paddingBottom:16 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Conseils</div>
        <div style={{ fontSize:12, color:"#555" }}>Analyse personnalisee</div>
      </div>

      <div style={{ ...card, background:"linear-gradient(135deg,rgba(0,229,160,0.08),rgba(108,142,255,0.08))" }}>
        <div style={{ fontSize:13, color:"#888", marginBottom:12 }}>Sante financiere</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>{ratio}%</div>
          <div style={{ fontSize:13, color:ratio<70?"#00e5a0":"#ff6c8e" }}>{ratio<70?"Dans les clous":"A surveiller"}</div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
          <div style={{ width:`${Math.min(ratio,100)}%`, height:"100%", background:ratio<70?"#00e5a0":"#ff6c8e", borderRadius:3 }} />
        </div>
        <div style={{ fontSize:11, color:"#555", marginTop:6 }}>Depenses / Revenus · objectif moins de 70%</div>
      </div>

      {tips.map((tip,i) => (
        <div key={i} style={{ ...card, display:"flex", gap:14, alignItems:"flex-start", borderLeft:`3px solid ${tip.color}` }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{tip.icon}</span>
          <span style={{ fontSize:14, color:"#ccc", lineHeight:1.5 }}>{tip.text}</span>
        </div>
      ))}

      <div style={{ ...card, textAlign:"center", padding:"28px 20px" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
        <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:8 }}>Conseil personnalise avec IA</div>
        <div style={{ fontSize:13, color:"#666", marginBottom:20 }}>Tes donnees sont pré-remplies dans Claude.ai</div>
        <a href={`https://claude.ai/new?q=${claudePrompt}`} target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-block", background:"linear-gradient(135deg,#00e5a0,#6c8eff)", borderRadius:14, padding:"14px 28px", color:"#000", fontWeight:800, fontSize:15, textDecoration:"none" }}>
          Ouvrir Claude.ai
        </a>
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",   icon:"⬡", label:"Accueil" },
  { id:"expenses",    icon:"↓", label:"Depenses" },
  { id:"investments", icon:"◈", label:"Placements" },
  { id:"debts",       icon:"⚠", label:"Dettes" },
  { id:"conseils",    icon:"✦", label:"Conseils" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [data, setDataRaw] = useState(() => loadData() || DEFAULT_DATA);

  const setData = (updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  };

  // Sauvegarde automatique historique en fin de mois
  useEffect(() => {
    const lastSaved = data.history[data.history.length-1];
    const thisMonth = CURRENT_MONTH.slice(5);
    if (!lastSaved || lastSaved.month !== thisMonth) {
      const totalExp = data.expenses.reduce((s,e)=>s+e.amount,0);
      if (totalExp > 0) {
        setData(p => ({
          ...p,
          history: [...p.history.slice(-11), {
            month: thisMonth,
            revenus: p.income,
            depenses: totalExp,
            epargne: Math.max(0, p.income - totalExp),
          }]
        }));
      }
    }
  }, []);

  const pages = {
    dashboard:   <Dashboard   data={data} setData={setData} />,
    expenses:    <Expenses    data={data} setData={setData} />,
    investments: <Investments data={data} setData={setData} />,
    debts:       <Debts       data={data} setData={setData} />,
    conseils:    <Conseils    data={data} />,
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:"#07070d", overflow:"hidden" }}>
      <div className="safe-top" style={{ background:"rgba(7,7,13,0.95)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 20px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div style={{ fontWeight:800, fontSize:20, color:"#fff" }}><span style={{ color:"#00e5a0" }}>Fin</span>Pilot</div>
        <div style={{ fontSize:11, color:"#00e5a0", background:"rgba(0,229,160,0.1)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:20, padding:"3px 10px" }}>EN DIRECT</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0", display:"flex", flexDirection:"column" }}>
        <div className="fade-in" key={active} style={{ flex:1 }}>{pages[active]}</div>
      </div>

      <div className="safe-bottom" style={{ background:"rgba(7,7,13,0.97)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexShrink:0 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"10px 0 8px", border:"none", background:"transparent", cursor:"pointer", color:active===item.id?"#00e5a0":"#444" }}>
            <span style={{ fontSize:18, marginBottom:3 }}>{item.icon}</span>
            <span style={{ fontSize:10 }}>{item.label}</span>
            {active===item.id && <div style={{ width:4, height:4, borderRadius:"50%", background:"#00e5a0", marginTop:3 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
