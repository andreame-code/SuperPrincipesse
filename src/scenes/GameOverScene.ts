import Phaser from "phaser";
import { getSelectedCharacter } from "../gameState";
import { setCurrentScene, setRunStatus } from "../runtimeState";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create(): void {
    setCurrentScene("game-over");
    setRunStatus("lost");

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#190f1f");
    this.add.rectangle(width / 2, height / 2, width, height, 0x190f1f, 0.95);

    this.add
      .text(width / 2, 124, "Game Over", {
        fontFamily: "Georgia",
        fontSize: "56px",
        fontStyle: "bold",
        color: "#ffd2c7",
        stroke: "#5e2217",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 190, `${getSelectedCharacter().name} dovra riprovare il percorso della torre.`, {
        fontFamily: "Georgia",
        fontSize: "22px",
        color: "#f6dff8"
      })
      .setOrigin(0.5);

    this.add.rectangle(width / 2, 298, 500, 144, 0x2c1d35, 0.95).setStrokeStyle(4, 0xffa49a, 0.9);
    this.add
      .text(width / 2, 286, "Hai perso tutte le vite del primo livello.\nPremi INVIO per tornare al menu e ripartire.", {
        fontFamily: "Georgia",
        fontSize: "24px",
        color: "#fff7ec",
        align: "center",
        lineSpacing: 12
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(width / 2, 430, "TORNA AL MENU", {
        fontFamily: "Georgia",
        fontSize: "24px",
        color: "#25120b",
        backgroundColor: "#ffc7b2",
        padding: { x: 18, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    restart.on("pointerup", () => this.scene.start("menu"));
    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("menu"));
  }
}
