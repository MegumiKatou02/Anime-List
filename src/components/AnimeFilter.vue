<template>
  <div class="filter-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="filter-controls">
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

      <!-- <div class="search-shortcut" @click="toggleFilter"><kbd>Ctrl</kbd> + <kbd>K</kbd></div> -->
    </div>

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

        <div v-if="activeTab === 'genres'" class="search-container">
          <div class="search-input-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm thể loại..."
              class="search-input"
              @keydown.esc="searchQuery = ''"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
              &times;
            </button>
          </div>
        </div>

        <div class="filter-body" ref="filterBodyRef">
          <div v-if="activeTab === 'status'" class="status-filters">
            <label v-for="status in getStatusOptions" :key="status.value" class="filter-option">
              <input
                type="radio"
                :value="status.value"
                v-model="selectedStatus"
                @change="updateSelectedInfo('status')"
              />
              <span :class="{ 'selected-option': selectedStatus === status.value }">
                {{ status.label }}
              </span>
            </label>
          </div>

          <div v-else class="genre-filters">
            <div v-if="filteredGenres.length === 0" class="no-results">
              Không tìm thấy thể loại phù hợp
            </div>

            <div v-if="selectedGenres.length > 0" class="selected-items">
              <div class="selected-items-title">Đã chọn:</div>
              <div class="selected-tags">
                <div
                  v-for="genreId in selectedGenres"
                  :key="`selected-${genreId}`"
                  class="selected-tag"
                >
                  {{ getGenreNameById(genreId) }}
                  <button class="remove-tag" @click.prevent="removeGenre(genreId)">&times;</button>
                </div>
              </div>
            </div>

            <label
              v-for="genre in filteredGenres"
              :key="getGenreId(genre)"
              class="filter-option"
              :class="{ 'option-highlight': isGenreSelected(getGenreId(genre)) }"
            >
              <input
                type="checkbox"
                :value="getGenreId(genre)"
                v-model="selectedGenres"
                @change="scrollToSelection"
              />
              <span :class="{ 'selected-option': isGenreSelected(getGenreId(genre)) }">
                {{ getGenreName(genre) }}
              </span>
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
import { MangaService } from '@/services/mangaApi'

interface AnimeGenre {
  mal_id: number
  name: string
  type?: string
  url?: string
}

interface MangaTag {
  id: string
  type: string
  attributes: {
    name: {
      en: string
      vi?: string
      [key: string]: string | undefined
    }
    description?: {
      [key: string]: string
    }
    group: string
    version: number
  }
  // relationships?: any[]
}

type Genre = AnimeGenre | MangaTag

interface StatusOption {
  value: string
  label: string
}

export default defineComponent({
  emits: ['filter'],
  setup(_, { emit }) {
    const isOpen = ref(false)
    const activeTab = ref('status')
    const searchQuery = ref('')
    const filterBodyRef = ref<HTMLElement | null>(null)

    const mainStatus = ref('')
    const mainGenres = ref<(string | number)[]>([])

    const selectedStatus = ref('')
    const selectedGenres = ref<(string | number)[]>([])
    const genres = ref<Genre[]>([])
    const tabSwitch = ref('anime')
    const lastSelectedGenre = ref<string | number | null>(null)

    const mangaService = new MangaService()

    const animeStatuses: StatusOption[] = [
      { value: 'currently_airing', label: 'Đang chiếu' },
      { value: 'finished_airing', label: 'Đã chiếu' },
      { value: 'not_yet_aired', label: 'Sắp chiếu' },
    ]

    const mangaStatuses: StatusOption[] = [
      { value: 'ongoing', label: 'Đang cập nhật' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'hiatus', label: 'Tạm ngưng' },
      { value: 'cancelled', label: 'Đã huỷ' },
    ]

    const getGenreId = (genre: Genre): string | number => {
      if ('mal_id' in genre) {
        return genre.mal_id
      } else if ('id' in genre) {
        return genre.id
      }
      return ''
    }

    const getGenreName = (genre: Genre): string => {
      if ('name' in genre && typeof genre.name === 'string') {
        return genre.name
      } else if ('attributes' in genre && genre.attributes && genre.attributes.name) {
        return genre.attributes.name.vi || genre.attributes.name.en || ''
      }
      return ''
    }

    const getGenreNameById = (id: string | number): string => {
      const genre = genres.value.find((g) => getGenreId(g) === id)
      return genre ? getGenreName(genre) : `ID: ${id}`
    }

    const isGenreSelected = (id: string | number): boolean => {
      return selectedGenres.value.includes(id)
    }

    const removeGenre = (id: string | number) => {
      selectedGenres.value = selectedGenres.value.filter((genreId) => genreId !== id)
    }

    const filteredGenres = computed(() => {
      if (!searchQuery.value.trim()) return genres.value

      const query = searchQuery.value.toLowerCase().trim()
      return genres.value.filter((genre) => {
        const name = getGenreName(genre).toLowerCase()
        return name.includes(query)
      })
    })

    const getStatusOptions = computed((): StatusOption[] => {
      return tabSwitch.value === 'manga' ? mangaStatuses : animeStatuses
    })

    const toggleFilter = () => {
      if (!equalGenres()) {
        selectedGenres.value = [...mainGenres.value]
      }
      if (mainStatus.value !== selectedStatus.value) {
        selectedStatus.value = mainStatus.value
      }
      if (!isOpen.value) {
        tabSwitch.value = localStorage.getItem('activeTab') || 'anime'
        fetchGenres()
        searchQuery.value = ''
      }
      isOpen.value = !isOpen.value
    }

    const clearFilters = () => {
      if (selectedStatus.value === '' && selectedGenres.value.length === 0) {
        return
      }

      selectedStatus.value = ''
      selectedGenres.value = []
      searchQuery.value = ''
      lastSelectedGenre.value = null
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

      mainGenres.value = [...selectedGenres.value]
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
          genres.value = response.data.data as AnimeGenre[]
        } else if (tabSwitch.value === 'manga') {
          const response = await mangaService.getTagsManga()
          genres.value = response.data.data as MangaTag[]
        }
      } catch (error) {
        console.error(`Error fetching ${tabSwitch.value} genres:`, error)
      }
    }

    //ctrk + K
    const setupKeyboardShortcut = () => {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault()
          toggleFilter()
        }
      })
    }

    const scrollToSelection = () => {
      if (selectedGenres.value.length > 0) {
        // const currentSet = new Set(selectedGenres.value)
        if (lastSelectedGenre.value === null) {
          const selectedItemsEl = document.querySelector('.selected-items')
          if (selectedItemsEl && filterBodyRef.value) {
            filterBodyRef.value.scrollTop = 0
          }
        }

        lastSelectedGenre.value = selectedGenres.value[selectedGenres.value.length - 1]
      }
    }

    const updateSelectedInfo = (type: string) => {
      if (type === 'status' && filterBodyRef.value) {
        filterBodyRef.value.scrollTop = 0
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
          searchQuery.value = ''
          lastSelectedGenre.value = null
        }
      },
    )

    watch(
      () => activeTab.value,
      () => {
        if (filterBodyRef.value) {
          filterBodyRef.value.scrollTop = 0
        }
      },
    )

    onMounted(async () => {
      tabSwitch.value = localStorage.getItem('activeTab') || 'anime'
      await fetchGenres()
      setupKeyboardShortcut()
    })

    const isFilterActive = computed(() => {
      return mainStatus.value !== '' || mainGenres.value.length > 0
    })

    return {
      isOpen,
      isDarkMode,
      activeTab,
      getStatusOptions,
      genres,
      filteredGenres,
      tabSwitch,
      toggleFilter,
      clearFilters,
      applyFilters,
      isFilterActive,
      selectedStatus,
      selectedGenres,
      getGenreId,
      getGenreName,
      getGenreNameById,
      isGenreSelected,
      removeGenre,
      searchQuery,
      filterBodyRef,
      updateSelectedInfo,
      scrollToSelection,
    }
  },
})
</script>

