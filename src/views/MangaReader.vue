<template>
  <div class="reader-container" @keydown="handleKeyPress" tabindex="0">
    <div class="reader-header" :class="{ 'header-hidden': hideUI }">
      <div class="header-content">
        <button class="nav-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </button>
        <div class="chapter-info">
          <h1>{{ mangaTitle }}</h1>
          <!-- <p>Chapter {{ currentChapter?.number }}</p> -->
        </div>
        <div class="chapter-navigation">
          <button class="nav-button" @click="loadPreviousChapter" :disabled="!hasPreviousChapter">
            Previous Chapter
          </button>
          <button class="nav-button" @click="loadNextChapter" :disabled="!hasNextChapter">
            Next Chapter
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

    <!-- Bottom Navigation -->
    <div class="reader-footer" :class="{ 'footer-hidden': hideUI }">
      <div class="footer-content">
        <div class="reading-progress">Page {{ currentPage }} of {{ totalPages }}</div>
        <div class="reader-settings">
          <button @click="toggleReadingDirection" class="settings-button">
            {{ readingDirection === 'rtl' ? 'Right to Left' : 'Left to Right' }}
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
    const currentPage = ref(1)
    const mangaTitle = ref('')
    // const currentChapter = ref<any>(null)
    const readingDirection = ref('rtl')
    const { hideUI, handleKeyPress: handleKey } = useReader()
    const uiHideTimeout = ref<number | null>(null)
    const hasNextChapter = ref(false)
    const hasPreviousChapter = ref(false)

    const totalPages = ref(0)

    const loadChapter = async (chapterId: string) => {
      try {
        loading.value = true
        error.value = null

        const chapterData = await mangaService.getChapter(chapterId)
        // currentChapter.value = chapterData
        // console.log(currentChapter.value)
        mangaTitle.value = chapterData.mangaTitle || 'Manga'

        const chapterPages = await mangaService.getChapterPages(chapterId)
        // console.log(chapterPages)
        // pages.value = chapterPages
        pages.value = chapterPages.map((url, index) => ({
          url,
          index,
        }))
        totalPages.value = chapterPages.length
        pageLoaded.value = new Array(chapterPages.length).fill(false)

        // const adjacentChapters = await mangaService.getAdjacentChapters(
        //   chapterId,
        //   currentChapter.value,
        // )
        // hasNextChapter.value = !!adjacentChapters.next
        // hasPreviousChapter.value = !!adjacentChapters.previous

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

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = handleKey(e)

      switch (key) {
        case 'ArrowRight':
          if (readingDirection.value === 'ltr') {
            nextPage()
          } else {
            previousPage()
          }
          break
        case 'ArrowLeft':
          if (readingDirection.value === 'ltr') {
            previousPage()
          } else {
            nextPage()
          }
          break
        case ' ':
          nextPage()
          break
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      } else if (hasNextChapter.value) {
        loadNextChapter()
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      } else if (hasPreviousChapter.value) {
        loadPreviousChapter()
      }
    }

    const loadNextChapter = async () => {
      // const nextChapter = await mangaService.getAdjacentChapters(currentChapter.value.id)
      // if (nextChapter.next) {
      //   router.push(`/read/${nextChapter.next.id}`)
      // }
    }

    const loadPreviousChapter = async () => {
      // const prevChapter = await mangaService.getAdjacentChapters(currentChapter.value.id)
      // if (prevChapter.previous) {
      //   router.push(`/read/${prevChapter.previous.id}`)
      // }
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
      currentPage,
      totalPages,
      mangaTitle,
      // currentChapter,
      readingDirection,
      hideUI,
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

@media (max-width: 768px) {
  .chapter-navigation {
    display: none;
  }

  .chapter-info h1 {
    font-size: 1rem;
  }
}
</style>
