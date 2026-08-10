import { useEffect, useRef, useState } from 'react';
import { searchSong } from '../services/saavn';

const AUTO_SKIP_DELAY_MS = 2500;

// Fetches the current song in a playlist, starting from a random track each
// time the playlist changes, then exposes next/prev to move through it in
// order (wrapping around after the last song back to the first). Auto-skips
// a song that fails to resolve. If every song in the list fails in a row
// (systemic API outage rather than one bad track), `allFailed` flips true so
// the caller can switch to a fallback playback source.
export function usePlaylist(songs) {
  const [index, setIndex] = useState(0);
  const [track, setTrack] = useState(null);
  const [status, setStatus] = useState('idle');
  const [allFailed, setAllFailed] = useState(false);
  const failureStreak = useRef(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * songs.length));
    failureStreak.current = 0;
    setAllFailed(false);
  }, [songs]);

  useEffect(() => {
    const query = songs[index];
    if (!query) return;

    let cancelled = false;
    setStatus('loading');
    setTrack(null);

    searchSong(query)
      .then((result) => {
        if (cancelled) return;
        failureStreak.current = 0;
        setTrack(result);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
        failureStreak.current += 1;
        if (failureStreak.current >= songs.length) {
          setAllFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [songs, index]);

  const next = () => setIndex((i) => (i + 1) % songs.length);
  const prev = () => setIndex((i) => (i - 1 + songs.length) % songs.length);

  useEffect(() => {
    if (status !== 'error' || allFailed) return;
    const timer = setTimeout(next, AUTO_SKIP_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, allFailed]);

  return { track, status, index, total: songs.length, next, prev, allFailed };
}
