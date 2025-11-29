export const prerender = false
import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import { readFile } from 'node:fs/promises';
import path from 'path';

async function getManifest() {
  const publicDirectoryPath = path.join(process.cwd(), 'public');
  const filePath = path.join(publicDirectoryPath, 'manifest.br');
  const file = await readFile(filePath);

  return file;
}


export const GET: APIRoute = async ({ request, locals }) => {

  const manifest = await getManifest();

  if (!manifest) {
    return new Response("Manifest not found", { status: 404 });
  }

  return new Response(manifest, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'br',        // <-- critical
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
