import './TopBar.css';

export default function TopBar({
  scenes,
  currentIndex,
  currentScene,
  dropdownOpen,
  onToggleDropdown,
  onSelectScene,
}) {
  return (
    <div className="topbar">
      <div className="topbar__brand">Smritiyaan</div>

      <div className="topbar__switcher">
        <button type="button" className="topbar__switcher-btn" onClick={onToggleDropdown}>
          <span className="topbar__switcher-index">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span>{currentScene.en}</span>
          <span className="topbar__switcher-arrow">{dropdownOpen ? '▲' : '▼'}</span>
        </button>

        {dropdownOpen && (
          <div className="topbar__dropdown">
            {scenes.map((scene, i) => (
              <div
                key={scene.key}
                className="topbar__dropdown-item"
                onClick={() => onSelectScene(i)}
              >
                <span className="topbar__dropdown-label">{String(i + 1).padStart(2, '0')}</span>
                <span className="topbar__dropdown-en">{scene.en}</span>
                <span className="topbar__dropdown-hi">{scene.hi}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
