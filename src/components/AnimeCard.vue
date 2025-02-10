<template>
  <div
    class="anime-card dark:bg-gray-800 dark:border-gray-700"
    :class="{ 'dark-mode': isDarkMode }"
    @click="goToAnimeDetail"
  >
    <img :src="anime.main_picture.large" :alt="anime.title" class="anime-image" />
    <div class="anime-info" :class="{ 'dark-mode': isDarkMode }">
      <h3 class="anime-title dark:text-white">{{ anime.title }}</h3>
      <div class="anime-stats">
        <span class="dark:text-white">Rank: #{{ anime.rank }}</span>
        <span class="dark:text-white">Score: {{ anime.mean }}</span>
      </div>
      <p class="anime-synopsis dark:text-white">{{ truncatedSynopsis }}</p>
      <div class="anime-genres">
        <span
          v-for="genre in anime.genres"
          :key="genre.id"
          class="genre-tag dark:bg-gray-700 dark:text-white"
        >
          {{ genre.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'
import type { Anime } from '@/types/anime'
import { isDarkMode } from '@/utils/settings'

const router = useRouter()

const props = defineProps({
  anime: {
    type: Object as PropType<Anime>,
    required: true,
  },
})

const truncatedSynopsis = computed(() => {
  return props.anime.synopsis?.length > 150
    ? `${props.anime.synopsis.substring(0, 150)}...`
    : props.anime.synopsis
})

const goToAnimeDetail = () => {
  router.push({
    name: 'anime-detail',
    params: { id: props.anime.id },
  })
}
</script>

<style scoped>
.anime-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.anime-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.anime-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.anime-info {
  padding: 1rem;
}

.anime-stats {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  color: #666;
}

.anime-synopsis {
  font-size: 0.9rem;
  color: #444;
  margin: 0.5rem 0;
}

.anime-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.anime-card.dark-mode {
  /* background-color: #1a202c; */
  border-color: #2d3748;
  background-color: white;
}

.dark-mode .anime-title {
  color: #2d3748;
}

.dark-mode .anime-stats {
  color: #2d3748;
}

.dark-mode .anime-synopsis {
  color: #2d3748;
}

@media (prefers-color-scheme: dark) {
  .anime-card {
    background: #1a202c;
    border-color: #2d3748;
  }

  .anime-title {
    color: #2d3748;
  }

  .anime-stats {
    color: #2d3748;
  }

  .anime-synopsis {
    color: #2d3748;
  }

  .genre-tag {
    background: #2d3748;
    color: #fff;
  }
}
</style>
