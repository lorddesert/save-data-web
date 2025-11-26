import { readFile } from 'node:fs/promises'
import type { APIRoute } from "astro";

export const GET = async ({ locals }) => {
  const { ASSETS } = locals
  const res = await ASSETS.fetch('/manifest.br')
//  const file = await readFile('public/manifest.br')

  return new Response(res, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'br',        // <-- critical
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
