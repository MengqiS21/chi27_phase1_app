import { ArrowRight } from "lucide-react";
import {
  SCENARIO_READ_CONTINUE_LABEL,
  USER_TASK_READ_INSTRUCTIONS,
} from "@/content/scenarios";

type ScenarioReadPageProps = {
  title: string;
  text: string;
  loading?: boolean;
  onContinue: () => void;
};

export function ScenarioReadPage({
  title,
  text,
  loading,
  onContinue,
}: ScenarioReadPageProps) {
  return (
    <section className="scenario-read" aria-labelledby="scenario-read-title">
      <div className="scenario-read-inner">
        <p className="scenario-read-eyebrow">Your situation</p>
        <h1 id="scenario-read-title" className="scenario-read-title">
          {title}
        </h1>
        <div className="scenario-read-body">
          <p>{text}</p>
        </div>
        <p className="scenario-read-hint whitespace-pre-line">
          {USER_TASK_READ_INSTRUCTIONS}
        </p>
      </div>

      <div className="scenario-read-actions">
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2"
          disabled={loading}
          onClick={onContinue}
        >
          {SCENARIO_READ_CONTINUE_LABEL}
          <ArrowRight size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  );
}
