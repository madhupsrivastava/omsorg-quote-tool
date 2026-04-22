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
  if (exact) return { multiplier: exact.multiplier, fallback: false, note: null };
  const anyCity = KNOWN_CITIES.find(x => x.city.toLowerCase() === c);
  if (anyCity) return { multiplier: anyCity.multiplier, fallback: false, note: null };
  const fb = STATE_FALLBACK[stateInput];
  if (fb) return { multiplier: Math.max(0.8, fb.multiplier - 0.08), fallback: true, note: null };
  return { multiplier: 0.92, fallback: true, note: null };
}

const SERVICE_GROUPS = [
  { group: "Non-Medical Care", items: [
    { name: "Basic caregiver 10h", rate: 900, unit: "per day", desc: "10-hour daily support, companionship & basic personal care" },
    { name: "Basic caregiver 12h", rate: 925, unit: "per day", desc: "12-hour daily support" },
    { name: "Basic caregiver 24h", rate: 1175, unit: "per day", desc: "Round-the-clock live-in basic care" },
    { name: "Personal caregiver 10h", rate: 1050, unit: "per day", desc: "10-hour higher-touch personal care & mobility support" },
    { name: "Personal caregiver 24h", rate: 1325, unit: "per day", desc: "Round-the-clock personal care" },
  ]},
  { group: "Nursing Care", items: [
    { name: "Home nurse 10h", rate: 1450, unit: "per day", desc: "10-hour trained nurse — medication, vitals, nursing tasks" },
    { name: "Home nurse 12h", rate: 1600, unit: "per day", desc: "12-hour trained nurse" },
    { name: "Home nurse 24h", rate: 1800, unit: "per day", desc: "Round-the-clock trained nurse" },
    { name: "Critical care nurse 10h", rate: 1850, unit: "per day", desc: "10-hour clinical / post-operative support" },
    { name: "Critical care nurse 24h", rate: 2550, unit: "per day", desc: "Round-the-clock high-dependency support" },
  ]},
  { group: "Visit-based", items: [
    { name: "Hygiene visit", rate: 800, unit: "per visit", desc: "2-hour hygiene & personal care visit" },
    { name: "Nurse visit basic", rate: 650, unit: "per visit", desc: "Injection, vitals, dressing, routine nursing" },
    { name: "Nurse visit advanced", rate: 1200, unit: "per visit", desc: "Advanced nursing visit" },
  ]},
  { group: "Allied Health", items: [
    { name: "Physiotherapy session", rate: 700, unit: "per session", desc: "Home physiotherapy session" },
    { name: "Dietician consult", rate: 500, unit: "per visit", desc: "Dietician consultation at home" },
  ]},
];

