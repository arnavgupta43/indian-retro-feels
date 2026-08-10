import { useEffect, useRef, useState } from 'react';
import { usePlaylist } from '../hooks/usePlaylist';
import YouTubeFallbackPlayer from './YouTubeFallbackPlayer';
import './PlayerBar.css';

const EQ_DELAYS = [0, 0.15, 0.3, 0.1];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlayerBar({ scene, isPlaying, onTogglePlay }) {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const { track, status, index, total, next, prev, allFailed } = usePlaylist(scene.songs);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // New track resolved: reset playback and resume if already running.
  useEffect(() => {
    const audio = audioRef.current;
    setProgress({ current: 0, duration: 0 });
    if (!audio || !track?.streamUrl) return;
    audio.load();
    if (isPlayingRef.current) {
      audio.play().catch(() => {});
    }
  }, [track?.streamUrl]);

  // Play/pause toggle on the current track.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.streamUrl) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, track?.streamUrl]);

  const isReady = status === 'ready' && !allFailed;
  const statusLabel = allFailed
    ? 'Saavn unreachable · streaming via YouTube'
    : status === 'loading'
      ? 'Finding the song…'
      : status === 'error'
        ? 'Skipping unavailable track…'
        : isPlaying
          ? 'Now playing · playlist loops'
          : 'Paused';

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !progress.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * progress.duration;
  };

  const canTogglePlay = allFailed || status !== 'loading';
  const progressPct = progress.duration ? (progress.current / progress.duration) * 100 : 0;

  return (
    <div className="player">
      {allFailed ? (
        <YouTubeFallbackPlayer videoId={scene.youtubeFallbackId} isPlaying={isPlaying} />
      ) : (
        track?.streamUrl && (
          <audio
            ref={audioRef}
            src={track.streamUrl}
            onEnded={next}
            onTimeUpdate={(e) => {
              const current = e.currentTarget.currentTime;
              setProgress((p) => ({ ...p, current }));
            }}
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration || 0;
              setProgress((p) => ({ ...p, duration }));
            }}
          />
        )
      )}

      <div className="player__row">
        <button
          type="button"
          className="player__nav"
          aria-label="Previous song"
          onClick={prev}
          disabled={allFailed}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 5h2v14H6zM20 5v14L9 12z" fill="currentColor" />
          </svg>
        </button>

        <button
          type="button"
          className="player__toggle"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          aria-pressed={isPlaying}
          onClick={onTogglePlay}
          disabled={!canTogglePlay}
        >
          {isPlaying ? (
            <svg width="14" height="16" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="4" height="14" fill="currentColor" />
              <rect x="8" y="0" width="4" height="14" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path d="M0 0L12 7L0 14V0Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="player__nav"
          aria-label="Next song"
          onClick={next}
          disabled={allFailed}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M16 5h2v14h-2zM4 5v14l11-7z" fill="currentColor" />
          </svg>
        </button>

        <div className="player__info">
          <div className="player__title">{allFailed ? scene.en : (track?.title ?? scene.songs[index])}</div>
          <div className="player__status">{statusLabel}</div>
        </div>

        <div className={`player__eq${isPlaying && (isReady || allFailed) ? ' is-playing' : ''}`}>
          {EQ_DELAYS.map((delay, i) => (
            <span key={i} style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
      </div>

      {!allFailed && (
        <div className="player__progress-row">
          <span className="player__time">{formatTime(progress.current)}</span>
          <div className="player__progress-track" onClick={handleSeek}>
            <div className="player__progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="player__time">{formatTime(progress.duration)}</span>
          <span className="player__count">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
