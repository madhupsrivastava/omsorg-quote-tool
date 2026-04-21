import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const SYSTEM_PROMPT = `You are Omsorg's home care pricing assistant. You help families get accurate care cost estimates for elderly or disability home care across India.

PRICING DATA:

SERVICE RATES (Delhi base):
- Hygiene visit: 800 per visit
- Basic caregiver 10h: 1250 per day
- Basic caregiver 12h: 1400 per day
- Basic caregiver 24h: 1500 per day
- Personal caregiver 10h: 1350 per day
- Personal caregiver 24h: 1600 per day
- Home nurse 10h: 1450 per day
- Home nurse 12h: 1600 per day
- Home nurse 24h: 1650 per day
- Critical care nurse 10h: 1850 per day
- Critical care nurse 24h: 2550 per day
- Nurse visit basic: 650 per visit
- Nurse visit advanced: 1200 per visit
- Physiotherapy session: 700 per session
- Dietician consult: 500 per visit

CITY MULTIPLIERS (Delhi = 1.0):
Mumbai: 1.2 | Bengaluru: 1.15 | Chennai: 1.1 | Kolkata: 1.1 | Gurugram: 1.1 | Noida: 1.1 | Andaman: 1.1 | Ladakh: 1.1 | Lakshadweep: 1.1 | Hyderabad: 1.05 | Chandigarh: 1.05 | Kochi: 1.05 | Delhi/New Delhi: 1.0 | Jaipur: 1.0 | Lucknow: 1.0 | Dehradun: 1.0 | Ghaziabad: 1.0 | Nashik: 1.0 | Puducherry: 1.0 | Srinagar: 1.0 | Jammu: 1.0 | Amaravati: 1.0 | Panaji: 1.0 | Gandhinagar: 1.0 | Shimla: 1.0 | Thiruvananthapuram: 1.0 | Ranchi: 0.95 | Bhubaneswar: 0.95 | Bhopal: 0.95 | Patna: 0.95 | Raipur: 0.95 | Agra: 0.95 | Meerut: 0.95 | Daman: 0.95 | Dispur: 0.95 | Itanagar: 0.9 | Imphal: 0.9 | Shillong: 0.9 | Aizawl: 0.9 | Kohima: 0.9 | Gangtok: 0.9 | Agartala: 0.9

DEPENDENCY SURCHARGES (per day, multiple can apply):
- Independent/supervision only: 0
- Needs ADL help (bathing, dressing, toileting, feeding, mobility): 150
- Bedridden: 300
- Dementia/memory supervision: 250
- Transfer assistance (wheelchair/bed transfers): 150
- Diapering/continence care: 150

CONDITION SURCHARGES (per day, multiple can apply):
- Post-operative recovery: 200
- Catheter care: 200
- Feeding tube/Ryles tube: 300
- Oxygen support: 300
- Wound dressing: 250
- Injection/infusion support: 250
- Tracheostomy/suctioning: CUSTOM QUOTE
- Ventilator/ICU-style monitoring: CUSTOM QUOTE
- Aggressive behavioral dementia: CUSTOM QUOTE
- Palliative/end-of-life high dependency: 500 (may still need custom quote)

TIMING MULTIPLIERS (applied to daily subtotal):
- Day shift standard: 1.0x
- Night shift: 1.1x
- Weekend/holiday: 1.1x
- Urgent same-day: 1.15x
- Remote travel zone: 1.1x

CALCULATION:
1. city_adjusted_base = base_rate x city_multiplier
2. daily_subtotal = city_adjusted_base + all dependency surcharges + all condition surcharges
3. daily_payable = daily_subtotal x timing_multiplier
4. monthly_before_gst = daily_payable x days_per_month
5. gst = monthly_before_gst x 0.18
6. monthly_total = monthly_before_gst + gst

LANGUAGE:
- Detect the language the user writes in and respond ENTIRELY in that same language.
- Common Indian languages: Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Odia, Urdu. Handle all naturally.
- JSON field KEYS must stay in English. VALUES for "summary" and "notes" should be in the user's language.
- If the user mixes languages (Hinglish), match their style.

BEHAVIOUR:
- Be warm, empathetic and conversational. Families are making difficult decisions.
- Ask one focused question at a time.
- Gather: city, service type, dependency needs, conditions, timing, days per month.
- Once you have enough info, output ONLY a JSON block, nothing else:

\`\`\`json
{
  "type": "quote",
  "summary": "Brief care package description",
  "city": "City name",
  "service": "Service category name",
  "base_rate": 1250,
  "city_multiplier": 1.0,
  "city_adjusted_base": 1250,
  "dependency_surcharges": [{"label": "Needs ADL help", "amount": 150}],
  "condition_surcharges": [{"label": "Catheter care", "amount": 200}],
  "timing_factor": "Day shift standard",
  "timing_multiplier": 1.0,
  "daily_subtotal_before_timing": 1600,
  "daily_payable": 1600,
  "days_per_month": 30,
  "monthly_before_gst": 48000,
  "gst_rate": 0.18,
  "gst_amount": 8640,
  "monthly_total": 56640,
  "custom_quote_required": false,
  "notes": "Any important caveats or recommendations"
}
\`\`\`

If custom quote needed, set custom_quote_required to true and explain in notes.`;

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

