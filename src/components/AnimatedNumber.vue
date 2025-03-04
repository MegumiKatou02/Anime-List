<template>
  <span class="stat-number text-indigo-500">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface AnimatedNumberProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<AnimatedNumberProps>(), {
  duration: 2000,
  prefix: '',
  suffix: '',
})

const displayValue = ref(0)

onMounted(() => {
  let start = 0
  const increment = props.end / (props.duration / 50)

  const timer = setInterval(() => {
    start += Math.ceil(increment)
    if (start >= props.end) {
      start = props.end
      clearInterval(timer)
    }
    displayValue.value = start
  }, 50)

  return () => clearInterval(timer)
})
</script>
