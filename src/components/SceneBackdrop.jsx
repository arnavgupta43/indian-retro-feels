import { useEffect, useState } from 'react';
import './SceneBackdrop.css';

export default function SceneBackdrop({ image, hue }) {
  const [imageOk, setImageOk] = useState(false);

  useEffect(() => {
    if (!image) {
      setImageOk(false);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setImageOk(true);
    img.onerror = () => !cancelled && setImageOk(false);
    img.src = image;
    return () => {
      cancelled = true;
    };
  }, [image]);

  const stripe = `oklch(0.9 0.03 ${hue})`;
  const stripe2 = `oklch(0.82 0.04 ${hue})`;

  const backgroundStyle = imageOk
    ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `repeating-linear-gradient(135deg, ${stripe}, ${stripe} 14px, ${stripe2} 14px, ${stripe2} 28px)` };

  return (
    <>
      <div className="scene-backdrop" style={backgroundStyle} />
      <div className="scene-backdrop__gradient" />
    </>
  );
}
