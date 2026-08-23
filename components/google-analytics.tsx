"use client"

import { useEffect, useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type GoogleAnalyticsValue = string | number | boolean | null | undefined
type GoogleAnalyticsParams = Record<string, GoogleAnalyticsValue>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, target: string, params?: GoogleAnalyticsParams) => void
  }
}

const downloadableExtensions = new Set([
  "csv",
  "doc",
  "docx",
  "pdf",
  "ppt",
  "pptx",
  "txt",
  "xls",
  "xlsx",
  "zip",
])

function compactLinkText(link: HTMLAnchorElement) {
  return link.innerText.trim().replace(/\s+/g, " ").slice(0, 100) || undefined
}

function fileExtension(url: URL) {
  const pathname = url.pathname.toLowerCase()
  const extension = pathname.split(".").pop()

  return extension && extension !== pathname ? extension : undefined
}

export function trackGoogleAnalyticsEvent(
  eventName: string,
  params: GoogleAnalyticsParams = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", eventName, params)
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pagePath = useMemo(() => {
    const queryString = searchParams.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }, [pathname, searchParams])

  useEffect(() => {
    trackGoogleAnalyticsEvent("page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: measurementId,
    })
  }, [measurementId, pagePath])

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]")

      if (!link) {
        return
      }

      const href = link.getAttribute("href")

      if (!href || href.startsWith("#")) {
        return
      }

      let url: URL

      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }

      const linkText = compactLinkText(link)
      const extension = fileExtension(url)

      if (url.protocol === "mailto:" || url.protocol === "tel:") {
        trackGoogleAnalyticsEvent("contact_link_click", {
          link_type: url.protocol.replace(":", ""),
          link_url: href,
          link_text: linkText,
        })

        return
      }

      if (extension && downloadableExtensions.has(extension)) {
        trackGoogleAnalyticsEvent("file_download", {
          file_extension: extension,
          file_name: url.pathname.split("/").pop(),
          link_url: url.href,
          link_text: linkText,
        })
      }

      if (
        (url.protocol === "http:" || url.protocol === "https:") &&
        url.origin !== window.location.origin
      ) {
        trackGoogleAnalyticsEvent("click", {
          link_domain: url.hostname,
          link_url: url.href,
          link_text: linkText,
          outbound: true,
        })
      }
    }

    document.addEventListener("click", handleDocumentClick)

    return () => {
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [])

  return null
}
