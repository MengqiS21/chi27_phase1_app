"use client";

type Option = {
  key: string;
  label: string;
};

export type BehavioralRanks = {
  rank1: string | null;
  rank2: string | null;
};

type Props = {
  options: readonly Option[];
  values: BehavioralRanks;
  onChange: (values: BehavioralRanks) => void;
};

export function emptyBehavioralRanks(): BehavioralRanks {
  return { rank1: null, rank2: null };
}

export function validateBehavioralRanks(ranks: BehavioralRanks): string | null {
  if (!ranks.rank1 || !ranks.rank2) {
    return "Please rank your top two choices before continuing.";
  }
  if (ranks.rank1 === ranks.rank2) {
    return "Please select two different choices for ranks 1 and 2.";
  }
  return null;
}

function assignRank(
  ranks: BehavioralRanks,
  optionKey: string,
  rank: 1 | 2
): BehavioralRanks {
  const rankKey = rank === 1 ? "rank1" : "rank2";
  const otherRankKey = rank === 1 ? "rank2" : "rank1";

  if (ranks[rankKey] === optionKey) {
    return { ...ranks, [rankKey]: null };
  }

  const next: BehavioralRanks = {
    ...ranks,
    [rankKey]: optionKey,
  };

  if (next[otherRankKey] === optionKey) {
    next[otherRankKey] = null;
  }

  return next;
}

export function BehavioralRankChoice({ options, values, onChange }: Props) {
  return (
    <div className="behavioral-rank-list" role="group" aria-label="Rank your top two choices">
      <div className="behavioral-rank-header" aria-hidden>
        <span className="behavioral-rank-header-spacer" />
        <span className="behavioral-rank-header-label">Most likely</span>
        <span className="behavioral-rank-header-label">Second likely</span>
      </div>
      {options.map((option) => {
        const rank1Selected = values.rank1 === option.key;
        const rank2Selected = values.rank2 === option.key;

        return (
          <div key={option.key} className="behavioral-rank-row">
            <p className="behavioral-rank-label">{option.label}</p>
            <button
              type="button"
              className={`behavioral-rank-button ${rank1Selected ? "behavioral-rank-button-selected" : ""}`}
              aria-pressed={rank1Selected}
              aria-label={`Rank 1: ${option.label}`}
              onClick={() => onChange(assignRank(values, option.key, 1))}
            >
              1
            </button>
            <button
              type="button"
              className={`behavioral-rank-button ${rank2Selected ? "behavioral-rank-button-selected" : ""}`}
              aria-pressed={rank2Selected}
              aria-label={`Rank 2: ${option.label}`}
              onClick={() => onChange(assignRank(values, option.key, 2))}
            >
              2
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function behavioralChoiceLabel(
  options: readonly Option[],
  key: string | null
): string {
  if (!key) return "";
  return options.find((option) => option.key === key)?.label ?? "";
}
