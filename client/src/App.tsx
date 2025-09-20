import { useState } from "react";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import Game from "./components/Game";
import WorldMap from "./components/WorldMap";
import "@fontsource/inter";

function App() {
  const { phase } = useGame();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showWorldMap, setShowWorldMap] = useState(true);

  const handleLevelSelect = (levelId: number) => {
    setCurrentLevel(levelId);
    setShowWorldMap(false);
  };

  const handleLevelComplete = () => {
    setShowWorldMap(true);
    setCurrentLevel(null);
  };

  const handleGameOver = () => {
    setShowWorldMap(true);
    setCurrentLevel(null);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: '#5C94FC' // Sky blue background
    }}>
      {showWorldMap ? (
        <WorldMap onLevelSelect={handleLevelSelect} />
      ) : (
        <Game 
          levelId={currentLevel!}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
        />
      )}
    </div>
  );
}

export default App;
