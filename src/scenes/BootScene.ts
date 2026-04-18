import Phaser from "phaser";
import { CharacterId } from "../gameState";
import { setCurrentScene, setRunStatus } from "../runtimeState";

const FRAME_WIDTH = 16;
const FRAME_HEIGHT = 20;
const PIXEL = 4;

type PixelPalette = Record<string, string>;
type PixelFrame = string[];

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    this.createTextures();
    this.createAnimations();
    setCurrentScene("boot");
    setRunStatus("menu");
    this.scene.start("menu");
  }

  private createTextures(): void {
    this.createCharacterSpritesheet("rapunzel", this.getRapunzelFrames(), {
      X: "#1f1330",
      H: "#d89a1e",
      G: "#f6dd63",
      S: "#f6dfd3",
      P: "#f2a8ba",
      D: "#b06ad6",
      L: "#d9a1ef",
      W: "#fff6ff",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("phua", this.getPhuaFrames(), {
      X: "#40373a",
      C: "#f6f0e5",
      P: "#e8a8aa",
      N: "#9c6f66",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("mulan", this.getMulanFrames(), {
      X: "#23222d",
      H: "#1f2834",
      S: "#f2d6c7",
      R: "#be4234",
      D: "#29385c",
      W: "#f6f0ec",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("biancaneve", this.getBiancaneveFrames(), {
      X: "#262430",
      H: "#19191f",
      S: "#f4dfcf",
      Y: "#f0d34f",
      B: "#5fa1de",
      R: "#c63f35",
      K: "#8d5e33",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("aurora", this.getAuroraFrames(), {
      X: "#2c2434",
      H: "#d7ac49",
      L: "#f2de8d",
      S: "#f5dfd2",
      P: "#f1a2c7",
      R: "#d874a1",
      C: "#f6e7bd",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("principessa-spada", this.getPrincessSwordFrames(), {
      X: "#2a2234",
      H: "#a96a2a",
      L: "#efc86a",
      S: "#f7dfd3",
      P: "#f3a1c6",
      R: "#d873a1",
      C: "#f3d97d",
      Y: "#c9d4e9",
      W: "#f7fbff",
      G: "#67b7ff",
      E: "#2f2a38"
    });

    this.createCharacterSpritesheet("unicorno", this.getUnicornFrames(), {
      X: "#72548b",
      W: "#fff7ff",
      L: "#e8ddff",
      P: "#f59ccc",
      R: "#d870a5",
      H: "#f2b84f",
      G: "#fff1b8",
      E: "#2f2a38",
      S: "#ffb36f"
    });

    this.createCharacterPortrait("rapunzel-card", this.getRapunzelFrames()[0], {
      X: "#1f1330",
      H: "#d89a1e",
      G: "#f6dd63",
      S: "#f6dfd3",
      P: "#f2a8ba",
      D: "#b06ad6",
      L: "#d9a1ef",
      W: "#fff6ff",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("phua-card", this.getPhuaFrames()[0], {
      X: "#40373a",
      C: "#f6f0e5",
      P: "#e8a8aa",
      N: "#9c6f66",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("mulan-card", this.getMulanFrames()[0], {
      X: "#23222d",
      H: "#1f2834",
      S: "#f2d6c7",
      R: "#be4234",
      D: "#29385c",
      W: "#f6f0ec",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("biancaneve-card", this.getBiancaneveFrames()[0], {
      X: "#262430",
      H: "#19191f",
      S: "#f4dfcf",
      Y: "#f0d34f",
      B: "#5fa1de",
      R: "#c63f35",
      K: "#8d5e33",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("aurora-card", this.getAuroraFrames()[0], {
      X: "#2c2434",
      H: "#d7ac49",
      L: "#f2de8d",
      S: "#f5dfd2",
      P: "#f1a2c7",
      R: "#d874a1",
      C: "#f6e7bd",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("principessa-spada-card", this.getPrincessSwordFrames()[0], {
      X: "#2a2234",
      H: "#a96a2a",
      L: "#efc86a",
      S: "#f7dfd3",
      P: "#f3a1c6",
      R: "#d873a1",
      C: "#f3d97d",
      Y: "#c9d4e9",
      W: "#f7fbff",
      G: "#67b7ff",
      E: "#2f2a38"
    });

    this.createCharacterPortrait("unicorno-card", this.getUnicornFrames()[0], {
      X: "#72548b",
      W: "#fff7ff",
      L: "#e8ddff",
      P: "#f59ccc",
      R: "#d870a5",
      H: "#f2b84f",
      G: "#fff1b8",
      E: "#2f2a38",
      S: "#ffb36f"
    });

    this.createCloudTexture();
    this.createGroundTextures();
    this.createPlatformTexture();
    this.createCollectibleTexture();
    this.createBossOrbTexture();
    this.createEnemySpritesheet();
    this.createFishEnemySpritesheet();
    this.createFoliageTextures();
    this.createAttackTextures();
    this.createGoalTextures();
    this.createHazardTexture();
    this.createCheckpointTexture();
    this.createParticleTexture();
  }

  private createAnimations(): void {
    this.createCharacterAnimations("rapunzel");
    this.createCharacterAnimations("phua");
    this.createCharacterAnimations("mulan");
    this.createCharacterAnimations("biancaneve");
    this.createCharacterAnimations("aurora");
    this.createCharacterAnimations("principessa-spada");
    this.createCharacterAnimations("unicorno");
    this.createEnemyAnimations();
  }

  private createCharacterAnimations(characterId: CharacterId): void {
    this.anims.create({
      key: `${characterId}-idle`,
      frames: [{ key: `${characterId}-sheet`, frame: 0 }],
      frameRate: 1
    });

    this.anims.create({
      key: `${characterId}-run`,
      frames: this.anims.generateFrameNumbers(`${characterId}-sheet`, { start: 1, end: 3 }),
      frameRate: 9,
      repeat: -1
    });

    this.anims.create({
      key: `${characterId}-jump`,
      frames: [{ key: `${characterId}-sheet`, frame: 4 }],
      frameRate: 1
    });

    this.anims.create({
      key: `${characterId}-fall`,
      frames: [{ key: `${characterId}-sheet`, frame: 5 }],
      frameRate: 1
    });
  }

  private createEnemyAnimations(): void {
    this.anims.create({
      key: "slime-hop",
      frames: this.anims.generateFrameNumbers("enemy-slime-sheet", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "fish-swim",
      frames: this.anims.generateFrameNumbers("enemy-fish-sheet", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private createCharacterSpritesheet(id: string, frames: PixelFrame[], palette: PixelPalette): void {
    const texture = this.requireCanvasTexture(
      `${id}-sheet`,
      FRAME_WIDTH * PIXEL * frames.length,
      FRAME_HEIGHT * PIXEL
    );
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;

    frames.forEach((frame, index) => {
      this.drawPixelFrame(ctx, frame, palette, index * FRAME_WIDTH * PIXEL, 0, PIXEL);
    });

    texture.refresh();
    texture.add("__BASE", 0, 0, 0, FRAME_WIDTH * PIXEL, FRAME_HEIGHT * PIXEL);

    for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
      texture.add(frameIndex, 0, frameIndex * FRAME_WIDTH * PIXEL, 0, FRAME_WIDTH * PIXEL, FRAME_HEIGHT * PIXEL);
    }
  }

  private createCharacterPortrait(key: string, frame: PixelFrame, palette: PixelPalette): void {
    const texture = this.requireCanvasTexture(key, 132, 132);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;

    const gradient = ctx.createLinearGradient(0, 0, 132, 132);
    gradient.addColorStop(0, "#fff0c2");
    gradient.addColorStop(1, "#c893ff");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.24;
    ctx.beginPath();
    this.roundRectPath(ctx, 10, 10, 112, 112, 22);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(66, 30, 38, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(46,27,66,0.18)";
    ctx.beginPath();
    ctx.ellipse(66, 106, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawPixelFrame(ctx, frame, palette, 34, 18, 4);
    texture.refresh();
  }

  private createCloudTexture(): void {
    const texture = this.requireCanvasTexture("cloud", 180, 92);
    const ctx = texture.getContext();
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "rgba(255,255,255,0.82)";
    this.fillEllipse(ctx, 44, 48, 54, 26);
    this.fillEllipse(ctx, 88, 34, 60, 32);
    this.fillEllipse(ctx, 126, 48, 44, 22);
    this.fillEllipse(ctx, 86, 56, 68, 28);

    ctx.fillStyle = "rgba(255,246,221,0.75)";
    this.fillEllipse(ctx, 86, 62, 54, 10);
    texture.refresh();
  }

  private createGroundTextures(): void {
    const top = this.requireCanvasTexture("ground-top", 96, 64);
    const topCtx = top.getContext();

    topCtx.fillStyle = "#8fd262";
    topCtx.fillRect(0, 0, 96, 24);
    topCtx.fillStyle = "#6ab44d";
    topCtx.fillRect(0, 12, 96, 12);
    topCtx.fillStyle = "#f3d27a";
    for (let x = 0; x < 96; x += 16) {
      topCtx.fillRect(x + 2, 20, 8, 2);
      topCtx.fillRect(x + 9, 18, 4, 2);
    }
    topCtx.fillStyle = "#7b5537";
    topCtx.fillRect(0, 24, 96, 40);
    topCtx.fillStyle = "#936542";
    for (let x = 8; x < 96; x += 20) {
      topCtx.fillRect(x, 32, 8, 24);
    }
    top.refresh();

    const fill = this.requireCanvasTexture("ground-fill", 96, 64);
    const fillCtx = fill.getContext();
    fillCtx.fillStyle = "#7b5537";
    fillCtx.fillRect(0, 0, 96, 64);
    fillCtx.fillStyle = "#936542";
    for (let y = 0; y < 64; y += 16) {
      for (let x = (y / 16) % 2 === 0 ? 6 : 14; x < 96; x += 24) {
        fillCtx.fillRect(x, y + 4, 8, 8);
      }
    }
    fillCtx.fillStyle = "#5f402b";
    for (let x = 0; x < 96; x += 12) {
      fillCtx.fillRect(x, 0, 2, 64);
    }
    fill.refresh();
  }

  private createPlatformTexture(): void {
    const texture = this.requireCanvasTexture("platform-board", 128, 28);
    const ctx = texture.getContext();

    ctx.fillStyle = "#c99659";
    ctx.fillRect(0, 0, 128, 28);
    ctx.fillStyle = "#e3bb74";
    ctx.fillRect(0, 0, 128, 6);
    ctx.fillStyle = "#8b5a35";
    for (let x = 0; x < 128; x += 24) {
      ctx.fillRect(x, 0, 2, 28);
    }
    ctx.fillStyle = "#6f4528";
    ctx.fillRect(0, 24, 128, 4);
    texture.refresh();
  }

  private createCollectibleTexture(): void {
    const texture = this.requireCanvasTexture("sun-drop", 40, 40);
    const ctx = texture.getContext();

    const gradient = ctx.createRadialGradient(20, 20, 4, 20, 20, 20);
    gradient.addColorStop(0, "#fffdf0");
    gradient.addColorStop(0.45, "#ffe486");
    gradient.addColorStop(1, "#f5b84f");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(20, 20, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#fff4cf";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(20, 20, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(13, 11, 6, 6);
    texture.refresh();
  }

  private createBossOrbTexture(): void {
    const texture = this.requireCanvasTexture("boss-orb", 56, 56);
    const ctx = texture.getContext();

    const outer = ctx.createRadialGradient(28, 28, 4, 28, 28, 28);
    outer.addColorStop(0, "rgba(255,255,255,0.95)");
    outer.addColorStop(0.34, "rgba(170,255,255,0.95)");
    outer.addColorStop(0.7, "rgba(84,223,255,0.78)");
    outer.addColorStop(1, "rgba(84,223,255,0)");
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(28, 28, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(213,252,255,0.9)";
    ctx.beginPath();
    ctx.arc(28, 28, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#f5ffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(28, 28, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(22, 22, 5, 0, Math.PI * 2);
    ctx.fill();

    texture.refresh();
  }

  private createEnemySpritesheet(): void {
    const frameWidth = 64;
    const frameHeight = 44;
    const frameCount = 4;
    const texture = this.requireCanvasTexture("enemy-slime-sheet", frameWidth * frameCount, frameHeight);
    const ctx = texture.getContext();

    [0, 1, 2, 1].forEach((squash, index) => {
      this.drawEnemyFrame(ctx, index * frameWidth, squash);
    });

    texture.refresh();
    texture.add("__BASE", 0, 0, 0, frameWidth, frameHeight);
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      texture.add(frameIndex, 0, frameIndex * frameWidth, 0, frameWidth, frameHeight);
    }
  }

  private createFishEnemySpritesheet(): void {
    const frameWidth = 60;
    const frameHeight = 38;
    const frameCount = 4;
    const texture = this.requireCanvasTexture("enemy-fish-sheet", frameWidth * frameCount, frameHeight);
    const ctx = texture.getContext();

    [0, 1, 2, 1].forEach((tailSwing, index) => {
      const x = index * frameWidth;
      ctx.fillStyle = "#ffb36f";
      this.fillEllipse(ctx, x + 28, 19, 18, 11);
      ctx.fillStyle = "#ffd59d";
      this.fillEllipse(ctx, x + 30, 18, 11, 7);
      ctx.fillStyle = "#f07e46";
      ctx.beginPath();
      const tailOffset = tailSwing === 1 ? -4 : tailSwing === 2 ? -7 : -2;
      ctx.moveTo(x + 10, 19);
      ctx.lineTo(x + 2 + tailOffset, 8);
      ctx.lineTo(x + 2 + tailOffset, 30);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 28, 10);
      ctx.lineTo(x + 21, 2 + tailSwing);
      ctx.lineTo(x + 36, 9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#2e3048";
      this.fillEllipse(ctx, x + 38, 16, 2.5, 2.5);
      ctx.fillStyle = "#ffffff";
      this.fillEllipse(ctx, x + 39, 15, 1, 1);
      ctx.strokeStyle = "#2e3048";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 43, 20);
      ctx.quadraticCurveTo(x + 46, 21, x + 48, 19);
      ctx.stroke();
    });

    texture.refresh();
    texture.add("__BASE", 0, 0, 0, frameWidth, frameHeight);
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      texture.add(frameIndex, 0, frameIndex * frameWidth, 0, frameWidth, frameHeight);
    }
  }

  private createFoliageTextures(): void {
    const bush = this.requireCanvasTexture("bush", 100, 56);
    const bushCtx = bush.getContext();
    bushCtx.fillStyle = "#3f8f49";
    this.fillEllipse(bushCtx, 28, 34, 24, 18);
    this.fillEllipse(bushCtx, 50, 24, 28, 22);
    this.fillEllipse(bushCtx, 74, 34, 22, 16);
    bushCtx.fillStyle = "#63ba63";
    this.fillEllipse(bushCtx, 42, 28, 18, 12);
    this.fillEllipse(bushCtx, 64, 30, 16, 10);
    bush.refresh();

    const flower = this.requireCanvasTexture("flower", 26, 42);
    const flowerCtx = flower.getContext();
    flowerCtx.fillStyle = "#4d9f55";
    flowerCtx.fillRect(12, 12, 3, 30);
    flowerCtx.fillStyle = "#f6e8ff";
    this.fillEllipse(flowerCtx, 13, 9, 5, 5);
    this.fillEllipse(flowerCtx, 7, 13, 5, 5);
    this.fillEllipse(flowerCtx, 19, 13, 5, 5);
    this.fillEllipse(flowerCtx, 9, 5, 5, 5);
    this.fillEllipse(flowerCtx, 17, 5, 5, 5);
    flowerCtx.fillStyle = "#ffd46f";
    this.fillEllipse(flowerCtx, 13, 9, 4, 4);
    flower.refresh();
  }

  private createAttackTextures(): void {
    const hair = this.requireCanvasTexture("hair-whip", 140, 26);
    const hairCtx = hair.getContext();
    const hairGradient = hairCtx.createLinearGradient(0, 0, 140, 0);
    hairGradient.addColorStop(0, "#f8e3a3");
    hairGradient.addColorStop(0.55, "#f0c86a");
    hairGradient.addColorStop(1, "#deb152");
    hairCtx.fillStyle = hairGradient;
    hairCtx.beginPath();
    hairCtx.moveTo(0, 13);
    hairCtx.quadraticCurveTo(56, 0, 140, 13);
    hairCtx.quadraticCurveTo(56, 26, 0, 13);
    hairCtx.fill();
    hair.refresh();

    const bonk = this.requireCanvasTexture("phua-bonk", 96, 24);
    const bonkCtx = bonk.getContext();
    bonkCtx.fillStyle = "#ffd8de";
    bonkCtx.fillRect(0, 4, 96, 16);
    bonkCtx.strokeStyle = "#4a3a40";
    bonkCtx.lineWidth = 2;
    bonkCtx.strokeRect(0, 4, 96, 16);
    bonk.refresh();
  }

  private createGoalTextures(): void {
    const flag = this.requireCanvasTexture("goal-flag", 86, 46);
    const ctx = flag.getContext();
    const gradient = ctx.createLinearGradient(0, 0, 86, 0);
    gradient.addColorStop(0, "#ffd060");
    gradient.addColorStop(0.5, "#fff0b2");
    gradient.addColorStop(1, "#f1ad37");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(54, 6);
    ctx.quadraticCurveTo(80, 8, 76, 22);
    ctx.quadraticCurveTo(82, 36, 48, 38);
    ctx.lineTo(0, 38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#7a4d12";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.fillRect(6, 10, 26, 6);
    flag.refresh();
  }

  private createHazardTexture(): void {
    const spikes = this.requireCanvasTexture("spikes", 96, 24);
    const ctx = spikes.getContext();
    ctx.fillStyle = "#70505f";
    ctx.fillRect(0, 18, 96, 6);
    ctx.fillStyle = "#e7edf7";
    for (let x = 0; x < 96; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x + 1, 18);
      ctx.lineTo(x + 8, 2);
      ctx.lineTo(x + 15, 18);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = "#5a6474";
    ctx.lineWidth = 2;
    for (let x = 0; x < 96; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x + 1, 18);
      ctx.lineTo(x + 8, 2);
      ctx.lineTo(x + 15, 18);
      ctx.stroke();
    }
    spikes.refresh();
  }

  private createCheckpointTexture(): void {
    const banner = this.requireCanvasTexture("checkpoint-banner", 72, 84);
    const ctx = banner.getContext();
    ctx.fillStyle = "#f4ead8";
    ctx.fillRect(6, 0, 8, 84);
    const gradient = ctx.createLinearGradient(18, 0, 70, 0);
    gradient.addColorStop(0, "#7bd0ff");
    gradient.addColorStop(1, "#4db7ff");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(18, 8);
    ctx.lineTo(66, 8);
    ctx.quadraticCurveTo(56, 24, 66, 40);
    ctx.quadraticCurveTo(56, 56, 18, 56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#23547a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(24, 14, 22, 6);
    banner.refresh();
  }

  private createParticleTexture(): void {
    const texture = this.requireCanvasTexture("dust-dot", 10, 10);
    const ctx = texture.getContext();
    ctx.fillStyle = "#fff0cf";
    ctx.beginPath();
    ctx.arc(5, 5, 4, 0, Math.PI * 2);
    ctx.fill();
    texture.refresh();
  }

  private drawEnemyFrame(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    squash: number
  ): void {
    const baseY = 28 + squash;
    const topY = 10 - squash;

    ctx.fillStyle = "#78c65f";
    ctx.beginPath();
    ctx.moveTo(offsetX + 7, baseY);
    ctx.quadraticCurveTo(offsetX + 11, topY, offsetX + 32, topY);
    ctx.quadraticCurveTo(offsetX + 53, topY, offsetX + 57, baseY);
    ctx.lineTo(offsetX + 53, 38 + squash);
    ctx.lineTo(offsetX + 44, 34 + squash);
    ctx.lineTo(offsetX + 32, 39 + squash);
    ctx.lineTo(offsetX + 20, 34 + squash);
    ctx.lineTo(offsetX + 11, 38 + squash);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#5da246";
    ctx.fillRect(offsetX + 12, 27 + squash, 40, 7);

    ctx.fillStyle = "#d6f6bd";
    ctx.fillRect(offsetX + 18, 15 + squash, 10, 6);
    ctx.fillRect(offsetX + 36, 15 + squash, 10, 6);

    ctx.fillStyle = "#252332";
    ctx.beginPath();
    ctx.arc(offsetX + 24, 24 + squash, 4, 0, Math.PI * 2);
    ctx.arc(offsetX + 40, 24 + squash, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff5ec";
    ctx.fillRect(offsetX + 22, 22 + squash, 2, 2);
    ctx.fillRect(offsetX + 38, 22 + squash, 2, 2);
  }

  private requireCanvasTexture(key: string, width: number, height: number): Phaser.Textures.CanvasTexture {
    const texture = this.textures.createCanvas(key, width, height);
    if (!texture) {
      throw new Error(`Impossibile creare la texture canvas ${key}.`);
    }
    return texture;
  }

  private drawPixelFrame(
    ctx: CanvasRenderingContext2D,
    frame: PixelFrame,
    palette: PixelPalette,
    offsetX: number,
    offsetY: number,
    pixelSize: number
  ): void {
    frame.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        const color = palette[cell];
        if (!color) {
          return;
        }
        ctx.fillStyle = color;
        ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize);
      });
    });
  }

  private fillEllipse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radiusX: number,
    radiusY: number
  ): void {
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
    ctx.closePath();
  }

  private getRapunzelFrames(): PixelFrame[] {
    const upperBody = [
      "......XXXX......",
      ".....XHGGX......",
      "....XHGGGGX.....",
      "...XHGGGGGGXX...",
      "...XGGSSSSGGGX..",
      "..XGGSEPPESGGX..",
      "..XGGGSSSSGGGX..",
      "..XGGXSSSSXGGX..",
      "..XGWDDLLDDWGX..",
      "..XWDDDLLLDDWX..",
      "..XDDDDLLLDDDX..",
      "..XDDDDLLLDDDX..",
      "..XDDDXXLLXXDX.."
    ];

    return [
      [
        ...upperBody,
        ".XDDDDGLLGDDDGX.",
        ".XDDDDGLLGDDDGX.",
        "..XDDDXXLLXXDGX.",
        "..XDDX......XGX.",
        "..XX........XX..",
        "................"
      ],
      [
        ...upperBody,
        "...XDDDLLLDDDX..",
        "..XDDDXXLLXXDDX.",
        ".XDDD......XDDX.",
        "XDDX........XDX.",
        "................"
      ],
      [
        ...upperBody,
        "...XDDDLLLDDDX..",
        "..XDDDX..LLXDDX.",
        ".XDDX....X..XDX.",
        ".XX......X...XX.",
        "....XX..XX......",
        "................"
      ],
      [
        ...upperBody,
        "..XDDDDLLLDDDX..",
        ".XDDXLL..X.XDDX.",
        ".XDX......XDDDX.",
        "XX...........XDX",
        "................"
      ],
      [
        ...upperBody,
        "....XDDLLLDDX...",
        "...XDDL..LLDDX..",
        "..XDDX....XDDX..",
        ".XX........XX...",
        "................"
      ],
      [
        ...upperBody,
        "....XDDLLLDDX...",
        "...XDDL..LLDDX..",
        "..XDDX....XDDX..",
        "..XDX......XDX..",
        ".XX..........XX.",
        "................"
      ]
    ];
  }

  private getPhuaFrames(): PixelFrame[] {
    return [
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "..XCCXXXXXXCCX..",
        "..XCCX....XCCX..",
        ".XCCX......XCCX.",
        ".XCCX......XCCX.",
        "..XX........XX..",
        "................",
        "................"
      ],
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "..XCCXXXXXXCCX..",
        ".XCCX......XCCX.",
        "XCCX........XCCX",
        ".XX..........XX.",
        "..X..........X..",
        "................",
        "................"
      ],
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "..XCCXXXXXXCCX..",
        ".XCCX......XCCX.",
        "XCC..........CCX",
        "..X..........X..",
        "................",
        "................",
        "................"
      ],
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "..XCCXXXXXXCCX..",
        ".XCCX......XCCX.",
        "XCCX........XCCX",
        ".XX..........XX.",
        "..X..........X..",
        "................",
        "................"
      ],
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "...XCCXXXXCCX...",
        "..XCCX....XCCX..",
        "...XX......XX...",
        "..X..X....X..X..",
        ".X............X.",
        "................",
        "................"
      ],
      [
        "................",
        "..XX........XX..",
        ".XPPX......XPPX.",
        ".XPPPX....XPPPX.",
        "..XPPXXXXXXPPX..",
        "...XCCXXXXCCX...",
        "..XCCXCCCCXCCX..",
        ".XCCXCECCECXCCX.",
        ".XCCCCCCNCCCCCX.",
        ".XCCCCNNNNCCCCX.",
        "..XCCCCNNCCCCX..",
        "...XCCCCCCCCX...",
        "..XCCXXXXXXCCX..",
        "...XCCX..XCCX...",
        "..XCCX....XCCX..",
        ".XCCX......XCCX.",
        "XCC..........CCX",
        "................",
        "................"
      ]
    ];
  }

  private getMulanFrames(): PixelFrame[] {
    return [
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "..XRRRDDDRRX....",
        "..XDDDX.XDDX....",
        "..XDDX...XDDX...",
        ".XDDX.....XDDX..",
        ".XWW.......WWX..",
        "..X.........X...",
        "................"
      ],
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "..XRRRDDDRRX....",
        "..XDDDX.XDDX....",
        ".XDDX.....XDDX..",
        "XDDX.......XDDX.",
        ".WW.........WW..",
        "..X.........X...",
        "................"
      ],
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "..XRRRDDDRRX....",
        "..XDDDX.XDDX....",
        ".XDDX.....XDDX..",
        "XDDX.......XDDX.",
        ".WWX.......XWW..",
        "..X.........X...",
        "................"
      ],
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "..XRRRDDDRRX....",
        "..XDDDX.XDDX....",
        "..XDDX...XDDX...",
        ".XDDX.....XDDX..",
        "XWW.........WWX.",
        ".X...........X..",
        "................"
      ],
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "..XRRRDDDRRX....",
        "...XDD...DDX....",
        "..XWWX...XWWX...",
        ".XWW.......WWX..",
        "XX...........XX.",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XHHHHX.....",
        "....XHHHHHHX....",
        "...XHHSSSSHX....",
        "...XHSESSSHX....",
        "...XHHSSSSHX....",
        "..XHHRRRRHHX....",
        "..XHRRRRRRRHX...",
        "..XRRRXXRRRX....",
        ".XRRRXXXXRRRX...",
        ".XRRRRRRRRRRX...",
        "...XRRRDDRRX....",
        "...XDDX.XDDX....",
        "..XWWX...XWWX...",
        ".XWW.......WWX..",
        "XW...........WX.",
        "................",
        "................"
      ]
    ];
  }

  private getBiancaneveFrames(): PixelFrame[] {
    return [
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYKYYYYX..",
        "..XYYYK..KYYYX..",
        "..XWWX....XWWX..",
        ".XWW......WWX...",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYYYYYYX..",
        "..XYYYYKYYKYYX..",
        ".XYYYK....KYYYX.",
        "XWWX......XWWX..",
        ".WW........WW...",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYYYYYYX..",
        ".XYYYYKYYKYYYX..",
        "XYYYK......KYYX.",
        ".WW..........WWX",
        "..X..........X..",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYYYYYYX..",
        "..XYYYYKYYKYYX..",
        ".XYYYK....KYYYX.",
        "XWWX......XWWX..",
        ".WW........WWX..",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYYYYYYX..",
        "...XYYYKYYKX....",
        "..XWWX....XWWX..",
        ".XWW......WWX...",
        "................",
        "................"
      ],
      [
        "......XXXX......",
        ".....XRRRRX.....",
        "....XRHHHHRX....",
        "...XRHSSSSHRX...",
        "...XHSESSSEHX...",
        "...XHHSSSSHHX...",
        "....XHBBBBHX....",
        "...XBBBBBBBBX...",
        "...XBBBXXBBBX...",
        "..XYYYYYYYYYYX..",
        ".XYYYYYYYYYYYYX.",
        "..XYYYYYYYYYYX..",
        "...XYYYYYYYYX...",
        "...XYYYKYYKX....",
        "..XWWX....XWWX..",
        ".XWW......WWX...",
        "XW...........WX.",
        "................",
        "................"
      ]
    ];
  }

  private getAuroraFrames(): PixelFrame[] {
    const upperBody = [
      "......XXXX......",
      ".....XHLLHX.....",
      "....XHLLLLHX....",
      "...XHLLLLLLHX...",
      "...XHLSSSSLLX...",
      "...XHSESSSEHX...",
      "...XHLLSSLLHX...",
      "...XLPPCCPPLX...",
      "..XPPPPRRPPPPX..",
      "..XPPPPPPPPPPX..",
      "..XPPPPPPPPPPX..",
      "..XPPPPPPPPPPX.."
    ];

    return [
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPRPX..",
        "..XPRPX..XPRPX..",
        ".XPPX......XPPX.",
        ".XX..........XX.",
        "................",
        "................"
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        ".XPPPX....XPPPX.",
        "XPPX........XPPX",
        ".XX..........XX.",
        "................",
        "................"
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        ".XPPP......XPPX.",
        "XPRX........XPPX",
        ".X..........X.X.",
        "..XX......XX....",
        "................"
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPRPX..XPRPX..",
        ".XPPX......XPPX.",
        "XPP..........PPX",
        ".X............X.",
        "................"
      ],
      [
        ...upperBody,
        "...XPPPPPPPPX...",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPRPX..XPRPX..",
        "..XPPX....XPPX..",
        ".XPP......PPX...",
        ".XX........XX...",
        "................"
      ],
      [
        ...upperBody,
        "...XPPPPPPPPX...",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPRPX..XPRPX..",
        ".XPPX......XPPX.",
        "XPP..........PPX",
        ".X............X.",
        "................"
      ]
    ];
  }

  private getPrincessSwordFrames(): PixelFrame[] {
    const upperBody = [
      "......XXXX......",
      ".....XCLLCX.....",
      "....XHLLLLHX....",
      "...XHLLLLLLHX...",
      "...XHLSSSSLLX...",
      "...XHSESSSEHX...",
      "...XHLLSSLLHX...",
      "...XLPPPPPPLX...",
      "..XPPPPRRPPPPX..",
      "..XPPPPPPPPPPX..",
      "..XPPPPPPPPPPX..",
      "..XPPPPPPPPPPX.."
    ];

    return [
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPPPPXXPPPPX..",
        "..XPRPXYWXPYPX..",
        ".XPPX..XYYXPPX..",
        ".XX....XYYX.XX..",
        "......XYYX......",
        "......XWWX......"
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPPPPXXPPPPX..",
        ".XPPPX..XPPPPX..",
        "XPPX...XYYXXPPX.",
        ".XX....XYYX..XX.",
        "......XYYX......",
        "......XWWX......"
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPPPPXXPPPPX..",
        ".XPPP...XPPPPX..",
        "XPRX...XYYXXPPX.",
        ".X....XYYX..X.X.",
        "..XX..XYYX.XX...",
        ".....XWWX......."
      ],
      [
        ...upperBody,
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPPPPXXPPPPX..",
        "..XPRPX..XPRPX..",
        ".XPPX...XYYXPPX.",
        "XPP....XYYX..PPX",
        ".X.....XWWX...X.",
        "................"
      ],
      [
        "............W...",
        "...........XWY..",
        "......XXXX.XWY..",
        ".....XCLCX.XWY..",
        "....XHLLLLHXW...",
        "...XHLLSSSLLHX..",
        "...XHSESSSEHX...",
        "...XHLLSSLLHX...",
        "..XPPPPRRPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "...XPPPPPPPPX...",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        "..XPRPX..XPRPX..",
        "..XPPX....XPPX..",
        ".XPP......PPX...",
        ".XX........XX...",
        "................",
        "................"
      ],
      [
        "..........W.....",
        ".........XWY....",
        "......XXXXWY....",
        ".....XCLCXWY....",
        "....XHLLLLHX....",
        "...XHLLSSLLHX...",
        "...XHSESSSEHX...",
        "...XHLLSSLLHX...",
        "..XPPPPRRPPPPX..",
        "..XPPPPPPPPPPX..",
        "..XPPPPPPPPPPX..",
        "...XPPPPPPPPX...",
        "..XPPPPPPPPPPX..",
        "..XPPPPRRPPPPX..",
        ".XPPPX....XPPX..",
        "XPPX........XPPX",
        ".XX..........XX.",
        "................",
        "................",
        "................"
      ]
    ];
  }

  private getUnicornFrames(): PixelFrame[] {
    const head = [
      "................",
      ".......HH.......",
      "......XHGH......",
      ".....XPHHHX.....",
      "....XPPWWWWX....",
      "...XPPWWWWEWX...",
      "...XWWWWWWWWX...",
      "...XWWWWWWWWX..."
    ];

    return [
      [
        ...head,
        "...XPWWWWWWPX...",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        "..XWWX....XWWX..",
        ".XSWX......XWSX.",
        ".XWX........XWX.",
        "................",
        "................",
        "................"
      ],
      [
        ...head,
        "...XPWWWWWWPX...",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        ".XWWX....XWWWX..",
        "XSWX......XWSX..",
        ".X..........X...",
        "................",
        "................",
        "................"
      ],
      [
        ...head,
        "...XPWWWWWWPX...",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        ".XWWX....XWWX...",
        "XSW......XWSX...",
        ".X........X.X...",
        "..XX....XX......",
        "................",
        "................"
      ],
      [
        ...head,
        "...XPWWWWWWPX...",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        "..XWWX....XWWX..",
        "XSW..........WSX",
        ".X............X.",
        "................",
        "................",
        "................"
      ],
      [
        "........HH......",
        ".......XHGH.....",
        "......XPHHHX....",
        ".....XPPWWWWX...",
        "....XPPWWWWEWX..",
        "....XWWWWWWWWX..",
        "...XPWWWWWWWWX..",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        "..XWWX....XWWX..",
        ".XSW......XWSX..",
        ".XWX......XWX...",
        "..X........X....",
        "................",
        "................",
        "................",
        "................",
        "................"
      ],
      [
        ".......HH.......",
        "......XHGH......",
        ".....XPHHHX.....",
        "....XPPWWWWX....",
        "...XPPWWWWEWX...",
        "...XWWWWWWWWX...",
        "...XPWWWWWWPX...",
        "..XPWWWWWWWWPX..",
        "..XWWWWWWWWWWX..",
        "..XWWWWLLWWWWX..",
        "..XWWWX..XWWWX..",
        ".XWWX....XWWWX..",
        "XSWX......XWSX..",
        ".X..........X...",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................"
      ]
    ];
  }
}
