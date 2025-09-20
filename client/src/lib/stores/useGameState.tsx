import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameStateStore {
  score: number;
  coins: number;
  lives: number;
  timeLeft: number;
  currentWorld: string;
  completedLevels: number[];
  gameStarted: boolean;
  isPaused: boolean;

  // Actions
  addScore: (points: number) => void;
  addCoin: () => void;
  loseLive: () => void;
  addLive: () => void;
  setTimeLeft: (time: number) => void;
  setCurrentWorld: (world: string) => void;
  completeLevel: (levelId: number) => void;
  resetGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

export const useGameState = create<GameStateStore>()(
  persist(
    (set, get) => ({
      score: 0,
      coins: 0,
      lives: 3,
      timeLeft: 400,
      currentWorld: "1-1",
      completedLevels: [],
      gameStarted: false,
      isPaused: false,

      addScore: (points) => {
        set((state) => ({ score: state.score + points }));
      },

      addCoin: () => {
        set((state) => {
          const newCoins = state.coins + 1;
          let newLives = state.lives;
          
          // Give extra life every 100 coins
          if (newCoins % 100 === 0) {
            newLives += 1;
          }
          
          return { coins: newCoins, lives: newLives };
        });
      },

      loseLive: () => {
        set((state) => ({ lives: Math.max(0, state.lives - 1) }));
      },

      addLive: () => {
        set((state) => ({ lives: state.lives + 1 }));
      },

      setTimeLeft: (time) => set({ timeLeft: time }),

      setCurrentWorld: (world) => set({ currentWorld: world }),

      completeLevel: (levelId) => {
        set((state) => {
          if (!state.completedLevels.includes(levelId)) {
            return { completedLevels: [...state.completedLevels, levelId] };
          }
          return state;
        });
      },

      resetGame: () => set({
        score: 0,
        coins: 0,
        lives: 3,
        timeLeft: 400,
        currentWorld: "1-1",
        gameStarted: false,
        isPaused: false
      }),

      startGame: () => set({ gameStarted: true, isPaused: false }),

      pauseGame: () => set({ isPaused: true }),

      resumeGame: () => set({ isPaused: false })
    }),
    {
      name: "mario-game-state",
      partialize: (state) => ({
        completedLevels: state.completedLevels,
        score: state.score
      })
    }
  )
);
