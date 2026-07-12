import { HeartHandshake } from "lucide-react";
import { SCREENED_OUT } from "@/content/screened-out";
import { PageHeader } from "@/components/PageHeader";

type ScreenedOutFinishProps = {
  completionCode?: string;
};

export function ScreenedOutFinish({
  completionCode = SCREENED_OUT.completionCode,
}: ScreenedOutFinishProps) {
  return (
    <>
      <PageHeader
        title={SCREENED_OUT.pageTitle}
        lead={SCREENED_OUT.lead}
        icon={HeartHandshake}
      />
      <div className="card space-y-4">
        {SCREENED_OUT.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink">
            {paragraph}
          </p>
        ))}
        <p className="text-base leading-relaxed text-ink">
          {SCREENED_OUT.contactInstruction}
        </p>
        <div className="rounded-card border border-border bg-page px-5 py-4">
          <p className="mb-3 text-base leading-relaxed text-ink">
            {SCREENED_OUT.completionInstruction}
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
