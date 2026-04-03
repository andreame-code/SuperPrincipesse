import test from "node:test";
import assert from "node:assert/strict";
import { characters } from "../src/gameState.ts";
import { testLevels } from "./helpers/levelDefinitions.ts";
import { findCompletionRoute } from "./helpers/levelTraversal.ts";

const unlockedCharacters = characters.filter((character) => character.unlocked);
const levels = [testLevels.level1, testLevels.level2, testLevels.level3];

test("Every unlocked character has a complete traversal route from spawn to goal on each level", () => {
  levels.forEach((level) => {
    unlockedCharacters.forEach((character) => {
      const result = findCompletionRoute(character.physics, level);
      assert.equal(
        result.reachable,
        true,
        `${character.name} should be able to reach ${level.worldLabel}, but no traversal route was found.`
      );
      assert.ok(
        result.route.length >= 2,
        `${character.name} should require a meaningful route through ${level.worldLabel}, not a trivial one-node result.`
      );
    });
  });
});
