<template>
  <div class="chapters-wrapper" ref="chaptersContainer">
    <div class="chapters-container" :class="{ 'dark-mode': isDarkMode }">
      <div class="chapters-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-list"
        >
          <line x1="8" x2="21" y1="6" y2="6"></line>
          <line x1="8" x2="21" y1="12" y2="12"></line>
          <line x1="8" x2="21" y1="18" y2="18"></line>
          <line x1="3" x2="3.01" y1="6" y2="6"></line>
          <line x1="3" x2="3.01" y1="12" y2="12"></line>
          <line x1="3" x2="3.01" y1="18" y2="18"></line>
        </svg>
        <h2>Danh sách chương</h2>
      </div>

      <div class="chapters-content">
        <div v-if="filteredChapters.length === 0">
          <p class="no-chapters-message">
            Không có chương nào. Hãy thử đổi ngôn ngữ trong phần tuỳ chỉnh và tải lại trang.
          </p>
        </div>
        <div v-else>
          <div
            v-for="[volumeKey, volumeChapters] in groupedChaptersForDisplay"
            :key="volumeKey"
            class="volume-section"
          >
            <div class="volume-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-list-tree"
              >
                <path d="M21 12h-8"></path>
                <path d="M21 6H8"></path>
                <path d="M21 18h-8"></path>
                <path d="M3 6v4c0 1.1.9 2 2 2h3"></path>
                <path d="M3 10v6c0 1.1.9 2 2 2h3"></path>
              </svg>
              <h3>{{ volumeKey === 'noVolume' ? 'No Volume' : `Volume ${volumeKey}` }}</h3>
            </div>

            <div class="chapter-list">
              <div
                v-for="chapter in volumeChapters"
                :key="chapter.id"
                class="chapter-item"
                :class="{ 'dark-mode': isDarkMode }"
                @click="handleChapterClick(chapter.id)"
              >
                <div class="chapter-info">
                  <div class="chapter-main">
                    <div class="language-flag">
                      <img
                        v-if="chapter.language === 'vi'"
                        class="flag_icon"
                        src="@/assets/flags/vn.svg"
                        alt="Vietnamese flag icon"
                      />
                      <img
                        v-else
                        class="flag_icon"
                        src="@/assets/flags/gb.svg"
                        alt="GB flag icon"
                      />
                    </div>
                    <span class="chapter-title">
                      {{ chapter.language === 'vi' ? 'Chương' : 'Ch.' }} {{ chapter.number }} -
                      <span v-if="chapter.title !== 'none'">
                        {{ chapter.title }}
                      </span>
                      <span v-else style="font-style: italic"> Không có tiêu đề </span>
                    </span>
                  </div>
                  <div class="chapter-metadata" :class="{ 'dark-mode': isDarkMode }">
                    <div class="scanlation_group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="icon small text-icon-contrast text-undefined rounded mr-0.5 md:mr-1"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"
                        ></path>
                      </svg>
                      <span
                        class="scanlation team-link"
                        v-if="chapter.scanlation_group_id"
                        @click.stop="navigateToTeam(chapter.scanlation_group_id)"
                      >
                        {{ chapter.scanlation_group }}
                      </span>
                      <span v-else class="team-link">
                        {{ chapter.scanlation_group }}
                      </span>
                    </div>
                    <div class="upload-time">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="feather feather-clock icon small text-icon-contrast text-undefined mr-1 sm:mr-1.5 md:mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      <span class="time">{{ formatTime(chapter.publishedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination" v-if="totalPages > 1">
            <button
              class="page-button"
              :class="{ 'dark-mode': isDarkMode }"
              @click="setPage(1)"
              :disabled="currentPage === 1"
            >
              &laquo;
            </button>

            <button
              class="page-button"
              :class="{ 'dark-mode': isDarkMode }"
              @click="setPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              &lt;
            </button>

            <button
              class="page-button"
              :class="{ active: currentPage === 1, 'dark-mode': isDarkMode }"
              @click="setPage(1)"
            >
              1
            </button>

            <div v-if="showStartEllipsis" class="ellipsis-container">
              <input
                v-if="showPageInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="pageInputValue"
                class="page-input"
                :class="{ 'dark-mode': isDarkMode }"
                @keyup.enter="setPage(parseInt(pageInputValue))"
                @blur="hidePageInput"
                ref="pageInput"
              />
              <button
                v-else
                class="page-button ellipsis"
                :class="{ 'dark-mode': isDarkMode }"
                @click="togglePageInput"
              >
                ...
              </button>
            </div>

            <button
              v-for="page in middlePages"
              :key="page"
              class="page-button"
              :class="{ active: currentPage === page, 'dark-mode': isDarkMode }"
              @click="setPage(page)"
            >
              {{ page }}
            </button>

            <div v-if="showEndEllipsis" class="ellipsis-container">
              <input
                v-if="showPageInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="pageInputValue"
                class="page-input"
                :class="{ 'dark-mode': isDarkMode }"
                @keyup.enter="setPage(parseInt(pageInputValue))"
                @blur="hidePageInput"
                ref="pageInput"
              />
              <button
                v-else
                class="page-button ellipsis"
                :class="{ 'dark-mode': isDarkMode }"
                @click="togglePageInput"
              >
                ...
              </button>
            </div>

            <button
              v-if="totalPages > 1"
              class="page-button"
              :class="{ active: currentPage === totalPages, 'dark-mode': isDarkMode }"
              @click="setPage(totalPages)"
            >
              {{ totalPages }}
            </button>

            <button
              class="page-button"
              :class="{ 'dark-mode': isDarkMode }"
              @click="setPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              &gt;
            </button>

            <button
              class="page-button"
              :class="{ 'dark-mode': isDarkMode }"
              @click="setPage(totalPages)"
              :disabled="currentPage === totalPages"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { Chapter } from '@/types/manga'
