import { useState, useRef } from "react";
import Head from "next/head";

const G = "#8B1A1A";
const GL = "#FFF0F0";

const KNOWN_CITIES = [
  { city: "New Delhi", state: "Delhi", multiplier: 1.0 },
  { city: "Delhi", state: "Delhi", multiplier: 1.0 },
  { city: "Gurugram", state: "Haryana", multiplier: 1.0 },
  { city: "Noida", state: "Uttar Pradesh", multiplier: 1.0 },
  { city: "Mumbai", state: "Maharashtra", multiplier: 1.15 },
  { city: "Bengaluru", state: "Karnataka", multiplier: 1.05 },
  { city: "Bangalore", state: "Karnataka", multiplier: 1.05 },
  { city: "Chennai", state: "Tamil Nadu", multiplier: 1.0 },
  { city: "Hyderabad", state: "Telangana", multiplier: 1.0 },
  { city: "Kolkata", state: "West Bengal", multiplier: 1.0 },
  { city: "Kochi", state: "Kerala", multiplier: 0.95 },
  { city: "Chandigarh", state: "Chandigarh", multiplier: 0.95 },
  { city: "Jaipur", state: "Rajasthan", multiplier: 0.95 },
  { city: "Ghaziabad", state: "Uttar Pradesh", multiplier: 0.95 },
  { city: "Thiruvananthapuram", state: "Kerala", multiplier: 0.95 },
  { city: "Panaji", state: "Goa", multiplier: 0.95 },
  { city: "Leh", state: "Ladakh", multiplier: 0.95 },
  { city: "Kavaratti", state: "Lakshadweep", multiplier: 0.95 },
  { city: "Sri Vijaya Puram", state: "Andaman & Nicobar Islands", multiplier: 0.95 },
  { city: "Port Blair", state: "Andaman & Nicobar Islands", multiplier: 0.95 },
  { city: "Lucknow", state: "Uttar Pradesh", multiplier: 0.92 },
  { city: "Dehradun", state: "Uttarakhand", multiplier: 0.92 },
  { city: "Amaravati", state: "Andhra Pradesh", multiplier: 0.92 },
  { city: "Gandhinagar", state: "Gujarat", multiplier: 0.92 },
  { city: "Ahmedabad", state: "Gujarat", multiplier: 0.92 },
  { city: "Shimla", state: "Himachal Pradesh", multiplier: 0.92 },
  { city: "Nashik", state: "Maharashtra", multiplier: 0.92 },
  { city: "Pune", state: "Maharashtra", multiplier: 0.92 },
  { city: "Srinagar", state: "Jammu & Kashmir", multiplier: 0.92 },
  { city: "Jammu", state: "Jammu & Kashmir", multiplier: 0.92 },
  { city: "Puducherry", state: "Puducherry", multiplier: 0.92 },
  { city: "Patna", state: "Bihar", multiplier: 0.9 },
  { city: "Raipur", state: "Chhattisgarh", multiplier: 0.9 },
  { city: "Ranchi", state: "Jharkhand", multiplier: 0.9 },
  { city: "Bhubaneswar", state: "Odisha", multiplier: 0.9 },
  { city: "Bhopal", state: "Madhya Pradesh", multiplier: 0.9 },
  { city: "Indore", state: "Madhya Pradesh", multiplier: 0.9 },
  { city: "Meerut", state: "Uttar Pradesh", multiplier: 0.9 },
  { city: "Agra", state: "Uttar Pradesh", multiplier: 0.9 },
  { city: "Varanasi", state: "Uttar Pradesh", multiplier: 0.9 },
  { city: "Daman", state: "Dadra & Nagar Haveli and Daman & Diu", multiplier: 0.9 },
  { city: "Dispur", state: "Assam", multiplier: 0.9 },
  { city: "Guwahati", state: "Assam", multiplier: 0.9 },
  { city: "Itanagar", state: "Arunachal Pradesh", multiplier: 0.88 },
  { city: "Imphal", state: "Manipur", multiplier: 0.88 },
  { city: "Shillong", state: "Meghalaya", multiplier: 0.88 },
  { city: "Aizawl", state: "Mizoram", multiplier: 0.88 },
  { city: "Kohima", state: "Nagaland", multiplier: 0.88 },
  { city: "Gangtok", state: "Sikkim", multiplier: 0.88 },
  { city: "Agartala", state: "Tripura", multiplier: 0.88 },
];

