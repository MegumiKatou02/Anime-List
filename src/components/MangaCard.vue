<template>
  <div class="manga-card" @click="navigateToDetail">
    <div class="manga-cover">
      <img :src="manga.coverImage" :alt="manga.title" class="cover-image" />
      <div class="manga-rating" v-if="manga.rating">
        <svg viewBox="0 0 24 24" class="star-icon">
          <path
            fill="currentColor"
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          />
        </svg>
        {{ formatRating(manga.rating) }}
      </div>
    </div>
    <div class="manga-info">
      <h3 class="manga-title">{{ manga.title }}</h3>
      <div class="manga-genres">
        <span v-for="(genre, index) in limitedGenres" :key="index" class="genre-tag">
          {{ genre }}
        </span>
      </div>
      <div class="manga-status" :class="manga.status.toLowerCase()">
        {{ formatStatus(manga.status) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { Manga } from '@/types/manga'

export default defineComponent({
  name: 'MangaCard',
  props: {
    manga: {
      type: Object as PropType<Manga>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    const limitedGenres = computed(() => {
      return props.manga.genres.slice(0, 3)
    })

    const formatRating = (rating: number) => {
      return typeof rating === 'number' ? rating.toFixed(1) : 'N/A'
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

    const navigateToDetail = () => {
      router.push(`/manga/${props.manga.id}`)
    }

    return {
      limitedGenres,
      formatRating,
      formatStatus,
      navigateToDetail,
    }
  },
})
</script>

<style scoped>
.manga-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.manga-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.manga-cover {
  position: relative;
  padding-top: 140%;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.manga-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  width: 16px;
  height: 16px;
  color: #ffd700;
}

.manga-info {
  padding: 1rem;
}

.manga-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.manga-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #666;
}

.manga-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.manga-status.ongoing {
  background: #e3f2fd;
  color: #1976d2;
}

.manga-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.manga-status.hiatus {
  background: #fff3e0;
  color: #f57c00;
}

.manga-status.cancelled {
  background: #ffebee;
  color: #c62828;
}
</style>
