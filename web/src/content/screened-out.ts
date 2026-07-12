/** Copy shown when a participant is screened out after SCR2. */
export const SCREENED_OUT = {
  pageTitle: "Thank You for Your Interest",
  lead: "We appreciate you taking the time to learn about our study.",
  body: [
    "This research focuses on how people use AI tools for emotional support and personal conversations.",
    "To take part, we need participants who have previously used an AI chatbot or assistant to talk through something personal or emotional.",
    "Based on your response, you are not eligible to continue at this time.",
    "Thank you again for your interest.",
  ],
  contactInstruction:
    "If you have any questions about this study, please contact the study publisher through CloudResearch at any time.",
  completionInstruction:
    "To confirm your participation on CloudResearch, please return there and enter the completion code below manually. Do not rely on your browser's back button or an automatic redirect link—type the code on CloudResearch's completion page:",
  completionCode: "STUDY-PARTIAL",
} as const;

/** CloudResearch completion codes when screened out due to attention checks. */
export const ATTENTION_CHECK_COMPLETION_CODES = {
  pre: "E7A321F852",
  post: "E73E878D29",
} as const;
