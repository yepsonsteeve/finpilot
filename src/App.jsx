import { useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const INITIAL_EXPENSES = [
  { id: 1, label: "Loyer",          amount: 1200, category: "Logement",     date: "2026-05-01", icon: "🏠" },
  { id: 2, label: "Courses",        amount: 340,  category: "Alimentation", date: "2026-05-03", icon: "🛒" },
  { id: 3, label: "Netflix",        amount: 17,   category: "Loisirs",      date: "2026-05-05", icon: "📺" },
  { id: 4, label: "Essence",        amount: 80,   category: "Transport",    date: "2026-05-06", icon: "⛽" },
  { id: 5, label: "Restaurant",     amount: 65,   category: "Alimentation", date: "2026-05-07", icon: "🍽️" },
  { id: 6, label: "Abonnement gym", amount: 45,   category: "Santé",        date: "2026-05-08", icon: "💪" },
];

const INVESTMENTS = [
  { name: "Actions",     value: 12400, color: "#00e5a0", icon: "📈" },
  { name: "Immobilier",  value: 45000, color: "#6c8eff", icon: "🏢" },
  { name: "Crypto",      value: 3200,  color: "#ff6c8e", icon: "₿"  },
  { name: "Obligations", value: 8000,  color: "#ffd700", icon: "📊" },
  { name: "Épargne",     value: 6500,  color: "#a78bfa", icon: "🏦" },
];

const CASHFLOW = [
  { month: "Jan", revenus: 4200, depenses: 2800 },
  { month: "Fév", revenus: 4200, depenses: 3100 },
  { month: "Mar", revenus: 4500, depenses: 2700 },
  { month: "Avr", revenus: 4200, depenses: 3400 },
  { month: "Mai", revenus: 4800, depenses: 2950 },
];

const CHARGES = [
  { label: "Assurance auto", amount: 95,  due: "15 Mai", icon: "🚗", status: "upcoming" },
  { label: "Téléphone",      amount: 30,  due: "20 Mai", icon: "📱", status: "upcoming" },
  { label: "Internet",       amount: 35,  due: "22 Mai", icon: "🌐", status: "upcoming" },
  { label: "Électricité",    amount: 120, due: "28 Mai", icon: "⚡", status: "pending"  },
  { label: "Mutuelle santé", amount: 75,  due: "01 Jun", icon: "❤️", status: "future"   },
];

const CAT_COLORS = {
  Logement:     "#6c8eff",
  Alimentation: "#00e5a0",
  Loisirs:      "#ff6c8e",
  Transport:    "#ffd700",
  Santé:        "#a78bfa",
};

const ICONS_MAP = {
  Logement: "🏠", Alimentation: "🛒", Loisirs: "🎮", Transport: "🚗", Santé: "💊",
};

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "18px 20px",
};

