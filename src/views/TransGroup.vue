<template>
  <div class="team-page-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="team-banner" :style="{ backgroundImage: team.banner ? `url(${team.banner})` : '' }">
      <div class="overlay"></div>
    </div>

    <div class="team-profile-section">
      <div class="team-header">
        <div class="team-logo-container">
          <img :src="team.logo" alt="Team logo" class="team-logo" @error="handleImageError" />
        </div>
        <div class="team-title-section">
          <h1 class="team-name">{{ team.name }}</h1>
          <div class="team-stats">
            <div class="stat-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>{{ team.projects }} dự án</span>
            </div>
            <div class="stat-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{{ team.members }} thành viên</span>
            </div>
          </div>
          <div class="team-actions">
            <a :href="navigaFollow" target="_blank" class="follow-button">
              <svg
                data-v-9ba4cb7e=""
                data-v-6495c397=""
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                class="icon mr-4"
                style="color: currentcolor"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                ></path>
              </svg>
              Theo dõi
            </a>
            <a v-if="team.website" :href="team.website" target="_blank" class="website-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                ></path>
              </svg>
              Website
            </a>
            <a v-if="team.discord" :href="team.discord" target="_blank" class="discord-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 14.09 14.09 0 0 0 1.226-1.963.074.074 0 0 0-.04-.104 13.107 13.107 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"
                ></path>
              </svg>
              Discord
            </a>
          </div>
        </div>
      </div>

      <div class="team-description">
        <h2>Giới thiệu</h2>
        <p v-if="team.description">{{ team.description }}</p>
        <p v-else>{{ team.name }} chưa cập nhật thông tin giới thiệu.</p>
      </div>

      <div class="team-projects">
        <h2>Dự án gần đây</h2>
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dự án...</p>
        </div>
        <div v-else class="projects-grid">
          <div v-for="manga in displayMangaList" :key="manga.id">
            <MangaCard v-if="manga" :manga="manga" class="manga-card" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { isDarkMode } from '@/utils/settings'
import { MangaService } from '@/services/mangaApi'
import type { Manga } from '@/types/manga'
import MangaCard from '@/components/MangaCard.vue'

interface Project {
  id: string
  title: string
  cover: string
  type: string
  status: string
  summary: string
}

interface Team {
  id: string
  name: string
  logo: string
  banner: string
  description: string | null
  members: number
  projects: number
  website: string | null
  discord: string | null
}

export default defineComponent({
  components: {
    MangaCard,
  },
  setup() {
    const route = useRoute()
    const mangaService = new MangaService()
    const mangaList = ref<Manga[]>([])

    const displayMangaList = computed(() => {
      return mangaList.value
    })

    const teamId = computed(() => route.params.id as string)

    const team = ref<Team>({
      id: teamId.value,
      name: 'Đang tải',
      logo: '',
      banner: '',
      description: '',
      members: 0,
      projects: 0,
      website: '',
      discord: '',
    })

    const recentProjects = ref<Project[]>([])
    const isLoading = ref(true)

    const fetchTeamData = async () => {
      try {
        isLoading.value = true
        const scanlationGroup = await mangaService.getScanlationGroup(teamId.value)
        const scanlationManga: Manga[] = await mangaService.getScalationManga(teamId.value)

        const scanlationData = scanlationGroup.data
        mangaList.value = scanlationManga

        team.value = {
          id: teamId.value,
          name: scanlationGroup.data.attributes.name,
          logo: 'https://mangadex.org/img/avatar.png',
          banner: '/images/group-background.jpg',
          description: scanlationData.attributes.description,
          members: scanlationData.relationships.length,
          projects: scanlationManga.length >= 100 ? 100 : scanlationManga.length,
          website: scanlationData.attributes.website,
          discord: scanlationData.attributes.discord
            ? `https://discord.gg/${scanlationGroup.data.attributes.discord}`
            : null,
        }

        document.title = `Nhóm dịch ${team.value.name}`
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        isLoading.value = false
      }
    }

    const navigaFollow = computed(() => {
      return `https://mangadex.org/group/${teamId.value}`
    })
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement
      target.src = '/images/default-team-logo.png'
    }

    const handleCoverError = (event: Event) => {
      const target = event.target as HTMLImageElement
      target.src = '/images/default-cover.jpg'
    }

    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }

    onMounted(() => {
      fetchTeamData()
    })

    return {
      team,
      recentProjects,
      isLoading,
      handleImageError,
      handleCoverError,
      formatNumber,
      isDarkMode,
      mangaList,
      displayMangaList,
      navigaFollow,
    }
  },
})
</script>

<style scoped>
.team-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f9fafb;
  color: #1f2937;
}

.team-page-container.dark-mode {
  background-color: #111827;
  color: #f3f4f6;
}

.team-banner {
  height: 200px;
  width: 100%;
  /* background-color: #3b82f6; */
  background-size: cover;
  background-position: center;
  position: relative;
  filter: blur(3px);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
}

.team-profile-section {
  margin-top: -50px;
  padding: 0 20px;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.team-header {
  display: flex;
  margin-bottom: 30px;
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.dark-mode .team-header {
  background-color: #1e293b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.team-logo-container {
  margin-right: 20px;
  margin-top: -70px;
}

.team-logo {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dark-mode .team-logo {
  border-color: #1e293b;
}

.team-title-section {
  flex: 1;
}

.team-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.team-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.dark-mode .stat-item {
  color: #9ca3af;
}

.team-actions {
  display: flex;
  gap: 10px;
}

.follow-button,
.website-button,
.discord-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button {
  background-color: #ff6740;
  color: white;
  border: none;
}

.follow-button:hover {
  background-color: #f85329;
}

.website-button {
  background-color: #f3f4f6;
  color: #1f2937;
  text-decoration: none;
  border: 1px solid #e5e7eb;
}

.website-button:hover {
  background-color: #e5e7eb;
}

.discord-button {
  background-color: #5865f2;
  color: white;
  text-decoration: none;
  border: none;
}

.discord-button:hover {
  background-color: #4752c4;
}

.dark-mode .website-button {
  background-color: #374151;
  color: #f9fafb;
  border-color: #4b5563;
}

.dark-mode .website-button:hover {
  background-color: #4b5563;
}

.team-description {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.dark-mode .team-description {
  background-color: #1e293b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.team-description h2 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 15px;
  color: #111827;
}

.dark-mode .team-description h2 {
  color: #f9fafb;
}

.team-description p {
  margin: 0;
  line-height: 1.6;
  color: #4b5563;
}

.dark-mode .team-description p {
  color: #d1d5db;
}

.team-projects {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.dark-mode .team-projects {
  background-color: #1e293b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.team-projects h2 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
  color: #111827;
}

.dark-mode .team-projects h2 {
  color: #f9fafb;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.manga-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.dark-mode .loading-state {
  color: #9ca3af;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

.dark-mode .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .team-logo-container {
    margin-right: 0;
    margin-top: -90px;
    margin-bottom: 20px;
  }

  .team-stats {
    justify-content: center;
  }

  .team-actions {
    justify-content: center;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .team-profile-section {
    padding: 0 10px;
  }

  .team-stats {
    gap: 10px;
  }

  .stat-item {
    font-size: 12px;
  }

  .team-actions {
    flex-wrap: wrap;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
