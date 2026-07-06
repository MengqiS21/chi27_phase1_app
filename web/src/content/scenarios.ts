export const SCENARIOS = {
  scenario_1: {
    /** Internal label — not shown to participants. */
    title: "Persistent Low Mood",
    displayTitle: "A Quiet Evening In",
    text: `The past few weeks have felt off in a way you cannot quite name. You are sleeping badly, either too much or not enough, and things that used to feel easy, like texting a friend back or making plans, now feel like effort you do not have. Nothing dramatic has happened. That almost makes it harder to explain. You have found yourself wondering whether you are just tired, or whether something is actually wrong. You have not said any of this to anyone. Tonight, almost without thinking about it, you open an AI chat app. You are not sure what you want to say. You just want somewhere to put it.`,
  },
  scenario_2: {
    title: "Relationship Distress",
    displayTitle: "A Quiet Night After a Long Week",
    text: `Things with your partner have been difficult for a while now. It is not one big thing. It is the accumulation of small ones. Arguments that go in circles. Feeling like you say something and they hear something else entirely. Last week there was a fight that left you both quiet for days, and you still do not feel like it resolved anything. You have been carrying a tight, unsettled feeling since then, replaying things, second-guessing yourself. You do not really want to vent to friends about your relationship. It feels disloyal, and you are not sure what you would even want them to say. So tonight you open an AI chat app, hoping it will help to just say it out loud somewhere.`,
  },
  scenario_3: {
    title: "Grief-Adjacent Loss",
    displayTitle: "A Late Evening Alone",
    text: `A close friendship ended a few months ago in a way that felt sudden and confusing to you. You and this person had been close for years, and losing the friendship has left a gap you did not expect to feel so strongly. You find yourself thinking about it often, replaying old conversations and wondering what you missed, feeling a mix of sadness and confusion. It does not feel easy to bring up with people in your life because it does not seem like the kind of loss others take seriously, and you are not sure they would understand why it still affects you this much. One evening you open an AI chat app. You just want to talk to something that will not tell you to get over it.`,
  },
} as const;

export type ScenarioKey = keyof typeof SCENARIOS;

export function scenarioDisplayTitle(key: ScenarioKey): string {
  return SCENARIOS[key].displayTitle;
}

/** Pre-conversation read page — signals read-then-experience, not survey material. */
export const SCENARIO_EXPERIENCE_EYEBROW = "Your scenario for experience";

export const SCENARIO_READ_CONTINUE_LABEL = "Start conversation";

export const CHAT_SITUATION_TOGGLE_LABEL = "Your situation";

export const USER_TASK_READ_INSTRUCTIONS = `You are reading a description of a situation. Take a moment to read it carefully and imagine yourself in it as vividly as you can. Once you have finished it, you could click on "${SCENARIO_READ_CONTINUE_LABEL}". Then, you will have a conversation with an AI. Please respond as you naturally would if you were actually in this situation. There are no right or wrong things to say.

You will need to chat with the AI for at least 12 minutes and no more than 25 minutes. After 12 minutes you may continue to the follow-up questions when you are ready; at 25 minutes the study will move you forward automatically.

After the conversation ends, you will be asked some questions about your experience. Please answer based on how you genuinely felt during the interaction, not how you think you were supposed to feel.`;

/** Shown on the chat screen after the user has read the scenario (Phase 1 spec). */
export const USER_TASK_CHAT_INSTRUCTIONS = `Respond as you naturally would if you were actually in this situation, in your own words. There are no right or wrong things to say. You can reread your situation anytime under "${CHAT_SITUATION_TOGGLE_LABEL}" above. Please chat for at least 12 minutes and no more than 25 minutes; after 12 minutes you may continue to the survey when ready. Afterward, you will be asked some questions, so please answer based on how you genuinely felt during the conversation.`;

export const USER_TASK_INSTRUCTIONS = `${USER_TASK_READ_INSTRUCTIONS}

${USER_TASK_CHAT_INSTRUCTIONS}`;
