<template>
  <div class="home">
    <div class="search-container">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          @keyup.enter="handleSearch"
          placeholder="Tìm kiếm anime..."
          class="search-input"
        />
        <button class="search-button" @click="handleSearch">Tìm kiếm</button>
        <svg class="search-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải danh sách...</p>
    </div>

    <div v-else class="anime-grid">
      <AnimeCard v-for="anime in animeList" :key="anime.id" :anime="anime" class="anime-card" />
    </div>

    <div v-if="!loading && animeList.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
        />
      </svg>
      <h3>No results found</h3>
      <p>Try different keywords</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { AnimeService } from '@/services/animeApi'
import AnimeCard from '@/components/AnimeCard.vue'
import { debounce } from 'lodash'
import type { Anime } from '@/types/anime'

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
    const searchCache = new Map<string, Anime[]>()

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

    const handleSearch = async () => {
      if (!searchQuery.value.trim() || searchQuery.value.length < 3) {
        return
      }

      if (searchCache.has(searchQuery.value.trim())) {
        animeList.value = searchCache.get(searchQuery.value.trim())!
        return
      }

      try {
        loading.value = true
        animeList.value = await animeService.searchAnime(searchQuery.value)

        searchCache.set(searchQuery.value.trim(), animeList.value)
      } catch (error) {
        console.error('Error searching anime:', error)
      } finally {
        loading.value = false
      }
    }

    const debouncedSearch = debounce(handleSearch, 300)

    onMounted(loadTopAnime)

    return {
      animeList,
      loading,
      searchQuery,
      handleSearch: debouncedSearch,
    }
  },
})
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.search-container {
  max-width: 800px;
  margin: 0 auto 3rem;
  position: relative;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 4rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 6px 25px rgba(74, 144, 226, 0.2);
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: #666;
  transition: color 0.3s ease;
}

.search-input:focus + .search-icon {
  color: #4a90e2;
}

.search-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: rgba(88, 122, 156, 0.9);
  color: #fff;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: rgba(66, 93, 119, 0.9);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 3px 15px rgba(58, 130, 238, 0.4);
}

.search-button:active {
  transform: translateY(-50%) scale(0.98);
}

.search-button:focus {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(74, 144, 226, 0.3),
    0 3px 15px rgba(58, 130, 238, 0.4);
}

@media (max-width: 480px) {
  .search-button {
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    right: 0.5rem;
  }
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 1rem;
}

.anime-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  /* height: 450px; */
  width: 100%;
}

.anime-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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
  border-top: 4px solid #4a90e2;
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

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #444;
}

@media (max-width: 768px) {
  .home {
    padding: 1.5rem;
  }

  .search-input {
    padding-left: 3.5rem;
    font-size: 1rem;
  }

  .search-icon {
    left: 1rem;
    width: 20px;
    height: 20px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}
</style>
