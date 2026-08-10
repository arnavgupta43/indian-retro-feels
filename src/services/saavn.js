// Unofficial JioSaavn API (github.com/sumitkolhe/jiosaavn-api).
// The old saavn.dev deployment is dead — this is the current live host.
const SAAVN_API_BASE = 'https://saavn.sumit.co/api';

export async function searchSong(query) {
  const res = await fetch(`${SAAVN_API_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=1`);
  if (!res.ok) {
    throw new Error(`Saavn search failed: ${res.status}`);
  }

  const json = await res.json();
  const song = json?.data?.results?.[0];
  if (!song) {
    throw new Error(`No song found for "${query}"`);
  }

  const downloadUrls = song.downloadUrl ?? [];
  const best = downloadUrls[downloadUrls.length - 1] ?? downloadUrls[0];
  if (!best?.url) {
    throw new Error(`No playable stream for "${query}"`);
  }

  return {
    id: song.id,
    title: song.name,
    artist: song.artists?.primary?.map((a) => a.name).join(', ') ?? '',
    streamUrl: best.url,
  };
}
