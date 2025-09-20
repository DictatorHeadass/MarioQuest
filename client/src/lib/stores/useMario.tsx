import { create } from "zustand";

export type MarioPowerState = "small" | "super" | "fire";

interface MarioState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  powerState: MarioPowerState;
  facing: "left" | "right";
  isOnGround: boolean;
  isRunning: boolean;
  isDucking: boolean;
  isInvincible: boolean;
  animationFrame: number;
  animationTimer: number;

  // Actions
  setPowerState: (state: MarioPowerState) => void;
  setPosition: (x: number, y: number) => void;
  setVelocity: (vx: number, vy: number) => void;
  setFacing: (direction: "left" | "right") => void;
  setOnGround: (onGround: boolean) => void;
  setRunning: (running: boolean) => void;
  setDucking: (ducking: boolean) => void;
  setInvincible: (invincible: boolean) => void;
  updateAnimation: (deltaTime: number) => void;
  takeDamage: () => void;
  reset: () => void;
}

export const useMario = create<MarioState>((set, get) => ({
  x: 100,
  y: 500,
  velocityX: 0,
  velocityY: 0,
  powerState: "small",
  facing: "right",
  isOnGround: false,
  isRunning: false,
  isDucking: false,
  isInvincible: false,
  animationFrame: 0,
  animationTimer: 0,

  setPowerState: (state) => set({ powerState: state }),
  setPosition: (x, y) => set({ x, y }),
  setVelocity: (velocityX, velocityY) => set({ velocityX, velocityY }),
  setFacing: (facing) => set({ facing }),
  setOnGround: (isOnGround) => set({ isOnGround }),
  setRunning: (isRunning) => set({ isRunning }),
  setDucking: (isDucking) => set({ isDucking }),
  setInvincible: (isInvincible) => set({ isInvincible }),

  updateAnimation: (deltaTime) => {
    const state = get();
    const newTimer = state.animationTimer + deltaTime;
    if (newTimer > 150) { // Change frame every 150ms
      set({
        animationFrame: (state.animationFrame + 1) % 4,
        animationTimer: 0
      });
    } else {
      set({ animationTimer: newTimer });
    }
  },

  takeDamage: () => {
    const state = get();
    if (state.isInvincible) return;

    if (state.powerState === "fire") {
      set({ powerState: "super", isInvincible: true });
    } else if (state.powerState === "super") {
      set({ powerState: "small", isInvincible: true });
    } else {
      // Mario dies - this should be handled by the game engine
      console.log("Mario died!");
    }

    // Remove invincibility after 2 seconds
    setTimeout(() => {
      set({ isInvincible: false });
    }, 2000);
  },

  reset: () => set({
    x: 100,
    y: 500,
    velocityX: 0,
    velocityY: 0,
    powerState: "small",
    facing: "right",
    isOnGround: false,
    isRunning: false,
    isDucking: false,
    isInvincible: false,
    animationFrame: 0,
    animationTimer: 0
  })
}));
