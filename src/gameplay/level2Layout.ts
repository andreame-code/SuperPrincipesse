import type { MovingPlatform, Segment, Spawn } from "./levelLayout";

export const LEVEL_2_LENGTH = 3680;
export const PLAYER_SPAWN_2: Spawn = { x: 120, y: 454 };
export const GOAL_POSITION_2 = { x: 3570, y: 348 };
export const CHECKPOINT_POSITION_2: Spawn = { x: 2300, y: 356 };

export const GROUND_SEGMENTS_2: Segment[] = [
  { x: 220, y: 462, width: 420, height: 110 },
  { x: 780, y: 462, width: 280, height: 110 },
  { x: 1180, y: 430, width: 240, height: 140 },
  { x: 1610, y: 462, width: 240, height: 110 },
  { x: 2040, y: 430, width: 280, height: 140 },
  { x: 2490, y: 462, width: 260, height: 110 },
  { x: 2930, y: 430, width: 300, height: 140 },
  { x: 3430, y: 462, width: 420, height: 110 }
];

export const BOARD_PLATFORMS_2: Segment[] = [
  { x: 470, y: 352, width: 140 },
  { x: 690, y: 292, width: 110 },
  { x: 980, y: 330, width: 124 },
  { x: 1360, y: 276, width: 128 },
  { x: 1510, y: 228, width: 108 },
  { x: 1850, y: 340, width: 140 },
  { x: 2210, y: 286, width: 132 },
  { x: 2410, y: 228, width: 110 },
  { x: 2700, y: 308, width: 136 },
  { x: 3040, y: 262, width: 124 },
  { x: 3290, y: 214, width: 118 }
];

export const COLLECTIBLE_SPAWNS_2: Spawn[] = [
  { x: 250, y: 398 },
  { x: 470, y: 306 },
  { x: 690, y: 246 },
  { x: 980, y: 284 },
  { x: 1180, y: 382 },
  { x: 1360, y: 230 },
  { x: 1510, y: 182 },
  { x: 1850, y: 294 },
  { x: 2040, y: 382 },
  { x: 2210, y: 240 },
  { x: 2410, y: 182 },
  { x: 2700, y: 262 },
  { x: 2930, y: 382 },
  { x: 3040, y: 216 },
  { x: 3290, y: 168 },
  { x: 3480, y: 392 }
];

export const ENEMY_SPAWNS_2: Spawn[] = [
  { x: 640, y: 424 },
  { x: 1180, y: 392 },
  { x: 1610, y: 424 },
  { x: 2040, y: 392 },
  { x: 2490, y: 424 },
  { x: 2930, y: 392 }
];

export const HAZARD_SPAWNS_2: Segment[] = [
  { x: 560, y: 450, width: 72, height: 18 },
  { x: 1460, y: 418, width: 68, height: 18 },
  { x: 2310, y: 418, width: 84, height: 18 },
  { x: 3180, y: 418, width: 72, height: 18 }
];

export const MOVING_PLATFORMS_2: MovingPlatform[] = [
  { x: 830, y: 246, width: 104, range: 90, speed: 0.0018 },
  { x: 1730, y: 250, width: 112, range: 84, speed: 0.00155 },
  { x: 2850, y: 226, width: 112, range: 94, speed: 0.0019 }
];
