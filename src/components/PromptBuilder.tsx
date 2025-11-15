"use client";

import { useMemo, useState } from "react";
import {
  AudioDirection,
  CharacterProfile,
  GenerationSettings,
  PromptStructure,
  ProjectInfo,
  SceneBeat,
  VisualLanguage,
} from "@/types/prompt";
import {
  Copy,
  PlusCircle,
  RefreshCw,
  Trash2,
  Wand2,
  Check,
} from "lucide-react";

const createId = () => Math.random().toString(36).slice(2, 10);

const initialProject: ProjectInfo = {
  title: "Working Title",
  logline: "",
  brainDump: "",
  runtimeSeconds: 45,
  aspectRatio: "16:9",
  targetEmotion: "Awe and inspiration",
  pacing: "Deliberate cinematic pacing with escalating tension",
  callToAction: "End card with brand lockup and CTA overlay",
  budgetLevel: "blockbuster",
};

const initialVisualLanguage: VisualLanguage = {
  cinematographyStyle:
    "Prestige streaming series look with premium high-budget polish",
  lighting:
    "Motivated lighting with subtle volumetrics, cinematic contrast, and golden hour highlights",
  colorPalette:
    "Rich complementary tones with painterly teals and ambers, heightened saturation on key accents",
  artDirection:
    "Production design with handcrafted texture, premium props, and lived-in environments",
  cameraMovement:
    "Controlled technocrane moves, gliding steadicam, and purposeful dolly pushes",
  lensing:
    "Cooke anamorphic equivalent, shallow depth of field, occasional macro inserts",
  textureAndFX:
    "Cinematic film grain, practical atmospheric haze, restrained cinematic particles",
  references:
    "References: Denis Villeneuve wide shots, Michael Mann night exterior energy, Apple Vision Pro launch films",
};

const initialAudio: AudioDirection = {
  voiceOverTone: "Warm authoritative narrator delivering emotional progression",
  dialogueNotes: "Keep dialogue minimal; focus on resonant keywords only",
  music: "Hybrid orchestral score with modern synth layers and swelling crescendos",
  soundDesign:
    "Layered cinematic sound design: whooshes timed to camera moves, tactile foley, subtle risers",
};

const initialSettings: GenerationSettings = {
  motionIntensity: "cinematic",
  cameraRig: "Virtual technocrane with precise keyframes for hero shots",
  renderQuality: "ultra",
  seedControl: "Lock seed for character consistency across shots",
  negativePrompts:
    "Avoid cartoonish looks, avoid amateur lighting, avoid jittery handheld motion, avoid inconsistent character faces",
  deliveryFormat: "4K UHD master, ProRes proxy for review, 10-bit color",
};

const initialCharacters: CharacterProfile[] = [
  {
    id: createId(),
    name: "Primary Protagonist",
    role: "Visionary innovator and emotional anchor",
    backstory:
      "Leader who transforms ambitious ideas into reality; calm confidence with a spark of curiosity",
    visualTraits:
      "Diverse casting, soulful eyes, consistent facial structure, cinematic lighting on skin",
    wardrobe:
      "Premium tailored wardrobe with subtle texture, elevated sneakers, watch as hero prop",
    performanceNotes:
      "Intentional micro-expressions, focused gaze, relaxed power in body language",
    consistencyKeys:
      "Maintain same character model across all beats; ensure identical facial structure and hair",
  },
];

const initialScenes: SceneBeat[] = [
  {
    id: createId(),
    label: "Opening Hero Shot",
    timestamp: "0s - 5s",
    objective: "Establish the world and immediately signal premium scale",
    setting: "Dawn exterior rooftop overlooking futuristic skyline",
    action: "Hero stands center frame facing city as camera dolly-pushes in",
    emotionalBeat: "Anticipation, sense of limitless potential",
    cinematography:
      "Wide anamorphic establishing, volumetric light shafts, dramatic reveal of skyline",
    transitions: "Match dissolve from logo reveal into next beat",
    voiceOver:
      "Narrator introduces the idea of orchestrating visions into tangible experiences",
  },
];

type IdeasParseResult = {
  characters: CharacterProfile[];
  beats: SceneBeat[];
};

