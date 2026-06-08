import {
  CONSENT_FORM,
  PUBLICATION_FIELDS,
  type PublicationConsentValues,
} from "@/content/consent";

type ConsentFormContentProps = {
  publication: PublicationConsentValues;
  onPublicationChange: (next: PublicationConsentValues) => void;
};

export function ConsentFormContent({
  publication,
  onPublicationChange,
}: ConsentFormContentProps) {
  const pi = CONSENT_FORM.principalInvestigator;

  const toggleField = (key: (typeof PUBLICATION_FIELDS)[number]["key"]) => {
    const nextChecked = !publication[key];
    onPublicationChange({
      ...publication,
      [key]: nextChecked,
      disagree: nextChecked ? false : publication.disagree,
      pseudonym: nextChecked ? "" : publication.pseudonym,
    });
  };

  const toggleDisagree = () => {
    const nextDisagree = !publication.disagree;
    onPublicationChange({
      surname: false,
      first_name: false,
      organisation_name: false,
      position_designation: false,
      disagree: nextDisagree,
      pseudonym: nextDisagree ? publication.pseudonym : "",
    });
  };

  return (
    <div className="consent-box space-y-6">
      <h2 className="text-xl font-semibold text-ink">{CONSENT_FORM.pageTitle}</h2>

      <div>
        <p className="mb-1 font-medium text-ink">Protocol title:</p>
        <p>{CONSENT_FORM.protocolTitle}</p>
      </div>

      <div>
        <p className="mb-1 font-medium text-ink">
          Principal Investigator with the contact number and organization:
        </p>
        <p>
          {pi.name}, {pi.phone}, {pi.email}, {pi.organization}
        </p>
      </div>

      <div>
        <p className="mb-3 font-medium text-ink">I hereby acknowledge that:</p>
        <ul className="consent-list">
          {CONSENT_FORM.acknowledgements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <ul className="consent-list">
        {CONSENT_FORM.optionalItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div>
        <p className="mb-3">{CONSENT_FORM.publicationLeadIn}</p>
        <ul className="consent-option-list">
          {PUBLICATION_FIELDS.map(({ key, label }) => (
            <li key={key}>
              <label className="consent-option-row">
                <input
                  type="checkbox"
                  checked={publication[key]}
                  onChange={() => toggleField(key)}
                />
                <span>{label}</span>
              </label>
            </li>
          ))}
          <li>
            <label className="consent-option-row consent-option-row-disagree">
              <input
                type="checkbox"
                checked={publication.disagree}
                onChange={toggleDisagree}
              />
              <span className="consent-disagree-text">
                {CONSENT_FORM.publicationDisagreeLeadIn}{" "}
                <input
                  type="text"
                  className="consent-pseudonym-input"
                  value={publication.pseudonym}
                  onFocus={() => {
                    if (!publication.disagree) {
                      onPublicationChange({
                        surname: false,
                        first_name: false,
                        organisation_name: false,
                        position_designation: false,
                        disagree: true,
                        pseudonym: publication.pseudonym,
                      });
                    }
                  }}
                  onChange={(e) =>
                    onPublicationChange({
                      ...publication,
                      pseudonym: e.target.value,
                      disagree: true,
                      surname: false,
                      first_name: false,
                      organisation_name: false,
                      position_designation: false,
                    })
                  }
                  placeholder="your chosen name"
                  aria-label="Pseudonym if you wish to remain anonymous"
                />
                {CONSENT_FORM.publicationDisagreeSuffix}
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
}
