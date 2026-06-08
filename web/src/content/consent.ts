export const CONSENT_FORM = {
  pageTitle: "Consent Form",
  protocolTitle:
    "Support-Seeking Trajectory After AI Boundary Moments in Emotional Support Contexts",
  principalInvestigator: {
    name: "Lee Yi-Chieh",
    phone: "+65 91951214",
    email: "yclee@nus.edu.sg",
    organization: "NUS School of Computing",
  },
  acknowledgements: [
    "I have agreed to take part in the above research.",
    "I have received a copy of this information sheet that explains the use of my data in this research. I understand its contents and agree to donate my data for the use of this research.",
    "I can withdraw from the research at any point of time by informing the Principal Investigator and all my data will be discarded.",
    "I will not have any financial benefits that result from the commercial development of this research.",
    "I consent to have the coded data made available for future research studies. This will be subject to an Institutional Review Board's approval.",
  ],
  optionalItems: [
    "I agree to be re-contacted for future related studies. I understand that future studies will be subject to an Institutional Review Board's approval.",
    "I agree with the photo-taking/audio-recording of my participation in the research. I understand that although my name will not be associated with the photographs used in publication/presentation, I may still be identified.",
  ],
  publicationLeadIn:
    "I agree for the following personal data to be disclosed in any publication or presentation relating to this research, if any.",
  publicationDisagreeLeadIn:
    "Disagree (I wish to remain anonymous and only agree to be known as",
  publicationDisagreeSuffix: ").",
  agreementLabel: "I give my consent to participate in this study.",
} as const;

export const PUBLICATION_FIELDS = [
  { key: "surname", label: "Surname" },
  { key: "first_name", label: "First name" },
  { key: "organisation_name", label: "Organisation Name" },
  { key: "position_designation", label: "Position/Designation" },
] as const;

export type PublicationFieldKey = (typeof PUBLICATION_FIELDS)[number]["key"];

export type PublicationConsentValues = {
  surname: boolean;
  first_name: boolean;
  organisation_name: boolean;
  position_designation: boolean;
  disagree: boolean;
  pseudonym: string;
};

export const EMPTY_PUBLICATION_CONSENT: PublicationConsentValues = {
  surname: false,
  first_name: false,
  organisation_name: false,
  position_designation: false,
  disagree: false,
  pseudonym: "",
};

export function hasPublicationChoice(values: PublicationConsentValues): boolean {
  if (values.disagree) {
    return values.pseudonym.trim().length > 0;
  }
  return PUBLICATION_FIELDS.some(({ key }) => values[key]);
}

/** @deprecated Use ConsentFormContent — kept for any legacy imports */
export const CONSENT_TEXT = CONSENT_FORM.pageTitle;
