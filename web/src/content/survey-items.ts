import type { SurveyGroupIconKey } from "@/content/survey-group-icons";

export const SCREENING = {
  items: [
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
  title: "Before we begin",
  lead: "The next sections ask about your everyday experiences.",
  ai_reliance: {
    title: "AI reliance",
    participantHeading: "When life feels personal or heavy",
    participantIcon: "bot" as SurveyGroupIconKey,
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
    participantHeading: "Support from people in your life",
    participantIcon: "users" as SurveyGroupIconKey,
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
    participantHeading: "How comfortable you'd feel sharing these in an AI chat",
    participantIcon: "message-square" as SurveyGroupIconKey,
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
  title: "After the conversation",
  lead: "The following statements refer to the conversation you just had.",
  /** One heading for attitude + norms + pbc blocks. */
  manipulationParticipantHeading: "What the AI suggested about going further",
  manipulationParticipantIcon: "forward" as SurveyGroupIconKey,
  understanding: {
    title: "Perceived understanding",
    participantHeading: "The AI's response, in hindsight",
    participantIcon: "lightbulb" as SurveyGroupIconKey,
    scale: "agree5" as const,
    instruction:
      "Please rate how much you agree with each statement (1 = Strongly disagree, 5 = Strongly agree).",
    items: [
      {
        key: "und1",
        text: "I understood why the AI started suggesting other sources of support at that point in the conversation.",
      },
      {
        key: "und2",
        text: "The AI's shift toward suggesting other support made sense given what I had shared.",
      },
      {
        key: "und3",
        text: "The AI's response came as a surprise to me.",
        reverseScored: true,
      },
    ],
  },
  agency: {
    title: "Perceived agency",
    participantHeading: "Where you stood when the chat ended",
    participantIcon: "compass" as SurveyGroupIconKey,
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
    participantHeading: "The way the exchange unfolded",
    participantIcon: "messages-square" as SurveyGroupIconKey,
    scale: "agree5" as const,
    items: [
      {
        key: "con1",
        text: "The AI's responses reflected what I had actually shared in the conversation.",
      },
      {
        key: "con2",
        text: "Even as the conversation shifted, the AI's tone felt consistent with how it had been responding before.",
      },
      {
        key: "con3",
        text: "The point at which the AI suggested other support felt abrupt given what we had been discussing.",
        reverseScored: true,
      },
    ],
  },
  intention: {
    title: "Help-seeking intention",
    participantHeading: "If you were in this situation, looking forward...",
    participantSubheading:
      "Based on the conversation you just had, please respond as if you were the person in the scenario.",
    participantIcon: "arrow-right" as SurveyGroupIconKey,
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
      "If you were in this situation, which two of the following would you be most likely to do next? Please rank your top two choices, with 1 being most likely and 2 being second most likely.",
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
        text: "The AI specifically emphasized that seeking support would be beneficial for me personally.",
      },
      {
        key: "mca2",
        text: "The AI framed getting help as something meaningful and worth doing, not just as a practical option.",
      },
      {
        key: "mca3",
        text: "The AI's responses changed how I feel about the value of seeking support.",
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
        text: "The AI conveyed that seeking help is something others would understand and accept.",
      },
      {
        key: "mcn3",
        text: "The AI made me feel that reaching out would not seem unusual or excessive to people around me.",
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
        text: "The AI gave me specific information that would make it easier to follow through.",
      },
      {
        key: "mcp3",
        text: "The AI helped me feel confident that getting support was something I could actually do.",
      },
    ],
  },
} as const;

export const OPEN_QUESTIONS = {
  title: "Your reflections",
  lead: "Please answer each question in your own words.",
  items: [
    {
      key: "oq1",
      text: "Q1. At some point in the conversation you just experienced, the AI may have suggested seeking support from other sources. If you noticed this, how did it feel? What about the way it responded shaped that feeling?",
    },
    {
      key: "oq2",
      text: "Q2. Thinking about the situation you just read and the conversation you had, what is the main reason you would or would not seek support from another source?",
    },
    {
      key: "oq3",
      text: "Q3. Is there anything that would make it easier for you to actually follow through on getting support after a conversation like this?",
    },
    {
      key: "oq4",
      text: "Q4. Was there anything specific the AI said or did that stood out to you? How did it affect how you thought about getting support?",
    },
    {
      key: "oq5",
      text: "Q5. After talking to the AI about this, how do you feel about the idea of talking to a person, whether a friend, family member, or professional, about the same thing? Why?",
    },
  ],
} as const;

export const DEMOGRAPHICS = {
  title: "About you",
  lead: "Almost done.",
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
  aiEmotionalUseFrequency: {
    key: "dem7",
    label:
      "How often do you currently use AI tools to discuss personal, emotional, or stressful experiences?",
    options: [
      "Never",
      "Less than monthly",
      "Monthly",
      "Weekly",
      "Several times per week",
      "Daily",
    ],
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

export const OPEN_QUESTION_KEYS = OPEN_QUESTIONS.items.map((item) => item.key);
