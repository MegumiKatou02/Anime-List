<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="text-white">MyAnimeList</span>
          <span class="text-white">+</span>
          <span class="text-white">MangaDex</span>
          <span class="text-white">=</span>
          <router-link to="/home" class="text-equal">AnimeList</router-link>
        </h1>
        <p class="hero-description">
          Khám phá thế giới anime và manga, theo dõi bộ sưu tập của bạn với nền tảng AnimeList. Dự
          án được thử nghiệm và phát triển với đam mê, nói không với tư bản.
        </p>
        <p style="margin-top: -10px" class="hero-description">
          (Em xin loi anh Zennomi vi da lay cai style nay, ủng hộ anh Zen tại
          <a :href="mainInformation.link.web.truyendex" class="link-name">đây</a>)
        </p>
        <div class="hero-buttons">
          <router-link to="/home" class="btn-primary">Trải nghiệm demo</router-link>
          <a :href="mainInformation.link.web.github" class="btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <span> SOURCE CODE </span>
          </a>
        </div>
      </div>
      <div class="hero-image">
        <div class="slideshow-container">
          <div class="slideshow-images">
            <img src="@/assets/logo-large.jpg" alt="AnimeList Logo" class="slide-image active" />
            <img src="@/assets/logo-large2.jpg" alt="AnimeList Logo" class="slide-image" />
            <img src="@/assets/logo-large3.jpg" alt="AnimeList Logo" class="slide-image" />
            <img src="@/assets/logo-large4.jpg" alt="AnimeList Logo" class="slide-image" />
          </div>
        </div>
      </div>
    </div>

    <section class="features-section">
      <h2 class="section-title">Tính năng nổi bật</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon" v-html="feature.icon"></div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <section class="inspiration-section">
      <h2 class="section-title">Cảm hứng</h2>
      <div class="inspiration-content">
        <div class="inspiration-text">
          <p>
            AnimeList được tạo ra và xây dựng dựa vào 2 nguồn chính là
            <a :href="mainInformation.link.web.myanimelist" class="link-name">Myanimelist</a> và
            <a :href="mainInformation.link.web.mangadex" class="link-name">MangaDex</a> đồng thời
            cảm hứng chính đến từ
            <a :href="mainInformation.link.web.truyendex" class="link-name">TruyenDex</a>. Hiện tại
            trang web chỉ đang trong giai đoạn thử nghiệm.
          </p>
          <p>
            Hi vọng trong tương lai tới, trang web được nhiều người biết đến hơn cũng như là động
            lực để phát triển thêm.
          </p>
        </div>
        <div class="inspiration-image">
          <img src="@/assets/inspiration.png" alt="Inspiration" class="fade-in-animation" />
        </div>
      </div>
    </section>

    <section class="faqs-section">
      <h2 class="section-title">Câu hỏi thường gặp</h2>
      <div class="faqs-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
          <div class="faq-question">
            <h3>{{ faq.question }}</h3>
            <span class="faq-icon">{{ faq.isOpen ? '−' : '+' }}</span>
          </div>
          <div class="faq-answer" :class="{ 'faq-open': faq.isOpen }">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <h2 class="section-title">Đăng ký nhận thông báo</h2>
      <p class="newsletter-description">
        Nhận thông báo về các tính năng mới và cập nhật từ AnimeList
      </p>
      <div class="newsletter-form">
        <input
          type="email"
          placeholder="Email của bạn (hiện tại chưa có gì)"
          class="newsletter-input"
        />
        <button class="newsletter-button">Đăng ký</button>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="@/assets/logo.jpg" alt="AnimeList" />
          <p>AnimeList © 2025</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Liên kết</h4>
            <ul>
              <li>
                <router-link to="/home"> Trang chủ </router-link>
              </li>
              <li><a :href="mainInformation.link.web.myanimelist">MyAnimeList</a></li>
              <li><a :href="mainInformation.link.web.mangadex">MangaDex</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Thông tin</h4>
            <ul>
              <li>
                <router-link to="/about"> Về chúng tôi </router-link>
              </li>
              <li><router-link to="/terms">Điều khoản sử dụng</router-link></li>
              <li><router-link to="/terms">Chính sách bảo mật</router-link></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Theo dõi</h4>
            <div class="social-icons">
              <a :href="mainInformation.link.social.facebook" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                  />
                </svg>
              </a>
              <a :href="mainInformation.link.social.twitter" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                  />
                </svg>
              </a>
              <a :href="mainInformation.link.social.github" class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="h-4 w-4 iconify iconify--eva"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1A10.89 10.89 0 0 0 1 11.77A10.79 10.79 0 0 0 8.52 22c.55.1.75-.23.75-.52v-1.83c-3.06.65-3.71-1.44-3.71-1.44a2.86 2.86 0 0 0-1.22-1.58c-1-.66.08-.65.08-.65a2.31 2.31 0 0 1 1.68 1.11a2.37 2.37 0 0 0 3.2.89a2.33 2.33 0 0 1 .7-1.44c-2.44-.27-5-1.19-5-5.32a4.15 4.15 0 0 1 1.11-2.91a3.78 3.78 0 0 1 .11-2.84s.93-.29 3 1.1a10.7 10.7 0 0 1 5.5 0c2.1-1.39 3-1.1 3-1.1a3.78 3.78 0 0 1 .11 2.84A4.15 4.15 0 0 1 19 11.2c0 4.14-2.58 5.05-5 5.32a2.5 2.5 0 0 1 .75 2v2.95c0 .35.2.63.75.52A10.8 10.8 0 0 0 23 11.77A10.89 10.89 0 0 0 12 1"
                  ></path>
                </svg>
              </a>
              <a :href="mainInformation.link.social.discord" class="social-icon">
                <svg
                  data-v-219fbffe=""
                  width="24"
                  height="24"
                  class="discord-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    data-v-219fbffe=""
                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mainInformation } from '@/configs/config'
