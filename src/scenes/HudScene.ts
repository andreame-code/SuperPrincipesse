import Phaser from "phaser";
import { getLives, getScore, getSelectedCharacter } from "../gameState";
import { getLevelDefinition, type LevelId } from "../gameplay/levels";
import { getCurrentSceneKey } from "../runtimeState";

export class HudScene extends Phaser.Scene {
  private scoreText?: Phaser.GameObjects.Text;
  private livesText?: Phaser.GameObjects.Text;
  private worldText?: Phaser.GameObjects.Text;

  constructor() {
    super("hud");
  }

  create(): void {
    const panel = this.add.container(0, 0).setScrollFactor(0);
    panel.add(this.add.rectangle(174, 42, 330, 64, 0x2d1c40, 0.88).setStrokeStyle(3, 0xffd889, 0.95));
    panel.add(this.add.rectangle(812, 42, 268, 64, 0x2d1c40, 0.88).setStrokeStyle(3, 0xffd889, 0.95));

    this.worldText = this.add.text(34, 14, "", {
      fontFamily: "Georgia",
      fontSize: "18px",
      color: "#ffe4a9"
    });
    panel.add(this.worldText);

    panel.add(
      this.add.text(676, 14, getSelectedCharacter().name, {
        fontFamily: "Georgia",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#fff4ce"
      })
    );

    panel.add(
      this.add.text(676, 36, "F1 hitbox", {
        fontFamily: "Georgia",
        fontSize: "14px",
        color: "#eed7ff"
      })
    );

    this.scoreText = this.add.text(34, 36, "", {
      fontFamily: "Georgia",
      fontSize: "20px",
      color: "#fff8ea"
    });

    this.livesText = this.add.text(188, 36, "", {
      fontFamily: "Georgia",
      fontSize: "20px",
      color: "#f8e1ff"
    });

    panel.add([this.scoreText, this.livesText]);

    this.refresh();
    this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => this.refresh()
    });
  }

  private refresh(): void {
    const sceneKey = getCurrentSceneKey() as LevelId;
    const worldLabel = sceneKey.startsWith("level-") ? getLevelDefinition(sceneKey).worldLabel : "Mondo";
    this.worldText?.setText(worldLabel);
    this.scoreText?.setText(`Lanterne ${getScore()}`);
    this.livesText?.setText(`Vita ${getLives()}`);
  }
}
