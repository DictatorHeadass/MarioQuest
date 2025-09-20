import { useEffect, useRef, useState } from "react";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import { GameEngine } from "../lib/game/GameEngine";

interface GameProps {
  levelId: number;
  onLevelComplete: () => void;
  onGameOver: () => void;
}

export default function Game({ levelId, onLevelComplete, onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { phase, start, end } = useGame();
  const { playSuccess } = useAudio();

  useEffect(() => {
    if (canvasRef.current) {
      gameEngineRef.current = new GameEngine(
        canvasRef.current,
        levelId,
        onLevelComplete,
        onGameOver
      );
      
      gameEngineRef.current.start();
      start();

      return () => {
        if (gameEngineRef.current) {
          gameEngineRef.current.stop();
        }
      };
    }
  }, [levelId, start, onLevelComplete, onGameOver]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GameCanvas ref={canvasRef} />
      <GameUI gameEngine={gameEngineRef.current} />
    </div>
  );
}