const STATE_FALLBACK = {
  "Andhra Pradesh": { capital: "Amaravati", multiplier: 0.92 },
  "Arunachal Pradesh": { capital: "Itanagar", multiplier: 0.88 },
  "Assam": { capital: "Guwahati", multiplier: 0.9 },
  "Bihar": { capital: "Patna", multiplier: 0.9 },
  "Chhattisgarh": { capital: "Raipur", multiplier: 0.9 },
  "Goa": { capital: "Panaji", multiplier: 0.95 },
  "Gujarat": { capital: "Gandhinagar", multiplier: 0.92 },
  "Haryana": { capital: "Chandigarh", multiplier: 0.95 },
  "Himachal Pradesh": { capital: "Shimla", multiplier: 0.92 },
  "Jharkhand": { capital: "Ranchi", multiplier: 0.9 },
  "Karnataka": { capital: "Bengaluru", multiplier: 1.05 },
  "Kerala": { capital: "Thiruvananthapuram", multiplier: 0.95 },
  "Madhya Pradesh": { capital: "Bhopal", multiplier: 0.9 },
  "Maharashtra": { capital: "Mumbai", multiplier: 1.15 },
  "Manipur": { capital: "Imphal", multiplier: 0.88 },
  "Meghalaya": { capital: "Shillong", multiplier: 0.88 },
  "Mizoram": { capital: "Aizawl", multiplier: 0.88 },
  "Nagaland": { capital: "Kohima", multiplier: 0.88 },
  "Odisha": { capital: "Bhubaneswar", multiplier: 0.9 },
  "Punjab": { capital: "Chandigarh", multiplier: 0.95 },
  "Rajasthan": { capital: "Jaipur", multiplier: 0.95 },
  "Sikkim": { capital: "Gangtok", multiplier: 0.88 },
  "Tamil Nadu": { capital: "Chennai", multiplier: 1.0 },
  "Telangana": { capital: "Hyderabad", multiplier: 1.0 },
  "Tripura": { capital: "Agartala", multiplier: 0.88 },
  "Uttar Pradesh": { capital: "Lucknow", multiplier: 0.92 },
  "Uttarakhand": { capital: "Dehradun", multiplier: 0.92 },
  "West Bengal": { capital: "Kolkata", multiplier: 1.0 },
  "Andaman & Nicobar Islands": { capital: "Sri Vijaya Puram", multiplier: 0.95 },
  "Chandigarh": { capital: "Chandigarh", multiplier: 0.95 },
  "Dadra & Nagar Haveli and Daman & Diu": { capital: "Daman", multiplier: 0.9 },
  "Delhi": { capital: "New Delhi", multiplier: 1.0 },
  "Jammu & Kashmir": { capital: "Srinagar", multiplier: 0.92 },
  "Ladakh": { capital: "Leh", multiplier: 0.95 },
  "Lakshadweep": { capital: "Kavaratti", multiplier: 0.95 },
  "Puducherry": { capital: "Puducherry", multiplier: 0.92 },
};

const ALL_STATES = Object.keys(STATE_FALLBACK).sort();

function resolveMultiplier(cityInput, stateInput) {
  const c = (cityInput || "").trim().toLowerCase();
  const exact = KNOWN_CITIES.find(x => x.city.toLowerCase() === c && x.state === stateInput);
  if (exact) return { multiplier: exact.multiplier };
  const anyCity = KNOWN_CITIES.find(x => x.city.toLowerCase() === c);
  if (anyCity) return { multiplier: anyCity.multiplier };
  const fb = STATE_FALLBACK[stateInput];
  if (fb) return { multiplier: Math.max(0.8, fb.multiplier - 0.08) };
  return { multiplier: 0.92 };
}

// PRIMARY: daily/round-the-clock care services
const PRIMARY_GROUPS = [
  { group: "Non-Medical Care", items: [
    { name: "Basic caregiver 10h", rate: 900, desc: "10-hour daily support, companionship & basic personal care" },
    { name: "Basic caregiver 12h", rate: 925, desc: "12-hour daily support" },
    { name: "Basic caregiver 24h", rate: 1175, desc: "Round-the-clock live-in basic care" },
    { name: "Personal caregiver 10h", rate: 1050, desc: "10-hour higher-touch personal care & mobility support" },
    { name: "Personal caregiver 24h", rate: 1325, desc: "Round-the-clock personal care" },
  ]},
  { group: "Nursing Care", items: [
    { name: "Home nurse 10h", rate: 1450, desc: "10-hour trained nurse — medication, vitals, nursing tasks" },
    { name: "Home nurse 12h", rate: 1600, desc: "12-hour trained nurse" },
    { name: "Home nurse 24h", rate: 1800, desc: "Round-the-clock trained nurse" },
    { name: "Critical care nurse 10h", rate: 1850, desc: "10-hour clinical / post-operative support" },
    { name: "Critical care nurse 24h", rate: 2550, desc: "Round-the-clock high-dependency support" },
  ]},
];
const ALL_PRIMARY = PRIMARY_GROUPS.flatMap(g => g.items);

// ADD-ONS: visit-based and therapy services (can combine with primary or standalone)
const ADDON_SERVICES = [
  { name: "Hygiene visit", rate: 800, type: "visits", desc: "2-hour hygiene & personal care visit" },
  { name: "Nurse visit (basic)", rate: 650, type: "visits", desc: "Injection, vitals, dressing, routine nursing" },
  { name: "Nurse visit (advanced)", rate: 1200, type: "visits", desc: "Advanced nursing procedures" },
  { name: "Physiotherapy session", rate: 1100, type: "freq", desc: "Home physiotherapy session (45 mins)" },
  { name: "Dietician consult", rate: 500, type: "freq", desc: "Dietician consultation at home" },
];

