"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { DEBRIEF } from "@/content/debrief";
import { PageHeader } from "@/components/PageHeader";

type Props = {
  participantId: string | null;
};

export function DebriefFinish({ participantId }: Props) {
  useEffect(() => {
    if (!participantId) return;

    void fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId }),
    });
  }, [participantId]);

  return (
    <>
      <PageHeader
        title={DEBRIEF.pageTitle}
        lead={DEBRIEF.lead}
        icon={CheckCircle2}
      />
      <div className="card space-y-4">
        {DEBRIEF.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink">
            {paragraph}
          </p>
        ))}
        <p className="text-base leading-relaxed text-ink">
          {DEBRIEF.contactInstruction}
        </p>
        <div className="rounded-card border border-border bg-page px-5 py-4">
          <p className="mb-3 text-base leading-relaxed text-ink">
            {DEBRIEF.completionInstruction}
          </p>
          <p
            className="font-mono text-2xl font-bold tracking-wide text-accent"
            aria-label={`Completion code: ${DEBRIEF.completionCode}`}
          >
            {DEBRIEF.completionCode}
          </p>
        </div>
      </div>
    </>
  );
}
