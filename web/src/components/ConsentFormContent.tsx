import { CONSENT_FORM } from "@/content/consent";

export function ConsentFormContent() {
  return (
    <div className="consent-box space-y-6">
      <h2 className="text-xl font-semibold text-ink">{CONSENT_FORM.pageTitle}</h2>

      <div>
        <p className="mb-1 font-medium text-ink">Protocol title:</p>
        <p>{CONSENT_FORM.protocolTitle}</p>
      </div>

      <div>
        <p className="mb-3 font-medium text-ink">
          {CONSENT_FORM.acknowledgementsLeadIn}
        </p>
        <ul className="consent-list">
          {CONSENT_FORM.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
