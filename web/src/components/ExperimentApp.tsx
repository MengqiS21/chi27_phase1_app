"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ClipboardPen,
  Compass,
  HeartHandshake,
  KeyRound,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Bot,
  UserCircle,
} from "lucide-react";
import { ChatShell } from "@/components/ChatShell";
import {
  DemographicsForm,
  emptyDemographics,
  validateDemographics,
  type DemographicsValues,
} from "@/components/DemographicsForm";
import { LikertBlock } from "@/components/LikertBlock";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { CONSENT_TEXT } from "@/content/consent";
import { SCENARIOS } from "@/content/scenarios";
import {
  POST_SURVEY,
  POST_SURVEY_LIKERT_KEYS,
  PRE_MODERATORS,
  PRE_MODERATOR_KEYS,
  SCREENING,
} from "@/content/survey-items";
import {
  currentCondition,
  currentScenarioType,
  resetScenarioChat,
} from "@/lib/experiment-helpers";
import { STUDY } from "@/lib/study-config";
import { INITIAL_STATE, type ExperimentState } from "@/lib/types";
import { useFadeTransition } from "@/lib/use-fade-transition";

function emptyLikert(keys: readonly string[]): Record<string, number | null> {
  return Object.fromEntries(keys.map((k) => [k, null]));
}

function allLikertAnswered(
  values: Record<string, number | null>,
  keys: readonly string[]
): boolean {
  return keys.every((k) => values[k] !== null);
}

