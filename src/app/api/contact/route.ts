import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RateBucket = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MIN_SUBMIT_TIME_MS = 3000;
const MAX_URLS_IN_MESSAGE = 3;

const globalForRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, RateBucket>;
};

const rateLimitStore = globalForRateLimit.contactRateLimit ?? new Map<string, RateBucket>();
globalForRateLimit.contactRateLimit = rateLimitStore;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  return `${forwardedFor || realIp || "unknown"}:${userAgent.slice(0, 80)}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function looksSpammy(message: string) {
  const normalized = message.toLowerCase();
  const urlCount = normalized.match(/https?:\/\/|www\./g)?.length ?? 0;
  const spamTerms = [
    "casino bonus",
    "crypto investment",
    "forex",
    "loan offer",
    "viagra",
    "whatsapp",
    "telegram",
  ];

  return urlCount > MAX_URLS_IN_MESSAGE || spamTerms.some((term) => normalized.includes(term));
}

function makeTextEmail({
  name,
  email,
  url,
  message,
}: {
  name: string;
  email: string;
  url: string;
  message: string;
}) {
  return [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company URL: ${url || "Not provided"}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const honeypot = getString(formData, "website");
  const startedAtValue = getString(formData, "startedAt");
  const startedAt = Number(startedAtValue);
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const url = getString(formData, "url");
  const message = getString(formData, "message");

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const submittedTooFast =
    !startedAtValue ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < MIN_SUBMIT_TIME_MS;

  if (submittedTooFast || isRateLimited(getClientKey(request)) || looksSpammy(message)) {
    return NextResponse.json({ ok: true });
  }

  if (
    !name ||
    name.length > 80 ||
    !isEmail(email) ||
    url.length > 240 ||
    message.length < 20 ||
    message.length > 3000
  ) {
    return NextResponse.json({ error: "Invalid contact form submission." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "boriscolovic@outlook.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 500 });
  }

  const emailText = makeTextEmail({ name, email, url, message });
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `New SEO inquiry from ${name}`,
      text: emailText,
    }),
  });

  if (!resendResponse.ok) {
    return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
