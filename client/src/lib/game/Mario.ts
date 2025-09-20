import { BaseGameObject } from "./GameObject";
import { MarioPowerState } from "../stores/useMario";

export class Mario extends BaseGameObject {
  powerState: MarioPowerState;
  facing: "left" | "right";
  isOnGround: boolean;
  isRunning: boolean;
  isDucking: boolean;
  isInvincible: boolean;
  animationFrame: number;
  animationTimer: number;
  jumpPower: number;
  runSpeed: number;
  walkSpeed: number;
  invincibilityTimer: number;

  constructor(x: number, y: number) {
    super("mario", x, y, 32, 32);
    this.powerState = "small";
    this.facing = "right";
    this.isOnGround = false;
    this.isRunning = false;
    this.isDucking = false;
    this.isInvincible = false;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.jumpPower = -400;
    this.runSpeed = 200;
    this.walkSpeed = 120;
    this.invincibilityTimer = 0;
    this.solid = false; // Mario doesn't block other objects
  }

  update(deltaTime: number): void {
    // Update invincibility
    if (this.isInvincible) {
      this.invincibilityTimer -= deltaTime;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }

    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer > 150) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }

    // Apply gravity
    if (!this.isOnGround) {
      this.velocityY += 1200 * deltaTime; // Gravity
    }

    // Update position
    super.update(deltaTime);

    // Update size based on power state
    this.updateSize();
  }

  private updateSize(): void {
    switch (this.powerState) {
      case "small":
        this.width = 32;
        this.height = 32;
        break;
      case "super":
      case "fire":
        this.width = 32;
        this.height = 64;
        break;
    }
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (!this.visible) return;
    
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;
    
    // Flash when invincible
    if (this.isInvincible && Math.floor(this.invincibilityTimer / 100) % 2 === 0) {
      return;
    }

    // Draw Mario based on power state
    ctx.fillStyle = this.getMarioColor();
    ctx.fillRect(screenX, screenY, this.width, this.height);

    // Draw face (simple representation)
    ctx.fillStyle = "#FFDBAC"; // Skin color
    const faceSize = this.width * 0.6;
    ctx.fillRect(
      screenX + (this.width - faceSize) / 2,
      screenY + 4,
      faceSize,
      faceSize
    );

    // Draw hat
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      screenX + 2,
      screenY,
      this.width - 4,
      8
    );
  }

  private getMarioColor(): string {
    switch (this.powerState) {
      case "small":
        return "#FF0000"; // Red
      case "super":
        return "#FF0000"; // Red
      case "fire":
        return "#FFFFFF"; // White with red accents
      default:
        return "#FF0000";
    }
  }

  jump(): void {
    if (this.isOnGround) {
      this.velocityY = this.jumpPower;
      this.isOnGround = false;
    }
  }

  moveLeft(deltaTime: number): void {
    this.facing = "left";
    const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
    this.velocityX = -speed;
  }

  moveRight(deltaTime: number): void {
    this.facing = "right";
    const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
    this.velocityX = speed;
  }

  stop(): void {
    this.velocityX = 0;
  }

  duck(): void {
    if (this.powerState !== "small" && this.isOnGround) {
      this.isDucking = true;
      this.height = 32;
    }
  }

  standUp(): void {
    this.isDucking = false;
    this.updateSize();
  }

  powerUp(): void {
    if (this.powerState === "small") {
      this.powerState = "super";
    } else if (this.powerState === "super") {
      this.powerState = "fire";
    }
    this.updateSize();
  }

  takeDamage(): void {
    if (this.isInvincible) return;

    if (this.powerState === "fire") {
      this.powerState = "super";
      this.isInvincible = true;
      this.invincibilityTimer = 2000;
    } else if (this.powerState === "super") {
      this.powerState = "small";
      this.isInvincible = true;
      this.invincibilityTimer = 2000;
    } else {
      // Mario dies
      this.destroy();
    }
    this.updateSize();
  }

  shootFireball(): void {
    if (this.powerState === "fire") {
      // Create fireball - this would be handled by the game engine
      console.log("Shooting fireball!");
    }
  }

  onCollision(other: any): void {
    if (other.type === "enemy" && !this.isInvincible) {
      this.takeDamage();
    } else if (other.type === "powerup") {
      this.powerUp();
    } else if (other.type === "coin") {
      // Coin collection handled by game engine
    }
  }
}
