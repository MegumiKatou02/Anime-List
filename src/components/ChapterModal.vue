<template>
  <div>
    <button @click="showModal = true" class="read-here-button">Đọc tại đây</button>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" :class="{ 'dark-mode': isDarkMode }" @click.stop>
        <div class="modal-header">
          <h2>Danh sách chương</h2>
          <button class="close-button" @click="showModal = false">&times;</button>
        </div>

        <div class="chapters-container">
          <div v-if="Object.keys(groupedChapters).length === 0">
            <p class="no-chapters-message">
              Không có chương nào. Hãy thử đổi ngôn ngữ trong phần tuỳ chỉnh và tải lại trang.
            </p>
          </div>
          <div
            v-for="(chapters, volumeKey) in groupedChapters"
            :key="volumeKey"
            class="volume-section"
          >
            <div
              class="volume-header"
              :class="{ 'dark-mode': isDarkMode }"
              @click="toggleVolume(volumeKey)"
            >
              <h3>{{ volumeKey === 'noVolume' ? 'No Volume' : `Volume ${volumeKey}` }}</h3>
              <span class="toggle-icon">{{ expandedVolumes[volumeKey] ? '▼' : '▶' }}</span>
            </div>

            <div v-if="expandedVolumes[volumeKey]" class="chapter-list">
              <div
                v-for="chapter in chapters"
                :key="chapter.id"
                class="chapter-item"
                :class="{ 'dark-mode': isDarkMode }"
                @click="handleChapterClick(chapter.id)"
              >
                <div class="chapter-info">
                  <div class="chapter-main">
                    <div class="language-flag">
                      <!-- {{ chapter.language === 'vi' ? '🇻🇳' : '🇬🇧' }} -->
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
                      {{ chapter.title }}
                    </span>
                  </div>
                  <div class="chapter-metadata" :class="{ 'dark-mode': isDarkMode }">
                    <div class="upload-time">
                      <svg
                        data-v-9ba4cb7e=""
                        data-v-c031ce93=""
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
                    <div class="scanlation_group">
                      <svg
                        data-v-9ba4cb7e=""
                        data-v-c1ca7027=""
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
                      <span class="scanlation">{{ chapter.scanlation_group }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Chapter } from '@/types/manga'
import { isDarkMode } from '@/utils/settings'

export default defineComponent({
  name: 'ChapterModal',
  props: {
    chapters: {
      type: Array as () => Chapter[],
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const showModal = ref(false)
    const expandedVolumes = ref<Record<string, boolean>>({})

    const groupedChapters = computed(() => {
      return props.chapters.reduce(
        (acc, chapter) => {
          const volumeKey = chapter.volume || 'noVolume'
          if (!acc[volumeKey]) {
            acc[volumeKey] = []
          }
          acc[volumeKey].push(chapter)
          return acc
        },
        {} as Record<string, Chapter[]>,
      )
    })

    const toggleVolume = (volumeKey: string) => {
      expandedVolumes.value[volumeKey] = !expandedVolumes.value[volumeKey]
    }

    const formatTime = (timestamp: string): string => {
      const now = new Date()
      const date = new Date(timestamp)
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 1) return 'Hôm nay'
      if (diffDays === 1) return 'Hôm qua'
      if (diffDays < 30) return `${diffDays} ngày trước`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
      return `${Math.floor(diffDays / 365)} năm trước`
    }

    const handleChapterClick = (chapterId: string) => {
      router.push(`/read/${chapterId}`)
      showModal.value = false
    }

    return {
      showModal,
      expandedVolumes,
      groupedChapters,
      toggleVolume,
      formatTime,
      handleChapterClick,
      isDarkMode,
    }
  },
})
</script>

<style scoped>
.read-here-button {
  display: inline-block;
  background: #00b10f;
  color: white;
  font-size: 1rem;
  padding: 0.95rem 1.5rem;
  border-radius: 8px;
  border: none;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.read-here-button:hover {
  background: #00880e;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.chapters-container {
  overflow-y: auto;
  padding: 1rem;
}

.no-chapters-message {
  display: flex;
  justify-content: center;
}

.volume-section {
  margin-bottom: 1rem;
}

.volume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-item {
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chapter-item:hover {
  background: #f3f4f6;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chapter-metadata {
  display: flex;
  gap: 1rem;
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
  gap: 0.75rem;
}

.language-flag {
  display: flex;
  align-items: center;
  width: 1.2rem;
}

.modal-content.dark-mode {
  background: #1a202c;
  color: white;
}

.volume-header.dark-mode {
  background: #2d3748;
}

.chapter-item.dark-mode:hover {
  background: #2d3748;
}

.chapter-metadata.dark-mode {
  color: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  .modal-content {
    background: #1a202c;
    color: white;
  }

  .volume-header {
    background: #2d3748;
  }

  .chapter-item:hover {
    background: #2d3748;
  }

  .chapter-metadata {
    color: #9ca3af;
  }
}

@media (max-width: 675px) {
  .flag_icon {
    width: 19.19px;
    height: 19.19px;
  }
}
</style>
