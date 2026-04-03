import type { CharacterPhysics } from "../../src/gameState.ts";
import type { MovingPlatform, Segment, Spawn } from "../../src/gameplay/levelLayout.ts";

const WORLD_GRAVITY_Y = 1100;
const HORIZONTAL_REACH_SAFETY = 0.9;
const HORIZONTAL_REACH_BONUS = 18;
const DOUBLE_JUMP_HEIGHT_MULTIPLIER = 2;

interface Surface {
  id: string;
  left: number;
  right: number;
  y: number;
}

export interface TraversalResult {
  reachable: boolean;
  route: string[];
}

export interface TraversalLayout {
  environment?: "land" | "underwater";
  boardPlatforms: Segment[];
  goalPosition: { x: number; y: number };
  groundSegments: Segment[];
  movingPlatforms: MovingPlatform[];
  playerSpawn: Spawn;
}

function createGroundSurface(segment: Segment, index: number): Surface {
  return {
    id: `ground-${index}`,
    left: segment.x - segment.width / 2,
    right: segment.x + segment.width / 2,
    y: segment.y
  };
}

function createBoardSurface(segment: Segment, index: number): Surface {
  return {
    id: `board-${index}`,
    left: segment.x - segment.width / 2,
    right: segment.x + segment.width / 2,
    y: segment.y - 8
  };
}

function createMovingSurface(platform: MovingPlatform, index: number): Surface {
  return {
    id: `moving-${index}`,
    left: platform.x - platform.width / 2 - platform.range,
    right: platform.x + platform.width / 2 + platform.range,
    y: platform.y - 14
  };
}

function getTraversalSurfaces(layout: TraversalLayout): Surface[] {
  return [
    ...layout.groundSegments.map(createGroundSurface),
    ...layout.boardPlatforms.map(createBoardSurface),
    ...layout.movingPlatforms.map(createMovingSurface)
  ];
}

function getLandingTimeSeconds(jumpVelocity: number, deltaY: number): number | null {
  const launchSpeed = Math.abs(jumpVelocity);
  const singleJumpHeight = (launchSpeed * launchSpeed) / (2 * WORLD_GRAVITY_Y);
  const maxReachableHeight =
    deltaY < 0 ? singleJumpHeight * DOUBLE_JUMP_HEIGHT_MULTIPLIER : Number.POSITIVE_INFINITY;

  if (deltaY < 0 && Math.abs(deltaY) > maxReachableHeight) {
    return null;
  }

  const effectiveLaunchSpeed =
    deltaY < 0 ? launchSpeed * Math.sqrt(DOUBLE_JUMP_HEIGHT_MULTIPLIER) : launchSpeed;
  const discriminant = effectiveLaunchSpeed * effectiveLaunchSpeed + 2 * WORLD_GRAVITY_Y * deltaY;
  if (discriminant < 0) {
    return null;
  }

  return (effectiveLaunchSpeed + Math.sqrt(discriminant)) / WORLD_GRAVITY_Y;
}

function getReachableHorizontalDistance(physics: CharacterPhysics, deltaY: number): number {
  const landingTime = getLandingTimeSeconds(physics.jumpVelocity, deltaY);
  if (landingTime === null) {
    return -1;
  }

  return physics.moveSpeed * landingTime * HORIZONTAL_REACH_SAFETY + HORIZONTAL_REACH_BONUS;
}

function getHorizontalGap(from: Surface, to: Surface): number {
  if (from.right < to.left) {
    return to.left - from.right;
  }

  if (to.right < from.left) {
    return from.left - to.right;
  }

  return 0;
}

function canTraverse(from: Surface, to: Surface, physics: CharacterPhysics): boolean {
  if (from.id === to.id) {
    return false;
  }

  if (to.left <= from.right && to.right >= from.left && Math.abs(to.y - from.y) <= 28) {
    return true;
  }

  const deltaY = to.y - from.y;
  const maxHorizontalDistance = getReachableHorizontalDistance(physics, deltaY);
  if (maxHorizontalDistance < 0) {
    return false;
  }

  return getHorizontalGap(from, to) <= maxHorizontalDistance;
}

export function findCompletionRoute(physics: CharacterPhysics, layout: TraversalLayout): TraversalResult {
  if (layout.environment === "underwater") {
    return {
      reachable: layout.playerSpawn.x < layout.goalPosition.x ? true : false,
      route: layout.playerSpawn.x < layout.goalPosition.x ? ["spawn", "goal"] : []
    };
  }

  const surfaces = getTraversalSurfaces(layout);
  const start = surfaces.find((surface) => surface.left <= layout.playerSpawn.x && layout.playerSpawn.x <= surface.right);
  const goalX = layout.goalPosition.x + 12;
  const goal = surfaces.find((surface) => surface.left <= goalX && goalX <= surface.right);

  if (!start || !goal) {
    return { reachable: false, route: [] };
  }

  const queue: Surface[] = [start];
  const visited = new Set<string>([start.id]);
  const previous = new Map<string, string>();

  while (queue.length > 0) {
    const current = queue.shift() as Surface;
    if (current.id === goal.id) {
      const route = [current.id];
      let cursor = current.id;
      while (previous.has(cursor)) {
        cursor = previous.get(cursor) as string;
        route.unshift(cursor);
      }
      return { reachable: true, route };
    }

    surfaces.forEach((candidate) => {
      if (visited.has(candidate.id)) {
        return;
      }

      if (!canTraverse(current, candidate, physics)) {
        return;
      }

      visited.add(candidate.id);
      previous.set(candidate.id, current.id);
      queue.push(candidate);
    });
  }

  return { reachable: false, route: [] };
}
