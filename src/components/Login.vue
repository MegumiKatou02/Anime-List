<template>
  <div class="login-overlay" @click="closeLogin">
    <div class="login-container" @click.stop>
      <div class="login-header">
        <i class="fab fa-discord"></i>
        <h2 v-if="isLogin">{{ name }}</h2>
        <h2 v-else>Đăng nhập với Discord</h2>
        <p v-if="isLogin" class="subtitle">{{ name }} đã kết nối tài khoản Discord</p>
        <p v-else class="subtitle">Kết nối tài khoản Discord của bạn để tiếp tục</p>
      </div>

      <div class="divider"></div>

      <div class="login-options">
        <button class="button saved-button">
          <span class="icon"><i class="fas fa-bookmark"></i></span>
          <span>Đã lưu</span>
        </button>
        <a v-if="!isLogin" :href="loginUrl" class="button login-button">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-svg">
              <path
                fill="currentColor"
                d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-7.5 177.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 72-96 0c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l96 0 0 72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"
              />
            </svg>
          </span>
          <span>Đăng nhập</span>
        </a>
        <a v-else @click="logOut" class="button login-button">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-svg">
              <path
                fill="currentColor"
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
              />
            </svg>
          </span>
          <span>Đăng xuất</span>
        </a>
      </div>

      <div class="privacy-notice">
        Bằng cách đăng nhập, bạn đồng ý với
        <router-link to="/terms" class="link" @click="closeLogin">điều khoản dịch vụ</router-link>
        của chúng tôi
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'LoginPage',
  setup(_, { emit }) {
    const router = useRouter()

    const closeLogin = () => {
      emit('close')
    }

    const logOut = () => {
      localStorage.removeItem('discord_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('discord_name')
      localStorage.removeItem('token_expiry')

      emit('close')
      router.go(0)
    }

    const name = ref('')
    const isLogin = ref(false)

    const loginUrl = computed(() => {
      const clientID = import.meta.env.VITE_DISCORD_CLIENT_ID
      const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI)

      return `https://discord.com/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectUri}&scope=identify`
    })

    onMounted(() => {
      const isToken = localStorage.getItem('discord_token')
      name.value = localStorage.getItem('discord_name') || ''
      if (isToken) {
        isLogin.value = true
      } else {
        isLogin.value = false
      }
    })

    return {
      closeLogin,
      loginUrl,
      isLogin,
      name,
      logOut,
    }
  },
})
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-container {
  background: linear-gradient(145deg, #1a2234, #222c42);
  border-radius: 12px;
  padding: 2rem;
  width: 350px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 5px 10px -5px rgba(0, 0, 0, 0.2);
  color: white;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.icon-svg {
  width: 1rem;
  height: 1rem;
}

.login-container:hover {
  transform: translateY(-5px);
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.fa-discord {
  font-size: 3rem;
  color: #5865f2;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 8px rgba(88, 101, 242, 0.6));
}

h2 {
  margin: 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.subtitle {
  color: #a1a5b7;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 1rem 0 1.5rem;
}

.login-options {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.button {
  flex: 1;
  background: rgba(88, 101, 242, 0.1);
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 0.5rem;
}

.saved-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.saved-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.login-button {
  background: #5865f2;
}

.login-button:hover {
  background: #4752c4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(88, 101, 242, 0.4);
}

.button:active {
  transform: translateY(1px);
}

.icon {
  display: flex;
  align-items: center;
}

.privacy-notice {
  text-align: center;
  font-size: 0.8rem;
  color: #6d7283;
  margin-top: 1rem;
}

.link {
  color: #5865f2;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #7289da;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    width: 90%;
    padding: 1.5rem;
  }

  .login-options {
    flex-direction: column;
  }
}
</style>
