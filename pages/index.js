import { useState, useRef } from "react";
import Head from "next/head";

const G = "#0F6E56";
const GL = "#E1F5EE";

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
  { label: "Day shift (standard hours)", multiplier: 1.0 },
  { label: "Night shift", multiplier: 1.1 },
  { label: "Weekend / holiday", multiplier: 1.1 },
  { label: "Urgent same-day start", multiplier: 1.15 },
  { label: "Remote / travel zone", multiplier: 1.1 },
];

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
          <div style={{ color: "#9FE1CB", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>
            {quote.customRequired ? "Custom Quote Required" : "Care estimate · " + quote.cityInput + ", " + quote.stateInput}
          </div>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{quote.service}</div>
          <div style={{ color: "#9FE1CB", fontSize: "12px", marginTop: "2px" }}>{contact.name} · {contact.phone}</div>
        </div>
        {!quote.customRequired && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#9FE1CB", fontSize: "11px" }}>per month</div>
            <div style={{ color: "#fff", fontSize: "26px", fontWeight: 700 }}>{fmt(quote.monthlyTotal)}</div>
            <div style={{ color: "#9FE1CB", fontSize: "11px" }}>incl. GST</div>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 20px", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 10px 10px", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "8px 0", color: "#6b7280" }}>{quote.service}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{fmt(quote.cityAdjBase)}<span style={{ color: "#6b7280", marginLeft: "2px" }}>/{perLabel}</span></td>
            </tr>
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
                <td style={{ padding: "8px 0", textAlign: "right", color: G }}>×{quote.timingMultiplier}</td>
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
  const [timing, setTiming] = useState("Day shift (standard hours)");
  const [quote, setQuote] = useState(null);
  const [leadSent, setLeadSent] = useState(false);
  const [errors, setErrors] = useState({});
  const topRef = useRef(null);

  const scrollTop = () => setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const sendLead = async (fullQuote) => {
    if (leadSent) return;
    try {
      await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: contact.name, phone: contact.phone, email: contact.email,
          state: stateInput, city: cityInput, service, days,
          dependencies: dependencies.join(", ") || "None",
          conditions: conditions.join(", ") || "None",
          timing,
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
      const q = calculate({ cityInput, stateInput, service, dependencies, conditions, timing, days });
      setQuote(q); sendLead(q); setStep(5);
    }
    scrollTop();
  };

  const goBack = () => { setStep(s => s - 1); scrollTop(); };
  const restart = () => {
    setStep(1); setContact({ name: "", phone: "", email: "" }); setStateInput(""); setCityInput("");
    setService(""); setDays(30); setDependencies([]); setConditions([]);
    setTiming("Day shift (standard hours)"); setQuote(null); setLeadSent(false); setErrors({});
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
        <div id="no-print" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingTop: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: G, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 1.6.82 3 2.05 3.82L4.5 14.5h7l-1.05-4.68C11.68 9 12.5 7.6 12.5 6c0-2.49-2.01-4.5-4.5-4.5z" fill="#9FE1CB" /></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Omsorg Home Care</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>Get an instant care estimate</div>
          </div>
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
                    {g.items.map(s => <RadioCard key={s.name} label={s.name + " — " + fmt(s.rate) + " " + s.unit} desc={s.desc} checked={service === s.name} onChange={() => setService(s.name)} />)}
                  </div>
                ))}
                <div style={{ marginBottom: "24px" }}>
                  <Lbl>{isVisit ? "Visits / sessions per month" : "Days of care per month"}</Lbl>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "8px" }}>
                    <input type="range" min={1} max={31} step={1} value={days} onChange={e => setDays(Number(e.target.value))} style={{ flex: 1, accentColor: G }} />
                    <div style={{ fontSize: "22px", fontWeight: 700, color: G, minWidth: "36px", textAlign: "right" }}>{days}</div>
                  </div>
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
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>When is care needed?</div>
                {TIMING.map(t => <RadioCard key={t.label} label={t.label} checked={timing === t.label} onChange={() => setTiming(t.label)} />)}
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
                    <a href={"https://wa.me/911205244721?text=" + encodeURIComponent("Hi, I just got a care quote from Omsorg for " + quote.service + " in " + quote.cityInput + ", " + quote.stateInput + ". Can you help me?")} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: "140px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "#25D366", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#fff", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>WhatsApp us</a>
                  </div>
                  <button onClick={restart} style={{ fontSize: "12px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>← Start a new quote</button>
                </div>
              </div>
            )}

          </div>
        </div>
        <div id="no-print" style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "12px" }}>
          Omsorg Elder Care · omsorg.co.in · +91 120 524 4721
        </div>
      </div>
    </>
  );
}
