import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Simple in-memory rate limiter: max 5 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
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

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

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

    const EMAIL_USER = process.env.EMAIL_USER
    const EMAIL_PASS = process.env.EMAIL_PASS
    const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER

    if (!EMAIL_USER || !EMAIL_PASS) {
      return NextResponse.json(
        { error: "Server email not configured (missing EMAIL_USER/EMAIL_PASS)." },
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

    const safeFullName = escapeHtml(fullName)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>")

    await transporter.sendMail({
      from: `Redeemer MTC Website <${EMAIL_USER}>`,
      replyTo: email,
      to: EMAIL_TO,
      subject: `New Contact Form Message from ${fullName}`,
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
