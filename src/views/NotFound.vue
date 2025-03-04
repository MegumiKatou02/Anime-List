<template>
  <div class="not-found" :class="{ 'dark-mode': isDarkMode }">
    <img src="@/assets/404.png" class="error-image" alt="error image" style="width: 200px" />
    <h1>4 lẻ 4 nót phao</h1>
    <h2 class="a2">Trang không tồn tại</h2>
    <p>Đường dẫn bạn đang tìm kiếm không tồn tại.</p>
    <router-link to="/" class="btn">Quay về trang chủ</router-link>
  </div>
</template>

<script lang="ts">
import { isDarkMode } from '@/utils/settings'
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NotFound',
  setup() {
    const $router = useRouter()
    onMounted(() => {
      $router.push({
        query: {
          status: 'error',
        },
      })
    })

    return {
      isDarkMode,
    }
  },
})
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: large;
  flex-wrap: wrap;
}

.error-image {
  margin-top: 5rem;
  margin-bottom: 2rem;
}

.not-found.dark-mode {
  color: white;
}

.dark-mode a {
  color: white;
}

.btn {
  background-color: #1e40af;
  color: #fff;
  padding: 10px 20px;
  margin: 20px 10px 0px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3b82f6;
}

a {
  color: #1e40af;
}

@media (max-width: 700px) {
  .a2 {
    font-size: 100;
  }
}
</style>
