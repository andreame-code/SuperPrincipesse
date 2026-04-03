import Phaser from "phaser";

type RunStatus = "menu" | "select" | "playing" | "won" | "lost";

let currentScene = "boot";
let runStatus: RunStatus = "menu";
let gameRef: Phaser.Game | undefined;
let levelSceneRef: Phaser.Scene | undefined;

export function registerGame(game: Phaser.Game): void {
  gameRef = game;
}

export function registerLevelScene(scene: Phaser.Scene | undefined): void {
  levelSceneRef = scene;
}

export function setCurrentScene(sceneKey: string): void {
  currentScene = sceneKey;
}

export function setRunStatus(status: RunStatus): void {
  runStatus = status;
}

export function getCurrentSceneKey(): string {
  return currentScene;
}

export function getRuntimeSnapshot(): {
  currentScene: string;
  runStatus: RunStatus;
  player?: { x: number; y: number };
} {
  const player = levelSceneRef?.children.getByName("player") as Phaser.Physics.Arcade.Sprite | undefined;

  return {
    currentScene,
    runStatus,
    player: player ? { x: player.x, y: player.y } : undefined
  };
}

export function teleportPlayer(x: number, y: number): boolean {
  const player = levelSceneRef?.children.getByName("player") as Phaser.Physics.Arcade.Sprite | undefined;
  const body = player?.body as Phaser.Physics.Arcade.Body | undefined;
  if (!player || !body) {
    return false;
  }

  player.setPosition(x, y);
  body.setVelocity(0, 0);
  body.setAcceleration(0, 0);
  return true;
}

declare global {
  interface Window {
    __superPrincipesse?: {
      getSnapshot: typeof getRuntimeSnapshot;
      teleportPlayer: typeof teleportPlayer;
      getGame: () => Phaser.Game | undefined;
    };
  }
}

export function attachRuntimeBridge(): void {
  window.__superPrincipesse = {
    getSnapshot: getRuntimeSnapshot,
    teleportPlayer,
    getGame: () => gameRef
  };
}
