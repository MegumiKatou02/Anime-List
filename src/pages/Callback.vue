<template>
  <div class="loading" :class="{ 'dark-mode': isDarkMode }">
    <div class="spinner"></div>
    <p>Đang tải...</p>
  </div>
</template>

<script lang="ts">
import { getAccessToken, getDiscordUser } from '@/services/discordApi'
import { createUserInFirestore } from '@/services/firestoreService'
import type { User } from '@/types/discord'
import { isDarkMode } from '@/utils/settings'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CallBack',

  async mounted() {
    const code = new URLSearchParams(window.location.search).get('code')
    const router = useRouter()

    if (!code) {
      // huỷ trong khi đang xác thực
      router.go(-2)
      return
    }

    try {
      const { access_token, refresh_token, expires_in } = await getAccessToken(code)

      localStorage.setItem('discord_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('token_expiry', (Date.now() + expires_in * 1000).toString())

      const user: User = await getDiscordUser(access_token)

      localStorage.setItem('discord_name', user.global_name)

      await createUserInFirestore(user)

      // -1: /callback -> -2
      this.$router.go(-2)
    } catch (error) {
      console.error('Error during login:', error)
    }
  },

  setup() {
    return {
      isDarkMode,
    }
  },
})
</script>

<style scoped>
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

.dark-mode .spinner {
  border: 4px solid #4a5568;
  border-top: 4px solid #90cdf4;
}
</style>
