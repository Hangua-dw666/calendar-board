<template>
  <div class="terminal-card p-4">
    <div class="flex items-center justify-between mb-4">
      <button @click="calendarStore.previousMonth()" class="terminal-btn-secondary text-sm">
        &lt; 上月
      </button>
      <h2 class="text-xl text-terminal-green">
        {{ calendarStore.currentYear }}年{{ calendarStore.currentMonth + 1 }}月
      </h2>
      <button @click="calendarStore.nextMonth()" class="terminal-btn-secondary text-sm">
        下月 &gt;
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day"
        class="text-center text-terminal-muted text-sm py-2">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="(cell, index) in calendarCells" :key="index"
        @click="cell.day && onDayClick(cell)"
        :class="[
          'min-h-[80px] p-2 rounded border cursor-pointer transition-colors',
          cell.day ? 'border-terminal-border hover:border-terminal-green hover:bg-terminal-hover' : 'border-transparent cursor-default',
          cell.isToday ? 'border-terminal-green bg-terminal-green/5' : '',
          cell.isSelected ? 'ring-1 ring-terminal-green' : ''
        ]">
        <div v-if="cell.day" class="text-sm" :class="cell.isToday ? 'text-terminal-green font-bold' : 'text-terminal-text'">
          {{ cell.day }}
        </div>
        <div v-if="cell.day && cell.tags.length > 0" class="mt-1 flex flex-wrap gap-1">
          <span v-for="(tag, i) in cell.tags.slice(0, 3)" :key="i"
            class="terminal-tag text-xs"
            :style="{ borderColor: tag.color, color: tag.color }">
            {{ tag.label }}
          </span>
          <span v-if="cell.tags.length > 3" class="text-xs text-terminal-muted">
            +{{ cell.tags.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar.js'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import { useInspirationStore } from '../stores/inspiration.js'
import { useCategoryStore } from '../stores/category.js'
import { getDaysInMonth, getFirstDayOfMonth, formatDate, getToday } from '../utils/date.js'

const calendarStore = useCalendarStore()
const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()
const categoryStore = useCategoryStore()

const emit = defineEmits(['dayClick'])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const today = getToday()

const calendarCells = computed(() => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, tags: [] })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day)
    const tags = []

    const dailyRecords = dailyRecordStore.records.filter(r => r.record_date === dateStr)
    for (const record of dailyRecords) {
      const cat = categoryStore.categories.find(c => c.id === record.category_id)
      tags.push({
        label: record.title.length > 6 ? record.title.substring(0, 6) + '...' : record.title,
        color: cat?.color || '#6b8e4e',
      })
    }

    const inspirations = inspirationStore.records.filter(r => r.record_date === dateStr)
    for (const insp of inspirations) {
      const cat = categoryStore.categories.find(c => c.id === insp.category_id)
      tags.push({
        label: insp.title.length > 6 ? insp.title.substring(0, 6) + '...' : insp.title,
        color: cat?.color || '#d4a017',
      })
    }

    cells.push({
      day, dateStr, tags,
      isToday: dateStr === today.dateStr,
      isSelected: dateStr === calendarStore.selectedDate,
    })
  }

  return cells
})

function onDayClick(cell) {
  calendarStore.selectDate(cell.dateStr)
  emit('dayClick', cell.dateStr)
}
</script>
