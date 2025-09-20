import { Mario } from "./Mario";
import { Camera } from "./Camera";
import { CollisionDetector } from "./CollisionDetector";
import { ParticleSystem } from "./ParticleSystem";
import { SpriteManager } from "./SpriteManager";
import { GameObject } from "./GameObject";
import { Block, Flagpole } from "./Block";
import { Goomba, KoopaTroopa } from "./Enemy";
import { PowerUp, Coin, Fireball } from "./PowerUp";
import { LevelData } from "./LevelData";
import { useGameState } from "../stores/useGameState";
import { useAudio } from "../stores/useAudio";

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mario: Mario;
  camera: Camera;
  collisionDetector: CollisionDetector;
  particleSystem: ParticleSystem;
  spriteManager: SpriteManager;
  
  gameObjects: GameObject[];
  enemies: GameObject[];
  blocks: GameObject[];
  powerUps: GameObject[];
  coins: GameObject[];
  fireballs: Fireball[];
  
  isRunning: boolean;
  lastTime: number;
  levelId: number;
  levelData: any;
  
  // Input handling
  keys: { [key: string]: boolean };
  
  // Game state
  score: number;
  coinCount: number;
  lives: number;
  timeLeft: number;
  world: string;
  gameStartTime: number;
  
  // Callbacks
  onLevelComplete: () => void;
  onGameOver: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    levelId: number,
    onLevelComplete: () => void,
    onGameOver: () => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.levelId = levelId;
    this.onLevelComplete = onLevelComplete;
    this.onGameOver = onGameOver;
    
    // Initialize game systems
    this.camera = new Camera(800, 600, 3200, 600);
    this.collisionDetector = new CollisionDetector();
    this.particleSystem = new ParticleSystem();
    this.spriteManager = new SpriteManager();
    
    // Initialize Mario
    this.mario = new Mario(100, 500);
    
    // Initialize collections
    this.gameObjects = [];
    this.enemies = [];
    this.blocks = [];
    this.powerUps = [];
    this.coins = [];
    this.fireballs = [];
    
    // Initialize game state
    this.score = 0;
    this.coinCount = 0;
    this.lives = 3;
    this.timeLeft = 400;
    this.world = `1-${levelId}`;
    this.gameStartTime = 0;
    
    // Initialize input
    this.keys = {};
    this.setupInput();
    
    // Load level
    this.loadLevel();
    
    this.isRunning = false;
    this.lastTime = 0;
  }

  setupInput(): void {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      
      // Handle special keys
      if (e.code === "Space" && this.mario.powerState === "fire") {
        this.shootFireball();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  loadLevel(): void {
    this.levelData = LevelData.getLevel(this.levelId);
    
    // Clear existing objects
    this.gameObjects = [];
    this.enemies = [];
    this.blocks = [];
    this.powerUps = [];
    this.coins = [];
    
    // Create ground
    for (let x = 0; x < this.levelData.width; x += 32) {
      const groundBlock = new Block(x, 568, "ground");
      this.addGameObject(groundBlock);
    }
    
    // Create level objects from data
    this.levelData.blocks.forEach((blockData: any) => {
      const block = new Block(blockData.x, blockData.y, blockData.type, blockData.contents);
      this.addGameObject(block);
    });
    
    this.levelData.enemies.forEach((enemyData: any) => {
      let enemy;
      if (enemyData.type === "goomba") {
        enemy = new Goomba(enemyData.x, enemyData.y);
      } else if (enemyData.type === "koopa") {
        enemy = new KoopaTroopa(enemyData.x, enemyData.y);
      }
      if (enemy) {
        this.addGameObject(enemy);
      }
    });
    
    this.levelData.coins.forEach((coinData: any) => {
      const coin = new Coin(coinData.x, coinData.y);
      this.addGameObject(coin);
    });
    
    // Add flagpole at the end
    const flagpole = new Flagpole(this.levelData.width - 100, 248);
    this.addGameObject(flagpole);
  }

  addGameObject(obj: GameObject): void {
    this.gameObjects.push(obj);
    
    switch (obj.type) {
      case "enemy":
        this.enemies.push(obj);
        break;
      case "block":
        this.blocks.push(obj);
        break;
      case "powerup":
        this.powerUps.push(obj);
        break;
      case "coin":
        this.coins.push(obj);
        break;
    }
  }

  removeGameObject(obj: GameObject): void {
    this.gameObjects = this.gameObjects.filter(o => o !== obj);
    this.enemies = this.enemies.filter(o => o !== obj);
    this.blocks = this.blocks.filter(o => o !== obj);
    this.powerUps = this.powerUps.filter(o => o !== obj);
    this.coins = this.coins.filter(o => o !== obj);
  }

  shootFireball(): void {
    if (this.mario.powerState === "fire") {
      const direction = this.mario.facing === "right" ? 1 : -1;
      const fireball = new Fireball(
        this.mario.x + (direction > 0 ? this.mario.width : 0),
        this.mario.y + this.mario.height / 2,
        direction
      );
      this.fireballs.push(fireball);
    }
  }

  handleInput(deltaTime: number): void {
    let moving = false;
    
    // Horizontal movement
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      this.mario.moveLeft(deltaTime);
      moving = true;
    } else if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      this.mario.moveRight(deltaTime);
      moving = true;
    } else {
      this.mario.stop();
    }
    
    // Running
    this.mario.isRunning = this.keys["ShiftLeft"] || this.keys["ShiftRight"];
    
    // Jumping
    if (this.keys["Space"] || this.keys["ArrowUp"] || this.keys["KeyW"]) {
      this.mario.jump();
    }
    
    // Ducking
    if (this.keys["ArrowDown"] || this.keys["KeyS"]) {
      this.mario.duck();
    } else {
      this.mario.standUp();
    }
  }

  update(deltaTime: number): void {
    if (!this.isRunning) return;
    
    // Update timer
    this.timeLeft -= deltaTime / 1000;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.mario.takeDamage(); // Time up = death
    }
    
    // Handle input
    this.handleInput(deltaTime);
    
    // Update Mario
    this.mario.update(deltaTime);
    
    // Apply gravity to Mario
    if (!this.mario.isOnGround) {
      this.mario.velocityY += 1200 * deltaTime;
    }
    
    // Update game objects
    this.gameObjects.forEach(obj => {
      if (obj.active && obj.update) {
        obj.update(deltaTime);
      }
    });
    
    // Update fireballs
    this.fireballs = this.fireballs.filter(fireball => {
      if (fireball.active) {
        fireball.update(deltaTime);
        return true;
      }
      return false;
    });
    
    // Handle collisions
    this.handleCollisions();
    
    // Update camera
    this.camera.follow(this.mario, deltaTime);
    
    // Update particles
    this.particleSystem.update(deltaTime);
    
    // Remove inactive objects
    this.gameObjects = this.gameObjects.filter(obj => obj.active);
    this.enemies = this.enemies.filter(obj => obj.active);
    this.blocks = this.blocks.filter(obj => obj.active);
    this.powerUps = this.powerUps.filter(obj => obj.active);
    this.coins = this.coins.filter(obj => obj.active);
    
    // Check win condition
    if (this.mario.x > this.levelData.width - 150) {
      this.completeLevel();
    }
    
    // Check lose condition
    if (this.mario.y > 600 || this.lives <= 0) {
      this.gameOver();
    }
  }

  handleCollisions(): void {
    // Mario vs blocks
    this.blocks.forEach(block => {
      if (this.collisionDetector.checkCollision(this.mario, block)) {
        this.handleMarioBlockCollision(this.mario, block);
      }
    });
    
    // Mario vs enemies
    this.enemies.forEach(enemy => {
      if (this.collisionDetector.checkCollision(this.mario, enemy)) {
        this.handleMarioEnemyCollision(this.mario, enemy);
      }
    });
    
    // Mario vs powerups
    this.powerUps.forEach(powerup => {
      if (this.collisionDetector.checkCollision(this.mario, powerup)) {
        this.collectPowerUp(powerup);
      }
    });
    
    // Mario vs coins
    this.coins.forEach(coin => {
      if (this.collisionDetector.checkCollision(this.mario, coin)) {
        this.collectCoin(coin);
      }
    });
    
    // Fireballs vs enemies
    this.fireballs.forEach(fireball => {
      this.enemies.forEach(enemy => {
        if (this.collisionDetector.checkCollision(fireball, enemy)) {
          this.handleFireballEnemyCollision(fireball, enemy);
        }
      });
    });
    
    // Enemies vs blocks (for turning around)
    this.enemies.forEach(enemy => {
      this.blocks.forEach(block => {
        if (this.collisionDetector.checkCollision(enemy, block)) {
          if (enemy.onCollision) {
            enemy.onCollision(block);
          }
        }
      });
    });
  }

  handleMarioBlockCollision(mario: Mario, block: Block): void {
    const collision = this.collisionDetector.getCollisionSide(mario, block);
    
    switch (collision) {
      case "bottom":
        mario.y = block.y + block.height;
        mario.velocityY = Math.max(0, mario.velocityY);
        // Hit block from below
        if (block.blockType === "brick" || block.blockType === "question") {
          const item = block.hit();
          if (item) {
            this.spawnPowerUp(block.x, block.y - 32, item);
          }
        }
        break;
        
      case "top":
        mario.y = block.y - mario.height;
        mario.velocityY = 0;
        mario.isOnGround = true;
        break;
        
      case "left":
        mario.x = block.x - mario.width;
        mario.velocityX = 0;
        break;
        
      case "right":
        mario.x = block.x + block.width;
        mario.velocityX = 0;
        break;
    }
  }

  handleMarioEnemyCollision(mario: Mario, enemy: any): void {
    const collision = this.collisionDetector.getCollisionSide(mario, enemy);
    
    if (collision === "top" && mario.velocityY > 0) {
      // Mario jumped on enemy
      if (enemy instanceof Goomba) {
        enemy.die();
        this.addScore(100);
        mario.velocityY = -200; // Bounce
      } else if (enemy instanceof KoopaTroopa) {
        if (!enemy.isInShell) {
          enemy.retreat();
          this.addScore(100);
          mario.velocityY = -200;
        } else {
          // Kick shell
          const direction = mario.x < enemy.x ? 1 : -1;
          enemy.kick(direction);
          mario.velocityY = -200;
        }
      }
    } else {
      // Mario hit enemy from side
      mario.takeDamage();
      if (!mario.active) {
        this.lives--;
        if (this.lives <= 0) {
          this.gameOver();
        } else {
          this.respawnMario();
        }
      }
    }
  }

  handleFireballEnemyCollision(fireball: Fireball, enemy: any): void {
    fireball.destroy();
    if (enemy instanceof Goomba) {
      enemy.die();
      this.addScore(100);
    } else if (enemy instanceof KoopaTroopa) {
      enemy.retreat();
      this.addScore(100);
    }
  }

  collectPowerUp(powerup: PowerUp): void {
    powerup.destroy();
    
    switch (powerup.powerType) {
      case "mushroom":
        if (this.mario.powerState === "small") {
          this.mario.powerUp();
          this.addScore(1000);
        }
        break;
        
      case "fireflower":
        this.mario.powerState = "fire";
        this.addScore(1000);
        break;
        
      case "1up":
        this.lives++;
        break;
        
      case "star":
        // Implement invincibility
        this.addScore(1000);
        break;
    }
  }

  collectCoin(coin: Coin): void {
    coin.destroy();
    this.coinCount++;
    this.addScore(coin.value);
    
    // Extra life every 100 coins
    if (this.coinCount % 100 === 0) {
      this.lives++;
    }
  }

  spawnPowerUp(x: number, y: number, type: string): void {
    let powerup;
    if (type === "mushroom" || type === "fireflower" || type === "1up" || type === "star") {
      powerup = new PowerUp(x, y, type);
    } else if (type === "coin") {
      powerup = new Coin(x, y);
    }
    
    if (powerup) {
      this.addGameObject(powerup);
    }
  }

  addScore(points: number): void {
    this.score += points;
  }

  respawnMario(): void {
    this.mario = new Mario(100, 500);
    this.camera.setPosition(0, 0);
  }

  completeLevel(): void {
    this.isRunning = false;
    
    // Time bonus
    const timeBonus = Math.floor(this.timeLeft) * 50;
    this.addScore(timeBonus);
    
    // Mark level as completed
    const gameState = useGameState.getState();
    gameState.completeLevel(this.levelId);
    
    this.onLevelComplete();
  }

  gameOver(): void {
    this.isRunning = false;
    this.onGameOver();
  }

  start(): void {
    this.isRunning = true;
    this.gameStartTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  gameLoop = (currentTime: number = 0): void => {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (deltaTime > 0) {
      this.update(deltaTime);
      this.render();
    }
    
    requestAnimationFrame(this.gameLoop);
  };

  render(): void {
    // Clear canvas
    this.ctx.fillStyle = "#5C94FC"; // Sky blue
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render game objects
    this.gameObjects.forEach(obj => {
      if (obj.visible && this.camera.isInView(obj)) {
        obj.render(this.ctx, this.camera.x, this.camera.y);
      }
    });
    
    // Render Mario
    this.mario.render(this.ctx, this.camera.x, this.camera.y);
    
    // Render fireballs
    this.fireballs.forEach(fireball => {
      if (this.camera.isInView(fireball)) {
        fireball.render(this.ctx, this.camera.x, this.camera.y);
      }
    });
    
    // Render particles
    this.particleSystem.render(this.ctx, this.camera.x, this.camera.y);
  }

  // Getter methods for UI
  getScore(): number { return this.score; }
  getCoins(): number { return this.coinCount; }
  getLives(): number { return this.lives; }
  getTimeLeft(): number { return Math.max(0, Math.floor(this.timeLeft)); }
  getWorld(): string { return this.world; }
}
