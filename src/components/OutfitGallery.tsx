import { motion } from "framer-motion";
import { useState } from "react";
import elegant from "@/assets/outfit-elegant.jpg";
import trendy from "@/assets/outfit-trendy.jpg";
import budget from "@/assets/outfit-budget.jpg";
import type { OccasionContext } from "@/components/OccasionChat";
import type { PickedProfile } from "@/components/UploadCard";

type DressPattern = "gota" | "floral" | "bandhani" | "mirror" | "plain" | "ajrakh";
type DressSilhouette = "anarkali" | "sharara" | "lehenga" | "saree" | "kurta" | "fusion";

export type Outfit = {
  id: string;
  label: string;
  image: string;
  price: string;
  scores: { style: number; occasion: number; comfort: number; trend: number };
  accent: string;
  reason: string;
  best: string;
  colors: { primary: string; secondary: string; trim: string };
  pattern: DressPattern;
  silhouette: DressSilhouette;
};

export const outfits: Outfit[] = [
  {
    id: "marigold-anarkali",
    label: "Marigold Anarkali",
    image: elegant,
    price: "₹1,899",
    scores: { style: 94, occasion: 99, comfort: 92, trend: 88 },
    accent: "from-gold/30 to-transparent",
    reason: "A yellow-green festive anarkali with a light dupatta, made for mehandi photos and daytime comfort.",
    best: "Best classic mehandi pick",
    colors: { primary: "#d5a51f", secondary: "#6f8f2f", trim: "#f5df87" },
    pattern: "gota",
    silhouette: "anarkali",
  },
  {
    id: "mehendi-sharara",
    label: "Mehendi Green Sharara",
    image: trendy,
    price: "₹1,749",
    scores: { style: 92, occasion: 98, comfort: 94, trend: 94 },
    accent: "from-primary/40 to-transparent",
    reason: "A deep green short kurti and sharara set that looks festive without feeling heavy.",
    best: "Best for dancing",
    colors: { primary: "#176b3a", secondary: "#9bbb47", trim: "#d9b84f" },
    pattern: "mirror",
    silhouette: "sharara",
  },
  {
    id: "emerald-lehenga",
    label: "Emerald Mirror Lehenga",
    image: budget,
    price: "₹1,999",
    scores: { style: 96, occasion: 97, comfort: 86, trend: 91 },
    accent: "from-gold/30 to-transparent",
    reason: "A compact mirror-work lehenga choice for a more dressed-up mehandi look while staying near budget.",
    best: "Best statement look",
    colors: { primary: "#0f7a55", secondary: "#123f2b", trim: "#e7c35c" },
    pattern: "mirror",
    silhouette: "lehenga",
  },
  {
    id: "rani-kurta",
    label: "Rani Pink Kurta Set",
    image: elegant,
    price: "₹1,599",
    scores: { style: 90, occasion: 93, comfort: 96, trend: 89 },
    accent: "from-primary/40 to-transparent",
    reason: "Bright rani pink balances the green mehandi theme and gives your photos more contrast.",
    best: "Best color pop",
    colors: { primary: "#c2185b", secondary: "#f48fb1", trim: "#f8d36a" },
    pattern: "floral",
    silhouette: "kurta",
  },
  {
    id: "ivory-chikankari",
    label: "Ivory Chikankari",
    image: budget,
    price: "₹1,299",
    scores: { style: 88, occasion: 90, comfort: 98, trend: 84 },
    accent: "from-muted to-transparent",
    reason: "Soft ivory chikankari keeps the look elegant and reusable with oxidised or gold accessories.",
    best: "Best reusable outfit",
    colors: { primary: "#f3ead4", secondary: "#c6d8a7", trim: "#b7923b" },
    pattern: "plain",
    silhouette: "kurta",
  },
  {
    id: "teal-bandhani",
    label: "Teal Bandhani Suit",
    image: trendy,
    price: "₹1,699",
    scores: { style: 91, occasion: 96, comfort: 93, trend: 90 },
    accent: "from-primary/40 to-transparent",
    reason: "Teal bandhani gives a traditional festive feel and photographs well against yellow mehandi decor.",
    best: "Best traditional print",
    colors: { primary: "#0f8a8a", secondary: "#62c2a4", trim: "#f1cf64" },
    pattern: "bandhani",
    silhouette: "anarkali",
  },
  {
    id: "lime-palazzo",
    label: "Lime Gota Palazzo",
    image: budget,
    price: "₹1,449",
    scores: { style: 87, occasion: 92, comfort: 97, trend: 86 },
    accent: "from-gold/30 to-transparent",
    reason: "Light lime palazzo styling is airy, easy to move in, and clearly mehandi-coded.",
    best: "Best comfort fit",
    colors: { primary: "#a6c83f", secondary: "#eef0a0", trim: "#d7a93b" },
    pattern: "gota",
    silhouette: "sharara",
  },
  {
    id: "peach-saree",
    label: "Peach Organza Saree",
    image: elegant,
    price: "₹1,950",
    scores: { style: 93, occasion: 91, comfort: 82, trend: 95 },
    accent: "from-gold/30 to-transparent",
    reason: "A peach organza-inspired drape feels graceful for family photos without going too bridal.",
    best: "Best graceful drape",
    colors: { primary: "#f0a47d", secondary: "#f7d1a8", trim: "#b86f2d" },
    pattern: "floral",
    silhouette: "saree",
  },
  {
    id: "mustard-ajrakh",
    label: "Mustard Ajrakh Kurta",
    image: budget,
    price: "₹1,199",
    scores: { style: 85, occasion: 88, comfort: 97, trend: 83 },
    accent: "from-muted to-transparent",
    reason: "A mustard printed kurta is budget-safe, breathable, and easy to repeat after the function.",
    best: "Best budget saver",
    colors: { primary: "#b87916", secondary: "#263b48", trim: "#efc86a" },
    pattern: "ajrakh",
    silhouette: "kurta",
  },
  {
    id: "sage-angrakha",
    label: "Sage Angrakha",
    image: trendy,
    price: "₹1,650",
    scores: { style: 89, occasion: 92, comfort: 94, trend: 87 },
    accent: "from-muted to-transparent",
    reason: "A calm sage angrakha shape flatters the waist and keeps the styling soft for daytime.",
    best: "Best soft silhouette",
    colors: { primary: "#7f9d69", secondary: "#d7e0bf", trim: "#cc9f45" },
    pattern: "plain",
    silhouette: "anarkali",
  },
  {
    id: "coral-fusion",
    label: "Coral Fusion Set",
    image: elegant,
    price: "₹1,799",
    scores: { style: 90, occasion: 89, comfort: 91, trend: 97 },
    accent: "from-primary/40 to-transparent",
    reason: "A coral crop-top inspired set feels young and social-ready while still fitting a family event.",
    best: "Best modern pick",
    colors: { primary: "#e05d4f", secondary: "#f3b187", trim: "#f4d56b" },
    pattern: "floral",
    silhouette: "fusion",
  },
  {
    id: "mint-gown",
    label: "Mint Embroidered Gown",
    image: trendy,
    price: "₹1,850",
    scores: { style: 91, occasion: 94, comfort: 90, trend: 92 },
    accent: "from-primary/40 to-transparent",
    reason: "Mint embroidery looks fresh beside mehandi greens and gives a polished Indo-western finish.",
    best: "Best Indo-western look",
    colors: { primary: "#8fd7bc", secondary: "#2d8068", trim: "#d8b350" },
    pattern: "mirror",
    silhouette: "fusion",
  },
];

function priceNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function budgetCap(context?: OccasionContext | null) {
  const text = `${context?.raw ?? ""} ${context?.budget ?? ""}`.toLowerCase();
  const match = text.match(/(?:under|below|less than|budget|₹|rs\.?|inr)\s*([0-9,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

export function personalizeOutfits(context?: OccasionContext | null, profile?: PickedProfile | null): Outfit[] {
  const text = `${context?.raw ?? ""} ${context?.occasion ?? ""} ${context?.budget ?? ""}`.toLowerCase();
  const mehandiBoost = /(mehandi|mehendi|mehndi)/.test(text) ? 4 : 0;
  const cap = budgetCap(context);
  const budgetText = context?.budget && context.budget !== "Flexible" ? context.budget : null;
  const personaText = profile?.persona === "custom" ? "your uploaded photo" : profile?.name ?? "your style profile";

  return outfits
    .map((look) => {
      const withinBudget = cap ? priceNumber(look.price) <= cap : true;
      return {
        ...look,
        reason: `${look.reason} Matched to ${personaText}${budgetText ? ` and your ${budgetText} budget` : ""}.`,
        scores: {
          ...look.scores,
          occasion: Math.min(99, look.scores.occasion + mehandiBoost + (withinBudget ? 1 : -4)),
          style: Math.min(99, look.scores.style + (profile?.photo ? 2 : 0)),
        },
      };
    })
    .sort((a, b) => {
      if (!cap) return b.scores.occasion - a.scores.occasion;
      const aBudget = priceNumber(a.price) <= cap ? 1 : 0;
      const bBudget = priceNumber(b.price) <= cap ? 1 : 0;
      return bBudget - aBudget || b.scores.occasion - a.scores.occasion;
    });
}

function patternStyle(outfit: Outfit) {
  const { primary, secondary, trim } = outfit.colors;
  if (outfit.pattern === "bandhani") {
    return { backgroundImage: `radial-gradient(circle, ${trim} 0 9%, transparent 10% 100%), radial-gradient(circle, ${secondary} 0 7%, transparent 8% 100%)`, backgroundSize: "22px 22px, 34px 34px" };
  }
  if (outfit.pattern === "mirror") {
    return { backgroundImage: `radial-gradient(circle, ${trim} 0 8%, transparent 9% 100%), linear-gradient(135deg, transparent 44%, ${secondary} 45% 55%, transparent 56%)`, backgroundSize: "30px 30px, 42px 42px" };
  }
  if (outfit.pattern === "floral") {
    return { backgroundImage: `radial-gradient(circle at 30% 30%, ${trim} 0 6%, transparent 7%), radial-gradient(circle at 70% 60%, ${secondary} 0 8%, transparent 9%)`, backgroundSize: "34px 34px" };
  }
  if (outfit.pattern === "ajrakh") {
    return { backgroundImage: `linear-gradient(45deg, ${secondary} 25%, transparent 25% 75%, ${secondary} 75%), linear-gradient(-45deg, ${trim} 20%, transparent 21% 79%, ${trim} 80%)`, backgroundSize: "28px 28px" };
  }
  if (outfit.pattern === "gota") {
    return { backgroundImage: `linear-gradient(90deg, transparent 0 42%, ${trim} 43% 47%, transparent 48% 100%), radial-gradient(circle, ${trim} 0 6%, transparent 7%)`, backgroundSize: "34px 34px, 24px 24px" };
  }
  return { backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})` };
}

function skirtShape(outfit: Outfit) {
  if (outfit.silhouette === "lehenga") return "polygon(18% 0, 82% 0, 100% 100%, 0 100%)";
  if (outfit.silhouette === "saree") return "polygon(34% 0, 72% 0, 88% 100%, 18% 100%)";
  if (outfit.silhouette === "sharara") return "polygon(22% 0, 78% 0, 95% 100%, 58% 100%, 50% 28%, 42% 100%, 5% 100%)";
  if (outfit.silhouette === "fusion") return "polygon(24% 0, 76% 0, 90% 100%, 10% 100%)";
  if (outfit.silhouette === "kurta") return "polygon(28% 0, 72% 0, 78% 100%, 22% 100%)";
  return "polygon(25% 0, 75% 0, 94% 100%, 6% 100%)";
}

export function DressArt({ outfit, photo, compact = false }: { outfit: Outfit; photo?: string; compact?: boolean }) {
  const pattern = patternStyle(outfit);
  return (
    <div className="relative h-full w-full overflow-hidden bg-card">
      {photo ? (
        <img src={photo} alt="Your photo preview" className="absolute inset-0 h-full w-full object-cover opacity-75" loading="lazy" />
      ) : (
        <img src={outfit.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute inset-x-[18%] bottom-[7%] top-[17%] drop-shadow-2xl">
        <div
          className="absolute left-[23%] top-0 h-[24%] w-[54%] rounded-t-full rounded-b-2xl ring-1 ring-foreground/10"
          style={{ background: `linear-gradient(135deg, ${outfit.colors.primary}, ${outfit.colors.secondary})` }}
        />
        <div
          className="absolute left-[9%] top-[18%] h-[78%] w-[82%] rounded-b-[44%] ring-1 ring-foreground/10"
          style={{ backgroundColor: outfit.colors.primary, clipPath: skirtShape(outfit), ...pattern }}
        />
        <div
          className="absolute left-[8%] top-[2%] h-[88%] w-[26%] rotate-[-12deg] rounded-full opacity-85 blur-[0.2px]"
          style={{ background: `linear-gradient(180deg, ${outfit.colors.trim}, transparent 78%)` }}
        />
        <div
          className="absolute right-[7%] top-[8%] h-[82%] w-[22%] rotate-[13deg] rounded-full opacity-75"
          style={{ background: `linear-gradient(180deg, ${outfit.colors.secondary}, transparent 80%)` }}
        />
        <div className="absolute left-[26%] right-[26%] top-[24%] h-1 rounded-full" style={{ backgroundColor: outfit.colors.trim }} />
      </div>
      {!compact && (
        <div className="absolute bottom-3 left-3 right-3 rounded-2xl glass px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{outfit.silhouette} · {outfit.pattern}</div>
          <div className="font-display text-base leading-tight">{outfit.label}</div>
        </div>
      )}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span><span className="text-foreground">{value}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function OutfitGallery({ context, profile, onTryOn }: { context?: OccasionContext | null; profile?: PickedProfile | null; onTryOn?: (outfit: Outfit) => void }) {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [compared, setCompared] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const suggested = personalizeOutfits(context, profile);

  const toggleSave = (id: string) =>
    setSaved((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleCompare = (id: string) =>
    setCompared((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const chooseOutfit = (outfit: Outfit) => {
    setSelectedId(outfit.id);
    onTryOn?.(outfit);
    document.getElementById("tryon")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-muted-foreground">Pick any dress first</span>
        <span className="rounded-full glass px-3 py-1 text-gold">{suggested.length} choices</span>
      </div>
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 no-scrollbar">
        {suggested.map((o, i) => {
          const selected = selectedId === o.id;
          return (
            <motion.article
              key={o.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.28) }}
              className={`relative w-[74vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-3xl glass-strong transition ${selected ? "ring-2 ring-gold shadow-gold" : ""}`}
            >
              <button onClick={() => chooseOutfit(o)} className="relative block aspect-[3/4] w-full overflow-hidden text-left active:scale-[0.99]">
                <DressArt outfit={o} photo={profile?.photo} />
                <div className={`absolute inset-0 bg-gradient-to-t ${o.accent}`} />
                <div className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-wider">
                  Choice {i + 1}
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-medium text-gold-foreground">
                  {o.scores.style}/100
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between glass rounded-2xl px-3 py-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</div>
                    <div className="font-display text-lg">{o.price}</div>
                  </div>
                  <span className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow">
                    {selected ? "Selected" : "Try On Me"}
                  </span>
                </div>
              </button>
              <div className="space-y-2 p-4">
                <div>
                  <div className="font-display text-lg leading-tight">{o.label}</div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{o.reason}</p>
                </div>
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
          );
        })}
      </div>
    </div>
  );
}
