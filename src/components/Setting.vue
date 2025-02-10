<template>
  <div class="setting-container">
    {{ console.log('xin chao') }}
    <h1>hifgfgfgfg</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SettingPage',
  setup() {
    return {}
  },
})
</script>

<style scoped>
.setting-container {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); */
  z-index: 50;
}
</style>
