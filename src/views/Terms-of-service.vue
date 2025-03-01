<template>
  <div class="container">
    <h1 :class="{ 'dark-mode': isDarkMode }">
      Hiện tại website chưa có điều khoản dịch vụ :penguin:
    </h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { isDarkMode } from '@/utils/settings'
export default defineComponent({
  name: 'TermsOfService',
  setup() {
    return {
      isDarkMode,
    }
  },
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

h1.dark-mode {
  color: white;
}
</style>
