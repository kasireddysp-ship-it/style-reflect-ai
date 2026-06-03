import { motion } from "framer-motion";
import { useRef, useState } from "react";

export type PersonaKey = "wedding" | "college" | "professional" | "executive";

export type PickedProfile = {
  name: string;
  persona: PersonaKey | "custom";
  photo?: string; // object URL or undefined
};

const demos: { key: PersonaKey; name: string; emoji: string; tag: string }[] = [
  { key: "wedding", name: "Wedding Guest", emoji: "💍", tag: "Festive · Ethnic" },
  { key: "college", name: "College Student", emoji: "🎓", tag: "Trendy · Casual" },
  { key: "professional", name: "Young Professional", emoji: "💼", tag: "Smart · Modern" },
  { key: "executive", name: "Corporate Executive", emoji: "👔", tag: "Power · Luxe" },
];

export function UploadCard({ onPicked }: { onPicked?: (p: PickedProfile) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"selfie" | "fullbody" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedFile(file.name);
    setPicked(null);
    onPicked?.({ name: `Your photo`, persona: "custom", photo: `${url}#${Date.now()}` });
  };

  const triggerUpload = (type: "selfie" | "fullbody") => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={uploadType === "selfie" ? "user" : undefined}
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8 text-center">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full glass shadow-glow">
          {uploadedFile ? (
            <span className="text-3xl">✅</span>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
          )}
        </div>
        <p className="relative mt-4 font-display text-xl">
          {uploadedFile ? "Photo uploaded!" : "Upload your photo"}
        </p>
        <p className="relative mt-1 text-xs text-muted-foreground">
          {uploadedFile ? uploadedFile : "Selfie or full body · Encrypted & auto-deleted"}
        </p>
        <div className="relative mt-5 flex justify-center gap-2">
          <button
            onClick={() => triggerUpload("selfie")}
            className="rounded-full glass px-4 py-2 text-xs hover:border-primary/40 transition"
          >
            📷 Selfie
          </button>
          <button
            onClick={() => triggerUpload("fullbody")}
            className="rounded-full glass px-4 py-2 text-xs hover:border-primary/40 transition"
          >
            🧍 Full Body
          </button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Or try a demo profile</p>
        <div className="grid grid-cols-2 gap-3">
          {demos.map((d) => (
            <motion.button
              key={d.name}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setPicked(d.name);
                setUploadedFile(null);
                onPicked?.({ name: d.name, persona: d.key });
              }}
              className={`rounded-2xl p-4 text-left transition ${
                picked === d.name
                  ? "bg-gradient-primary shadow-glow"
                  : "glass hover:border-primary/40"
              }`}
            >
              <div className="text-2xl">{d.emoji}</div>
              <div className="mt-2 text-sm font-medium">{d.name}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{d.tag}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
