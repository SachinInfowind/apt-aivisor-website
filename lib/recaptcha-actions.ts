/**
 * reCAPTCHA v3 action names — one per form. The browser asks Google for a token tagged with
 * the action, and the server checks the token was issued for that same action (so a token
 * from, say, the newsletter form can't be replayed against the contact form).
 */
export const RECAPTCHA_ACTIONS = {
  contact: "contact",
  waitlist: "waitlist",
  newsletter: "newsletter",
  designPartner: "design_partner",
  demoNotify: "demo_notify",
  careerApplication: "career_application",
  emailVerification: "email_verification",
} as const;

export type RecaptchaAction = (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS];

/** Name of the field that carries the token in every form submission. */
export const RECAPTCHA_FIELD = "recaptchaToken";
