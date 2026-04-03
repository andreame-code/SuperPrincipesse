import type { CharacterPhysics } from "../gameState";

export interface MovementInput {
  moveLeft: boolean;
  moveRight: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  onGround: boolean;
  velocityY: number;
  deltaMs: number;
}

export interface MovementMemory {
  coyoteTimer: number;
  jumpBufferTimer: number;
  airJumpsUsed: number;
}

export interface MovementResult {
  accelerationX: number;
  dragX: number;
  shouldJump: boolean;
  jumpCutVelocityY?: number;
  facing: -1 | 1;
  nextMemory: MovementMemory;
}

export function stepMovement(
  input: MovementInput,
  physics: CharacterPhysics,
  memory: MovementMemory,
  previousFacing: -1 | 1
): MovementResult {
  const jumpBufferTimer = input.jumpPressed
    ? 140
    : Math.max(0, memory.jumpBufferTimer - input.deltaMs);

  const coyoteTimer = input.onGround
    ? 110
    : Math.max(0, memory.coyoteTimer - input.deltaMs);
  const airJumpsUsed = input.onGround ? 0 : memory.airJumpsUsed;

  const acceleration = input.onGround ? physics.groundAcceleration : physics.airAcceleration;
  let accelerationX = 0;
  let facing = previousFacing;

  if (input.moveLeft) {
    accelerationX = -acceleration;
    facing = -1;
  } else if (input.moveRight) {
    accelerationX = acceleration;
    facing = 1;
  }

  const groundJumpAvailable = jumpBufferTimer > 0 && coyoteTimer > 0;
  const airJumpAvailable = jumpBufferTimer > 0 && !input.onGround && coyoteTimer === 0 && airJumpsUsed < 1;
  const shouldJump = groundJumpAvailable || airJumpAvailable;
  const jumpCutVelocityY =
    !input.jumpHeld && input.velocityY < -170 ? input.velocityY * 0.56 : undefined;

  return {
    accelerationX,
    dragX: input.onGround ? physics.groundDrag : 0,
    shouldJump,
    jumpCutVelocityY,
    facing,
    nextMemory: {
      coyoteTimer: shouldJump ? 0 : coyoteTimer,
      jumpBufferTimer: shouldJump ? 0 : jumpBufferTimer,
      airJumpsUsed: shouldJump ? (groundJumpAvailable ? airJumpsUsed : airJumpsUsed + 1) : airJumpsUsed
    }
  };
}
