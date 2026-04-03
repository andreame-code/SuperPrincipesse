import Phaser from "phaser";
import { setCurrentScene, setRunStatus } from "../runtimeState";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create(): void {
    setCurrentScene("menu");
    setRunStatus("menu");
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1b1230");
    this.add.rectangle(width / 2, height / 2, width, height, 0x1b1230, 1);

    const skyGlow = this.add.graphics();
    skyGlow.fillGradientStyle(0xffd690, 0xffd690, 0x4e3476, 0x4e3476, 0.45);
    skyGlow.fillRect(0, 0, width, height);

    this.createCloudBand(0.18, 0.25, 1.1);
    this.createCloudBand(0.33, 0.4, 0.8);

    const towerLeft = this.add.rectangle(92, 360, 150, 360, 0x3d294f, 1).setAlpha(0.95);
    const towerRight = this.add.rectangle(860, 330, 190, 420, 0x341f47, 1).setAlpha(0.95);
    towerLeft.setOrigin(0.5, 0.5);
    towerRight.setOrigin(0.5, 0.5);

    this.add.circle(172, 146, 74, 0xffe4a2, 0.16);
    this.add.circle(794, 104, 66, 0xffd585, 0.12);

    this.add
      .text(width / 2, 96, "SUPER PRINCIPESSE", {
        fontFamily: "Georgia",
        fontSize: "58px",
        fontStyle: "bold",
        color: "#fff3cb",
        stroke: "#7b4e18",
        strokeThickness: 8
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 154, "Primo livello: la Fuga dalla Torre Dorata", {
        fontFamily: "Georgia",
        fontSize: "24px",
        color: "#f9d8ff"
      })
      .setOrigin(0.5);

    const panel = this.add.container(width / 2, 304);
    const panelBg = this.add.rectangle(0, 0, 620, 196, 0x2b1c3f, 0.94).setStrokeStyle(4, 0xffd883, 0.95);
    const portrait = this.add.image(-206, -2, "rapunzel-card").setScale(1.4);
    const copy = this.add
      .text(
        48,
        -14,
        "Un platform fiabesco offline, con personaggi selezionabili,\ncontrolli piu rifiniti e una prima avventura davvero giocabile.",
        {
          fontFamily: "Georgia",
          fontSize: "24px",
          color: "#fffaf0",
          align: "left",
          lineSpacing: 10,
          wordWrap: { width: 420 }
        }
      )
      .setOrigin(0.5);
    const subcopy = this.add
      .text(52, 62, "Scegli il tuo eroe, raccogli lanterne, evita le melme e raggiungi il vessillo.", {
        fontFamily: "Georgia",
        fontSize: "18px",
        color: "#ffe3b7",
        align: "center",
        wordWrap: { width: 420 }
      })
      .setOrigin(0.5);
    panel.add([panelBg, portrait, copy, subcopy]);

    const startButton = this.add
      .container(width / 2, 456)
      .setSize(340, 64)
      .setInteractive(new Phaser.Geom.Rectangle(-170, -32, 340, 64), Phaser.Geom.Rectangle.Contains);

    const buttonBg = this.add.rectangle(0, 0, 340, 64, 0xffd27a, 1).setStrokeStyle(3, 0x6d4718);
    const buttonText = this.add
      .text(0, 0, "INIZIA L'AVVENTURA", {
        fontFamily: "Georgia",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#33200d"
      })
      .setOrigin(0.5);
    startButton.add([buttonBg, buttonText]);

    startButton.on("pointerover", () => {
      buttonBg.setFillStyle(0xffe39c);
      startButton.setScale(1.02);
    });
    startButton.on("pointerout", () => {
      buttonBg.setFillStyle(0xffd27a);
      startButton.setScale(1);
    });
    startButton.on("pointerup", () => {
      this.scene.start("character-select");
    });

    this.add
      .text(width / 2, 510, "INVIO per iniziare", {
        fontFamily: "Georgia",
        fontSize: "18px",
        color: "#f6deff"
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: portrait,
      y: portrait.y - 8,
      duration: 1700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("character-select");
    });
  }

  private createCloudBand(scrollFactor: number, alpha: number, speedFactor: number): void {
    const positions = [
      { x: 120, y: 98, scale: 0.85 },
      { x: 360, y: 138, scale: 1.1 },
      { x: 680, y: 116, scale: 0.95 },
      { x: 920, y: 148, scale: 0.8 }
    ];

    positions.forEach((position, index) => {
      const cloud = this.add.image(position.x, position.y, "cloud").setScale(position.scale).setAlpha(alpha);
      cloud.setScrollFactor(scrollFactor);

      this.tweens.add({
        targets: cloud,
        x: cloud.x - (80 + index * 12),
        duration: 12000 / speedFactor + index * 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    });
  }
}