export function ExperimentApp() {
  const [state, setState] = useState<ExperimentState>({
    ...INITIAL_STATE,
    study: STUDY,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [accessCode, setAccessCode] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [screening, setScreening] = useState<Record<string, string>>({});

  const [preModerators, setPreModerators] = useState(() =>
    emptyLikert(PRE_MODERATOR_KEYS)
  );

  const [postLikert, setPostLikert] = useState(() =>
    emptyLikert(POST_SURVEY_LIKERT_KEYS)
  );
  const [intentionLikert, setIntentionLikert] = useState(() =>
    emptyLikert(POST_SURVEY.intention.templates.map((t) => t.key))
  );
  const [behavioralChoice, setBehavioralChoice] = useState("");

  const [demographics, setDemographics] = useState<DemographicsValues>(
    emptyDemographics
  );
  const [chatInput, setChatInput] = useState("");
  const { visible: stageVisible, run: withStageFade } = useFadeTransition();

  const selectedChoice = useMemo(
    () =>
      POST_SURVEY.behavioral_choice.options.find(
        (o) => o.key === behavioralChoice
      ),
    [behavioralChoice]
  );

  const intentionItems = useMemo(() => {
    const phrase = selectedChoice?.intentionPhrase ?? "[selected option]";
    return POST_SURVEY.intention.templates.map((t) =>
      t.text.replace("[selected option]", phrase)
    );
  }, [selectedChoice]);

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
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
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
      setState((s) => ({
        ...s,
        participantId: data.participantId,
        scenarioOrder: data.scenarioOrder,
        experiencedScenarioIndex: data.experiencedScenarioIndex,
        assignedCondition: data.assignedCondition,
        scenarioIndex: 0,
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
        setError("Please answer all screening questions.");
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
      await patchStage("pre_moderators");
      setState((s) => ({ ...s, stage: "pre_moderators" }));
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
    if (!text || loading || state.refusalDelivered) return;

    setError(null);
    setLoading(true);
    const nextTurn = state.turnCount + 1;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: state.participantId,
          messages: state.messages,
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
          { role: "user", content: text },
          { role: "assistant", content: data.assistantText },
        ],
        turnCount: nextTurn,
        refusalDelivered: data.refusalDelivered ?? nextTurn >= 3,
      }));
      setChatInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get a response from the AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPostSurvey = async () => {
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
  };

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
    const intentionKeys = POST_SURVEY.intention.templates.map((t) => t.key);
    if (!allLikertAnswered(intentionLikert, intentionKeys)) {
      setError("Please answer all intention items.");
      return;
    }

    setLoading(true);
    try {
      await saveSurvey({
        section: "post_survey",
        responses: {
          ...postLikert,
          ...intentionLikert,
          behavioral_choice: behavioralChoice,
          behavioral_choice_label: selectedChoice?.label ?? "",
          intention_phrase: selectedChoice?.intentionPhrase ?? "",
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

  const scenarioType = currentScenarioType(state);
  const scenario = SCENARIOS[scenarioType];

  return (
    <main
      className={`page-shell ${state.stage === "scenario_chat" ? "page-shell-chat" : ""}`}
    >
      {error ? (
        <p className="alert-error mb-6" role="alert">
          {error}
        </p>
      ) : null}

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
            <button
              type="button"
              className="btn-primary shrink-0 sm:mb-0.5"
              disabled={loading}
              onClick={() => void handleBegin()}
            >
              {loading ? "Starting…" : "Begin"}
            </button>
          </div>
        </>
      )}

      {state.stage === "screening" && (
        <>
          <PageHeader
            title="Screening Questions"
            lead="Please answer the following questions to confirm your eligibility."
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
        </>
      )}

      {state.stage === "screened_out" && (
        <>
          <PageHeader
            title="Thank You"
            lead="Based on your responses, you are not eligible for this study. You may close this window."
            icon={CheckCircle2}
          />
        </>
      )}

      {state.stage === "consent" && (
        <>
          <PageHeader title="Before We Begin" icon={ClipboardList} />
          <div className="card">
            <div className="consent-box">{CONSENT_TEXT}</div>
            <hr className="my-8 border-border" />
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
                I agree and wish to continue
              </span>
            </label>
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
        </>
      )}

      {state.stage === "pre_moderators" && (
        <>
          <PageHeader
            title="A Few Questions About You"
            lead="There are no right or wrong answers."
            icon={ClipboardPen}
          />
          <div className="card">
            <p className="mb-6 text-[0.9375rem] text-muted">
              {PRE_MODERATORS.ai_reliance.instruction}
            </p>
            <SectionHeading icon={Bot}>
              {PRE_MODERATORS.ai_reliance.title}
            </SectionHeading>
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
            <hr className="my-8 border-border" />
            <SectionHeading icon={Users}>
              {PRE_MODERATORS.social_support.title}
            </SectionHeading>
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
            <hr className="my-8 border-border" />
            <SectionHeading icon={HeartHandshake}>
              {PRE_MODERATORS.disclosure.title}
            </SectionHeading>
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
            <button
              type="button"
              className="btn-primary mt-8 inline-flex items-center gap-2"
              disabled={loading}
              onClick={() => void handlePreModeratorsContinue()}
            >
              Continue to scenario
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </>
      )}

      {state.stage === "scenario_view" && state.scenarioOrder.length > 0 && (
        <div
          className={`stage-transition ${stageVisible ? "stage-transition-visible" : ""}`}
        >
          <PageHeader title={scenario.title} />
          <div className="card scenario-intro">
            <div className="scenario-box scenario-box-intro">{scenario.text}</div>
            <p className="scenario-intro-lead">
              On the next screen you will chat with an Assistant about this
              situation. Take a moment to read the scenario, then start when
              you feel ready.
            </p>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              disabled={loading}
              onClick={() => void handleScenarioViewContinue()}
            >
              Start conversation
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {state.stage === "scenario_chat" && state.scenarioOrder.length > 0 && (
        <div
          className={`stage-transition ${stageVisible ? "stage-transition-visible" : ""}`}
        >
          <ChatShell
            scenarioTitle={scenario.title}
            scenarioText={scenario.text}
            messages={state.messages}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={() => void handleSendMessage()}
            isLoading={loading}
            refusalDelivered={state.refusalDelivered}
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
            title="Your Thoughts"
            lead="Please answer based on the conversation you just had."
            icon={MessageSquare}
          />
          <div className="card">
            <p className="mb-6 text-[0.9375rem] text-muted">
              {POST_SURVEY.understanding.instruction}
            </p>
            <SectionHeading icon={Compass}>
              {POST_SURVEY.understanding.title}
            </SectionHeading>
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
            <hr className="my-8 border-border" />
            <SectionHeading icon={Users}>
              {POST_SURVEY.agency.title}
            </SectionHeading>
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
            <hr className="my-8 border-border" />
            <SectionHeading icon={Scale}>
              {POST_SURVEY.rupture.title}
            </SectionHeading>
            <LikertBlock
              items={POST_SURVEY.rupture.items.map((i) => i.text)}
              keys={POST_SURVEY.rupture.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.rupture.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="my-8 border-border" />
            <SectionHeading icon={Scale}>
              {POST_SURVEY.goal_disengagement.title}
            </SectionHeading>
            <LikertBlock
              items={POST_SURVEY.goal_disengagement.items.map((i) => i.text)}
              keys={POST_SURVEY.goal_disengagement.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.goal_disengagement.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="my-8 border-border" />
            <SectionHeading icon={Compass}>
              {POST_SURVEY.behavioral_choice.title}
            </SectionHeading>
            <p className="mb-4 text-[0.9375rem] text-muted">
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
                    onChange={() => {
                      setBehavioralChoice(opt.key);
                      setIntentionLikert(
                        emptyLikert(
                          POST_SURVEY.intention.templates.map((t) => t.key)
                        )
                      );
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {behavioralChoice ? (
              <>
                <hr className="my-8 border-border" />
                <SectionHeading icon={Compass}>
                  {POST_SURVEY.intention.title}
                </SectionHeading>
                <p className="mb-4 text-[0.9375rem] text-muted">
                  {POST_SURVEY.intention.instruction}
                </p>
                <LikertBlock
                  items={intentionItems}
                  keys={POST_SURVEY.intention.templates.map((t) => t.key)}
                  values={intentionLikert}
                  namePrefix="post_int"
                  scale={POST_SURVEY.intention.scale}
                  onChange={(key, value) =>
                    setIntentionLikert((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </>
            ) : null}
            <hr className="my-8 border-border" />
            <SectionHeading icon={Compass}>
              {POST_SURVEY.guidance.title}
            </SectionHeading>
            <LikertBlock
              items={POST_SURVEY.guidance.items.map((i) => i.text)}
              keys={POST_SURVEY.guidance.items.map((i) => i.key)}
              values={postLikert}
              namePrefix="post"
              scale={POST_SURVEY.guidance.scale}
              onChange={(key, value) =>
                setPostLikert((prev) => ({ ...prev, [key]: value }))
              }
            />
            <hr className="my-8 border-border" />
            <SectionHeading icon={HeartHandshake}>
              {POST_SURVEY.continuity.title}
            </SectionHeading>
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
            <button
              type="button"
              className="btn-primary mt-8 inline-flex items-center gap-2"
              disabled={loading}
              onClick={() => void handlePostSurveySubmit()}
            >
              Continue
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {state.stage === "demographics" && (
        <>
          <PageHeader
            title="About you"
            lead="Almost done — a few final questions."
            icon={UserCircle}
          />
          <div className="card">
            <DemographicsForm values={demographics} onChange={setDemographics} />
            <button
              type="button"
              className="btn-primary mt-8 inline-flex items-center gap-2"
              disabled={loading}
              onClick={() => void handleDemographicsSubmit()}
            >
              Submit
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </>
      )}

      {state.stage === "debrief" && (
        <>
          <PageHeader
            title="You're All Done"
            lead="Thank you for your time. You may close this browser window when you're ready."
            icon={CheckCircle2}
          />
          <div className="card">
            <p className="text-base leading-relaxed text-ink">
              If you have questions about this research, please contact the study
              team at <strong>[researcher email]</strong>.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
