export interface GameObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  solid: boolean;
  visible: boolean;
  active: boolean;
  
  update?(deltaTime: number): void;
  render?(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void;
  onCollision?(other: GameObject): void;
  destroy?(): void;
}

export class BaseGameObject implements GameObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  solid: boolean;
  visible: boolean;
  active: boolean;

  constructor(
    type: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.solid = true;
    this.visible = true;
    this.active = true;
  }

  update(deltaTime: number): void {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    // Simple colored rectangle for base rendering
    ctx.fillStyle = this.getColor();
    ctx.fillRect(screenX, screenY, this.width, this.height);
  }

  protected getColor(): string {
    switch (this.type) {
      case 'block': return '#8B4513';
      case 'enemy': return '#FF0000';
      case 'powerup': return '#FFD700';
      case 'coin': return '#FFA500';
      default: return '#808080';
    }
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  onCollision(other: GameObject): void {
    // Override in subclasses
  }

  destroy(): void {
    this.active = false;
    this.visible = false;
  }
}
