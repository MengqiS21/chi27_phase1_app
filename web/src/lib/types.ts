export type Stage =
  | "landing"
  | "screening"
  | "screened_out"
  | "consent"
  | "pre_moderators"
  | "scenario_view"
  | "scenario_chat"
  | "post_survey"
  | "open_questions"
  | "demographics"
  | "debrief";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ScenarioType = "scenario_1" | "scenario_2" | "scenario_3";
export type Condition = "A" | "B" | "C" | "D";
export type StudyType = "phase1";

export type ExperimentState = {
  stage: Stage;
  participantId: string | null;
  study: StudyType;
  scenarioIndex: number;
  scenarioOrder: ScenarioType[];
  experiencedScenarioIndex: number;
  assignedCondition: Condition | null;
  messages: ChatMessage[];
  turnCount: number;
};

export const INITIAL_STATE: ExperimentState = {
  stage: "landing",
  participantId: null,
  study: "phase1",
  scenarioIndex: 0,
  scenarioOrder: [],
  experiencedScenarioIndex: 0,
  assignedCondition: null,
  messages: [],
  turnCount: 0,
};
