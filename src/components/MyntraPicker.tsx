import { useState } from "react";
import type { Outfit } from "@/components/OutfitGallery";

const PRESETS = [
  "https://www.myntra.com/kurta-sets/anouk/anouk-women-yellow--green-floral-printed-kurta-with-palazzos--dupatta/15749614/buy",
  "https://www.myntra.com/kurta-sets/inddus/inddus-green-floral-printed-kurta-with-trousers--dupatta/14299876/buy",
  "https://www.myntra.com/lehenga-choli/kalini/kalini-green-mirror-work-semi-stitched-lehenga--unstitched-blouse-with-dupatta/19293266/buy",
];

type Fetched = { image: string; title: string; price: string | null; productUrl: string };

export function MyntraPicker({ onPick }: { onPick: (outfit: Outfit) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<Fetched | null>(null);

  const fetchProduct = async (target: string) => {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/myntra-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't fetch product");
      setResult(data);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const useThis = () => {
    if (!result) return;
    const outfit: Outfit = {
      id: `myntra-${Date.now()}`,
      label: result.title.replace(/\s*-?\s*Buy.*$/i, "").slice(0, 80),
      image: result.image,
      price: result.price ? `₹${result.price}` : "Myntra",
      scores: { style: 95, occasion: 95, comfort: 90, trend: 96 },
      accent: "from-gold/30 to-transparent",
      reason: `Real Myntra pick — try this exact dress on your photo.`,
      best: "From Myntra",
      colors: { primary: "#c2185b", secondary: "#f48fb1", trim: "#f8d36a" },
      pattern: "floral",
      silhouette: "kurta",
      // extra fields consumed by TryOnSlider:
      referenceImageUrl: result.image,
      productUrl: result.productUrl,
    } as Outfit & { referenceImageUrl: string; productUrl: string };
    onPick(outfit);
    document.getElementById("tryon")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-3 rounded-3xl glass-strong p-4">
      <div>
        <div className="font-display text-lg leading-tight">Pick a real Myntra dress</div>
        <p className="text-[11px] text-muted-foreground">Paste any Myntra product URL — we'll grab the image and try it on you.</p>
      </div>
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.myntra.com/..."
          className="flex-1 rounded-full glass px-4 py-2 text-xs outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={() => url && fetchProduct(url)}
          disabled={loading || !url}
          className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-glow disabled:opacity-50"
        >
          {loading ? "…" : "Fetch"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p}
            onClick={() => { setUrl(p); fetchProduct(p); }}
            className="rounded-full glass px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            Example {i + 1}
          </button>
        ))}
      </div>
      {err && <p className="rounded-2xl glass px-3 py-2 text-xs text-destructive">{err}</p>}
      {result && (
        <div className="flex gap-3 rounded-2xl glass p-3">
          <img src={result.image} alt={result.title} className="h-24 w-20 shrink-0 rounded-xl object-cover" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="line-clamp-2 text-xs font-medium">{result.title}</div>
              {result.price && <div className="text-[11px] text-gold">₹{result.price}</div>}
            </div>
            <button onClick={useThis} className="self-start rounded-full bg-gradient-gold px-3 py-1.5 text-[11px] font-medium text-gold-foreground shadow-gold">
              Try this on me →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
