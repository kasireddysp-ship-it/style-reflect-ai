import { motion } from "framer-motion";
import { useState } from "react";
import elegant from "@/assets/outfit-elegant.jpg";
import trendy from "@/assets/outfit-trendy.jpg";
import budget from "@/assets/outfit-budget.jpg";
import type { OccasionContext } from "@/components/OccasionChat";
import type { PickedProfile } from "@/components/UploadCard";

export type Outfit = {
  id: string;
  label: string;
  image: string;
  price: string;
  scores: { style: number; occasion: number; comfort: number; trend: number };
  accent: string;
  reason: string;
  best: string;
};

export const outfits: Outfit[] = [
  {
    id: "elegant",
    label: "Elegant Look",
    image: elegant,
    price: "₹4,900",
    scores: { style: 96, occasion: 98, comfort: 88, trend: 84 },
    accent: "from-gold/30 to-transparent",
    reason:
      "This pastel yellow chikankari kurta complements your warm undertone and creates a balanced silhouette ideal for a daytime haldi celebration.",
    best: "Best for family functions",
  },
  {
    id: "trendy",
    label: "Trendy Look",
    image: trendy,
    price: "₹3,400",
    scores: { style: 92, occasion: 86, comfort: 82, trend: 98 },
    accent: "from-primary/40 to-transparent",
    reason:
      "A sharp co-ord set with subtle gold layering — engineered to turn heads on socials while keeping your minimalist DNA intact.",
    best: "Best for social attention",
  },
  {
    id: "budget",
    label: "Budget Smart",
    image: budget,
    price: "₹2,200",
    scores: { style: 84, occasion: 80, comfort: 94, trend: 76 },
    accent: "from-muted to-transparent",
    reason:
      "Neutral linen tailoring you can rewear across 6+ occasions. Maximum versatility, zero compromise on the elegant aesthetic.",
    best: "Best value for money",
  },
];

const mehendiLooks: Outfit[] = [
  {
    id: "mehendi-green",
    label: "Mehandi Glow",
    image: elegant,
    price: "₹1,899",
    scores: { style: 94, occasion: 99, comfort: 92, trend: 88 },
    accent: "from-gold/30 to-transparent",
    reason: "Under ₹2,000: a festive yellow-green kurta set with light dupatta styling, chosen for mehandi photos, daytime comfort, and warm skin undertones.",
    best: "Best for mehandi under ₹2,000",
  },
  {
    id: "mehendi-fusion",
    label: "Festive Fusion",
    image: trendy,
    price: "₹1,749",
    scores: { style: 91, occasion: 95, comfort: 90, trend: 96 },
    accent: "from-primary/40 to-transparent",
    reason: "A crop-top and palazzo inspired look that feels young, easy to dance in, and still reads traditional for a family function.",
    best: "Best for photos + dancing",
  },
  {
    id: "mehendi-budget",
    label: "Budget Ethnic",
    image: budget,
    price: "₹1,299",
    scores: { style: 86, occasion: 90, comfort: 96, trend: 82 },
    accent: "from-muted to-transparent",
    reason: "A reusable printed kurti look with oxidised earrings — safe, pretty, and comfortably below your stated budget.",
    best: "Best value pick",
  },
];

function personalizeOutfits(context?: OccasionContext | null, profile?: PickedProfile | null): Outfit[] {
  const text = `${context?.raw ?? ""} ${context?.occasion ?? ""} ${context?.budget ?? ""}`.toLowerCase();
  const source = /(mehandi|mehendi|mehndi)/.test(text) ? mehendiLooks : outfits;
  const budgetText = context?.budget && context.budget !== "Flexible" ? context.budget : null;
  const personaText = profile?.persona === "custom" ? "your uploaded photo" : profile?.name ?? "your style profile";

  return source.map((look, i) => ({
    ...look,
    label: context?.occasion && context.occasion !== "Not specified" ? `${context.occasion} ${i === 0 ? "Best" : i === 1 ? "Trend" : "Value"}` : look.label,
    reason: `${look.reason} Matched to ${personaText}${budgetText ? ` and your ${budgetText} budget` : ""}.`,
    scores: {
      ...look.scores,
      occasion: context?.occasion && context.occasion !== "Not specified" ? Math.min(99, look.scores.occasion + 3) : look.scores.occasion,
    },
  }));
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span><span className="text-foreground">{value}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function OutfitGallery({ context, profile, onTryOn }: { context?: OccasionContext | null; profile?: PickedProfile | null; onTryOn?: (outfit: Outfit) => void }) {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [compared, setCompared] = useState<Set<string>>(new Set());
  const suggested = personalizeOutfits(context, profile);

  const toggleSave = (id: string) =>
    setSaved((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleCompare = (id: string) =>
    setCompared((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const scrollToTryOn = () =>
    document.getElementById("tryon")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 no-scrollbar">
      {suggested.map((o, i) => (
        <motion.article
          key={o.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative w-[78vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-3xl glass-strong"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img src={o.image} alt={o.label} className="h-full w-full object-cover" loading="lazy" />
            <div className={`absolute inset-0 bg-gradient-to-t ${o.accent}`} />
            <div className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-wider">
              {o.label}
            </div>
            {profile?.photo && (
              <div className="absolute left-3 top-11 flex items-center gap-2 rounded-full glass px-2 py-1 pr-3 text-[10px] uppercase tracking-wider text-gold">
                <img src={profile.photo} alt="You" className="h-5 w-5 rounded-full object-cover ring-1 ring-gold/60" />
                Picked for you
              </div>
            )}
            <div className="absolute right-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-medium text-gold-foreground">
              {o.scores.style}/100
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between glass rounded-2xl px-3 py-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</div>
                <div className="font-display text-lg">{o.price}</div>
              </div>
              <button
                onClick={() => { onTryOn?.(o); scrollToTryOn(); }}
                className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow transition active:scale-95"
              >
                Try On Me
              </button>
            </div>
          </div>
          <div className="space-y-2 p-4">
            <Score label="Occasion" value={o.scores.occasion} />
            <Score label="Comfort" value={o.scores.comfort} />
            <Score label="Trend" value={o.scores.trend} />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => toggleCompare(o.id)}
                className={`flex-1 rounded-full py-2 text-xs transition ${compared.has(o.id) ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass"}`}
              >
                {compared.has(o.id) ? "✓ Compared" : "Compare"}
              </button>
              <button
                onClick={() => toggleSave(o.id)}
                className={`flex-1 rounded-full py-2 text-xs transition ${saved.has(o.id) ? "bg-gradient-gold text-gold-foreground shadow-gold" : "glass"}`}
              >
                {saved.has(o.id) ? "♥ Saved" : "Save"}
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
