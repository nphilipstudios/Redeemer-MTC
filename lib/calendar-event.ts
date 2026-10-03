export interface CalendarEvent {
  id: string
  title: string
  description?: string
  location?: string
  // All-day starts remain YYYY-MM-DD so the UI can hide the time.
  start: string
  // All-day ends are inclusive local datetimes; timed ends are ISO instants.
  end: string
}
