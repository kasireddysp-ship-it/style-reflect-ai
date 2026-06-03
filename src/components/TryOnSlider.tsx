import { useRef, useState } from "react";
import elegant from "@/assets/outfit-elegant.jpg";
import portrait from "@/assets/hero-portrait.jpg";
import type { Outfit } from "@/components/OutfitGallery";
import type { PickedProfile } from "@/components/UploadCard";

export function TryOnSlider({ profile, outfit }: { profile?: PickedProfile | null; outfit?: Outfit | null }) {
  const [pos, setPos] = useState(50);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const beforePhoto = profile?.photo ?? portrait;
  const afterPhoto = outfit?.image ?? elegant;
  const outfitName = outfit?.label ?? "AI Styled";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My MirrorMe AI Look", text: "Check out my AI-styled outfit!" });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons === 1) move(e.clientX); }}
        className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-3xl glass-strong touch-none"
      >
        <img src={beforePhoto} alt="Before" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={afterPhoto} alt="After" className="absolute inset-0 h-full w-full object-cover" style={{ width: `${10000 / Math.max(pos, 1)}%`, maxWidth: "none" }} />
          {profile?.photo && (
            <img src={beforePhoto} alt="Your photo blended with outfit" className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-luminosity" style={{ width: `${10000 / Math.max(pos, 1)}%`, maxWidth: "none" }} />
          )}
        </div>
        <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-gradient-gold shadow-gold" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center text-gold-foreground text-lg">
            ⇆
          </div>
        </div>
        <div className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-wider">Before</div>
        <div className="absolute right-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-[10px] uppercase tracking-wider text-primary-foreground">{outfitName}</div>
        {profile?.photo && (
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl glass px-3 py-2 text-xs">
            ✨ Simulated on your uploaded photo
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className={`flex-1 rounded-full py-3 text-sm transition ${saved ? "bg-gradient-gold text-gold-foreground shadow-gold" : "glass"}`}
        >
          {saved ? "✓ Saved!" : "💾 Save Look"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 rounded-full bg-gradient-primary py-3 text-sm font-medium text-primary-foreground shadow-glow transition active:scale-95"
        >
          {shared ? "🔗 Link copied!" : "↗ Share Look"}
        </button>
      </div>
    </div>
  );
}
