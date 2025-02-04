<template>
  <div class="about-container">
    <div class="split-container">
      <div class="left-column">
        <section class="api-section card">
          <h2 class="section-title">Dữ Liệu API</h2>
          <div class="api-grid">
            <div v-for="api in apis" :key="api.name" class="api-card">
              <div class="api-info">
                <h3 class="api-name">{{ api.name }}</h3>
                <p class="api-description">{{ api.description }}</p>
              </div>
            </div>
          </div>
        </section>
        <section class="anime-image-section card">
          <img
            src="https://i.pinimg.com/736x/0c/6f/9f/0c6f9f0e9843c3d009240248dcf135ea.jpg"
            alt="Anime Image"
            class="anime-image"
          />
        </section>
      </div>

      <div class="right-column">
        <section class="contact-section card">
          <h2 class="section-title">Liên Hệ & Hỗ Trợ</h2>
          <div class="social-grid">
            <a
              href="https://github.com/MegumiKatou02/Anime-List/issues"
              target="_blank"
              class="social-card"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span class="social-name">GitHub Issues</span>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100015444163739"
              target="_blank"
              class="social-card"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"
                />
              </svg>
              <span class="social-name">Facebook</span>
            </a>
          </div>
        </section>
        <section class="anime-image-section card">
          <img
            src="https://i.pinimg.com/736x/a7/ac/f8/a7acf87893d766056a3e97aa06500780.jpg"
            alt="Anime Image"
            class="anime-image"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const apis = [
  {
    name: 'MyAnimeList',
    description: 'Cung cấp thông tin xếp hạng và tìm kiếm anime',
  },
  {
    name: 'Jikan API',
    description: 'Cung cấp chi tiết anime, nhân vật và thông tin mở rộng',
  },
]
</script>

<style scoped>
.about-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
}

.split-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.left-column,
.right-column {
  flex: 1;
  min-width: 300px;
}

.card {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-bottom: 2rem;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.12);
}

.section-title {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: #1a365d;
  font-weight: 600;
  text-align: center;
}

.api-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.api-card {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  color: #1a365d;
  transition: background 0.3s ease;
}

.api-card:hover {
  background: rgba(44, 62, 80, 0.9);
  color: #fff;
}

.api-name {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: inherit;
}

.api-description {
  font-size: 1rem;
  color: inherit;
}

.social-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #1a365d;
  border: 1px solid #e2e8f0;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.social-card:hover {
  background: rgba(44, 62, 80, 0.9);
  color: #fff;
  transform: translateY(-3px);
}

.social-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.social-name {
  font-size: 1.2rem;
  font-weight: 500;
}

.anime-image-section {
  text-align: center;
  margin-top: 1rem;
}

.anime-image {
  max-width: 100%;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 800px) {
  .split-container {
    flex-direction: column;
    align-items: center;
  }
  .left-column,
  .right-column {
    width: 100%;
  }
}
</style>
