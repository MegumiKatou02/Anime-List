<template>
  <div
    class="rating-distribution"
    v-if="statistics && statistics.rating"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="rating-header">
      <span class="rating-title">Đánh giá</span>
      <div class="rating-stats">
        <div class="rating-score">{{ formatRating(statistics.rating.bayesian) }}</div>
        <div class="rating-star">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-star"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
        </div>
      </div>
    </div>
    <div class="rating-bars">
      <div v-for="i in 10" :key="i" class="rating-bar-row">
        <div class="rating-label">{{ 11 - i }}</div>
        <div class="rating-bar-container">
          <div class="rating-bar" :style="{ width: calculateBarWidth(11 - i) + '%' }"></div>
        </div>
        <div class="rating-count">{{ formatCount(getRatingCount(11 - i)) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isDarkMode } from '@/utils/settings'

export default defineComponent({
  name: 'RatingDistribution',
  props: {
    statistics: {
      type: Object as () => {
        rating?: {
          distribution?: Record<string, number>
          bayesian?: number
        }
      },
      required: true,
    },
  },
  setup(props) {
    const formatRating = (rating: number | null) => {
      return rating ? rating.toFixed(2) : '0.00'
    }

    const formatCount = (count: number) => {
      return count.toLocaleString()
    }

    const getRatingCount = (score: number) => {
      return props.statistics.rating?.distribution?.[score.toString()] || 0
    }

    const calculateBarWidth = (score: number) => {
      const distribution = props.statistics.rating?.distribution
      if (!distribution) return 0

      const count = getRatingCount(score)
      const maxCount = Math.max(...Object.values(distribution), 1)

      return (count / maxCount) * 100
    }

    return {
      formatRating,
      formatCount,
      getRatingCount,
      calculateBarWidth,
      isDarkMode,
    }
  },
})
</script>

<style scoped>
.rating-distribution {
  width: 100%;
  background-color: #f9fafc;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.rating-distribution.dark-mode {
  background-color: #2e3748;
}

.rating-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #ff6740;
}

.rating-title {
  font-size: 17px;
  color: black;
}

.dark-mode .rating-title {
  color: white;
}

.rating-stats {
  display: flex;
  align-items: center;
}

.rating-score {
  font-size: 20px;
  font-weight: bold;
  margin-right: 8px;
}

.rating-star svg {
  width: 20px;
  height: 20px;
  color: #ff6740;
  transform: translateY(3px);
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  height: 20px;
}

.rating-label {
  width: 24px;
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: black;
  font-weight: 500;
}

.rating-bar-container {
  flex-grow: 1;
  height: 8px;
  background-color: rgb(231, 231, 231);
  border-radius: 4px;
  overflow: hidden;
  margin-right: 8px;
}

.dark-mode .rating-bar-container {
  background-color: rgb(172, 169, 169);
}

.rating-bar {
  height: 100%;
  background-color: #ff6740;
  border-radius: 4px;
}

.rating-count {
  width: 50px;
  font-size: 14px;
  text-align: right;
  color: black;
  font-weight: 500;
}

.dark-mode .rating-count,
.dark-mode .rating-label {
  color: white;
}
</style>
