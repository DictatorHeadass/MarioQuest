export class LevelData {
  static getLevel(levelId: number): any {
    const levels = {
      1: {
        width: 3200,
        height: 600,
        blocks: [
          // Question blocks with powerups
          { x: 256, y: 400, type: "question", contents: "mushroom" },
          { x: 352, y: 400, type: "question", contents: "coin" },
          { x: 448, y: 400, type: "question", contents: "coin" },
          { x: 544, y: 400, type: "question", contents: "fireflower" },
          
          // Brick blocks
          { x: 320, y: 400, type: "brick" },
          { x: 384, y: 400, type: "brick" },
          { x: 416, y: 400, type: "brick" },
          { x: 480, y: 400, type: "brick" },
          
          // Platforms
          { x: 800, y: 450, type: "brick" },
          { x: 832, y: 450, type: "brick" },
          { x: 864, y: 450, type: "brick" },
          
          { x: 1200, y: 350, type: "brick" },
          { x: 1232, y: 350, type: "brick" },
          { x: 1264, y: 350, type: "brick" },
          { x: 1296, y: 350, type: "brick" },
          
          // Pipes
          { x: 1600, y: 536, type: "pipe" },
          { x: 1600, y: 504, type: "pipe" },
          { x: 1632, y: 536, type: "pipe" },
          { x: 1632, y: 504, type: "pipe" },
          
          { x: 2000, y: 472, type: "pipe" },
          { x: 2000, y: 504, type: "pipe" },
          { x: 2000, y: 536, type: "pipe" },
          { x: 2032, y: 472, type: "pipe" },
          { x: 2032, y: 504, type: "pipe" },
          { x: 2032, y: 536, type: "pipe" },
          
          // End castle area
          { x: 2800, y: 500, type: "brick" },
          { x: 2832, y: 500, type: "brick" },
          { x: 2864, y: 500, type: "brick" },
          { x: 2896, y: 500, type: "brick" },
          { x: 2928, y: 500, type: "brick" },
          { x: 2960, y: 500, type: "brick" },
        ],
        enemies: [
          { x: 400, y: 536, type: "goomba" },
          { x: 600, y: 536, type: "goomba" },
          { x: 900, y: 536, type: "koopa" },
          { x: 1400, y: 536, type: "goomba" },
          { x: 1800, y: 536, type: "goomba" },
          { x: 2200, y: 536, type: "koopa" },
          { x: 2600, y: 536, type: "goomba" },
        ],
        coins: [
          { x: 300, y: 500 },
          { x: 500, y: 500 },
          { x: 700, y: 500 },
          { x: 1100, y: 500 },
          { x: 1300, y: 280 },
          { x: 1332, y: 280 },
          { x: 1500, y: 500 },
          { x: 1900, y: 500 },
          { x: 2300, y: 500 },
          { x: 2500, y: 500 },
        ]
      },
      
      2: {
        width: 3200,
        height: 600,
        blocks: [
          // Underground theme with more challenging layout
          { x: 200, y: 450, type: "brick" },
          { x: 232, y: 450, type: "brick" },
          { x: 264, y: 450, type: "brick" },
          { x: 296, y: 450, type: "question", contents: "mushroom" },
          { x: 328, y: 450, type: "brick" },
          
          // Staircase
          { x: 600, y: 500, type: "brick" },
          { x: 632, y: 468, type: "brick" },
          { x: 664, y: 436, type: "brick" },
          { x: 696, y: 404, type: "question", contents: "fireflower" },
          { x: 728, y: 436, type: "brick" },
          { x: 760, y: 468, type: "brick" },
          { x: 792, y: 500, type: "brick" },
          
          // Gap jumping section
          { x: 1200, y: 400, type: "brick" },
          { x: 1400, y: 350, type: "brick" },
          { x: 1432, y: 350, type: "question", contents: "coin" },
          { x: 1464, y: 350, type: "brick" },
          { x: 1600, y: 400, type: "brick" },
          
          // Multiple levels
          { x: 2000, y: 300, type: "brick" },
          { x: 2032, y: 300, type: "brick" },
          { x: 2064, y: 300, type: "question", contents: "1up" },
          { x: 2096, y: 300, type: "brick" },
          
          { x: 2000, y: 450, type: "brick" },
          { x: 2032, y: 450, type: "brick" },
          { x: 2064, y: 450, type: "brick" },
          { x: 2096, y: 450, type: "brick" },
        ],
        enemies: [
          { x: 350, y: 536, type: "goomba" },
          { x: 500, y: 536, type: "koopa" },
          { x: 850, y: 536, type: "goomba" },
          { x: 1050, y: 536, type: "goomba" },
          { x: 1250, y: 536, type: "koopa" },
          { x: 1700, y: 536, type: "goomba" },
          { x: 1900, y: 536, type: "goomba" },
          { x: 2200, y: 536, type: "koopa" },
          { x: 2400, y: 536, type: "goomba" },
        ],
        coins: [
          { x: 250, y: 380 },
          { x: 650, y: 350 },
          { x: 750, y: 350 },
          { x: 1250, y: 330 },
          { x: 1450, y: 280 },
          { x: 1650, y: 330 },
          { x: 2050, y: 230 },
          { x: 2050, y: 380 },
        ]
      },
      
      3: {
        width: 3200,
        height: 600,
        blocks: [
          // Sky level with clouds (represented as floating platforms)
          { x: 300, y: 450, type: "brick" },
          { x: 332, y: 450, type: "brick" },
          { x: 364, y: 450, type: "question", contents: "mushroom" },
          
          { x: 600, y: 350, type: "brick" },
          { x: 632, y: 350, type: "brick" },
          { x: 664, y: 350, type: "question", contents: "fireflower" },
          { x: 696, y: 350, type: "brick" },
          
          { x: 900, y: 280, type: "brick" },
          { x: 932, y: 280, type: "question", contents: "coin" },
          { x: 964, y: 280, type: "brick" },
          
          { x: 1300, y: 400, type: "brick" },
          { x: 1332, y: 400, type: "brick" },
          { x: 1364, y: 400, type: "brick" },
          { x: 1396, y: 400, type: "question", contents: "star" },
          { x: 1428, y: 400, type: "brick" },
          
          { x: 1800, y: 320, type: "brick" },
          { x: 1832, y: 320, type: "brick" },
          { x: 1864, y: 320, type: "brick" },
          
          { x: 2200, y: 250, type: "brick" },
          { x: 2232, y: 250, type: "question", contents: "1up" },
          { x: 2264, y: 250, type: "brick" },
          
          // Final challenge area
          { x: 2800, y: 450, type: "brick" },
          { x: 2832, y: 450, type: "brick" },
          { x: 2864, y: 400, type: "brick" },
          { x: 2896, y: 350, type: "brick" },
          { x: 2928, y: 300, type: "brick" },
          { x: 2960, y: 250, type: "question", contents: "fireflower" },
        ],
        enemies: [
          { x: 450, y: 536, type: "goomba" },
          { x: 750, y: 536, type: "koopa" },
          { x: 1050, y: 536, type: "goomba" },
          { x: 1150, y: 536, type: "goomba" },
          { x: 1550, y: 536, type: "koopa" },
          { x: 1950, y: 536, type: "goomba" },
          { x: 2350, y: 536, type: "koopa" },
          { x: 2650, y: 536, type: "goomba" },
        ],
        coins: [
          { x: 400, y: 380 },
          { x: 650, y: 280 },
          { x: 950, y: 210 },
          { x: 1350, y: 330 },
          { x: 1850, y: 250 },
          { x: 2000, y: 500 },
          { x: 2250, y: 180 },
          { x: 2500, y: 500 },
        ]
      },
      
      4: {
        width: 3200,
        height: 600,
        blocks: [
          // Castle level - final boss area
          { x: 200, y: 500, type: "brick" },
          { x: 232, y: 500, type: "brick" },
          { x: 264, y: 500, type: "brick" },
          { x: 296, y: 500, type: "question", contents: "mushroom" },
          
          // Castle towers
          { x: 800, y: 200, type: "brick" },
          { x: 832, y: 200, type: "brick" },
          { x: 864, y: 200, type: "brick" },
          { x: 896, y: 200, type: "brick" },
          
          { x: 800, y: 232, type: "brick" },
          { x: 896, y: 232, type: "brick" },
          
          { x: 800, y: 264, type: "brick" },
          { x: 896, y: 264, type: "brick" },
          
          { x: 800, y: 296, type: "brick" },
          { x: 832, y: 296, type: "question", contents: "fireflower" },
          { x: 864, y: 296, type: "question", contents: "fireflower" },
          { x: 896, y: 296, type: "brick" },
          
          // Bridge
          { x: 1400, y: 450, type: "brick" },
          { x: 1432, y: 450, type: "brick" },
          { x: 1464, y: 450, type: "brick" },
          { x: 1496, y: 450, type: "brick" },
          { x: 1528, y: 450, type: "brick" },
          { x: 1560, y: 450, type: "brick" },
          { x: 1592, y: 450, type: "brick" },
          { x: 1624, y: 450, type: "brick" },
          
          // Final castle
          { x: 2500, y: 300, type: "brick" },
          { x: 2532, y: 300, type: "brick" },
          { x: 2564, y: 300, type: "brick" },
          { x: 2596, y: 300, type: "brick" },
          { x: 2628, y: 300, type: "brick" },
          { x: 2660, y: 300, type: "brick" },
          { x: 2692, y: 300, type: "brick" },
          { x: 2724, y: 300, type: "brick" },
          
          { x: 2500, y: 332, type: "brick" },
          { x: 2580, y: 332, type: "question", contents: "1up" },
          { x: 2644, y: 332, type: "question", contents: "star" },
          { x: 2724, y: 332, type: "brick" },
        ],
        enemies: [
          { x: 400, y: 536, type: "koopa" },
          { x: 600, y: 536, type: "goomba" },
          { x: 700, y: 536, type: "goomba" },
          { x: 1000, y: 536, type: "koopa" },
          { x: 1200, y: 536, type: "goomba" },
          { x: 1700, y: 418, type: "koopa" }, // On bridge
          { x: 2000, y: 536, type: "goomba" },
          { x: 2200, y: 536, type: "koopa" },
          { x: 2800, y: 536, type: "koopa" },
        ],
        coins: [
          { x: 350, y: 430 },
          { x: 550, y: 500 },
          { x: 850, y: 130 },
          { x: 1100, y: 500 },
          { x: 1512, y: 380 },
          { x: 1544, y: 380 },
          { x: 1576, y: 380 },
          { x: 1900, y: 500 },
          { x: 2600, y: 230 },
        ]
      }
    };

    return levels[levelId as keyof typeof levels] || levels[1];
  }

  static getAllLevels(): number[] {
    return [1, 2, 3, 4];
  }

  static getLevelCount(): number {
    return 4;
  }
}
