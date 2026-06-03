import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import elegant from "@/assets/outfit-elegant.jpg";
import trendy from "@/assets/outfit-trendy.jpg";
import budget from "@/assets/outfit-budget.jpg";
import type { PickedProfile, PersonaKey } from "@/components/UploadCard";

type TraitSet = {
  photo: string;
  traits: { label: string; value: string }[];
};

const PERSONA_DATA: Record<PersonaKey, TraitSet> = {
  wedding: {
    photo: elegant,
    traits: [
      { label: "Body Type", value: "Hourglass" },
      { label: "Skin Tone", value: "Warm Honey" },
      { label: "Style DNA", value: "Regal Ethnic" },
      { label: "Preferred Fit", value: "Drapey Tailored" },
      { label: "Fashion Personality", value: "Festive Maximalist" },
    ],
  },
  college: {
    photo: trendy,
    traits: [
      { label: "Body Type", value: "Slim" },
      { label: "Skin Tone", value: "Neutral Beige" },
      { label: "Style DNA", value: "Streetwear Chic" },
      { label: "Preferred Fit", value: "Oversized Relaxed" },
      { label: "Fashion Personality", value: "Trendsetter Gen-Z" },
    ],
  },
  professional: {
    photo: heroPortrait,
    traits: [
      { label: "Body Type", value: "Athletic" },
      { label: "Skin Tone", value: "Warm Olive" },
      { label: "Style DNA", value: "Smart Modern" },
      { label: "Preferred Fit", value: "Tailored Slim" },
      { label: "Fashion Personality", value: "Confident Minimalist" },
    ],
  },
  executive: {
    photo: budget,
    traits: [
      { label: "Body Type", value: "Broad Shoulder" },
      { label: "Skin Tone", value: "Cool Fair" },
      { label: "Style DNA", value: "Power Luxe" },
      { label: "Preferred Fit", value: "Structured Sharp" },
      { label: "Fashion Personality", value: "Boardroom Icon" },
    ],
  },
};

const DEFAULT_TRAITS: TraitSet = {
  photo: heroPortrait,
  traits: [
    { label: "Body Type", value: "Athletic" },
    { label: "Skin Tone", value: "Warm" },
    { label: "Style DNA", value: "Elegant Ethnic" },
    { label: "Preferred Fit", value: "Relaxed Tailored" },
    { label: "Fashion Personality", value: "Confident Minimalist" },
  ],
};

const stages = [
  "Detecting silhouette…",
  "Reading skin undertone…",
  "Mapping style DNA…",
  "Matching personality…",
  "Finalizing your mirror…",
];

export function Analysis({ profile }: { profile?: PickedProfile | null }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // restart analysis whenever the profile changes
  useEffect(() => {
    setProgress(0);
    setDone(false);
    const start = performance.now();
    const duration = 3500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / duration) * 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [profile?.name, profile?.persona, profile?.photo]);

  const data = useMemo<TraitSet>(() => {
    if (profile?.photo) {
      const base = profile.persona !== "custom" && profile.persona ? PERSONA_DATA[profile.persona] : DEFAULT_TRAITS;
      return { ...base, photo: profile.photo };
    }
    if (profile?.persona && profile.persona !== "custom") return PERSONA_DATA[profile.persona];
    return DEFAULT_TRAITS;
  }, [profile]);

  const stageIdx = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));

  return (
    <div className="space-y-5">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl glass-strong">
        <img src={data.photo} alt="AI body scan" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {!done && (
          <div className="scanline absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary/40 to-transparent blur-md" />
        )}
        {[
          "top-3 left-3 border-l-2 border-t-2",
          "top-3 right-3 border-r-2 border-t-2",
          "bottom-3 left-3 border-l-2 border-b-2",
          "bottom-3 right-3 border-r-2 border-b-2",
        ].map((c) => (
          <div key={c} className={`absolute h-5 w-5 border-gold/80 ${c}`} />
        ))}
        <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl px-4 py-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span>{done ? `✨ ${profile?.name ?? "Style DNA"} decoded` : stages[stageIdx]}</span>
            <span className="text-gold">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-gold"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {done && (
          <motion.div
            key={`${profile?.persona ?? "default"}-${profile?.photo ?? ""}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {data.traits.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl glass p-4"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t.label}</div>
                <div className="mt-1 font-display text-lg">{t.value}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
