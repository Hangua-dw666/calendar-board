export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function getToday() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    dateStr: formatDate(now.getFullYear(), now.getMonth(), now.getDate()),
  }
}

export function getMonthRange(year, month) {
  const lastDay = getDaysInMonth(year, month)
  return {
    start_date: formatDate(year, month, 1),
    end_date: formatDate(year, month, lastDay),
  }
}
