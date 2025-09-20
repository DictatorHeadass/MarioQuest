import { useState, useEffect } from "react";
import { useGameState } from "../lib/stores/useGameState";

interface WorldMapProps {
  onLevelSelect: (levelId: number) => void;
}

export default function WorldMap({ onLevelSelect }: WorldMapProps) {
  const { completedLevels, currentWorld } = useGameState();
  const [selectedLevel, setSelectedLevel] = useState(1);

  const levels = [
    { id: 1, name: "World 1-1", x: 100, y: 400 },
    { id: 2, name: "World 1-2", x: 250, y: 350 },
    { id: 3, name: "World 1-3", x: 400, y: 300 },
    { id: 4, name: "World 1-4", x: 550, y: 250 },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && selectedLevel < levels.length) {
        if (completedLevels.includes(selectedLevel) || selectedLevel === 1) {
          setSelectedLevel(selectedLevel + 1);
        }
      } else if (e.key === "ArrowLeft" && selectedLevel > 1) {
        setSelectedLevel(selectedLevel - 1);
      } else if (e.key === "Enter") {
        if (selectedLevel === 1 || completedLevels.includes(selectedLevel - 1)) {
          onLevelSelect(selectedLevel);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedLevel, completedLevels, onLevelSelect]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
        textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
      }}>
        SUPER MARIO BROS 3
      </div>

      {/* Level nodes */}
      {levels.map((level) => {
        const isCompleted = completedLevels.includes(level.id);
        const isAvailable = level.id === 1 || completedLevels.includes(level.id - 1);
        const isSelected = selectedLevel === level.id;

        return (
          <div key={level.id} style={{
            position: 'absolute',
            left: level.x,
            top: level.y,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isCompleted ? '#32CD32' : isAvailable ? '#FFD700' : '#808080',
            border: isSelected ? '4px solid #FF0000' : '2px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {level.id}
          </div>
        );
      })}

      {/* Path lines between levels */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}>
        {levels.slice(0, -1).map((level, index) => {
          const nextLevel = levels[index + 1];
          return (
            <line
              key={`path-${level.id}`}
              x1={level.x + 30}
              y1={level.y + 30}
              x2={nextLevel.x + 30}
              y2={nextLevel.y + 30}
              stroke="#8B4513"
              strokeWidth="8"
              strokeDasharray="10,5"
            />
          );
        })}
      </svg>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#333',
        fontSize: '18px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
      }}>
        Use ARROW KEYS to select level • ENTER to start
      </div>
    </div>
  );
}
