<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <nav class="navbar">
        <router-link to="/">
          <div class="nav-brand">
            <img
              alt="Anime Search Logo"
              class="logo"
              src="@/assets/logo.jpg"
              width="40"
              height="40"
            />
            <h1 style="font-family: 'Playwrite IN', cursive">Anime List</h1>
          </div>
        </router-link>

        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-text">
          <p>Powered by</p>
          <div class="api-brand">
            <img src="@/assets/mal_logo.png" alt="MyAnimeList Logo" class="api-logo" />
            <span>MyAnimeList API</span>
          </div>
        </div>
        <div class="footer-links">
          <a href="https://myanimelist.net/static/apiagreement.html" class="footer-link"
            >API License</a
          >
          <a
            href="https://myanimelist.net/static/pdf/about/privacy_policy_20230227.pdf"
            class="footer-link"
            >Privacy Policy</a
          >
        </div>
      </div>
      <p class="copyright">&copy; 2024 Anime List. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: transform 0.2s ease;
}

.nav-brand:hover {
  transform: translateX(5px);
}

.nav-brand h1 {
  color: white;
  font-size: 1.8rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo {
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: rotate(15deg);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
}

.nav-link:hover::after {
  width: 80%;
  left: 10%;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-link.router-link-active::after {
  width: 100%;
  left: 0;
  background: #42b883;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 5%;
  }

  .nav-brand h1 {
    font-size: 1.4rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .nav-brand h1 {
    display: none;
  }

  .nav-links {
    gap: 0.8rem;
  }
}

footer {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  color: white;
  padding: 2rem 5%;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.api-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: transform 0.3s ease;
}

.api-brand:hover {
  transform: translateY(-2px);
}

.api-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  position: relative;
  transition: all 0.3s ease;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #42b883;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: white;
}

.footer-link:hover::after {
  width: 100%;
}

.copyright {
  text-align: center;
  padding-top: 1.5rem;
  margin: 1rem auto 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 1200px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    padding-bottom: 1rem;
  }

  .footer-text {
    flex-direction: column;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .copyright {
    font-size: 0.8rem;
  }
}
</style>
