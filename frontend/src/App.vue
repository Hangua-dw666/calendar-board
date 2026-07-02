<template>
  <div id="app" class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl text-terminal-green">
          <span class="text-terminal-muted">$</span> 日历看板
          <span class="text-terminal-muted text-sm animate-pulse">_</span>
        </h1>
        <div class="flex items-center gap-4">
          <button @click="calendarStore.goToToday()" class="terminal-btn-secondary text-sm">今日</button>
          <CategoryFilter v-model="filterCategoryId" :categories="categoryStore.categories" />
        </div>
      </div>

      <CalendarGrid @dayClick="onDayClick" class="mb-6" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyInput @refresh="refreshData" />
        <InspirationInput @refresh="refreshData" />
      </div>
    </div>

    <DayDetailModal :visible="showDetail" :date="selectedDate" @close="showDetail = false" @refresh="refreshData" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCalendarStore } from './stores/calendar.js'
import { useCategoryStore } from './stores/category.js'
import { useDailyRecordStore } from './stores/dailyRecord.js'
import { useInspirationStore } from './stores/inspiration.js'
import CalendarGrid from './components/CalendarGrid.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import DailyInput from './components/DailyInput.vue'
import InspirationInput from './components/InspirationInput.vue'
import DayDetailModal from './components/DayDetailModal.vue'

const calendarStore = useCalendarStore()
const categoryStore = useCategoryStore()
const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()

const filterCategoryId = ref(null)
const showDetail = ref(false)
const selectedDate = ref('')

async function refreshData() {
  const range = calendarStore.monthRange
  const params = { start_date: range.start_date, end_date: range.end_date }
  if (filterCategoryId.value) params.category_id = filterCategoryId.value
  await Promise.all([
    dailyRecordStore.fetchRecords(params),
    inspirationStore.fetchRecords(params),
  ])
}

function onDayClick(dateStr) {
  selectedDate.value = dateStr
  showDetail.value = true
}

watch(() => [calendarStore.currentYear, calendarStore.currentMonth], () => refreshData())
watch(filterCategoryId, () => refreshData())

onMounted(async () => {
  await categoryStore.fetchCategories()
  await refreshData()
})
</script>
