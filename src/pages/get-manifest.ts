import { readFile } from 'node:fs/promises'


export async function GET() {
  const file = await readFile('public/manifest.br');

  return new Response(file, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'br',        // <-- critical
      'Cache-Control': 'public, max-age=3600'
    }
  });
}