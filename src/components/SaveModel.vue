<template>
  <button @click="isActive = true" class="button">Lưu {{ type }}</button>
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

    const saveAction = () => {
      emit('data')
    }

    const closeLogin = () => {
      isLogin.value = false
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
    }
  },
})
</script>
<style scoped>
.button {
  display: inline-block;
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
}

.button:hover {
  background: #4752c4;
}
</style>
