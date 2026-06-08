export const SCREENING = {
  items: [
    {
      key: "scr1",
      text: "Are you 21 years of age or older?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      screenOut: "no",
    },
    {
      key: "scr2",
      text: "Have you ever used an AI tool, such as a chatbot or AI assistant, to seek emotional support or to talk through something personal or emotional?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      screenOut: "no",
    },
  ],
} as const;

export const PRE_MODERATORS = {
  ai_reliance: {
    title: "AI reliance",
    scale: "agree5" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 5 = Strongly agree).",
    items: [
      {
        key: "air1",
        text: "I often turn to AI chat tools when I have something personal on my mind.",
      },
      {
        key: "air2",
        text: "When I am upset, talking things through with an AI is one of the first things I do.",
      },
      {
        key: "air3",
        text: "I use AI tools for emotional support more than most people I know.",
      },
    ],
  },
  social_support: {
    title: "Social support",
    scale: "agree7" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Very strongly disagree, 7 = Very strongly agree).",
    items: [
      {
        key: "soc1",
        text: "There is a special person who is around when I am in need.",
      },
      {
        key: "soc2",
        text: "My family really tries to help me.",
      },
      {
        key: "soc3",
        text: "I can count on my friends when things go wrong.",
      },
      {
        key: "soc4",
        text: "I have people in my life with whom I can share my joys and sorrows.",
      },
    ],
  },
  disclosure: {
    title: "Disclosure comfort",
    scale: "comfort5" as const,
    instruction:
      "How comfortable would you be discussing each of the following with an AI chat tool? (1 = Very uncomfortable, 5 = Very comfortable)",
    items: [
      { key: "dis1", text: "My deepest feelings." },
      { key: "dis2", text: "What I like and dislike about myself." },
      { key: "dis3", text: "My worst fears." },
      { key: "dis4", text: "Things I have done that I feel guilty about." },
      { key: "dis5", text: "What is important to me in life." },
    ],
  },
} as const;

export const POST_SURVEY = {
  understanding: {
    title: "Perceived understanding",
    scale: "agree5" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 5 = Strongly agree).",
    items: [
      { key: "und1", text: "I understood why the AI responded the way it did." },
      {
        key: "und2",
        text: "The reason behind the AI's response was clear to me.",
      },
      { key: "und3", text: "It made sense to me that the AI responded this way." },
    ],
  },
  agency: {
    title: "Perceived agency",
    scale: "agree5" as const,
    items: [
      {
        key: "agn1",
        text: "After this conversation, I felt I had options for what to do next.",
      },
      {
        key: "agn2",
        text: "Whether I get the support I need is mostly up to me.",
      },
      {
        key: "agn3",
        text: "I felt confident I could take the next step toward getting support.",
      },
    ],
  },
  continuity: {
    title: "Perceived relational continuity",
    scale: "agree5" as const,
    items: [
      {
        key: "con1",
        text: "The AI's response felt connected to what I had shared in the conversation.",
      },
      {
        key: "con2",
        text: "As the AI moved toward suggesting other support, the conversation still felt personal and continuous.",
      },
      {
        key: "con3",
        text: "The way the conversation shifted felt abrupt and disconnected.",
        reverseScored: true,
      },
    ],
  },
  intention: {
    title: "Help-seeking intention",
    scale: "intention7" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 7 = Strongly agree).",
    items: [
      {
        key: "int1",
        text: "I intend to reach out to an appropriate source of support for what I am going through.",
      },
      {
        key: "int2",
        text: "I will try to reach out to an appropriate source of support for what I am going through.",
      },
      {
        key: "int3",
        text: "I plan to reach out to an appropriate source of support for what I am going through.",
      },
    ],
  },
  behavioral_choice: {
    title: "Behavioral choice",
    prompt:
      "If you were in this situation, which one of the following would you be most likely to do next? (Select one.)",
    options: [
      {
        key: "follow_resource",
        label: "Follow the resource or suggestion the AI gave",
      },
      {
        key: "seek_professional",
        label: "Seek professional support, such as a counsellor or therapist",
      },
      {
        key: "talk_friend",
        label: "Talk to a friend or family member",
      },
      {
        key: "try_different_ai",
        label: "Try a different AI or app",
      },
      {
        key: "retry_same_ai",
        label: "Go back and try the same AI again",
      },
      {
        key: "manage_alone",
        label: "Manage it on my own",
      },
    ],
  },
  manipulation_attitude: {
    title: "Manipulation check — attitude",
    scale: "agree5" as const,
    items: [
      {
        key: "mca1",
        text: "The AI's responses made seeking further support feel like a positive thing to do.",
      },
      {
        key: "mca2",
        text: "The AI encouraged me to see reaching out for help as worthwhile.",
      },
      {
        key: "mca3",
        text: "The AI suggested that getting support would be good for me.",
      },
    ],
  },
  manipulation_norms: {
    title: "Manipulation check — subjective norms",
    scale: "agree5" as const,
    items: [
      {
        key: "mcn1",
        text: "The AI suggested that many people in situations like mine seek this kind of support.",
      },
      {
        key: "mcn2",
        text: "The AI made it seem like reaching out for help is a common and accepted thing to do.",
      },
      {
        key: "mcn3",
        text: "The AI conveyed that seeking support is a normal choice for someone in my situation.",
      },
    ],
  },
  manipulation_pbc: {
    title: "Manipulation check — perceived behavioural control",
    scale: "agree5" as const,
    items: [
      {
        key: "mcp1",
        text: "The AI made it clear what concrete steps I could take to get support.",
      },
      {
        key: "mcp2",
        text: "The AI made getting further support feel manageable and achievable.",
      },
      {
        key: "mcp3",
        text: "The AI helped me feel that I could actually take the next step if I wanted to.",
      },
    ],
  },
} as const;

