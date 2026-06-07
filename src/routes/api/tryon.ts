import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tryon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { image, prompt, referenceImageUrl } = (await request.json()) as {
            image: string;
            prompt: string;
            referenceImageUrl?: string;
          };
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return json({ error: "LOVABLE_API_KEY missing" }, 500);
          if (!image || !prompt) return json({ error: "image and prompt required" }, 400);

          // Fetch the reference garment server-side (avoids client CORS) and
          // convert to a data URL so Gemini receives the actual image.
          let refDataUrl: string | null = null;
          if (referenceImageUrl) {
            try {
              const r = await fetch(referenceImageUrl, {
                headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.myntra.com/" },
              });
              if (r.ok) {
                const buf = new Uint8Array(await r.arrayBuffer());
                const mime = r.headers.get("content-type") ?? "image/jpeg";
                let bin = "";
                for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
                refDataUrl = `data:${mime};base64,${btoa(bin)}`;
              }
            } catch {
              /* ignore — fall back to text prompt only */
            }
          }

          const userContent: Array<Record<string, unknown>> = [
            {
              type: "text",
              text: refDataUrl
                ? `Edit IMAGE 1 (a real person) so they are wearing the exact garment shown in IMAGE 2. Keep the person's face, skin tone, hair, body shape, pose and background EXACTLY the same. Replace only their clothing with the garment from IMAGE 2, matching its color, pattern, cut and length faithfully. Make fabric, folds and lighting look photorealistic. Output the edited photograph only. Style note: ${prompt}`
                : `Edit this photo so the SAME person is now wearing: ${prompt}. Keep face, skin tone, hair, body shape, pose and background EXACTLY the same. Only replace the clothing. Photorealistic. Output the edited photo only.`,
            },
            { type: "image_url", image_url: { url: image } },
          ];
          if (refDataUrl) userContent.push({ type: "image_url", image_url: { url: refDataUrl } });

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [{ role: "user", content: userContent }],
              modalities: ["image", "text"],
            }),
          });

          if (!upstream.ok) {
            const txt = await upstream.text();
            return json({ error: txt }, upstream.status);
          }
          const data = (await upstream.json()) as {
            choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
          };
          const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (!url) return json({ error: "No image returned", raw: data }, 502);
          return json({ image: url });
        } catch (e) {
          return json({ error: (e as Error).message }, 500);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
