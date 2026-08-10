import { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import SceneBackdrop from './components/SceneBackdrop';
import TopBar from './components/TopBar';
import SceneCaption from './components/SceneCaption';
import PlayerBar from './components/PlayerBar';
import { scenes } from './data/scenes';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentScene = scenes[currentIndex];

  return (
    <div className="stage">
      {showIntro && (
        <IntroScreen
          onBegin={() => {
            setShowIntro(false);
            setIsPlaying(true);
          }}
        />
      )}

      <SceneBackdrop image={currentScene.image} hue={currentScene.hue} />

      <TopBar
        scenes={scenes}
        currentIndex={currentIndex}
        currentScene={currentScene}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen((open) => !open)}
        onSelectScene={(i) => {
          setCurrentIndex(i);
          setDropdownOpen(false);
        }}
      />

      <SceneCaption scene={currentScene} indexLabel={String(currentIndex + 1).padStart(2, '0')} />

      <PlayerBar
        scene={currentScene}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((playing) => !playing)}
      />
    </div>
  );
}

export default App;
