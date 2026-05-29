export type ScalePreset =
  | "agree7"
  | "agree5"
  | "severity7"
  | "comfort5"
  | "intention7";

export type ScaleConfig = {
  values: readonly number[];
  lowLabel: string;
  highLabel: string;
  middleLabels: Partial<Record<number, string>>;
  ariaLabel: (n: number) => string;
};

const AGREE7_MIDDLE: Partial<Record<number, string>> = {
  2: "Disagree",
  3: "Somewhat disagree",
  4: "Neither agree nor disagree",
  5: "Somewhat agree",
  6: "Agree",
};

const AGREE5_MIDDLE: Partial<Record<number, string>> = {
  2: "Disagree",
  3: "Neither agree nor disagree",
  4: "Agree",
};

const SEVERITY7_MIDDLE: Partial<Record<number, string>> = {
  2: "Slightly serious",
  3: "Somewhat serious",
  4: "Moderately serious",
  5: "Quite serious",
  6: "Very serious",
};

const COMFORT5_MIDDLE: Partial<Record<number, string>> = {
  2: "Somewhat uncomfortable",
  3: "Neither comfortable nor uncomfortable",
  4: "Somewhat comfortable",
};

export const SCALE_PRESETS: Record<ScalePreset, ScaleConfig> = {
  agree7: {
    values: [1, 2, 3, 4, 5, 6, 7],
    lowLabel: "Strongly disagree",
    highLabel: "Strongly agree",
    middleLabels: AGREE7_MIDDLE,
    ariaLabel: (n) => {
      const labels = [
        "",
        "1 — Strongly disagree",
        "2 — Disagree",
        "3 — Somewhat disagree",
        "4 — Neither agree nor disagree",
        "5 — Somewhat agree",
        "6 — Agree",
        "7 — Strongly agree",
      ];
      return labels[n] ?? String(n);
    },
  },
  agree5: {
    values: [1, 2, 3, 4, 5],
    lowLabel: "Strongly disagree",
    highLabel: "Strongly agree",
    middleLabels: AGREE5_MIDDLE,
    ariaLabel: (n) => {
      const labels = [
        "",
        "1 — Strongly disagree",
        "2 — Disagree",
        "3 — Neither agree nor disagree",
        "4 — Agree",
        "5 — Strongly agree",
      ];
      return labels[n] ?? String(n);
    },
  },
  severity7: {
    values: [1, 2, 3, 4, 5, 6, 7],
    lowLabel: "Not at all serious",
    highLabel: "Extremely serious",
    middleLabels: SEVERITY7_MIDDLE,
    ariaLabel: (n) => {
      const labels = [
        "",
        "1 — Not at all serious",
        "2 — Slightly serious",
        "3 — Somewhat serious",
        "4 — Moderately serious",
        "5 — Quite serious",
        "6 — Very serious",
        "7 — Extremely serious",
      ];
      return labels[n] ?? String(n);
    },
  },
  comfort5: {
    values: [1, 2, 3, 4, 5],
    lowLabel: "Very uncomfortable",
    highLabel: "Very comfortable",
    middleLabels: COMFORT5_MIDDLE,
    ariaLabel: (n) => {
      const labels = [
        "",
        "1 — Very uncomfortable",
        "2 — Somewhat uncomfortable",
        "3 — Neither comfortable nor uncomfortable",
        "4 — Somewhat comfortable",
        "5 — Very comfortable",
      ];
      return labels[n] ?? String(n);
    },
  },
  intention7: {
    values: [1, 2, 3, 4, 5, 6, 7],
    lowLabel: "Strongly disagree",
    highLabel: "Strongly agree",
    middleLabels: AGREE7_MIDDLE,
    ariaLabel: (n) => {
      const labels = [
        "",
        "1 — Strongly disagree",
        "2 — Disagree",
        "3 — Somewhat disagree",
        "4 — Neither agree nor disagree",
        "5 — Somewhat agree",
        "6 — Agree",
        "7 — Strongly agree",
      ];
      return labels[n] ?? String(n);
    },
  },
};
