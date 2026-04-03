import test from "node:test";
import assert from "node:assert/strict";
import { characters } from "../src/gameState.ts";
import { stepMovement } from "../src/gameplay/movement.ts";

test("Rapunzel keeps jump buffered until coyote window is consumed", () => {
  const result = stepMovement(
    {
      moveLeft: false,
      moveRight: true,
      jumpPressed: true,
      jumpHeld: true,
      onGround: false,
      velocityY: -20,
      deltaMs: 16
    },
    characters[0].physics,
    {
      coyoteTimer: 90,
      jumpBufferTimer: 0,
      airJumpsUsed: 0
    },
    1
  );

  assert.equal(result.shouldJump, true);
  assert.equal(result.facing, 1);
  assert.equal(result.nextMemory.coyoteTimer, 0);
  assert.equal(result.nextMemory.jumpBufferTimer, 0);
  assert.equal(result.nextMemory.airJumpsUsed, 0);
});

test("Phua gets stronger ground acceleration than Rapunzel", () => {
  const rapunzel = stepMovement(
    {
      moveLeft: false,
      moveRight: true,
      jumpPressed: false,
      jumpHeld: true,
      onGround: true,
      velocityY: 0,
      deltaMs: 16
    },
    characters[0].physics,
    {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsUsed: 0
    },
    1
  );

  const phua = stepMovement(
    {
      moveLeft: false,
      moveRight: true,
      jumpPressed: false,
      jumpHeld: true,
      onGround: true,
      velocityY: 0,
      deltaMs: 16
    },
    characters[1].physics,
    {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsUsed: 0
    },
    1
  );

  assert.ok(phua.accelerationX > rapunzel.accelerationX);
  assert.ok(phua.dragX > rapunzel.dragX);
});

test("Jump cut reduces vertical speed only while ascending and jump is released", () => {
  const result = stepMovement(
    {
      moveLeft: false,
      moveRight: false,
      jumpPressed: false,
      jumpHeld: false,
      onGround: false,
      velocityY: -300,
      deltaMs: 16
    },
    characters[0].physics,
    {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsUsed: 0
    },
    1
  );

  assert.ok(Math.abs((result.jumpCutVelocityY ?? 0) - -168) < 0.0001);
});

test("A character can perform exactly one air jump", () => {
  const result = stepMovement(
    {
      moveLeft: false,
      moveRight: false,
      jumpPressed: true,
      jumpHeld: true,
      onGround: false,
      velocityY: 40,
      deltaMs: 16
    },
    characters[0].physics,
    {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsUsed: 0
    },
    1
  );

  assert.equal(result.shouldJump, true);
  assert.equal(result.nextMemory.airJumpsUsed, 1);
});

test("A character cannot chain infinite air jumps", () => {
  const result = stepMovement(
    {
      moveLeft: false,
      moveRight: false,
      jumpPressed: true,
      jumpHeld: true,
      onGround: false,
      velocityY: 20,
      deltaMs: 16
    },
    characters[0].physics,
    {
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsUsed: 1
    },
    1
  );

  assert.equal(result.shouldJump, false);
  assert.equal(result.nextMemory.airJumpsUsed, 1);
});
