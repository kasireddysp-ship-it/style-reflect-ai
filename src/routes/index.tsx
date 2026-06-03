import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Splash } from "@/components/Splash";
import { UploadCard, type PickedProfile } from "@/components/UploadCard";
import { Analysis } from "@/components/Analysis";
import { OccasionChat, parseInput, type OccasionContext } from "@/components/OccasionChat";
import { OutfitGallery, outfits, type Outfit } from "@/components/OutfitGallery";
import { TryOnSlider } from "@/components/TryOnSlider";
import accessories from "@/assets/accessories.jpg";
import elegant from "@/assets/outfit-elegant.jpg";
import trendy from "@/assets/outfit-trendy.jpg";
import budget from "@/assets/outfit-budget.jpg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MirrorMe AI — See Yourself Before You Buy" },
      { name: "description", content: "Your personal AI stylist. Generate outfits, try them on, and shop with total confidence." },
    ],
  }),
  component: Index,
});

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full glass px-3 py-1 text-[11px] text-muted-foreground">{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl glass p-5 ${className}`}>{children}</div>;
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-md overflow-hidden">
      {/* status bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 pt-3 pb-2 text-[11px] backdrop-blur-md">
        <span className="font-medium tracking-wider">9:41</span>
        <span className="text-gradient-gold font-display">MirrorMe AI</span>
        <span className="opacity-70">●●●●</span>
      </div>
      {children}
    </main>
  );
}

function SquadVotes() {
  const [votes, setVotes] = useState([7, 3, 1, 4]);
  const [voted, setVoted] = useState<number | null>(null);
  const voteLabels = [["🔥", "Love"], ["👍", "Good"], ["🤔", "Try"], ["💯", "Perfect"]];

  const handleVote = (i: number) => {
    if (voted !== null) return;
    setVoted(i);
    setVotes((v) => v.map((c, j) => (j === i ? c + 1 : c)));
  };

  const total = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-4 divide-x divide-white/5 text-center">
      {voteLabels.map(([e, l], i) => (
        <button
          key={l}
          onClick={() => handleVote(i)}
          disabled={voted !== null}
          className={`py-3 transition ${voted === i ? "bg-gradient-primary/20" : voted !== null ? "opacity-60" : "hover:bg-white/5 active:scale-95"}`}
        >
          <div className="text-xl">{e}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
          <div className="text-xs">{votes[i]}</div>
        </button>
      ))}
      {voted !== null && (
        <div className="col-span-4 border-t border-white/5 px-4 py-2 text-[10px] text-gold text-center">
          Thanks! {Math.round((votes[voted] / (total)) * 100)}% of voters agree
        </div>
      )}
    </div>
  );
}

const BUDGET_PRESETS = [
  { label: "Premium", price: "₹4,900", gradient: "from-primary/40" },
  { label: "Value", price: "₹3,400", gradient: "from-gold/30" },
  { label: "Budget", price: "₹2,200", gradient: "from-muted-foreground/20" },
];

function BudgetOptimizer() {
  const [sliderVal, setSliderVal] = useState(70);

  const selectedIdx = sliderVal > 66 ? 0 : sliderVal > 33 ? 1 : 2;
  const displayBudget = BUDGET_PRESETS[selectedIdx].price;

  return (
    <div className="rounded-3xl glass p-5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Your budget</span>
        <span className="font-display text-lg text-gradient-gold">{displayBudget}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={sliderVal}
        onChange={(e) => setSliderVal(Number(e.target.value))}
        className="mt-3 w-full accent-[oklch(0.62_0.22_300)]"
      />
      <div className="mt-5 space-y-3">
        {BUDGET_PRESETS.map(({ label, price, gradient }, i) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-2xl bg-gradient-to-r ${gradient} to-transparent p-3 transition ${selectedIdx === i ? "ring-1 ring-white/20" : ""}`}
          >
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label} look</div>
              <div className="font-display text-base">{price}</div>
            </div>
            <button
              onClick={() => document.getElementById("outfits")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full glass px-3 py-1.5 text-xs hover:border-primary/40 transition active:scale-95"
            >
              View
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-3 text-xs">
        <span className="text-gold">💡</span> Achieve a similar aesthetic while saving <b>35%</b>.
      </div>
    </div>
  );
}

function SustainableMode() {
  const [choice, setChoice] = useState<"wardrobe" | "shop" | null>(null);

  return (
    <div className="rounded-3xl glass p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌿</span>
        <div>
          <div className="text-sm">You already own a similar ivory shirt.</div>
          <div className="mt-1 text-xs text-muted-foreground">Pair it with the new charcoal trouser — saves ₹1,800 and one box from landfill.</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setChoice("wardrobe")}
          className={`flex-1 rounded-full py-2 text-xs transition active:scale-95 ${choice === "wardrobe" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-gradient-primary text-primary-foreground"}`}
        >
          {choice === "wardrobe" ? "✓ Using wardrobe" : "Use wardrobe"}
        </button>
        <button
          onClick={() => setChoice("shop")}
          className={`flex-1 rounded-full py-2 text-xs transition active:scale-95 ${choice === "shop" ? "bg-gradient-gold text-gold-foreground shadow-gold" : "glass"}`}
        >
          {choice === "shop" ? "✓ Shopping new" : "Shop new"}
        </button>
      </div>
      {choice === "wardrobe" && (
        <div className="mt-3 rounded-xl border border-green-400/20 bg-green-400/5 p-2 text-[11px] text-green-400">
          Great choice! 🌿 You saved ₹1,800 and reduced your carbon footprint.
        </div>
      )}
      {choice === "shop" && (
        <div className="mt-3 rounded-xl border border-gold/20 bg-gold/5 p-2 text-[11px] text-gold">
          Added to cart. Consider sustainable brands for a greener choice!
        </div>
      )}
    </div>
  );
}

function Index() {
  const [demo, setDemo] = useState<PickedProfile | null>(null);
  const [occasion, setOccasion] = useState<OccasionContext>(() => parseInput("I have a mehandi function next month dress under 2000"));
  const [tryOnOutfit, setTryOnOutfit] = useState<Outfit | null>(null);

  return (
    <Phone>
      {/* 1. SPLASH */}
      <Splash onStart={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })} />

      {/* 2. PROBLEM */}
      <Section
        id="problem"
        eyebrow="The Problem"
        title={<>Too many <em className="not-italic text-gradient-purple">choices.</em><br/>Too little <em className="not-italic text-gradient-gold">confidence.</em></>}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            ["📜", "Endless scrolling"],
            ["🧠", "Decision fatigue"],
            ["🛒", "Cart abandonment"],
            ["📦", "High returns"],
            ["🪞", "Will it suit me?"],
            ["💸", "Buyer's regret"],
          ].map(([e, t]) => (
            <Card key={t} className="flex items-center gap-3 !p-4">
              <span className="text-2xl">{e}</span>
              <span className="text-sm">{t}</span>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-destructive">Today</div>
            <div className="mt-2 font-display text-lg leading-tight">Guess. Buy. Return.</div>
            <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
              <div>· 30% return rate</div>
              <div>· 12 min decisions</div>
              <div>· Low confidence</div>
            </div>
          </div>
          <div className="rounded-3xl glass-strong p-4 shadow-glow">
            <div className="text-[10px] uppercase tracking-wider text-gold">MirrorMe AI</div>
            <div className="mt-2 font-display text-lg leading-tight text-gradient-purple">See. Decide. Love.</div>
            <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
              <div>· 8% return rate</div>
              <div>· 90s decisions</div>
              <div>· 92% confidence</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. UPLOAD */}
      <Section id="upload" eyebrow="Step 01" title="Meet your mirror." subtitle="Upload a photo or step in as a demo persona.">
        <UploadCard onPicked={setDemo} />
        <button
          onClick={() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" })}
          className="pulse-glow mt-6 w-full rounded-full bg-gradient-primary py-4 text-sm font-medium text-primary-foreground shadow-glow transition active:scale-95"
        >
          Analyze My Style {demo && `— ${demo.name}`}
        </button>
      </Section>

      {/* 4. ANALYSIS */}
      <Section id="analysis" eyebrow="Step 02" title="AI is reading your style DNA." subtitle="50,000 fashion signals scanned in under 3 seconds.">
        <Analysis profile={demo} />
      </Section>

      {/* 5. OCCASION */}
      <Section eyebrow="Step 03" title="Tell us about your event.">
        <OccasionChat onInterpreted={setOccasion} />
      </Section>

      {/* 6. OUTFIT GENERATION */}
      <Section id="outfits" eyebrow="Step 04" title="Three looks. One you." subtitle="Curated for your body, budget and moment.">
        <OutfitGallery context={occasion} profile={demo} onTryOn={setTryOnOutfit} />
      </Section>

      {/* 7. WHY THIS SUITS YOU */}
      <Section eyebrow="Explainable AI" title="Why this suits you.">
        <div className="space-y-3">
          {outfits.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-3xl glass-strong p-4"
            >
              <img src={o.image} alt="" className="h-24 w-20 shrink-0 rounded-2xl object-cover" loading="lazy" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gold">{o.label}</div>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{o.reason}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 8. VIRTUAL TRY-ON */}
      <Section id="tryon" eyebrow="Virtual Try-On" title="Slide. Reveal. Believe." subtitle="Premium photoreal visualization on your own silhouette.">
        <TryOnSlider profile={demo} outfit={tryOnOutfit} />
      </Section>

      {/* 9. SHARE & VOTES */}
      <Section eyebrow="Squad Approval" title="Borrow your friends' taste.">
        <Card className="!p-0 overflow-hidden">
          <div className="relative aspect-[4/3]">
            <img src={trendy} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="rounded-full glass px-3 py-1.5 text-xs">12 friends voted</div>
              <div className="rounded-full bg-gradient-gold px-3 py-1.5 text-xs font-medium text-gold-foreground">92% 🔥</div>
            </div>
          </div>
          <SquadVotes />
          <div className="border-t border-white/5 p-4 text-xs text-muted-foreground">
            <span className="text-gold">AI summary —</span> Most friends preferred Outfit B due to its stronger occasion match.
          </div>
        </Card>
      </Section>

      {/* 10. COMPARISON */}
      <Section eyebrow="Side by side" title="Compare in one glance.">
        <div className="overflow-x-auto -mx-5 px-5 no-scrollbar">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-3"></th>
                <th className="pb-3">Elegant</th>
                <th className="pb-3">Trendy</th>
                <th className="pb-3">Budget</th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:py-3 [&>tr]:border-t [&>tr]:border-white/5">
              <tr><td className="text-muted-foreground">Style</td><td>96</td><td>92</td><td>84</td></tr>
              <tr><td className="text-muted-foreground">Budget</td><td>₹4.9k</td><td>₹3.4k</td><td>₹2.2k</td></tr>
              <tr><td className="text-muted-foreground">Occasion</td><td>98</td><td>86</td><td>80</td></tr>
              <tr><td className="text-muted-foreground">Comfort</td><td>88</td><td>82</td><td>94</td></tr>
              <tr><td className="text-muted-foreground">Trend</td><td>84</td><td>98</td><td>76</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
          {outfits.map((o) => (
            <div key={o.id} className="rounded-2xl glass p-3">
              <div className="font-display text-sm">{o.label.split(" ")[0]}</div>
              <div className="mt-1 text-muted-foreground">{o.best}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 11. COMPLETE THE LOOK */}
      <Section eyebrow="Complete the look" title="Every detail considered.">
        <div className="overflow-hidden rounded-3xl glass-strong">
          <img src={accessories} alt="Accessories" className="aspect-[4/3] w-full object-cover" loading="lazy" />
        </div>
        <div className="mt-4 -mx-5 flex gap-3 overflow-x-auto px-5 no-scrollbar">
          {[
            ["Loafers", "₹1,890"],
            ["Gold Watch", "₹3,200"],
            ["Pearl Necklace", "₹1,450"],
            ["Mini Handbag", "₹2,100"],
            ["Hoops", "₹650"],
          ].map(([n, p]) => (
            <div key={n} className="w-32 shrink-0 rounded-2xl glass p-3">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/0" />
              <div className="mt-2 text-sm">{n}</div>
              <div className="text-xs text-gold">{p}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. BUDGET OPTIMIZER */}
      <Section eyebrow="Smart budget" title="Same vibe. Your price.">
        <BudgetOptimizer />
      </Section>

      {/* 13. WEATHER */}
      <Section eyebrow="Weather-aware" title="Hyderabad · 38°C ☀️">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-3xl">38°</div>
              <div className="text-xs text-muted-foreground">Sunny · Low humidity</div>
            </div>
            <div className="text-5xl">☀️</div>
          </div>
          <div className="mt-4 rounded-2xl glass p-3 text-xs text-muted-foreground">
            <span className="text-gold">AI tip —</span> Lightweight cotton and linen recommended. Avoid synthetics today.
          </div>
          <div className="mt-3 flex gap-2">
            {["Cotton","Linen","Pastels","Loose fit"].map(t => <Pill key={t}>{t}</Pill>)}
          </div>
        </Card>
      </Section>

      {/* 14. PACKING ASSISTANT */}
      <Section eyebrow="Packing assistant" title="3 days in Goa, sorted.">
        <div className="space-y-3">
          {[
            ["Day 1", "Arrival · Linen kurta + chinos", elegant],
            ["Day 2", "Beach · Breezy shirt + shorts", budget],
            ["Day 3 ☾", "Dinner · Smart co-ord set", trendy],
          ].map(([d,t,img]) => (
            <div key={d as string} className="flex gap-3 rounded-3xl glass-strong p-3">
              <img src={img as string} alt="" className="h-20 w-16 rounded-xl object-cover" loading="lazy" />
              <div className="self-center">
                <div className="text-[10px] uppercase tracking-wider text-gold">{d}</div>
                <div className="text-sm">{t}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 15. STYLE DNA */}
      <Section eyebrow="Style DNA" title="Your fashion fingerprint.">
        <Card>
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#g1)" strokeWidth="3" strokeDasharray="70 100" strokeLinecap="round" />
                <defs>
                  <linearGradient id="g1"><stop offset="0%" stopColor="oklch(0.62 0.22 300)" /><stop offset="100%" stopColor="oklch(0.83 0.13 85)" /></linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display text-xl">70%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Personality</div>
              <div className="font-display text-xl">Confident Minimalist</div>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-xs">
            {[["Minimalist", 70],["Elegant", 20],["Streetwear", 10]].map(([l,v]) => (
              <div key={l as string}>
                <div className="flex justify-between text-muted-foreground"><span>{l}</span><span className="text-foreground">{v}%</span></div>
                <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* 16. STYLE MEMORY */}
      <Section eyebrow="Style memory" title="Your AI learns you.">
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-gold to-transparent" />
          {[
            ["Mar", "Bought a charcoal blazer"],
            ["Apr", "Loved pastels for daywear"],
            ["May", "Rejected bright neons"],
            ["Now", "Prefers relaxed tailoring"],
          ].map(([d,t]) => (
            <div key={d as string} className="relative mb-4">
              <div className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-gold shadow-gold" />
              <div className="text-[10px] uppercase tracking-wider text-gold">{d}</div>
              <div className="text-sm">{t}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 17. SUSTAINABLE */}
      <Section eyebrow="Sustainable mode" title="Buy less. Style more.">
        <SustainableMode />
      </Section>

      {/* 18. FASHION ROAST */}
      <Section eyebrow="Fashion roast 🔥" title="Honest. Playful. Useful.">
        <Card>
          <div className="text-xs text-muted-foreground">Your last look</div>
          <div className="mt-2 font-display text-lg leading-snug">
            "Stylish — but the colors are competing. A neutral trouser would let the shirt sing."
          </div>
          <div className="mt-3 flex gap-2 text-[11px]">
            <Pill>Color balance · 6/10</Pill>
            <Pill>Silhouette · 9/10</Pill>
          </div>
        </Card>
      </Section>

      {/* 19. BUSINESS IMPACT */}
      <Section eyebrow="Business impact" title="Numbers that shop owners love.">
        <div className="grid grid-cols-2 gap-3">
          {[
            ["↑ 38%", "Conversion"],
            ["↓ 47%", "Returns"],
            ["↑ 2.3×", "Cart value"],
            ["↑ 64%", "Retention"],
            ["↓ 81%", "Decision time"],
            ["↑ 92%", "Confidence"],
          ].map(([n,l]) => (
            <Card key={l} className="!p-4">
              <div className="font-display text-2xl text-gradient-gold">{n}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 20. TRUST & SAFETY */}
      <Section eyebrow="Trust & safety" title="Built with respect.">
        <div className="space-y-3">
          {[
            ["🔒", "Privacy first", "Photos are encrypted and auto-deleted after analysis."],
            ["💡", "Explainable AI", "Every recommendation includes clear reasoning."],
            ["✅", "Reliable", "Confidence scores on every prediction."],
            ["⚡", "Fast", "Sub-3-second styling workflows."],
          ].map(([e,t,d]) => (
            <Card key={t} className="flex items-start gap-3 !p-4">
              <span className="text-xl">{e}</span>
              <div>
                <div className="text-sm font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FINAL */}
      <section className="relative px-5 py-24 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 w-64 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <h2 className="relative font-display text-4xl leading-tight tracking-tight">
          Fashion shopping<br/>should feel <span className="text-gradient-gold">effortless</span>.
        </h2>
        <p className="relative mt-4 text-sm text-muted-foreground">
          Transform uncertainty into confidence with MirrorMe AI.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="pulse-glow relative mt-8 rounded-full bg-gradient-primary px-10 py-4 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Start Styling
        </button>
        <div className="relative mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          MirrorMe AI · A new mirror for fashion
        </div>
      </section>
    </Phone>
  );
}
