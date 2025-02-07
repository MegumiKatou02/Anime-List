<template>
  <div class="media-switcher">
    <div class="tabs-wrapper">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="handleTabChange(tab.id)"
      >
        <span class="tab-icon">
          <svg v-if="tab.id === 'anime'" viewBox="0 0 24 24" class="icon">
            <path
              fill="currentColor"
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M7,10L12,15L17,10H7Z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="icon">
            <path
              fill="currentColor"
              d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7 7H9V9H7V7M7 11H9V13H7V11M7 15H9V17H7V15M17 17H11V15H17V17M17 13H11V11H17V13M17 9H11V7H17V9Z"
            />
          </svg>
        </span>
        {{ tab.label }}
      </button>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'MediaTypeSwitcher',
  emits: ['change'],
  setup(props, { emit }) {
    const tabs = [
      { id: 'anime', label: 'Anime' },
      { id: 'manga', label: 'Manga' },
    ]

    const activeTab = ref(localStorage.getItem('activeTab') || 'anime')

    const indicatorStyle = computed(() => ({
      transform: `translateX(${activeTab.value === 'anime' ? '0%' : '100%'})`,
    }))

    const handleTabChange = (tabId: string) => {
      activeTab.value = tabId
      emit('change', tabId)
      localStorage.setItem('activeTab', tabId)
    }

    return {
      tabs,
      activeTab,
      indicatorStyle,
      handleTabChange,
    }
  },
})
</script>

<style scoped>
.media-switcher {
  margin-bottom: 2rem;
}

.tabs-wrapper {
  display: flex;
  background: #ffffff;
  border-radius: 50px;
  padding: 0.5rem;
  position: relative;
  width: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.tab-button {
  position: relative;
  padding: 0.75rem 2rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
}

.tab-button.active {
  color: #fff;
}

.tab-icon {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
}

.tab-indicator {
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: calc(50% - 0.5rem);
  background: rgba(88, 122, 156, 0.9);
  border-radius: 25px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 480px) {
  .tab-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  .tabs-wrapper {
    padding: 0;
  }
}
</style>
