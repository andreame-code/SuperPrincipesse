import Phaser from "phaser";
import { addScore, getLives, getSelectedCharacter, loseLife, type CharacterPhysics } from "../gameState";
import { getLevelDefinition, type LevelDefinition, type LevelId } from "../gameplay/levels";
import { registerLevelScene, setCurrentScene, setRunStatus } from "../runtimeState";
import { type MovingPlatform, type Segment, type Spawn } from "../gameplay/levelLayout";
import { stepMovement } from "../gameplay/movement";

export class LevelScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerGlow?: Phaser.GameObjects.Ellipse;
  private playerShadow?: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey?: Phaser.Input.Keyboard.Key;
  private debugKey?: Phaser.Input.Keyboard.Key;
  private wasd!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
  };
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bossOrbs!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private goalZone?: Phaser.GameObjects.Zone;
  private goalFlag?: Phaser.GameObjects.Image;
  private checkpointZone?: Phaser.GameObjects.Zone;
  private bossTriggerZone?: Phaser.GameObjects.Zone;
  private bossGateCollider?: Phaser.GameObjects.Zone;
  private bossGateVisual?: Phaser.GameObjects.Container;
  private bossHudText?: Phaser.GameObjects.Text;
  private bossHintText?: Phaser.GameObjects.Text;
  private boss?: Phaser.Physics.Arcade.Sprite;
  private debugGraphics?: Phaser.GameObjects.Graphics;
  private debugEnabled = false;
  private facing: 1 | -1 = 1;
  private invulnerable = false;
  private selectedCharacter = getSelectedCharacter();
  private physicsProfile!: CharacterPhysics;
  private levelDefinition!: LevelDefinition;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private airJumpsUsed = 0;
  private wasGrounded = false;
  private runDustCooldown = 0;
  private respawnPoint = { x: 0, y: 0 };
  private checkpointActivated = false;
  private bossStarted = false;
  private bossDefeated = false;
  private bossHp = 0;
  private bossOrbIndex = 0;

  constructor(sceneKey = "level-1") {
    super(sceneKey);
  }

  create(): void {
    this.levelDefinition = getLevelDefinition(this.scene.key as LevelId);
    this.selectedCharacter = getSelectedCharacter();
    this.physicsProfile = this.selectedCharacter.physics;
    this.respawnPoint = { ...this.levelDefinition.playerSpawn };
    this.checkpointActivated = false;
    setCurrentScene(this.levelDefinition.id);
    setRunStatus("playing");
    registerLevelScene(this);

    this.cameras.main.setBackgroundColor(Phaser.Display.Color.IntegerToColor(this.levelDefinition.skyTop).rgba);
    this.physics.world.setBounds(0, 0, this.levelDefinition.length, 540);
    this.cameras.main.setBounds(0, 0, this.levelDefinition.length, 540);

    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.enemies = this.physics.add.group();
    this.bossOrbs = this.physics.add.group({ allowGravity: false, immovable: true });
    this.hazards = this.physics.add.staticGroup();
    this.debugGraphics = this.add.graphics().setDepth(1000);

    this.drawBackdrop();
    this.createPlatforms();
    this.createDecorations();
    this.createPlayer();
    this.createCollectibles();
    this.createEnemies();
    this.createGoal();
    this.createBossSetup();

    this.cameras.main.startFollow(this.player, true, 0.1, 0.08);
    this.cameras.main.setDeadzone(180, 120);

    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.jumpKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.debugKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F1);
    this.wasd = {
      left: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A) as Phaser.Input.Keyboard.Key,
      right: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D) as Phaser.Input.Keyboard.Key,
      up: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W) as Phaser.Input.Keyboard.Key,
      down: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S) as Phaser.Input.Keyboard.Key
    };

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);

    this.physics.add.overlap(this.player, this.collectibles, (_player, collectible) => {
      collectible.destroy();
      addScore(1);
      this.spawnPickupSparkle((collectible as Phaser.GameObjects.Image).x, (collectible as Phaser.GameObjects.Image).y);
    });

    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      this.handleEnemyContact(enemy as Phaser.Physics.Arcade.Sprite);
    });
    this.physics.add.overlap(this.player, this.bossOrbs, (_player, orb) => {
      this.handleBossOrbCollected(orb as Phaser.Physics.Arcade.Image);
    });
    this.physics.add.overlap(this.player, this.hazards, () => {
      this.handlePlayerHit(true);
    });

    if (this.bossTriggerZone) {
      this.physics.add.overlap(this.player, this.bossTriggerZone, () => {
        this.startBossEncounter();
      });
    }

    if (this.checkpointZone) {
      this.physics.add.overlap(this.player, this.checkpointZone, () => {
        if (this.checkpointActivated) {
          return;
        }
        this.checkpointActivated = true;
        this.respawnPoint = { x: this.levelDefinition.checkpointPosition.x, y: this.levelDefinition.playerSpawn.y };
        this.spawnPickupSparkle(this.levelDefinition.checkpointPosition.x, this.levelDefinition.checkpointPosition.y - 40);
      });
    }

    if (this.goalZone) {
      this.physics.add.overlap(this.player, this.goalZone, () => {
        this.cameras.main.flash(250, 255, 244, 208);
        this.time.delayedCall(220, () => {
          this.scene.stop("hud");
          const nextLevelKey =
            this.levelDefinition.id === "level-1"
              ? "level-2"
              : this.levelDefinition.id === "level-2"
                ? "level-3"
                : this.levelDefinition.id === "level-3"
                  ? "level-4"
                : undefined;
          this.scene.start("win", {
            completedLevelKey: this.levelDefinition.id,
            completedLevelLabel: this.levelDefinition.worldLabel,
            nextLevelKey,
            nextLevelLabel: nextLevelKey ? getLevelDefinition(nextLevelKey).worldLabel : undefined
          });
        });
      });
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      registerLevelScene(undefined);
    });
  }

  update(_time: number, delta: number): void {
    if (this.debugKey && Phaser.Input.Keyboard.JustDown(this.debugKey)) {
      this.debugEnabled = !this.debugEnabled;
    }

    this.handleMovement(delta);
    this.updateMovingPlatforms();
    this.updateEnemies();
    this.updateAnimation();
    this.updatePlayerPresentation();
    this.updateCollectibles();
    this.renderDebugOverlay();

    if (this.player.y > 620) {
      this.handlePlayerHit(true);
    }
  }

  private isUnderwaterLevel(): boolean {
    return this.levelDefinition.environment === "underwater";
  }

  private drawBackdrop(): void {
    if (this.isUnderwaterLevel()) {
      const sky = this.add.graphics();
      sky.fillGradientStyle(
        this.levelDefinition.skyTop,
        this.levelDefinition.skyTop,
        this.levelDefinition.skyBottom,
        this.levelDefinition.skyBottom,
        1
      );
      sky.fillRect(0, 0, this.levelDefinition.length, 540);
      sky.setScrollFactor(0);

      const waterVeil = this.add.graphics();
      waterVeil.fillStyle(0x7ce4f1, 0.16);
      waterVeil.fillRect(0, 0, this.levelDefinition.length, 540);
      waterVeil.setScrollFactor(0);

      [180, 540, 940, 1320, 1760, 2240, 2720, 3200, 3640].forEach((x, index) => {
        const ray = this.add.rectangle(x, 0, 120 + (index % 3) * 20, 540, 0xcfffff, 0.08).setOrigin(0.5, 0);
        ray.setScrollFactor(0.03);
        ray.setRotation(-0.08 + index * 0.012);
      });

      this.createMountainRange(
        0.1,
        468,
        this.levelDefinition.mountainFar,
        [0, 280, 600, 950, 1310, 1680, 2030, 2420, 2820, 3220, 3620, this.levelDefinition.length]
      );
      this.createMountainRange(
        0.18,
        500,
        this.levelDefinition.mountainNear,
        [0, 210, 480, 780, 1090, 1400, 1740, 2090, 2450, 2810, 3160, 3520, this.levelDefinition.length]
      );

      [140, 420, 760, 1110, 1490, 1880, 2230, 2590, 2950, 3340, 3720].forEach((x, index) => {
        const bubble = this.add.circle(x, 430 - (index % 4) * 46, 6 + (index % 3), 0xdafcff, 0.18);
        bubble.setScrollFactor(0.16);
        this.tweens.add({
          targets: bubble,
          y: bubble.y - 120 - (index % 3) * 20,
          alpha: 0.04,
          duration: 3800 + index * 140,
          repeat: -1,
          delay: index * 110
        });
      });

      return;
    }

    const sky = this.add.graphics();
    sky.fillGradientStyle(
      this.levelDefinition.skyTop,
      this.levelDefinition.skyTop,
      this.levelDefinition.skyBottom,
      this.levelDefinition.skyBottom,
      1
    );
    sky.fillRect(0, 0, this.levelDefinition.length, 540);
    sky.setScrollFactor(0);

    const haze = this.add.graphics();
    haze.fillStyle(0xffffff, 0.07);
    haze.fillRect(0, 310, this.levelDefinition.length, 140);
    haze.setScrollFactor(0.04);

    this.add.circle(240, 108, 54, this.levelDefinition.sunColor, 0.38).setScrollFactor(0.03);
    this.add.circle(252, 108, 84, this.levelDefinition.sunColor, 0.12).setScrollFactor(0.03);

    this.createCloudLayer(0.12, 0.58, [
      { x: 180, y: 88, scale: 0.88 },
      { x: 610, y: 126, scale: 1.12 },
      { x: 1050, y: 96, scale: 0.95 },
      { x: 1540, y: 116, scale: 1.06 },
      { x: 2010, y: 86, scale: 0.82 },
      { x: 2470, y: 134, scale: 1.1 },
      { x: 2930, y: 100, scale: 0.9 }
    ]);

    this.createCloudLayer(0.22, 0.38, [
      { x: 120, y: 152, scale: 0.72 },
      { x: 740, y: 178, scale: 0.84 },
      { x: 1360, y: 166, scale: 0.9 },
      { x: 2140, y: 188, scale: 0.78 },
      { x: 2880, y: 172, scale: 0.86 }
    ]);

    this.createMountainRange(
      0.18,
      460,
      this.levelDefinition.mountainFar,
      [0, 290, 560, 920, 1210, 1530, 1850, 2190, 2510, 2830, this.levelDefinition.length]
    );
    this.createMountainRange(
      0.28,
      492,
      this.levelDefinition.mountainNear,
      [0, 210, 430, 720, 980, 1280, 1590, 1880, 2210, 2530, 2850, this.levelDefinition.length]
    );
    this.createTowerSilhouettes();
  }

  private createCloudLayer(
    scrollFactor: number,
    alpha: number,
    clouds: Array<{ x: number; y: number; scale: number }>
  ): void {
    clouds.forEach((cloud, index) => {
      const sprite = this.add.image(cloud.x, cloud.y, "cloud").setScale(cloud.scale).setAlpha(alpha);
      sprite.setScrollFactor(scrollFactor);

      this.tweens.add({
        targets: sprite,
        x: sprite.x - 60 - index * 5,
        duration: 10000 + index * 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    });
  }

  private createMountainRange(scrollFactor: number, baseline: number, color: number, points: number[]): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.beginPath();
    graphics.moveTo(points[0], 540);
    points.forEach((point, index) => {
      const peak = baseline - (index % 2 === 0 ? 60 : 140);
      graphics.lineTo(point, peak);
    });
    graphics.lineTo(points[points.length - 1], 540);
    graphics.closePath();
    graphics.fillPath();
    graphics.setScrollFactor(scrollFactor);
  }

  private createTowerSilhouettes(): void {
    [190, 880, 1460, 2120, 2820].forEach((x, index) => {
      const tower = this.add.container(x, 330);
      tower.setScrollFactor(0.34);
      tower.add(this.add.rectangle(0, 64, 110 + (index % 2) * 26, 260, 0x433156, 0.95));
      tower.add(this.add.rectangle(0, -82, 140 + (index % 2) * 30, 56, 0x5b446f, 0.95));
      tower.add(this.add.rectangle(-18, 20, 18, 28, 0xffdd8f, 0.32));
      tower.add(this.add.rectangle(20, 20, 18, 28, 0xffdd8f, 0.32));
    });
  }

  private createPlatforms(): void {
    this.levelDefinition.groundSegments.forEach((segment) => {
      this.createGroundSegment(segment);
    });

    this.levelDefinition.boardPlatforms.forEach((platform) => {
      this.createBoardPlatform(platform);
    });

    this.levelDefinition.movingPlatforms.forEach((platform) => {
      this.createMovingPlatform(platform);
    });
  }

  private createGroundSegment(segment: Segment): void {
    const height = segment.height ?? 100;
    const top = this.add.tileSprite(segment.x, segment.y, segment.width, 24, "ground-top");
    top.setOrigin(0.5, 0);
    if (this.isUnderwaterLevel()) {
      top.setTint(0x4e9078);
    }

    const fill = this.add.tileSprite(segment.x, segment.y + 24, segment.width, height - 24, "ground-fill");
    fill.setOrigin(0.5, 0);
    if (this.isUnderwaterLevel()) {
      fill.setTint(0x315d62);
    }

    const collider = this.add.zone(segment.x, segment.y + height / 2, segment.width, height);
    this.physics.add.existing(collider, true);
    this.platforms.add(collider);
  }

  private createBoardPlatform(platform: Segment): void {
    const board = this.add.tileSprite(platform.x, platform.y, platform.width, 28, "platform-board");
    board.setOrigin(0.5, 0.5);
    if (this.isUnderwaterLevel()) {
      board.setTint(0x80b8b8);
    }
    const supportHeight = Phaser.Math.Between(34, 52);
    this.add
      .rectangle(
        platform.x - platform.width * 0.24,
        platform.y + 24,
        8,
        supportHeight,
        this.isUnderwaterLevel() ? 0x4a707b : 0x7f5636,
        1
      )
      .setOrigin(0.5, 0);
    this.add
      .rectangle(
        platform.x + platform.width * 0.22,
        platform.y + 24,
        8,
        supportHeight,
        this.isUnderwaterLevel() ? 0x4a707b : 0x7f5636,
        1
      )
      .setOrigin(0.5, 0);

    const collider = this.add.zone(platform.x, platform.y + 2, platform.width, 20);
    this.physics.add.existing(collider, true);
    this.platforms.add(collider);
  }

  private createMovingPlatform(platform: MovingPlatform): void {
    const sprite = this.physics.add.sprite(platform.x, platform.y, "platform-board");
    sprite.setImmovable(true);
    sprite.body.allowGravity = false;
    sprite.setDisplaySize(platform.width, 28);
    if (this.isUnderwaterLevel()) {
      sprite.setTint(0x86c6c1);
    }
    sprite.setData("startX", platform.x);
    sprite.setData("range", platform.range);
    sprite.setData("speed", platform.speed);
    sprite.setData("baseY", platform.y);
    sprite.body.moves = false;
    this.movingPlatforms.add(sprite);
  }

  private createDecorations(): void {
    if (this.isUnderwaterLevel()) {
      [180, 540, 920, 1310, 1740, 2110, 2560, 3010, 3460, 3880].forEach((x, index) => {
        const seaweed = this.add.graphics();
        seaweed.lineStyle(6, index % 2 === 0 ? 0x3f9f6c : 0x58c48d, 0.96);
        seaweed.beginPath();
        seaweed.moveTo(x, 502);
        seaweed.lineTo(x + 10, 460 - (index % 3) * 18);
        seaweed.lineTo(x - 8, 410 - (index % 2) * 24);
        seaweed.lineTo(x + 12, 360 - (index % 4) * 12);
        seaweed.strokePath();
      });

      [320, 790, 1160, 1590, 2050, 2480, 2920, 3380, 3760].forEach((x, index) => {
        const coral = this.add.container(x, 486);
        coral.add(this.add.circle(-18, -8, 12, 0xff8f87, 0.95));
        coral.add(this.add.circle(0, -16, 16, index % 2 === 0 ? 0xffc16f : 0xff8ad0, 0.95));
        coral.add(this.add.circle(18, -10, 11, 0xffb347, 0.95));
        coral.add(this.add.rectangle(0, 4, 48, 10, 0x8d5f52, 1));
      });

      this.levelDefinition.hazards.forEach((hazard) => {
        const spikes = this.add.tileSprite(hazard.x, hazard.y, hazard.width, 24, "spikes").setOrigin(0.5, 1);
        spikes.setTint(0xa2365a);
        const zone = this.add.zone(hazard.x, hazard.y - 9, hazard.width, hazard.height ?? 18);
        this.physics.add.existing(zone, true);
        this.hazards.add(zone);
        spikes.setDepth(4);
      });

      const checkpoint = this.add
        .image(this.levelDefinition.checkpointPosition.x, this.levelDefinition.checkpointPosition.y, "checkpoint-banner")
        .setOrigin(0.5, 1)
        .setTint(0x9ff3ff);
      this.tweens.add({
        targets: checkpoint,
        y: checkpoint.y - 6,
        angle: 3,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
      this.checkpointZone = this.add.zone(
        this.levelDefinition.checkpointPosition.x,
        this.levelDefinition.checkpointPosition.y - 34,
        70,
        84
      );
      this.physics.add.existing(this.checkpointZone, true);
      return;
    }

    const bushes: Spawn[] = [
      { x: 110, y: 446 },
      { x: 340, y: 448 },
      { x: 740, y: 446 },
      { x: 1120, y: 446 },
      { x: 1500, y: 446 },
      { x: 2050, y: 446 },
      { x: 2630, y: 446 }
    ];

    bushes.forEach((spawn) => {
      this.add.image(spawn.x, spawn.y, "bush").setOrigin(0.5, 1);
    });

    const flowers: Spawn[] = [
      { x: 180, y: 458 },
      { x: 470, y: 458 },
      { x: 930, y: 458 },
      { x: 1450, y: 458 },
      { x: 1720, y: 458 },
      { x: 2370, y: 458 },
      { x: 2890, y: 458 }
    ];

    flowers.forEach((spawn) => {
      this.add.image(spawn.x, spawn.y, "flower").setOrigin(0.5, 1);
    });

    const sign = this.add.container(130, 410);
    sign.add(this.add.rectangle(0, 24, 10, 74, 0x7f5636, 1));
    sign.add(this.add.rectangle(42, 0, 92, 42, 0xfce4a7, 1).setStrokeStyle(3, 0x7d4f23));
    sign.add(
      this.add
        .text(42, -2, `${this.levelDefinition.worldLabel.replace("Mondo ", "")}\nCorri!`, {
          fontFamily: "Georgia",
          fontSize: "18px",
          color: "#5a3814",
          align: "center"
        })
        .setOrigin(0.5)
    );

    (this.levelDefinition.id === "level-2" ? [760, 1460, 2360, 3260] : [820, 1730, 3000]).forEach((x) => {
      const lamp = this.add.container(x, 412);
      const glow = this.add.circle(0, -16, 10, 0xfff3c2, 0.75);
      lamp.add(this.add.rectangle(0, 20, 8, 66, 0x6b4930, 1));
      lamp.add(this.add.circle(0, -16, 18, 0xffdda0, 0.38));
      lamp.add(glow);

      this.tweens.add({
        targets: glow,
        alpha: 0.48,
        duration: 900 + (x % 3) * 160,
        yoyo: true,
        repeat: -1
      });
    });

    (this.levelDefinition.id === "level-2"
      ? [520, 1080, 1540, 2120, 2740, 3360]
      : [560, 1160, 1670, 2260, 2860]
    ).forEach((x, index) => {
      const vine = this.add.graphics();
      vine.lineStyle(4, 0x5d9646, 0.95);
      vine.beginPath();
      vine.moveTo(x, 0);
      vine.lineTo(x + 10, 62 + index * 8);
      vine.lineTo(x + 2, 126 + index * 10);
      vine.lineTo(x - 8, 200 + index * 8);
      vine.strokePath();
      vine.setScrollFactor(0.5);
      for (let y = 58; y < 190 + index * 8; y += 34) {
        vine.fillStyle(0x7fc767, 0.9);
        vine.fillEllipse(x + ((y / 10) % 2 === 0 ? 10 : -10), y, 18, 8);
      }
    });

    this.levelDefinition.hazards.forEach((hazard) => {
      const spikes = this.add.tileSprite(hazard.x, hazard.y, hazard.width, 24, "spikes").setOrigin(0.5, 1);
      const zone = this.add.zone(hazard.x, hazard.y - 9, hazard.width, hazard.height ?? 18);
      this.physics.add.existing(zone, true);
      this.hazards.add(zone);
      spikes.setDepth(4);
    });

    const checkpoint = this.add
      .image(this.levelDefinition.checkpointPosition.x, this.levelDefinition.checkpointPosition.y, "checkpoint-banner")
      .setOrigin(0.5, 1);
    this.tweens.add({
      targets: checkpoint,
      y: checkpoint.y - 4,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });
    this.checkpointZone = this.add.zone(
      this.levelDefinition.checkpointPosition.x,
      this.levelDefinition.checkpointPosition.y - 34,
      70,
      84
    );
    this.physics.add.existing(this.checkpointZone, true);
  }

  private createPlayer(): void {
    const textureKey = `${this.selectedCharacter.id}-sheet`;
    this.playerGlow = this.add
      .ellipse(
        this.levelDefinition.playerSpawn.x,
        this.levelDefinition.playerSpawn.y - 30,
        42,
        62,
        this.selectedCharacter.primaryColor,
        0.14
      )
      .setDepth(4);
    this.playerShadow = this.add.ellipse(this.levelDefinition.playerSpawn.x, 458, 36, 12, 0x201327, 0.26).setDepth(1);
    this.player = this.physics.add.sprite(this.levelDefinition.playerSpawn.x, this.levelDefinition.playerSpawn.y, textureKey, 0);
    this.player.setName("player");
    this.player.setOrigin(0.5, 1);
    this.player.setScale(this.physicsProfile.scale);
    this.player.setDepth(6);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.physicsProfile.bodySize.width, this.physicsProfile.bodySize.height);
    this.player.setOffset(this.physicsProfile.bodyOffset.x, this.physicsProfile.bodyOffset.y);
    this.player.setMaxVelocity(this.physicsProfile.moveSpeed, this.physicsProfile.maxFallSpeed);
    if (this.isUnderwaterLevel()) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setDrag(760, 820);
      this.player.setMaxVelocity(this.physicsProfile.moveSpeed * 0.95, 220);
      if (this.playerShadow) {
        this.playerShadow.setAlpha(0.04);
      }
    }
    this.player.play(`${this.selectedCharacter.id}-idle`);
  }

  private createCollectibles(): void {
    this.levelDefinition.collectibles.forEach((position) => {
      const collectible = this.collectibles.create(position.x, position.y, "sun-drop") as Phaser.Physics.Arcade.Image;
      collectible.setData("baseY", position.y);
      collectible.setScale(0.9);
      collectible.setBlendMode(Phaser.BlendModes.SCREEN);

      const body = collectible.body as Phaser.Physics.Arcade.Body | null;
      if (body) {
        body.allowGravity = false;
      }
    });
  }

  private createEnemies(): void {
    this.levelDefinition.enemies.forEach((spawn) => {
      if (this.levelDefinition.enemyType === "fish") {
        const enemy = this.enemies.create(spawn.x, spawn.y, "enemy-fish-sheet", 0) as Phaser.Physics.Arcade.Sprite;
        enemy.setData("startX", spawn.x);
        enemy.setData("range", 120 + ((spawn.x / 10) % 3) * 20);
        enemy.setData("baseY", spawn.y);
        enemy.setData("speed", 40 + (spawn.x % 3) * 6);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocityX(-72);
        enemy.setBounce(0);
        (enemy.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        enemy.play("fish-swim");
        return;
      }

      const enemy = this.enemies.create(spawn.x, spawn.y, "enemy-slime-sheet", 0) as Phaser.Physics.Arcade.Sprite;
      enemy.setData("startX", spawn.x);
      enemy.setData("range", 100);
      enemy.setVelocityX(-54);
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(0);
      enemy.play("slime-hop");
    });
  }

  private createBossSetup(): void {
    if (!this.levelDefinition.boss) {
      return;
    }

    const trigger = this.levelDefinition.boss.triggerArea;
    this.bossTriggerZone = this.add.zone(trigger.x, trigger.y, trigger.width, trigger.height);
    this.physics.add.existing(this.bossTriggerZone, true);

    this.bossHudText = this.add
      .text(480, 78, "", {
        fontFamily: "Georgia",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#d7fbff",
        stroke: "#114a63",
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(60)
      .setAlpha(0);
    this.bossHintText = this.add
      .text(480, 108, "", {
        fontFamily: "Georgia",
        fontSize: "17px",
        color: "#effeff",
        stroke: "#114a63",
        strokeThickness: 4
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(60)
      .setAlpha(0);

    this.setGoalEnabled(false);
  }

  private createGoal(): void {
    const x = this.levelDefinition.goalPosition.x;
    const y = this.levelDefinition.goalPosition.y;
    this.add.rectangle(x - 12, y - 6, 14, 190, this.isUnderwaterLevel() ? 0xd6fbff : 0xf5e7c9, 1);
    this.goalFlag = this.add.image(x + 30, y - 74, "goal-flag").setOrigin(0, 0.5);
    if (this.isUnderwaterLevel() && this.goalFlag) {
      this.goalFlag.setTint(0x7ff3ff);
    }
    this.add.circle(x + 36, y - 74, 28, this.isUnderwaterLevel() ? 0xc5f8ff : 0xffe2a1, 0.2);

    this.tweens.add({
      targets: this.goalFlag,
      scaleY: 0.94,
      x: (this.goalFlag?.x ?? x) + 2,
      duration: 640,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.goalZone = this.add.zone(x + 12, y, 96, 180);
    this.physics.add.existing(this.goalZone, true);
  }

  private handleMovement(delta: number): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const moveLeft = this.cursors.left.isDown || this.wasd.left.isDown;
    const moveRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const moveDown = this.cursors.down.isDown || this.wasd.down.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      (this.jumpKey ? Phaser.Input.Keyboard.JustDown(this.jumpKey) : false);
    const jumpHeld = this.cursors.up.isDown || this.wasd.up.isDown || (this.jumpKey?.isDown ?? false);

    if (this.isUnderwaterLevel()) {
      const swimAcceleration = 540;
      body.setAllowGravity(false);
      body.setDrag(760, 820);
      body.setAccelerationX(0);
      body.setAccelerationY(32);

      if (moveLeft === moveRight) {
        body.setAccelerationX(0);
      } else {
        body.setAccelerationX(moveLeft ? -swimAcceleration : swimAcceleration);
        this.facing = moveLeft ? -1 : 1;
      }

      if (jumpHeld && !moveDown) {
        body.setAccelerationY(-swimAcceleration);
      } else if (moveDown && !jumpHeld) {
        body.setAccelerationY(swimAcceleration * 0.8);
      } else if (jumpHeld && moveDown) {
        body.setAccelerationY(0);
      }

      if (jumpPressed) {
        body.setVelocityY(Math.max(body.velocity.y - 105, -220));
        this.spawnSwimBubbles();
      }

      if ((Math.abs(body.velocity.x) > 24 || Math.abs(body.velocity.y) > 36) && this.runDustCooldown <= 0) {
        this.spawnSwimBubbles();
        this.runDustCooldown = 180;
      } else {
        this.runDustCooldown = Math.max(0, this.runDustCooldown - delta);
      }

      this.player.setFlipX(this.facing < 0);
      this.wasGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.airJumpsUsed = 0;
      return;
    }

    const onGround = body.blocked.down || body.touching.down;

    if (onGround && !this.wasGrounded) {
      this.spawnLandingDust();
    }

    const movement = stepMovement(
      {
        moveLeft,
        moveRight,
        jumpPressed,
        jumpHeld,
        onGround,
        velocityY: body.velocity.y,
        deltaMs: delta
      },
      this.physicsProfile,
      {
        coyoteTimer: this.coyoteTimer,
        jumpBufferTimer: this.jumpBufferTimer,
        airJumpsUsed: this.airJumpsUsed
      },
      this.facing
    );

    this.coyoteTimer = movement.nextMemory.coyoteTimer;
    this.jumpBufferTimer = movement.nextMemory.jumpBufferTimer;
    this.airJumpsUsed = movement.nextMemory.airJumpsUsed;
    this.facing = movement.facing;
    body.setAccelerationX(movement.accelerationX);
    body.setDragX(movement.dragX);
    this.player.setFlipX(this.facing < 0);

    this.runDustCooldown = Math.max(0, this.runDustCooldown - delta);

    if (movement.shouldJump) {
      body.setVelocityY(this.physicsProfile.jumpVelocity);
      this.spawnJumpDust();
    }

    if (movement.jumpCutVelocityY !== undefined) {
      body.setVelocityY(movement.jumpCutVelocityY);
    }

    if (onGround && Math.abs(body.velocity.x) > 140 && this.runDustCooldown === 0) {
      this.spawnRunDust();
      this.runDustCooldown = 90;
    }

    this.wasGrounded = onGround;
  }

  private setZoneEnabled(zone: Phaser.GameObjects.Zone | undefined, enabled: boolean): void {
    if (!zone) {
      return;
    }

    zone.setActive(enabled).setVisible(enabled);
    const body = zone.body as Phaser.Physics.Arcade.StaticBody | undefined;
    if (body) {
      body.enable = enabled;
      body.updateFromGameObject();
    }
  }

  private setGoalEnabled(enabled: boolean): void {
    this.setZoneEnabled(this.goalZone, enabled);
    this.goalFlag?.setAlpha(enabled ? 1 : 0.35);
  }

  private startBossEncounter(): void {
    const bossDefinition = this.levelDefinition.boss;
    if (!bossDefinition || this.bossStarted || this.bossDefeated) {
      return;
    }

    this.bossStarted = true;
    this.bossHp = bossDefinition.maxHp;
    this.bossOrbIndex = 0;
    this.setZoneEnabled(this.bossTriggerZone, false);

    this.boss = this.enemies.create(bossDefinition.spawn.x, bossDefinition.spawn.y, "enemy-fish-sheet", 0) as Phaser.Physics.Arcade.Sprite;
    this.boss.setScale(1.75);
    this.boss.setTint(0xff7d70);
    this.boss.setDepth(7);
    this.boss.setData("isBoss", true);
    this.boss.setData("startX", bossDefinition.spawn.x);
    this.boss.setData("range", 180);
    this.boss.setData("baseY", bossDefinition.spawn.y);
    this.boss.setData("speed", 92);
    this.boss.setData("arenaLeft", bossDefinition.triggerArea.x - bossDefinition.triggerArea.width / 2 + 40);
    this.boss.setData("arenaRight", bossDefinition.triggerArea.x + bossDefinition.triggerArea.width / 2 - 40);
    this.boss.play("fish-swim");
    const bossBody = this.boss.body as Phaser.Physics.Arcade.Body;
    bossBody.setAllowGravity(false);
    bossBody.setSize(42, 24);
    bossBody.setOffset(9, 6);

    this.createBossGate();
    this.updateBossHud();
    this.showBossHint("Raccogli la perla azzurra luminosa per ferire il boss");
    this.spawnNextBossOrb();
    this.cameras.main.shake(200, 0.0025);
    this.spawnPickupSparkle(bossDefinition.spawn.x, bossDefinition.spawn.y);
  }

  private createBossGate(): void {
    const bossDefinition = this.levelDefinition.boss;
    if (!bossDefinition) {
      return;
    }

    const gate = bossDefinition.gate;
    this.bossGateVisual = this.add.container(gate.x, gate.y);
    this.bossGateVisual.setDepth(5);
    this.bossGateVisual.add(this.add.rectangle(0, 0, gate.width, gate.height, 0x78f3ff, 0.18));
    for (let index = -2; index <= 2; index += 1) {
      this.bossGateVisual.add(this.add.circle(index * 4, -gate.height / 2 + 20 + (index + 2) * 28, 10, 0xaefbff, 0.55));
    }
    this.bossGateVisual.add(this.add.rectangle(0, 0, gate.width - 8, gate.height, 0x89ffff, 0.1).setStrokeStyle(3, 0xcafcff, 0.9));

    this.bossGateCollider = this.add.zone(gate.x, gate.y, gate.width, gate.height);
    this.physics.add.existing(this.bossGateCollider, true);
    this.platforms.add(this.bossGateCollider);
  }

  private spawnNextBossOrb(): void {
    const bossDefinition = this.levelDefinition.boss;
    if (!bossDefinition || !this.bossStarted || this.bossDefeated) {
      return;
    }

    const spawn = bossDefinition.orbSpawns[this.bossOrbIndex % bossDefinition.orbSpawns.length];
    this.bossOrbIndex += 1;
    const orb = this.bossOrbs.create(spawn.x, spawn.y, "boss-orb") as Phaser.Physics.Arcade.Image;
    orb.setScale(1.24);
    orb.setTint(0xffffff);
    orb.setBlendMode(Phaser.BlendModes.SCREEN);
    orb.setDepth(8);
    orb.setData("baseY", spawn.y);
    orb.setData("baseScale", 1.24);
    this.spawnPickupSparkle(spawn.x, spawn.y);
  }

  private handleBossOrbCollected(orb: Phaser.Physics.Arcade.Image): void {
    if (!orb.active || !this.bossStarted || this.bossDefeated) {
      return;
    }

    orb.destroy();
    this.bossHp = Math.max(0, this.bossHp - 1);
    addScore(3);
    this.spawnPickupSparkle(orb.x, orb.y);

    if (this.boss) {
      this.tweens.add({
        targets: this.boss,
        alpha: 0.45,
        duration: 110,
        yoyo: true,
        repeat: 2
      });
      this.boss.setData("speed", (this.boss.getData("speed") as number) + 18);
    }

    this.updateBossHud();

    if (this.bossHp > 0) {
      this.showBossHint("Un'altra perla!");
      this.time.delayedCall(450, () => this.spawnNextBossOrb());
      return;
    }

    this.completeBossEncounter();
  }

  private completeBossEncounter(): void {
    this.bossDefeated = true;
    this.bossStarted = false;
    this.bossOrbs.clear(true, true);
    this.setGoalEnabled(true);
    this.bossGateCollider?.destroy();
    this.bossGateCollider = undefined;
    this.bossGateVisual?.destroy();
    this.bossGateVisual = undefined;
    this.updateBossHud("Murena Regina sconfitta! Via libera.");
    this.showBossHint("");
    this.cameras.main.flash(180, 210, 250, 255);
    this.cameras.main.shake(180, 0.002);
    this.spawnPickupSparkle(this.levelDefinition.goalPosition.x - 30, this.levelDefinition.goalPosition.y - 60);

    if (this.boss) {
      const boss = this.boss;
      this.boss = undefined;
      this.tweens.add({
        targets: boss,
        x: boss.x + 180,
        y: boss.y - 50,
        alpha: 0,
        duration: 520,
        onComplete: () => boss.destroy()
      });
    }
  }

  private resetBossEncounter(): void {
    if (!this.levelDefinition.boss || this.bossDefeated) {
      return;
    }

    this.bossStarted = false;
    this.bossHp = 0;
    this.bossOrbIndex = 0;
    this.bossOrbs.clear(true, true);
    this.boss?.destroy();
    this.boss = undefined;
    this.bossGateCollider?.destroy();
    this.bossGateCollider = undefined;
    this.bossGateVisual?.destroy();
    this.bossGateVisual = undefined;
    this.setGoalEnabled(false);
    this.setZoneEnabled(this.bossTriggerZone, true);
    this.updateBossHud("");
    this.showBossHint("");
  }

  private updateBossHud(overrideText?: string): void {
    if (!this.bossHudText) {
      return;
    }

    const text =
      overrideText !== undefined
        ? overrideText
        : this.bossStarted
          ? `Murena Regina  ${"●".repeat(this.bossHp)}${"○".repeat(Math.max(0, 3 - this.bossHp))}`
          : "";

    this.bossHudText.setText(text);
    this.bossHudText.setAlpha(text ? 1 : 0);
  }

  private showBossHint(text: string): void {
    if (!this.bossHintText) {
      return;
    }

    this.bossHintText.setText(text);
    this.bossHintText.setAlpha(text ? 1 : 0);
  }

  private updateAnimation(): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.isUnderwaterLevel()) {
      if (Math.abs(body.velocity.x) > 18 || Math.abs(body.velocity.y) > 26) {
        this.player.play(`${this.selectedCharacter.id}-run`, true);
        return;
      }

      this.player.play(`${this.selectedCharacter.id}-idle`, true);
      return;
    }

    if (!(body.blocked.down || body.touching.down)) {
      if (body.velocity.y < 0) {
        this.player.play(`${this.selectedCharacter.id}-jump`, true);
      } else {
        this.player.play(`${this.selectedCharacter.id}-fall`, true);
      }
      return;
    }

    if (Math.abs(body.velocity.x) > 24) {
      this.player.play(`${this.selectedCharacter.id}-run`, true);
      return;
    }

    this.player.play(`${this.selectedCharacter.id}-idle`, true);
  }

  private updatePlayerPresentation(): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.isUnderwaterLevel()) {
      const bob = Math.sin(this.time.now * 0.006) * 0.02;
      const speedMix = Phaser.Math.Clamp((Math.abs(body.velocity.x) + Math.abs(body.velocity.y)) / 320, 0, 1);
      const easedScaleX = Phaser.Math.Linear(Math.abs(this.player.scaleX), this.physicsProfile.scale * (1 + bob + speedMix * 0.04), 0.18);
      const easedScaleY = Phaser.Math.Linear(this.player.scaleY, this.physicsProfile.scale * (1 - bob * 0.6 - speedMix * 0.03), 0.18);
      this.player.setScale(easedScaleX, easedScaleY);

      if (this.playerGlow) {
        this.playerGlow.x = this.player.x;
        this.playerGlow.y = this.player.y - this.player.displayHeight * 0.48;
        this.playerGlow.setScale(1.08, 1.08);
        this.playerGlow.setAlpha(0.1 + speedMix * 0.06);
      }

      if (this.playerShadow) {
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = 500;
        this.playerShadow.setScale(0.8, 0.45);
        this.playerShadow.setAlpha(0.035);
      }
      return;
    }

    const grounded = body.blocked.down || body.touching.down;
    const horizontalSpeed = Math.abs(body.velocity.x);
    const targetScaleX = grounded ? 1 + Math.min(horizontalSpeed / 900, 0.08) : 0.96;
    const targetScaleY = grounded ? (horizontalSpeed > 40 ? 0.97 : 1) : 1.06;
    const easedScaleX = Phaser.Math.Linear(Math.abs(this.player.scaleX), this.physicsProfile.scale * targetScaleX, 0.18);
    const easedScaleY = Phaser.Math.Linear(this.player.scaleY, this.physicsProfile.scale * targetScaleY, 0.18);

    this.player.setScale(easedScaleX, easedScaleY);

    if (this.playerGlow) {
      const lift = Phaser.Math.Clamp((458 - this.player.y) / 140, 0, 1);
      this.playerGlow.x = this.player.x;
      this.playerGlow.y = this.player.y - this.player.displayHeight * 0.54;
      this.playerGlow.setScale(Phaser.Math.Linear(1, 0.86, lift), Phaser.Math.Linear(1, 0.92, lift));
      this.playerGlow.setAlpha(Phaser.Math.Linear(0.14, 0.08, lift));
    }

    if (this.playerShadow) {
      const floorY = 458;
      const airHeight = Phaser.Math.Clamp(floorY - this.player.y, 0, 150);
      const shadowScale = Phaser.Math.Linear(1.05, 0.55, airHeight / 150);
      this.playerShadow.x = this.player.x;
      this.playerShadow.y = floorY;
      this.playerShadow.setScale(shadowScale, shadowScale);
      this.playerShadow.setAlpha(Phaser.Math.Linear(0.28, 0.08, airHeight / 150));
    }
  }

  private updateCollectibles(): void {
    this.collectibles.getChildren().forEach((entry, index) => {
      const collectible = entry as Phaser.Physics.Arcade.Image;
      const baseY = collectible.getData("baseY") as number;
      collectible.y = baseY + Math.sin(this.time.now * 0.004 + index) * 5;
    });

    this.bossOrbs.getChildren().forEach((entry, index) => {
      const orb = entry as Phaser.Physics.Arcade.Image;
      const baseY = orb.getData("baseY") as number;
      const baseScale = (orb.getData("baseScale") as number | undefined) ?? 1.24;
      orb.y = baseY + Math.sin(this.time.now * 0.005 + index) * 7;
      orb.setScale(baseScale + Math.sin(this.time.now * 0.008 + index) * 0.08);
      orb.rotation += 0.015;
    });
  }

  private handleEnemyContact(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (!enemy.active || this.invulnerable) {
      return;
    }

    if (this.isUnderwaterLevel()) {
      this.handlePlayerHit();
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
    const stomping =
      playerBody.velocity.y > 120 &&
      playerBody.bottom <= enemyBody.top + 18;

    if (stomping) {
      enemy.destroy();
      addScore(2);
      playerBody.setVelocityY(-330);
      this.spawnPickupSparkle(enemy.x, enemy.y - 10);
      this.spawnLandingDust();
      return;
    }

    this.handlePlayerHit();
  }

  private updateEnemies(): void {
    if (this.levelDefinition.enemyType === "fish") {
      this.enemies.getChildren().forEach((entry, index) => {
        const enemy = entry as Phaser.Physics.Arcade.Sprite;
        if (enemy.getData("isBoss")) {
          const body = enemy.body as Phaser.Physics.Arcade.Body;
          const arenaLeft = enemy.getData("arenaLeft") as number;
          const arenaRight = enemy.getData("arenaRight") as number;
          const speed = enemy.getData("speed") as number;
          const targetX = Phaser.Math.Clamp(this.player.x + this.facing * 40, arenaLeft, arenaRight);
          const targetY = Phaser.Math.Clamp(this.player.y - 14, 126, 396);
          body.setVelocityX(Phaser.Math.Clamp((targetX - enemy.x) * 1.4, -speed, speed));
          body.setVelocityY(Phaser.Math.Clamp((targetY - enemy.y) * 1.3, -84, 84));
          enemy.setFlipX(body.velocity.x < 0);
          return;
        }

        const startX = enemy.getData("startX") as number;
        const range = enemy.getData("range") as number;
        const baseY = enemy.getData("baseY") as number;
        const speed = enemy.getData("speed") as number;
        const body = enemy.body as Phaser.Physics.Arcade.Body;
        const direction = body.velocity.x >= 0 ? 1 : -1;

        enemy.y = baseY + Math.sin(this.time.now * 0.0032 + index * 0.8) * 18;

        if (enemy.x <= startX - range) {
          enemy.setVelocityX(speed);
        } else if (enemy.x >= startX + range) {
          enemy.setVelocityX(-speed);
        }

        if (body.blocked.left) {
          enemy.setVelocityX(speed);
        } else if (body.blocked.right) {
          enemy.setVelocityX(-speed);
        }

        enemy.setFlipX(direction < 0);
      });
      return;
    }

    this.enemies.getChildren().forEach((entry) => {
      const enemy = entry as Phaser.Physics.Arcade.Sprite;
      const startX = enemy.getData("startX") as number;
      const range = enemy.getData("range") as number;
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      const direction = body.velocity.x >= 0 ? 1 : -1;
      const support = this.getEnemySupportSurface(enemy);
      const ledgeAhead =
        support !== undefined &&
        (direction > 0
          ? enemy.x + enemy.displayWidth * 0.45 >= support.right
          : enemy.x - enemy.displayWidth * 0.45 <= support.left);

      if (ledgeAhead || body.blocked.right || enemy.x < startX - range) {
        enemy.setVelocityX(54);
        enemy.setFlipX(true);
      } else if (body.blocked.left || enemy.x > startX + range) {
        enemy.setVelocityX(-54);
        enemy.setFlipX(false);
      }
    });
  }

  private getEnemySupportSurface(enemy: Phaser.Physics.Arcade.Sprite): { left: number; right: number } | undefined {
    const toleranceY = 22;
    const fixedPlatform = [...this.levelDefinition.groundSegments, ...this.levelDefinition.boardPlatforms].find((segment) => {
      const left = segment.x - segment.width / 2;
      const right = segment.x + segment.width / 2;
      const surfaceY = segment.y;

      return (
        enemy.x >= left - 4 &&
        enemy.x <= right + 4 &&
        Math.abs(enemy.y - surfaceY) <= toleranceY
      );
    });

    if (fixedPlatform) {
      return {
        left: fixedPlatform.x - fixedPlatform.width / 2,
        right: fixedPlatform.x + fixedPlatform.width / 2
      };
    }

    for (const entry of this.movingPlatforms.getChildren()) {
      const platform = entry as Phaser.Physics.Arcade.Sprite;
      const left = platform.x - platform.displayWidth / 2;
      const right = platform.x + platform.displayWidth / 2;
      const surfaceY = platform.y;

      if (enemy.x >= left - 4 && enemy.x <= right + 4 && Math.abs(enemy.y - surfaceY) <= toleranceY) {
        return { left, right };
      }
    }

    return undefined;
  }

  private updateMovingPlatforms(): void {
    this.movingPlatforms.getChildren().forEach((entry) => {
      const platform = entry as Phaser.Physics.Arcade.Sprite;
      const startX = platform.getData("startX") as number;
      const range = platform.getData("range") as number;
      const speed = platform.getData("speed") as number;
      platform.x = startX + Math.sin(this.time.now * speed) * range;
    });
  }

  private renderDebugOverlay(): void {
    if (!this.debugGraphics) {
      return;
    }

    this.debugGraphics.clear();
    if (!this.debugEnabled) {
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    this.debugGraphics.lineStyle(2, 0x00ffae, 1);
    this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height);

    this.debugGraphics.lineStyle(2, 0xff6b6b, 1);
    this.debugGraphics.lineBetween(this.player.x - 18, this.player.y, this.player.x + 18, this.player.y);

    this.debugGraphics.lineStyle(2, 0x6ecbff, 1);
    this.debugGraphics.lineBetween(this.player.x, this.player.y - this.player.displayHeight, this.player.x, this.player.y);
  }

  private spawnLandingDust(): void {
    const offsets = [-14, 14];
    offsets.forEach((offset) => {
      const puff = this.add.image(this.player.x + offset, this.player.y - 2, "dust-dot").setAlpha(0.75).setScale(1.2);
      this.tweens.add({
        targets: puff,
        x: puff.x + offset * 0.9,
        y: puff.y - 10,
        alpha: 0,
        scale: 0.2,
        duration: 220,
        onComplete: () => puff.destroy()
      });
    });
  }

  private spawnRunDust(): void {
    const dust = this.add.image(this.player.x - this.facing * 10, this.player.y - 4, "dust-dot").setAlpha(0.6).setScale(1.05);
    this.tweens.add({
      targets: dust,
      x: dust.x - this.facing * 18,
      y: dust.y - 6,
      alpha: 0,
      scale: 0.3,
      duration: 170,
      onComplete: () => dust.destroy()
    });
  }

  private spawnJumpDust(): void {
    const left = this.add.image(this.player.x - 12, this.player.y - 2, "dust-dot").setAlpha(0.8).setScale(1.1);
    const right = this.add.image(this.player.x + 12, this.player.y - 2, "dust-dot").setAlpha(0.8).setScale(1.1);
    [left, right].forEach((dust, index) => {
      this.tweens.add({
        targets: dust,
        x: dust.x + (index === 0 ? -18 : 18),
        y: dust.y - 12,
        alpha: 0,
        scale: 0.25,
        duration: 180,
        onComplete: () => dust.destroy()
      });
    });
  }

  private spawnPickupSparkle(x: number, y: number): void {
    for (let index = 0; index < 4; index += 1) {
      const sparkle = this.add.image(x, y, "dust-dot").setAlpha(0.9).setScale(0.9);
      const angle = Phaser.Math.DegToRad(index * 90 + Phaser.Math.Between(-18, 18));
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * 16,
        y: y + Math.sin(angle) * 16,
        alpha: 0,
        scale: 0.2,
        duration: 240,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  private spawnSwimBubbles(): void {
    for (let index = 0; index < 3; index += 1) {
      const bubble = this.add
        .image(this.player.x - this.facing * 8 + index * 3, this.player.y - 10 + index * 5, "dust-dot")
        .setTint(0xc9fbff)
        .setAlpha(0.65)
        .setScale(0.8 - index * 0.12);
      this.tweens.add({
        targets: bubble,
        x: bubble.x - this.facing * 10 - index * 2,
        y: bubble.y - 16 - index * 6,
        alpha: 0,
        scale: 0.16,
        duration: 320 + index * 40,
        onComplete: () => bubble.destroy()
      });
    }
  }

  private handlePlayerHit(resetPosition = false): void {
    if (!this.player.active || this.invulnerable) {
      return;
    }

    this.invulnerable = true;
    loseLife();
    this.cameras.main.shake(120, 0.003);
    this.cameras.main.flash(120, 255, 227, 212);

    if (getLives() === 0) {
      this.scene.stop("hud");
      this.scene.start("game-over");
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.stop();
    body.setAcceleration(0, 0);

    if (resetPosition) {
      if (this.levelDefinition.boss && this.bossStarted && !this.bossDefeated) {
        this.resetBossEncounter();
      }
      this.player.setPosition(this.respawnPoint.x, this.respawnPoint.y);
      body.setVelocity(0, 0);
      this.coyoteTimer = 110;
      this.jumpBufferTimer = 0;
      this.airJumpsUsed = 0;
    } else {
      body.setVelocity(-this.facing * 180, this.isUnderwaterLevel() ? -120 : -250);
    }

    this.time.delayedCall(900, () => {
      this.invulnerable = false;
    });
  }
}
