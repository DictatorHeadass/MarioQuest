import { GameObject } from "./GameObject";

export class CollisionDetector {
  checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    return (
      bounds1.left < bounds2.right &&
      bounds1.right > bounds2.left &&
      bounds1.top < bounds2.bottom &&
      bounds1.bottom > bounds2.top
    );
  }

  getCollisionSide(obj1: GameObject, obj2: GameObject): string | null {
    if (!this.checkCollision(obj1, obj2)) return null;

    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    // Calculate overlap on each side
    const overlapLeft = bounds1.right - bounds2.left;
    const overlapRight = bounds2.right - bounds1.left;
    const overlapTop = bounds1.bottom - bounds2.top;
    const overlapBottom = bounds2.bottom - bounds1.top;

    // Find the smallest overlap
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapLeft) return "right";
    if (minOverlap === overlapRight) return "left";
    if (minOverlap === overlapTop) return "bottom";
    if (minOverlap === overlapBottom) return "top";

    return null;
  }

  resolveCollision(obj1: GameObject, obj2: GameObject): void {
    const side = this.getCollisionSide(obj1, obj2);
    if (!side || !obj2.solid) return;

    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    switch (side) {
      case "top":
        obj1.y = bounds2.top - obj1.height;
        if (obj1.velocityY > 0) obj1.velocityY = 0;
        break;
      case "bottom":
        obj1.y = bounds2.bottom;
        if (obj1.velocityY < 0) obj1.velocityY = 0;
        break;
      case "left":
        obj1.x = bounds2.left - obj1.width;
        if (obj1.velocityX > 0) obj1.velocityX = 0;
        break;
      case "right":
        obj1.x = bounds2.right;
        if (obj1.velocityX < 0) obj1.velocityX = 0;
        break;
    }
  }

  checkPointInRect(x: number, y: number, rect: GameObject): boolean {
    const bounds = rect.getBounds();
    return (
      x >= bounds.left &&
      x <= bounds.right &&
      y >= bounds.top &&
      y <= bounds.bottom
    );
  }

  getDistance(obj1: GameObject, obj2: GameObject): number {
    const center1 = {
      x: obj1.x + obj1.width / 2,
      y: obj1.y + obj1.height / 2
    };
    const center2 = {
      x: obj2.x + obj2.width / 2,
      y: obj2.y + obj2.height / 2
    };

    const dx = center2.x - center1.x;
    const dy = center2.y - center1.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  checkCircleCollision(
    x1: number, y1: number, radius1: number,
    x2: number, y2: number, radius2: number
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius1 + radius2;
  }
}
