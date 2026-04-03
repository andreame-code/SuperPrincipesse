import test from "node:test";
import assert from "node:assert/strict";
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
  getAllPlatformSegments
} from "../src/gameplay/levelLayout.ts";

test("Level starts before first collectible and ends after goal", () => {
  assert.ok(PLAYER_SPAWN.x < COLLECTIBLE_SPAWNS[0].x);
  assert.ok(GOAL_POSITION.x < LEVEL_LENGTH);
  assert.ok(GOAL_POSITION.x > ENEMY_SPAWNS[ENEMY_SPAWNS.length - 1].x);
});

test("Ground segments are ordered and never overlap backwards", () => {
  for (let index = 1; index < GROUND_SEGMENTS.length; index += 1) {
    const previous = GROUND_SEGMENTS[index - 1];
    const current = GROUND_SEGMENTS[index];
    const previousEnd = previous.x + previous.width / 2;
    const currentStart = current.x - current.width / 2;
    assert.ok(currentStart >= previousEnd - 40);
  }
});

test("Level contains enough traversal content for a real first stage", () => {
  assert.ok(BOARD_PLATFORMS.length >= 8);
  assert.ok(COLLECTIBLE_SPAWNS.length >= 10);
  assert.ok(ENEMY_SPAWNS.length >= 4);
  assert.ok(HAZARD_SPAWNS.length >= 3);
  assert.ok(MOVING_PLATFORMS.length >= 2);
  assert.ok(getAllPlatformSegments().length === GROUND_SEGMENTS.length + BOARD_PLATFORMS.length);
});

test("Checkpoint sits after the first half of the level and before the goal", () => {
  assert.ok(CHECKPOINT_POSITION.x > LEVEL_LENGTH / 2);
  assert.ok(CHECKPOINT_POSITION.x < GOAL_POSITION.x);
});