const DEPENDENCIES = [
  { label: "Independent / supervision only", surcharge: 0, desc: "Companionship or monitoring only, no physical help needed" },
  { label: "Needs ADL help", surcharge: 150, desc: "Help with bathing, dressing, toileting, feeding or mobility" },
  { label: "Bedridden", surcharge: 300, desc: "Fully bed-bound, needs full handling and care" },
  { label: "Dementia / memory supervision", surcharge: 250, desc: "Needs supervision, redirection, wandering monitoring" },
  { label: "Transfer assistance", surcharge: 150, desc: "Needs help moving between bed, wheelchair or chair" },
  { label: "Diapering / continence care", surcharge: 150, desc: "Regular hygiene and continence management" },
];

const CONDITIONS = [
  { label: "Post-operative recovery", surcharge: 200, desc: "Wound monitoring and recovery support" },
  { label: "Catheter care", surcharge: 200, desc: "Urinary catheter management" },
  { label: "Feeding tube / Ryles tube", surcharge: 300, desc: "Tube feeding support" },
  { label: "Oxygen support", surcharge: 300, desc: "Oxygen concentrator or cylinder support" },
  { label: "Wound dressing", surcharge: 250, desc: "Regular wound or pressure sore dressing" },
  { label: "Injection / infusion support", surcharge: 250, desc: "IV or injection administration" },
  { label: "Palliative / end-of-life", surcharge: 500, desc: "High-dependency palliative care" },
  { label: "Tracheostomy / suctioning", surcharge: 9999, desc: "Requires a custom quote from our team" },
  { label: "Ventilator / ICU-style monitoring", surcharge: 9999, desc: "Requires a custom quote from our team" },
  { label: "Aggressive behavioral dementia", surcharge: 9999, desc: "Requires a custom quote from our team" },
];

const TIMING = [
  { label: "Standard (no extra charge)", multiplier: 1.0 },
  { label: "Night shift only", multiplier: 1.1 },
  { label: "Weekend / holiday", multiplier: 1.1 },
  { label: "Urgent same-day start", multiplier: 1.15 },
  { label: "Remote / travel zone", multiplier: 1.1 },
];

const FREQ_OPTIONS = [
  { label: "Once a week", perMonth: 4, desc: "4 sessions per month" },
  { label: "Once a fortnight", perMonth: 2, desc: "2 sessions per month" },
  { label: "Once a month", perMonth: 1, desc: "1 session per month" },
  { label: "Once a quarter", perMonth: 0.33, desc: "Approx 1 session every 3 months" },
];

