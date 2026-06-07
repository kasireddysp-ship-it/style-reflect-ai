import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tryon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { image, prompt } = (await request.json()) as { image: string; prompt: string };
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500 });
          if (!image || !prompt) return new Response(JSON.stringify({ error: "image and prompt required" }), { status: 400 });

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `Edit this photo so the SAME person is now wearing: ${prompt}. Keep the person's face, skin tone, hair, body shape, pose and background EXACTLY the same. Only replace the clothing. Make the new outfit look realistic, well-fitted and photographed in the same lighting. Output the edited photograph only.`,
                    },
                    { type: "image_url", image_url: { url: image } },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          });

          if (!upstream.ok) {
            const txt = await upstream.text();
            return new Response(JSON.stringify({ error: txt }), { status: upstream.status });
          }
          const data = (await upstream.json()) as {
            choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
          };
          const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (!url) return new Response(JSON.stringify({ error: "No image returned", raw: data }), { status: 502 });
          return new Response(JSON.stringify({ image: url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
        }
      },
    },
  },
});
