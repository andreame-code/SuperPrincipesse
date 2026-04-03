import "./styles.css";
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { HudScene } from "./scenes/HudScene";
import { LevelScene } from "./scenes/LevelScene";
import { LevelThreeScene } from "./scenes/LevelThreeScene";
import { LevelTwoScene } from "./scenes/LevelTwoScene";
import { MenuScene } from "./scenes/MenuScene";
import { attachRuntimeBridge, registerGame } from "./runtimeState";
import { GameOverScene } from "./scenes/GameOverScene";
import { WinScene } from "./scenes/WinScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#20142b",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1100 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, CharacterSelectScene, LevelScene, LevelTwoScene, LevelThreeScene, HudScene, WinScene, GameOverScene]
};

const game = new Phaser.Game(config);
registerGame(game);
attachRuntimeBridge();
