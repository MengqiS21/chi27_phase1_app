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

/** All scale points use the same circle size as the endpoint (Strongly disagree / Strongly agree). */
const UNIFORM_SIZE_CLASS = "likert-size-xl";

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
            <div className="likert-scale-wrap" data-scale={scale}>
              <div
                className="likert-scale"
                style={{
                  gridTemplateColumns: `repeat(${scaleValues.length}, minmax(0, 1fr))`,
                }}
                role="radiogroup"
                aria-label={statement}
              >
                {scaleValues.map((n) => {
                  const isSelected = selected === n;
                  const hint = hintAboveCircle(n, isSelected, config, min, max);
                  const isScaleStart = n === min;
                  const isScaleEnd = n === max;
                  const isEndHint = isScaleStart || isScaleEnd;
                  const sizeClass = UNIFORM_SIZE_CLASS;
                  const useEdgeAnchor = isScaleStart || isScaleEnd;

                  const scaleCellContent = (
                    <>
                      <div
                        className="likert-hint"
                        aria-hidden={hint ? undefined : true}
                      >
                        {hint ? (
                          <span
                            className={
                              isEndHint
                                ? "likert-hint-end"
                                : "likert-hint-selected"
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
                    </>
                  );

                  return (
                    <div
                      key={n}
                      className={`likert-scale-cell${
                        isScaleStart ? " likert-scale-cell-start" : ""
                      }${isScaleEnd ? " likert-scale-cell-end" : ""}`}
                    >
                      {useEdgeAnchor ? (
                        <div
                          className={`likert-edge-anchor${
                            isScaleStart
                              ? " likert-edge-anchor-start"
                              : " likert-edge-anchor-end"
                          }`}
                        >
                          {scaleCellContent}
                        </div>
                      ) : (
                        scaleCellContent
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
