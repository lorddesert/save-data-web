export const prerender = false
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {

  const res = await fetch(`http://localhost:4321/manifest.br`)

  if (!res.ok) {
    return new Response("Manifest not found", { status: 404 });
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'br',        // <-- critical
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
