import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Simple in-memory rate limiter: max 5 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_RATE_LIMIT_KEYS = 10_000

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  const forwardedIp = forwardedFor?.split(",").at(0)?.trim()

  return (
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    forwardedIp ||
    "unknown"
  )
}

function pruneRateLimitMap(now: number) {
  if (rateLimitMap.size < MAX_RATE_LIMIT_KEYS) return

  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip)
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  pruneRateLimitMap(now)

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\x00-\x1F\x7F]+/g, " ").trim()
}

function getEnv(name: string): string {
  return process.env[name]?.trim() || ""
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    const firstName = sanitizeText(body.firstName, 100)
    const lastName = sanitizeText(body.lastName, 100)
    const email = sanitizeText(body.email, 254)
    const message = sanitizeText(body.message, 5000)

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      )
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      )
    }

    const EMAIL_USER = getEnv("EMAIL_USER")
    const EMAIL_PASS = getEnv("EMAIL_PASS")
    const EMAIL_TO = getEnv("EMAIL_TO") || EMAIL_USER

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error("Contact email service is missing required configuration")
      return NextResponse.json(
        { error: "Email service is currently unavailable." },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })

    const fullName = `${firstName} ${lastName}`.trim() || "Website Visitor"
    const headerSafeFullName = sanitizeHeaderValue(fullName)
    const headerSafeEmail = sanitizeHeaderValue(email)

    const safeFullName = escapeHtml(fullName)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>")

    await transporter.sendMail({
      from: `Redeemer MTC Website <${EMAIL_USER}>`,
      replyTo: headerSafeEmail,
      to: EMAIL_TO,
      subject: `New Contact Form Message from ${headerSafeFullName}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${safeFullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong><br/>${safeMessage}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("Contact route error:", err)
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    )
  }
}
