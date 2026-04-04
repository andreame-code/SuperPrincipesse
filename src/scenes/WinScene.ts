import Phaser from "phaser";
import { getScore, getSelectedCharacter } from "../gameState";
import { setCurrentScene, setRunStatus } from "../runtimeState";

export class WinScene extends Phaser.Scene {
  constructor() {
    super("win");
  }

  create(data?: {
    completedLevelKey?: string;
    completedLevelLabel?: string;
    nextLevelKey?: string;
    nextLevelLabel?: string;
  }): void {
    setCurrentScene("win");
    setRunStatus("won");

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#1c1431");
    this.add.rectangle(width / 2, height / 2, width, height, 0x1c1431, 0.94);
    this.add.circle(width / 2, 126, 96, 0xffdd97, 0.22);

    this.add
      .text(width / 2, 96, "Livello Completato!", {
        fontFamily: "Georgia",
        fontSize: "52px",
        fontStyle: "bold",
        color: "#fff1c5",
        stroke: "#754915",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 160, `${getSelectedCharacter().name} ha raggiunto il vessillo della torre.`, {
        fontFamily: "Georgia",
        fontSize: "22px",
        color: "#f8e4ff"
      })
      .setOrigin(0.5);

    const panel = this.add.container(width / 2, 292);
    panel.add(this.add.rectangle(0, 0, 470, 166, 0x2d2140, 0.95).setStrokeStyle(4, 0xffd889, 0.95));
    panel.add(
      this.add
        .text(0, -26, `Lanterne raccolte: ${getScore()}`, {
          fontFamily: "Georgia",
          fontSize: "28px",
          color: "#fff8ea"
        })
        .setOrigin(0.5)
    );
    panel.add(
      this.add
        .text(
          0,
          28,
          data?.nextLevelKey
            ? `${data.completedLevelLabel ?? "Livello"} completato.\nIl viaggio continua in ${data.nextLevelLabel}.`
            : `${data?.completedLevelLabel ?? "Livello"} completato.\nPer ora questa avventura finisce qui.`,
          {
          fontFamily: "Georgia",
          fontSize: "20px",
          color: "#ffe8b7",
          align: "center",
          lineSpacing: 10
          }
        )
        .setOrigin(0.5)
    );

    const restart = this.add
      .text(width / 2, 438, data?.nextLevelKey ? "INVIO per il prossimo livello" : "INVIO per tornare al menu", {
        fontFamily: "Georgia",
        fontSize: "24px",
        color: "#2f220f",
        backgroundColor: "#ffd37f",
        padding: { x: 20, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const continueFlow = () => {
      if (data?.nextLevelKey) {
        this.scene.start(data.nextLevelKey);
        this.scene.launch("hud");
        return;
      }

      this.scene.start("menu");
    };

    restart.on("pointerup", continueFlow);
    this.input.keyboard?.once("keydown-ENTER", continueFlow);
  }
}