const ADDON_PLANS = [
  { id: "coordination", name: "Remote Coordination Plan", price: 2900, period: "year", tag: "For families at a distance", features: ["Round-the-clock emergency coordination helpline", "Emergency ambulance & BLS support (up to twice a year)", "On-call doctor access during medical emergencies (up to twice a year)", "Fortnightly welfare calls from your dedicated Omsorg coordinator", "Comprehensive annual health screening (81-parameter panel) + teleconsultation", "Referrals to our specialist network of doctors & physiotherapists", "Senior group experiences, wellness events & milestone celebrations", "Dedicated care navigation support during hospital stays"], relevant: ["all"] },
  { id: "health", name: "Health Management Plan", price: 1500, period: "month", tag: "Proactive wellness oversight", features: ["Weekly wellness check-in from your coordinator", "Quarterly doctor teleconsultation for personalised guidance", "Half-yearly doctor home visit", "Geriatric care strategy & fall risk evaluation", "Annual comprehensive health screening with doctor review", "Priority matching to vetted caregivers and nurses"], relevant: ["all"] },
  { id: "errands", name: "Errands Support Plan", price: 3200, period: "month", tag: "Practical day-to-day help", features: ["6 dedicated hours each month for in-home assistance", "Appointment travel, bill payments and daily errand support"], relevant: ["all"] },
  { id: "emotional", name: "Emotional Wellbeing Plan", price: 6700, period: "month", tag: "Mental health & companionship", features: ["Weekly companionship visits from a trained support companion", "Weekly wellness calls", "Monthly mental health assessment by a qualified doctor", "Ongoing professional support for emotional health", "Peer community groups for shared experiences and support"], relevant: ["dementia", "palliative"] },
  { id: "caregiver", name: "Caregiver Support Plan", price: 550, period: "month", tag: "For the family carer", features: ["Annual health check-up prioritising the caregiver's own wellbeing", "Quarterly doctor teleconsultation for personal medical advice", "Peer support groups connecting caregivers", "Access to geriatric caregiving education and practical resources"], relevant: ["all"] },
  { id: "diabetes", name: "Diabetes Management Plan", price: 2400, period: "month", tag: "Structured diabetes care", features: ["Daily wellbeing and medication monitoring calls", "Quarterly HbA1c blood testing with teleconsultation review", "Weekly dietician teleconsultations for nutritional guidance", "Diabetes peer support groups and online lifestyle sessions", "Medicine ordering reminders and delivery coordination"], relevant: ["diabetes"] },
  { id: "dementia", name: "Dementia Management Plan", price: 8100, period: "month", tag: "Specialist dementia support", features: ["Weekly monitoring calls managing appointments & wellbeing", "Monthly doctor teleconsultations", "Quarterly psychologist sessions & mental wellbeing evaluations", "Caregiver counselling on managing behavioural challenges", "One complimentary physiotherapy session", "6 hours monthly appointment accompaniment"], relevant: ["dementia"] },
  { id: "ckd", name: "Chronic Kidney Disease Plan", price: 7900, period: "month", tag: "Kidney health management", features: ["Weekly coordinator calls covering CKD education & dialysis logistics", "Monthly doctor & psychologist teleconsultations", "Annual full body screening with specialised renal tests", "One complimentary physiotherapy session", "6 hours monthly dialysis appointment accompaniment", "Medicine ordering reminders and delivery coordination"], relevant: ["catheter", "oxygen"] },
  { id: "stroke", name: "Stroke Recovery Plan", price: 9900, period: "month", tag: "Post-stroke rehabilitation support", features: ["Weekly coordinator calls for post-stroke education & management", "Monthly doctor & psychologist teleconsultations", "One complimentary physiotherapy session", "6 hours monthly appointment accompaniment", "Quarterly dietician session for recovery nutrition", "Regular home safety assessments"], relevant: ["bedridden", "transfer"] },
  { id: "arthritis", name: "Arthritis Management Plan", price: 4600, period: "month", tag: "Joint health & mobility", features: ["Weekly coordinator calls & monthly doctor teleconsultations", "One complimentary physiotherapy session", "Quarterly dietician session for joint-health nutrition", "Monthly pain management advisory support", "Regular home safety assessments"], relevant: ["transfer"] },
  { id: "heart", name: "Heart Disease Management Plan", price: 6300, period: "month", tag: "Cardiac health monitoring", features: ["Weekly coordinator calls & monthly doctor teleconsultations", "One complimentary physiotherapy session", "Quarterly heart-healthy dietician sessions", "Priority access to homecare nursing support", "Regular home safety assessments"], relevant: ["oxygen"] },
  { id: "cancer", name: "Cancer Management Plan", price: 14200, period: "month", tag: "Comprehensive oncology support", features: ["Weekly coordinator calls with medication & appointment management", "Monthly doctor, psychologist & dietician sessions", "One complimentary physiotherapy session", "6 hours monthly treatment appointment accompaniment", "Pharma patient assistance programme guidance", "Monthly pain management advisory support"], relevant: ["palliative"] },
];

function getRelevantPlans(quote) {
  const allLabels = [...(quote.depItems || []), ...(quote.condItems || [])].map(x => x.label.toLowerCase());
  const timing = (quote.timing || "").toLowerCase();
  const scores = {};
  ADDON_PLANS.forEach(p => { scores[p.id] = p.relevant.includes("all") ? 2 : 0; });
  if (allLabels.some(l => l.includes("dementia"))) { scores["dementia"] = 10; scores["emotional"] = 6; }
  if (allLabels.some(l => l.includes("palliative"))) { scores["cancer"] = 10; scores["emotional"] = 7; }
  if (allLabels.some(l => l.includes("catheter"))) scores["ckd"] = 8;
  if (allLabels.some(l => l.includes("oxygen"))) { scores["heart"] = 7; scores["ckd"] = (scores["ckd"] || 0) + 3; }
  if (allLabels.some(l => l.includes("bedridden") || l.includes("transfer"))) { scores["stroke"] = 7; scores["arthritis"] = 5; }
  if (allLabels.some(l => l.includes("feeding"))) { scores["dementia"] = (scores["dementia"] || 0) + 4; scores["stroke"] = (scores["stroke"] || 0) + 3; }
  if (timing.includes("remote")) scores["coordination"] = 12;
  return Object.entries(scores).sort(([, a], [, b]) => b - a).map(([id]) => ADDON_PLANS.find(p => p.id === id)).filter(Boolean);
}

const fmt = (n) => "\u20B9" + Math.round(n).toLocaleString("en-IN");

