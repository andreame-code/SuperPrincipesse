import {
  BOARD_PLATFORMS,
  CHECKPOINT_POSITION,
  COLLECTIBLE_SPAWNS,
  ENEMY_SPAWNS,
  GOAL_POSITION,
  GROUND_SEGMENTS,
  HAZARD_SPAWNS,
  LEVEL_LENGTH,
  MOVING_PLATFORMS,
  PLAYER_SPAWN,
  type MovingPlatform,
  type Segment,
  type Spawn
} from "./levelLayout";
import {
  BOARD_PLATFORMS_2,
  CHECKPOINT_POSITION_2,
  COLLECTIBLE_SPAWNS_2,
  ENEMY_SPAWNS_2,
  GOAL_POSITION_2,
  GROUND_SEGMENTS_2,
  HAZARD_SPAWNS_2,
  LEVEL_2_LENGTH,
  MOVING_PLATFORMS_2,
  PLAYER_SPAWN_2
} from "./level2Layout";
import {
  BOARD_PLATFORMS_3,
  CHECKPOINT_POSITION_3,
  COLLECTIBLE_SPAWNS_3,
  ENEMY_SPAWNS_3,
  GOAL_POSITION_3,
  GROUND_SEGMENTS_3,
  HAZARD_SPAWNS_3,
  LEVEL_3_LENGTH,
  MOVING_PLATFORMS_3,
  PLAYER_SPAWN_3
} from "./level3Layout";
import {
  BOARD_PLATFORMS_4,
  BOSS_GATE_4,
  BOSS_ORB_SPAWNS_4,
  BOSS_SPAWN_4,
  BOSS_TRIGGER_4,
  CHECKPOINT_POSITION_4,
  COLLECTIBLE_SPAWNS_4,
  ENEMY_SPAWNS_4,
  GOAL_POSITION_4,
  GROUND_SEGMENTS_4,
  HAZARD_SPAWNS_4,
  LEVEL_4_LENGTH,
  MOVING_PLATFORMS_4,
  PLAYER_SPAWN_4
} from "./level4Layout";

export type LevelId = "level-1" | "level-2" | "level-3" | "level-4";
export type LevelEnvironment = "land" | "underwater";
export type LevelEnemyType = "slime" | "fish";

export interface BossZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BossDefinition {
  name: string;
  maxHp: number;
  spawn: Spawn;
  triggerArea: BossZone;
  gate: BossZone;
  orbSpawns: Spawn[];
}

export interface LevelDefinition {
  id: LevelId;
  worldLabel: string;
  title: string;
  environment: LevelEnvironment;
  enemyType: LevelEnemyType;
  skyTop: number;
  skyBottom: number;
  sunColor: number;
  mountainNear: number;
  mountainFar: number;
  length: number;
  playerSpawn: Spawn;
  goalPosition: { x: number; y: number };
  checkpointPosition: Spawn;
  groundSegments: Segment[];
  boardPlatforms: Segment[];
  collectibles: Spawn[];
  enemies: Spawn[];
  hazards: Segment[];
  movingPlatforms: MovingPlatform[];
  boss?: BossDefinition;
}

export const levelDefinitions: Record<LevelId, LevelDefinition> = {
  "level-1": {
    id: "level-1",
    worldLabel: "Mondo 1-1",
    title: "Fuga dalla Torre Dorata",
    environment: "land",
    enemyType: "slime",
    skyTop: 0x9e7fe0,
    skyBottom: 0xf1c27c,
    sunColor: 0xffe6a1,
    mountainNear: 0x57406f,
    mountainFar: 0x6f5589,
    length: LEVEL_LENGTH,
    playerSpawn: PLAYER_SPAWN,
    goalPosition: GOAL_POSITION,
    checkpointPosition: CHECKPOINT_POSITION,
    groundSegments: GROUND_SEGMENTS,
    boardPlatforms: BOARD_PLATFORMS,
    collectibles: COLLECTIBLE_SPAWNS,
    enemies: ENEMY_SPAWNS,
    hazards: HAZARD_SPAWNS,
    movingPlatforms: MOVING_PLATFORMS
  },
  "level-2": {
    id: "level-2",
    worldLabel: "Mondo 1-2",
    title: "Bosco delle Lanterne Alte",
    environment: "land",
    enemyType: "slime",
    skyTop: 0x5f89d1,
    skyBottom: 0xf3c47b,
    sunColor: 0xffefb7,
    mountainNear: 0x34526b,
    mountainFar: 0x4f6b86,
    length: LEVEL_2_LENGTH,
    playerSpawn: PLAYER_SPAWN_2,
    goalPosition: GOAL_POSITION_2,
    checkpointPosition: CHECKPOINT_POSITION_2,
    groundSegments: GROUND_SEGMENTS_2,
    boardPlatforms: BOARD_PLATFORMS_2,
    collectibles: COLLECTIBLE_SPAWNS_2,
    enemies: ENEMY_SPAWNS_2,
    hazards: HAZARD_SPAWNS_2,
    movingPlatforms: MOVING_PLATFORMS_2
  },
  "level-3": {
    id: "level-3",
    worldLabel: "Mondo 1-3",
    title: "Picchi del Crepuscolo",
    environment: "land",
    enemyType: "slime",
    skyTop: 0x3c4d96,
    skyBottom: 0xf0a96c,
    sunColor: 0xffdcb2,
    mountainNear: 0x2f365e,
    mountainFar: 0x46507e,
    length: LEVEL_3_LENGTH,
    playerSpawn: PLAYER_SPAWN_3,
    goalPosition: GOAL_POSITION_3,
    checkpointPosition: CHECKPOINT_POSITION_3,
    groundSegments: GROUND_SEGMENTS_3,
    boardPlatforms: BOARD_PLATFORMS_3,
    collectibles: COLLECTIBLE_SPAWNS_3,
    enemies: ENEMY_SPAWNS_3,
    hazards: HAZARD_SPAWNS_3,
    movingPlatforms: MOVING_PLATFORMS_3
  },
  "level-4": {
    id: "level-4",
    worldLabel: "Mondo 1-4",
    title: "Laguna Sommersa",
    environment: "underwater",
    enemyType: "fish",
    skyTop: 0x10346a,
    skyBottom: 0x37a7b6,
    sunColor: 0x9cefff,
    mountainNear: 0x123d5a,
    mountainFar: 0x1d5875,
    length: LEVEL_4_LENGTH,
    playerSpawn: PLAYER_SPAWN_4,
    goalPosition: GOAL_POSITION_4,
    checkpointPosition: CHECKPOINT_POSITION_4,
    groundSegments: GROUND_SEGMENTS_4,
    boardPlatforms: BOARD_PLATFORMS_4,
    collectibles: COLLECTIBLE_SPAWNS_4,
    enemies: ENEMY_SPAWNS_4,
    hazards: HAZARD_SPAWNS_4,
    movingPlatforms: MOVING_PLATFORMS_4,
    boss: {
      name: "Murena Regina",
      maxHp: 3,
      spawn: BOSS_SPAWN_4,
      triggerArea: BOSS_TRIGGER_4,
      gate: BOSS_GATE_4,
      orbSpawns: BOSS_ORB_SPAWNS_4
    }
  }
};

export function getLevelDefinition(levelId: LevelId): LevelDefinition {
  return levelDefinitions[levelId];
}
