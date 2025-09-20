import { BaseGameObject } from "./GameObject";

export class Goomba extends BaseGameObject {
  speed: number;
  direction: number;
  isDead: boolean;
  deathTimer: number;

  constructor(x: number, y: number) {
    super("enemy", x, y, 32, 32);
    this.speed = 50;
    this.direction = -1; // Start moving left
    this.isDead = false;
    this.deathTimer = 0;
  }

  update(deltaTime: number): void {
    if (this.isDead) {
      this.deathTimer += deltaTime;
      if (this.deathTimer > 500) {
        this.destroy();
      }
      return;
    }

    this.velocityX = this.speed * this.direction;
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    if (this.isDead) {
      // Draw flattened Goomba
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX, screenY + this.height - 8, this.width, 8);
    } else {
      // Draw normal Goomba
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(screenX, screenY, this.width, this.height);
      
      // Eyes
      ctx.fillStyle = "#000";
      ctx.fillRect(screenX + 8, screenY + 8, 4, 4);
      ctx.fillRect(screenX + 20, screenY + 8, 4, 4);
    }
  }

  die(): void {
    this.isDead = true;
    this.velocityX = 0;
    this.solid = false;
  }

  onCollision(other: any): void {
    if (other.type === "block" || other.type === "enemy") {
      this.direction *= -1; // Turn around
    }
  }
}

export class KoopaTroopa extends BaseGameObject {
  speed: number;
  direction: number;
  isInShell: boolean;
  shellSpeed: number;
  reviveTimer: number;

  constructor(x: number, y: number) {
    super("enemy", x, y, 32, 48);
    this.speed = 60;
    this.direction = -1;
    this.isInShell = false;
    this.shellSpeed = 0;
    this.reviveTimer = 0;
  }

  update(deltaTime: number): void {
    if (this.isInShell) {
      this.velocityX = this.shellSpeed;
      this.reviveTimer += deltaTime;
      
      // Revive after 5 seconds if not moving
      if (this.shellSpeed === 0 && this.reviveTimer > 5000) {
        this.revive();
      }
    } else {
      this.velocityX = this.speed * this.direction;
    }
    
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    if (this.isInShell) {
      // Draw green shell
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(screenX, screenY + 16, this.width, 32);
    } else {
      // Draw Koopa body
      ctx.fillStyle = "#00AA00";
      ctx.fillRect(screenX, screenY, this.width, this.height);
      
      // Shell
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(screenX + 4, screenY + 20, this.width - 8, 24);
    }
  }

  retreat(): void {
    this.isInShell = true;
    this.height = 32;
    this.shellSpeed = 0;
    this.reviveTimer = 0;
  }

  kick(direction: number): void {
    if (this.isInShell) {
      this.shellSpeed = 200 * direction;
    }
  }

  revive(): void {
    this.isInShell = false;
    this.height = 48;
    this.shellSpeed = 0;
    this.reviveTimer = 0;
  }

  onCollision(other: any): void {
    if (other.type === "block" || other.type === "enemy") {
      if (this.isInShell && this.shellSpeed !== 0) {
        // Shell bounces off walls
        this.shellSpeed *= -1;
      } else {
        this.direction *= -1;
      }
    }
  }
}
