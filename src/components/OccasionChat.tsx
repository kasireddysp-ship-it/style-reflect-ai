import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const examples = [
  "I have a haldi ceremony next month under ₹5000",
  "I want a classy date-night look",
  "I need outfits for a Goa vacation",
  "I want a rich CEO vibe",
];

type Tag = { k: string; v: string };

const OCCASIONS: { keys: string[]; label: string; formality: string; eventType: string }[] = [
  { keys: ["haldi"], label: "Haldi", formality: "Festive", eventType: "Day Function" },
  { keys: ["mehandi", "mehendi", "mehndi"], label: "Mehandi", formality: "Festive", eventType: "Day Function" },
  { keys: ["sangeet"], label: "Sangeet", formality: "Festive", eventType: "Night Function" },
  { keys: ["wedding", "shaadi", "marriage"], label: "Wedding", formality: "Traditional", eventType: "Grand Event" },
  { keys: ["reception"], label: "Reception", formality: "Formal", eventType: "Evening Event" },
  { keys: ["engagement", "roka"], label: "Engagement", formality: "Semi-Formal", eventType: "Evening Event" },
  { keys: ["diwali"], label: "Diwali", formality: "Festive", eventType: "Night Function" },
  { keys: ["eid"], label: "Eid", formality: "Festive", eventType: "Day Function" },
  { keys: ["date", "date-night", "date night"], label: "Date Night", formality: "Smart Casual", eventType: "Evening" },
  { keys: ["party"], label: "Party", formality: "Trendy", eventType: "Night Out" },
  { keys: ["brunch"], label: "Brunch", formality: "Smart Casual", eventType: "Day Out" },
  { keys: ["office", "work", "meeting", "interview"], label: "Workwear", formality: "Formal", eventType: "Professional" },
  { keys: ["ceo", "boss", "executive"], label: "Power Look", formality: "Formal", eventType: "Professional" },
  { keys: ["vacation", "goa", "beach", "trip", "holiday"], label: "Vacation", formality: "Resort Casual", eventType: "Travel" },
  { keys: ["birthday"], label: "Birthday", formality: "Trendy", eventType: "Celebration" },
  { keys: ["college", "campus"], label: "College", formality: "Casual", eventType: "Daywear" },
  { keys: ["festival", "puja", "pooja"], label: "Festival", formality: "Festive", eventType: "Day Function" },
];

const STYLE_INTENTS: { keys: string[]; label: string }[] = [
  { keys: ["classy", "elegant", "sophisticated"], label: "Elegant" },
  { keys: ["rich", "luxury", "premium", "ceo", "boss"], label: "Luxe" },
  { keys: ["trendy", "viral", "instagram", "insta"], label: "Trendy" },
  { keys: ["minimal", "clean", "simple"], label: "Minimalist" },
  { keys: ["bold", "statement"], label: "Bold" },
  { keys: ["traditional", "ethnic", "desi"], label: "Traditional" },
  { keys: ["cute", "sweet", "soft"], label: "Soft Feminine" },
  { keys: ["edgy", "street"], label: "Streetwear" },
];

const MONTH_SEASON: Record<string, string> = {
  january: "Winter", february: "Winter", december: "Winter",
  march: "Spring", april: "Spring",
  may: "Summer", june: "Summer", july: "Monsoon", august: "Monsoon",
  september: "Autumn", october: "Autumn", november: "Autumn",
};

function detectSeason(text: string): string {
  const t = text.toLowerCase();
  for (const m of Object.keys(MONTH_SEASON)) if (t.includes(m)) return MONTH_SEASON[m];
  if (/(summer|hot)/.test(t)) return "Summer";
  if (/(winter|cold)/.test(t)) return "Winter";
  if (/(monsoon|rain)/.test(t)) return "Monsoon";
  if (/(spring)/.test(t)) return "Spring";
  if (/(autumn|fall)/.test(t)) return "Autumn";
  // default by current month
  const idx = new Date().getMonth();
  return ["Winter","Winter","Spring","Spring","Summer","Summer","Monsoon","Monsoon","Autumn","Autumn","Autumn","Winter"][idx];
}

function detectBudget(text: string): string | null {
  // matches ₹2000, rs 2000, inr 2000, 2000 rupees, under 2k, $120
  const t = text.toLowerCase().replace(/,/g, "");
  const k = t.match(/(?:under|below|within|upto|up to|<|≤)?\s*(?:₹|rs\.?|inr|rupees?)?\s*(\d+(?:\.\d+)?)\s*(k|thousand)?/i);
  // try to be smarter: find first plausible amount near currency or k
  const patterns = [
    /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)(k|thousand)?/i,
    /(\d+(?:\.\d+)?)(k|thousand)\b/i,
    /\$(\d+(?:\.\d+)?)/,
    /(\d{3,6})\s*(?:rupees|rs|inr)?/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      let n = parseFloat(m[1]);
      if (m[2]) n *= 1000;
      if (n >= 100 && n <= 1000000) {
        const isDollar = /\$/.test(m[0]);
        return isDollar ? `$${Math.round(n)}` : `₹${Math.round(n).toLocaleString("en-IN")}`;
      }
    }
  }
  return k && parseFloat(k[1]) >= 100 ? `₹${Math.round(parseFloat(k[1])).toLocaleString("en-IN")}` : null;
}

function detectOccasion(text: string) {
  const t = text.toLowerCase();
  for (const o of OCCASIONS) if (o.keys.some((k) => t.includes(k))) return o;
  return null;
}

function detectIntent(text: string) {
  const t = text.toLowerCase();
  for (const s of STYLE_INTENTS) if (s.keys.some((k) => t.includes(k))) return s.label;
  return "Personalized";
}

function parseInput(text: string): Tag[] {
  const occ = detectOccasion(text);
  const budget = detectBudget(text);
  const intent = detectIntent(text);
  const season = detectSeason(text);

  return [
    { k: "Occasion", v: occ?.label ?? "Not specified" },
    { k: "Budget", v: budget ?? "Flexible" },
    { k: "Formality", v: occ?.formality ?? "Smart Casual" },
    { k: "Style Intent", v: intent },
    { k: "Season", v: season },
    { k: "Event Type", v: occ?.eventType ?? "General" },
  ];
}

export function OccasionChat() {
  const [value, setValue] = useState(examples[0]);
  const [submitted, setSubmitted] = useState(value);
  const [parsed, setParsed] = useState(true);

  const tags = useMemo(() => parseInput(submitted), [submitted]);

  const interpret = () => {
    setSubmitted(value);
    setParsed(true);
  };

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl glass-strong p-5">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-primary shadow-glow" />
          <textarea
            value={value}
            onChange={(e) => { setValue(e.target.value); setParsed(false); }}
            rows={3}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
            placeholder="Describe your event…"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => { setValue(e); setSubmitted(e); setParsed(true); }}
              className="rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
            >
              {e.length > 28 ? e.slice(0, 28) + "…" : e}
            </button>
          ))}
        </div>
        <button
          onClick={interpret}
          className="mt-4 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-medium text-primary-foreground shadow-glow"
        >
          ✨ Interpret with AI
        </button>
      </div>

      {parsed && (
        <motion.div
          key={submitted}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-5"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold">AI extracted</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {tags.map((t) => (
              <div key={t.k} className="rounded-xl glass-strong px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.k}</div>
                <div className="text-sm">{t.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
