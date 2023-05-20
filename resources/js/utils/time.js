import { DateTime } from 'luxon'

export function getNextRestartMillis() {
  const now = DateTime.now()
  const hourNow = now.hour

  if (hourNow < 6) return getDifference(now, 6)
  if (hourNow < 12) return getDifference(now, 12)
  if (hourNow < 18) return getDifference(now, 18)
  return getDifference(now, 6, true)
}

function getDifference(now, hour, isNewDay = false) {
  const future = DateTime.now().set({ hour, minute: 5, ...(isNewDay && { day: now.day + 1 }) })

  return future.diff(now, 'milliseconds').milliseconds
}
