import { ref, onMounted, onUnmounted } from 'vue'

export function useReader() {
  const hideUI = ref(false)
  const hideHeader = ref(true)
  const hideFooter = ref(true)
  const uiHideTimeout = ref<number | null>(null)
  const lastScrollY = ref(0)
  const isAtBottom = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    const mouseY = e.clientY
    hideHeader.value = mouseY > 60

    resetAutoHideTimer()
  }

  const resetAutoHideTimer = () => {
    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }

    uiHideTimeout.value = window.setTimeout(() => {
      hideHeader.value = true
      if (!isAtBottom.value) {
        hideFooter.value = true
      }
    }, 3000)
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    isAtBottom.value = windowHeight + currentScrollY >= documentHeight - 10

    if (isAtBottom.value) {
      hideFooter.value = false
    } else {
      hideFooter.value = currentScrollY > lastScrollY.value
    }

    lastScrollY.value = currentScrollY
    resetAutoHideTimer()
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault()
    }
    return e.key
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll)
    document.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('scroll', handleScroll)
    document.removeEventListener('keydown', handleKeyPress)
    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }
  })

  return {
    hideUI,
    hideHeader,
    hideFooter,
    handleKeyPress,
  }
}
