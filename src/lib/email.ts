import nodemailer from "nodemailer";

export type EmailActivityType =
  | "contact"
  | "vehicle-inquiry"
  | "sell-listing";

export function getRecipientEmail(): string {
  return (
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "contact@bankreposessedcars.com"
  );
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

function getFromAddress(): string {
  return (
    process.env.SMTP_FROM ||
    `"Bank Repossessed Cars" <${process.env.SMTP_USER}>`
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendActivityEmail(options: {
  activity: EmailActivityType;
  subject: string;
  text: string;
  replyTo?: string;
  htmlLines?: { label: string; value: string }[];
}) {
  const transporter = getTransporter();
  const to = getRecipientEmail();

  let html: string;
  if (options.htmlLines && options.htmlLines.length > 0) {
    const rows = options.htmlLines
      .map(
        (row) =>
          `<p><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</p>`
      )
      .join("");
    html = [
      '<div style="font-family:sans-serif;line-height:1.5;color:#1c1917">',
      `<p><strong>Activity:</strong> ${escapeHtml(options.activity)}</p>`,
      rows,
      "<hr />",
      `<pre>${escapeHtml(options.text)}</pre>`,
      "</div>",
    ].join("");
  } else {
    html = `<pre>${escapeHtml(options.text)}</pre>`;
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html,
  });
}