const ALL_SERVICES = SERVICE_GROUPS.flatMap(g => g.items);

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
  {
    id: "coordination", name: "Remote Coordination Plan", price: 2900, period: "year",
    tag: "For families at a distance",
    features: ["Round-the-clock emergency coordination helpline", "Emergency ambulance & BLS support (up to twice a year)", "On-call doctor access during medical emergencies (up to twice a year)", "Fortnightly welfare calls from your dedicated Omsorg coordinator", "Comprehensive annual health screening (81-parameter panel) + teleconsultation", "Referrals to our specialist network of doctors & physiotherapists", "Senior group experiences, wellness events & milestone celebrations", "Dedicated care navigation support during hospital stays"],
    relevant: ["all"],
  },
  {
    id: "health", name: "Health Management Plan", price: 1500, period: "month",
    tag: "Proactive wellness oversight",
    features: ["Weekly wellness check-in from your coordinator", "Quarterly doctor teleconsultation for personalised guidance", "Half-yearly doctor home visit", "Geriatric care strategy & fall risk evaluation", "Annual comprehensive health screening with doctor review", "Priority matching to vetted caregivers and nurses"],
    relevant: ["all"],
  },
  {
    id: "errands", name: "Errands Support Plan", price: 3200, period: "month",
    tag: "Practical day-to-day help",
    features: ["6 dedicated hours each month for in-home assistance", "Appointment travel, bill payments and daily errand support"],
    relevant: ["all"],
  },
  {
    id: "emotional", name: "Emotional Wellbeing Plan", price: 6700, period: "month",
    tag: "Mental health & companionship",
    features: ["Weekly companionship visits from a trained support companion", "Weekly wellness calls", "Monthly mental health assessment by a qualified doctor", "Ongoing professional support for emotional health", "Peer community groups for shared experiences and support"],
    relevant: ["dementia", "palliative"],
  },
  {
    id: "caregiver", name: "Caregiver Support Plan", price: 550, period: "month",
    tag: "For the family carer",
    features: ["Annual health check-up prioritising the caregiver's own wellbeing", "Quarterly doctor teleconsultation for personal medical advice", "Peer support groups connecting caregivers", "Access to geriatric caregiving education and practical resources"],
    relevant: ["all"],
  },
  {
    id: "diabetes", name: "Diabetes Management Plan", price: 2400, period: "month",
    tag: "Structured diabetes care",
    features: ["Daily wellbeing and medication monitoring calls", "Quarterly HbA1c blood testing with teleconsultation review", "Weekly dietician teleconsultations for nutritional guidance", "Diabetes peer support groups and online lifestyle sessions", "Medicine ordering reminders and delivery coordination"],
    relevant: ["diabetes"],
  },
  {
    id: "dementia", name: "Dementia Management Plan", price: 8100, period: "month",
    tag: "Specialist dementia support",
    features: ["Weekly monitoring calls managing appointments & wellbeing", "Monthly doctor teleconsultations", "Quarterly psychologist sessions & mental wellbeing evaluations", "Caregiver counselling on managing behavioural challenges", "One complimentary physiotherapy session", "6 hours monthly appointment accompaniment"],
    relevant: ["dementia"],
  },
  {
    id: "ckd", name: "Chronic Kidney Disease Plan", price: 7900, period: "month",
    tag: "Kidney health management",
    features: ["Weekly coordinator calls covering CKD education & dialysis logistics", "Monthly doctor & psychologist teleconsultations", "Annual full body screening with specialised renal tests", "One complimentary physiotherapy session", "6 hours monthly dialysis appointment accompaniment", "Medicine ordering reminders and delivery coordination"],
    relevant: ["catheter", "oxygen"],
  },
  {
    id: "stroke", name: "Stroke Recovery Plan", price: 9900, period: "month",
    tag: "Post-stroke rehabilitation support",
    features: ["Weekly coordinator calls for post-stroke education & management", "Monthly doctor & psychologist teleconsultations", "One complimentary physiotherapy session", "6 hours monthly appointment accompaniment", "Quarterly dietician session for recovery nutrition", "Regular home safety assessments"],
    relevant: ["bedridden", "transfer"],
  },
  {
    id: "arthritis", name: "Arthritis Management Plan", price: 4600, period: "month",
    tag: "Joint health & mobility",
    features: ["Weekly coordinator calls & monthly doctor teleconsultations", "One complimentary physiotherapy session", "Quarterly dietician session for joint-health nutrition", "Monthly pain management advisory support", "Regular home safety assessments"],
    relevant: ["transfer"],
  },
  {
    id: "heart", name: "Heart Disease Management Plan", price: 6300, period: "month",
    tag: "Cardiac health monitoring",
    features: ["Weekly coordinator calls & monthly doctor teleconsultations", "One complimentary physiotherapy session", "Quarterly heart-healthy dietician sessions", "Priority access to homecare nursing support", "Regular home safety assessments"],
    relevant: ["oxygen"],
  },
  {
    id: "cancer", name: "Cancer Management Plan", price: 14200, period: "month",
    tag: "Comprehensive oncology support",
    features: ["Weekly coordinator calls with medication & appointment management", "Monthly doctor, psychologist & dietician sessions", "One complimentary physiotherapy session", "6 hours monthly treatment appointment accompaniment", "Pharma patient assistance programme guidance", "Monthly pain management advisory support"],
    relevant: ["palliative"],
  },
];

