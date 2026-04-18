import Phaser from "phaser";
import { characters, resetRunState, setSelectedCharacter } from "../gameState";
import { getLevelDefinition, type LevelId } from "../gameplay/levels";
import { setCurrentScene, setRunStatus } from "../runtimeState";

export class CharacterSelectScene extends Phaser.Scene {
  private index = 0;
  private cards: Phaser.GameObjects.Container[] = [];
  private readonly levelIds: LevelId[] = ["level-1", "level-2", "level-3", "level-4"];
  private levelIndex = 0;
  private levelButtons: Phaser.GameObjects.Container[] = [];

  constructor() {
    super("character-select");
  }

  create(): void {
    setCurrentScene("character-select");
    setRunStatus("select");
    this.index = 0;
    this.levelIndex = 0;
    this.cards = [];
    this.levelButtons = [];
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

    const spacing = characters.length > 5 ? 160 : 182;
    const startX = width / 2 - ((characters.length - 1) * spacing) / 2;
    characters.forEach((character, idx) => {
      const card = this.createCard(startX + idx * spacing, height / 2 + 8, character);
      this.cards.push(card);
    });

    this.add
      .text(width / 2, 468, "Sinistra/Destra per scegliere il personaggio", {
        fontFamily: "Georgia",
        fontSize: "18px",
        color: "#f8e4bc"
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, 494, "1-4 per partire subito dal livello scelto, INVIO per confermare", {
        fontFamily: "Georgia",
        fontSize: "17px",
        color: "#d9f1ff"
      })
      .setOrigin(0.5);

    this.createLevelQuickSelect(width / 2, 534);

    this.refreshSelection();
    this.input.keyboard?.on("keydown-LEFT", () => this.moveSelection(-1));
    this.input.keyboard?.on("keydown-RIGHT", () => this.moveSelection(1));
    this.input.keyboard?.on("keydown-UP", () => this.moveLevelSelection(-1));
    this.input.keyboard?.on("keydown-DOWN", () => this.moveLevelSelection(1));
    this.levelIds.forEach((levelId, idx) => {
      const keyCode = Phaser.Input.Keyboard.KeyCodes.ONE + idx;
      this.input.keyboard?.on(`keydown-${idx + 1}`, () => this.selectLevel(levelId));
      this.input.keyboard?.addKey(keyCode);
    });
    this.input.keyboard?.on("keydown-ENTER", () => this.confirmSelection());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners();
      this.cards = [];
      this.levelButtons = [];
    });
  }

  private createCard(
    x: number,
    y: number,
    character: (typeof characters)[number]
  ): Phaser.GameObjects.Container {
    const frame = this.add.rectangle(0, 0, 168, 288, 0x2b1e3d, 0.95).setStrokeStyle(3, 0x835c9d);
    const plate = this.add.rectangle(0, -60, 132, 126, 0x3d2b52, 1).setStrokeStyle(2, 0xf6d38a);

    const portraitKey = `${character.id}-card`;
    const portrait = this.textures.exists(portraitKey)
      ? this.add.image(0, -64, portraitKey).setScale(0.8)
      : this.add.rectangle(0, -64, 110, 110, 0x445067, 1);

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

  private createLevelQuickSelect(x: number, y: number): void {
    const spacing = 132;
    const startX = x - ((this.levelIds.length - 1) * spacing) / 2;

    this.levelIds.forEach((levelId, idx) => {
      const definition = getLevelDefinition(levelId);
      const frame = this.add.rectangle(0, 0, 116, 42, 0x2b4761, 0.92).setStrokeStyle(2, 0x7fdfff);
      const text = this.add
        .text(0, 0, definition.worldLabel.replace("Mondo ", ""), {
          fontFamily: "Georgia",
          fontSize: "18px",
          fontStyle: "bold",
          color: "#f7fdff"
        })
        .setOrigin(0.5);

      const button = this.add.container(startX + idx * spacing, y, [frame, text]);
      button.setSize(116, 42);
      button.setInteractive(new Phaser.Geom.Rectangle(-58, -21, 116, 42), Phaser.Geom.Rectangle.Contains);
      button.on("pointerup", () => {
        this.levelIndex = idx;
        this.refreshSelection();
      });
      button.on("pointerdown", () => {
        this.levelIndex = idx;
        this.refreshSelection();
      });
      button.on("pointerdblclick", () => {
        this.levelIndex = idx;
        this.refreshSelection();
        this.confirmSelection();
      });

      this.levelButtons.push(button);
    });
  }

  private moveSelection(direction: number): void {
    this.index = Phaser.Math.Wrap(this.index + direction, 0, characters.length);
    this.refreshSelection();
  }

  private moveLevelSelection(direction: number): void {
    this.levelIndex = Phaser.Math.Wrap(this.levelIndex + direction, 0, this.levelIds.length);
    this.refreshSelection();
  }

  private selectLevel(levelId: LevelId): void {
    this.levelIndex = this.levelIds.indexOf(levelId);
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

    this.levelButtons.forEach((button, idx) => {
      const selected = idx === this.levelIndex;
      const frame = button.list[0] as Phaser.GameObjects.Rectangle;
      frame.setFillStyle(selected ? 0x3e6980 : 0x2b4761);
      frame.setStrokeStyle(selected ? 4 : 2, selected ? 0xffe5a3 : 0x7fdfff);
      button.setScale(selected ? 1.05 : 1);
      button.y = selected ? 530 : 534;
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
    this.scene.start(this.levelIds[this.levelIndex]);
    this.scene.launch("hud");
  }
}
