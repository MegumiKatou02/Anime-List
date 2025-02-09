<template>
  <div class="reader-container" @keydown="handleKeyPress" tabindex="0">
    <div class="reader-header" :class="{ 'header-hidden': hideHeader }">
      <div class="header-content">
        <button class="nav-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </button>
        <div class="chapter-info">
          <h1>{{ mangaTitle }}</h1>
          <p>Chapter {{ currentChapter }}</p>
        </div>
        <div class="chapter-navigation">
          <button class="nav-button" @click="loadPreviousChapter" :disabled="!hasPreviousChapter">
            Chương trước
          </button>
          <button class="nav-button" @click="loadNextChapter" :disabled="!hasNextChapter">
            Chương tiếp
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading chapter...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="retryLoading" class="retry-button">Retry</button>
    </div>

    <div v-else class="reader-content" :class="{ 'hide-cursor': hideUI }">
      <div class="pages-container" :class="readingDirection">
        <div v-for="(page, index) in pages" :key="index" class="page-wrapper">
          <img
            :src="page.url"
            :alt="`Page ${index + 1}`"
            @load="handleImageLoad(index)"
            @error="handleImageError(index)"
            class="manga-page"
            :class="{ loading: !pageLoaded[index] }"
          />
          <div v-if="!pageLoaded[index]" class="page-loading">
            <div class="loading-spinner"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="reader-footer" :class="{ 'footer-hidden': hideFooter }">
      <div class="footer-content">
        <div class="footer-left">
          <button class="icon-button" @click="toggleChapterList">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
              <path
                d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
              />
            </svg>
          </button>
          <button class="icon-button" @click="loadPreviousChapter" :disabled="!hasPreviousChapter">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        </div>
        <div class="chapter-selector" @click="toggleChapterList">
          <span>Chương {{ currentChapter }}</span>
          <div v-if="showChapterList" class="chapter-dropdown" @click.stop>
            <div class="chapter-list">
              <button
                v-for="chapter in availableChapters"
                :key="chapter.id"
                class="chapter-item"
                :class="{ active: chapter.number === currentChapter }"
                @click="selectChapter(chapter.id)"
              >
                Chương {{ chapter.number }}
              </button>
            </div>
          </div>
        </div>
        <div class="footer-right">
          <button class="icon-button" @click="loadNextChapter" :disabled="!hasNextChapter">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
          <button class="icon-button" @click="toggleSettings">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MangaService } from '@/services/mangaApi'
import { useReader } from '@/components/useReader'

interface Page {
  url: string
  index: number
}

