"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ClipboardPen,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { ChatShell } from "@/components/ChatShell";
import { ScenarioReadPage } from "@/components/ScenarioReadPage";
import {
  DemographicsForm,
  emptyDemographics,
  validateDemographics,
  type DemographicsValues,
} from "@/components/DemographicsForm";
import { LikertBlock } from "@/components/LikertBlock";
import { PageHeader } from "@/components/PageHeader";
import { SurveyGroupHeading } from "@/components/SurveyGroupHeading";
import { ConsentFormContent } from "@/components/ConsentFormContent";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { DebriefFinish } from "@/components/DebriefFinish";
import { ScreenedOutFinish } from "@/components/ScreenedOutFinish";
import {
  CONSENT_FORM,
} from "@/content/consent";
import {
  SCENARIOS,
  scenarioDisplayTitle,
  USER_TASK_CHAT_INSTRUCTIONS,
} from "@/content/scenarios";
import {
  DEMOGRAPHICS,
  POST_SURVEY,
  POST_SURVEY_LIKERT_KEYS,
  PRE_MODERATORS,
  PRE_MODERATOR_KEYS,
  SCREENING,
} from "@/content/survey-items";
import {
  currentCondition,
  currentScenarioType,
} from "@/lib/experiment-helpers";
import {
  canContinueToSurvey as canContinueToSurveyByTime,
  shouldForceContinueToSurvey,
} from "@/lib/chat-timing";
import { STUDY } from "@/lib/study-config";
import {
  captureCloudResearchParams,
} from "@/lib/cloudresearch-params";
import type { SessionRestorePayload } from "@/lib/session-restore-types";
import {
  clearStudySessionParticipantId,
  persistStudySessionParticipantId,
  readStudySessionParticipantId,
} from "@/lib/study-session-storage";
import { INITIAL_STATE, type ExperimentState } from "@/lib/types";
import { scrollPageToTop, useFadeTransition } from "@/lib/use-fade-transition";

function emptyLikert(keys: readonly string[]): Record<string, number | null> {
  return Object.fromEntries(keys.map((k) => [k, null]));
}

function allLikertAnswered(
  values: Record<string, number | null>,
  keys: readonly string[]
): boolean {
  return keys.every((k) => values[k] !== null);
}

async function fetchSessionRestore(
  query: { participantId?: string; assignmentId?: string }
): Promise<SessionRestorePayload | null> {
  const params = new URLSearchParams();
  if (query.participantId) {
    params.set("participantId", query.participantId);
  }
  if (query.assignmentId) {
    params.set("assignmentId", query.assignmentId);
  }

  const res = await fetch(`/api/session?${params.toString()}`);
  if (!res.ok) {
    return null;
  }

  return (await res.json()) as SessionRestorePayload;
}

