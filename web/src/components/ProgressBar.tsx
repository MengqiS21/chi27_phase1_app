type Props = {
  current: number;
  total?: number;
};

export function ProgressBar({ current, total = 4 }: Props) {
  const label = `Scenario ${current} of ${total}`;
  const pct = (current / total) * 100;

  return (
    <div className="mb-8" aria-label={label}>
      <span className="mb-2 block text-[0.9375rem] font-semibold text-muted">
        {label}
      </span>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
