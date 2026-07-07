"use client";

type Item = {
  key: string;
  text: string;
};

type Props = {
  items: readonly Item[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  namePrefix: string;
};

export function OpenTextBlock({ items, values, onChange, namePrefix }: Props) {
  return (
    <div className="space-y-8">
      {items.map((item) => {
        const labelId = `${namePrefix}_${item.key}_label`;
        return (
          <div key={item.key}>
            <p className="likert-statement mb-3" id={labelId}>
              {item.text}
            </p>
            <textarea
              id={`${namePrefix}_${item.key}`}
              className="field-input min-h-[120px] w-full resize-y"
              rows={4}
              value={values[item.key] ?? ""}
              aria-labelledby={labelId}
              onChange={(e) => onChange(item.key, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function emptyOpenResponses(
  keys: readonly string[]
): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, ""]));
}

export function validateOpenResponses(
  values: Record<string, string>,
  keys: readonly string[]
): string | null {
  const missing = keys.some((key) => !values[key]?.trim());
  if (missing) {
    return "Please answer all questions before continuing.";
  }
  return null;
}