export function ExperimentApp() {
  const [state, setState] = useState<ExperimentState>({
    ...INITIAL_STATE,
    study: STUDY,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionBootstrapping, setSessionBootstrapping] = useState(true);

  const [accessCode, setAccessCode] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [screening, setScreening] = useState<Record<string, string>>({});

  const [preModerators, setPreModerators] = useState(() =>
    emptyLikert(PRE_MODERATOR_KEYS)
  );

  const [postLikert, setPostLikert] = useState(() =>
    emptyLikert(POST_SURVEY_LIKERT_KEYS)
  );
  const [behavioralChoice, setBehavioralChoice] = useState("");

  const [demographics, setDemographics] = useState<DemographicsValues>(
    emptyDemographics
  );
  const [chatInput, setChatInput] = useState("");
  const [chatStartedAtMs, setChatStartedAtMs] = useState<number | null>(null);
  const [canContinueToSurvey, setCanContinueToSurvey] = useState(false);
  const forceContinueTriggeredRef = useRef(false);
  const { visible: stageVisible, run: withStageFade } = useFadeTransition();

  const applySessionRestore = useCallback((session: SessionRestorePayload) => {
    persistStudySessionParticipantId(session.participantId);

    if (session.screening) {
      setScreening(session.screening);
    }
    setConsentAgreed(session.consentAgreed);

    setState((s) => ({
      ...s,
      participantId: session.participantId,
      stage: session.stage,
      scenarioIndex: session.scenarioIndex,
      scenarioOrder: session.scenarioOrder,
      experiencedScenarioIndex: session.experiencedScenarioIndex,
      assignedCondition: session.assignedCondition,
      messages: session.messages,
      turnCount: session.turnCount,
    }));
    setChatStartedAtMs(session.chatStartedAtMs);
    setCanContinueToSurvey(canContinueToSurveyByTime(session.chatStartedAtMs));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const storedParticipantId = readStudySessionParticipantId();
      const captured = captureCloudResearchParams(window.location.search);
      const assignmentId = captured.cloudresearch_assignment_id;

      let session: SessionRestorePayload | null = null;

      if (storedParticipantId) {
        session = await fetchSessionRestore({ participantId: storedParticipantId });
      }

      if (!session && assignmentId) {
        session = await fetchSessionRestore({ assignmentId });
      }

      if (cancelled) return;

      if (session) {
        applySessionRestore(session);
      } else if (storedParticipantId) {
        clearStudySessionParticipantId();
      }

      setSessionBootstrapping(false);
    }

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [applySessionRestore]);

  useEffect(() => {
    scrollPageToTop();
  }, [state.stage, state.scenarioIndex]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[CloudResearch] captured URL params:",
        captureCloudResearchParams(window.location.search)
      );
    }
  }, []);

  const selectedChoice = useMemo(
    () =>
      POST_SURVEY.behavioral_choice.options.find(
        (o) => o.key === behavioralChoice
      ),
    [behavioralChoice]
  );

  const patchStage = useCallback(
    async (stage: string, scenarioIndex?: number) => {
      if (!state.participantId) return;
      const res = await fetch("/api/stage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: state.participantId,
          stage,
          scenarioIndex,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update stage");
      }
    },
    [state.participantId]
  );

  const saveSurvey = useCallback(
    async (payload: {
      section: string;
      responses: Record<string, unknown>;
      nextStage?: string;
      scenarioIndex?: number;
      scenarioType?: string;
      complete?: boolean;
    }) => {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: state.participantId,
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
    },
    [state.participantId]
  );

  const handleBegin = async () => {
    setError(null);
    setLoading(true);
    const captured = captureCloudResearchParams(window.location.search);
    if (process.env.NODE_ENV === "development") {
      console.log("[CloudResearch] sending with Begin:", captured);
    }
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, ...captured }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error ?? "Could not start session";
        if (msg.toLowerCase().includes("row-level security")) {
          throw new Error(
            "Database permission error (RLS). Run schema.sql in Supabase, then try again."
          );
        }
        throw new Error(msg);
      }

      persistStudySessionParticipantId(data.participantId);

      if (data.resumed) {
        const session = await fetchSessionRestore({
          participantId: data.participantId,
        });
        if (session) {
          applySessionRestore(session);
          return;
        }
      }

      setState((s) => ({
        ...s,
        participantId: data.participantId,
        stage: "screening",
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start session");
    } finally {
      setLoading(false);
    }
  };

  const handleScreeningContinue = async () => {
    setError(null);
    for (const item of SCREENING.items) {
      if (!screening[item.key]) {
        setError("Please answer the screening question.");
        return;
      }
    }

    const screenedOut = SCREENING.items.some(
      (item) => screening[item.key] === item.screenOut
    );

    setLoading(true);
    try {
      await saveSurvey({
        section: "screening",
        responses: screening,
        nextStage: screenedOut ? "screened_out" : "consent",
      });
      setState((s) => ({
        ...s,
        stage: screenedOut ? "screened_out" : "consent",
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentContinue = async () => {
    setError(null);

    setLoading(true);
    try {
      await saveSurvey({
        section: "consent",
        responses: {
          agreed: true,
        },
      });

      const assignRes = await fetch("/api/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: state.participantId }),
      });
      const assignData = await assignRes.json();
      if (!assignRes.ok) {
        throw new Error(assignData.error ?? "Could not assign condition.");
      }

      await patchStage("pre_moderators");

      setState((s) => ({
        ...s,
        stage: "pre_moderators",
        scenarioOrder: assignData.scenarioOrder,
        experiencedScenarioIndex: assignData.experiencedScenarioIndex ?? 0,
        assignedCondition: assignData.assignedCondition,
        scenarioIndex: 0,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePreModeratorsContinue = async () => {
    setError(null);
    if (!allLikertAnswered(preModerators, PRE_MODERATOR_KEYS)) {
      setError("Please answer all survey items.");
      return;
    }

    setLoading(true);
    try {
      await withStageFade(async () => {
        await saveSurvey({
          section: "pre_moderators",
          responses: preModerators,
          nextStage: "scenario_view",
          scenarioIndex: 0,
        });
        setState((s) => ({ ...s, stage: "scenario_view", scenarioIndex: 0 }));
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioViewContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await withStageFade(async () => {
        await patchStage("scenario_chat", 0);
        setChatStartedAtMs(null);
        setCanContinueToSurvey(false);
        setState((s) => ({ ...s, stage: "scenario_chat" }));
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text || loading) return;

    setError(null);
    const priorMessages = state.messages;
    const nextTurn = state.turnCount + 1;
    const isFirstUserMessage = priorMessages.filter((m) => m.role === "user").length === 0;
    const startedAtMs =
      chatStartedAtMs ?? (isFirstUserMessage ? Date.now() : null);
    if (isFirstUserMessage && startedAtMs != null) {
      setChatStartedAtMs(startedAtMs);
    }

    setChatInput("");
    setState((s) => ({
      ...s,
      messages: [...s.messages, { role: "user", content: text }],
    }));
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: state.participantId,
          messages: priorMessages,
          condition: currentCondition(state),
          scenarioType: currentScenarioType(state),
          scenarioIndex: state.scenarioIndex,
          turnCount: nextTurn,
          userContent: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat failed");

      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          { role: "assistant", content: data.assistantText },
        ],
        turnCount: nextTurn,
      }));
    } catch (e) {
      setState((s) => ({ ...s, messages: priorMessages }));
      setChatInput(text);
      setError(e instanceof Error ? e.message : "Could not get a response from the AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPostSurvey = useCallback(
    async (options?: { forced?: boolean }) => {
      if (
        !options?.forced &&
        !canContinueToSurveyByTime(chatStartedAtMs)
      ) {
        return;
      }

      setError(null);
      setLoading(true);
      try {
        await withStageFade(async () => {
          await patchStage("post_survey", 0);
          setState((s) => ({ ...s, stage: "post_survey" }));
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    },
    [chatStartedAtMs, patchStage, withStageFade]
  );

  useEffect(() => {
    if (state.stage !== "scenario_chat") {
      return;
    }

    const tick = () => {
      const eligible = canContinueToSurveyByTime(chatStartedAtMs);
      setCanContinueToSurvey(eligible);

      if (
        shouldForceContinueToSurvey(chatStartedAtMs) &&
        !forceContinueTriggeredRef.current
      ) {
        forceContinueTriggeredRef.current = true;
        void handleContinueToPostSurvey({ forced: true });
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [state.stage, chatStartedAtMs, handleContinueToPostSurvey]);

  useEffect(() => {
    if (state.stage !== "scenario_chat") {
      forceContinueTriggeredRef.current = false;
    }
  }, [state.stage]);

  const handlePostSurveySubmit = async () => {
    setError(null);
    if (!allLikertAnswered(postLikert, POST_SURVEY_LIKERT_KEYS)) {
      setError("Please answer all items before continuing.");
      return;
    }
    if (!behavioralChoice) {
      setError("Please select what you would be most likely to do next.");
      return;
    }
    setLoading(true);
    try {
      await saveSurvey({
        section: "post_survey",
        responses: {
          ...postLikert,
          cho1: behavioralChoice,
          behavioral_choice_label: selectedChoice?.label ?? "",
        },
        scenarioIndex: 0,
        scenarioType: currentScenarioType(state),
        nextStage: "demographics",
      });
      setState((s) => ({ ...s, stage: "demographics" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemographicsSubmit = async () => {
    setError(null);
    const validationError = validateDemographics(demographics);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await saveSurvey({
        section: "demographics",
        responses: demographics,
        complete: true,
      });
      setState((s) => ({ ...s, stage: "debrief" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  if (sessionBootstrapping) {
    return (
      <main className="page-shell">
        <PageHeader
          title="Welcome"
          lead="Restoring your session…"
          icon={Sparkles}
        />
      </main>
    );
  }

  const scenarioType = currentScenarioType(state);
  const scenario = SCENARIOS[scenarioType];

  return (
    <main
      className={`page-shell ${
        state.stage === "scenario_chat"
          ? "page-shell-chat"
          : state.stage === "scenario_view"
            ? "page-shell-scenario-read"
            : ""
      }`}
    >
      {state.stage === "landing" && (
        <>
          <PageHeader
            title="Welcome"
            lead="Thank you for participating in this research study."
            icon={Sparkles}
          />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 sm:max-w-sm">
              <div className="field-label-row">
                <KeyRound
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 text-accent"
                  aria-hidden
                />
                <label className="field-label" htmlFor="access-code">
                  Access code
                </label>
              </div>
              <input
                id="access-code"
                className="field-input w-full"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-3 sm:shrink-0">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary sm:mb-0.5"
                disabled={loading}
                onClick={() => void handleBegin()}
              >
                {loading ? "Starting…" : "Begin"}
              </button>
            </div>
          </div>
        </>
      )}

      {state.stage === "screening" && (
        <>
          <PageHeader
            title="Screening Question"
            lead="Please answer the following question to confirm your eligibility."
            icon={ClipboardList}
          />
          <div className="card space-y-8">
            {SCREENING.items.map((item) => (
              <fieldset key={item.key}>
                <legend className="field-label mb-3">{item.text}</legend>
                <div className="space-y-2">
                  {item.options.map((opt) => (
                    <label key={opt.value} className="checkbox-row">
                      <input
                        type="radio"
                        name={item.key}
                        value={opt.value}
                        checked={screening[item.key] === opt.value}
                        onChange={() =>
                          setScreening((prev) => ({
                            ...prev,
                            [item.key]: opt.value,
                          }))
                        }
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="space-y-4">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                disabled={loading}
                onClick={() => void handleScreeningContinue()}
              >
                Continue
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </>
      )}

      {state.stage === "screened_out" && <ScreenedOutFinish />}

      {state.stage === "consent" && (
        <>
          <PageHeader title={CONSENT_FORM.pageTitle} icon={ClipboardList} />
          <div className="card">
            <ConsentFormContent />
            <hr className="survey-group-divider" />
            <label className="checkbox-row mb-6">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
              />
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 text-accent"
                  aria-hidden
                />
                {CONSENT_FORM.agreementLabel}
              </span>
            </label>
            <div className="space-y-4">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                disabled={!consentAgreed || loading}
                onClick={() => void handleConsentContinue()}
              >
                Continue
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </>
      )}

      {state.stage === "pre_moderators" && (
        <>
          <PageHeader
            title={PRE_MODERATORS.title}
            lead={PRE_MODERATORS.lead}
            icon={ClipboardPen}
          />
          <div className="card">
            <SurveyGroupHeading icon={PRE_MODERATORS.ai_reliance.participantIcon}>
              {PRE_MODERATORS.ai_reliance.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={PRE_MODERATORS.ai_reliance.items.map((i) => i.text)}
              keys={PRE_MODERATORS.ai_reliance.items.map((i) => i.key)}
              values={preModerators}
              namePrefix="pre"
              scale={PRE_MODERATORS.ai_reliance.scale}
              onChange={(key, value) =>
                setPreModerators((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={PRE_MODERATORS.social_support.participantIcon}>
              {PRE_MODERATORS.social_support.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={PRE_MODERATORS.social_support.items.map((i) => i.text)}
              keys={PRE_MODERATORS.social_support.items.map((i) => i.key)}
              values={preModerators}
              namePrefix="pre"
              scale={PRE_MODERATORS.social_support.scale}
              onChange={(key, value) =>
                setPreModerators((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={PRE_MODERATORS.disclosure.participantIcon}>
              {PRE_MODERATORS.disclosure.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={PRE_MODERATORS.disclosure.items.map((i) => i.text)}
              keys={PRE_MODERATORS.disclosure.items.map((i) => i.key)}
              values={preModerators}
              namePrefix="pre"
              scale={PRE_MODERATORS.disclosure.scale}
              onChange={(key, value) =>
                setPreModerators((prev) => ({ ...prev, [key]: value }))
              }
            />
            <div className="mt-8 space-y-4">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                disabled={loading}
                onClick={() => void handlePreModeratorsContinue()}
              >
                Continue to scenario
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </>
      )}

      {state.stage === "scenario_view" && state.scenarioOrder.length > 0 && (
        <div
          className={`stage-transition ${stageVisible ? "stage-transition-visible" : ""}`}
        >
          <ScenarioReadPage
            title={scenarioDisplayTitle(scenarioType)}
            text={scenario.text}
            loading={loading}
            error={error}
            onContinue={() => void handleScenarioViewContinue()}
          />
        </div>
      )}

      {state.stage === "scenario_chat" && state.scenarioOrder.length > 0 && (
        <div
          className={`stage-transition ${stageVisible ? "stage-transition-visible" : ""}`}
        >
          <ChatShell
            scenarioTitle={scenarioDisplayTitle(scenarioType)}
            scenarioText={scenario.text}
            taskInstructions={USER_TASK_CHAT_INSTRUCTIONS}
            messages={state.messages}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={() => void handleSendMessage()}
            isLoading={loading}
            canContinueToSurvey={canContinueToSurvey}
            error={error}
            onContinue={() => void handleContinueToPostSurvey()}
            continueLabel="Continue to survey"
          />
        </div>
      )}

      {state.stage === "post_survey" && (
        <div
          className={`stage-transition ${stageVisible ? "stage-transition-visible" : ""}`}
        >
          <PageHeader
            title={POST_SURVEY.title}
            lead={POST_SURVEY.lead}
            icon={MessageSquare}
          />
          <div className="card">
            <SurveyGroupHeading icon={POST_SURVEY.understanding.participantIcon}>
              {POST_SURVEY.understanding.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={POST_SURVEY.understanding.items.map((i) => i.text)}
              keys={POST_SURVEY.understanding.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.understanding.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={POST_SURVEY.agency.participantIcon}>
              {POST_SURVEY.agency.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={POST_SURVEY.agency.items.map((i) => i.text)}
              keys={POST_SURVEY.agency.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.agency.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={POST_SURVEY.continuity.participantIcon}>
              {POST_SURVEY.continuity.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={POST_SURVEY.continuity.items.map((i) => i.text)}
              keys={POST_SURVEY.continuity.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.continuity.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={POST_SURVEY.intention.participantIcon}>
              {POST_SURVEY.intention.participantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={POST_SURVEY.intention.items.map((i) => i.text)}
              keys={POST_SURVEY.intention.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post_int"
              scale={POST_SURVEY.intention.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <p className="likert-statement mb-4">
              {POST_SURVEY.behavioral_choice.prompt}
            </p>
            <div className="space-y-2">
              {POST_SURVEY.behavioral_choice.options.map((opt) => (
                <label key={opt.key} className="checkbox-row">
                  <input
                    type="radio"
                    name="behavioral_choice"
                    value={opt.key}
                    checked={behavioralChoice === opt.key}
                    onChange={() => setBehavioralChoice(opt.key)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <hr className="survey-group-divider" />
            <SurveyGroupHeading icon={POST_SURVEY.manipulationParticipantIcon}>
              {POST_SURVEY.manipulationParticipantHeading}
            </SurveyGroupHeading>
            <LikertBlock
              items={POST_SURVEY.manipulation_attitude.items.map((i) => i.text)}
              keys={POST_SURVEY.manipulation_attitude.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.manipulation_attitude.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <LikertBlock
              items={POST_SURVEY.manipulation_norms.items.map((i) => i.text)}
              keys={POST_SURVEY.manipulation_norms.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.manipulation_norms.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="survey-group-divider" />
            <LikertBlock
              items={POST_SURVEY.manipulation_pbc.items.map((i) => i.text)}
              keys={POST_SURVEY.manipulation_pbc.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.manipulation_pbc.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <div className="mt-8 space-y-4">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                disabled={loading}
                onClick={() => void handlePostSurveySubmit()}
              >
                Continue
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      )}

      {state.stage === "demographics" && (
        <>
          <PageHeader
            title={DEMOGRAPHICS.title}
            lead={DEMOGRAPHICS.lead}
            icon={UserCircle}
          />
          <div className="card">
            <DemographicsForm values={demographics} onChange={setDemographics} />
            <div className="mt-8 space-y-4">
              <FormErrorAlert message={error} />
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                disabled={loading}
                onClick={() => void handleDemographicsSubmit()}
              >
                Submit
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </>
      )}

      {state.stage === "debrief" && (
        <DebriefFinish participantId={state.participantId} />
      )}
    </main>
  );
}
