<template>
  <div class="not-found">
    <img src="@/assets/404.png" class="error-image" alt="error image" style="width: 200px" />
    <h1>4 lẻ 4 nót phao</h1>
    <h2 class="a2">Trang không tồn tại</h2>
    <p>Đường dẫn bạn đang tìm kiếm không tồn tại.</p>
    <router-link to="/">Quay về trang chủ</router-link>
  </div>
</template>

<script lang="ts">
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
  margin-bottom: 2rem;
}

@media (max-width: 700px) {
  .a2 {
    font-size: 100;
  }
}
</style>
