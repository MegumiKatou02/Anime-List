<template>
  <!-- <div v-if="loading" class="loading">Loading anime details...</div> -->
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Đang tải anime...</p>
  </div>

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
      <h2>Synopsis</h2>
      <p>{{ anime.synopsis }}</p>
    </div>

    <div class="characters-section">
      <h2>Main Characters</h2>
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

    <div class="youtube-trailer">
      <h3>Trailer</h3>
      <div v-if="trailerVideoId" class="video-container">
        <iframe
          width="560"
          height="315"
          :src="youtubeTrailerUrl"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <h3 v-else>Anime này không có trailer</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { AnimeJikan, Character } from '@/types/anime'

const route = useRoute()
const anime = ref<AnimeJikan | null>(null)
const characters = ref<Character[]>([])
const loading = ref(true)
const error = ref('')

const trailerVideoId = ref('XBNWo25izJ8')

const youtubeTrailerUrl = computed(() => `https://www.youtube.com/embed/${trailerVideoId.value}`)

onMounted(async () => {
  try {
    const animeId = route.params.id

    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`)
    anime.value = animeResponse.data.data
    console.log('what', animeResponse.data.data.trailer.youtube_id)
    trailerVideoId.value = animeResponse.data.data.trailer.youtube_id

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
h2 {
  margin-bottom: 1rem;
}

.anime-detail-container {
  max-width: 100%;
  /* margin: 0 auto; */
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

.error,
.no-characters {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
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

.youtube-trailer {
  margin: 2rem auto 0;
  max-width: 700px;
  min-width: 300px;
  text-align: center;
}

.youtube-trailer h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #1a365d;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 480px) {
  .anime-header {
    display: grid;
    grid-template-columns: 1fr;
  }

  .anime-poster {
    max-width: 200px;
    margin-bottom: 1rem;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}
</style>
