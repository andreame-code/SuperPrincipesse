export type Segment = { x: number; y: number; width: number; height?: number };
export type Spawn = { x: number; y: number };
export type MovingPlatform = { x: number; y: number; width: number; range: number; speed: number };

export const LEVEL_LENGTH = 3200;
export const PLAYER_SPAWN: Spawn = { x: 120, y: 454 };
export const GOAL_POSITION = { x: 3110, y: 380 };
export const CHECKPOINT_POSITION: Spawn = { x: 2050, y: 410 };

export const GROUND_SEGMENTS: Segment[] = [
  { x: 220, y: 462, width: 440, height: 110 },
  { x: 790, y: 462, width: 420, height: 110 },
  { x: 1360, y: 462, width: 500, height: 110 },
  { x: 1970, y: 462, width: 420, height: 110 },
  { x: 2550, y: 462, width: 460, height: 110 },
  { x: 3070, y: 462, width: 250, height: 110 }
];

export const BOARD_PLATFORMS: Segment[] = [
  { x: 430, y: 380, width: 150 },
  { x: 690, y: 332, width: 130 },
  { x: 1010, y: 350, width: 150 },
  { x: 1240, y: 298, width: 120 },
  { x: 1580, y: 366, width: 160 },
  { x: 1840, y: 316, width: 160 },
  { x: 2190, y: 348, width: 150 },
  { x: 2440, y: 300, width: 120 },
  { x: 2740, y: 336, width: 150 }
];

export const COLLECTIBLE_SPAWNS: Spawn[] = [
  { x: 270, y: 400 },
  { x: 430, y: 334 },
  { x: 690, y: 286 },
  { x: 890, y: 408 },
  { x: 1010, y: 304 },
  { x: 1240, y: 252 },
  { x: 1580, y: 320 },
  { x: 1840, y: 270 },
  { x: 2040, y: 408 },
  { x: 2440, y: 254 },
  { x: 2740, y: 290 },
  { x: 3000, y: 404 }
];

export const ENEMY_SPAWNS: Spawn[] = [
  { x: 640, y: 424 },
  { x: 1450, y: 424 },
  { x: 2120, y: 424 },
  { x: 2840, y: 424 }
];

export const HAZARD_SPAWNS: Segment[] = [
  { x: 560, y: 450, width: 88, height: 18 },
  { x: 1710, y: 450, width: 104, height: 18 },
  { x: 2320, y: 450, width: 88, height: 18 }
];

export const MOVING_PLATFORMS: MovingPlatform[] = [
  { x: 1130, y: 248, width: 112, range: 72, speed: 0.0017 },
  { x: 2630, y: 264, width: 112, range: 86, speed: 0.0014 }
];

export function getAllPlatformSegments(): Segment[] {
  return [...GROUND_SEGMENTS, ...BOARD_PLATFORMS];
}
