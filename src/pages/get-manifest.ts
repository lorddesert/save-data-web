import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises'

function isCloudflareWorkers() {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

export const GET: APIRoute = async ({ request, locals }) => {
  //   const { ASSETS } = locals
  //   const res = await ASSETS.fetch('/manifest.br')
  //  const file = await readFile('public/manifest.br')



  if (isCloudflareWorkers()) {
    const { env } = locals.runtime;
    const url = new URL(request.url).origin + '/manifest.br'

    const res = await env.ASSETS.fetch(url)

    return new Response(res.body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Encoding': 'br',        // <-- critical
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // 🖥️ local dev fallback
  const file = await readFile("public/manifest.br");

  if (!file) {
    return new Response("Manifest not found", { status: 404 });
  }

  return new Response(file, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'br',        // <-- critical
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
