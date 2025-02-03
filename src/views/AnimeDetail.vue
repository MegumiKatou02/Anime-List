<template>
  <div v-if="loading" class="loading">Loading anime details...</div>

  <div v-else-if="error" class="error">
    {{ error }}
  </div>

  <div v-else-if="anime" class="anime-detail-container">
    <div class="anime-header">
      <img :src="anime.images.webp.large_image_url" :alt="anime.title" class="anime-poster" />
      <div class="anime-header-info">
        <h1>{{ anime.title }}</h1>
        <h2>{{ anime.title_japanese }}</h2>

        <div class="anime-meta">
          <div class="meta-item"><strong>Status:</strong> {{ anime.status }}</div>
          <div class="meta-item"><strong>Type:</strong> {{ anime.type }}</div>
          <div class="meta-item"><strong>Episodes:</strong> {{ anime.episodes || 'Unknown' }}</div>
          <div class="meta-item"><strong>Score:</strong> {{ anime.score }} / 10</div>
        </div>

        <div class="anime-genres">
          <span v-for="genre in anime.genres" :key="genre.mal_id" class="genre-tag">
            {{ genre.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="anime-synopsis">
      <h3>Synopsis</h3>
      <p>{{ anime.synopsis }}</p>
    </div>

    <div class="characters-section">
      <h3>Main Characters</h3>
      <div v-if="loading" class="loading">Loading characters...</div>
      <div v-else-if="characters.length === 0" class="no-characters">
        No character information available
      </div>
      <div v-else class="characters-grid">
        <div
          v-for="character in characters"
          :key="character.character.mal_id"
          class="character-card"
        >
          <img
            :src="character.character.images.webp.image_url"
            :alt="character.character.name"
            class="character-image"
          />
          <div class="character-info">
            <div class="character-name">{{ character.character.name }}</div>
            <div class="character-role">
              {{ character.role }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { AnimeJikan, Character } from '@/types/anime'

const route = useRoute()
const anime = ref<AnimeJikan | null>(null)
const characters = ref<Character[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const animeId = route.params.id

    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`)
    anime.value = animeResponse.data.data

    const charactersResponse = await axios.get(
      `https://api.jikan.moe/v4/anime/${animeId}/characters`,
    )
    characters.value = charactersResponse.data.data.slice(0, 10)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Failed to load anime details'
    } else {
      error.value = 'An unknown error occurred'
    }
    console.error('Error fetching anime details:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.anime-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
}

.anime-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.anime-poster {
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.anime-header-info {
  flex: 1;
}

.anime-header-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.anime-header-info h2 {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.anime-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  background-color: #e9ecef;
  padding: 0.5rem;
  border-radius: 4px;
}

.anime-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.anime-synopsis {
  margin-bottom: 2rem;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.character-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.character-card:hover {
  transform: scale(1.05);
}

.character-image {
  width: 100%;
  height: 225px;
  object-fit: cover;
}

.character-info {
  padding: 0.5rem;
  text-align: center;
}

.character-name {
  font-weight: bold;
}

.character-role {
  color: #666;
  font-size: 0.8rem;
}

.loading,
.error,
.no-characters {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style>
