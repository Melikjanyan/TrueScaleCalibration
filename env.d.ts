// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
    CONTACT_TO?: string;

    SMTP_HOST?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_PORT?: string;
  }
}