export default defineComponent({
  name: 'MangaReader',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const mangaService = new MangaService()

    const loading = ref(true)
    const error = ref<string | null>(null)
    const pages = ref<Page[]>([])
    const pageLoaded = ref<boolean[]>([])
    const mangaTitle = ref('')
    const currentChapter = ref<string>('1')
    const readingDirection = ref('ltr')
    const { hideUI, handleKeyPress: handleKey, hideHeader, hideFooter } = useReader()
    const uiHideTimeout = ref<number | null>(null)
    const hasNextChapter = ref(false)
    const hasPreviousChapter = ref(false)

    const adjacentChapters = ref<{
      next: string | null
      prev: string | null
    }>({ next: null, prev: null })

    const totalPages = ref(0)

    const showChapterList = ref(false)
    const showSettings = ref(false)
    const availableChapters = ref<{ id: string; number: string }[]>([])

    const toggleChapterList = () => {
      showChapterList.value = !showChapterList.value
      showSettings.value = false
    }

    const toggleSettings = () => {
      showSettings.value = !showSettings.value
      showChapterList.value = false
    }

    const selectChapter = (chapterId: string) => {
      showChapterList.value = false
      loadChapter(chapterId)
    }

    const loadChapter = async (chapterId: string) => {
      try {
        loading.value = true
        error.value = null

        const chapterData = await mangaService.getChapter(chapterId)
        currentChapter.value = chapterData.number
        mangaTitle.value = chapterData.mangaTitle || 'Manga'

        const chapterPages = await mangaService.getChapterPages(chapterId)
        pages.value = chapterPages.map((url, index) => ({
          url,
          index,
        }))
        totalPages.value = chapterPages.length
        pageLoaded.value = new Array(chapterPages.length).fill(false)

        const chapters = await mangaService.getChapterList(chapterId)
        availableChapters.value = chapters

        adjacentChapters.value.next = await mangaService.getNextChapters(chapterId)
        adjacentChapters.value.prev = await mangaService.getPreviousChapter(chapterId)

        hasNextChapter.value = !!adjacentChapters.value.next
        hasPreviousChapter.value = !!adjacentChapters.value.prev
        // console.log(hasNextChapter.value)

        loading.value = false
      } catch (err) {
        error.value = 'Failed to load chapter. Please try again.'
        console.error('Failed to load chapter. Please try again.', err)
        loading.value = false
      }
    }

    const handleImageLoad = (index: number) => {
      pageLoaded.value[index] = true
    }

    const handleImageError = (index: number) => {
      error.value = `Failed to load page ${index + 1}`
    }

    const handleKeyPress = async (e: KeyboardEvent) => {
      const key = handleKey(e)

      switch (key) {
        case 'ArrowRight':
          if (readingDirection.value === 'ltr') {
            loadNextChapter()
          } else {
            loadPreviousChapter()
          }
          break
        case 'ArrowLeft':
          if (readingDirection.value === 'ltr') {
            loadPreviousChapter()
          } else {
            loadNextChapter()
          }
          break
        case ' ':
          loadNextChapter()
          break
      }
    }

    const loadNextChapter = async () => {
      loadChapter(adjacentChapters.value.next || (route.params.id as string))
    }

    const loadPreviousChapter = async () => {
      loadChapter(adjacentChapters.value.prev || (route.params.id as string))
    }

    const toggleReadingDirection = () => {
      readingDirection.value = readingDirection.value === 'rtl' ? 'ltr' : 'rtl'
    }

    const goBack = () => {
      router.back()
    }

    const retryLoading = () => {
      loadChapter(route.params.id as string)
    }

    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadChapter(newId as string)
        }
      },
    )

    const handleMouseMove = () => {
      hideUI.value = false
      if (uiHideTimeout.value) {
        clearTimeout(uiHideTimeout.value)
      }
      uiHideTimeout.value = window.setTimeout(() => {
        hideUI.value = true
      }, 3000)
    }

    onMounted(() => {
      loadChapter(route.params.id as string)
      document.addEventListener('mousemove', handleMouseMove)
    })

    return {
      loading,
      error,
      pages,
      pageLoaded,
      totalPages,
      mangaTitle,
      readingDirection,
      hideUI,
      hideHeader,
      hideFooter,
      hasNextChapter,
      hasPreviousChapter,
      handleImageLoad,
      handleImageError,
      handleKeyPress,
      loadNextChapter,
      loadPreviousChapter,
      toggleReadingDirection,
      goBack,
      retryLoading,
      currentChapter,
      toggleChapterList,
      toggleSettings,
      selectChapter,
      availableChapters,
      showChapterList,
    }
  },
})
</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  position: relative;
  outline: none;
}

.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  transition: transform 0.3s ease;
}

.header-hidden {
  transform: translateY(-100%);
}

.header-content {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.chapter-info {
  text-align: center;
}

.chapter-info h1 {
  font-size: 1.2rem;
  margin: 0;
}

.chapter-navigation {
  display: flex;
  gap: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  background: #333;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reader-content {
  padding: 60px 0;
  min-height: calc(100vh - 120px);
  cursor: default;
}

.hide-cursor {
  cursor: none;
}

.pages-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.pages-container.rtl {
  direction: rtl;
}

.page-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.manga-page {
  width: 100%;
  height: auto;
  display: block;
}

.manga-page.loading {
  min-height: 400px;
  background: #333;
}

.page-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.reader-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  transition: transform 0.3s ease;
}

.footer-hidden {
  transform: translateY(100%);
}

.footer-content {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-state {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.error-state {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.settings-button {
  padding: 0.5rem 1rem;
  background: #333;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.footer-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chapter-selector {
  position: relative;
  text-align: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  /* width: 300px; */
  background-color: rgba(255, 255, 255, 0.1);
}

.chapter-selector:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chapter-dropdown {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chapter-list {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

.chapter-item {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
}

.chapter-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chapter-item.active {
  background: #3498db;
}

@media (max-width: 768px) {
  .chapter-navigation {
    display: none;
  }

  .chapter-info h1 {
    font-size: 1rem;
  }
}
</style>