function getRelevantPlans(quote) {
  const allLabels = [...(quote.depItems || []), ...(quote.condItems || [])].map(x => x.label.toLowerCase());
  const timing = (quote.timing || "").toLowerCase();
  const scores = {};
  ADDON_PLANS.forEach(p => { scores[p.id] = p.relevant.includes("all") ? 2 : 0; });
  if (allLabels.some(l => l.includes("dementia"))) { scores["dementia"] = 10; scores["emotional"] = 6; }
  if (allLabels.some(l => l.includes("palliative"))) { scores["cancer"] = 10; scores["emotional"] = 7; }
  if (allLabels.some(l => l.includes("catheter") || l.includes("kidney"))) scores["ckd"] = 8;
  if (allLabels.some(l => l.includes("oxygen") || l.includes("heart"))) { scores["heart"] = 7; scores["ckd"] = (scores["ckd"] || 0) + 3; }
  if (allLabels.some(l => l.includes("bedridden") || l.includes("transfer"))) { scores["stroke"] = 7; scores["arthritis"] = 5; }
  if (allLabels.some(l => l.includes("feeding"))) { scores["dementia"] = (scores["dementia"] || 0) + 4; scores["stroke"] = (scores["stroke"] || 0) + 3; }
  if (timing.includes("remote")) scores["coordination"] = 12;
  return Object.entries(scores).sort(([,a],[,b]) => b-a).map(([id]) => ADDON_PLANS.find(p => p.id === id)).filter(Boolean);
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
          {plan.features.slice(0, 4).map((f, i) => <li key={i} style={{ fontSize: "12px", color: "#374151", marginBottom: "4px", lineHeight: "1.5" }}>{f}</li>)}
          {plan.features.length > 4 && <li style={{ fontSize: "12px", color: "#6b7280", listStyle: "none", marginLeft: "-16px" }}>+ {plan.features.length - 4} more benefits</li>}
        </ul>
        <a href={"https://wa.me/918448381360?text=" + waText} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: "12px", padding: "8px 14px", background: "#25D366", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 600, textAlign: "center", textDecoration: "none" }}>Enquire on WhatsApp</a>
      </div>
    </div>
  );
}

const fmt = (n) => "\u20B9" + Math.round(n).toLocaleString("en-IN");

