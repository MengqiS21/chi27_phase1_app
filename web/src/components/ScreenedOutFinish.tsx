import { HeartHandshake } from "lucide-react";
import {
  ATTENTION_CHECK_SCREENED_OUT,
  SCREENED_OUT,
} from "@/content/screened-out";
import { PageHeader } from "@/components/PageHeader";

type ScreenedOutFinishProps = {
  completionCode?: string;
  variant?: "screening" | "attention";
};

export function ScreenedOutFinish({
  completionCode = SCREENED_OUT.completionCode,
  variant = "screening",
}: ScreenedOutFinishProps) {
  const content =
    variant === "attention" ? ATTENTION_CHECK_SCREENED_OUT : SCREENED_OUT;

  return (
    <>
      <PageHeader
        title={content.pageTitle}
        lead={content.lead || undefined}
        icon={HeartHandshake}
      />
      <div className="card space-y-4">
        {content.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink">
            {paragraph}
          </p>
        ))}
        <p className="text-base leading-relaxed text-ink">
          {content.contactInstruction}
        </p>
        <div className="rounded-card border border-border bg-page px-5 py-4">
          <p className="mb-3 text-base leading-relaxed text-ink">
            {content.completionInstruction}
          </p>
          <p
            className="font-mono text-2xl font-bold tracking-wide text-accent"
            aria-label={`Completion code: ${completionCode}`}
          >
            {completionCode}
          </p>
        </div>
      </div>
    </>
  );
}
