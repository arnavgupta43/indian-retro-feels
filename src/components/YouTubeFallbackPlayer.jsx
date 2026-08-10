import { useEffect, useRef } from 'react';
import './YouTubeFallbackPlayer.css';

let apiPromise = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });

  return apiPromise;
}

// Only mounted when the Saavn API is entirely unreachable for a scene.
// Plays a single curated video on loop, hidden — it exists purely as an
// ambient audio fallback, not a video player.
export default function YouTubeFallbackPlayer({ videoId, isPlaying }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let destroyed = false;

    loadYouTubeApi().then((YT) => {
      if (destroyed || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: isPlayingRef.current ? 1 : 0,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            if (isPlayingRef.current) event.target.playVideo();
          },
        },
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player?.playVideo) return;
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying]);

  return <div className="youtube-fallback" ref={containerRef} />;
}
