import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToday, getMonthRange } from '../utils/date.js'

export const useCalendarStore = defineStore('calendar', () => {
  const today = getToday()
  const currentYear = ref(today.year)
  const currentMonth = ref(today.month)
  const selectedDate = ref(null)

  const monthRange = computed(() => getMonthRange(currentYear.value, currentMonth.value))

  function previousMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function goToToday() {
    const t = getToday()
    currentYear.value = t.year
    currentMonth.value = t.month
    selectedDate.value = t.dateStr
  }

  function selectDate(dateStr) {
    selectedDate.value = dateStr
  }

  return {
    currentYear, currentMonth, selectedDate, monthRange,
    previousMonth, nextMonth, goToToday, selectDate,
  }
})
