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
  PLAYER_SPAWN
} from "../../src/gameplay/levelLayout.ts";
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
} from "../../src/gameplay/level2Layout.ts";
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
} from "../../src/gameplay/level3Layout.ts";
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
} from "../../src/gameplay/level4Layout.ts";

export const testLevels = {
  level1: {
    worldLabel: "Mondo 1-1",
    environment: "land",
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
  level2: {
    worldLabel: "Mondo 1-2",
    environment: "land",
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
  level3: {
    worldLabel: "Mondo 1-3",
    environment: "land",
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
  level4: {
    worldLabel: "Mondo 1-4",
    environment: "underwater",
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
