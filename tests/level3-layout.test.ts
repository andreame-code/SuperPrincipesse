import test from "node:test";
import assert from "node:assert/strict";
import { testLevels } from "./helpers/levelDefinitions.ts";

const level3 = testLevels.level3;

test("Level 3 extends the adventure with a later goal and taller traversal", () => {
  assert.ok(level3.length > 3900);
  assert.ok(level3.goalPosition.x > level3.length - 180);
  assert.ok(level3.playerSpawn.x < level3.collectibles[0].x);
  assert.ok(level3.goalPosition.y < level3.playerSpawn.y - 100);
});

test("Level 3 raises pressure with more moving platforms and hazards", () => {
  assert.ok(level3.boardPlatforms.length >= 12);
  assert.ok(level3.collectibles.length >= 16);
  assert.ok(level3.enemies.length >= 6);
  assert.ok(level3.hazards.length >= 5);
  assert.ok(level3.movingPlatforms.length >= 4);
});

test("Level 3 checkpoint sits late enough to reward progress", () => {
  assert.ok(level3.checkpointPosition.x > level3.length / 2);
  assert.ok(level3.checkpointPosition.x < level3.goalPosition.x);
});
