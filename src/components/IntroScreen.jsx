import './IntroScreen.css';

export default function IntroScreen({ onBegin }) {
  return (
    <div className="intro">
      <div className="intro__devanagari">स्मृतियाँ</div>
      <div className="intro__title">A Nostalgia Trip</div>
      <div className="intro__subtitle">
        Six small rooms from an Indian childhood.
        <br />
        Pick one below, and let it play.
      </div>
      <button type="button" className="intro__begin" onClick={onBegin}>
        BEGIN&nbsp;→
      </button>
    </div>
  );
}
