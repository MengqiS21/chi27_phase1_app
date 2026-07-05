import { ArrowRight } from "lucide-react";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { ScenarioMaterialPanel } from "@/components/ScenarioMaterialPanel";
import {
  SCENARIO_EXPERIENCE_EYEBROW,
  SCENARIO_READ_CONTINUE_LABEL,
  USER_TASK_READ_INSTRUCTIONS,
} from "@/content/scenarios";

type ScenarioReadPageProps = {
  title: string;
  text: string;
  loading?: boolean;
  error?: string | null;
  onContinue: () => void;
};

export function ScenarioReadPage({
  title,
  text,
  loading,
  error = null,
  onContinue,
}: ScenarioReadPageProps) {
  return (
    <section className="scenario-read" aria-labelledby="scenario-read-title">
      <div className="scenario-read-inner">
        <ScenarioMaterialPanel
          variant="inline"
          eyebrow={SCENARIO_EXPERIENCE_EYEBROW}
          title={title}
          text={text}
          titleId="scenario-read-title"
        />
        <p className="scenario-read-hint whitespace-pre-line">
          {USER_TASK_READ_INSTRUCTIONS}
        </p>
      </div>

      <div className="scenario-read-actions">
        <div className="flex w-full flex-col gap-4 sm:w-auto">
          <FormErrorAlert message={error} />
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
      </div>
    </section>
  );
}