const parseBrainDump = (raw: string): IdeasParseResult => {
  const lines = raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const characters: CharacterProfile[] = [];
  const beats: SceneBeat[] = [];

  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    if (
      /character|protagonist|hero|villain|support|actor|founder/.test(lower)
    ) {
      const nameMatch = line.match(/^[A-Z][\w\s]+(?=[:\-])/);
      const name = nameMatch ? nameMatch[0].trim() : `Character ${index + 1}`;
      characters.push({
        id: createId(),
        name,
        role: line,
        backstory: "",
        visualTraits: "",
        wardrobe: "",
        performanceNotes: "",
        consistencyKeys: "",
      });
      return;
    }

    if (/scene|shot|moment|sequence|beat|transition/.test(lower)) {
      beats.push({
        id: createId(),
        label: line.replace(/[:\-].*/, "").trim() || `Beat ${beats.length + 1}`,
        timestamp: `${beats.length * 5}s - ${(beats.length + 1) * 5}s`,
        objective: line,
        setting: "",
        action: "",
        emotionalBeat: "",
        cinematography: "",
        transitions: "",
        voiceOver: "",
      });
      return;
    }

    if (line.length > 12) {
      beats.push({
        id: createId(),
        label: `Beat ${beats.length + 1}`,
        timestamp: `${beats.length * 5}s - ${(beats.length + 1) * 5}s`,
        objective: line,
        setting: "",
        action: "",
        emotionalBeat: "",
        cinematography: "",
        transitions: "",
        voiceOver: "",
      });
    }
  });

  return { characters, beats };
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
    <header className="mb-5">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      ) : null}
    </header>
    <div className="grid gap-4">{children}</div>
  </section>
);

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-sm font-medium text-zinc-700">{label}</span>
    {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    <div className="mt-2">{children}</div>
  </label>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  />
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={(event) => onChange(event.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  />
);

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const PromptBuilder = () => {
  const [project, setProject] = useState<ProjectInfo>(initialProject);
  const [visualLanguage, setVisualLanguage] =
    useState<VisualLanguage>(initialVisualLanguage);
  const [characters, setCharacters] =
    useState<CharacterProfile[]>(initialCharacters);
  const [sceneBeats, setSceneBeats] = useState<SceneBeat[]>(initialScenes);
  const [audio, setAudio] = useState<AudioDirection>(initialAudio);
  const [settings, setSettings] =
    useState<GenerationSettings>(initialSettings);
  const [copied, setCopied] = useState(false);

  const structuredPrompt: PromptStructure = useMemo(
    () => ({
      project,
      visualLanguage,
      characters,
      sceneBeats,
      audio,
      generationSettings: settings,
      directorNotes:
        "Ensure Veo 3.1 keeps character faces locked between shots. Prioritise cinematic motion, premium lighting, and coherent mise-en-scène across the sequence.",
    }),
    [audio, characters, project, sceneBeats, settings, visualLanguage],
  );

  const handleBrainstormOrganize = () => {
    if (!project.brainDump.trim()) return;
    const { characters: parsedCharacters, beats } = parseBrainDump(
      project.brainDump,
    );

    if (parsedCharacters.length) {
      setCharacters((prev) => {
        const remaining = prev.filter(
          (existing) => existing.name !== "Primary Protagonist",
        );
        return [...remaining, ...parsedCharacters];
      });
    }

    if (beats.length) {
      setSceneBeats(beats);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(structuredPrompt, null, 2),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy prompt", error);
    }
  };

  const handleReset = () => {
    setProject(initialProject);
    setVisualLanguage(initialVisualLanguage);
    setCharacters(initialCharacters);
    setSceneBeats(initialScenes);
    setAudio(initialAudio);
    setSettings(initialSettings);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-20 pt-10">
      <header className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-zinc-500">
          Veo 3.1 Prompt Architect
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-900">
          Transform messy ideas into a production-ready Veo video brief
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          Capture your raw creative dump, refine premium cinematography
          direction, and export a perfectly structured JSON prompt tuned for
          high-budget Veo 3.1 video generation with consistent characters across
          every beat.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            4K cinematic pipeline
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            Character continuity controls
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">
            Scene-by-scene beat map
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <div className="grid gap-6">
          <Section
            title="Project Overview"
            description="Define the core of your Veo piece — runtime, emotion, pacing, and CTA."
          >
            <Field label="Title" hint="Internal working title for the concept">
              <TextInput
                value={project.title}
                onChange={(value) =>
                  setProject((prev) => ({ ...prev, title: value }))
                }
              />
            </Field>
            <Field
              label="Logline"
              hint="One-sentence statement summarizing the story arc."
            >
              <TextArea
                value={project.logline}
                onChange={(value) =>
                  setProject((prev) => ({ ...prev, logline: value }))
                }
                rows={3}
              />
            </Field>
            <Field
              label="Brain Dump"
              hint="Paste unorganized ideas, references, or keywords to auto-seed characters and beats."
            >
              <TextArea
                value={project.brainDump}
                onChange={(value) =>
                  setProject((prev) => ({ ...prev, brainDump: value }))
                }
                rows={6}
              />
              <button
                type="button"
                onClick={handleBrainstormOrganize}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                <Wand2 className="h-4 w-4" />
                Organize Ideas
              </button>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Runtime (seconds)">
                <TextInput
                  value={String(project.runtimeSeconds)}
                  onChange={(value) =>
                    setProject((prev) => ({
                      ...prev,
                      runtimeSeconds: Number.parseInt(value || "0", 10) || 0,
                    }))
                  }
                />
              </Field>
              <Field label="Aspect Ratio">
                <Select
                  value={project.aspectRatio}
                  onChange={(value) =>
                    setProject((prev) => ({
                      ...prev,
                      aspectRatio: value as ProjectInfo["aspectRatio"],
                    }))
                  }
                  options={[
                    { label: "16:9 — Traditional cinematic", value: "16:9" },
                    { label: "9:16 — Vertical social", value: "9:16" },
                    { label: "21:9 — Ultra widescreen", value: "21:9" },
                    { label: "1:1 — Square", value: "1:1" },
                  ]}
                />
              </Field>
              <Field label="Target Emotion">
                <TextInput
                  value={project.targetEmotion}
                  onChange={(value) =>
                    setProject((prev) => ({ ...prev, targetEmotion: value }))
                  }
                />
              </Field>
              <Field label="Pacing">
                <TextInput
                  value={project.pacing}
                  onChange={(value) =>
                    setProject((prev) => ({ ...prev, pacing: value }))
                  }
                />
              </Field>
              <Field label="Call To Action">
                <TextInput
                  value={project.callToAction}
                  onChange={(value) =>
                    setProject((prev) => ({
                      ...prev,
                      callToAction: value,
                    }))
                  }
                />
              </Field>
              <Field label="Budget Feel">
                <Select
                  value={project.budgetLevel}
                  onChange={(value) =>
                    setProject((prev) => ({
                      ...prev,
                      budgetLevel: value as ProjectInfo["budgetLevel"],
                    }))
                  }
                  options={[
                    { label: "Indie handcrafted", value: "indie" },
                    { label: "Premium polished", value: "premium" },
                    { label: "Blockbuster spectacle", value: "blockbuster" },
                  ]}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Visual Language"
            description="Lock in the cinematic grammar Veo should follow."
          >
            <Field label="Cinematography Style">
              <TextArea
                value={visualLanguage.cinematographyStyle}
                onChange={(value) =>
                  setVisualLanguage((prev) => ({
                    ...prev,
                    cinematographyStyle: value,
                  }))
                }
                rows={3}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Lighting">
                <TextArea
                  value={visualLanguage.lighting}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({ ...prev, lighting: value }))
                  }
                  rows={3}
                />
              </Field>
              <Field label="Color Palette">
                <TextArea
                  value={visualLanguage.colorPalette}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({
                      ...prev,
                      colorPalette: value,
                    }))
                  }
                  rows={3}
                />
              </Field>
              <Field label="Art Direction">
                <TextArea
                  value={visualLanguage.artDirection}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({
                      ...prev,
                      artDirection: value,
                    }))
                  }
                  rows={3}
                />
              </Field>
              <Field label="Camera Movement">
                <TextArea
                  value={visualLanguage.cameraMovement}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({
                      ...prev,
                      cameraMovement: value,
                    }))
                  }
                  rows={3}
                />
              </Field>
              <Field label="Lensing">
                <TextArea
                  value={visualLanguage.lensing}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({ ...prev, lensing: value }))
                  }
                  rows={3}
                />
              </Field>
              <Field label="Texture & FX">
                <TextArea
                  value={visualLanguage.textureAndFX}
                  onChange={(value) =>
                    setVisualLanguage((prev) => ({
                      ...prev,
                      textureAndFX: value,
                    }))
                  }
                  rows={3}
                />
              </Field>
            </div>
            <Field label="Reference Callouts (optional)">
              <TextArea
                value={visualLanguage.references}
                onChange={(value) =>
                  setVisualLanguage((prev) => ({
                    ...prev,
                    references: value,
                  }))
                }
                rows={3}
              />
            </Field>
          </Section>

          <Section
            title="Character Continuity"
            description="Maintain consistent character styling across the Veo timeline."
          >
            <div className="grid gap-5">
              {characters.map((character, index) => (
                <div
                  key={character.id}
                  className="rounded-xl border border-zinc-200 bg-white/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-700">
                      Character {index + 1}
                    </p>
                    {characters.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCharacters((prev) =>
                            prev.filter((item) => item.id !== character.id),
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name">
                      <TextInput
                        value={character.name}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, name: value }
                                : item,
                            ),
                          )
                        }
                      />
                    </Field>
                    <Field label="Role / Archetype">
                      <TextInput
                        value={character.role}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, role: value }
                                : item,
                            ),
                          )
                        }
                      />
                    </Field>
                    <Field label="Backstory / Drive">
                      <TextArea
                        value={character.backstory}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, backstory: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Visual Traits">
                      <TextArea
                        value={character.visualTraits}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, visualTraits: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Wardrobe">
                      <TextArea
                        value={character.wardrobe}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, wardrobe: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Performance Notes">
                      <TextArea
                        value={character.performanceNotes}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, performanceNotes: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Consistency Anchors">
                      <TextArea
                        value={character.consistencyKeys}
                        onChange={(value) =>
                          setCharacters((prev) =>
                            prev.map((item) =>
                              item.id === character.id
                                ? { ...item, consistencyKeys: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCharacters((prev) => [
                  ...prev,
                  {
                    id: createId(),
                    name: "New Character",
                    role: "Supporting role",
                    backstory: "",
                    visualTraits: "",
                    wardrobe: "",
                    performanceNotes: "",
                    consistencyKeys: "",
                  },
                ])
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              <PlusCircle className="h-4 w-4" />
              Add Character
            </button>
          </Section>

          <Section
            title="Scene Beats"
            description="Break the narrative into precise Veo-ready moments."
          >
            <div className="grid gap-5">
              {sceneBeats.map((beat, index) => (
                <div
                  key={beat.id}
                  className="rounded-xl border border-zinc-200 bg-white/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-700">
                      Beat {index + 1}
                    </p>
                    {sceneBeats.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSceneBeats((prev) =>
                            prev.filter((item) => item.id !== beat.id),
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Label / Beat Name">
                      <TextInput
                        value={beat.label}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, label: value }
                                : item,
                            ),
                          )
                        }
                      />
                    </Field>
                    <Field label="Timestamp">
                      <TextInput
                        value={beat.timestamp}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, timestamp: value }
                                : item,
                            ),
                          )
                        }
                      />
                    </Field>
                    <Field label="Narrative Objective">
                      <TextArea
                        value={beat.objective}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, objective: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Setting">
                      <TextArea
                        value={beat.setting}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, setting: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Action / Blocking">
                      <TextArea
                        value={beat.action}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, action: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Emotional Beat">
                      <TextArea
                        value={beat.emotionalBeat}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, emotionalBeat: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Cinematography Direction">
                      <TextArea
                        value={beat.cinematography}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, cinematography: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Transitions">
                      <TextArea
                        value={beat.transitions}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, transitions: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Field label="Voice Over / Dialogue">
                      <TextArea
                        value={beat.voiceOver}
                        onChange={(value) =>
                          setSceneBeats((prev) =>
                            prev.map((item) =>
                              item.id === beat.id
                                ? { ...item, voiceOver: value }
                                : item,
                            ),
                          )
                        }
                        rows={3}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setSceneBeats((prev) => [
                  ...prev,
                  {
                    id: createId(),
                    label: `Beat ${prev.length + 1}`,
                    timestamp: "",
                    objective: "",
                    setting: "",
                    action: "",
                    emotionalBeat: "",
                    cinematography: "",
                    transitions: "",
                    voiceOver: "",
                  },
                ])
              }
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
            >
              <PlusCircle className="h-4 w-4" />
              Add Beat
            </button>
          </Section>

          <Section
            title="Audio Direction"
            description="Guide voiceover, music, and sound design cues."
          >
            <Field label="Voiceover Tone & Delivery">
              <TextArea
                value={audio.voiceOverTone}
                onChange={(value) =>
                  setAudio((prev) => ({ ...prev, voiceOverTone: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Dialogue Notes">
              <TextArea
                value={audio.dialogueNotes}
                onChange={(value) =>
                  setAudio((prev) => ({ ...prev, dialogueNotes: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Music Direction">
              <TextArea
                value={audio.music}
                onChange={(value) =>
                  setAudio((prev) => ({ ...prev, music: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Sound Design">
              <TextArea
                value={audio.soundDesign}
                onChange={(value) =>
                  setAudio((prev) => ({ ...prev, soundDesign: value }))
                }
                rows={3}
              />
            </Field>
          </Section>

          <Section
            title="Generation Controls"
            description="Dial in Veo 3.1 parameters to lock the cinematic output."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Motion Intensity">
                <Select
                  value={settings.motionIntensity}
                  onChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      motionIntensity: value as GenerationSettings["motionIntensity"],
                    }))
                  }
                  options={[
                    { label: "Static tableau", value: "static" },
                    { label: "Cinematic sweep", value: "cinematic" },
                    { label: "Hyper dynamic", value: "hyperdynamic" },
                  ]}
                />
              </Field>
              <Field label="Render Quality">
                <Select
                  value={settings.renderQuality}
                  onChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      renderQuality: value as GenerationSettings["renderQuality"],
                    }))
                  }
                  options={[
                    { label: "Standard", value: "standard" },
                    { label: "High", value: "high" },
                    { label: "Ultra", value: "ultra" },
                  ]}
                />
              </Field>
            </div>
            <Field label="Camera Rig / Movement System">
              <TextArea
                value={settings.cameraRig}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, cameraRig: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Seed & Consistency Controls">
              <TextArea
                value={settings.seedControl}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, seedControl: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Negative Prompts">
              <TextArea
                value={settings.negativePrompts}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, negativePrompts: value }))
                }
                rows={3}
              />
            </Field>
            <Field label="Delivery Format & Output Notes">
              <TextArea
                value={settings.deliveryFormat}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, deliveryFormat: value }))
                }
                rows={3}
              />
            </Field>
          </Section>
        </div>

        <aside className="flex h-fit flex-col gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
            <header className="mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Structured Prompt JSON
              </h2>
              <p className="text-xs text-zinc-500">
                Feed directly into Veo 3.1 for consistent, premium results.
              </p>
            </header>
            <pre className="h-[420px] overflow-y-auto rounded-xl bg-zinc-950/95 p-4 text-[11px] leading-relaxed text-zinc-100 shadow-inner">
              {JSON.stringify(structuredPrompt, null, 2)}
            </pre>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy JSON
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-white/40 p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Prompt Blueprint
            </h3>
            <p className="mt-3 text-sm text-zinc-600">
              This schema keeps Veo focused on cinematic cohesion:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li>• Project DNA locks tone, emotion, and CTA.</li>
              <li>• Visual language dictates lighting, lenses, and movement.</li>
              <li>• Character cards enforce continuity across every beat.</li>
              <li>• Scene beats translate to shot-by-shot Veo directives.</li>
              <li>• Generation controls tune motion, fidelity, and delivery.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default PromptBuilder;

