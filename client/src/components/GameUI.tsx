import { useEffect, useState } from "react";
import { GameEngine } from "../lib/game/GameEngine";

interface GameUIProps {
  gameEngine: GameEngine | null;
}

export default function GameUI({ gameEngine }: GameUIProps) {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(400);
  const [world, setWorld] = useState("1-1");

  useEffect(() => {
    if (!gameEngine) return;

    const updateUI = () => {
      setScore(gameEngine.getScore());
      setCoins(gameEngine.getCoins());
      setLives(gameEngine.getLives());
      setTimeLeft(gameEngine.getTimeLeft());
      setWorld(gameEngine.getWorld());
    };

    const interval = setInterval(updateUI, 100);
    return () => clearInterval(interval);
  }, [gameEngine]);

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#FFF',
      fontSize: '18px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      background: 'rgba(0,0,0,0.3)',
      padding: '10px',
      borderRadius: '8px'
    }}>
      <div>MARIO</div>
      <div>{score.toString().padStart(6, '0')}</div>
      <div>⭐×{coins.toString().padStart(2, '0')}</div>
      <div>WORLD</div>
      <div>{world}</div>
      <div>TIME</div>
      <div>{timeLeft.toString().padStart(3, '0')}</div>
      <div>LIVES</div>
      <div>×{lives}</div>
    </div>
  );
}
