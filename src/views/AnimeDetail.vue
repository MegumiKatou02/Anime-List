<template>
  <div v-if="loading" class="loading" :class="{ 'dark-mode': isDarkMode }">
    <div class="spinner"></div>
    <p>Đang tải anime...</p>
  </div>

  <div v-else-if="error" class="error">
    {{ error }}
  </div>

  <div v-else-if="anime" class="anime-detail-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="anime-header">
      <img :src="anime.images.webp.large_image_url" :alt="anime.title" class="anime-poster" />
      <div class="anime-header-info">
        <h1 :class="{ 'dark-mode': isDarkMode }">{{ anime.title }}</h1>
        <h2 :class="{ 'dark-mode': isDarkMode }">
          {{ anime.title_japanese }}
        </h2>

        <div class="anime-meta" :class="{ 'dark-mode': isDarkMode }">
          <div class="meta-item" :class="statusClass">
            {{ anime.status }}
          </div>
          <div class="meta-item"><strong>Type:</strong> {{ anime.type }}</div>
          <div class="meta-item"><strong>Episodes:</strong> {{ anime.episodes || 'Không rõ' }}</div>
          <div class="meta-item"><strong>Rank:</strong> #{{ anime.rank }}</div>
          <div class="meta-item"><strong>Score:</strong> {{ anime.score }} / 10</div>
        </div>

        <div class="broadcast-info" :class="{ 'dark-mode': isDarkMode }">
          <div class="broadcast-item">
            <strong>Broadcast (Japan):</strong> {{ japanBroadcastTime }}
          </div>
          <div class="broadcast-item">
            <strong>Broadcast (Vietnam):</strong> {{ vietnamBroadcastTime }}
          </div>
        </div>

        <div class="type-info" :class="{ 'dark-mode': isDarkMode }">
          <div v-if="anime.type" class="type-item"><strong>Type:</strong> {{ anime.type }}</div>
          <div v-if="date.day && date.month && date.year" class="type-item">
            <strong>Start Date:</strong> {{ `${date.day}/${date.month}/${date.year}` }}
          </div>
        </div>

        <div class="anime-genres" style="margin-bottom: 2rem">
          <span v-for="genre in anime.genres" :key="genre.mal_id" class="genre-tag">
            {{ genre.name }}
          </span>
        </div>
        <SaveModel @data="sendData" :type="'Anime'" />
      </div>
    </div>

    <div class="anime-synopsis" :class="{ 'dark-mode': isDarkMode }">
      <h2>Synopsis</h2>
      <p>{{ anime.synopsis }}</p>
    </div>

    <div class="characters-section">
      <h2 :class="{ 'dark-mode': isDarkMode }">Main Characters</h2>
      <div v-if="loading">Loading characters...</div>
      <div v-else-if="characters.length === 0" class="no-characters">
        No character information available
      </div>
      <div v-else class="characters-grid">
        <div
          v-for="character in characters"
          :key="character.character.mal_id"
          class="character-card"
          :class="{ 'dark-mode': isDarkMode }"
          @click="navigateToCharacter(character.character.mal_id)"
        >
          <img
            :src="character.character.images.webp.image_url"
            :alt="character.character.name"
            class="character-image"
          />
          <div class="character-info" :class="{ 'dark-mode': isDarkMode }">
            <div class="character-name">{{ character.character.name }}</div>
            <div class="character-role">{{ character.role }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="characters-section related-section">
      <h2 :class="{ 'dark-mode': isDarkMode }">Related Anime</h2>
      <div v-if="loading">Loading characters...</div>
      <div v-else-if="relatedAnime.length === 0" class="no-characters">
        No character information available
      </div>
      <div v-else class="characters-grid">
        <div
          v-for="anime in relatedAnime"
          :key="anime.data.id"
          class="character-card"
          :class="{ 'dark-mode': isDarkMode }"
          @click="navigateToAnime(anime.data.id.toString())"
        >
          <img
            :src="anime.data.main_picture.medium"
            :alt="anime.data.title"
            class="character-image"
          />
          <div class="character-info" :class="{ 'dark-mode': isDarkMode }">
            <div class="character-name">{{ anime.data.title }}</div>
            <div class="character-role">{{ anime.relation_type_formatted }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="youtube-trailer">
      <h3 :class="{ 'dark-mode': isDarkMode }">Trailer</h3>
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
      <h3 v-else :class="{ 'dark-mode': isDarkMode }">Anime này không có trailer</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import moment from 'moment-timezone'
import type { Anime, AnimeJikan, Character } from '@/types/anime'
import { isDarkMode } from '@/utils/settings'
import SaveModel from '@/components/SaveModel.vue'
import type { User } from '@/types/discord'
import { checkToken, getDiscordUser, refreshToken } from '@/services/discordApi'
import { saveToFirestore } from '@/services/firestoreService'
import { AnimeService } from '@/services/animeApi'
import type { Date } from '@/types/date'

const route = useRoute()
const router = useRouter()
const anime = ref<AnimeJikan | null>(null)
const characters = ref<Character[]>([])
const loading = ref(true)
const error = ref('')
const animeService = new AnimeService()
const date = ref<Date>({ day: 1, month: 1, year: 100 })
const relatedAnime = ref<{ data: Anime; relation_type_formatted: string }[]>([])

const sendData = async () => {
  let token = localStorage.getItem('discord_token')
  if (!(await checkToken(token)) || !localStorage.getItem('token_expiry')) {
    // router.error
    router.push({
      path: '/error',
      query: { message: 'Không tìm thấy mã xác thực' },
    })
    return
  }

  const tokenExpiry = parseInt(localStorage.getItem('token_expiry') as string)
  if (!token || Date.now() >= tokenExpiry) {
    token = await refreshToken()
  }
  const user: User = await getDiscordUser(token)
  const title = anime.value?.title || 'Ukknown'
  const url = route.path
  const id = (anime.value?.mal_id || route.params.id) as string

  await saveToFirestore(user.id, 'anime', title, url, id)
}

const trailerVideoId = ref('XBNWo25izJ8')

const youtubeTrailerUrl = computed(() => `https://www.youtube.com/embed/${trailerVideoId.value}`)

const japanBroadcastTime = computed(() => {
  if (!anime.value?.broadcast.string || anime.value?.broadcast.string.toLowerCase() === 'unknown') {
    return 'Không rõ'
  }
  return anime.value?.broadcast.string
})

const vietnamBroadcastTime = computed(() => {
  if (!anime.value?.broadcast?.time || !anime.value?.broadcast?.day) return 'Không rõ'

  try {
    const timeParts = anime.value.broadcast.time.split(':')
    const hours = parseInt(timeParts[0])
    const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0

    const jstTime = moment()
      .tz('Asia/Tokyo')
      .day(anime.value.broadcast.day.substring(0, 3))
      .hour(hours)
      .minute(minutes)
      .second(0)

    const vnTime = jstTime.clone().tz('Asia/Ho_Chi_Minh')

    return `${vnTime.format('dddd')} at ${vnTime.format('HH:mm')} (UTC+7)`
  } catch (e) {
    console.error('Lỗi chuyển đổi thời gian:', e)
    return 'Unknown'
  }
})

const navigateToCharacter = (characterId: number) => {
  router.push({ name: 'CharacterDetail', params: { id: characterId } })
}

const navigateToAnime = async (animeId: string) => {
  router.push(`/anime/${animeId}`)
  loading.value = true
  await loadData(animeId)
}

const loadData = async (id = route.params.id) => {
  try {
    const animeId = id

    const animeResponse = await animeService.getAnimeDetail(animeId as string)
    const realatedAnimeRes = await animeService.getRelatedAnimeMyanimelist(animeId as string)
    relatedAnime.value = realatedAnimeRes

    anime.value = animeResponse.data

    const { day = null, month = null, year = null } = anime.value?.aired.prop.from ?? {}
    date.value = { day, month, year }

    document.title = anime.value?.title || 'Anime List'

    trailerVideoId.value = animeResponse.data.trailer.youtube_id

    const charactersResponse = await animeService.getAnimeCharacterDetail(animeId as string)

    characters.value = charactersResponse.data.slice(0, 12)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = 'Lỗi khi tải thông tin anime'
    } else {
      error.value = 'Lỗi không xác định'
    }
    console.error('Error fetching anime details:', err)
    router.push({
      path: '/error',
      query: {
        message: error.value,
      },
    })
  } finally {
    loading.value = false
  }
}

const statusClass = computed(() => {
  if (anime.value?.status === 'Currently Airing') {
    return 'current-airing'
  }
  if (anime.value?.status === 'Not yet aired') {
    return 'not-yet-aired'
  }
  if (anime.value?.status === 'Finished Airing') {
    return 'finish-airing'
  }
  return ''
})

onMounted(async () => {
  window.scrollTo(0, 0)
  await loadData()
})
</script>

<style scoped>
* {
  overflow: hidden;
}

h2 {
  margin-bottom: 1rem;
}

.anime-detail-container {
  max-width: 100%;
  width: 100%;
  /* margin: 0 auto; */
  padding: 2rem;
  background-color: #fff;
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

.anime-meta,
.broadcast-info,
.type-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.type-info {
  margin-bottom: 2rem;
}

.meta-item,
.broadcast-item,
.type-item {
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
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
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
  cursor: pointer;
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
  /* color: #1a365d; */
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

.anime-detail-container.dark-mode {
  background-color: #1a202c;
}

h1.dark-mode {
  color: white;
}

h2.dark-mode {
  color: #c4c4c4;
}

.dark-mode .meta-item:not(:first-child),
.dark-mode .broadcast-item,
.dark-mode .type-item {
  background-color: #2d3748;
  color: #fff;
}

.anime-synopsis.dark-mode {
  color: white;
}

.characters-section .dark-mode {
  color: white;
}

.related-section {
  margin-top: 3rem;
}

.character-card.dark-mode {
  background-color: #2d3748;
}

.dark-mode .character-name {
  color: #fff;
}

.dark-mode .character-role {
  color: #cbd5e0;
}

.loading.dark-mode {
  background-color: #1a202c;
}

.dark-mode p {
  color: white;
}

.dark-mode .spinner {
  border: 4px solid #4a5568;
  border-top: 4px solid #90cdf4;
}

h3.dark-mode {
  color: white;
}

.finish-airing {
  background: #e8f5e9;
  color: #2e7d32;
}

.current-airing {
  background: #e3f2fd;
  color: #1976d2;
}

.not-yet-aired {
  background: #fff3e0;
  color: #f57c00;
}

@media (max-width: 630px) {
  .anime-header {
    display: grid;
    grid-template-columns: 1fr;
  }

  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

@media (max-width: 867px) {
  .anime-poster {
    max-width: 300px;
    max-height: 410px;
    margin-bottom: 1rem;
  }
}

@media (prefers-color-scheme: dark) {
  .anime-detail-container {
    background-color: #1a202c;
  }

  .meta-item,
  .broadcast-item,
  .type-item {
    background-color: #2d3748;
    color: #fff;
  }

  .character-card {
    background-color: #2d3748;
  }

  .character-name {
    color: #fff;
  }

  .character-role {
    color: #cbd5e0;
  }

  .error,
  .no-characters {
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
