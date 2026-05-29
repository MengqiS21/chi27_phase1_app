import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  lead?: string;
  icon?: LucideIcon;
};

export function PageHeader({ title, lead, icon: Icon }: Props) {
  return (
    <header className="mb-8">
      {Icon ? (
        <div className="icon-badge-lg mb-4" aria-hidden>
          <Icon size={26} strokeWidth={1.75} />
        </div>
      ) : null}
      <h1 className="page-title">{title}</h1>
      {lead ? <p className="page-lead">{lead}</p> : null}
    </header>
  );
}