function calculate({ cityInput, stateInput, primaryService, primaryDays, addonMap, dependencies, conditions, timing }) {
  const tim = TIMING.find(t => t.label === timing);
  if (!tim) return null;
  if (!primaryService && Object.keys(addonMap).length === 0) return null;

  const { multiplier } = resolveMultiplier(cityInput, stateInput);
  const depItems = dependencies.map(d => DEPENDENCIES.find(x => x.label === d)).filter(Boolean);
  const condItems = conditions.map(c => CONDITIONS.find(x => x.label === c)).filter(Boolean);
  const customRequired = [...depItems, ...condItems].some(x => x.surcharge >= 9999);
  const depTotal = depItems.filter(x => x.surcharge < 9999).reduce((s, x) => s + x.surcharge, 0);
  const condTotal = condItems.filter(x => x.surcharge < 9999).reduce((s, x) => s + x.surcharge, 0);

  let primaryLine = null;
  if (primaryService) {
    const svc = ALL_PRIMARY.find(s => s.name === primaryService);
    if (svc) {
      const cityAdjBase = svc.rate * multiplier;
      const dailySub = cityAdjBase + depTotal + condTotal;
      const dailyPayable = dailySub * tim.multiplier;
      primaryLine = {
        name: primaryService, cityAdjBase,
        depItems: depItems.filter(x => x.surcharge < 9999),
        condItems: condItems.filter(x => x.surcharge < 9999),
        timingMultiplier: tim.multiplier, timing,
        dailySub, dailyPayable, days: primaryDays,
        monthly: dailyPayable * primaryDays,
      };
    }
  }

  const addonLines = Object.entries(addonMap).map(([name, cfg]) => {
    const svc = ADDON_SERVICES.find(s => s.name === name);
    if (!svc) return null;
    const cityAdjRate = svc.rate * multiplier;
    const sessions = svc.type === "freq" ? (cfg.freq ? cfg.freq.perMonth : 1) : (cfg.visits || 1);
    const freqLabel = svc.type === "freq"
      ? (cfg.freq ? cfg.freq.label : "Once a month")
      : (sessions + " visit" + (sessions !== 1 ? "s" : "") + "/month");
    return { name, cityAdjRate, sessions, freqLabel, monthly: cityAdjRate * sessions };
  }).filter(Boolean);

  const primaryMonthly = primaryLine ? primaryLine.monthly : 0;
  const addonMonthly = addonLines.reduce((s, a) => s + a.monthly, 0);
  const monthlyNet = primaryMonthly + addonMonthly;
  const gst = monthlyNet * 0.18;
  const monthlyTotal = monthlyNet + gst;

  return {
    cityInput, stateInput, multiplier,
    primaryLine, addonLines,
    depItems: depItems.filter(x => x.surcharge < 9999),
    condItems: condItems.filter(x => x.surcharge < 9999),
    customRequired, timing,
    monthlyNet, gst, monthlyTotal,
  };
}

const STEPS = ["Your details", "Service", "Care needs", "Conditions & timing", "Your quote"];

function Progress({ step }) {
  return (
    <div style={{ padding: "16px 24px 0" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i < step ? G : "#e5e7eb", transition: "background 0.3s" }} />)}
      </div>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>Step {step} of {STEPS.length} — {STEPS[step - 1]}</div>
    </div>
  );
}

function Lbl({ children, required }) {
  return <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{children}{required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}</div>;
}
function FInput(props) {
  return <input {...props} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#111827", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", ...props.style }} />;
}
function FSelect({ value, onChange, children }) {
  return <select value={value} onChange={onChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: value ? "#111827" : "#9ca3af", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}>{children}</select>;
}
function Err({ msg }) { return msg ? <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{msg}</div> : null; }

function CheckCard({ label, desc, checked, onChange }) {
  return (
    <div onClick={onChange} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: checked ? "2px solid " + G : "1px solid #e5e7eb", background: checked ? GL : "#fff", cursor: "pointer", marginBottom: "8px" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: checked ? "none" : "2px solid #d1d5db", background: checked ? G : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
        {checked && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <div><div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</div>{desc && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{desc}</div>}</div>
    </div>
  );
}

function RadioCard({ label, desc, checked, onChange }) {
  return (
    <div onClick={onChange} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: checked ? "2px solid " + G : "1px solid #e5e7eb", background: checked ? GL : "#fff", cursor: "pointer", marginBottom: "8px" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: checked ? "none" : "2px solid #d1d5db", background: checked ? G : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
        {checked && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
      </div>
      <div><div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</div>{desc && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{desc}</div>}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, secondary }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding: "11px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", border: secondary ? "1px solid #e5e7eb" : "none", background: disabled ? "#f3f4f6" : secondary ? "#fff" : G, color: disabled ? "#9ca3af" : secondary ? "#374151" : "#fff" }}>{children}</button>;
}

