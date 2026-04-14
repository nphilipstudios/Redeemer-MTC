"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Youtube, Facebook, Instagram } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Calendar", href: "/calendar" },
  { label: "Ministries", href: "/ministries" },
  { label: "About", href: "/about" },
  { label: "Rock of Redeemer", href: "/rock-of-redeemer" },
  { label: "Contact", href: "/contact" },
]
  
export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Redeemer MTC - Lighted to Lighten"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="https://www.youtube.com/@redeemermtc" className="text-muted-foreground hover:text-accent transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/redeemermtcfamily/" className="text-muted-foreground hover:text-accent transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/redeemermtc/" className="text-muted-foreground hover:text-accent transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* ✅ IN PROGRESS BAR (UNDER HEADER) */}
    {/*  <div className="w-full bg-yellow-400 text-black text-center py-2 text-sm font-semibold tracking-widest">
        🚧 IN PROGRESS — SITE UNDER DEVELOPMENT 🚧
      </div> */} 

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-border max-h-[80vh] overflow-y-auto"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-foreground hover:text-accent transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}