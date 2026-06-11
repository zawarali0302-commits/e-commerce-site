import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Replace with your verified Resend domain before going live
// During dev you can use: onboarding@resend.dev (only sends to your own email)
const FROM = process.env.EMAIL_FROM ?? "Éclat <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err: any) {
    console.error("sendEmail error:", err?.message ?? err);
  }
}