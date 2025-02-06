<template>
  <div class="filter-container">
    <button @click="toggleFilter" class="filter-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 filter-icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 6h3M6.75 12h10.5m-7.5 6h4.5"
        />
      </svg>
      <div>Bộ lọc</div>
    </button>

    <div v-if="isOpen" class="filter-modal">
      <div class="filter-content dark:bg-gray-800">
        <div class="filter-header">
          <h3 class="dark:text-white">Bộ lọc</h3>
          <button @click="toggleFilter" class="close-button">&times;</button>
        </div>

        <div class="filter-tabs">
          <button
            :class="['tab-button', { active: activeTab === 'status' }]"
            @click="activeTab = 'status'"
          >
            Trạng thái
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'genres' }]"
            @click="activeTab = 'genres'"
          >
            Thể loại
          </button>
        </div>

        <div class="filter-body">
          <div v-if="activeTab === 'status'" class="status-filters">
            <label v-for="status in statuses" :key="status.value" class="filter-option">
              <input type="radio" :value="status.value" v-model="selectedStatus" />
              {{ status.label }}
            </label>
          </div>

          <div v-else class="genre-filters">
            <label v-for="genre in genres" :key="genre.mal_id" class="filter-option">
              <input type="checkbox" :value="genre.mal_id" v-model="selectedGenres" />
              {{ genre.name }}
            </label>
          </div>
        </div>

        <div class="filter-footer">
          <button @click="clearFilters" class="clear-button">Xoá bộ lọc</button>
          <button @click="applyFilters" class="apply-button">Áp dụng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Genres } from '@/types/anime'

const isOpen = ref(false)
const activeTab = ref('status')
const selectedStatus = ref('')
const selectedGenres = ref<number[]>([])
const genres = ref<Genres[]>([])

const statuses = [
  { value: 'currently_airing', label: 'Đang chiếu' },
  { value: 'finished_airing', label: 'Đã chiếu' },
  { value: 'not_yet_aired', label: 'Sắp chiếu' },
]

const emit = defineEmits(['filter'])

const toggleFilter = () => {
  isOpen.value = !isOpen.value
}

const clearFilters = () => {
  if (selectedStatus.value === '' && selectedGenres.value.length === 0) {
    return
  }

  selectedStatus.value = ''
  selectedGenres.value = []
  // emit('filter', { status: '', genres: [] })
}

const applyFilters = () => {
  isOpen.value = false
  emit('filter', {
    status: selectedStatus.value,
    genres: selectedGenres.value,
  })
}

onMounted(async () => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/genres/anime')
    genres.value = response.data.data
  } catch (error) {
    console.error('Error fetching genres:', error)
  }
})
</script>

<style scoped>
.filter-container {
  position: relative;
  display: inline-block;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button:hover {
  background-color: #f5f5f5;
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.filter-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  padding: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
}

.tab-button.active {
  background: #2d5996;
  color: white;
}

.filter-body {
  max-height: 400px;
  overflow-y: auto;
  margin: 1rem 0;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.filter-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.clear-button,
.apply-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.clear-button {
  background: none;
  border: 1px solid #ddd;
}

.apply-button {
  background: #2d5996;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .filter-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>
