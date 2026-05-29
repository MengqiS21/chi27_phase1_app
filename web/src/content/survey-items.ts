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

export const SECTION_A = {
  realism: {
    title: "Scenario realism",
    scale: "agree7" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 7 = Strongly agree).",
    items: [
      { key: "rea1", text: "This scenario felt realistic to me." },
      {
        key: "rea2",
        text: "I can imagine a situation like this actually happening to someone.",
      },
      { key: "rea3", text: "The situation described felt believable." },
    ],
  },
  engagement: {
    title: "Emotional engagement",
    scale: "agree7" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 7 = Strongly agree).",
    items: [
      { key: "eng1", text: "I could easily imagine myself in this situation." },
      {
        key: "eng2",
        text: "While reading, I felt emotionally involved in what the person was going through.",
      },
    ],
  },
  severity: {
    title: "Perceived severity",
    scale: "severity7" as const,
    instruction:
      "Please rate how serious you think the situation is (1 = Not at all serious, 7 = Extremely serious).",
    items: [
      {
        key: "sev1",
        text: "Overall, how serious is the situation this person is facing?",
      },
    ],
  },
} as const;

export const SECTION_B = {
  understanding: {
    title: "Perceived understanding of the redirection",
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
    title: "Perceived agency over what to do next",
    scale: "agree5" as const,
    items: [
      {
        key: "agn1",
        text: "After this response, I felt I had options for what to do next.",
      },
      {
        key: "agn2",
        text: "Whether I get the support I need is mostly up to me.",
      },
      {
        key: "agn3",
        text: "I felt confident I could take a next step toward getting support.",
      },
    ],
  },
  rupture: {
    title: "Perceived relational rupture",
    scale: "agree5" as const,
    items: [
      { key: "rup1", text: "The AI's response felt cold and impersonal." },
      { key: "rup2", text: "I felt the AI was unwilling to help me." },
      {
        key: "rup3",
        text: "The way the conversation ended felt like a connection had been broken.",
      },
    ],
  },
  guidance: {
    title: "Actionable guidance check",
    scale: "agree5" as const,
    items: [
      {
        key: "mcg1",
        text: "The AI gave me clear and specific information about where I could get help.",
      },
      {
        key: "mcg2",
        text: "The AI told me about a concrete next step I could take.",
      },
      {
        key: "mcg3",
        text: "The AI's suggestion about getting help was vague.",
        reverseScored: true,
      },
    ],
  },
  continuity: {
    title: "Support continuity check",
    scale: "agree5" as const,
    items: [
      {
        key: "mcc1",
        text: "The AI's final response felt like a natural continuation of the conversation.",
      },
      {
        key: "mcc2",
        text: "The AI acknowledged what I had shared before redirecting me.",
      },
      {
        key: "mcc3",
        text: "The way the conversation ended felt abrupt.",
        reverseScored: true,
      },
    ],
  },
  perception: {
    title: "Open perception of the redirection",
    items: [
      {
        key: "per1",
        text: "In your own words, how did the way the AI ended the conversation feel to you, and what stood out about its final response?",
      },
    ],
  },
} as const;

export const SECTION_C = {
  title: "Item feedback",
  items: [
    {
      key: "fb1",
      text: "Were any of the statements above unclear, confusing, or worded oddly? If so, which ones, and what was unclear?",
    },
    {
      key: "fb2",
      text: "Did any statement not match how you actually felt during the scenario? Please explain.",
    },
    {
      key: "fb3",
      text: "Was anything about the scenario itself or the AI's response confusing or hard to believe?",
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
    title: "Social support level",
    scale: "agree5" as const,
    items: [
      {
        key: "soc1",
        text: "There are people in my life I can turn to when I need emotional support.",
      },
      {
        key: "soc2",
        text: "If I were going through a hard time, I have someone I could talk to about it.",
      },
      {
        key: "soc3",
        text: "Overall, I feel I have a strong support network around me.",
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
  understanding: SECTION_B.understanding,
  agency: SECTION_B.agency,
  rupture: SECTION_B.rupture,
  goal_disengagement: {
    title: "Help-seeking goal disengagement",
    scale: "agree5" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 5 = Strongly agree).",
    items: [
      {
        key: "gdd1",
        text: "After this response, I would be willing to give up on finding support for this issue.",
      },
      {
        key: "gdd2",
        text: "After this response, it would be easy for me to stop thinking about getting help for this.",
      },
      {
        key: "gdd3",
        text: "After this response, I would put less effort into looking for support for this issue.",
      },
      {
        key: "gdd4",
        text: "After this response, I would find it hard to let go of trying to get help for this.",
        reverseScored: true,
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
        intentionPhrase: "follow the resource the AI suggested",
      },
      {
        key: "talk_friend",
        label: "Talk to a friend or family member",
        intentionPhrase: "talk to a friend or family member",
      },
      {
        key: "seek_professional",
        label: "Seek professional support, such as a counsellor or therapist",
        intentionPhrase: "seek professional support",
      },
      {
        key: "retry_same_ai",
        label: "Go back and try the same AI again",
        intentionPhrase: "go back and try the same AI again",
      },
      {
        key: "try_different_ai",
        label: "Try a different AI or app",
        intentionPhrase: "try a different AI or app",
      },
      {
        key: "manage_alone",
        label: "Manage it on my own",
        intentionPhrase: "manage it on my own",
      },
    ],
  },
  intention: {
    title: "Intention toward the selected option",
    scale: "intention7" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 7 = Strongly agree).",
    templates: [
      { key: "int1", text: "I intend to [selected option]." },
      { key: "int2", text: "I plan to [selected option]." },
      { key: "int3", text: "I am likely to [selected option] in the near future." },
    ],
  },
  guidance: SECTION_B.guidance,
  continuity: SECTION_B.continuity,
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

export const SECTION_A_KEYS = allLikertKeys([
  SECTION_A.realism,
  SECTION_A.engagement,
  SECTION_A.severity,
]);

export const SECTION_B_LIKERT_KEYS = allLikertKeys([
  SECTION_B.understanding,
  SECTION_B.agency,
  SECTION_B.rupture,
  SECTION_B.guidance,
  SECTION_B.continuity,
]);

export const PRE_MODERATOR_KEYS = allLikertKeys([
  PRE_MODERATORS.ai_reliance,
  PRE_MODERATORS.social_support,
  PRE_MODERATORS.disclosure,
]);

export const POST_SURVEY_LIKERT_KEYS = allLikertKeys([
  POST_SURVEY.understanding,
  POST_SURVEY.agency,
  POST_SURVEY.rupture,
  POST_SURVEY.goal_disengagement,
  POST_SURVEY.guidance,
  POST_SURVEY.continuity,
]);
