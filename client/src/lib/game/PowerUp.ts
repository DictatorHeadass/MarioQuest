import { BaseGameObject } from "./GameObject";

export class PowerUp extends BaseGameObject {
  powerType: string;
  speed: number;
  direction: number;
  emerging: boolean;
  emergeTimer: number;

  constructor(x: number, y: number, powerType: string) {
    super("powerup", x, y, 32, 32);
    this.powerType = powerType;
    this.speed = 80;
    this.direction = 1;
    this.emerging = true;
    this.emergeTimer = 0;
    this.velocityY = -100; // Start by moving up
  }

  update(deltaTime: number): void {
    if (this.emerging) {
      this.emergeTimer += deltaTime;
      if (this.emergeTimer > 500) {
        this.emerging = false;
        this.velocityY = 0;
      }
    } else {
      // Apply gravity (except for 1UP mushroom which floats)
      if (this.powerType !== "1up") {
        this.velocityY += 800 * deltaTime;
      }
      
      // Move horizontally
      this.velocityX = this.speed * this.direction;
    }
    
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    switch (this.powerType) {
      case "mushroom":
        // Super Mushroom (red with white spots)
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(screenX, screenY + 8, this.width, this.height - 8);
        ctx.fillStyle = "#FFDBAC";
        ctx.fillRect(screenX, screenY + 16, this.width, this.height - 16);
        // White spots
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(screenX + 8, screenY + 4, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 4, 6, 6);
        ctx.fillRect(screenX + 4, screenY + 12, 4, 4);
        ctx.fillRect(screenX + 24, screenY + 12, 4, 4);
        break;
        
      case "fireflower":
        // Fire Flower (orange with red petals)
        ctx.fillStyle = "#00AA00";
        ctx.fillRect(screenX + 14, screenY + 20, 4, 12);
        ctx.fillStyle = "#FF4500";
        // Petals
        ctx.fillRect(screenX + 8, screenY + 8, 8, 8);
        ctx.fillRect(screenX + 16, screenY + 8, 8, 8);
        ctx.fillRect(screenX + 8, screenY + 16, 8, 8);
        ctx.fillRect(screenX + 16, screenY + 16, 8, 8);
        // Center
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(screenX + 12, screenY + 12, 8, 8);
        break;
        
      case "1up":
        // 1UP Mushroom (green)
        ctx.fillStyle = "#00AA00";
        ctx.fillRect(screenX, screenY + 8, this.width, this.height - 8);
        ctx.fillStyle = "#FFDBAC";
        ctx.fillRect(screenX, screenY + 16, this.width, this.height - 16);
        // White spots
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(screenX + 8, screenY + 4, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 4, 6, 6);
        break;
        
      case "star":
        // Star (invincibility)
        ctx.fillStyle = "#FFD700";
        const centerX = screenX + this.width / 2;
        const centerY = screenY + this.height / 2;
        const points = 5;
        const outerRadius = 16;
        const innerRadius = 8;
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  onCollision(other: any): void {
    if (other.type === "block" || other.type === "enemy") {
      this.direction *= -1;
    } else if (other.type === "mario") {
      this.destroy();
    }
  }
}

export class Coin extends BaseGameObject {
  animationFrame: number;
  animationTimer: number;
  value: number;

  constructor(x: number, y: number) {
    super("coin", x, y, 24, 24);
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.value = 200; // Score value
    this.solid = false;
  }

  update(deltaTime: number): void {
    this.animationTimer += deltaTime;
    if (this.animationTimer > 200) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    // Draw coin with spinning animation
    const width = this.width * (1 - Math.abs(Math.sin(this.animationFrame * Math.PI / 2)) * 0.7);
    
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(screenX + (this.width - width) / 2, screenY, width, this.height);
    
    // Inner circle
    ctx.fillStyle = "#FFA500";
    ctx.fillRect(
      screenX + (this.width - width * 0.6) / 2,
      screenY + this.height * 0.2,
      width * 0.6,
      this.height * 0.6
    );
  }

  onCollision(other: any): void {
    if (other.type === "mario") {
      this.destroy();
    }
  }
}

export class Fireball extends BaseGameObject {
  bounces: number;
  maxBounces: number;
  lifeTimer: number;
  maxLife: number;

  constructor(x: number, y: number, direction: number) {
    super("fireball", x, y, 12, 12);
    this.velocityX = 200 * direction;
    this.velocityY = -200;
    this.bounces = 0;
    this.maxBounces = 3;
    this.lifeTimer = 0;
    this.maxLife = 3000;
    this.solid = false;
  }

  update(deltaTime: number): void {
    // Apply gravity
    this.velocityY += 800 * deltaTime;
    
    // Update lifetime
    this.lifeTimer += deltaTime;
    if (this.lifeTimer > this.maxLife) {
      this.destroy();
      return;
    }
    
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    // Draw fireball
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner glow
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  bounce(): void {
    this.bounces++;
    this.velocityY = -150;
    
    if (this.bounces >= this.maxBounces) {
      this.destroy();
    }
  }

  onCollision(other: any): void {
    if (other.type === "enemy") {
      this.destroy();
    } else if (other.type === "block" && other.blockType === "ground") {
      this.bounce();
    }
  }
}
