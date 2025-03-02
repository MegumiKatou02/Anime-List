<template>
  <div class="error-overlay">{{ errorMessage }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'ErrorPage',
  setup() {
    const route = useRoute()

    const errorMessage = computed(() => {
      return route.query.message || 'Đã xảy ra lỗi không xác định'
    })

    return {
      errorMessage,
    }
  },
})
</script>

<style scoped>
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
