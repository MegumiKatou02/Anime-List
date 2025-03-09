<template>
  <section class="waifu-showcase">
    <h2 class="section-title">Waifu Gallery</h2>
    <div class="waifu-grid">
      <div
        v-for="(waifu, index) in waifus"
        :key="index"
        class="waifu-card"
        @mouseenter="hoveredWaifu = index"
        @mouseleave="hoveredWaifu = null"
      >
        <div class="waifu-image-container">
          <img :src="waifu.image" :alt="waifu.name" class="waifu-image" />
          <div class="waifu-hover-overlay" :class="{ 'is-hovered': hoveredWaifu === index }">
            <div class="waifu-details">
              <h3 class="waifu-name">{{ waifu.name }}</h3>
              <p class="waifu-origin">{{ waifu.origin }}</p>
              <div class="waifu-stats">
                <div class="stat">
                  <span class="stat-label">Charm</span>
                  <div class="stat-bar">
                    <div class="stat-bar-fill" :style="{ width: `${waifu.charm}%` }"></div>
                  </div>
                </div>
                <div class="stat">
                  <span class="stat-label">Cuteness</span>
                  <div class="stat-bar">
                    <div class="stat-bar-fill" :style="{ width: `${waifu.cuteness}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WaifuShowcase',
  data() {
    return {
      hoveredWaifu: null as number | null,
      waifus: [
        {
          name: 'Megumi Katou',
          origin: 'Saenai Heroine no Sodatekata',
          image:
            'https://static.wikia.nocookie.net/saekano/images/0/0e/Kisetsu_wo_Dakishimete.png/revision/latest/scale-to-width-down/1000?cb=20230331165420',
          charm: 95,
          cuteness: 90,
        },
        {
          name: 'Chitanda Eru',
          origin: 'Hyouka',
          image:
            'https://static.wikia.nocookie.net/hyouka/images/b/b3/Phonewallpaper.png/revision/latest?cb=20161114115628&path-prefix=vi',
          charm: 80,
          cuteness: 100,
        },

        {
          name: 'Kurumi Tokisaki',
          origin: 'Date a Live',
          image: 'https://pbs.twimg.com/media/GjvJwCdbgAA7y6P.jpg',
          charm: 100,
          cuteness: 70,
        },
        {
          name: 'Sanka Rea',
          origin: 'Sankarea',
          image:
            'https://static.wikia.nocookie.net/sankarea/images/7/75/Sankarea_02_jp.jpg/revision/latest/scale-to-width-down/1000?cb=20200517115813',
          charm: 90,
          cuteness: 70,
        },
        {
          name: 'Shinobu Oshino',
          origin: 'Monogatari Series',
          image:
            'https://steamuserimages-a.akamaihd.net/ugc/867364351727827276/B7E6B4F5BB299FBAE29E8C840F03CEB1DEBF7B10/?imw=450&impolicy=Letterbox',
          charm: 96,
          cuteness: 100,
        },
        {
          name: 'Chocolat',
          origin: 'Ore no Nounai Sentakushi ga, Gakuen Love Comedy wo Zenryoku de Jama Shiteiru',
          image:
            'https://static.wikia.nocookie.net/noucome/images/d/db/Vol_11_Cover.png/revision/latest/scale-to-width-down/1000?cb=20151111001654',
          charm: 100,
          cuteness: 100,
        },
        {
          name: 'Erio Towa',
          origin: 'Denpa Onna to Seishun Otoko',
          image:
            'https://animesher.com/orig/0/46/462/4627/animesher.com_stars-denpa-onna-art-462758.jpg',
          charm: 85,
          cuteness: 80,
        },
        {
          name: 'Yashiro Hoshimiya',
          origin: 'Denpa Onna to Seishun Otoko',
          image:
            'https://static.wikia.nocookie.net/denpaonna/images/d/d6/Anime_5_DVD_Limited.jpg/revision/latest/scale-to-width-down/1000?cb=20220422072650',
          charm: 85,
          cuteness: 80,
        },
        {
          name: 'ATRI',
          origin: 'Atri: My Dear Moments',
          image: 'https://i.pinimg.com/736x/7d/26/13/7d26130090892ebcdb007e38f09c9528.jpg',
          charm: 74,
          cuteness: 100,
        },
      ],
    }
  },
})
</script>

<style scoped>
.waifu-showcase {
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 1rem 2rem 5rem;
}

.section-title {
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
}

.waifu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.waifu-card {
  perspective: 1000px;
  position: relative;
}

.waifu-image-container {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.waifu-image {
  width: 100%;
  height: 450px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.waifu-card:hover .waifu-image {
  transform: scale(1.1);
}

.waifu-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.waifu-hover-overlay.is-hovered {
  opacity: 1;
}

.waifu-details {
  color: white;
  width: 100%;
}

.waifu-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.waifu-origin {
  font-size: 1rem;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.waifu-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stat-bar {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background-color: #6366f1;
}

@media (max-width: 768px) {
  .waifu-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
