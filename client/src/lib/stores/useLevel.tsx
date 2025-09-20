import { create } from "zustand";
import { GameObject } from "../game/GameObject";

interface LevelState {
  currentLevel: number;
  gameObjects: GameObject[];
  enemies: GameObject[];
  blocks: GameObject[];
  powerUps: GameObject[];
  coins: GameObject[];
  particles: any[];
  cameraX: number;
  cameraY: number;
  levelWidth: number;
  levelHeight: number;
  
  // Actions
  setCurrentLevel: (level: number) => void;
  addGameObject: (obj: GameObject) => void;
  removeGameObject: (obj: GameObject) => void;
  updateGameObjects: (deltaTime: number) => void;
  setCameraPosition: (x: number, y: number) => void;
  clearLevel: () => void;
  initializeLevel: (levelData: any) => void;
}

export const useLevel = create<LevelState>((set, get) => ({
  currentLevel: 1,
  gameObjects: [],
  enemies: [],
  blocks: [],
  powerUps: [],
  coins: [],
  particles: [],
  cameraX: 0,
  cameraY: 0,
  levelWidth: 3200,
  levelHeight: 600,

  setCurrentLevel: (level) => set({ currentLevel: level }),

  addGameObject: (obj) => {
    const state = get();
    const newObjects = [...state.gameObjects, obj];
    
    // Also add to specific type arrays
    const updates: any = { gameObjects: newObjects };
    
    if (obj.type === 'enemy') {
      updates.enemies = [...state.enemies, obj];
    } else if (obj.type === 'block') {
      updates.blocks = [...state.blocks, obj];
    } else if (obj.type === 'powerup') {
      updates.powerUps = [...state.powerUps, obj];
    } else if (obj.type === 'coin') {
      updates.coins = [...state.coins, obj];
    }
    
    set(updates);
  },

  removeGameObject: (obj) => {
    const state = get();
    const newObjects = state.gameObjects.filter(o => o !== obj);
    
    const updates: any = { gameObjects: newObjects };
    
    if (obj.type === 'enemy') {
      updates.enemies = state.enemies.filter(o => o !== obj);
    } else if (obj.type === 'block') {
      updates.blocks = state.blocks.filter(o => o !== obj);
    } else if (obj.type === 'powerup') {
      updates.powerUps = state.powerUps.filter(o => o !== obj);
    } else if (obj.type === 'coin') {
      updates.coins = state.coins.filter(o => o !== obj);
    }
    
    set(updates);
  },

  updateGameObjects: (deltaTime) => {
    const state = get();
    state.gameObjects.forEach(obj => {
      if (obj.update) {
        obj.update(deltaTime);
      }
    });
  },

  setCameraPosition: (x, y) => set({ cameraX: x, cameraY: y }),

  clearLevel: () => set({
    gameObjects: [],
    enemies: [],
    blocks: [],
    powerUps: [],
    coins: [],
    particles: []
  }),

  initializeLevel: (levelData) => {
    // This will be called with level data to populate the level
    set({
      gameObjects: levelData.objects || [],
      enemies: levelData.enemies || [],
      blocks: levelData.blocks || [],
      powerUps: levelData.powerUps || [],
      coins: levelData.coins || [],
      levelWidth: levelData.width || 3200,
      levelHeight: levelData.height || 600
    });
  }
}));
