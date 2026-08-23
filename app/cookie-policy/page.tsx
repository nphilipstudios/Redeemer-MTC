import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Cookie Policy | Redeemer MTC",
  description:
    "Cookie policy information for Redeemer Mar Thoma Church website visitors.",
}

export default function CookiePolicyPage() {
  redirect("/privacy-policy")
}
