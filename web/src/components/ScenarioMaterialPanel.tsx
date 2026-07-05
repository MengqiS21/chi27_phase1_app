type ScenarioMaterialPanelProps = {
  eyebrow: string;
  title: string;
  text: string;
  titleId?: string;
  /** embedded = standalone card on survey pages; inline = inside scenario-read-inner */
  variant?: "embedded" | "inline";
};

export function ScenarioMaterialPanel({
  eyebrow,
  title,
  text,
  titleId,
  variant = "embedded",
}: ScenarioMaterialPanelProps) {
  const TitleTag = variant === "inline" ? "h1" : "h2";

  const content = (
    <>
      <p className="scenario-material-eyebrow">{eyebrow}</p>
      <TitleTag id={titleId} className="scenario-material-title">
        {title}
      </TitleTag>
      <div className="scenario-material-body">
        <p>{text}</p>
      </div>
    </>
  );

  if (variant === "embedded") {
    return (
      <section
        className="scenario-material-panel"
        aria-labelledby={titleId}
      >
        {content}
      </section>
    );
  }

  return <div className="scenario-material-content">{content}</div>;
}