import { isDarkMode } from '@/utils/settings'

export default defineComponent({
  name: 'ChaptersList',
  props: {
    chapters: {
      type: Array as () => Chapter[],
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const chaptersContainer = ref<HTMLElement | null>(null)
    const chaptersPerPage = 10
    const currentPage = ref(1)
    const showPageInput = ref(false)
    const pageInputValue = ref('')
    const pageInput = ref<HTMLInputElement | null>(null)

    const filteredChapters = computed(() => {
      const startIndex = (currentPage.value - 1) * chaptersPerPage
      const endIndex = startIndex + chaptersPerPage
      return props.chapters.slice(startIndex, endIndex)
    })

    const totalPages = computed(() => {
      return Math.ceil(props.chapters.length / chaptersPerPage)
    })

    const groupedChaptersForDisplay = computed(() => {
      const t = new Map<string, Chapter[]>()

      filteredChapters.value.forEach((chapter) => {
        const volumeKey = chapter.volume || 'noVolume'
        if (!t.has(volumeKey)) {
          t.set(volumeKey, [])
        }
        t.get(volumeKey)!.push(chapter)
      })

      return Array.from(t)
    })

    const middlePages = computed(() => {
      const totalPagesValue = totalPages.value
      const currentPageValue = currentPage.value

      if (totalPagesValue <= 7) {
        return Array.from({ length: totalPagesValue - 2 }, (_, i) => i + 2)
      }

      if (currentPageValue < 5) {
        return [2, 3, 4, 5]
      }

      if (currentPageValue > totalPagesValue - 4) {
        return [totalPagesValue - 4, totalPagesValue - 3, totalPagesValue - 2, totalPagesValue - 1]
      }

      return [currentPageValue - 1, currentPageValue, currentPageValue + 1]
    })

    const showStartEllipsis = computed(() => {
      return totalPages.value > 7 && currentPage.value >= 5
    })

    const showEndEllipsis = computed(() => {
      return totalPages.value > 7 && currentPage.value < totalPages.value - 3
    })

    watch(
      () => props.chapters,
      () => {
        currentPage.value = 1
      },
      { deep: true },
    )

    const setPage = (page: number) => {
      const pageNum = Number(page)
      const totalPagesValue = totalPages.value

      if (isNaN(pageNum)) return

      let validPage = pageNum
      if (validPage < 1) validPage = 1
      if (validPage > totalPagesValue) validPage = totalPagesValue

      currentPage.value = validPage
      hidePageInput()
    }

    const togglePageInput = () => {
      showPageInput.value = !showPageInput.value

      if (showPageInput.value) {
        pageInputValue.value = ''
        nextTick(() => {
          if (pageInput.value) {
            pageInput.value.focus()
          }
        })
      }
    }

    const hidePageInput = () => {
      showPageInput.value = false
    }

    const goToInputPage = () => {
      const pageNum = parseInt(pageInputValue.value, 10)

      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages.value) {
        setPage(pageNum)
      }
    }

    const formatTime = (timestamp: string): string => {
      const now = new Date()
      const date = new Date(timestamp)

      if (
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate()
      ) {
        return 'Hôm nay'
      }

      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Hôm nay'
      if (diffDays === 1) return 'Hôm qua'
      if (diffDays < 30) return `${diffDays} ngày trước`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
      return `${Math.floor(diffDays / 365)} năm trước`
    }

    const handleChapterClick = (chapterId: string) => {
      router.push(`/read/${chapterId}`)
    }

    const navigateToTeam = (teamId: string) => {
      router.push(`/group/${teamId}`)
    }

    return {
      formatTime,
      handleChapterClick,
      navigateToTeam,
      isDarkMode,
      chaptersContainer,
      filteredChapters,
      groupedChaptersForDisplay,
      totalPages,
      middlePages,
      showStartEllipsis,
      showEndEllipsis,
      currentPage,
      setPage,
      showPageInput,
      pageInputValue,
      pageInput,
      togglePageInput,
      hidePageInput,
      goToInputPage,
    }
  },
})
</script>

