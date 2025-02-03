<template>
  <div class="home">
    <div class="search-container">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Search anime..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="anime-grid">
      <AnimeCard v-for="anime in animeList" :key="anime.id" :anime="anime" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { AnimeService } from '@/services/animeApi'
import AnimeCard from '@/components/AnimeCard.vue'
import type { Anime } from '@/types/anime'
import debounce from 'lodash/debounce'

export default defineComponent({
  name: 'HomePage',
  components: {
    AnimeCard,
  },
  setup() {
    const animeService = new AnimeService()
    const animeList = ref<Anime[]>([])
    const loading = ref(true)
    const searchQuery = ref('')

    const loadTopAnime = async () => {
      try {
        loading.value = true
        animeList.value = await animeService.getShuffledAnimeListFromAPI()
      } catch (error) {
        console.error('Error loading top anime:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSearch = debounce(async () => {
      if (!searchQuery.value) {
        await loadTopAnime()
        return
      }

      try {
        loading.value = true
        animeList.value = await animeService.searchAnime(searchQuery.value)
      } catch (error) {
        console.error('Error searching anime:', error)
      } finally {
        loading.value = false
      }
    }, 300)

    onMounted(loadTopAnime)

    return {
      animeList,
      loading,
      searchQuery,
      handleSearch,
    }
  },
})
</script>

<style scoped>
.home {
  padding: 2rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
}

.search-input:focus {
  border-color: #4a90e2;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 2rem;
}
</style>
