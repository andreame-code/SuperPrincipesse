export type CharacterId =
  | "rapunzel"
  | "phua"
  | "mulan"
  | "biancaneve"
  | "aurora"
  | "principessa-spada"
  | "unicorno";

export interface CharacterPhysics {
  scale: number;
  bodySize: { width: number; height: number };
  bodyOffset: { x: number; y: number };
  moveSpeed: number;
  groundAcceleration: number;
  airAcceleration: number;
  groundDrag: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  attackOffsetX: number;
  attackScaleX: number;
  attackScaleY: number;
  attackDurationMs: number;
}

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  title: string;
  primaryColor: number;
  accentColor: number;
  description: string;
  unlocked: boolean;
  physics: CharacterPhysics;
}

export const characters: CharacterDefinition[] = [
  {
    id: "rapunzel",
    name: "Rapunzel",
    title: "Custode della Torre Dorata",
    primaryColor: 0xf0c15d,
    accentColor: 0xb06ad6,
    description: "Corre, salta e usa i capelli come frusta magica a corto raggio.",
    unlocked: true,
    physics: {
      scale: 0.62,
      bodySize: { width: 26, height: 46 },
      bodyOffset: { x: 19, y: 34 },
      moveSpeed: 230,
      groundAcceleration: 780,
      airAcceleration: 420,
      groundDrag: 1150,
      jumpVelocity: -500,
      maxFallSpeed: 720,
      attackOffsetX: 28,
      attackScaleX: 0.76,
      attackScaleY: 0.78,
      attackDurationMs: 120
    }
  },
  {
    id: "phua",
    name: "Phua",
    title: "Maialina Sprint dell'Isola",
    primaryColor: 0xf4c0c3,
    accentColor: 0xf7efe2,
    description: "Piccola, veloce e testarda. Scatta, salta e travolge i nemici con il musetto.",
    unlocked: true,
    physics: {
      scale: 0.58,
      bodySize: { width: 28, height: 36 },
      bodyOffset: { x: 18, y: 40 },
      moveSpeed: 255,
      groundAcceleration: 980,
      airAcceleration: 520,
      groundDrag: 1450,
      jumpVelocity: -430,
      maxFallSpeed: 650,
      attackOffsetX: 24,
      attackScaleX: 0.65,
      attackScaleY: 0.72,
      attackDurationMs: 100
    }
  },
  {
    id: "mulan",
    name: "Mulan",
    title: "Guerriera del Vento",
    primaryColor: 0xc53e30,
    accentColor: 0x273554,
    description: "Bilanciata e precisa. Scatta bene, salta con controllo e colpisce in avanti con disciplina.",
    unlocked: true,
    physics: {
      scale: 0.6,
      bodySize: { width: 24, height: 44 },
      bodyOffset: { x: 20, y: 34 },
      moveSpeed: 238,
      groundAcceleration: 860,
      airAcceleration: 470,
      groundDrag: 1240,
      jumpVelocity: -475,
      maxFallSpeed: 700,
      attackOffsetX: 28,
      attackScaleX: 0.72,
      attackScaleY: 0.76,
      attackDurationMs: 110
    }
  },
  {
    id: "biancaneve",
    name: "Biancaneve",
    title: "Luce del Bosco",
    primaryColor: 0xf2d34b,
    accentColor: 0x5fa1de,
    description: "Morbida nei movimenti, con salto alto e atterraggi gentili ma meno scattante di Mulan.",
    unlocked: true,
    physics: {
      scale: 0.6,
      bodySize: { width: 24, height: 44 },
      bodyOffset: { x: 20, y: 34 },
      moveSpeed: 220,
      groundAcceleration: 760,
      airAcceleration: 430,
      groundDrag: 1160,
      jumpVelocity: -510,
      maxFallSpeed: 690,
      attackOffsetX: 28,
      attackScaleX: 0.74,
      attackScaleY: 0.78,
      attackDurationMs: 120
    }
  },
  {
    id: "aurora",
    name: "Aurora",
    title: "Bella Addormentata dell'Alba",
    primaryColor: 0xf3a2c6,
    accentColor: 0xf2d77b,
    description: "Elegante e ariosa. Ha falcate lunghe, salto dolce e una discesa piu controllata.",
    unlocked: true,
    physics: {
      scale: 0.6,
      bodySize: { width: 24, height: 44 },
      bodyOffset: { x: 20, y: 34 },
      moveSpeed: 228,
      groundAcceleration: 790,
      airAcceleration: 445,
      groundDrag: 1180,
      jumpVelocity: -495,
      maxFallSpeed: 660,
      attackOffsetX: 28,
      attackScaleX: 0.74,
      attackScaleY: 0.78,
      attackDurationMs: 118
    }
  },
  {
    id: "principessa-spada",
    name: "Principessa Spada",
    title: "Guardiana della Lama di Luce",
    primaryColor: 0xf3a2c6,
    accentColor: 0xd8dcff,
    description: "Regale ma decisa. Impugna la spada, accelera bene e colpisce con slancio frontale.",
    unlocked: true,
    physics: {
      scale: 0.62,
      bodySize: { width: 24, height: 46 },
      bodyOffset: { x: 20, y: 34 },
      moveSpeed: 236,
      groundAcceleration: 840,
      airAcceleration: 455,
      groundDrag: 1210,
      jumpVelocity: -490,
      maxFallSpeed: 690,
      attackOffsetX: 30,
      attackScaleX: 0.8,
      attackScaleY: 0.8,
      attackDurationMs: 110
    }
  },
  {
    id: "unicorno",
    name: "Unicorno",
    title: "Galoppo di Zucchero Stellare",
    primaryColor: 0xf7f2ff,
    accentColor: 0xf39ac7,
    description: "Scatta leggero, copre terreno in fretta e plana con una ricaduta piu dolce.",
    unlocked: true,
    physics: {
      scale: 0.64,
      bodySize: { width: 32, height: 34 },
      bodyOffset: { x: 16, y: 42 },
      moveSpeed: 248,
      groundAcceleration: 930,
      airAcceleration: 500,
      groundDrag: 1320,
      jumpVelocity: -470,
      maxFallSpeed: 640,
      attackOffsetX: 30,
      attackScaleX: 0.86,
      attackScaleY: 0.74,
      attackDurationMs: 102
    }
  }
];

let selectedCharacter: CharacterId = "rapunzel";
let score = 0;
let lives = 3;

export function setSelectedCharacter(characterId: CharacterId): void {
  selectedCharacter = characterId;
}

export function getSelectedCharacter(): CharacterDefinition {
  return characters.find((character) => character.id === selectedCharacter) ?? characters[0];
}

export function resetRunState(): void {
  score = 0;
  lives = 3;
}

export function addScore(amount: number): void {
  score += amount;
}

export function getScore(): number {
  return score;
}

export function loseLife(): void {
  lives = Math.max(0, lives - 1);
}

export function getLives(): number {
  return lives;
}