function calculate({ cityInput, stateInput, service, dependencies, conditions, timing, days }) {
  const svc = ALL_SERVICES.find(s => s.name === service);
  const tim = TIMING.find(t => t.label === timing);
  if (!svc || !tim) return null;
  const { multiplier, fallback, note } = resolveMultiplier(cityInput, stateInput);
  const cityAdjBase = svc.rate * multiplier;
  const depItems = dependencies.map(d => DEPENDENCIES.find(x => x.label === d)).filter(Boolean);
  const condItems = conditions.map(c => CONDITIONS.find(x => x.label === c)).filter(Boolean);
  const customRequired = [...depItems, ...condItems].some(x => x.surcharge >= 9999);
  const depTotal = depItems.filter(x => x.surcharge < 9999).reduce((s, x) => s + x.surcharge, 0);
  const condTotal = condItems.filter(x => x.surcharge < 9999).reduce((s, x) => s + x.surcharge, 0);
  const dailySub = cityAdjBase + depTotal + condTotal;
  const dailyPayable = dailySub * tim.multiplier;
  const monthlyNet = dailyPayable * days;
  const gst = monthlyNet * 0.18;
  const monthlyTotal = monthlyNet + gst;
  return {
    cityInput, stateInput, service, rate: svc.rate, unit: svc.unit,
    multiplier, fallback, fallbackNote: note,
    cityAdjBase, depItems: depItems.filter(x => x.surcharge < 9999),
    condItems: condItems.filter(x => x.surcharge < 9999),
    customRequired, timing, timingMultiplier: tim.multiplier,
    dailySub, dailyPayable, days, monthlyNet, gst, monthlyTotal,
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
  const perLabel = quote.unit.replace("per ", "");
  return (
    <div id="print-area">
      <div style={{ background: G, padding: "16px 20px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ color: "#F5C0C0", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>
            {quote.customRequired ? "Custom Quote Required" : "Care estimate · " + quote.cityInput + ", " + quote.stateInput}
          </div>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{quote.service}</div>
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
            {quote.depItems.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>{d.label}</td>
                <td style={{ padding: "8px 0", textAlign: "right", color: G }}>+{fmt(d.surcharge)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
              </tr>
            ))}
            {quote.condItems.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>{c.label}</td>
                <td style={{ padding: "8px 0", textAlign: "right", color: G }}>+{fmt(c.surcharge)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
              </tr>
            ))}
            {quote.timingMultiplier !== 1.0 && (
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>{quote.timing}</td>
                <td style={{ padding: "8px 0", textAlign: "right", color: G }}>+{fmt(quote.dailyPayable - quote.dailySub)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/day</span></td>
              </tr>
            )}
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "9px 0", fontWeight: 700 }}>Daily rate</td>
              <td style={{ padding: "9px 0", textAlign: "right", fontWeight: 700 }}>{fmt(quote.dailyPayable)}<span style={{ color: "#6b7280", fontWeight: 400, marginLeft: "2px" }}>/day</span></td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "8px 0", color: "#6b7280" }}>Monthly subtotal ({quote.days} {perLabel}s)</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote.monthlyNet)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "8px 0", color: "#6b7280" }}>GST (18%)</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote.gst)}</td>
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
            One or more conditions require a personalised assessment. Our team will call you within 24 hours to prepare a detailed quote.
          </div>
        )}
        <div style={{ marginTop: "10px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>
          This is an indicative estimate. Final pricing is confirmed after a care assessment. GST at 18% is included in the monthly total.
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [service, setService] = useState("");
  const [days, setDays] = useState(30);
  const [dependencies, setDependencies] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [timing, setTiming] = useState("Standard (no extra charge)");
  const [quote, setQuote] = useState(null);
  const [freq, setFreq] = useState(FREQ_OPTIONS[2]); // default: once a month
  const [notes, setNotes] = useState("");
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [errors, setErrors] = useState({});
  const topRef = useRef(null);

  const scrollTop = () => setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const isFreqService = service === "Physiotherapy session" || service === "Dietician consult";
  const effectiveDays = isFreqService ? freq.perMonth : days;

  const sendLead = async (fullQuote) => {
    if (leadSent) return;
    try {
      await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: contact.name, phone: contact.phone, email: contact.email,
          state: stateInput, city: cityInput, service,
          frequency: isFreqService ? freq.label : days + " days/month",
          dependencies: dependencies.join(", ") || "None",
          conditions: conditions.join(", ") || "None",
          timing, notes: notes || "None",
          monthly_total: fullQuote ? fmt(fullQuote.monthlyTotal) : "Not yet calculated",
          custom_quote: fullQuote?.customRequired ? "YES" : "No",
          location_note: fullQuote?.fallbackNote || "Exact city rate used",
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!service) e.service = "Please select a type of care";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1) { if (!validate1()) return; sendLead(null); setErrors({}); setStep(2); }
    else if (step === 2) { if (!validate2()) return; setErrors({}); setStep(3); }
    else if (step === 3) { setStep(4); }
    else if (step === 4) {
      const q = calculate({ cityInput, stateInput, service, dependencies, conditions, timing, days: effectiveDays });
      setQuote(q); sendLead(q); setStep(5);
    }
    scrollTop();
  };

  const goBack = () => { setStep(s => s - 1); scrollTop(); };
  const restart = () => {
    setStep(1); setContact({ name: "", phone: "", email: "" }); setStateInput(""); setCityInput("");
    setService(""); setDays(30); setDependencies([]); setConditions([]);
    setTiming("Standard (no extra charge)"); setQuote(null); setLeadSent(false);
    setNotes(""); setFreq(FREQ_OPTIONS[2]); setShowAllPlans(false); setErrors({});
    scrollTop();
  };

  const isVisit = service && ALL_SERVICES.find(s => s.name === service)?.unit !== "per day";

  return (
    <>
      <Head>
        <title>Omsorg — Home Care Quote</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; justify-content: center; padding: 16px 16px 48px; }
        input:focus, select:focus { outline: 2px solid ${G}; border-color: ${G}; }
        @media print { body { background: white; padding: 0; display: block; } #no-print { display: none !important; } }
      `}</style>

      <div ref={topRef} style={{ width: "100%", maxWidth: "540px" }}>
        <div id="no-print" style={{ marginBottom: "14px", paddingTop: "8px" }}>
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEsASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimTyxwQvNM6pGilmZjgKB1JNAD6K+XvGf7SV5a/ESMaBaxXXhmzcxXAI/eXnPzOh7AdvXmvorwh4j0nxXoFtrmi3S3FncLlW7qe6sOxHcVjTrwqNqL2PQxmV4rB04VK0bKX9WfZmvRRRWx54UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUVFdzx21tJcTOEjjQu7E4AAGSa4X4S/FXw78Q4bmOwkFvfW8jB7SRxvKA4Ei+qmpc4ppN6s2hQqThKpGN4x3fa539fL/wC1h8U3lml8A6BclUX/AJCk8bcn0iB/nXtPxv8AGQ8D/Du/1mPBvGHkWakdZW4X8uTXwPNNPcTyXFzK008zmSWRurseSTXBjsQ4Lkjuz6rhXKVXqPFVV7sdvN/8D8xlem/s/fEub4f+JxDezOdAv5FW8j6iFuglA7Y7+teZ0leXCbhJSife4rC08VSlRqq6Z+l1vNFcQJPBIskUihkdTkMD0IqSvB/2P/G02teE7nwtqEu+60cr5BY5LQN90fh/WvYPGHiTSPCegXOt63dLb2luuST1Y9lUdyewr6GnVU4KZ+P4vA1MNiZYdq7TsvPt95sUVg+APFFj4y8J2PiLTgyQXabvLY5aM91PuK3qtNNXRyThKnJxkrNBRRRTJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA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2mWN/ZOHmugI1DJyOp+tY0HL6xztbnpZtCgspeHjNNxStqtbW/Q9F+JFyi/s1eIWiP3o5Iyc993OK+OB90fQfyr6ZvtZTxf8EPFnh/QXfUNS/tqWGG2hO55ELDaVH908/lWP8Nf2a9Yv5IL7xreDTrQYJsbY5mcejP8Aw/TmtMTTlXnHkV9DiyXGUMrw9VYmXK+bbq9F0PHvBXhW98T3U5SaOw0uzHmahqc4xDax9zn+JvRR1q7498T2eo29r4b8OW8ll4Y0wk26OcSXcp+9cS+rHsO1fVvjP4HeH9f0yx0i11K/0jSbMDy7G0IETN/fYd39zWX4e/Zq8A6fcLPqEupattORFcTYjP1UDml9SqJcsfmy48TYKcvbVb6fDG23m31f4Lp3PmH4c+BPEXj3WBp+hWr+UrAXF66HyYB3JPc+gr7m+G/g7SvA3hW20HSkykY3TTMPnnkP3nb3Na+jaVpujafHp+lWUFlaxDCRQoFUVdrtw+FjR13Z8znOe1cyajblgun6sKKKK6jwgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAjuIIbiJop40ljYYZXUEEfjXFS/CP4dyXD3B8LWSySDa5XI3D0PPSu5opOKe6NKdapT+CTXo7ENnawWdrFa2sSxQxKEjReigdBWJ4o8FeGfEtwlxrWlRXUyLsWQkhgvccHpXQ0UNJqzJjOUXzRdmc94a8E+E/Dcwm0PQbGwlC7d8UeGx9a6GiihJLRDnUlUfNN3fmFFFFMgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z" alt="Omsorg" style={{ height: "70px", display: "block" }} />
          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Get an instant home care estimate</div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {step < 5 && <Progress step={step} />}
          <div style={{ padding: "20px 24px 28px" }}>

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
                <div style={{ marginBottom: "24px" }}>
                  <Lbl required>City / Town</Lbl>
                  <FInput placeholder="Type your city or town name" value={cityInput} onChange={e => setCityInput(e.target.value)} />
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Enter any city or town — even smaller places are welcome</div>
                  <Err msg={errors.city} />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <Lbl>Anything else? <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional — any language)</span></Lbl>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Hindi, Hinglish, Tamil — koi bhi bhasha chalegi. Describe what you need..." rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", color: "#111827", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }} />
                </div>
                <Btn onClick={goNext}>Continue →</Btn>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Type of care</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>What kind of care does your loved one need?</div>
                <Err msg={errors.service} />
                {SERVICE_GROUPS.map(g => (
                  <div key={g.group} style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{g.group}</div>
                    {g.items.map(s => <RadioCard key={s.name} label={s.name} desc={s.desc} checked={service === s.name} onChange={() => setService(s.name)} />)}
                  </div>
                ))}
                <div style={{ marginBottom: "24px" }}>
                  {isFreqService ? (
                    <>
                      <Lbl>How often do you need this?</Lbl>
                      {FREQ_OPTIONS.map(f => <RadioCard key={f.label} label={f.label} desc={f.desc} checked={freq.label === f.label} onChange={() => setFreq(f)} />)}
                    </>
                  ) : (
                    <>
                      <Lbl>{isVisit ? "Visits per month" : "Days of care per month"}</Lbl>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "8px" }}>
                        <input type="range" min={1} max={31} step={1} value={days} onChange={e => setDays(Number(e.target.value))} style={{ flex: 1, accentColor: G }} />
                        <div style={{ fontSize: "22px", fontWeight: 700, color: G, minWidth: "36px", textAlign: "right" }}>{days}</div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Btn secondary onClick={goBack}>← Back</Btn>
                  <Btn onClick={goNext}>Continue →</Btn>
                </div>
              </div>
            )}

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

            {step === 4 && (
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Medical conditions</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Does your loved one have any of the following? Select all that apply.</div>
                {CONDITIONS.map(c => <CheckCard key={c.label} label={c.label} desc={c.desc} checked={conditions.includes(c.label)} onChange={() => toggleCond(c.label)} />)}
                <div style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 20px" }}>If none apply, just continue.</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>Any special circumstances? (select if applicable)</div>
                {TIMING.map(t => <RadioCard key={t.label} label={t.label} desc={t.multiplier === 1.0 ? "Applies to all regular cases including 24-hour care" : t.multiplier === 1.15 ? "+15% — deployment within the same day" : "+10% premium applies"} checked={timing === t.label} onChange={() => setTiming(t.label)} />)}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <Btn secondary onClick={goBack}>← Back</Btn>
                  <Btn onClick={goNext}>Show my quote →</Btn>
                </div>
              </div>
            )}

            {step === 5 && quote && (
              <div>
                <QuoteCard quote={quote} contact={contact} />
                <div id="no-print" style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <button onClick={() => window.print()} style={{ flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Print / Save PDF</button>
                    <a href={"https://wa.me/918448381360?text=" + encodeURIComponent("Hi, I just got a care quote from Omsorg for " + quote.service + " in " + quote.cityInput + ", " + quote.stateInput + ". Can you help me?")} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "#25D366", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#fff", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>WhatsApp us</a>
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
