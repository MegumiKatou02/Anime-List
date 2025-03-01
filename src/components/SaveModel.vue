<template>
  <button
    @click="handleClick"
    class="button"
    :class="{ 'button-loading': isLoading }"
    :disabled="isLoading"
  >
    <span v-if="isLoading" class="spinner"></span>
    <span v-else>Lưu {{ type }}</span>
  </button>

  <Login v-if="isActive && !isLogin" @close="closeLogin" @click="isActive = false" />

  <div v-else-if="isActive">
    {{ saveAction() }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Login from './Login.vue'

export default defineComponent({
  name: 'SaveModel',
  components: {
    Login,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },

  emits: ['data'],
  setup(_, { emit }) {
    const isActive = ref(false)
    const isLogin = ref(false)
    const isLoading = ref(false)

    const handleClick = () => {
      isLoading.value = true
      isActive.value = true

      setTimeout(() => {
        isLoading.value = false
      }, 1500)
    }

    const saveAction = () => {
      emit('data')
    }

    const closeLogin = () => {
      isLogin.value = false
      isLoading.value = false
    }

    onMounted(() => {
      const token = localStorage.getItem('discord_token')
      if (token) {
        isLogin.value = true
      } else {
        isLogin.value = false
      }
    })

    return {
      isActive,
      saveAction,
      isLogin,
      closeLogin,
      isLoading,
      handleClick,
    }
  },
})
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #5865f2;
  color: white;
  font-size: 1rem;
  padding: 0.95rem 1.5rem;
  border-radius: 8px;
  border: none;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  min-width: 120px;
}

.button:hover {
  background: #4752c4;
}

.button:disabled {
  opacity: 0.8;
  cursor: default;
}

.button-loading {
  background: #4752c4;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
