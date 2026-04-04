import "./styles.css";
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { HudScene } from "./scenes/HudScene";
import { LevelScene } from "./scenes/LevelScene";
import { LevelFourScene } from "./scenes/LevelFourScene";
import { LevelThreeScene } from "./scenes/LevelThreeScene";
import { LevelTwoScene } from "./scenes/LevelTwoScene";
import { MenuScene } from "./scenes/MenuScene";
import { attachRuntimeBridge, registerGame } from "./runtimeState";
import { GameOverScene } from "./scenes/GameOverScene";
import { WinScene } from "./scenes/WinScene";

function renderFatalError(message: string): void {
  const app = document.getElementById("app") ?? document.body;
  app.innerHTML = `
    <div style="
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: linear-gradient(180deg, #2a173a 0%, #140d1d 100%);
      color: #fff4df;
      font-family: Georgia, serif;
    ">
      <div style="
        max-width: 760px;
        padding: 24px 28px;
        border-radius: 18px;
        border: 3px solid rgba(255, 216, 131, 0.75);
        background: rgba(30, 19, 44, 0.94);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
      ">
        <h1 style="margin: 0 0 12px; font-size: 34px;">Errore di Avvio</h1>
        <p style="margin: 0 0 14px; font-size: 18px; line-height: 1.5;">
          Il gioco non e riuscito a partire. Il messaggio tecnico e riportato qui sotto.
        </p>
        <pre style="
          margin: 0;
          padding: 16px;
          border-radius: 12px;
          background: #120d18;
          color: #ffd9cc;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 15px;
        ">${message}</pre>
      </div>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  renderFatalError(event.error?.stack ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason =
    event.reason instanceof Error
      ? event.reason.stack ?? event.reason.message
      : typeof event.reason === "string"
        ? event.reason
        : JSON.stringify(event.reason, null, 2);
  renderFatalError(reason);
});

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
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
  scene: [BootScene, MenuScene, CharacterSelectScene, LevelScene, LevelTwoScene, LevelThreeScene, LevelFourScene, HudScene, WinScene, GameOverScene]
};

try {
  const game = new Phaser.Game(config);
  registerGame(game);
  attachRuntimeBridge();
} catch (error) {
  renderFatalError(error instanceof Error ? error.stack ?? error.message : String(error));
}
