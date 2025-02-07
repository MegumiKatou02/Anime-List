<template>
  <div class="manga-detail-container" v-if="manga">
    <div class="manga-header">
      <div class="manga-cover">
        <img :src="manga.coverImage" :alt="manga.title" />
      </div>
      <div class="manga-info">
        <h1 class="manga-title">{{ manga.title }}</h1>
        <div class="manga-metadata">
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
            <span class="label">Số chapter:</span>
            <span>{{ totalChapters }}</span>
          </div>
        </div>
        <a
          :href="getMangaDexUrl(manga.mangaDexId)"
          target="_blank"
          rel="noopener noreferrer"
          class="read-on-mangadex"
        >
          Đọc trên MangaDex
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Manga } from '@/types/manga'
import { MangaService } from '@/services/mangaApi'

export default defineComponent({
  name: 'MangaDetail',
  setup() {
    const route = useRoute()
    const mangaService = new MangaService()
    const manga = ref<Manga | null>(null)
    const totalChapters = ref(0)

    const loadMangaData = async () => {
      try {
        const mangaId = route.params.id as string
        const mangaData = await mangaService.getMangaById(mangaId)
        manga.value = mangaData
        totalChapters.value = await mangaService.getMangaChapterCount(mangaId)
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

    const getMangaDexUrl = (mangaDexId: string) => {
      return `https://mangadex.org/title/${mangaDexId}`
    }

    onMounted(loadMangaData)

    return {
      manga,
      totalChapters,
      formatStatus,
      getMangaDexUrl,
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
  gap: 1rem;
  margin-bottom: 1rem;
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
  background: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.read-on-mangadex:hover {
  background: #1d4ed8;
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

@media (max-width: 768px) {
  .manga-header {
    grid-template-columns: 1fr;
  }

  .manga-cover {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
