"use client";

import {
  SCALE_PRESETS,
  type ScalePreset,
} from "@/lib/scales";

type Props = {
  items: readonly string[];
  keys: readonly string[];
  values: Record<string, number | null>;
  onChange: (key: string, value: number) => void;
  namePrefix: string;
  scale?: ScalePreset;
};

const SIZE_CLASS: Record<number, string> = {
  1: "likert-size-xl",
  2: "likert-size-lg",
  3: "likert-size-md",
  4: "likert-size-sm",
  5: "likert-size-md",
  6: "likert-size-lg",
  7: "likert-size-xl",
};

function hintAboveCircle(
  n: number,
  isSelected: boolean,
  config: (typeof SCALE_PRESETS)[ScalePreset],
  min: number,
  max: number
): string | null {
  if (n === min) return config.lowLabel;
  if (n === max) return config.highLabel;
  if (isSelected && config.middleLabels[n]) return config.middleLabels[n]!;
  return null;
}

export function LikertBlock({
  items,
  keys,
  values,
  onChange,
  namePrefix,
  scale = "agree7",
}: Props) {
  const config = SCALE_PRESETS[scale];
  const scaleValues = config.values;
  const min = scaleValues[0];
  const max = scaleValues[scaleValues.length - 1];

  return (
    <div className="space-y-0">
      {items.map((statement, i) => {
        const fieldKey = keys[i];
        const inputName = `${namePrefix}_${fieldKey}`;
        const selected = values[fieldKey];

        return (
          <div key={fieldKey} className="likert-item">
            <p className="likert-statement">{statement}</p>
            <div
              className="likert-scale"
              role="radiogroup"
              aria-label={statement}
            >
              {scaleValues.map((n) => {
                const isSelected = selected === n;
                const hint = hintAboveCircle(n, isSelected, config, min, max);
                const isEndHint = n === min || n === max;
                const sizeClass = SIZE_CLASS[n] ?? "likert-size-md";

                return (
                  <div key={n} className="likert-scale-cell">
                    <div
                      className="likert-hint"
                      aria-hidden={hint ? undefined : true}
                    >
                      {hint ? (
                        <span
                          className={
                            isEndHint ? "likert-hint-end" : "likert-hint-selected"
                          }
                        >
                          {hint}
                        </span>
                      ) : (
                        <span className="likert-hint-placeholder" aria-hidden>
                          &nbsp;
                        </span>
                      )}
                    </div>
                    <label
                      className={`likert-option-hit ${sizeClass} ${
                        isSelected ? "likert-option-hit-selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={inputName}
                        value={n}
                        checked={isSelected}
                        onChange={() => onChange(fieldKey, n)}
                        aria-label={config.ariaLabel(n)}
                      />
                      <span
                        className={`likert-option ${sizeClass} ${
                          isSelected ? "likert-option-selected" : ""
                        }`}
                      >
                        <span className="likert-option-num">{n}</span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
