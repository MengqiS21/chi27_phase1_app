export const CONSENT_FORM = {
  pageTitle: "Consent Form",
  protocolTitle:
    "Support-Seeking Trajectory After AI Boundary Moments in Emotional Support Contexts",
  acknowledgementsLeadIn: "I hereby acknowledge that:",
  items: [
    "I have agreed to take part in the above research.",
    "I have received a copy of this information sheet that explains the use of my data in this research. I understand its contents and agree to donate my data for the use of this research.",
    "I can withdraw from the research at any point of time by informing the Principal Investigator and all my data will be discarded.",
    "I will not have any financial benefits that result from the commercial development of this research.",
    "I consent to have the coded data made available for future research studies, if any. This will be subject to an Institutional Review Board's approval.",
    "I agree to be re-contacted for future related studies, if any. I understand that future studies will be subject to an Institutional Review Board's approval.",
    "I agree with the photo-taking/audio-recording of my participation in the research. I understand that although my name will not be associated with the photographs used in publication/presentation, I may still be identified.",
  ],
  agreementLabel: "I give my consent to participate in this study.",
} as const;

/** @deprecated Use ConsentFormContent — kept for any legacy imports */
export const CONSENT_TEXT = CONSENT_FORM.pageTitle;
