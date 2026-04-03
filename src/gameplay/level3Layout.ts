import type { MovingPlatform, Segment, Spawn } from "./levelLayout";

export const LEVEL_3_LENGTH = 4160;
export const PLAYER_SPAWN_3: Spawn = { x: 120, y: 454 };
export const GOAL_POSITION_3 = { x: 3990, y: 318 };
export const CHECKPOINT_POSITION_3: Spawn = { x: 2620, y: 334 };

export const GROUND_SEGMENTS_3: Segment[] = [
  { x: 220, y: 462, width: 380, height: 110 },
  { x: 710, y: 430, width: 220, height: 140 },
  { x: 1110, y: 462, width: 220, height: 110 },
  { x: 1530, y: 430, width: 220, height: 140 },
  { x: 1960, y: 462, width: 240, height: 110 },
  { x: 2400, y: 430, width: 220, height: 140 },
  { x: 2870, y: 462, width: 240, height: 110 },
  { x: 3320, y: 430, width: 240, height: 140 },
  { x: 3810, y: 462, width: 420, height: 110 }
];

export const BOARD_PLATFORMS_3: Segment[] = [
  { x: 420, y: 340, width: 126 },
  { x: 620, y: 276, width: 108 },
  { x: 880, y: 226, width: 112 },
  { x: 1260, y: 316, width: 132 },
  { x: 1460, y: 252, width: 110 },
  { x: 1700, y: 202, width: 110 },
  { x: 2130, y: 332, width: 134 },
  { x: 2330, y: 268, width: 112 },
  { x: 2570, y: 204, width: 108 },
  { x: 3020, y: 326, width: 136 },
  { x: 3260, y: 250, width: 108 },
  { x: 3520, y: 190, width: 112 },
  { x: 3770, y: 248, width: 120 }
];

export const COLLECTIBLE_SPAWNS_3: Spawn[] = [
  { x: 250, y: 398 },
  { x: 420, y: 294 },
  { x: 620, y: 230 },
  { x: 880, y: 180 },
  { x: 1110, y: 414 },
  { x: 1260, y: 270 },
  { x: 1460, y: 206 },
  { x: 1700, y: 156 },
  { x: 1960, y: 414 },
  { x: 2130, y: 286 },
  { x: 2330, y: 222 },
  { x: 2570, y: 158 },
  { x: 2870, y: 414 },
  { x: 3020, y: 280 },
  { x: 3260, y: 204 },
  { x: 3520, y: 144 },
  { x: 3770, y: 202 },
  { x: 3960, y: 394 }
];

export const ENEMY_SPAWNS_3: Spawn[] = [
  { x: 680, y: 392 },
  { x: 1110, y: 424 },
  { x: 1530, y: 392 },
  { x: 1960, y: 424 },
  { x: 2400, y: 392 },
  { x: 2870, y: 424 },
  { x: 3320, y: 392 }
];

export const HAZARD_SPAWNS_3: Segment[] = [
  { x: 540, y: 450, width: 76, height: 18 },
  { x: 1380, y: 418, width: 76, height: 18 },
  { x: 2240, y: 450, width: 92, height: 18 },
  { x: 3160, y: 418, width: 88, height: 18 },
  { x: 3640, y: 418, width: 76, height: 18 }
];

export const MOVING_PLATFORMS_3: MovingPlatform[] = [
  { x: 990, y: 286, width: 104, range: 94, speed: 0.0021 },
  { x: 1830, y: 258, width: 112, range: 88, speed: 0.0017 },
  { x: 2720, y: 238, width: 112, range: 96, speed: 0.002 },
  { x: 3600, y: 222, width: 120, range: 104, speed: 0.0018 }
];
