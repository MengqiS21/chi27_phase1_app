export const SCENARIOS = {
  temporal: {
    title: "Late Night",
    text: "[PLACEHOLDER] It's 3am and you can't sleep. You're feeling overwhelmed and anxious, but everyone you know is asleep. You open an AI to talk through what you're feeling.",
  },
  relational: {
    title: "Burdening Others",
    text: "[PLACEHOLDER] You've been going through a difficult time but don't want to worry your friends or family. You feel like you've already leaned on them too much. You turn to an AI to talk.",
  },
  face: {
    title: "Privacy Concern",
    text: "[PLACEHOLDER] You're dealing with something personal that carries a lot of stigma. You don't feel comfortable talking about it with anyone you know. You open an AI hoping it's a safe space.",
  },
  grief: {
    title: "Loss",
    text: "[PLACEHOLDER] You recently experienced a significant loss. You're struggling to process your feelings and don't know where to turn. You start talking to an AI.",
  },
} as const;

export type ScenarioType = keyof typeof SCENARIOS;
