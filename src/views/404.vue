<template>
  <div class="error-overlay">
    <div class="error-container">
      <img src="@/assets/404_1.jpg" class="error-image" alt="404 image" />
      <div class="error-message">
        <span>ERROR:</span>
        {{ errorMessage }}
      </div>
      <div class="action-buttons">
        <router-link to="/" class="btn">Quay lại trang chủ</router-link>
        <a class="btn" @click="toggleConsoleGuide">Hướng dẫn báo lỗi</a>
      </div>
      <div v-if="showConsoleGuide" class="console-guide">
        <img src="@/assets/bug.png" class="console-guide-image" alt="Console guide" />
        <p>
          Mở console (F12), chụp màn hình và báo cáo cho mình tại
          <a
            :href="mainInformation.link.web.github_issues"
            target="_blank"
            rel="noopener noreferrer"
            >đây</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { mainInformation } from '@/configs/config'

export default defineComponent({
  name: 'ErrorPage',
  setup() {
    const route = useRoute()
    const errorMessage = computed(() => route.query.message || 'Đã xảy ra lỗi không xác định')
    const showConsoleGuide = ref(false)
    const toggleConsoleGuide = () => {
      showConsoleGuide.value = !showConsoleGuide.value
    }

    onMounted(() => {
      document.title = `Lỗi - ${errorMessage.value}`
    })

    return {
      errorMessage,
      showConsoleGuide,
      toggleConsoleGuide,
      mainInformation,
    }
  },
})
</script>

<style scoped>
.error-overlay {
  height: 100%;
  min-height: 105vh;
  background-color: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.error-container {
  text-align: center;
  padding: 20px;
}

.error-image {
  width: 14rem;
  border-radius: 10rem;
  margin-bottom: 20px;
}

.error-message {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 2rem;
}

span {
  color: red;
  font-weight: bold;
}

.action-buttons {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .action-buttons a {
    margin-bottom: 1rem;
  }
}

a {
  color: #1e40af;
}

.btn {
  background-color: #1e40af;
  color: #fff;
  padding: 10px 20px;
  margin: 0px 10px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3b82f6;
}

.console-guide {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  display: inline-block;
  text-align: left;
}

.console-guide-image {
  width: 100%;
  max-width: 300px;
  display: block;
  margin: 0 auto 10px;
}

.console-guide p {
  color: #333;
  font-size: 0.9rem;
  text-align: center;
}
</style>
