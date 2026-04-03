import type { MovingPlatform, Segment, Spawn } from "./levelLayout";

export const LEVEL_4_LENGTH = 4040;
export const PLAYER_SPAWN_4: Spawn = { x: 120, y: 360 };
export const GOAL_POSITION_4 = { x: 3900, y: 228 };
export const CHECKPOINT_POSITION_4: Spawn = { x: 2480, y: 250 };
export const BOSS_TRIGGER_4 = { x: 3590, y: 266, width: 520, height: 280 };
export const BOSS_SPAWN_4: Spawn = { x: 3720, y: 214 };
export const BOSS_GATE_4 = { x: 3788, y: 358, width: 26, height: 244 };
export const BOSS_ORB_SPAWNS_4: Spawn[] = [
  { x: 3640, y: 324 },
  { x: 3840, y: 258 },
  { x: 3660, y: 148 },
  { x: 3490, y: 188 }
];

export const GROUND_SEGMENTS_4: Segment[] = [
  { x: 220, y: 490, width: 420, height: 80 },
  { x: 760, y: 496, width: 260, height: 74 },
  { x: 1220, y: 484, width: 280, height: 86 },
  { x: 1710, y: 500, width: 260, height: 70 },
  { x: 2230, y: 488, width: 300, height: 82 },
  { x: 2790, y: 500, width: 280, height: 70 },
  { x: 3360, y: 488, width: 320, height: 82 },
  { x: 3880, y: 494, width: 260, height: 76 }
];

export const BOARD_PLATFORMS_4: Segment[] = [
  { x: 460, y: 396, width: 120 },
  { x: 690, y: 320, width: 108 },
  { x: 980, y: 270, width: 120 },
  { x: 1320, y: 350, width: 124 },
  { x: 1580, y: 286, width: 110 },
  { x: 1910, y: 238, width: 118 },
  { x: 2290, y: 332, width: 128 },
  { x: 2580, y: 260, width: 116 },
  { x: 2930, y: 316, width: 126 },
  { x: 3240, y: 248, width: 110 },
  { x: 3560, y: 198, width: 116 }
];

export const COLLECTIBLE_SPAWNS_4: Spawn[] = [
  { x: 250, y: 332 },
  { x: 460, y: 350 },
  { x: 690, y: 274 },
  { x: 980, y: 224 },
  { x: 1160, y: 348 },
  { x: 1320, y: 304 },
  { x: 1580, y: 240 },
  { x: 1910, y: 192 },
  { x: 2230, y: 344 },
  { x: 2480, y: 214 },
  { x: 2580, y: 214 },
  { x: 2930, y: 270 },
  { x: 3240, y: 202 },
  { x: 3560, y: 152 },
  { x: 3810, y: 248 }
];

export const ENEMY_SPAWNS_4: Spawn[] = [
  { x: 620, y: 340 },
  { x: 1120, y: 286 },
  { x: 1660, y: 250 },
  { x: 2190, y: 326 },
  { x: 2740, y: 284 },
  { x: 3290, y: 236 },
  { x: 3680, y: 190 }
];

export const HAZARD_SPAWNS_4: Segment[] = [
  { x: 840, y: 474, width: 72, height: 20 },
  { x: 1460, y: 470, width: 84, height: 20 },
  { x: 2410, y: 474, width: 92, height: 20 },
  { x: 3480, y: 472, width: 88, height: 20 }
];

export const MOVING_PLATFORMS_4: MovingPlatform[] = [
  { x: 860, y: 224, width: 104, range: 74, speed: 0.0015 },
  { x: 2050, y: 210, width: 112, range: 92, speed: 0.0018 },
  { x: 3110, y: 188, width: 112, range: 86, speed: 0.0016 }
];
