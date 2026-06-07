import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/hero-portrait.jpg";
import { DressArt, type Outfit } from "@/components/OutfitGallery";
import type { PickedProfile } from "@/components/UploadCard";

async function toDataUrl(src: string): Promise<string> {
  if (src.startsWith("data:")) return src;
  const res = await fetch(src);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export function TryOnSlider({ profile, outfit }: { profile?: PickedProfile | null; outfit?: Outfit | null }) {
  const [pos, setPos] = useState(50);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [aiPhoto, setAiPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const beforePhoto = profile?.photo ?? portrait;
  const outfitName = outfit?.label ?? "AI Styled";

  // Reset AI image when outfit or photo changes
  useEffect(() => {
    setAiPhoto(null);
    setErr(null);
  }, [outfit?.id, profile?.photo]);

  const generate = async () => {
    if (!outfit || !profile?.photo) {
      setErr("Upload your photo and pick a dress first.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const image = await toDataUrl(profile.photo);
      const prompt = `${outfit.label} — a ${outfit.silhouette} in ${outfit.colors.primary} with ${outfit.colors.secondary} accents and ${outfit.pattern} detailing, ${outfit.colors.trim} trim. ${outfit.reason}`;
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, prompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.image) throw new Error(data.error || "Generation failed");
      setAiPhoto(data.image);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: "My MirrorMe AI Look", text: "Check out my AI-styled outfit!" }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(window.location.href); setShared(true); setTimeout(() => setShared(false), 2000); }
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
        {/* Right: original photo */}
        <img src={beforePhoto} alt="Your photo" className="absolute inset-0 h-full w-full object-cover" />
        {/* Left: AI try-on if available, else fallback DressArt sketch */}
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div className="absolute inset-0" style={{ width: `${10000 / Math.max(pos, 1)}%`, maxWidth: "none" }}>
            {aiPhoto ? (
              <img src={aiPhoto} alt="AI try-on" className="h-full w-full object-cover" />
            ) : outfit ? (
              <DressArt outfit={outfit} photo={beforePhoto} compact />
            ) : (
              <img src={beforePhoto} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="absolute bottom-16 left-3 right-3 flex items-center gap-2 rounded-2xl glass-strong p-2">
            <div className="text-[11px] leading-tight">
              <div className="text-gold">{aiPhoto ? "AI try-on" : "Preview"}</div>
              <div className="font-medium">{outfitName}</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-gradient-gold shadow-gold" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center text-gold-foreground text-lg">⇆</div>
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-[10px] uppercase tracking-wider text-primary-foreground">On you</div>
        <div className="absolute right-3 top-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-wider">Original</div>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <div className="mt-3 text-xs text-muted-foreground">Dressing you in {outfitName}…</div>
          </div>
        )}
      </div>

      <button
        onClick={generate}
        disabled={loading || !outfit || !profile?.photo}
        className="w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-gold-foreground shadow-gold transition active:scale-95 disabled:opacity-50"
      >
        {loading ? "Generating realistic try-on…" : aiPhoto ? "✨ Regenerate try-on" : "✨ Generate realistic try-on"}
      </button>
      {err && <p className="rounded-2xl glass px-3 py-2 text-xs text-destructive">{err}</p>}
      {!profile?.photo && <p className="text-center text-xs text-muted-foreground">Upload your photo above to enable AI try-on.</p>}

      <div className="flex gap-3">
        <button onClick={handleSave} className={`flex-1 rounded-full py-3 text-sm transition ${saved ? "bg-gradient-gold text-gold-foreground shadow-gold" : "glass"}`}>
          {saved ? "✓ Saved!" : "💾 Save Look"}
        </button>
        <button onClick={handleShare} className="flex-1 rounded-full bg-gradient-primary py-3 text-sm font-medium text-primary-foreground shadow-glow transition active:scale-95">
          {shared ? "🔗 Link copied!" : "↗ Share Look"}
        </button>
      </div>
    </div>
  );
}
