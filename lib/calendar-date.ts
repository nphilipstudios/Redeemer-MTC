/** Interpret a date-only event on its calendar day in the viewer's timezone. */
export function parseCalendarDate(value: string): Date {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value)
}
