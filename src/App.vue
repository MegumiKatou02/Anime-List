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
      <p>Powered by MyAnimeList API</p>
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

/* Responsive Design */
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
</style>
