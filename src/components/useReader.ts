import { ref, onMounted, onUnmounted } from 'vue'

export function useReader() {
  const hideUI = ref(false)
  const uiHideTimeout = ref<number | null>(null)

  const handleMouseMove = () => {
    hideUI.value = false
    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }
    uiHideTimeout.value = window.setTimeout(() => {
      hideUI.value = true
    }, 3000)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
      e.preventDefault()
    }

    return e.key
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('keydown', handleKeyPress)
    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }
  })

  return {
    hideUI,
    handleKeyPress,
  }
}
