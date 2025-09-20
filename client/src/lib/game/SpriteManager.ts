export class SpriteManager {
  private sprites: Map<string, HTMLImageElement>;
  private loadedSprites: Map<string, boolean>;

  constructor() {
    this.sprites = new Map();
    this.loadedSprites = new Map();
  }

  async loadSprite(name: string, path: string): Promise<HTMLImageElement> {
    if (this.sprites.has(name)) {
      return this.sprites.get(name)!;
    }

    const img = new Image();
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => {
        this.sprites.set(name, img);
        this.loadedSprites.set(name, true);
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${path}`);
        reject(new Error(`Failed to load sprite: ${path}`));
      };
    });

    img.src = path;
    return loadPromise;
  }

  getSprite(name: string): HTMLImageElement | null {
    return this.sprites.get(name) || null;
  }

  isLoaded(name: string): boolean {
    return this.loadedSprites.get(name) || false;
  }

  async loadAllSprites(): Promise<void> {
    const spriteDefinitions = [
      { name: "mario-small", path: "/sprites/mario-small.png" },
      { name: "mario-super", path: "/sprites/mario-super.png" },
      { name: "mario-fire", path: "/sprites/mario-fire.png" },
      { name: "goomba", path: "/sprites/goomba.png" },
      { name: "koopa", path: "/sprites/koopa.png" },
      { name: "blocks", path: "/sprites/blocks.png" },
      { name: "powerups", path: "/sprites/powerups.png" },
      { name: "fireball", path: "/sprites/fireball.png" }
    ];

    const loadPromises = spriteDefinitions.map(sprite => 
      this.loadSprite(sprite.name, sprite.path).catch(() => {
        console.warn(`Could not load sprite: ${sprite.name}`);
      })
    );

    await Promise.allSettled(loadPromises);
  }

  drawSprite(
    ctx: CanvasRenderingContext2D,
    spriteName: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    srcX?: number,
    srcY?: number,
    srcWidth?: number,
    srcHeight?: number
  ): void {
    const sprite = this.getSprite(spriteName);
    if (!sprite) {
      // Fallback to colored rectangle if sprite not loaded
      ctx.fillStyle = "#FF00FF"; // Magenta to indicate missing sprite
      ctx.fillRect(x, y, width || 32, height || 32);
      return;
    }

    if (srcX !== undefined && srcY !== undefined && srcWidth !== undefined && srcHeight !== undefined) {
      // Draw specific part of sprite sheet
      ctx.drawImage(
        sprite,
        srcX, srcY, srcWidth, srcHeight,
        x, y, width || srcWidth, height || srcHeight
      );
    } else {
      // Draw entire sprite
      ctx.drawImage(sprite, x, y, width || sprite.width, height || sprite.height);
    }
  }
}
