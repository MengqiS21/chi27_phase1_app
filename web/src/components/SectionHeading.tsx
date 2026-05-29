import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  children: React.ReactNode;
};

export function SectionHeading({ icon: Icon, children }: Props) {
  return (
    <h2 className="section-title mb-4 flex items-center gap-3">
      <span className="icon-badge" aria-hidden>
        <Icon size={20} strokeWidth={2} />
      </span>
      <span>{children}</span>
    </h2>
  );
}
