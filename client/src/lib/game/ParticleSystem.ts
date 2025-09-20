interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: boolean;
}

export class ParticleSystem {
  particles: Particle[];

  constructor() {
    this.particles = [];
  }

  createParticle(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    life: number,
    color: string,
    size: number = 2,
    gravity: boolean = true
  ): void {
    this.particles.push({
      x,
      y,
      velocityX,
      velocityY,
      life,
      maxLife: life,
      color,
      size,
      gravity
    });
  }

  createExplosion(x: number, y: number, color: string = "#FFD700", count: number = 8): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 100 + Math.random() * 50;
      this.createParticle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        1000 + Math.random() * 500,
        color,
        2 + Math.random() * 2
      );
    }
  }

  createCoinEffect(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.createParticle(
        x + Math.random() * 20 - 10,
        y + Math.random() * 20 - 10,
        (Math.random() - 0.5) * 100,
        -Math.random() * 100 - 50,
        800 + Math.random() * 400,
        "#FFD700",
        3,
        true
      );
    }
  }

  createJumpEffect(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      this.createParticle(
        x + Math.random() * 32,
        y + 32,
        (Math.random() - 0.5) * 50,
        Math.random() * 20,
        300 + Math.random() * 200,
        "#CCCCCC",
        1,
        false
      );
    }
  }

  createBlockBreakEffect(x: number, y: number): void {
    const colors = ["#8B4513", "#A0522D", "#654321"];
    for (let i = 0; i < 12; i++) {
      this.createParticle(
        x + 16 + Math.random() * 16 - 8,
        y + 16 + Math.random() * 16 - 8,
        (Math.random() - 0.5) * 200,
        -Math.random() * 150 - 50,
        1000 + Math.random() * 500,
        colors[Math.floor(Math.random() * colors.length)],
        2 + Math.random() * 2
      );
    }
  }

  update(deltaTime: number): void {
    this.particles = this.particles.filter(particle => {
      // Update position
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;

      // Apply gravity
      if (particle.gravity) {
        particle.velocityY += 500 * deltaTime;
      }

      // Update life
      particle.life -= deltaTime;

      // Remove dead particles
      return particle.life > 0;
    });
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    this.particles.forEach(particle => {
      const screenX = particle.x - cameraX;
      const screenY = particle.y - cameraY;

      // Calculate alpha based on remaining life
      const alpha = particle.life / particle.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }

  clear(): void {
    this.particles = [];
  }
}
