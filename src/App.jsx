import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from “recharts”;

// ─── Storage ──────────────────────────────────────────────────────────────────
const KEY = ‘finpilot_v3’;
const load = () => { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; } };
const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e) {} };

const NOW = new Date();
const CUR_MONTH = `${NOW.getFullYear()}-${String(NOW.getMonth()+1).padStart(2,'0')}`;
const MONTH_NAMES = [“Jan”,“Fév”,“Mar”,“Avr”,“Mai”,“Jun”,“Jul”,“Aoû”,“Sep”,“Oct”,“Nov”,“Déc”];

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT = {
income: 4800,
expenses: [
{ id:1, label:“Loyer”,          amount:1200, category:“Logement”,     type:“fixed”,    date:“2026-05-01”, icon:“🏠” },
{ id:2, label:“Courses”,        amount:340,  category:“Courses”,      type:“variable”, date:“2026-05-03”, icon:“🛒” },
{ id:3, label:“Netflix”,        amount:17,   category:“Loisirs”,      type:“fixed”,    date:“2026-05-05”, icon:“📺” },
{ id:4, label:“Essence”,        amount:80,   category:“Voiture”,      type:“variable”, date:“2026-05-06”, icon:“⛽” },
{ id:5, label:“Restaurant”,     amount:65,   category:“Restauration”, type:“variable”, date:“2026-05-07”, icon:“🍽” },
{ id:6, label:“Abonnement gym”, amount:45,   category:“Sante”,        type:“fixed”,    date:“2026-05-08”, icon:“💪” },
],
fixedCharges: [
{ id:1, label:“Loyer”,         amount:1200, day:“01”, icon:“🏠”, active:true },
{ id:2, label:“Telephone”,     amount:30,   day:“20”, icon:“📱”, active:true },
{ id:3, label:“Internet”,      amount:35,   day:“22”, icon:“🌐”, active:true },
{ id:4, label:“Abonnement gym”,amount:45,   day:“01”, icon:“💪”, active:true },
{ id:5, label:“Netflix”,       amount:17,   day:“05”, icon:“📺”, active:true },
{ id:6, label:“Mutuelle”,      amount:75,   day:“01”, icon:“❤️”, active:true },
],
variableCharges: [
{ id:1, label:“Electricite”,   amount:120, frequency:“Mensuel”,    lastPaid:“2026-04-28”, icon:“⚡”, notes:”” },
{ id:2, label:“Eau”,           amount:85,  frequency:“Semestriel”, lastPaid:“2026-02-15”, icon:“💧”, notes:“Variable selon conso” },
{ id:3, label:“Assurance auto”,amount:95,  frequency:“Mensuel”,    lastPaid:“2026-05-15”, icon:“🚗”, notes:”” },
{ id:4, label:“Entretien voiture”,amount:250,frequency:“Annuel”,   lastPaid:“2026-01-10”, icon:“🔧”, notes:“CT + vidange” },
],
futureCharges: [
{ id:1, label:“Vacances ete”,  amount:1200, date:“2026-07-01”, icon:“✈️”, saved:400,  notes:“Budget previsionnel” },
{ id:2, label:“Noel”,          amount:600,  date:“2026-12-20”, icon:“🎄”, saved:0,    notes:“Cadeaux + repas” },
{ id:3, label:“Renovation sdb”,amount:3000, date:“2026-10-01”, icon:“🛁”, saved:800,  notes:“Plombier + carrelage” },
],
investments: [
{ id:1, name:“PEA”,      value:12400, color:”#00e5a0”, icon:“📈”, details:[
{ label:“Broker”,      val:“Boursorama” },
{ label:“Ouverture”,   val:“Jan 2021” },
{ label:“Performance”, val:”+18.4%” },
{ label:“Versement mensuel”, val:“200 EUR” },
]},
{ id:2, name:“PEE”,      value:8000,  color:”#6c8eff”, icon:“🏢”, details:[
{ label:“Employeur”,   val:“Ma Societe” },
{ label:“Abondement”,  val:“50%” },
{ label:“Disponible”,  val:“2028” },
{ label:“Versement”,   val:“100 EUR/mois” },
]},
{ id:3, name:“Livret A”, value:6500,  color:”#a78bfa”, icon:“🏦”, details:[
{ label:“Banque”,      val:“Credit Mutuel” },
{ label:“Taux”,        val:“3%” },
{ label:“Plafond”,     val:“22 950 EUR” },
{ label:“Objectif”,    val:“3 mois de depenses” },
]},
{ id:4, name:“Crypto”,   value:3200,  color:”#ff6c8e”, icon:“₿”,  details:[
{ label:“Plateforme”,  val:“Binance” },
{ label:“BTC”,         val:“0.04” },
{ label:“ETH”,         val:“0.8” },
]},
{ id:5, name:“Immobilier”,value:45000,color:”#ffd700”, icon:“🏠”, details:[
{ label:“Type”,        val:“SCPI” },
{ label:“Rendement”,   val:“5.2%/an” },
{ label:“Parts”,       val:“15” },
]},
],
debts: [
{ id:1, label:“Pret auto”,           total:12000, remaining:8400, monthly:280, rate:3.5, icon:“🚗”, color:”#ff6c8e” },
{ id:2, label:“Credit consommation”, total:3000,  remaining:1200, monthly:120, rate:5.9, icon:“💳”, color:”#ffd700” },
{ id:3, label:“Decouvert bancaire”,  total:500,   remaining:500,  monthly:0,   rate:18,  icon:“🏦”, color:”#a78bfa” },
],
history: [],
lastReminder: null,
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CATS = {
Logement:     { color:”#6c8eff”, icon:“🏠” },
Courses:      { color:”#00e5a0”, icon:“🛒” },
Voiture:      { color:”#ffd700”, icon:“🚗” },
Restauration: { color:”#ff9f43”, icon:“🍽” },
Loisirs:      { color:”#ff6c8e”, icon:“🎮” },
Sante:        { color:”#a78bfa”, icon:“💊” },
Habillement:  { color:”#54a0ff”, icon:“👕” },
Technologie:  { color:”#00d2d3”, icon:“💻” },
Voyage:       { color:”#5f27cd”, icon:“✈️” },
Autre:        { color:”#888”,    icon:“💳” },
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
const S = {
card: { background:“rgba(255,255,255,0.04)”, border:“1px solid rgba(255,255,255,0.08)”, borderRadius:16, padding:“18px 20px” },
inp:  { background:“rgba(255,255,255,0.06)”, border:“1px solid rgba(255,255,255,0.1)”, borderRadius:10, padding:“11px 14px”, color:”#fff”, fontSize:14, outline:“none”, width:“100%”, fontFamily:“inherit” },
sel:  { background:”#111”, border:“1px solid rgba(255,255,255,0.1)”, borderRadius:10, padding:“11px 14px”, color:”#fff”, fontSize:14, width:“100%”, fontFamily:“inherit” },
btn:  { background:”#00e5a0”, border:“none”, borderRadius:10, padding:“11px 16px”, color:”#000”, fontWeight:800, fontSize:14, cursor:“pointer”, fontFamily:“inherit” },
del:  { background:“rgba(255,100,100,0.1)”, border:“none”, borderRadius:8, width:28, height:28, color:”#ff6c8e”, cursor:“pointer”, fontSize:14, fontFamily:“inherit” },
edit: { background:“rgba(255,255,255,0.06)”, border:“none”, borderRadius:8, width:28, height:28, color:”#fff”, cursor:“pointer”, fontSize:12, fontFamily:“inherit” },
};

// ─── Mini Form Helper ─────────────────────────────────────────────────────────
function Field({ label, children }) {
return (
<div>
<div style={{ fontSize:11, color:”#555”, marginBottom:4, fontFamily:“DM Mono,monospace” }}>{label}</div>
{children}
</div>
);
}

// ════════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
function Dashboard({ data, setData }) {
const totalExp    = data.expenses.reduce((s,e) => s+e.amount, 0);
const totalInvest = data.investments.reduce((s,i) => s+i.value, 0);
const totalDebt   = data.debts.reduce((s,d) => s+d.remaining, 0);
const totalFixed  = data.fixedCharges.filter(c=>c.active).reduce((s,c)=>s+c.amount,0);
const totalFuture = data.futureCharges.reduce((s,c)=>s+c.amount,0);
const balance     = data.income - totalExp;
const [editIncome, setEditIncome] = useState(false);
const [incomeVal, setIncomeVal]   = useState(String(data.income));

const saveIncome = () => { setData(p=>({…p,income:+incomeVal})); setEditIncome(false); };

const chartData = […(data.history||[]).slice(-5), {
month: MONTH_NAMES[NOW.getMonth()],
revenus: data.income, depenses: totalExp,
epargne: Math.max(0, data.income-totalExp),
}];

const annualBilan = (data.history||[]).reduce((acc,h) => {
acc.revenus  += h.revenus||0;
acc.depenses += h.depenses||0;
acc.epargne  += h.epargne||0;
return acc;
}, { revenus:0, depenses:0, epargne:0 });

return (
<div style={{ display:“flex”, flexDirection:“column”, gap:16, paddingBottom:16 }}>

```
  {/* Hero */}
  <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(0,229,160,0.12),rgba(108,142,255,0.12))", textAlign:"center", padding:"24px 20px" }}>
    <div style={{ fontSize:11, color:"#888", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Solde disponible</div>
    <div style={{ fontSize:42, fontWeight:800, color: balance>=0?"#fff":"#ff6c8e", letterSpacing:-2 }}>{balance.toLocaleString()} EUR</div>
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginTop:8 }}>
      {editIncome ? (
        <>
          <input value={incomeVal} onChange={e=>setIncomeVal(e.target.value)} type="number"
            style={{ ...S.inp, width:130, textAlign:"center", padding:"6px 10px" }} />
          <button onClick={saveIncome} style={{ ...S.btn, padding:"6px 12px", fontSize:12 }}>OK</button>
          <button onClick={()=>setEditIncome(false)} style={{ background:"transparent", border:"none", color:"#555", cursor:"pointer", fontSize:18 }}>×</button>
        </>
      ) : (
        <div style={{ fontSize:13, color:"#00e5a0", cursor:"pointer" }} onClick={()=>{setIncomeVal(String(data.income));setEditIncome(true);}}>
          Revenus : {data.income.toLocaleString()} EUR ✏️
        </div>
      )}
    </div>
    <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:16, flexWrap:"wrap" }}>
      {[
        { l:"DEPENSES",   v:`${totalExp.toLocaleString()}`, c:"#ff6c8e" },
        { l:"PLACEMENTS", v:`${(totalInvest/1000).toFixed(0)}k`, c:"#00e5a0" },
        { l:"DETTES",     v:`${totalDebt.toLocaleString()}`, c:"#ffd700" },
        { l:"CH.FIXES",   v:`${totalFixed}`, c:"#6c8eff" },
      ].map((k,i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ fontSize:9, color:k.c, letterSpacing:1 }}>{k.l}</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{k.v} EUR</div>
        </div>
      ))}
    </div>
  </div>

  {/* Score */}
  <div style={{ ...S.card }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Score sante financiere</div>
      <div style={{ fontSize:20, fontWeight:800, color:"#00e5a0" }}>
        {Math.max(0,Math.min(100,Math.round(100-(totalExp/data.income)*70+(totalInvest/200000)*30-(totalDebt/50000)*20)))}/100
      </div>
    </div>
    <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3 }}>
      <div style={{ width:`${Math.max(0,Math.min(100,Math.round(100-(totalExp/data.income)*70+(totalInvest/200000)*30-(totalDebt/50000)*20)))}%`, height:"100%", background:"linear-gradient(90deg,#00e5a0,#6c8eff)", borderRadius:3 }} />
    </div>
  </div>

  {/* Graphique evolution */}
  <div style={{ ...S.card }}>
    <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:14 }}>Evolution mensuelle</div>
    <ResponsiveContainer width="100%" height={170}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3}/><stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/></linearGradient>
          <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff6c8e" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff6c8e" stopOpacity={0}/></linearGradient>
          <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/><stop offset="95%" stopColor="#ffd700" stopOpacity={0}/></linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{fill:"#555",fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={40}/>
        <Tooltip contentStyle={{background:"#111",border:"1px solid #222",borderRadius:8,color:"#fff",fontSize:12}}/>
        <Area type="monotone" dataKey="revenus"  stroke="#00e5a0" fill="url(#gR)" strokeWidth={2} name="Revenus"/>
        <Area type="monotone" dataKey="depenses" stroke="#ff6c8e" fill="url(#gD)" strokeWidth={2} name="Depenses"/>
        <Area type="monotone" dataKey="epargne"  stroke="#ffd700" fill="url(#gE)" strokeWidth={2} name="Epargne"/>
      </AreaChart>
    </ResponsiveContainer>
  </div>

  {/* Bilan annuel */}
  {(data.history||[]).length > 0 && (
    <div style={{ ...S.card }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:12 }}>Bilan annuel {NOW.getFullYear()}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[
          { l:"Revenus",  v:annualBilan.revenus,  c:"#00e5a0" },
          { l:"Depenses", v:annualBilan.depenses, c:"#ff6c8e" },
          { l:"Epargne",  v:annualBilan.epargne,  c:"#ffd700" },
        ].map((k,i) => (
          <div key={i} style={{ textAlign:"center", padding:"12px 8px", background:"rgba(255,255,255,0.03)", borderRadius:12 }}>
            <div style={{ fontSize:10, color:k.c, marginBottom:4 }}>{k.l}</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{(k.v/1000).toFixed(1)}k</div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Charges avenir */}
  {data.futureCharges.length > 0 && (
    <div style={{ ...S.card }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:12 }}>Charges a venir · {totalFuture.toLocaleString()} EUR</div>
      {data.futureCharges.slice(0,3).map(c => {
        const pct = c.amount > 0 ? Math.min(100,Math.round((c.saved/c.amount)*100)) : 0;
        const daysLeft = Math.ceil((new Date(c.date)-NOW)/(1000*60*60*24));
        return (
          <div key={c.id} style={{ padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ fontSize:14, color:"#fff" }}>{c.icon} {c.label}</div>
              <div style={{ fontSize:12, color:"#ffd700" }}>J-{daysLeft}</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ fontSize:12, color:"#555" }}>{c.saved} / {c.amount} EUR epargne</div>
              <div style={{ fontSize:12, color:"#00e5a0" }}>{pct}%</div>
            </div>
            <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background:"#00e5a0", borderRadius:2 }} />
            </div>
          </div>
        );
      })}
    </div>
  )}

  {/* Dernieres transactions */}
  <div style={{ ...S.card }}>
    <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:12 }}>Dernieres transactions</div>
    {data.expenses.slice(-4).reverse().map(e => (
      <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize:22 }}>{e.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.label}</div>
          <div style={{ fontSize:11, color:"#555" }}>{e.category} · {e.date}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:14, color:"#ff6c8e", fontWeight:700 }}>-{e.amount} EUR</div>
          <div style={{ fontSize:10, color: e.type==="fixed"?"#6c8eff":"#ffd700" }}>{e.type==="fixed"?"Fixe":"Variable"}</div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPENSES
// ════════════════════════════════════════════════════════════════════════════════
function Expenses({ data, setData }) {
const [form, setForm]       = useState({ label:””, amount:””, category:“Courses”, type:“variable” });
const [showForm, setShowForm] = useState(false);
const [filter, setFilter]   = useState(“all”);

const total    = data.expenses.reduce((s,e)=>s+e.amount,0);
const fixed    = data.expenses.filter(e=>e.type===“fixed”).reduce((s,e)=>s+e.amount,0);
const variable = data.expenses.filter(e=>e.type===“variable”).reduce((s,e)=>s+e.amount,0);

const filtered = filter===“all” ? data.expenses : data.expenses.filter(e=>e.type===filter);
const byCategory = data.expenses.reduce((acc,e)=>{ acc[e.category]=(acc[e.category]||0)+e.amount; return acc; },{});

const add = () => {
if (!form.label||!form.amount) return;
setData(p=>({…p,expenses:[…p.expenses,{…form,id:Date.now(),amount:+form.amount,date:new Date().toISOString().split(“T”)[0],icon:CATS[form.category]?.icon||“💳”}]}));
setForm({label:””,amount:””,category:“Courses”,type:“variable”});
setShowForm(false);
};

return (
<div style={{display:“flex”,flexDirection:“column”,gap:14,paddingBottom:16}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Depenses</div>
<div style={{fontSize:12,color:”#ff6c8e”}}>Total : {total.toLocaleString()} EUR</div>
</div>
<button onClick={()=>setShowForm(p=>!p)} style={{…S.btn,fontSize:20,padding:“8px 16px”}}>+</button>
</div>

```
  {/* Filtres */}
  <div style={{display:"flex",gap:8}}>
    {[["all","Tout"],["fixed","Fixes"],["variable","Variables"]].map(([v,l])=>(
      <button key={v} onClick={()=>setFilter(v)} style={{flex:1,background:filter===v?"rgba(0,229,160,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${filter===v?"rgba(0,229,160,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"8px",color:filter===v?"#00e5a0":"#666",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
        {l}
      </button>
    ))}
  </div>

  {/* Stats */}
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
    <div style={{...S.card,padding:"14px 16px",borderTop:"3px solid #6c8eff"}}>
      <div style={{fontSize:10,color:"#6c8eff",marginBottom:4,fontFamily:"DM Mono,monospace"}}>FIXES</div>
      <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{fixed} EUR</div>
    </div>
    <div style={{...S.card,padding:"14px 16px",borderTop:"3px solid #ffd700"}}>
      <div style={{fontSize:10,color:"#ffd700",marginBottom:4,fontFamily:"DM Mono,monospace"}}>VARIABLES</div>
      <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{variable} EUR</div>
    </div>
  </div>

  {showForm && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Description">
        <input placeholder="Ex: Courses Lidl" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={S.inp}/>
      </Field>
      <Field label="Montant (EUR)">
        <input type="number" placeholder="0" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/>
      </Field>
      <Field label="Categorie">
        <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={S.sel}>
          {Object.keys(CATS).map(c=><option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Type">
        <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={S.sel}>
          <option value="fixed">Charge fixe</option>
          <option value="variable">Charge variable</option>
        </select>
      </Field>
      <button onClick={add} style={S.btn}>Ajouter la depense</button>
    </div>
  )}

  {/* Par categorie */}
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
    {Object.entries(byCategory).map(([cat,amt])=>(
      <div key={cat} style={{...S.card,padding:"12px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          <span style={{fontSize:16}}>{CATS[cat]?.icon||"💳"}</span>
          <span style={{fontSize:10,color:"#666",fontFamily:"DM Mono,monospace"}}>{cat.toUpperCase()}</span>
        </div>
        <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{amt} EUR</div>
        <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,marginTop:6}}>
          <div style={{width:`${Math.min(100,(amt/total)*150)}%`,height:"100%",background:CATS[cat]?.color||"#888",borderRadius:2}}/>
        </div>
      </div>
    ))}
  </div>

  {/* Liste */}
  <div style={{...S.card}}>
    {filtered.slice().reverse().map(e=>(
      <div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{fontSize:22}}>{e.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>{e.label}</div>
          <div style={{display:"flex",gap:6,marginTop:2}}>
            <span style={{fontSize:10,color:CATS[e.category]?.color||"#888",background:`${CATS[e.category]?.color||"#888"}22`,padding:"1px 7px",borderRadius:20}}>{e.category}</span>
            <span style={{fontSize:10,color:e.type==="fixed"?"#6c8eff":"#ffd700"}}>{e.type==="fixed"?"Fixe":"Variable"}</span>
          </div>
        </div>
        <div style={{fontSize:14,color:"#ff6c8e",fontWeight:700}}>-{e.amount} EUR</div>
        <button onClick={()=>setData(p=>({...p,expenses:p.expenses.filter(x=>x.id!==e.id)}))} style={S.del}>×</button>
      </div>
    ))}
  </div>
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// CHARGES (Fixes + Variables + Avenir)
// ════════════════════════════════════════════════════════════════════════════════
function Charges({ data, setData }) {
const [tab, setTab] = useState(“fixed”);
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({});

const totalFixed    = data.fixedCharges.filter(c=>c.active).reduce((s,c)=>s+c.amount,0);
const totalVariable = data.variableCharges.reduce((s,c)=>s+c.amount,0);
const totalFuture   = data.futureCharges.reduce((s,c)=>s+c.amount,0);

const addFixed = () => {
if (!form.label||!form.amount) return;
setData(p=>({…p,fixedCharges:[…p.fixedCharges,{…form,id:Date.now(),amount:+form.amount,active:true,icon:form.icon||“📋”}]}));
setForm({}); setShowForm(false);
};

const addVariable = () => {
if (!form.label||!form.amount) return;
setData(p=>({…p,variableCharges:[…p.variableCharges,{…form,id:Date.now(),amount:+form.amount,lastPaid:new Date().toISOString().split(“T”)[0],icon:form.icon||“📋”}]}));
setForm({}); setShowForm(false);
};

const addFuture = () => {
if (!form.label||!form.amount||!form.date) return;
setData(p=>({…p,futureCharges:[…p.futureCharges,{…form,id:Date.now(),amount:+form.amount,saved:+form.saved||0,icon:form.icon||“🎯”}]}));
setForm({}); setShowForm(false);
};

const ICONS = [“📋”,“🏠”,“💡”,“🌊”,“🚗”,“📱”,“🌐”,“❤️”,“🎓”,“🛁”,“✈️”,“🎄”,“🔧”,“⚡”,“💧”,“🎯”];

return (
<div style={{display:“flex”,flexDirection:“column”,gap:14,paddingBottom:16}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Charges</div>
<div style={{fontSize:12,color:”#555”,fontFamily:“DM Mono,monospace”}}>Fixes · Variables · Avenir</div>
</div>
<button onClick={()=>setShowForm(p=>!p)} style={{…S.btn,fontSize:20,padding:“8px 16px”}}>+</button>
</div>

```
  {/* Tabs */}
  <div style={{display:"flex",gap:6}}>
    {[["fixed","Fixes",totalFixed,"#6c8eff"],["variable","Variables",totalVariable,"#ffd700"],["future","Avenir",totalFuture,"#00e5a0"]].map(([v,l,t,c])=>(
      <button key={v} onClick={()=>{setTab(v);setShowForm(false);}} style={{flex:1,background:tab===v?`${c}18`:"rgba(255,255,255,0.03)",border:`1px solid ${tab===v?`${c}44`:"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:"10px 6px",color:tab===v?c:"#555",fontSize:11,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
        <div style={{fontWeight:700}}>{l}</div>
        <div style={{fontSize:10,marginTop:2}}>{t} EUR</div>
      </button>
    ))}
  </div>

  {/* Formulaires */}
  {showForm && tab==="fixed" && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Nom"><input placeholder="Ex: Abonnement Spotify" value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={S.inp}/></Field>
      <Field label="Montant (EUR)"><input type="number" placeholder="0" value={form.amount||""} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/></Field>
      <Field label="Jour du mois"><input placeholder="Ex: 01" value={form.day||""} onChange={e=>setForm(p=>({...p,day:e.target.value}))} style={S.inp}/></Field>
      <Field label="Icone"><select value={form.icon||"📋"} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={S.sel}>{ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></Field>
      <button onClick={addFixed} style={S.btn}>Ajouter charge fixe</button>
    </div>
  )}

  {showForm && tab==="variable" && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Nom"><input placeholder="Ex: Facture eau" value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={S.inp}/></Field>
      <Field label="Montant moyen (EUR)"><input type="number" placeholder="0" value={form.amount||""} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/></Field>
      <Field label="Frequence"><select value={form.frequency||"Mensuel"} onChange={e=>setForm(p=>({...p,frequency:e.target.value}))} style={S.sel}>
        <option>Mensuel</option><option>Bimestriel</option><option>Trimestriel</option><option>Semestriel</option><option>Annuel</option>
      </select></Field>
      <Field label="Notes"><input placeholder="Ex: Variable selon conso" value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={S.inp}/></Field>
      <Field label="Icone"><select value={form.icon||"📋"} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={S.sel}>{ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></Field>
      <button onClick={addVariable} style={S.btn}>Ajouter charge variable</button>
    </div>
  )}

  {showForm && tab==="future" && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Nom"><input placeholder="Ex: Vacances ete" value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={S.inp}/></Field>
      <Field label="Budget prevu (EUR)"><input type="number" placeholder="0" value={form.amount||""} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/></Field>
      <Field label="Date prevue"><input type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={S.inp}/></Field>
      <Field label="Deja epargne (EUR)"><input type="number" placeholder="0" value={form.saved||""} onChange={e=>setForm(p=>({...p,saved:e.target.value}))} style={S.inp}/></Field>
      <Field label="Notes"><input placeholder="Ex: Budget hotel + vols" value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={S.inp}/></Field>
      <Field label="Icone"><select value={form.icon||"🎯"} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={S.sel}>{ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></Field>
      <button onClick={addFuture} style={S.btn}>Ajouter charge future</button>
    </div>
  )}

  {/* Charges FIXES */}
  {tab==="fixed" && (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {data.fixedCharges.map(c=>(
        <div key={c.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,opacity:c.active?1:0.5}}>
          <div style={{fontSize:26}}>{c.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.label}</div>
            <div style={{fontSize:12,color:"#555",marginTop:2}}>Chaque mois le {c.day}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:700,color:"#6c8eff",fontSize:15}}>{c.amount} EUR</div>
            <button onClick={()=>setData(p=>({...p,fixedCharges:p.fixedCharges.map(x=>x.id===c.id?{...x,active:!x.active}:x)}))}
              style={{background:"transparent",border:"none",color:c.active?"#00e5a0":"#555",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              {c.active?"Actif":"Pause"}
            </button>
          </div>
          <button onClick={()=>setData(p=>({...p,fixedCharges:p.fixedCharges.filter(x=>x.id!==c.id)}))} style={S.del}>×</button>
        </div>
      ))}
    </div>
  )}

  {/* Charges VARIABLES */}
  {tab==="variable" && (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {data.variableCharges.map(c=>(
        <div key={c.id} style={{...S.card}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:26}}>{c.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.label}</div>
              <div style={{fontSize:12,color:"#555",marginTop:2}}>{c.frequency} · Dernier : {c.lastPaid}</div>
              {c.notes && <div style={{fontSize:11,color:"#444",marginTop:2}}>{c.notes}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700,color:"#ffd700",fontSize:15}}>{c.amount} EUR</div>
            </div>
            <button onClick={()=>setData(p=>({...p,variableCharges:p.variableCharges.filter(x=>x.id!==c.id)}))} style={S.del}>×</button>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Charges AVENIR */}
  {tab==="future" && (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {data.futureCharges.map(c=>{
        const pct = c.amount>0?Math.min(100,Math.round((c.saved/c.amount)*100)):0;
        const daysLeft = Math.ceil((new Date(c.date)-NOW)/(1000*60*60*24));
        const monthlySave = daysLeft>0 ? Math.ceil((c.amount-c.saved)/(daysLeft/30)) : 0;
        return (
          <div key={c.id} style={{...S.card}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:24}}>{c.icon}</span>
                <div>
                  <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.label}</div>
                  <div style={{fontSize:12,color:"#555"}}>{c.date} · J-{Math.max(0,daysLeft)}</div>
                </div>
              </div>
              <button onClick={()=>setData(p=>({...p,futureCharges:p.futureCharges.filter(x=>x.id!==c.id)}))} style={S.del}>×</button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:13,color:"#ccc"}}>{c.saved.toLocaleString()} / {c.amount.toLocaleString()} EUR</div>
              <div style={{fontSize:13,color:"#00e5a0",fontWeight:700}}>{pct}%</div>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:3,marginBottom:8}}>
              <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#00e5a0,#6c8eff)",borderRadius:3}}/>
            </div>
            {c.notes && <div style={{fontSize:12,color:"#555",marginBottom:6}}>{c.notes}</div>}
            {monthlySave>0 && <div style={{fontSize:12,color:"#ffd700"}}>→ Epargner {monthlySave} EUR/mois pour atteindre l objectif</div>}
            {/* Mise a jour epargne */}
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <input type="number" placeholder="Epargne actuelle" defaultValue={c.saved}
                onBlur={e=>setData(p=>({...p,futureCharges:p.futureCharges.map(x=>x.id===c.id?{...x,saved:+e.target.value}:x)}))}
                style={{...S.inp,flex:1,padding:"8px 12px",fontSize:12}}/>
              <div style={{fontSize:12,color:"#555",alignSelf:"center",whiteSpace:"nowrap"}}>EUR epargnes</div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// INVESTMENTS
// ════════════════════════════════════════════════════════════════════════════════
function Investments({ data, setData }) {
const [showForm, setShowForm]   = useState(false);
const [editId, setEditId]       = useState(null);
const [expandId, setExpandId]   = useState(null);
const [showDetail, setShowDetail] = useState(false);
const [detailForm, setDetailForm] = useState({ label:””, val:”” });
const [form, setForm] = useState({ name:””, value:””, color:”#00e5a0”, icon:“📈”, details:[], reminder:true });
const total = data.investments.reduce((s,i)=>s+i.value,0);

const COLORS = [”#00e5a0”,”#6c8eff”,”#ff6c8e”,”#ffd700”,”#a78bfa”,”#ff9f43”,”#54a0ff”];

const save = () => {
if (!form.name||!form.value) return;
if (editId) {
setData(p=>({…p,investments:p.investments.map(i=>i.id===editId?{…i,…form,value:+form.value}:i)}));
setEditId(null);
} else {
setData(p=>({…p,investments:[…p.investments,{…form,id:Date.now(),value:+form.value,details:form.details||[]}]}));
}
setForm({name:””,value:””,color:”#00e5a0”,icon:“📈”,details:[],reminder:true});
setShowForm(false);
};

const startEdit = (inv) => {
setForm({…inv,value:String(inv.value)});
setEditId(inv.id);
setShowForm(true);
setExpandId(null);
};

const addDetail = (invId) => {
if (!detailForm.label||!detailForm.val) return;
setData(p=>({…p,investments:p.investments.map(i=>i.id===invId?{…i,details:[…(i.details||[]),{…detailForm,id:Date.now()}]}:i)}));
setDetailForm({label:””,val:””});
setShowDetail(false);
};

const removeDetail = (invId, detId) => {
setData(p=>({…p,investments:p.investments.map(i=>i.id===invId?{…i,details:(i.details||[]).filter(d=>d.id!==detId)}:i)}));
};

const ICONS = [“📈”,“🏦”,“🏠”,“₿”,“📊”,“💰”,“🌍”,“⚡”,“🌱”,“💎”];

return (
<div style={{display:“flex”,flexDirection:“column”,gap:14,paddingBottom:16}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Placements</div>
<div style={{fontSize:12,color:”#00e5a0”}}>Total : {total.toLocaleString()} EUR</div>
</div>
<button onClick={()=>{setShowForm(p=>!p);setEditId(null);setForm({name:””,value:””,color:”#00e5a0”,icon:“📈”,details:[],reminder:true});}} style={{…S.btn,fontSize:20,padding:“8px 16px”}}>+</button>
</div>

```
  {/* Donut */}
  <div style={{...S.card}}>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data.investments} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
          {data.investments.map((e,i)=><Cell key={i} fill={e.color}/>)}
        </Pie>
        <Tooltip contentStyle={{background:"#111",border:"1px solid #222",borderRadius:8,color:"#fff",fontSize:12}} formatter={v=>[`${v.toLocaleString()} EUR`]}/>
      </PieChart>
    </ResponsiveContainer>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
      {data.investments.map(inv=>(
        <div key={inv.id} style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:inv.color}}/>
          <span style={{fontSize:11,color:"#888"}}>{inv.name} {((inv.value/total)*100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  </div>

  {showForm && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Nom du placement">
        <input placeholder="Ex: PEA, Livret A, Crypto..." value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={S.inp}/>
      </Field>
      <Field label="Valeur actuelle (EUR)">
        <input type="number" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} style={S.inp}/>
      </Field>
      <Field label="Icone">
        <select value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={S.sel}>
          {ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}
        </select>
      </Field>
      <Field label="Couleur">
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {COLORS.map(c=>(
            <div key={c} onClick={()=>setForm(p=>({...p,color:c}))}
              style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?"3px solid #fff":"3px solid transparent"}}/>
          ))}
        </div>
      </Field>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <input type="checkbox" checked={form.reminder} onChange={e=>setForm(p=>({...p,reminder:e.target.checked}))} id="rem"/>
        <label htmlFor="rem" style={{fontSize:13,color:"#ccc",cursor:"pointer"}}>Rappel mensuel de mise a jour</label>
      </div>
      <button onClick={save} style={S.btn}>{editId?"Modifier":"Ajouter"}</button>
    </div>
  )}

  {data.investments.map(inv=>{
    const pct = ((inv.value/total)*100).toFixed(1);
    const isOpen = expandId===inv.id;
    return (
      <div key={inv.id} style={{...S.card}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>{inv.icon}</span>
            <div>
              <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{inv.name}</div>
              {inv.reminder && <div style={{fontSize:10,color:"#ffd700"}}>🔔 Rappel mensuel actif</div>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:inv.color,fontWeight:700,fontSize:16}}>{inv.value.toLocaleString()} EUR</span>
            <button onClick={()=>startEdit(inv)} style={S.edit}>✏️</button>
            <button onClick={()=>setExpandId(isOpen?null:inv.id)} style={{...S.edit,color:isOpen?"#00e5a0":"#666"}}>
              {isOpen?"▲":"▼"}
            </button>
            <button onClick={()=>setData(p=>({...p,investments:p.investments.filter(i=>i.id!==inv.id)}))} style={S.del}>×</button>
          </div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2}}>
          <div style={{width:`${pct}%`,height:"100%",background:inv.color,borderRadius:2}}/>
        </div>
        <div style={{fontSize:11,color:"#555",marginTop:4}}>{pct}% du portefeuille</div>

        {/* Details expandables */}
        {isOpen && (
          <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:10}}>Details du placement</div>
            {(inv.details||[]).map(d=>(
              <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:12,color:"#888"}}>{d.label}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:"#fff",fontWeight:600}}>{d.val}</span>
                  <button onClick={()=>removeDetail(inv.id,d.id)} style={{...S.del,width:22,height:22,fontSize:12}}>×</button>
                </div>
              </div>
            ))}
            {showDetail && expandId===inv.id ? (
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <input placeholder="Label (ex: Broker)" value={detailForm.label} onChange={e=>setDetailForm(p=>({...p,label:e.target.value}))} style={{...S.inp,flex:1,padding:"8px 10px",fontSize:12}}/>
                <input placeholder="Valeur" value={detailForm.val} onChange={e=>setDetailForm(p=>({...p,val:e.target.value}))} style={{...S.inp,flex:1,padding:"8px 10px",fontSize:12}}/>
                <button onClick={()=>addDetail(inv.id)} style={{...S.btn,padding:"8px 12px",fontSize:12,whiteSpace:"nowrap"}}>+</button>
              </div>
            ) : (
              <button onClick={()=>{setShowDetail(true);}} style={{background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:10,padding:"8px 14px",color:"#00e5a0",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:10,width:"100%"}}>
                + Ajouter un detail
              </button>
            )}
          </div>
        )}
      </div>
    );
  })}
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// DEBTS
// ════════════════════════════════════════════════════════════════════════════════
function Debts({ data, setData }) {
const [showForm, setShowForm] = useState(false);
const [editId, setEditId]     = useState(null);
const [form, setForm] = useState({ label:””, total:””, remaining:””, monthly:””, rate:””, icon:“💳”, color:”#ff6c8e” });

const totalDebt    = data.debts.reduce((s,d)=>s+d.remaining,0);
const totalMonthly = data.debts.reduce((s,d)=>s+d.monthly,0);

const save = () => {
if (!form.label||!form.remaining) return;
const entry = {…form,total:+form.total,remaining:+form.remaining,monthly:+form.monthly,rate:+form.rate};
if (editId) {
setData(p=>({…p,debts:p.debts.map(d=>d.id===editId?{…d,…entry}:d)}));
setEditId(null);
} else {
setData(p=>({…p,debts:[…p.debts,{…entry,id:Date.now()}]}));
}
setForm({label:””,total:””,remaining:””,monthly:””,rate:””,icon:“💳”,color:”#ff6c8e”});
setShowForm(false);
};

const ICONS = [“💳”,“🚗”,“🏠”,“🎓”,“🏦”,“💊”,“📱”];
const COLORS = [”#ff6c8e”,”#ffd700”,”#a78bfa”,”#ff9f43”,”#6c8eff”];

return (
<div style={{display:“flex”,flexDirection:“column”,gap:14,paddingBottom:16}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Dettes & Prets</div>
<div style={{fontSize:12,color:”#ff6c8e”}}>Restant : {totalDebt.toLocaleString()} EUR · {totalMonthly} EUR/mois</div>
</div>
<button onClick={()=>{setShowForm(p=>!p);setEditId(null);setForm({label:””,total:””,remaining:””,monthly:””,rate:””,icon:“💳”,color:”#ff6c8e”});}} style={{…S.btn,fontSize:20,padding:“8px 16px”}}>+</button>
</div>

```
  <div style={{...S.card,background:"linear-gradient(135deg,rgba(255,108,142,0.08),rgba(167,139,250,0.08))"}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:10,color:"#ff6c8e",marginBottom:4}}>TOTAL RESTANT</div>
        <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{totalDebt.toLocaleString()} EUR</div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:10,color:"#a78bfa",marginBottom:4}}>MENSUALITES</div>
        <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{totalMonthly} EUR</div>
      </div>
    </div>
  </div>

  {showForm && (
    <div style={{...S.card,display:"flex",flexDirection:"column",gap:10}}>
      <Field label="Nom"><input placeholder="Ex: Pret auto" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} style={S.inp}/></Field>
      <Field label="Montant total (EUR)"><input type="number" value={form.total} onChange={e=>setForm(p=>({...p,total:e.target.value}))} style={S.inp}/></Field>
      <Field label="Reste a payer (EUR)"><input type="number" value={form.remaining} onChange={e=>setForm(p=>({...p,remaining:e.target.value}))} style={S.inp}/></Field>
      <Field label="Mensualite (EUR)"><input type="number" value={form.monthly} onChange={e=>setForm(p=>({...p,monthly:e.target.value}))} style={S.inp}/></Field>
      <Field label="Taux d'interet (%)"><input type="number" step="0.1" value={form.rate} onChange={e=>setForm(p=>({...p,rate:e.target.value}))} style={S.inp}/></Field>
      <Field label="Icone"><select value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} style={S.sel}>{ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></Field>
      <Field label="Couleur">
        <div style={{display:"flex",gap:8}}>
          {COLORS.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?"3px solid #fff":"3px solid transparent"}}/>)}
        </div>
      </Field>
      <button onClick={save} style={S.btn}>{editId?"Modifier":"Ajouter"}</button>
    </div>
  )}

  {data.debts.map(d=>{
    const pct = d.total>0 ? ((d.remaining/d.total)*100).toFixed(0) : 0;
    const monthsLeft = d.monthly>0 ? Math.ceil(d.remaining/d.monthly) : null;
    return (
      <div key={d.id} style={{...S.card}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>{d.icon}</span>
            <div>
              <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{d.label}</div>
              <div style={{fontSize:11,color:"#555"}}>{d.monthly>0?`${d.monthly} EUR/mois`:"Pas de mensualite"}{d.rate>0?` · ${d.rate}%/an`:""}</div>
              {monthsLeft && <div style={{fontSize:11,color:"#ffd700"}}>Remboursement dans ~{monthsLeft} mois</div>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"#ff6c8e",fontWeight:700,fontSize:15}}>{d.remaining.toLocaleString()} EUR</span>
            <button onClick={()=>{setForm({...d,total:String(d.total),remaining:String(d.remaining),monthly:String(d.monthly),rate:String(d.rate)});setEditId(d.id);setShowForm(true);}} style={S.edit}>✏️</button>
            <button onClick={()=>setData(p=>({...p,debts:p.debts.filter(x=>x.id!==d.id)}))} style={S.del}>×</button>
          </div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2}}>
          <div style={{width:`${pct}%`,height:"100%",background:d.color||"#ff6c8e",borderRadius:2}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <div style={{fontSize:11,color:"#555"}}>{pct}% restant</div>
          <div style={{fontSize:11,color:"#555"}}>sur {d.total.toLocaleString()} EUR</div>
        </div>
      </div>
    );
  })}
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// BILAN ANNUEL
// ════════════════════════════════════════════════════════════════════════════════
function Bilan({ data, setData }) {
const saveMonth = () => {
const totalExp = data.expenses.reduce((s,e)=>s+e.amount,0);
const monthLabel = MONTH_NAMES[NOW.getMonth()];
const exists = (data.history||[]).find(h=>h.month===monthLabel && h.year===NOW.getFullYear());
if (!exists) {
setData(p=>({…p, history:[…(p.history||[]), {
month: monthLabel,
year: NOW.getFullYear(),
revenus: p.income,
depenses: totalExp,
epargne: Math.max(0,p.income-totalExp),
investTotal: data.investments.reduce((s,i)=>s+i.value,0),
debtTotal: data.debts.reduce((s,d)=>s+d.remaining,0),
}]}));
}
};

const history = data.history||[];
const annee = NOW.getFullYear();
const annualData = history.filter(h=>h.year===annee);
const totRev  = annualData.reduce((s,h)=>s+(h.revenus||0),0);
const totDep  = annualData.reduce((s,h)=>s+(h.depenses||0),0);
const totEp   = annualData.reduce((s,h)=>s+(h.epargne||0),0);

return (
<div style={{display:“flex”,flexDirection:“column”,gap:14,paddingBottom:16}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Bilan annuel {annee}</div>
<div style={{fontSize:12,color:”#555”,fontFamily:“DM Mono,monospace”}}>{annualData.length} mois enregistres</div>
</div>

```
  {/* Bouton sauvegarde mois */}
  <button onClick={saveMonth} style={{...S.btn,width:"100%",padding:"14px"}}>
    💾 Sauvegarder {MONTH_NAMES[NOW.getMonth()]} {annee}
  </button>

  {/* Totaux annuels */}
  {annualData.length>0 && (
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[
          {l:"Revenus",  v:totRev, c:"#00e5a0"},
          {l:"Depenses", v:totDep, c:"#ff6c8e"},
          {l:"Epargne",  v:totEp,  c:"#ffd700"},
        ].map((k,i)=>(
          <div key={i} style={{...S.card,padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:10,color:k.c,marginBottom:4}}>{k.l}</div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{(k.v/1000).toFixed(1)}k</div>
            <div style={{fontSize:10,color:"#555"}}>{k.v.toLocaleString()} EUR</div>
          </div>
        ))}
      </div>

      {/* Graphique annuel */}
      <div style={{...S.card}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>Graphique {annee}</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={annualData}>
            <XAxis dataKey="month" tick={{fill:"#555",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={40}/>
            <Tooltip contentStyle={{background:"#111",border:"1px solid #222",borderRadius:8,color:"#fff",fontSize:12}}/>
            <Bar dataKey="revenus"  fill="#00e5a0" radius={[4,4,0,0]} name="Revenus"/>
            <Bar dataKey="depenses" fill="#ff6c8e" radius={[4,4,0,0]} name="Depenses"/>
            <Bar dataKey="epargne"  fill="#ffd700" radius={[4,4,0,0]} name="Epargne"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historique mois par mois */}
      <div style={{...S.card}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:12}}>Detail mensuel</div>
        {annualData.slice().reverse().map((h,i)=>(
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{h.month} {h.year}</div>
              <div style={{fontSize:12,color:h.epargne>0?"#00e5a0":"#ff6c8e"}}>Epargne : {(h.epargne||0).toLocaleString()} EUR</div>
            </div>
            <div style={{display:"flex",gap:12}}>
              <div style={{fontSize:11,color:"#00e5a0"}}>Rev : {(h.revenus||0).toLocaleString()}</div>
              <div style={{fontSize:11,color:"#ff6c8e"}}>Dep : {(h.depenses||0).toLocaleString()}</div>
              {h.investTotal && <div style={{fontSize:11,color:"#ffd700"}}>Invest : {(h.investTotal/1000).toFixed(0)}k</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {annualData.length===0 && (
    <div style={{...S.card,textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:40,marginBottom:12}}>📊</div>
      <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:8}}>Pas encore de donnees</div>
      <div style={{fontSize:13,color:"#555"}}>Clique sur "Sauvegarder" chaque mois pour construire ton bilan annuel</div>
    </div>
  )}
</div>
```

);
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSEILS
// ════════════════════════════════════════════════════════════════════════════════
function Conseils({ data }) {
const totalExp     = data.expenses.reduce((s,e)=>s+e.amount,0);
const totalDebt    = data.debts.reduce((s,d)=>s+d.remaining,0);
const totalMonthly = data.debts.reduce((s,d)=>s+d.monthly,0);
const totalFixed   = data.fixedCharges.filter(c=>c.active).reduce((s,c)=>s+c.amount,0);
const totalInvest  = data.investments.reduce((s,i)=>s+i.value,0);
const ratio = Math.round((totalExp/data.income)*100);
const tips = [];

if (ratio>70) tips.push({icon:“⚠️”,text:`Tu depenses ${ratio}% de tes revenus. Objectif : sous 70%.`,color:”#ff6c8e”});
else tips.push({icon:“✅”,text:`Bonne gestion : ${ratio}% de tes revenus depenses ce mois.`,color:”#00e5a0”});
if (totalMonthly>data.income*0.33) tips.push({icon:“🔴”,text:`Tes mensualites (${totalMonthly} EUR) depassent 33% de tes revenus.`,color:”#ff6c8e”});
if (totalFixed>data.income*0.5) tips.push({icon:“🏠”,text:`Tes charges fixes (${totalFixed} EUR) representent plus de 50% de tes revenus.`,color:”#ffd700”});
const highRate = data.debts.filter(d=>d.rate>10);
if (highRate.length>0) tips.push({icon:“💸”,text:`Rembourse en priorite : ${highRate.map(d=>d.label).join(", ")} (taux eleve).`,color:”#ff6c8e”});
if (totalInvest<data.income*3) tips.push({icon:“📈”,text:`Ton patrimoine represente ${Math.round(totalInvest/data.income)} mois de revenus. Objectif : 6+ mois.`,color:”#6c8eff”});
tips.push({icon:“💡”,text:“Regle 50/30/20 : 50% besoins, 30% envies, 20% epargne/investissement.”,color:”#6c8eff”});
tips.push({icon:“📈”,text:“PEA : avantage fiscal apres 5 ans. Ideal pour investir en bourse long terme.”,color:”#00e5a0”});
tips.push({icon:“🏦”,text:“Livret A a 3% : garde 3 a 6 mois de depenses en securite avant d investir.”,color:”#a78bfa”});

const claudePrompt = encodeURIComponent(`Bonjour ! Ma situation financiere :\n- Revenus: ${data.income} EUR/mois\n- Depenses: ${totalExp} EUR\n- Charges fixes: ${totalFixed} EUR\n- Mensualites dettes: ${totalMonthly} EUR\n- Patrimoine total: ${totalInvest.toLocaleString()} EUR\n- Dettes restantes: ${totalDebt.toLocaleString()} EUR\n\nAnalyse et conseils pour optimiser ?`);

return (
<div style={{display:“flex”,flexDirection:“column”,gap:16,paddingBottom:16}}>
<div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”}}>Conseils</div>
<div style={{fontSize:12,color:”#555”}}>Analyse basee sur tes vraies donnees</div>
</div>
<div style={{…S.card,background:“linear-gradient(135deg,rgba(0,229,160,0.08),rgba(108,142,255,0.08))”}}>
<div style={{fontSize:13,color:”#888”,marginBottom:12}}>Sante financiere globale</div>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:10}}>
<div style={{fontSize:28,fontWeight:800,color:”#fff”}}>{ratio}%</div>
<div style={{fontSize:13,color:ratio<70?”#00e5a0”:”#ff6c8e”}}>{ratio<70?“Dans les clous”:“A surveiller”}</div>
</div>
<div style={{height:6,background:“rgba(255,255,255,0.08)”,borderRadius:3}}>
<div style={{width:`${Math.min(ratio,100)}%`,height:“100%”,background:ratio<70?”#00e5a0”:”#ff6c8e”,borderRadius:3}}/>
</div>
<div style={{fontSize:11,color:”#555”,marginTop:6}}>Depenses / Revenus</div>
</div>
{tips.map((tip,i)=>(
<div key={i} style={{…S.card,display:“flex”,gap:14,alignItems:“flex-start”,borderLeft:`3px solid ${tip.color}`}}>
<span style={{fontSize:22,flexShrink:0}}>{tip.icon}</span>
<span style={{fontSize:14,color:”#ccc”,lineHeight:1.5}}>{tip.text}</span>
</div>
))}
<div style={{…S.card,textAlign:“center”,padding:“28px 20px”}}>
<div style={{fontSize:32,marginBottom:12}}>✦</div>
<div style={{fontSize:17,fontWeight:800,color:”#fff”,marginBottom:8}}>Analyse IA personnalisee</div>
<div style={{fontSize:13,color:”#666”,marginBottom:20}}>Tes vraies donnees envoyes a Claude pour un conseil approfondi</div>
<a href={`https://claude.ai/new?q=${claudePrompt}`} target=”_blank” rel=“noopener noreferrer”
style={{display:“inline-block”,background:“linear-gradient(135deg,#00e5a0,#6c8eff)”,borderRadius:14,padding:“14px 28px”,color:”#000”,fontWeight:800,fontSize:15,textDecoration:“none”}}>
Ouvrir Claude.ai →
</a>
</div>
</div>
);
}

// ════════════════════════════════════════════════════════════════════════════════
// NAV + APP
// ════════════════════════════════════════════════════════════════════════════════
const NAV = [
{id:“dashboard”,   icon:“⬡”, label:“Accueil”},
{id:“expenses”,    icon:“↓”, label:“Depenses”},
{id:“charges”,     icon:“⏱”,label:“Charges”},
{id:“investments”, icon:“◈”, label:“Placements”},
{id:“debts”,       icon:“⚠”, label:“Dettes”},
];

const NAV2 = [
{id:“bilan”,    icon:“📊”, label:“Bilan”},
{id:“conseils”, icon:“✦”,  label:“Conseils”},
];

export default function App() {
const [active, setActive] = useState(“dashboard”);
const [data, setDataRaw]  = useState(()=>load()||DEFAULT);

const setData = (upd) => {
setDataRaw(prev=>{
const next = typeof upd===“function”?upd(prev):upd;
save(next);
return next;
});
};

const allNav = […NAV, …NAV2];

const pages = {
dashboard:   <Dashboard   data={data} setData={setData}/>,
expenses:    <Expenses    data={data} setData={setData}/>,
charges:     <Charges     data={data} setData={setData}/>,
investments: <Investments data={data} setData={setData}/>,
debts:       <Debts       data={data} setData={setData}/>,
bilan:       <Bilan       data={data} setData={setData}/>,
conseils:    <Conseils    data={data}/>,
};

return (
<div style={{display:“flex”,flexDirection:“column”,height:“100dvh”,background:”#07070d”,overflow:“hidden”,fontFamily:”‘Syne’,sans-serif”}}>
{/* Header */}
<div className=“safe-top” style={{background:“rgba(7,7,13,0.97)”,borderBottom:“1px solid rgba(255,255,255,0.06)”,padding:“12px 20px 10px”,display:“flex”,justifyContent:“space-between”,alignItems:“center”,flexShrink:0}}>
<div style={{fontWeight:800,fontSize:20,color:”#fff”}}><span style={{color:”#00e5a0”}}>Fin</span>Pilot</div>
<div style={{fontSize:11,color:”#00e5a0”,background:“rgba(0,229,160,0.1)”,border:“1px solid rgba(0,229,160,0.2)”,borderRadius:20,padding:“3px 10px”,fontFamily:“DM Mono,monospace”}}>● EN DIRECT</div>
</div>

```
  {/* Content */}
  <div style={{flex:1,overflowY:"auto",padding:"16px 16px 0",display:"flex",flexDirection:"column"}}>
    <div className="fade-in" key={active} style={{flex:1}}>{pages[active]}</div>
  </div>

  {/* Bottom Nav - ligne 1 */}
  <div style={{background:"rgba(7,7,13,0.97)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",flexShrink:0}}>
    {NAV.map(item=>(
      <button key={item.id} onClick={()=>setActive(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 0 6px",border:"none",background:"transparent",cursor:"pointer",color:active===item.id?"#00e5a0":"#444"}}>
        <span style={{fontSize:16,marginBottom:2}}>{item.icon}</span>
        <span style={{fontSize:9,fontFamily:"DM Mono,monospace"}}>{item.label}</span>
        {active===item.id&&<div style={{width:3,height:3,borderRadius:"50%",background:"#00e5a0",marginTop:2}}/>}
      </button>
    ))}
  </div>
  {/* Bottom Nav - ligne 2 */}
  <div className="safe-bottom" style={{background:"rgba(7,7,13,0.97)",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",flexShrink:0}}>
    {NAV2.map(item=>(
      <button key={item.id} onClick={()=>setActive(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 0 6px",border:"none",background:"transparent",cursor:"pointer",color:active===item.id?"#00e5a0":"#444"}}>
        <span style={{fontSize:16,marginBottom:2}}>{item.icon}</span>
        <span style={{fontSize:9,fontFamily:"DM Mono,monospace"}}>{item.label}</span>
        {active===item.id&&<div style={{width:3,height:3,borderRadius:"50%",background:"#00e5a0",marginTop:2}}/>}
      </button>
    ))}
  </div>
</div>
```

);
}
