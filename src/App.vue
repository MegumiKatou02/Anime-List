<script lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, computed, defineComponent, ref, watchEffect } from 'vue'
import Setting from './components/Setting.vue'
import { isDarkMode } from './utils/settings'
import Login from './components/Login.vue'

export default defineComponent({
  components: {
    Setting,
    Login,
  },
  setup() {
    const route = useRoute()
    const isReaderPage = computed(() => route.path.startsWith('/read'))
    const isStatusPage = computed(() => {
      if (route.query.status && route.query.status === 'error') {
        return true
      }
      return false
    })

    const isOpenSetting = ref(false)
    const isOpenLogin = ref(false)
    const isViewPage = computed(
      () => route.path === '/' || route.path === '/error' || route.query.status === 'error',
    )

    const mainRef = ref<HTMLElement | null>(null)

    watchEffect(() => {
      if (mainRef.value) {
        if (isViewPage.value) {
          mainRef.value.style.marginTop = '-2rem'
        } else {
          mainRef.value.style.marginTop = ''
        }
      }
    })

    const closeSettings = () => {
      isOpenSetting.value = false
    }
    const closeLogin = () => {
      isOpenLogin.value = false
    }

    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
    }

    const directUrl = computed(() => {
      if (route.query.type) {
        return { path: '/home', query: { type: route.query.type } }
      }
      return '/home'
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isReaderPage,
      isStatusPage,
      isOpenSetting,
      isOpenLogin,
      closeSettings,
      closeLogin,
      isDarkMode,
      directUrl,
      isViewPage,
      mainRef,
    }
  },
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <header v-if="!isViewPage">
      <nav class="navbar" :class="{ 'reader-page': isReaderPage }">
        <router-link :to="directUrl">
          <div class="nav-brand">
            <img
              alt="Anime Search Logo"
              class="logo"
              src="@/assets/logo.jpg"
              width="50"
              height="50"
            />
            <h1 style="font-family: 'Playwrite IN', cursive">Anime List</h1>
          </div>
        </router-link>

        <div class="nav-links">
          <router-link :to="directUrl" class="nav-link">Trang chủ</router-link>
          <router-link to="/about" class="nav-link">Thông tin</router-link>
          <i class="fab fa-discord fa-2x" @click="isOpenLogin = !isOpenLogin"></i>
          <button class="icon-button" @click="isOpenSetting = !isOpenSetting">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
              <path
                d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <main ref="mainRef">
      <Login v-if="isOpenLogin" @close="closeLogin" />
      <Setting v-if="isOpenSetting" @close="closeSettings" />
      <RouterView />
    </main>

    <footer v-if="!isViewPage" :class="{ 'status-page': isStatusPage }">
      <div class="footer-content">
        <div class="footer-text">
          <p>Được hỗ trợ bởi</p>
          <div class="api-brand">
            <img src="@/assets/mal_logo.png" alt="MyAnimeList Logo" class="api-logo" />
            <span>MyAnimeList API</span>
            <img src="@/assets/mangadex_logo.png" alt="MyAnimeList Logo" class="api-logo" />
            <span>Mangadex API</span>
          </div>
        </div>
        <div class="footer-links">
          <a href="https://myanimelist.net/static/apiagreement.html" class="footer-link"
            >API License</a
          >
          <a
            href="https://myanimelist.net/static/pdf/about/privacy_policy_20230227.pdf"
            class="footer-link"
            >Chính sách bảo mật</a
          >
        </div>
      </div>
      <p class="copyright">&copy; 2025 Anime List. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
main {
  position: relative;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-container.dark-mode {
  background-color: #1a202c;
}

.navbar {
  background-color: rgba(44, 62, 80, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  transition: all 0.3s ease;
}

.navbar.reader-page {
  z-index: 0;
}

.status-page {
  display: none;
}

.navbar.scrolled {
  background-color: rgba(44, 62, 80, 0.5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 0.55rem 5%;
}

main {
  flex: 1;
  width: 100%;
  margin-top: 5rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: transform 0.2s ease;
}

.nav-brand:hover {
  transform: translateX(5px);
}

.nav-brand h1 {
  color: white;
  font-size: 1.8rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo {
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: rotate(15deg);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
}

.nav-link:hover::after {
  width: 80%;
  left: 10%;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-link.router-link-active::after {
  width: 100%;
  left: 0;
  background: #42b883;
}

.icon-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.icon-button:hover {
  color: #cccbcb;
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 2.3rem;
  height: 2.3rem;
  fill: currentColor;
}

.fa-discord {
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
}

.fa-discord:hover {
  color: #cccbcb;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 5%;
  }

  .nav-brand h1 {
    font-size: 1.4rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 385px) {
  .fa-discord {
    display: none;
  }
}

@media (max-width: 570px) {
  .nav-brand h1 {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 0.8rem;
  }
}

footer {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  color: white;
  padding: 2rem 5%;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.api-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: transform 0.3s ease;
}

.api-brand:hover {
  transform: translateY(-2px);
}

.api-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  position: relative;
  transition: all 0.3s ease;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #42b883;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: white;
}

.footer-link:hover::after {
  width: 100%;
}

.copyright {
  text-align: center;
  padding-top: 1.5rem;
  margin: 1rem auto 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 1200px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    padding-bottom: 1rem;
  }

  .footer-text {
    flex-direction: column;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .copyright {
    font-size: 0.8rem;
  }
  .logo {
    width: 45px;
    height: 45px;
  }
}
</style>
