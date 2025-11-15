export type AspectRatio = "16:9" | "9:16" | "21:9" | "1:1";

export interface ProjectInfo {
  title: string;
  logline: string;
  brainDump: string;
  runtimeSeconds: number;
  aspectRatio: AspectRatio;
  targetEmotion: string;
  pacing: string;
  callToAction: string;
  budgetLevel: "indie" | "premium" | "blockbuster";
}

export interface VisualLanguage {
  cinematographyStyle: string;
  lighting: string;
  colorPalette: string;
  artDirection: string;
  cameraMovement: string;
  lensing: string;
  textureAndFX: string;
  references: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  backstory: string;
  visualTraits: string;
  wardrobe: string;
  performanceNotes: string;
  consistencyKeys: string;
}

export interface SceneBeat {
  id: string;
  label: string;
  timestamp: string;
  objective: string;
  setting: string;
  action: string;
  emotionalBeat: string;
  cinematography: string;
  transitions: string;
  voiceOver: string;
}

export interface AudioDirection {
  voiceOverTone: string;
  dialogueNotes: string;
  music: string;
  soundDesign: string;
}

export interface GenerationSettings {
  motionIntensity: "static" | "cinematic" | "hyperdynamic";
  cameraRig: string;
  renderQuality: "standard" | "high" | "ultra";
  seedControl: string;
  negativePrompts: string;
  deliveryFormat: string;
}

export interface PromptStructure {
  project: ProjectInfo;
  visualLanguage: VisualLanguage;
  characters: CharacterProfile[];
  sceneBeats: SceneBeat[];
  audio: AudioDirection;
  generationSettings: GenerationSettings;
  directorNotes: string;
}

