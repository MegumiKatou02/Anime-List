<template>
  <div class="about-container">
    <section class="about-hero">
      <div class="about-hero-content">
        <h1 class="about-hero-title">Thông tin <span class="text-accent">AnimeList</span></h1>
        <p class="about-hero-description">Website anime/manga đầu hàng Việt Nam</p>
        <router-link to="/" class="btn-primary">Trang chủ chính thức</router-link>
      </div>
    </section>

    <section class="about">
      <div class="about-content">
        <div class="about-image">
          <div class="slideshow-container">
            <div class="slideshow-images">
              <img src="@/assets/logo-large.jpg" alt="AnimeList Logo" class="slide-image active" />
              <img src="@/assets/logo-large2.jpg" alt="AnimeList Logo" class="slide-image" />
              <img src="@/assets/logo-large3.jpg" alt="AnimeList Logo" class="slide-image" />
              <img src="@/assets/logo-large4.jpg" alt="AnimeList Logo" class="slide-image" />
            </div>
          </div>
        </div>
        <div class="about-text">
          <h2 class="section-title">Tóm tắt trang web</h2>
          <p>
            Nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo
            nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo nghèo
          </p>
          <div class="about-stats">
            <div class="stat-item">
              <span class="stat-number"> <AnimatedNumber :end="100" suffix="+" />+ </span>
              <span class="stat-label">Tính năng (boc phet day)</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Hỗ trợ cộng đồng</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">∞</span>
              <span class="stat-label">Đam mê</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <WaifuShowcase />

    <section class="about-contribution">
      <h2 class="section-title">Đóng Góp Cộng Đồng</h2>
      <div class="contribution-content">
        <div class="contribution-text">
          <p>
            AnimeList là dự án mã nguồn mở. Mình hoan nghênh mọi đóng góp từ cộng đồng, cho dù bạn
            là lập trình viên, designer, hay chỉ đơn giản là một fan anime.
          </p>
          <a
            :href="mainInformation.link.web.github"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-contribute"
            >Đóng Góp Ngay</a
          >
        </div>
        <div class="contribution-image">
          <img src="@/assets/contribute.png" alt="Community Contribution" width="500px" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import WaifuShowcase from '@/components/WaifuShowcase.vue'
import { mainInformation } from '@/configs/config'

export default defineComponent({
  name: 'AboutView',
  components: {
    AnimatedNumber,
    WaifuShowcase,
  },
  data() {
    return {
      mainInformation,
      currentSlide: 0,
      totalSlides: 4,
      slideInterval: undefined as number | undefined,
    }
  },
  mounted() {
    this.startSlideshow()
  },
  beforeUnmount() {
    this.stopSlideshow()
  },
  methods: {
    startSlideshow() {
      this.slideInterval = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    stopSlideshow() {
      clearInterval(this.slideInterval)
    },
    nextSlide() {
      const slides = document.querySelectorAll('.slide-image')
      slides[this.currentSlide].classList.remove('active')
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides
      slides[this.currentSlide].classList.add('active')
    },
  },
})
</script>

<style scoped>
.about-container {
  background-color: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.about-hero {
  background-color: #1e293b;
  padding: 4rem 2rem;
  text-align: center;
}

.about-hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.text-accent {
  color: #6366f1;
}

.about-hero-description {
  font-size: 1.25rem;
  opacity: 0.8;
  margin-bottom: 2.4rem;
}

.btn-primary {
  margin-top: 200px;
  background-color: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: larger;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.section-title {
  text-align: center;
  font-size: 2.25rem;
  margin-bottom: 3rem;
  color: white;
}

.about {
  padding: 5rem 2rem;
}

.about-content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 4rem;
}

.about-image img {
  max-width: 100%;
  border-radius: 1rem;
}

.about-text p {
  line-height: 1.8;
  margin-bottom: 2rem;
}

.about-stats {
  display: flex;
  justify-content: space-between;
}

.slideshow-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.slideshow-images {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 50rem;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 1s ease-in-out,
    transform 1.5s ease-in-out;
  border-radius: 1rem;
}

.slide-image.active {
  opacity: 1;
  transform: scale(1);
  position: relative;
}

.logo-animation {
  max-width: 100%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  opacity: 0.7;
}

.about-contribution {
  background-color: #1e293b;
  padding: 5rem 2rem;
}

.contribution-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 4rem;
}

.contribution-text {
  flex: 1;
}

.btn-contribute {
  display: inline-block;
  background-color: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  text-decoration: none;
}

.contribution-image img {
  max-width: 100%;
  border-radius: 1rem;
}

@media (max-width: 768px) {
  .journey-content,
  .contribution-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 784px) {
  .about-content {
    flex-wrap: wrap;
  }

  .about-image img {
    max-width: 20rem;
  }
}

@media (max-width: 456px) {
  .stat-number {
    font-size: 1.69rem;
  }
}
</style>
