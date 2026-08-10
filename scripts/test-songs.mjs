// Verifies that every curated song query resolves to a playable track on the
// JioSaavn unofficial API. Run with: node scripts/test-songs.mjs
// Reads the song list from scripts/song-list.json (scene -> array of queries).

import { readFile } from 'node:fs/promises';

const API_BASE = 'https://saavn.sumit.co/api';

async function testQuery(query) {
  const res = await fetch(`${API_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=1`);
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
  const json = await res.json();
  const song = json?.data?.results?.[0];
  if (!song) return { ok: false, reason: 'no results' };
  const downloadUrls = song.downloadUrl ?? [];
  const best = downloadUrls[downloadUrls.length - 1];
  if (!best?.url) return { ok: false, reason: 'no downloadUrl' };
  return {
    ok: true,
    name: song.name,
    year: song.year,
    artist: song.artists?.primary?.map((a) => a.name).join(', ') ?? '',
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const listPath = new URL('./song-list.json', import.meta.url);
  const sceneLists = JSON.parse(await readFile(listPath, 'utf8'));

  let total = 0;
  let failCount = 0;
  const failures = [];

  for (const [scene, queries] of Object.entries(sceneLists)) {
    console.log(`\n=== ${scene} (${queries.length}) ===`);
    for (const query of queries) {
      total += 1;
      const result = await testQuery(query);
      if (result.ok) {
        console.log(`  OK   "${query}" -> "${result.name}" (${result.year}) — ${result.artist}`);
      } else {
        failCount += 1;
        failures.push({ scene, query, reason: result.reason });
        console.log(`  FAIL "${query}" -> ${result.reason}`);
      }
      await sleep(120);
    }
  }

  console.log(`\n${total - failCount}/${total} queries resolved.`);
  if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  [${f.scene}] "${f.query}" — ${f.reason}`);
    }
    process.exitCode = 1;
  }
}

main();
