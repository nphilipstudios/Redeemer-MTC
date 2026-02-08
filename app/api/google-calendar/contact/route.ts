import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, message } = await req.json()

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      )
    }

    // ✅ Guard: prevents “Missing credentials for PLAIN”
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
        pass: EMAIL_PASS, // ✅ Gmail App Password (NOT normal password)
      },
    })

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Website Visitor"

    await transporter.sendMail({
      // ✅ Gmail likes the FROM to be the authenticated account
      from: `Redeemer MTC Website <${EMAIL_USER}>`,
      // ✅ lets you hit “reply” and it replies to the visitor
      replyTo: email,
      to: EMAIL_TO,
      subject: `New Contact Form Message from ${fullName}`,
      text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Contact route error:", err)
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    )
  }
}