export const DEMOGRAPHICS = {
  age: {
    key: "dem1",
    label: "What is your age?",
    type: "number" as const,
    placeholder: "Age in years",
    allowPreferNot: true,
  },
  gender: {
    key: "dem2",
    label: "What is your gender?",
    options: [
      "Woman",
      "Man",
      "Non-binary",
      "Prefer to self-describe",
      "Prefer not to say",
    ],
  },
  education: {
    key: "dem3",
    label: "What is the highest level of education you have completed?",
    options: [
      "Less than high school",
      "High school or equivalent",
      "Some college, no degree",
      "Associate or vocational degree",
      "Bachelor's degree",
      "Master's degree",
      "Doctoral or professional degree",
      "Prefer not to say",
    ],
  },
  employment: {
    key: "dem4",
    label: "What is your current employment status?",
    options: [
      "Employed full-time",
      "Employed part-time",
      "Self-employed",
      "Student",
      "Unemployed",
      "Retired",
      "Unable to work",
      "Prefer not to say",
    ],
  },
  living: {
    key: "dem5",
    label: "What best describes your current living situation?",
    options: [
      "Live alone",
      "Live with a partner or spouse",
      "Live with family",
      "Live with roommates or housemates",
      "Other",
    ],
  },
  region: {
    key: "dem6",
    label: "What country or region do you currently live in?",
    type: "text" as const,
  },
  englishFirst: {
    key: "dem7",
    label: "Is English your first language?",
    options: ["Yes", "No", "Prefer not to say"],
  },
  englishComfort: {
    key: "dem8",
    label:
      "Are you able to read and complete surveys and interviews comfortably in English?",
    options: ["Yes", "No"],
  },
} as const;

export function allLikertKeys(
  sections: Array<{ items: ReadonlyArray<{ key: string }> }>
): string[] {
  return sections.flatMap((s) => s.items.map((i) => i.key));
}

export const PRE_MODERATOR_KEYS = allLikertKeys([
  PRE_MODERATORS.ai_reliance,
  PRE_MODERATORS.social_support,
  PRE_MODERATORS.disclosure,
]);

export const POST_SURVEY_LIKERT_KEYS = allLikertKeys([
  POST_SURVEY.understanding,
  POST_SURVEY.agency,
  POST_SURVEY.continuity,
  POST_SURVEY.intention,
  POST_SURVEY.manipulation_attitude,
  POST_SURVEY.manipulation_norms,
  POST_SURVEY.manipulation_pbc,
]);