function QuoteCard({ quote, contact }) {
  if (!quote) return null;
  const pl = quote.primaryLine;
  return (
    <div id="print-area">
      <div style={{ background: G, padding: "16px 20px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ color: "#F5C0C0", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>
            {quote.customRequired ? "Custom Quote Required" : "Care estimate · " + quote.cityInput + ", " + quote.stateInput}
          </div>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{pl ? pl.name : (quote.addonLines[0]?.name || "Care package")}</div>
          <div style={{ color: "#F5C0C0", fontSize: "12px", marginTop: "2px" }}>{contact.name} · {contact.phone}</div>
        </div>
        {!quote.customRequired && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#F5C0C0", fontSize: "11px" }}>per month</div>
            <div style={{ color: "#fff", fontSize: "26px", fontWeight: 700 }}>{fmt(quote.monthlyTotal)}</div>
            <div style={{ color: "#F5C0C0", fontSize: "11px" }}>incl. GST</div>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 20px", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 10px 10px", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <tbody>
            {pl && (
              <>
                {pl.depItems.map((d, i) => (
                  <tr key={"d" + i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "7px 0", color: "#6b7280" }}>{d.label}</td>
                    <td style={{ padding: "7px 0", textAlign: "right", color: G }}>+{fmt(d.surcharge)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
                  </tr>
                ))}
                {pl.condItems.map((c, i) => (
                  <tr key={"c" + i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "7px 0", color: "#6b7280" }}>{c.label}</td>
                    <td style={{ padding: "7px 0", textAlign: "right", color: G }}>+{fmt(c.surcharge)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
                  </tr>
                ))}
                {pl.timingMultiplier !== 1.0 && (
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "7px 0", color: "#6b7280" }}>{pl.timing}</td>
                    <td style={{ padding: "7px 0", textAlign: "right", color: G }}>+{fmt(pl.dailyPayable - pl.dailySub)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
                  </tr>
                )}
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 0", fontWeight: 600 }}>{pl.name} <span style={{ fontWeight: 400, color: "#6b7280" }}>× {pl.days} days</span></td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 600 }}>{fmt(pl.monthly)}</td>
                </tr>
              </>
            )}
            {quote.addonLines.map((a, i) => (
              <tr key={"a" + i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "7px 0", color: "#6b7280" }}>{a.name} <span style={{ fontSize: "11px" }}>({a.freqLabel})</span></td>
                <td style={{ padding: "7px 0", textAlign: "right" }}>{fmt(a.monthly)}</td>
              </tr>
            ))}
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "8px 0", color: "#6b7280" }}>Monthly subtotal</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote.monthlyNet)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "7px 0", color: "#6b7280" }}>GST (18%)</td>
              <td style={{ padding: "7px 0", textAlign: "right" }}>{fmt(quote.gst)}</td>
            </tr>
            {!quote.customRequired && (
              <tr>
                <td style={{ padding: "11px 0 4px", fontWeight: 700, fontSize: "14px" }}>Monthly total</td>
                <td style={{ padding: "11px 0 4px", textAlign: "right", fontWeight: 700, fontSize: "17px", color: G }}>{fmt(quote.monthlyTotal)}</td>
              </tr>
            )}
          </tbody>
        </table>
        {quote.customRequired && (
          <div style={{ marginTop: "12px", padding: "12px", background: "#FAEEDA", borderRadius: "8px", fontSize: "13px", color: "#633806", lineHeight: "1.6" }}>
            One or more conditions require a personalised assessment. Our team will call you within 24 hours.
          </div>
        )}
        <div style={{ marginTop: "10px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>
          This is an indicative estimate. Final pricing confirmed after a care assessment. GST at 18% included.
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  const waText = encodeURIComponent("Hi, I saw the " + plan.name + " on your quote tool. Can you tell me more?");
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
      <div style={{ background: G, padding: "12px 16px" }}>
        <div style={{ color: "#F5C0C0", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{plan.tag}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{plan.name}</div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
            <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>{fmt(plan.price)}</div>
            <div style={{ color: "#F5C0C0", fontSize: "11px" }}>/{plan.period}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
          {plan.features.map((f, i) => <li key={i} style={{ fontSize: "12px", color: "#374151", marginBottom: "4px", lineHeight: "1.5" }}>{f}</li>)}
        </ul>
        <a href={"https://wa.me/918448381360?text=" + waText} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: "12px", padding: "8px 14px", background: "#25D366", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 600, textAlign: "center", textDecoration: "none" }}>Enquire on WhatsApp</a>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [notes, setNotes] = useState("");
  const [primaryService, setPrimaryService] = useState("");
  const [primaryDays, setPrimaryDays] = useState(30);
  const [addonMap, setAddonMap] = useState({}); // { "Physiotherapy session": { freq: FREQ_OPTIONS[2] }, "Nurse visit (basic)": { visits: 2 } }
  const [dependencies, setDependencies] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [timing, setTiming] = useState("Standard (no extra charge)");
  const [quote, setQuote] = useState(null);
  const [leadSent, setLeadSent] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [errors, setErrors] = useState({});
  const topRef = useRef(null);

  const scrollTop = () => setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const toggleAddon = (svc) => {
    setAddonMap(prev => {
      if (prev[svc.name]) {
        const { [svc.name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [svc.name]: svc.type === "freq" ? { freq: FREQ_OPTIONS[2] } : { visits: 2 } };
    });
  };

  const updateAddonFreq = (name, freq) => setAddonMap(prev => ({ ...prev, [name]: { freq } }));
  const updateAddonVisits = (name, visits) => setAddonMap(prev => ({ ...prev, [name]: { visits } }));

  const sendLead = async (fullQuote) => {
    if (leadSent) return;
    try {
      await fetch("https://formspree.io/f/mwvarqrb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: contact.name, phone: contact.phone, email: contact.email,
          state: stateInput, city: cityInput,
          primary_service: primaryService || "None",
          primary_days: primaryService ? primaryDays : "N/A",
          addon_services: Object.keys(addonMap).join(", ") || "None",
          dependencies: dependencies.join(", ") || "None",
          conditions: conditions.join(", ") || "None",
          timing, notes: notes || "None",
          monthly_total: fullQuote ? fmt(fullQuote.monthlyTotal) : "Not yet calculated",
          custom_quote: fullQuote?.customRequired ? "YES" : "No",
        }),
      });
      setLeadSent(true);
    } catch (e) {}
  };

  const toggleDep = (l) => setDependencies(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleCond = (l) => setConditions(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);

  const validate1 = () => {
    const e = {};
    if (!contact.name.trim()) e.name = "Please enter your name";
    if (contact.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a valid 10-digit mobile number";
    if (!contact.email.includes("@")) e.email = "Please enter a valid email address";
    if (!stateInput) e.state = "Please select your state";
    if (!cityInput.trim()) e.city = "Please enter your city or town";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!primaryService && Object.keys(addonMap).length === 0) e.service = "Please select at least one service";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1) { if (!validate1()) return; sendLead(null); setErrors({}); setStep(2); }
    else if (step === 2) { if (!validate2()) return; setErrors({}); setStep(3); }
    else if (step === 3) { setStep(4); }
    else if (step === 4) {
      const q = calculate({ cityInput, stateInput, primaryService, primaryDays, addonMap, dependencies, conditions, timing });
      setQuote(q); sendLead(q); setStep(5);
    }
    scrollTop();
  };

  const goBack = () => { setStep(s => s - 1); scrollTop(); };

  const restart = () => {
    setStep(1); setContact({ name: "", phone: "", email: "" }); setStateInput(""); setCityInput(""); setNotes("");
    setPrimaryService(""); setPrimaryDays(30); setAddonMap({});
    setDependencies([]); setConditions([]); setTiming("Standard (no extra charge)");
    setQuote(null); setLeadSent(false); setShowAllPlans(false); setErrors({});
    scrollTop();
  };

  return (
    <>
      <Head>
        <title>Omsorg — Home Care Quote</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; padding: 16px 16px 48px; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${G}; border-color: ${G}; }
        @media print { body { background: white; padding: 0; display: block; } #no-print { display: none !important; } }
      `}</style>

      <div ref={topRef} style={{ width: "100%", maxWidth: "540px" }}>
        <div id="no-print" style={{ marginBottom: "14px", paddingTop: "8px" }}>
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADhASwDASIAAhEBAxEB/8QAHAAAAgMBAQEBAAAAAAAAAAAABQYDBAcCAQj/xABLEAABAwMCBAQDBAcGBAUFAAABAgMEAAUREiExBhNBUWEicYGRFKEHIzJCscHRFVJicuHwJDM0gpLxFkNTY6KyNiVEhLPC0v/EABoBAAMBAQEBAAAAAAAAAAAAAAIDBAEFAAb/xAArEQADAAICAgEEAgIDAQAAAAAAAQIDERIhMQRBE1EiYSMyQnEFM4GR/9oADAMBAAIRAxEAPwD5looor0zxwooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooA//Z" alt="Omsorg" style={{ height: "70px", display: "block" }} />
          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Get an instant home care estimate</div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {step < 5 && <Progress step={step} />}
          <div style={{ padding: "20px 24px 28px" }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Your details</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>We will send your quote by email. Your details are kept private.</div>
                <div style={{ marginBottom: "14px" }}>
                  <Lbl required>Your name</Lbl>
                  <FInput placeholder="Full name" value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} />
                  <Err msg={errors.name} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <Lbl required>Mobile number</Lbl>
                  <FInput placeholder="10-digit mobile number" type="tel" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} />
                  <Err msg={errors.phone} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Lbl required>Email address</Lbl>
                  <FInput placeholder="your@email.com" type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} />
                  <Err msg={errors.email} />
                </div>
                <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0 18px" }} />
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "14px" }}>Where is care needed?</div>
                <div style={{ marginBottom: "14px" }}>
                  <Lbl required>State / Union Territory</Lbl>
                  <FSelect value={stateInput} onChange={e => setStateInput(e.target.value)}>
                    <option value="">Select state...</option>
                    {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </FSelect>
                  <Err msg={errors.state} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Lbl required>City / Town</Lbl>
                  <FInput placeholder="Type your city or town name" value={cityInput} onChange={e => setCityInput(e.target.value)} />
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Enter any city or town — even smaller places are welcome</div>
                  <Err msg={errors.city} />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <Lbl>Anything else? <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional — any language)</span></Lbl>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Hindi, Hinglish, Tamil — koi bhi bhasha chalegi..." rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#111827", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }} />
                </div>
                <Btn onClick={goNext}>Continue →</Btn>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Type of care</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Select your main care support, then add any extra services below.</div>
                <Err msg={errors.service} />

                <div style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Main care support <span style={{ fontWeight: 400, color: "#c0c0c0" }}>(optional if only visit-based care needed)</span></div>
                {PRIMARY_GROUPS.map(g => (
                  <div key={g.group} style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#c0c0c0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{g.group}</div>
                    {g.items.map(s => <RadioCard key={s.name} label={s.name} desc={s.desc} checked={primaryService === s.name} onChange={() => setPrimaryService(prev => prev === s.name ? "" : s.name)} />)}
                  </div>
                ))}

                {primaryService && (
                  <div style={{ marginBottom: "20px" }}>
                    <Lbl>Days of care per month</Lbl>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "8px" }}>
                      <input type="range" min={1} max={31} step={1} value={primaryDays} onChange={e => setPrimaryDays(Number(e.target.value))} style={{ flex: 1, accentColor: G }} />
                      <div style={{ fontSize: "22px", fontWeight: 700, color: G, minWidth: "36px", textAlign: "right" }}>{primaryDays}</div>
                    </div>
                  </div>
                )}

                <div style={{ height: "1px", background: "#f3f4f6", margin: "8px 0 16px" }} />
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Additional services <span style={{ fontWeight: 400, color: "#c0c0c0" }}>(tick all that apply)</span></div>

                {ADDON_SERVICES.map(svc => {
                  const isChecked = !!addonMap[svc.name];
                  const cfg = addonMap[svc.name];
                  return (
                    <div key={svc.name}>
                      <CheckCard label={svc.name} desc={svc.desc} checked={isChecked} onChange={() => toggleAddon(svc)} />
                      {isChecked && svc.type === "freq" && (
                        <div style={{ marginLeft: "28px", marginBottom: "8px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>How often?</div>
                          {FREQ_OPTIONS.map(f => <RadioCard key={f.label} label={f.label} desc={f.desc} checked={cfg?.freq?.label === f.label} onChange={() => updateAddonFreq(svc.name, f)} />)}
                        </div>
                      )}
                      {isChecked && svc.type === "visits" && (
                        <div style={{ marginLeft: "28px", marginBottom: "8px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>Visits per month: <strong>{cfg?.visits || 2}</strong></div>
                          <input type="range" min={1} max={12} step={1} value={cfg?.visits || 2} onChange={e => updateAddonVisits(svc.name, Number(e.target.value))} style={{ width: "100%", accentColor: G }} />
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <Btn secondary onClick={goBack}>← Back</Btn>
                  <Btn onClick={goNext}>Continue →</Btn>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Care needs</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Select all that apply — you can choose more than one.</div>
                {DEPENDENCIES.map(d => <CheckCard key={d.label} label={d.label} desc={d.desc} checked={dependencies.includes(d.label)} onChange={() => toggleDep(d.label)} />)}
                <div style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 24px" }}>If none apply, just continue.</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Btn secondary onClick={goBack}>← Back</Btn>
                  <Btn onClick={goNext}>Continue →</Btn>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Medical conditions</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Does your loved one have any of the following? Select all that apply.</div>
                {CONDITIONS.map(c => <CheckCard key={c.label} label={c.label} desc={c.desc} checked={conditions.includes(c.label)} onChange={() => toggleCond(c.label)} />)}
                <div style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 20px" }}>If none apply, just continue.</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>Any special circumstances?</div>
                {TIMING.map(t => <RadioCard key={t.label} label={t.label} desc={t.multiplier === 1.0 ? "Applies to all regular cases including 24-hour care" : t.multiplier === 1.15 ? "+15% — deployment within the same day" : "+10% premium applies"} checked={timing === t.label} onChange={() => setTiming(t.label)} />)}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <Btn secondary onClick={goBack}>← Back</Btn>
                  <Btn onClick={goNext}>Show my quote →</Btn>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && quote && (
              <div>
                <QuoteCard quote={quote} contact={contact} />
                <div id="no-print" style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <button onClick={() => window.print()} style={{ flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Print / Save PDF</button>
                    <a href={"https://wa.me/918448381360?text=" + encodeURIComponent("Hi, I just got a care quote from Omsorg. Can you help me?")} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "#25D366", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#fff", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>WhatsApp us</a>
                  </div>
                  <button onClick={restart} style={{ fontSize: "12px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>← Start a new quote</button>
                </div>

                <div id="no-print" style={{ marginTop: "28px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>You may also be interested in</div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Omsorg wellness and management plans — designed to complement your care package</div>
                  {getRelevantPlans(quote).slice(0, showAllPlans ? 12 : 3).map(plan => <PlanCard key={plan.id} plan={plan} />)}
                  {!showAllPlans && (
                    <button onClick={() => setShowAllPlans(true)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151", marginTop: "4px" }}>
                      View all plans ({ADDON_PLANS.length} available) ↓
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
        <div id="no-print" style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "12px" }}>
          Omsorg Elder Care · omsorg.co.in · +91 84483 81360
        </div>
      </div>
    </>
  );
}
