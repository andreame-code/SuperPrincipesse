import Phaser from "phaser";
import { characters, resetRunState, setSelectedCharacter } from "../gameState";
import { setCurrentScene, setRunStatus } from "../runtimeState";

export class CharacterSelectScene extends Phaser.Scene {
  private index = 0;
  private cards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super("character-select");
  }

  create(): void {
    setCurrentScene("character-select");
    setRunStatus("select");
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#1c122d");
    this.add.rectangle(width / 2, height / 2, width, height, 0x1c122d, 1);

    const glow = this.add.graphics();
    glow.fillGradientStyle(0x5d3074, 0x5d3074, 0x180f27, 0x180f27, 0.38);
    glow.fillRect(0, 0, width, height);

    this.add
      .text(width / 2, 60, "Selezione Eroe", {
        fontFamily: "Georgia",
        fontSize: "42px",
        color: "#fff0c0",
        stroke: "#6c4512",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 102, "Ogni personaggio ha silhouette, ritmo e fisica diversi.", {
        fontFamily: "Georgia",
        fontSize: "17px",
        color: "#f3ddff"
      })
      .setOrigin(0.5);

    const spacing = 182;
    const startX = width / 2 - ((characters.length - 1) * spacing) / 2;
    characters.forEach((character, idx) => {
      const card = this.createCard(startX + idx * spacing, height / 2 + 8, character);
      this.cards.push(card);
    });

    this.add
      .text(width / 2, 500, "Sinistra/Destra per scegliere, INVIO per confermare", {
        fontFamily: "Georgia",
        fontSize: "18px",
        color: "#f8e4bc"
      })
      .setOrigin(0.5);

    this.refreshSelection();
    this.input.keyboard?.on("keydown-LEFT", () => this.moveSelection(-1));
    this.input.keyboard?.on("keydown-RIGHT", () => this.moveSelection(1));
    this.input.keyboard?.on("keydown-ENTER", () => this.confirmSelection());
  }

  private createCard(
    x: number,
    y: number,
    character: (typeof characters)[number]
  ): Phaser.GameObjects.Container {
    const frame = this.add.rectangle(0, 0, 168, 288, 0x2b1e3d, 0.95).setStrokeStyle(3, 0x835c9d);
    const plate = this.add.rectangle(0, -60, 132, 126, 0x3d2b52, 1).setStrokeStyle(2, 0xf6d38a);

    let portrait: Phaser.GameObjects.GameObject;
    if (character.id === "rapunzel") {
      portrait = this.add.image(0, -64, "rapunzel-card").setScale(0.8);
    } else if (character.id === "phua") {
      portrait = this.add.image(0, -64, "phua-card").setScale(0.8);
    } else if (character.id === "mulan") {
      portrait = this.add.image(0, -64, "mulan-card").setScale(0.8);
    } else if (character.id === "biancaneve") {
      portrait = this.add.image(0, -64, "biancaneve-card").setScale(0.8);
    } else {
      portrait = this.add.rectangle(0, -64, 110, 110, 0x445067, 1);
    }

    const name = this.add
      .text(0, 52, character.name, {
        fontFamily: "Georgia",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#fff0c0"
      })
      .setOrigin(0.5);

    const title = this.add
      .text(0, 86, character.title, {
        fontFamily: "Georgia",
        fontSize: "13px",
        color: "#f2dcff",
        align: "center",
        wordWrap: { width: 136 }
      })
      .setOrigin(0.5);

    const description = this.add
      .text(0, 144, character.description, {
        fontFamily: "Georgia",
        fontSize: "13px",
        color: "#fff7ed",
        align: "center",
        wordWrap: { width: 140 },
        lineSpacing: 5
      })
      .setOrigin(0.5);

    const status = this.add
      .text(0, 114, character.unlocked ? "Pronta" : "Bloccata", {
        fontFamily: "Georgia",
        fontSize: "13px",
        color: character.unlocked ? "#bafab0" : "#d8dce7",
        backgroundColor: character.unlocked ? "#23462e" : "#404c60",
        padding: { x: 8, y: 4 }
      })
      .setOrigin(0.5);

    const card = this.add.container(x, y, [frame, plate, portrait, name, title, status, description]);
    card.setSize(168, 288);
    card.setInteractive(new Phaser.Geom.Rectangle(-84, -144, 168, 288), Phaser.Geom.Rectangle.Contains);
    card.on("pointerup", () => {
      this.index = characters.indexOf(character);
      this.refreshSelection();
      this.confirmSelection();
    });

    return card;
  }

  private moveSelection(direction: number): void {
    this.index = Phaser.Math.Wrap(this.index + direction, 0, characters.length);
    this.refreshSelection();
  }

  private refreshSelection(): void {
    this.cards.forEach((card, idx) => {
      const selected = idx === this.index;
      card.setScale(selected ? 1.06 : 0.98);
      const frame = card.list[0] as Phaser.GameObjects.Rectangle;
      const plate = card.list[1] as Phaser.GameObjects.Rectangle;
      frame.setFillStyle(selected ? 0x38264d : 0x2b1e3d);
      frame.setStrokeStyle(selected ? 5 : 3, selected ? 0xffd37d : 0x835c9d);
      plate.setFillStyle(selected ? 0x4e3568 : 0x3d2b52);
      card.y = selected ? this.scale.height / 2 : this.scale.height / 2 + 8;
    });
  }

  private confirmSelection(): void {
    const character = characters[this.index];
    if (!character.unlocked) {
      this.cameras.main.shake(120, 0.004);
      return;
    }

    setSelectedCharacter(character.id);
    resetRunState();
    this.scene.start("level-1");
    this.scene.launch("hud");
  }
}
