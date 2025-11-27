import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime
  const file = await env.ASSETS.fetch(new URL(request.url).origin + '/manifest.br')

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