function QuoteCard({ quote }) {
  const allLineItems = [...quote.dependency_surcharges, ...quote.condition_surcharges];
  const timingLabel = quote.timing_factor !== "Day shift standard" ? quote.timing_factor : null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", marginTop: "8px" }}>
      <div style={{ background: "#0F6E56", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#9FE1CB", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>
            {quote.custom_quote_required ? "Custom Quote Required" : "Care estimate · " + quote.city}
          </div>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 500 }}>{quote.summary}</div>
        </div>
        {!quote.custom_quote_required && (
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
            <div style={{ color: "#9FE1CB", fontSize: "11px" }}>per month</div>
            <div style={{ color: "#fff", fontSize: "22px", fontWeight: 600 }}>{fmt(quote.monthly_total)}</div>
            <div style={{ color: "#9FE1CB", fontSize: "11px" }}>incl. GST</div>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "7px 0", color: "#6b7280" }}>{quote.service}</td>
              <td style={{ padding: "7px 0", textAlign: "right" }}>{fmt(quote.city_adjusted_base)}<span style={{ color: "#6b7280", marginLeft: "3px" }}>/day</span></td>
            </tr>
            {allLineItems.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "7px 0", color: "#6b7280" }}>{s.label}</td>
                <td style={{ padding: "7px 0", textAlign: "right", color: "#0F6E56" }}>+{fmt(s.amount)}<span style={{ color: "#6b7280", marginLeft: "3px" }}>/day</span></td>
              </tr>
            ))}
            {timingLabel && (
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "7px 0", color: "#6b7280" }}>{timingLabel}</td>
                <td style={{ padding: "7px 0", textAlign: "right", color: "#0F6E56" }}>+{fmt(quote.daily_payable - quote.daily_subtotal_before_timing)}<span style={{ color: "#6b7280", marginLeft: "3px" }}>/day</span></td>
              </tr>
            )}
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "8px 0", fontWeight: 600 }}>Daily rate</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 600 }}>{fmt(quote.daily_payable)}<span style={{ color: "#6b7280", fontWeight: 400, marginLeft: "3px" }}>/day</span></td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "7px 0", color: "#6b7280" }}>Monthly subtotal ({quote.days_per_month} days)</td>
              <td style={{ padding: "7px 0", textAlign: "right" }}>{fmt(quote.monthly_before_gst)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "7px 0", color: "#6b7280" }}>GST (18%)</td>
              <td style={{ padding: "7px 0", textAlign: "right" }}>{fmt(quote.gst_amount)}</td>
            </tr>
            {!quote.custom_quote_required && (
              <tr>
                <td style={{ padding: "10px 0 4px", fontWeight: 600, fontSize: "14px" }}>Monthly total</td>
                <td style={{ padding: "10px 0 4px", textAlign: "right", fontWeight: 600, fontSize: "16px", color: "#0F6E56" }}>{fmt(quote.monthly_total)}</td>
              </tr>
            )}
          </tbody>
        </table>
        {quote.notes && (
          <div style={{ marginTop: "12px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>
            {quote.notes}
          </div>
        )}
        {quote.custom_quote_required && (
          <div style={{ marginTop: "12px", padding: "10px 12px", background: "#FAEEDA", borderRadius: "8px", fontSize: "13px", color: "#633806", lineHeight: "1.6" }}>
            This case requires a custom quote. Please contact Omsorg directly for a detailed assessment.
          </div>
        )}
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "12px" }}>
      {!isUser && (
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: "8px", marginTop: "2px" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 1.4.72 2.63 1.8 3.35L4 13h6l-.8-4.65C10.28 7.63 11 6.4 11 5c0-2.21-1.79-4-4-4z" fill="#9FE1CB"/>
          </svg>
        </div>
      )}
      <div style={{ maxWidth: "85%" }}>
        {msg.text && (
          <div style={{ padding: "10px 14px", borderRadius: isUser ? "14px 14px 4px 14px" : "4px 14px 14px 14px", background: isUser ? "#0F6E56" : "#f3f4f6", color: isUser ? "#fff" : "#111827", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {msg.text}
          </div>
        )}
        {msg.quote && <QuoteCard quote={msg.quote} />}
        {msg.loading && (
          <div style={{ padding: "10px 14px", background: "#f3f4f6", borderRadius: "4px 14px 14px 14px", display: "flex", gap: "4px", alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0F6E56", opacity: 0.5, animation: "bounce 1.2s " + (i * 0.2) + "s infinite ease-in-out" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Hello! I am here to help you find the right home care package and get a cost estimate.\n\nYou can write to me in Hindi, Tamil, Telugu, Bengali, or any language you are comfortable with.\n\nTo get started — what kind of care does your loved one need, and which city are you based in?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiHistory, setApiHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const parseResponse = (text) => {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const quote = JSON.parse(jsonMatch[1]);
        if (quote.type === "quote") return { quote, text: null };
      } catch (e) {}
    }
    return { quote: null, text: text.trim() };
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setLoading(true);
    const newApiHistory = [...apiHistory, { role: "user", content: userText }];
    setApiHistory(newApiHistory);
    setMessages(prev => [...prev, { role: "user", text: userText }, { role: "assistant", loading: true }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: newApiHistory }),
      });
      const data = await res.json();
      const rawText = data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong.";
      const { quote, text } = parseResponse(rawText);
      setApiHistory([...newApiHistory, { role: "assistant", content: rawText }]);
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", text, quote }]);
    } catch (e) {
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", text: "Sorry, I could not connect. Please try again." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const reset = () => {
    setMessages([{ role: "assistant", text: "Hello! I am here to help you find the right home care package and get a cost estimate.\n\nYou can write to me in Hindi, Tamil, Telugu, Bengali, or any language you are comfortable with.\n\nTo get started — what kind of care does your loved one need, and which city are you based in?" }]);
    setApiHistory([]);
    setInput("");
  };

  return (
    <>
      <Head>
        <title>Omsorg Care Advisor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
        textarea:focus { outline: 2px solid #0F6E56; }
      `}</style>
      <div style={{ width: "100%", maxWidth: "560px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", height: "90vh", maxHeight: "680px" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 1.6.82 3 2.05 3.82L4.5 14.5h7l-1.05-4.68C11.68 9 12.5 7.6 12.5 6c0-2.49-2.01-4.5-4.5-4.5z" fill="#9FE1CB"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>Omsorg Care Advisor</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>AI-powered home care estimates</div>
            </div>
          </div>
          <button onClick={reset} style={{ fontSize: "12px", color: "#6b7280", background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px 10px", cursor: "pointer" }}>
            New quote
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type in any language — Hindi, Tamil, Bengali…"
            rows={1}
            disabled={loading}
            style={{ flex: 1, resize: "none", fontSize: "14px", lineHeight: "1.5", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", color: "#111827", fontFamily: "inherit" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? "#f3f4f6" : "#0F6E56", color: loading || !input.trim() ? "#9ca3af" : "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: loading || !input.trim() ? "default" : "pointer", height: "36px", whiteSpace: "nowrap" }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
