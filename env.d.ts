// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
     ALLOWED_ORIGIN?: string;
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
    CONTACT_TO?: string;
  }
}
