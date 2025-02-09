<template>
  <div class="manga-detail-container" v-if="manga">
    <div class="manga-header">
      <div class="manga-cover">
        <img :src="manga.coverImage" :alt="manga.title" />
      </div>
      <div class="manga-info">
        <h1 class="manga-title">{{ manga.title }}</h1>
        <div class="manga-metadata" v-if="statistics">
          <div class="manga-statistics">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 max-sm:w-5 max-sm:h-5"
              style="color: #ff6740"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              ></path>
            </svg>
            <p style="color: #ff6740">{{ formatRating(statistics.rating.bayesian) }}</p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 max-sm:w-5 max-sm:h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              ></path>
            </svg>
            {{ statistics.follows.toLocaleString() }}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 max-sm:w-5 max-sm:h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              ></path>
            </svg>
            {{ statistics.comments?.repliesCount.toLocaleString() || 0 }}
          </div>

          <div v-if="manga.status" class="status" :class="manga.status.toLowerCase()">
            {{ formatStatus(manga.status) }}
          </div>
          <div v-else class="status">Status not available</div>
        </div>
        <div class="genres">
          <span v-for="genre in manga.genres" :key="genre" class="genre-tag">
            {{ genre }}
          </span>
        </div>
        <div class="description">{{ manga.description }}</div>
        <div class="additional-info">
          <div class="info-item">
            <span class="label">Tác giả:</span>
            <span>{{ manga.author }}</span>
          </div>
          <div class="info-item">
            <span class="label">Năm phát hành:</span>
            <span>{{ manga.releaseYear }}</span>
          </div>
          <div class="info-item">
            <span class="label">chapter mới nhất:</span>
            <span>{{ newChapters }}</span>
          </div>
        </div>
        <div class="actions">
          <a
            :href="getMangaDexUrl(manga.mangaDexId)"
            target="_blank"
            rel="noopener noreferrer"
            class="read-on-mangadex"
          >
            Đọc trên MangaDex
          </a>
          <ChapterModal :chapters="chapters" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Manga, Chapter } from '@/types/manga'
import { MangaService } from '@/services/mangaApi'
import ChapterModal from './ChapterModal.vue'

export default defineComponent({
  name: 'MangaDetail',
  components: {
    ChapterModal,
  },
  setup() {
    const route = useRoute()
    const mangaService = new MangaService()
    const manga = ref<Manga | null>(null)
    const newChapters = ref('oneshot')
    const statistics = ref()
    const chapters = ref<Chapter[]>([])

    const loadChapters = async () => {
      try {
        const mangaId = route.params.id as string
        const chaptersData = await mangaService.getMangaChapters(mangaId)
        chapters.value = chaptersData
      } catch (error) {
        console.error('Error loading chapters:', error)
      }
    }

    const cleanDescription = (text: string) => {
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')

      text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')

      text = text.replace(/[*_]/g, '')

      text = text.replace(/\s+/g, ' ')

      text = text
        .split('\n')
        .filter((line) => !line.trim().startsWith('-') && !line.trim().startsWith('Links:'))
        .join(' ')

      return text.trim()
    }

    const loadMangaData = async () => {
      try {
        const mangaId = route.params.id as string
        const mangaById = await mangaService.getMangaById(mangaId)
        const mangaData = mangaService.transformMangaDetail(mangaById)

        if (mangaData.description) {
          mangaData.description = cleanDescription(mangaData.description)
        }
        manga.value = mangaData

        statistics.value = await mangaService.getStatisticsManga(mangaId)

        if (mangaById.attributes.lastChapter === '') {
          newChapters.value = 'unknown'
        } else {
          newChapters.value = mangaById.attributes.lastChapter
        }
      } catch (error) {
        console.error('Error loading manga data:', error)
      }
    }

    const formatStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        ongoing: 'Đang tiến hành',
        completed: 'Hoàn thành',
        hiatus: 'Tạm ngưng',
        cancelled: 'Đã hủy',
      }
      return statusMap[status.toLowerCase()] || status
    }

    const formatRating = (rating: number) => rating.toFixed(2)

    const getMangaDexUrl = (mangaDexId: string) => {
      return `https://mangadex.org/title/${mangaDexId}`
    }

    onMounted(() => {
      loadMangaData()
      loadChapters()
    })

    return {
      manga,
      newChapters,
      formatStatus,
      getMangaDexUrl,
      formatRating,
      statistics,
      chapters,
    }
  },
})
</script>

<style scoped>
.manga-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.manga-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
}

.manga-cover img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.manga-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.manga-metadata {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.manga-statistics {
  gap: 0.5rem;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}

.manga-statistics svg,
.manga-statistics p {
  display: flex;
  align-items: center;
  margin: 0;
}

.manga-statistics > * {
  display: flex;
  align-items: center;
  gap: 4px;
}

.manga-statistics svg {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.w-6 {
  width: 1.5rem;
  height: 1.5rem;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #666;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 1.5rem;
}

.additional-info {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #666;
}

.read-on-mangadex {
  display: inline-block;
  background: #ff6740;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.read-on-mangadex:hover {
  background: #fa562d;
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.status.ongoing {
  background: #e3f2fd;
  color: #1976d2;
}

.status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.hiatus {
  background: #fff3e0;
  color: #f57c00;
}

.status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .manga-header {
    grid-template-columns: 1fr;
  }

  .manga-cover {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (prefers-color-scheme: dark) {
  .manga-detail-container {
    background-color: #1a202c;
  }

  .description,
  .label {
    color: #fff;
  }
}
</style>