<style scoped>
.chapters-wrapper {
  margin-top: 1.5rem;
  border-radius: 12px;
  /* border: 1px solid #e5e7eb; */
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.chapters-container {
  background: white;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chapters-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  background: #f9fafb;
  gap: 1rem;
}

.chapters-content {
  padding: 1rem;
}

.no-chapters-message {
  text-align: center;
  padding: 1rem;
  color: #333;
}

.dark-mode .no-chapters-message {
  color: #a6b0c4;
}

.volume-section {
  margin-bottom: 2rem;
}

.volume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.chapter-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f3f4f6;
}

.chapter-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chapter-title {
  font-weight: 500;
}

.chapter-metadata {
  display: flex;
  /* gap: 1.5rem; */
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.scanlation_group,
.upload-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-flag {
  display: flex;
  align-items: center;
  width: 1.2rem;
}

.flag_icon {
  width: 100%;
  height: auto;
}

.team-link {
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.team-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}

.page-button {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.page-button:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ellipsis-container {
  position: relative;
}

.page-button.ellipsis {
  font-weight: bold;
}

.page-input-container {
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.page-input {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 500;
  background: white;
}

.page-input::-webkit-outer-spin-button,
.page-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.page-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.page-input.dark-mode {
  background: #2d3748;
  color: white;
  border-color: #4a5568;
}

.chapters-container.dark-mode {
  background: #1a202c;
  color: white;
}

.chapters-container.dark-mode .chapters-header {
  background: #2d3748;
  border-color: #4a5568;
}

.volume-header.dark-mode {
  background: #2d3748;
}

.chapter-item.dark-mode {
  border-color: #2d3748;
}

.chapter-item.dark-mode:hover {
  background: #2d3748;
}

.chapter-metadata.dark-mode {
  color: #9ca3af;
}

.dark-mode .team-link {
  color: #60a5fa;
}

.dark-mode .team-link:hover {
  color: #93c5fd;
}

.page-button.dark-mode {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

.page-button.dark-mode:hover:not(:disabled) {
  background: #4a5568;
}

.page-button.dark-mode.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.page-input.dark-mode,
.page-input-container.dark-mode {
  background: #2d3748;
  color: white;
  border-color: #4a5568;
}

@media (prefers-color-scheme: dark) {
  .chapters-container {
    background: #1a202c;
    color: white;
  }

  .chapters-header {
    background: #2d3748;
    border-color: #4a5568;
  }

  .volume-header {
    background: #2d3748;
  }

  .chapter-item {
    border-color: #2d3748;
  }

  .chapter-item:hover {
    background: #2d3748;
  }

  .chapter-metadata {
    color: #9ca3af;
  }

  .team-link {
    color: #60a5fa;
  }

  .team-link:hover {
    color: #93c5fd;
  }

  .page-button {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .page-button:hover:not(:disabled) {
    background: #4a5568;
  }

  .page-button.active {
    background: #4299e1;
    color: white;
    border-color: #4299e1;
  }
}

@media (max-width: 675px) {
  .flag_icon {
    width: 19.19px;
    height: 19.19px;
  }

  .chapter-metadata {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .page-input-container {
    top: auto;
    bottom: 3rem;
  }
}
</style>
