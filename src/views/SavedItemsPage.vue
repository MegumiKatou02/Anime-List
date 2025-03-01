<template>
  <div class="saved-content">
    <div class="saved-header">
      <h1>Danh sách đã lưu</h1>
      <div class="filter-options">
        <button
          @click="activeFilter = 'all'"
          :class="['filter-btn', activeFilter === 'all' ? 'active' : '']"
        >
          Tất cả
        </button>
        <button
          @click="activeFilter = 'anime'"
          :class="['filter-btn', activeFilter === 'anime' ? 'active' : '']"
        >
          Anime
        </button>
        <button
          @click="activeFilter = 'manga'"
          :class="['filter-btn', activeFilter === 'manga' ? 'active' : '']"
        >
          Manga
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading" :class="{ 'dark-mode': isDarkMode }">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="savedItems.length === 0" class="empty-state">
      <i class="fas fa-bookmark"></i>
      <p>Bạn chưa lưu anime/manga nào</p>
      <router-link to="/" class="browse-link">Khám phá ngay</router-link>
    </div>

    <div v-else class="saved-items">
      <div v-for="item in filteredItems" :key="item.id" class="saved-item">
        <div class="item-info">
          <span class="item-type" :class="item.type">{{ item.type }}</span>
          <h3 class="item-name">{{ item.name }}</h3>
        </div>
        <div class="item-actions">
          <a :href="item.link" target="_blank" class="action-btn view-btn">
            <svg
              class="icon outbound"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              width="15"
              height="15"
              data-v-b8818f8c=""
            >
              <path
                fill="currentColor"
                d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
              ></path>
              <polygon
                fill="currentColor"
                points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
              ></polygon>
            </svg>
          </a>
          <button @click="removeItem(item.id)" class="action-btn remove-btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, onMounted } from 'vue'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/configs/firebase'
import { getDiscordUser, refreshToken } from '@/services/discordApi'
import type { User } from '@/types/discord'
import { isDarkMode } from '@/utils/settings'

interface Item {
  id: string
  link: string
  name: string
  type: string
}

export default defineComponent({
  name: 'SavedItemsPage',
  setup() {
    const savedItems = ref<Item[]>([])
    const loading = ref(true)
    const activeFilter = ref('all')

    const filteredItems = computed(() => {
      if (activeFilter.value === 'all') {
        return savedItems.value
      }
      return savedItems.value.filter((item) => item.type === activeFilter.value)
    })

    const fetchSavedItems = async () => {
      loading.value = true
      let token = localStorage.getItem('discord_token') || ''
      const tokenExpiry = parseInt(localStorage.getItem('token_expiry') || '0')
      if (!token || Date.now() >= tokenExpiry) {
        token = await refreshToken()
      }
      const user: User = await getDiscordUser(token)

      if (!user) {
        loading.value = false
        return
      }

      try {
        const animeMangaCollectionRef = collection(db, 'users', user.id, 'anime_manga')

        const querySnapshot = await getDocs(animeMangaCollectionRef)
        const items: Item[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()

          const item: Item = {
            id: doc.id,
            link: typeof data.link === 'string' ? data.link : '',
            name: typeof data.name === 'string' ? data.name : 'Unknown',
            type: typeof data.type === 'string' ? data.type : 'Unknown',
          }

          items.push(item)
        })

        console.log(items)

        savedItems.value = items
      } catch (error) {
        console.error('Error fetching saved items:', error)
      } finally {
        loading.value = false
      }
    }

    const removeItem = async (itemId: string) => {
      let token = localStorage.getItem('discord_token') || ''
      const tokenExpiry = parseInt(localStorage.getItem('token_expiry') || '0')
      if (!token || Date.now() >= tokenExpiry) {
        token = await refreshToken()
      }
      const user: User = await getDiscordUser(token)

      if (!user) return

      try {
        const itemDocRef = doc(db, 'users', user.id, 'anime_manga', itemId)

        await deleteDoc(itemDocRef)

        savedItems.value = savedItems.value.filter((item) => item.id !== itemId)
      } catch (error) {
        console.error('Error removing item:', error)
      }
    }

    onMounted(() => {
      fetchSavedItems()
    })

    return {
      savedItems,
      loading,
      activeFilter,
      filteredItems,
      removeItem,
      isDarkMode,
    }
  },
})
</script>

<style scoped>
.saved-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.saved-header h1 {
  font-size: 1.8rem;
  color: white;
  margin: 0;
}

.filter-options {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #a1a5b7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.filter-btn.active {
  background: #5865f2;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #a1a5b7;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #5865f2;
}

.browse-link {
  margin-top: 1rem;
  display: inline-block;
  background: #5865f2;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.browse-link:hover {
  background: #4752c4;
  transform: translateY(-2px);
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

.dark-mode p {
  color: white;
}

.saved-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.saved-item {
  background: linear-gradient(145deg, #1a2234, #222c42);
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.saved-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px -5px rgba(0, 0, 0, 0.2);
}

.item-type {
  font-size: 0.7rem;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.item-type.anime {
  background: rgba(57, 174, 255, 0.2);
  color: #39aeff;
}

.item-type.manga {
  background: rgba(255, 107, 129, 0.2);
  color: #ff6b81;
}

.item-name {
  margin: 0;
  color: white;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  text-decoration: none;
}

.view-btn {
  background: rgba(88, 101, 242, 0.8);
}

.view-btn:hover {
  background: #5865f2;
}

.remove-btn {
  background: rgba(255, 69, 58, 0.2);
  color: #ff453a;
}

.remove-btn:hover {
  background: rgba(255, 69, 58, 0.4);
}

@media (max-width: 600px) {
  .saved-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .saved-items {
    grid-template-columns: 1fr;
  }
}
</style>