function Dashboard({ expenses }) {
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const income = 4800;
  const balance = income - totalExp;
  const totalInvest = INVESTMENTS.reduce((s, i) => s + i.value, 0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, paddingBottom:16 }}>
      <div style={{ ...card, background:"linear-gradient(135deg,rgba(0,229,160,0.12),rgba(108,142,255,0.12))", textAlign:"center", padding:"28px 20px" }}>
        <div style={{ fontSize:12, color:"#888", fontFamily:"DM Mono,monospace", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Solde disponible</div>
        <div style={{ fontSize:44, fontWeight:800, color:"#fff", letterSpacing:-2 }}>{balance.toLocaleString()} €</div>
        <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#00e5a0", fontFamily:"DM Mono,monospace" }}>REVENUS</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{income.toLocaleString()} €</div>
          </div>
          <div style={{ width:1, background:"rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#ff6c8e", fontFamily:"DM Mono,monospace" }}>DÉPENSES</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{totalExp.toLocaleString()} €</div>
          </div>
          <div style={{ width:1, background:"rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#ffd700", fontFamily:"DM Mono,monospace" }}>PATRIMOINE</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{(totalInvest/1000).toFixed(0)}k €</div>
          </div>
        </div>
      </div>
      <div style={{ ...card }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Score santé financière</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#00e5a0" }}>82/100</div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
          <div style={{ width:"82%", height:"100%", background:"linear-gradient(90deg,#00e5a0,#6c8eff)", borderRadius:3 }} />
        </div>
        <div style={{ fontSize:12, color:"#555", marginTop:6, fontFamily:"DM Mono,monospace" }}>Très bonne gestion · +3 pts ce mois</div>
      </div>
      <div style={{ ...card }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:14 }}>Flux financier 2026</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={CASHFLOW}>
            <defs>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ff6c8e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff6c8e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#555", fontSize:10 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background:"#111", border:"1px solid #222", borderRadius:8, color:"#fff", fontSize:12 }} />
            <Area type="monotone" dataKey="revenus"  stroke="#00e5a0" fill="url(#gR)" strokeWidth={2} name="Revenus" />
            <Area type="monotone" dataKey="depenses" stroke="#ff6c8e" fill="url(#gD)" strokeWidth={2} name="Dépenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:12 }}>Dernières transactions</div>
        {expenses.slice(-4).reverse().map(e => (
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize:22 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.label}</div>
              <div style={{ fontSize:11, color:"#555" }}>{e.category} · {e.date}</div>
            </div>
            <div style={{ fontSize:14, color:"#ff6c8e", fontFamily:"DM Mono,monospace", fontWeight:700 }}>-{e.amount} €</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Expenses({ expenses, setExpenses }) {
  const [form, setForm] = useState({ label:"", amount:"", category:"Alimentation" });
  const [showForm, setShowForm] = useState(false);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  const add = () => {
    if (!form.label || !form.amount) return;
    setExpenses(p => [...p, { ...form, id: Date.now(), amount: +form.amount, date: new Date().toISOString().split("T")[0], icon: ICONS_MAP[form.category] || "💳" }]);
    setForm({ label:"", amount:"", category:"Alimentation" });
    setShowForm(false);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Dépenses</div>
          <div style={{ fontSize:12, color:"#ff6c8e", fontFamily:"DM Mono,monospace" }}>Total : {total.toLocaleString()} €</div>
        </div>
        <button onClick={() => setShowForm(p => !p)} style={{ background:"#00e5a0", border:"none", borderRadius:12, padding:"10px 16px", color:"#000", fontWeight:800, fontSize:20, cursor:"pointer" }}>+</button>
      </div>
      {showForm && (
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="Description" value={form.label} onChange={e => setForm(p=>({...p,label:e.target.value}))} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%" }} />
          <input type="number" placeholder="Montant en €" value={form.amount} onChange={e => setForm(p=>({...p,amount:e.target.value}))} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%" }} />
          <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} style={{ background:"#111", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, width:"100%" }}>
            {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={add} style={{ background:"#00e5a0", border:"none", borderRadius:10, padding:"12px", color:"#000", fontWeight:800, fontSize:14, cursor:"pointer" }}>Ajouter ✓</button>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {Object.entries(byCategory).map(([cat, amt]) => (
          <div key={cat} style={{ ...card, padding:"14px 16px" }}>
            <div style={{ fontSize:11, color:"#666", marginBottom:4, fontFamily:"DM Mono,monospace" }}>{cat.toUpperCase()}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{amt} €</div>
            <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, marginTop:8 }}>
              <div style={{ width:`${Math.min(100,(amt/total)*100*2)}%`, height:"100%", background:CAT_COLORS[cat], borderRadius:2 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card }}>
        {expenses.slice().reverse().map(e => (
          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize:22 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.label}</div>
              <div style={{ display:"flex", gap:6, marginTop:2, alignItems:"center" }}>
                <span style={{ fontSize:10, color:CAT_COLORS[e.category], background:`${CAT_COLORS[e.category]}22`, padding:"1px 7px", borderRadius:20 }}>{e.category}</span>
                <span style={{ fontSize:10, color:"#555" }}>{e.date}</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:14, color:"#ff6c8e", fontFamily:"DM Mono,monospace", fontWeight:700 }}>-{e.amount} €</div>
              <button onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))} style={{ background:"rgba(255,100,100,0.1)", border:"none", borderRadius:8, width:28, height:28, color:"#ff6c8e", cursor:"pointer", fontSize:14 }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Investments() {
  const total = INVESTMENTS.reduce((s, i) => s + i.value, 0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Placements</div>
        <div style={{ fontSize:12, color:"#00e5a0", fontFamily:"DM Mono,monospace" }}>Patrimoine : {total.toLocaleString()} €</div>
      </div>
      <div style={{ ...card }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={INVESTMENTS} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
              {INVESTMENTS.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background:"#111", border:"1px solid #222", borderRadius:8, color:"#fff", fontSize:12 }} formatter={v => [`${v.toLocaleString()} €`]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {INVESTMENTS.map((inv, i) => {
        const pct = ((inv.value / total) * 100).toFixed(1);
        return (
          <div key={i} style={{ ...card }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{inv.icon}</span>
                <span style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{inv.name}</span>
              </div>
              <span style={{ fontFamily:"DM Mono,monospace", color:inv.color, fontWeight:700, fontSize:16 }}>{inv.value.toLocaleString()} €</span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:inv.color, borderRadius:2 }} />
            </div>
            <div style={{ fontSize:11, color:"#555", marginTop:4, fontFamily:"DM Mono,monospace" }}>{pct}% du portefeuille</div>
          </div>
        );
      })}
    </div>
  );
}

function Charges() {
  const statusStyle = {
    upcoming: { bg:"#ffd70018", border:"#ffd70033", text:"#ffd700", label:"À venir" },
    pending:  { bg:"#ff6c8e18", border:"#ff6c8e33", text:"#ff6c8e", label:"En attente" },
    future:   { bg:"#6c8eff18", border:"#6c8eff33", text:"#6c8eff", label:"Futur" },
  };
  const total = CHARGES.reduce((s, c) => s + c.amount, 0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, paddingBottom:16 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Charges</div>
        <div style={{ fontSize:12, color:"#a78bfa", fontFamily:"DM Mono,monospace" }}>Total mensuel : {total} €</div>
      </div>
      {CHARGES.map((c, i) => {
        const st = statusStyle[c.status];
        return (
          <div key={i} style={{ ...card, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:26 }}>{c.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{c.label}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:2 }}>Échéance : {c.due}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <div style={{ background:st.bg, border:`1px solid ${st.border}`, borderRadius:20, padding:"2px 10px", fontSize:10, color:st.text, fontFamily:"DM Mono,monospace" }}>{st.label}</div>
              <div style={{ fontFamily:"DM Mono,monospace", fontWeight:700, color:"#fff", fontSize:15 }}>{c.amount} €</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Conseils({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const income = 4800;
  const ratio = Math.round((total / income) * 100);
  const tips = [];
  const byCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  if ((byCategory["Loisirs"] || 0) > 200) tips.push({ icon:"🎮", text:"Tes loisirs dépassent 200 €. Essaie de fixer un budget mensuel fixe.", color:"#ff6c8e" });
  if ((byCategory["Alimentation"] || 0) > 400) tips.push({ icon:"🛒", text:"Budget alimentation élevé. Planifier les repas réduit les achats impulsifs.", color:"#ffd700" });
  if (ratio > 70) tips.push({ icon:"⚠️", text:`Tu dépenses ${ratio}% de tes revenus. L'objectif idéal est sous 70%.`, color:"#ff6c8e" });
  if (ratio < 70) tips.push({ icon:"✅", text:`Excellent ! Tu ne dépenses que ${ratio}% de tes revenus. Continue !`, color:"#00e5a0" });
  tips.push({ icon:"💡", text:"Règle des 50/30/20 : 50% besoins, 30% envies, 20% épargne.", color:"#6c8eff" });
  tips.push({ icon:"📅", text:"Vérifie tes abonnements chaque trimestre. Les petits montants s'accumulent.", color:"#a78bfa" });
  const claudePrompt = encodeURIComponent(`Bonjour ! Voici ma situation financière ce mois :\n- Revenus : ${income} €\n- Dépenses : ${total} €\n- Solde : ${income - total} €\n- Détail : ${expenses.map(e => `${e.label} ${e.amount}€`).join(", ")}\n\nPeux-tu m'aider à optimiser mon budget ?`);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, paddingBottom:16 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Conseils</div>
        <div style={{ fontSize:12, color:"#555", fontFamily:"DM Mono,monospace" }}>Analyse automatique + accès à Claude</div>
      </div>
      <div style={{ ...card, background:"linear-gradient(135deg,rgba(0,229,160,0.08),rgba(108,142,255,0.08))" }}>
        <div style={{ fontSize:13, color:"#888", marginBottom:12 }}>Santé financière ce mois</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>{ratio}%</div>
          <div style={{ fontSize:13, color: ratio < 70 ? "#00e5a0" : "#ff6c8e" }}>{ratio < 70 ? "✅ Dans les clous" : "⚠️ À surveiller"}</div>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
          <div style={{ width:`${Math.min(ratio,100)}%`, height:"100%", background: ratio < 70 ? "#00e5a0" : "#ff6c8e", borderRadius:3 }} />
        </div>
        <div style={{ fontSize:11, color:"#555", marginTop:6, fontFamily:"DM Mono,monospace" }}>Dépenses / Revenus · objectif &lt; 70%</div>
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>💬 Analyse automatique</div>
      {tips.map((tip, i) => (
        <div key={i} style={{ ...card, display:"flex", gap:14, alignItems:"flex-start", borderLeft:`3px solid ${tip.color}` }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{tip.icon}</span>
          <span style={{ fontSize:14, color:"#ccc", lineHeight:1.5 }}>{tip.text}</span>
        </div>
      ))}
      <div style={{ ...card, background:"linear-gradient(135deg,rgba(108,142,255,0.12),rgba(0,229,160,0.08))", textAlign:"center", padding:"28px 20px" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
        <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:8 }}>Besoin d'un conseil personnalisé ?</div>
        <div style={{ fontSize:13, color:"#666", marginBottom:20, lineHeight:1.5 }}>Ouvre Claude.ai avec tes données pré-remplies pour une analyse approfondie.</div>
        <a href={`https://claude.ai/new?q=${claudePrompt}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", background:"linear-gradient(135deg,#00e5a0,#6c8eff)", borderRadius:14, padding:"14px 28px", color:"#000", fontWeight:800, fontSize:15, textDecoration:"none" }}>Ouvrir Claude.ai →</a>
        <div style={{ fontSize:11, color:"#444", marginTop:12, fontFamily:"DM Mono,monospace" }}>Gratuit · Inclus dans ton abonnement Claude</div>
      </div>
    </div>
  );
}

const NAV = [
  { id:"dashboard",   icon:"⬡", label:"Accueil" },
  { id:"expenses",    icon:"↓",  label:"Dépenses" },
  { id:"investments", icon:"◈",  label:"Placements" },
  { id:"charges",     icon:"⏱", label:"Charges" },
  { id:"conseils",    icon:"✦",  label:"Conseils" },
];

export default function App() {
  const [active, setActive]     = useState("dashboard");
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const pages = {
    dashboard:   <Dashboard   expenses={expenses} />,
    expenses:    <Expenses    expenses={expenses} setExpenses={setExpenses} />,
    investments: <Investments />,
    charges:     <Charges />,
    conseils:    <Conseils    expenses={expenses} />,
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:"#07070d", overflow:"hidden" }}>
      <div className="safe-top" style={{ background:"rgba(7,7,13,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 20px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div style={{ fontWeight:800, fontSize:20, color:"#fff", letterSpacing:-0.5 }}><span style={{ color:"#00e5a0" }}>Fin</span>Pilot</div>
        <div style={{ fontSize:11, color:"#00e5a0", background:"rgba(0,229,160,0.1)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:20, padding:"3px 10px", fontFamily:"DM Mono,monospace" }}>● EN DIRECT</div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0", display:"flex", flexDirection:"column" }}>
        <div className="fade-in" key={active} style={{ flex:1 }}>{pages[active]}</div>
      </div>
      <div className="safe-bottom" style={{ background:"rgba(7,7,13,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexShrink:0 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"10px 0 8px", border:"none", background:"transparent", cursor:"pointer", color: active===item.id ? "#00e5a0" : "#444", transition:"color 0.15s" }}>
            <span style={{ fontSize:18, marginBottom:3 }}>{item.icon}</span>
            <span style={{ fontSize:10, fontFamily:"DM Mono,monospace", letterSpacing:0.5 }}>{item.label}</span>
            {active===item.id && <div style={{ width:4, height:4, borderRadius:"50%", background:"#00e5a0", marginTop:3 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
