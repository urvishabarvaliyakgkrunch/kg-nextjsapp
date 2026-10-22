// src/lib/ageGateCopy.ts
// Every word and option the age gate shows. One file to edit when the wording changes.

export const GATE_COPY = {
  eyebrow: "Research Use Only · 21+",
  title: "Research Use Only",
  intro: [
    "By entering this site, you acknowledge that all products and information are provided for research purposes only and are not intended for human consumption or medical use.",
    "You must be 21 years of age or older to use this website.",
  ],
  emailLabel: "Email",
  emailPlaceholder: "you@lab.edu",
  researchLabel: "Field of research",
  researchPlaceholder: "Select field of research",
  ageCheck: "I confirm I am 21 years of age or older.",
  ruoCheck:
    "I acknowledge these products are for research use only and not for human consumption or medical use.",
  submit: "Confirm & enter",
  submitPending: "Please wait…",
  footnote: "Already confirmed on another device?",
  signIn: "Sign in",
  exit: "Exit",
} as const;

// Leaving the gate takes the visitor right off the site, same as the WordPress build did
export const GATE_EXIT_URL = "https://www.google.com/";

// Where the gate stops blocking, so somebody who already has a login can still sign in
export const GATE_OPEN_PATH = "/account";

// The user meta key WordPress reads this answer back from — do not rename it
export const RESEARCH_META_KEY = "field_of_research";

// Values must stay in step with kg_get_research_field_options() in the WordPress theme,
// because WordPress saves the value, not the label
export const RESEARCH_FIELDS: { value: string; label: string }[] = [
  { value: "biochemistry", label: "Biochemistry" },
  { value: "pharmacology", label: "Pharmacology" },
  { value: "neuroscience", label: "Neuroscience" },
  { value: "endocrinology", label: "Endocrinology" },
  { value: "immunology", label: "Immunology" },
  { value: "oncology", label: "Oncology" },
  { value: "molecular_biology", label: "Molecular biology" },
  { value: "cell_biology", label: "Cell biology" },
  { value: "academic", label: "Academic / University" },
  { value: "clinical_research", label: "Clinical research" },
  { value: "private_lab", label: "Private laboratory" },
  { value: "other", label: "Other" },
];
