import test from "node:test";
import assert from "node:assert/strict";
import { testLevels } from "./helpers/levelDefinitions.ts";

const level2 = testLevels.level2;

test("Level 2 stretches beyond level 1 and places the goal late in the stage", () => {
  assert.ok(level2.length > 3400);
  assert.ok(level2.goalPosition.x > level2.length - 180);
  assert.ok(level2.playerSpawn.x < level2.collectibles[0].x);
});

test("Level 2 contains more traversal pressure than level 1", () => {
  assert.ok(level2.boardPlatforms.length >= 10);
  assert.ok(level2.collectibles.length >= 14);
  assert.ok(level2.enemies.length >= 5);
  assert.ok(level2.hazards.length >= 4);
  assert.ok(level2.movingPlatforms.length >= 3);
});

test("Level 2 checkpoint sits before the goal and after the opening third", () => {
  assert.ok(level2.checkpointPosition.x > level2.length / 3);
  assert.ok(level2.checkpointPosition.x < level2.goalPosition.x);
});
