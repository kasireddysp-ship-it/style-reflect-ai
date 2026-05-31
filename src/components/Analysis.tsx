import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import heroPortrait from "@/assets/hero-portrait.jpg";

const traits = [
  { label: "Body Type", value: "Athletic" },
  { label: "Skin Tone", value: "Warm" },
  { label: "Style DNA", value: "Elegant Ethnic" },
  { label: "Preferred Fit", value: "Relaxed Tailored" },
  { label: "Fashion Personality", value: "Confident Minimalist" },
];

const stages = [
  "Detecting silhouette…",
  "Reading skin undertone…",
  "Mapping style DNA…",
  "Matching personality…",
  "Finalizing your mirror…",
];

export function Analysis() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 4000; // 4s to reach 100%
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
  }, []);

  const stageIdx = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));

  return (
    <div className="space-y-5">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl glass-strong">
        <img src={heroPortrait} alt="AI body scan" className="absolute inset-0 h-full w-full object-cover opacity-90" />
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
            <span>{done ? "✨ Style DNA decoded" : stages[stageIdx]}</span>
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

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {traits.map((t, i) => (
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
