import { createFileRoute } from "@tanstack/react-router";

// Resolves a Myntra product URL (or any product page) to { image, title, price }
// by reading the page's Open Graph meta tags. If the user passes a direct image
// URL, we just echo it back.
export const Route = createFileRoute("/api/myntra-product")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { url } = (await request.json()) as { url: string };
          if (!url || !/^https?:\/\//.test(url)) {
            return json({ error: "Provide a full https URL" }, 400);
          }

          // Direct image: just return it
          if (/\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url)) {
            return json({ image: url, title: "Custom image", price: null, productUrl: url });
          }

          const res = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
              Accept: "text/html,application/xhtml+xml",
            },
          });
          if (!res.ok) return json({ error: `Page returned ${res.status}. Try pasting the direct image URL instead.` }, 502);
          const html = await res.text();

          const meta = (prop: string) => {
            const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
            const m = html.match(re);
            return m?.[1] ?? null;
          };
          const metaAlt = (prop: string) => {
            const re = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i");
            const m = html.match(re);
            return m?.[1] ?? null;
          };

          const image = meta("og:image") ?? metaAlt("og:image") ?? meta("twitter:image") ?? metaAlt("twitter:image");
          const title = meta("og:title") ?? metaAlt("og:title") ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "Product";
          const price = meta("product:price:amount") ?? meta("og:price:amount") ?? null;

          if (!image) return json({ error: "Couldn't find a product image on that page. Paste the image URL directly." }, 422);
          return json({ image, title: title.trim(), price, productUrl: url });
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
