<template>
  <div class="filter-container" :class="{ 'dark-mode': isDarkMode }">
    <button
      v-if="tabSwitch === 'anime' || tabSwitch === 'manga'"
      @click="toggleFilter"
      :class="['filter-button', { 'dark-mode': isDarkMode }, { 'active-filter': isFilterActive }]"
    >
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
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
        />
      </svg>
    </button>

    <div v-if="isOpen" class="filter-modal" @click="toggleFilter">
      <div class="filter-content dark:bg-gray-800" @click.stop>
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
            <label v-for="status in getStatusOptions" :key="status.value" class="filter-option">
              <input type="radio" :value="status.value" v-model="selectedStatus" />
              {{ status.label }}
            </label>
          </div>

          <div v-else class="genre-filters">
            <label
              v-for="genre in genres"
              :key="tabSwitch === 'manga' ? genre.id : genre.mal_id"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="tabSwitch === 'manga' ? genre.id : genre.mal_id"
                v-model="selectedGenres"
              />
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

<script lang="ts">
import { ref, onMounted, computed, defineComponent, watch } from 'vue'
import axios from 'axios'
import { isDarkMode } from '@/utils/settings'

interface Genre {
  id: string
  name: string
}

interface Tag {
  id: string
  attributes: {
    name: {
      en: string
      vi: string
    }
  }
}

export default defineComponent({
  emits: ['filter'],
  setup(_, { emit }) {
    const isOpen = ref(false)
    const activeTab = ref('status')

    const mainStatus = ref('')
    const mainGenres = ref<number[]>([])

    const selectedStatus = ref('')
    const selectedGenres = ref<number[]>([])
    const genres = ref<Genre[]>([])
    const tabSwitch = ref('anime')

    const animeStatuses = [
      { value: 'currently_airing', label: 'Đang chiếu' },
      { value: 'finished_airing', label: 'Đã chiếu' },
      { value: 'not_yet_aired', label: 'Sắp chiếu' },
    ]

    const mangaStatuses = [
      { value: 'ongoing', label: 'Đang cập nhật' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'hiatus', label: 'Tạm ngưng' },
      { value: 'cancelled', label: 'Đã huỷ' },
    ]

    const getStatusOptions = computed(() => {
      return tabSwitch.value === 'manga' ? mangaStatuses : animeStatuses
    })

    const toggleFilter = () => {
      if (!equalGenres()) {
        selectedGenres.value = mainGenres.value
      }
      if (mainStatus.value !== selectedStatus.value) {
        selectedStatus.value = mainStatus.value
      }
      if (!isOpen.value) {
        tabSwitch.value = localStorage.getItem('activeTab') || 'anime'
        fetchGenres()
      }
      isOpen.value = !isOpen.value
    }

    const clearFilters = () => {
      if (selectedStatus.value === '' && selectedGenres.value.length === 0) {
        return
      }

      selectedStatus.value = ''
      selectedGenres.value = []
    }

    const equalGenres = () => {
      const setMainGenres = new Set(mainGenres.value)
      const setSelectedGenres = new Set(selectedGenres.value)

      if (setMainGenres.size !== setSelectedGenres.size) {
        return false
      }

      for (const genre of setMainGenres) {
        if (!setSelectedGenres.has(genre)) {
          return false
        }
      }

      return true
    }

    const applyFilters = () => {
      isOpen.value = false

      mainGenres.value = selectedGenres.value
      mainStatus.value = selectedStatus.value

      emit('filter', {
        status: selectedStatus.value,
        genres: selectedGenres.value,
        type: tabSwitch.value,
      })
    }

    const fetchGenres = async () => {
      try {
        if (tabSwitch.value === 'anime') {
          const response = await axios.get('https://api.jikan.moe/v4/genres/anime')
          genres.value = response.data.data
        } else if (tabSwitch.value === 'manga') {
          const response = await axios.get('https://api.mangadex.org/manga/tag')
          genres.value = response.data.data.map((tag: Tag) => ({
            id: tag.id,
            name: tag.attributes.name.vi || tag.attributes.name.en,
          }))
        }
      } catch (error) {
        console.error(`Error fetching ${tabSwitch.value} genres:`, error)
      }
    }

    watch(
      () => tabSwitch.value,
      () => {
        if (isOpen.value) {
          fetchGenres()
          selectedStatus.value = ''
          selectedGenres.value = []
          mainStatus.value = ''
          mainGenres.value = []
        }
      },
    )

    onMounted(async () => {
      tabSwitch.value = localStorage.getItem('activeTab') || 'anime'
      await fetchGenres()
    })

    const isFilterActive = computed(() => {
      return mainStatus.value != '' || mainGenres.value.length > 0
    })

    return {
      isOpen,
      isDarkMode,
      activeTab,
      getStatusOptions,
      genres,
      tabSwitch,
      toggleFilter,
      clearFilters,
      applyFilters,
      isFilterActive,
      selectedStatus,
      selectedGenres,
    }
  },
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
  background-color: #fff;
  border: none;
  color: black;
  border-radius: 50px;
  width: 3rem;
  margin-bottom: 2rem;
  height: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button.active-filter {
  color: red;
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

.dark-mode .filter-content {
  background-color: #1b2234;
  color: white;
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

.dark-mode .close-button {
  color: white;
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
  max-height: 390px;
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

.dark-mode .clear-button {
  color: white;
}

.apply-button {
  background: #2d5996;
  color: white;
  border: none;
}

.filter-button.dark-mode {
  color: white;
  background-color: #1a202c;
}

.filter-button.active-filter.dark-mode {
  color: red;
}

@media (prefers-color-scheme: dark) {
  .filter-button {
    background-color: #fff;
    color: black;
  }

  .filter-button.active-filter {
    color: red;
  }

  .filter-button:hover {
    background-color: #f5f5f5;
  }

  .filter-content {
    background: #1f2937;
    color: #e5e7eb;
  }

  .filter-header h3 {
    color: #e5e7eb;
  }

  .close-button {
    color: #9ca3af;
  }

  .tab-button {
    background: #374151;
    color: #e5e7eb;
  }

  .filter-option {
    color: #e5e7eb;
  }

  .clear-button {
    border-color: #374151;
    color: #9ca3af;
  }
}
</style>
