import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import { GET } from "../app/api/calendar/route"
import { GET as legacyGET } from "../app/api/google-calendar/route"

const originalUrl = process.env.CALENDAR_ICAL_URL
afterEach(() => {
  if (originalUrl === undefined) delete process.env.CALENDAR_ICAL_URL
  else process.env.CALENDAR_ICAL_URL = originalUrl
})

function currentFeed() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const start = date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:live\nDTSTART:${start}\nSUMMARY:Parish Day\nEND:VEVENT\nEND:VCALENDAR`
}

test("configured URL is fetched uncached and normalized events are returned", async t => {
  process.env.CALENDAR_ICAL_URL = "https://example.com/church.ics"
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response(currentFeed()))
  const response = await GET()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("Cache-Control"), "no-store")
  const { events } = await response.json()
  assert.equal(events[0].id, "live")
  assert.equal(events[0].title, "Parish Day")
  const [url, options] = fetchMock.mock.calls[0].arguments
  assert.equal(url, process.env.CALENDAR_ICAL_URL)
  assert.equal(options?.cache, "no-store")
  assert.deepEqual(options?.headers, { Accept: "text/calendar", "Accept-Language": "en-US" })
  assert.ok(options?.signal instanceof AbortSignal)
})

test("the supplied ChurchTrac feed is used by default and the legacy endpoint remains compatible", async t => {
  delete process.env.CALENDAR_ICAL_URL
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response(currentFeed()))
  const response = await legacyGET()
  assert.equal(response.status, 200)
  assert.equal(fetchMock.mock.calls[0].arguments[0], "https://www.churchtrac.com/ical?ui=E6511E07")
})

test("invalid configured URLs fail without fetching", async t => {
  process.env.CALENDAR_ICAL_URL = "file:///calendar.ics"
  const fetchMock = t.mock.method(globalThis, "fetch")
  const response = await GET()
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: "Invalid CALENDAR_ICAL_URL", events: [] })
  assert.equal(fetchMock.mock.calls.length, 0)
})

test("upstream HTTP errors, malformed content, and timeouts return uncached error responses", async t => {
  t.mock.method(console, "error", () => {})
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 503 }))
  for (const scenario of ["http", "html", "timeout"]) {
    if (scenario === "html") fetchMock.mock.mockImplementation(async () => new Response("<html>Login</html>"))
    if (scenario === "timeout") fetchMock.mock.mockImplementation(async () => { throw new DOMException("Timed out", "TimeoutError") })
    const response = await GET()
    assert.equal(response.status, 502)
    assert.equal(response.headers.get("Cache-Control"), "no-store")
    assert.deepEqual(await response.json(), { error: "Failed to fetch calendar events", events: [] })
  }
})