<style scoped>
.filter-container {
  position: relative;
  display: inline-block;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.filter-button {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: none;
  color: black;
  border-radius: 50px;
  width: 3rem;
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

.search-shortcut {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  color: #666;
  font-size: 0.875rem;
}

.search-shortcut kbd {
  background-color: #f1f1f1;
  border-radius: 3px;
  border: 1px solid #ccc;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}

.dark-mode .search-shortcut {
  color: #aaa;
}

.dark-mode .search-shortcut kbd {
  background-color: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
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

.search-container {
  margin: 1rem 0;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.875rem;
}

.dark-mode .search-input {
  background-color: #2d3748;
  border-color: #4a5568;
  color: white;
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  color: #666;
}

.dark-mode .clear-search {
  color: #aaa;
}

.filter-body {
  max-height: 360px;
  overflow-y: auto;
  margin: 1rem 0;
  padding-right: 0.5rem;
  scroll-behavior: smooth;
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.dark-mode .no-results {
  color: #aaa;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.filter-option:hover {
  background-color: #f5f5f5;
}

.dark-mode .filter-option:hover {
  background-color: #2d3748;
}

.option-highlight {
  background-color: rgba(45, 89, 150, 0.1);
}

.dark-mode .option-highlight {
  background-color: rgba(45, 89, 150, 0.2);
}

.selected-option {
  font-weight: 500;
  color: #2d5996;
}

.dark-mode .selected-option {
  color: #90cdf4;
}

.selected-items {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-left: 3px solid #2d5996;
}

.dark-mode .selected-items {
  background-color: #2d3748;
  border-left-color: #90cdf4;
}

.selected-items-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.dark-mode .selected-items-title {
  color: #e2e8f0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  background-color: #e6f0ff;
  color: #2d5996;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.dark-mode .selected-tag {
  background-color: #3b5380;
  color: #e2e8f0;
}

.remove-tag {
  background: none;
  border: none;
  margin-left: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
  border-color: #4a5568;
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
    /* background-color: #1a202c; */
    color: black;
  }

  .filter-button.dark-mode {
    color: white;
    /* background-color: #1a202c; */
  }

  .filter-button.active-filter {
    color: red;
  }

  .filter-button:hover {
    background-color: #2d3748;
  }

  .search-shortcut {
    color: #aaa;
  }

  .search-shortcut kbd {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
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

  .search-input {
    background-color: #2d3748;
    border-color: #4a5568;
    color: white;
  }

  .clear-search {
    color: #aaa;
  }

  .no-results {
    color: #aaa;
  }

  .filter-option {
    color: #e5e7eb;
  }

  .filter-option:hover {
    background-color: #2d3748;
  }

  .option-highlight {
    background-color: rgba(45, 89, 150, 0.2);
  }

  .selected-option {
    color: #90cdf4;
  }

  .selected-items {
    background-color: #2d3748;
    border-left-color: #90cdf4;
  }

  .selected-items-title {
    color: #e2e8f0;
  }

  .selected-tag {
    background-color: #3b5380;
    color: #e2e8f0;
  }

  .clear-button {
    border-color: #4a5568;
    color: #9ca3af;
  }
}
</style>
