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
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.key}>
          <label className="field-label" htmlFor={`${namePrefix}_${item.key}`}>
            {item.text}
          </label>
          <textarea
            id={`${namePrefix}_${item.key}`}
            className="field-input min-h-[120px] w-full resize-y"
            rows={4}
            value={values[item.key] ?? ""}
            onChange={(e) => onChange(item.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