export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      mainInformation,
      currentSlide: 0,
      totalSlides: 4,
      slideInterval: undefined as number | undefined,
      features: [
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
          title: 'Thư viện đa dạng',
          description:
            'Hàng ngàn anime và manga được cập nhật liên tục, từ những tác phẩm kinh điển đến mới nhất.',
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
          title: 'Theo dõi cá nhân',
          description: 'Tạo và quản lý danh sách xem của bạn dễ dàng.',
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
          title: 'Cộng đồng năng động',
          description: 'Tham gia thảo luận, tạo vấn đề trên github để đóng góp cho trang web.',
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>',
          title: 'Lọc thông minh',
          description:
            'Khám phá những bộ anime và manga mới dựa trên bộ lọc và tìm kiếm thông minh.',
        },
      ],
      faqs: [
        {
          question: 'AnimeList có miễn phí không?',
          answer: 'Có, AnimeList hoàn toàn miễn phí.',
          isOpen: false,
        },
        {
          question: 'Làm thế nào để tạo danh sách anime/manga của riêng tôi?',
          answer: 'Bằng cách đăng nhập thông qua discord là đã có thể lưu/xoá danh sách',
          isOpen: false,
        },
        {
          question: 'AnimeList có ứng dụng di động không?',
          answer:
            'Hiện tại, chưa có ứng dụng di động nhưng trang web được tối ưu hóa cho thiết bị di động. Ứng dụng di động sẽ sớm được phát hành trong tương lai (chac the).',
          isOpen: false,
        },
        {
          question: 'Làm thế nào để đóng góp cho cộng đồng?',
          answer: 'Bạn có thể giới thiệu cho bạn bè biết dự án thử nghiệm này',
          isOpen: false,
        },
        {
          question: 'AnimeList có hỗ trợ nhiều ngôn ngữ không?',
          answer:
            'Có.. và không, hiện tại bên tab manga AnimeList chỉ hỗ trợ bản dịch tiếng Việt và tiếng Anh',
          isOpen: false,
        },
      ],
    }
  },
  mounted() {
    this.startSlideshow()
  },
  beforeUnmount() {
    this.stopSlideshow()
  },
  methods: {
    toggleFaq(index: number) {
      this.faqs = this.faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, isOpen: !faq.isOpen }
        }
        return { ...faq, isOpen: false }
      })
    },
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
.home-container {
  height: 100%;
  min-height: 100vh;
  background-color: #0f172a;
  color: #e2e8f0;
}

.hero-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 600px;
  z-index: 1;
}

.hero-title {
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.89rem;
}

.text-white {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 2.7rem;
  margin-bottom: 1rem;
}

.text-equal {
  font-family: 'Playwrite IN', cursive;
  font-size: 2.7rem;
  color: #5046e3;
}

.hero-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary {
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

.h-5 {
  width: 1.6rem;
  margin-right: 0.5rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  background-color: transparent;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid #6366f1;
  transition: background-color 0.3s ease;
  /* gap: 0.5rem; */
}

.btn-secondary:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.hero-image {
  position: relative;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
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

section {
  padding: 5rem 2rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: #1e293b;
  padding: 2rem;
  border-radius: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  color: #6366f1;
  margin-bottom: 1rem;
  width: 7rem;
  height: 7rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-description {
  opacity: 0.8;
  line-height: 1.6;
}

.inspiration-section {
  background-color: #1e293b;
}

.inspiration-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.inspiration-text {
  flex: 1;
}

.inspiration-text p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  font-size: 1.125rem;
}

.link-name {
  color: #5046e3;
  text-decoration: underline;
}

.inspiration-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.fade-in-animation {
  max-width: 100%;
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faqs-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #1e293b;
  cursor: pointer;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
}

.faq-question h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.faq-icon {
  font-size: 1.5rem;
  font-weight: 300;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer p {
  padding: 0 1.25rem 1.25rem;
  margin: 0;
  opacity: 0.8;
  line-height: 1.6;
}

.faq-open {
  max-height: 500px;
}

.newsletter-section {
  background-color: #1e293b;
  text-align: center;
}

.newsletter-description {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.125rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: #0f172a;
  color: white;
}

.newsletter-button {
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.newsletter-button:hover {
  background-color: #4f46e5;
}

.footer {
  background-color: #0f172a;
  padding: 3rem 2rem;
  border-top: 1px solid #334155;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.footer-logo {
  flex: 1;
  min-width: 200px;
}

img {
  border-radius: 2rem;
}

.footer-logo img {
  height: 40px;
  margin-bottom: 1rem;
}

.footer-links {
  flex: 2;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-column h4 {
  color: white;
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 0.75rem;
}

.footer-column ul li a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column ul li a:hover {
  color: #6366f1;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background-color: #1e293b;
  color: #94a3b8;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.social-icon:hover {
  background-color: #6366f1;
  color: white;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 4rem 1.5rem;
    text-align: center;
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-image {
    width: 80%;
    margin-top: 3rem;
  }

  .inspiration-content {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-content {
    flex-direction: column;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
