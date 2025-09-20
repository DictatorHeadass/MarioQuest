import { BaseGameObject } from "./GameObject";

export class Block extends BaseGameObject {
  blockType: string;
  contents: string | null;
  isHit: boolean;
  bounceTimer: number;

  constructor(x: number, y: number, blockType: string, contents: string | null = null) {
    super("block", x, y, 32, 32);
    this.blockType = blockType;
    this.contents = contents;
    this.isHit = false;
    this.bounceTimer = 0;
  }

  update(deltaTime: number): void {
    if (this.bounceTimer > 0) {
      this.bounceTimer -= deltaTime;
    }
    super.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    let screenY = this.y - cameraY;
    
    // Bounce effect when hit
    if (this.bounceTimer > 0) {
      screenY -= Math.sin((this.bounceTimer / 200) * Math.PI) * 5;
    }
    
    // Draw based on block type
    switch (this.blockType) {
      case "brick":
        ctx.fillStyle = this.isHit ? "#654321" : "#8B4513";
        ctx.fillRect(screenX, screenY, this.width, this.height);
        // Brick pattern
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 1;
        for (let i = 0; i < this.width; i += 8) {
          ctx.beginPath();
          ctx.moveTo(screenX + i, screenY);
          ctx.lineTo(screenX + i, screenY + this.height);
          ctx.stroke();
        }
        for (let j = 0; j < this.height; j += 8) {
          ctx.beginPath();
          ctx.moveTo(screenX, screenY + j);
          ctx.lineTo(screenX + this.width, screenY + j);
          ctx.stroke();
        }
        break;
        
      case "question":
        if (this.isHit) {
          // Empty block
          ctx.fillStyle = "#654321";
        } else {
          // Question block
          ctx.fillStyle = "#FFD700";
        }
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        if (!this.isHit) {
          // Draw question mark
          ctx.fillStyle = "#000";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillText("?", screenX + this.width / 2, screenY + this.height / 2 + 7);
        }
        break;
        
      case "ground":
        ctx.fillStyle = "#228B22";
        ctx.fillRect(screenX, screenY, this.width, this.height);
        break;
        
      case "pipe":
        ctx.fillStyle = "#00AA00";
        ctx.fillRect(screenX, screenY, this.width, this.height);
        // Pipe details
        ctx.fillStyle = "#006600";
        ctx.fillRect(screenX + 4, screenY, 4, this.height);
        ctx.fillRect(screenX + this.width - 8, screenY, 4, this.height);
        break;
    }
  }

  hit(): any {
    if (this.isHit && this.blockType === "question") {
      return null; // Already hit
    }
    
    this.isHit = true;
    this.bounceTimer = 200;
    
    if (this.blockType === "brick") {
      // Brick blocks can be destroyed when Mario is powered up
      this.destroy();
      return "destroyed";
    } else if (this.blockType === "question" && this.contents) {
      const item = this.contents;
      this.contents = null;
      return item;
    }
    
    return null;
  }
}

export class Flagpole extends BaseGameObject {
  flagHeight: number;

  constructor(x: number, y: number, height: number = 320) {
    super("flagpole", x, y, 16, height);
    this.flagHeight = height;
    this.solid = false;
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    // Draw pole
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(screenX + 6, screenY, 4, this.height);
    
    // Draw flag
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(screenX + 10, screenY + 20, 24, 16);
    
    // Flag details
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(screenX + 12, screenY + 22, 8, 4);
    ctx.fillRect(screenX + 12, screenY + 30, 8, 4);
  }
}
