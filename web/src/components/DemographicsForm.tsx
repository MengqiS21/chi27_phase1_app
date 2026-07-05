"use client";

import { DEMOGRAPHICS } from "@/content/survey-items";

export type DemographicsValues = {
  dem1: string;
  dem1_prefer_not: boolean;
  dem2: string;
  dem2_self_describe: string;
  dem3: string;
  dem4: string;
  dem5: string;
  dem5_other: string;
  dem6: string;
  dem7: string;
};

type Props = {
  values: DemographicsValues;
  onChange: (values: DemographicsValues) => void;
};

export function DemographicsForm({ values, onChange }: Props) {
  const set = (patch: Partial<DemographicsValues>) =>
    onChange({ ...values, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <label className="field-label" htmlFor="dem1">
          {DEMOGRAPHICS.age.label}
        </label>
        <input
          id="dem1"
          type="number"
          min={18}
          max={120}
          className="field-input mb-3 max-w-xs"
          value={values.dem1}
          disabled={values.dem1_prefer_not}
          onChange={(e) => set({ dem1: e.target.value })}
        />
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={values.dem1_prefer_not}
            onChange={(e) =>
              set({
                dem1_prefer_not: e.target.checked,
                dem1: e.target.checked ? "" : values.dem1,
              })
            }
          />
          <span>Prefer not to say</span>
        </label>
      </div>

      <div>
        <label className="field-label" htmlFor="dem2">
          {DEMOGRAPHICS.gender.label}
        </label>
        <select
          id="dem2"
          className="field-select mb-3"
          value={values.dem2}
          onChange={(e) => set({ dem2: e.target.value })}
        >
          <option value="">Select an option…</option>
          {DEMOGRAPHICS.gender.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {values.dem2 === "Prefer to self-describe" ? (
          <input
            className="field-input"
            placeholder="Please describe"
            value={values.dem2_self_describe}
            onChange={(e) => set({ dem2_self_describe: e.target.value })}
          />
        ) : null}
      </div>

      <div>
        <label className="field-label" htmlFor="dem3">
          {DEMOGRAPHICS.education.label}
        </label>
        <select
          id="dem3"
          className="field-select"
          value={values.dem3}
          onChange={(e) => set({ dem3: e.target.value })}
        >
          <option value="">Select an option…</option>
          {DEMOGRAPHICS.education.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="dem4">
          {DEMOGRAPHICS.employment.label}
        </label>
        <select
          id="dem4"
          className="field-select"
          value={values.dem4}
          onChange={(e) => set({ dem4: e.target.value })}
        >
          <option value="">Select an option…</option>
          {DEMOGRAPHICS.employment.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="dem5">
          {DEMOGRAPHICS.living.label}
        </label>
        <select
          id="dem5"
          className="field-select mb-3"
          value={values.dem5}
          onChange={(e) => set({ dem5: e.target.value })}
        >
          <option value="">Select an option…</option>
          {DEMOGRAPHICS.living.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {values.dem5 === "Other" ? (
          <input
            className="field-input"
            placeholder="Please specify"
            value={values.dem5_other}
            onChange={(e) => set({ dem5_other: e.target.value })}
          />
        ) : null}
      </div>

      <div>
        <label className="field-label" htmlFor="dem6">
          {DEMOGRAPHICS.region.label}
        </label>
        <input
          id="dem6"
          className="field-input"
          value={values.dem6}
          onChange={(e) => set({ dem6: e.target.value })}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="dem7">
          {DEMOGRAPHICS.aiEmotionalUseFrequency.label}
        </label>
        <select
          id="dem7"
          className="field-select"
          value={values.dem7}
          onChange={(e) => set({ dem7: e.target.value })}
        >
          <option value="">Select an option…</option>
          {DEMOGRAPHICS.aiEmotionalUseFrequency.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function emptyDemographics(): DemographicsValues {
  return {
    dem1: "",
    dem1_prefer_not: false,
    dem2: "",
    dem2_self_describe: "",
    dem3: "",
    dem4: "",
    dem5: "",
    dem5_other: "",
    dem6: "",
    dem7: "",
  };
}

export function validateDemographics(values: DemographicsValues): string | null {
  if (!values.dem1_prefer_not && !values.dem1.trim()) {
    return "Please enter your age or select Prefer not to say.";
  }
  if (!values.dem2) return "Please select your gender.";
  if (
    values.dem2 === "Prefer to self-describe" &&
    !values.dem2_self_describe.trim()
  ) {
    return "Please describe your gender.";
  }
  if (!values.dem3) return "Please select your education level.";
  if (!values.dem4) return "Please select your employment status.";
  if (!values.dem5) return "Please select your living situation.";
  if (values.dem5 === "Other" && !values.dem5_other.trim()) {
    return "Please specify your living situation.";
  }
  if (!values.dem6.trim()) return "Please enter your country or region.";
  if (!values.dem7) {
    return "Please select how often you use AI tools for personal or emotional topics.";
  }
  return null;
}
