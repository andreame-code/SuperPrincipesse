import test from "node:test";
import assert from "node:assert/strict";
import { testLevels } from "./helpers/levelDefinitions.ts";

const level4 = testLevels.level4;

test("Level 4 introduces an underwater route with a late goal", () => {
  assert.equal(level4.environment, "underwater");
  assert.ok(level4.length > 3800);
  assert.ok(level4.goalPosition.x > level4.length - 180);
});

test("Level 4 adds enough underwater content to feel distinct", () => {
  assert.ok(level4.boardPlatforms.length >= 10);
  assert.ok(level4.collectibles.length >= 14);
  assert.ok(level4.enemies.length >= 6);
  assert.ok(level4.hazards.length >= 4);
  assert.ok(level4.movingPlatforms.length >= 3);
});

test("Level 4 checkpoint sits after the midpoint and before the goal", () => {
  assert.ok(level4.checkpointPosition.x > level4.length / 2);
  assert.ok(level4.checkpointPosition.x < level4.goalPosition.x);
});

test("Level 4 ends with a boss arena that gates the final flag", () => {
  assert.ok(level4.boss);
  assert.equal(level4.boss.maxHp, 3);
  assert.ok(level4.boss.triggerArea.x > level4.length * 0.8);
  assert.ok(level4.boss.gate.x < level4.goalPosition.x);
  assert.ok(level4.boss.orbSpawns.length >= 3);
});
