export class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  smoothing: number;
  levelWidth: number;
  levelHeight: number;
  offsetX: number;
  offsetY: number;

  constructor(width: number, height: number, levelWidth: number, levelHeight: number) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothing = 0.1;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.offsetX = width * 0.3; // Keep Mario 30% from left edge
    this.offsetY = height * 0.7; // Keep Mario 70% from top
  }

  follow(target: { x: number; y: number; width: number; height: number }, deltaTime: number): void {
    // Calculate desired camera position
    this.targetX = target.x + target.width / 2 - this.offsetX;
    this.targetY = target.y + target.height / 2 - this.offsetY;

    // Clamp camera to level boundaries
    this.targetX = Math.max(0, Math.min(this.levelWidth - this.width, this.targetX));
    this.targetY = Math.max(0, Math.min(this.levelHeight - this.height, this.targetY));

    // Smooth camera movement
    const lerpFactor = 1 - Math.pow(1 - this.smoothing, deltaTime * 60);
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;

    // Prevent camera from moving backwards (classic Mario behavior)
    if (this.x < this.targetX) {
      this.x = this.targetX;
    }
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  isInView(object: { x: number; y: number; width: number; height: number }): boolean {
    return (
      object.x + object.width > this.x &&
      object.x < this.x + this.width &&
      object.y + object.height > this.y &&
      object.y < this.y + this.height
    );
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y
    };
  }
}
