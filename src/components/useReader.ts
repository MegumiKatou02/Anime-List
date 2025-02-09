import { ref, onMounted, onUnmounted } from 'vue'

export function useReader() {
  const hideUI = ref(false)
  const hideHeader = ref(true)
  const hideFooter = ref(true)
  const uiHideTimeout = ref<number | null>(null)
  const lastScrollY = ref(0)

  const handleMouseMove = (e: MouseEvent) => {
    const mouseY = e.clientY
    // const screenHeight = window.innerHeight

    hideHeader.value = mouseY > 60

    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }

    uiHideTimeout.value = window.setTimeout(() => {
      hideHeader.value = true
      hideFooter.value = true
    }, 3000)
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    hideFooter.value = currentScrollY > lastScrollY.value

    lastScrollY.value = currentScrollY

    if (uiHideTimeout.value) {
      window.clearTimeout(uiHideTimeout.value)
    }

    uiHideTimeout.value = window.setTimeout(() => {
      hideHeader.value = true
      hideFooter.value = true
    }, 3000)
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
