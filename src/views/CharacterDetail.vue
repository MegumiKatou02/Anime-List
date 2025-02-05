<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Đang tải thông tin nhân vật...</p>
  </div>

  <div v-else-if="error" class="error">
    {{ error }}
  </div>

  <div v-else-if="character" class="character-detail-container dark:bg-gray-800">
    <div class="character-header">
      <img :src="character.images.webp.image_url" :alt="character.name" class="character-poster" />
      <div class="character-header-info">
        <h1 class="dark:text-white">{{ character.name }}</h1>
        <h2 class="dark:text-gray-300">{{ character.name_kanji }}</h2>

        <div class="character-meta">
          <div class="meta-item dark:bg-gray-700 dark:text-white">
            <strong>Nickname:</strong> {{ character.nicknames[0] || 'Unknown' }}
          </div>
          <div class="meta-item dark:bg-gray-700 dark:text-white">
            <strong>Favorites:</strong> {{ character.favorites }}
          </div>
        </div>
      </div>
    </div>

    <div class="character-about">
      <h2 class="dark:text-white" style="margin-bottom: 1rem">About</h2>
      <p class="dark:text-gray-300 character-about-text">
        {{ character.about || 'No description available' }}
      </p>
    </div>

    <div class="anime-appearances">
      <h2 class="dark:text-white" style="margin-bottom: 1rem">Anime Appearances</h2>
      <div v-if="animeAppearances.length === 0" class="no-appearances dark:text-gray-300">
        No anime appearances found
      </div>
      <div v-else class="appearances-grid">
        <div
          v-for="anime in animeAppearances"
          :key="anime.anime.mal_id"
          class="anime-card dark:bg-gray-700"
          @click="goToAnimeDetail(anime.anime.mal_id)"
        >
          <img
            :src="anime.anime.images.webp.image_url"
            :alt="anime.anime.title"
            class="anime-image"
          />
          <div class="anime-info">
            <div class="anime-title dark:text-white">{{ anime.anime.title }}</div>
            <div class="anime-role dark:text-gray-300">{{ anime.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { CharacterJikan, AnimeJikan } from '@/types/anime'

const route = useRoute()
const router = useRouter()
const character = ref<CharacterJikan | null>(null)
const animeAppearances = ref<{ anime: AnimeJikan; role: string }[]>([])
const loading = ref(true)
const error = ref('')

const goToAnimeDetail = (anime_id: number) => {
  router.push({
    name: 'anime-detail',
    params: { id: anime_id },
  })
}

onMounted(async () => {
  window.scrollTo(0, 0)
  try {
    const characterId = route.params.id

    const characterResponse = await axios.get(`https://api.jikan.moe/v4/characters/${characterId}`)
    character.value = characterResponse.data.data

    const appearancesResponse = await axios.get(
      `https://api.jikan.moe/v4/characters/${characterId}/anime`,
    )
    animeAppearances.value = appearancesResponse.data.data
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Failed to load character details'
    } else {
      error.value = 'An unknown error occurred'
    }
    console.error('Error fetching character details:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.character-detail-container {
  max-width: 100%;
  width: 100%;
  padding: 2rem;
  background-color: #f4f4f4;
}

.character-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.character-poster {
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.appearances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.anime-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.anime-card:hover {
  transform: scale(1.05);
}

.character-about-text {
  white-space: pre-line;
}

.anime-image {
  width: 100%;
  height: 225px;
  object-fit: cover;
}

.anime-info {
  padding: 0.5rem;
  text-align: center;
}

.anime-title {
  font-weight: bold;
}

.anime-role {
  color: #666;
  font-size: 0.8rem;
}

@media (max-width: 630px) {
  .character-header {
    display: grid;
    grid-template-columns: 1fr;
  }

  .character-poster {
    max-width: 200px;
    margin-bottom: 1rem;
  }

  .appearances-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

.loading {
  text-align: center;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2d5996;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  .character-detail-container {
    background-color: #1a202c;
  }

  .anime-card {
    background-color: #2d3748;
  }

  .anime-title {
    color: #fff;
  }

  .anime-role {
    color: #cbd5e0;
  }

  .loading {
    color: #fff;
  }

  .spinner {
    border: 4px solid #4a5568;
    border-top: 4px solid #90cdf4;
  }
}
</style>
