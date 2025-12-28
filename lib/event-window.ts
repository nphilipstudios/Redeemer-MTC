export function getContinuousUpcoming<T extends { start: string }>(
  items: T[],
  count: number
) {
  const now = new Date()

  return items
    .filter(item => new Date(item.start) >= now)
    .sort(
      (a, b) =>
        new Date(a.start).getTime() - new Date(b.start).getTime()
    )
    .slice(0, count)
}