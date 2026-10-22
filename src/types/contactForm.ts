// src/types/contactForm.ts

// What the visitor typed, after trimming
export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// What the server action hands back to the form
export interface ContactFormState {
  // true once Contact Form 7 accepted the message and mailed it
  sent?: boolean;
  // One readable sentence for the red message under the form
  error?: string;
}

// The part of Contact Form 7's reply we use. It always answers with HTTP 200,
// so only `status` tells us whether it worked.
export interface Cf7FeedbackResponse {
  status?: "mail_sent" | "mail_failed" | "validation_failed" | "spam" | "aborted" | "acceptance_missing";
  message?: string;
}
