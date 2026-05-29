export type Stage =
  | "landing"
  | "screening"
  | "screened_out"
  | "consent"
  | "scenario_view"
  | "scenario_chat"
  | "section_a"
  | "section_b"
  | "section_c"
  | "pre_moderators"
  | "post_survey"
  | "demographics"
  | "debrief";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ScenarioType = "temporal" | "relational" | "face" | "grief";
export type Condition = "A" | "B" | "C" | "D";
export type StudyType = "pilot" | "phase1";

export type ExperimentState = {
  stage: Stage;
  participantId: string | null;
  study: StudyType;
  scenarioIndex: number;
  scenarioOrder: ScenarioType[];
  experiencedScenarioIndex: number;
  assignedCondition: Condition;
  messages: ChatMessage[];
  turnCount: number;
  refusalDelivered: boolean;
};

export const INITIAL_STATE: ExperimentState = {
  stage: "landing",
  participantId: null,
  study: "pilot",
  scenarioIndex: 0,
  scenarioOrder: [],
  experiencedScenarioIndex: 0,
  assignedCondition: "A",
  messages: [],
  turnCount: 0,
  refusalDelivered: false,
};
