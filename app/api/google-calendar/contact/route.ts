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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Message from ${firstName} ${lastName}`,
      text: message,
      html: `<p>${message}</p><p>From: ${firstName} ${lastName} (${email})</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}