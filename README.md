> [!WARNING]
> **Since MangaDex may have been blocked by Internet Service Providers (ISPs) or for other reasons, I’ve decided not to continue developing this website, even though the MyAnimeList API is still available**
>
> **MangaDexがインターネットサービスプロバイダー（ISP）によってブロックされた可能性がある、または他の理由により、このウェブサイトの開発を続けないことにしました。MyAnimeListのAPIはまだ利用可能ですが**
# Anime List

A web app that allows users to search for anime/manga, view detailed information, read manga. Built with Vue.js and powered by the Myanimelist API and MangaDex API

> [!TIP]
> If you like SSR, you can check it out here: [AnimeList + Nuxt 3](https://github.com/MegumiKatou02/AnimeList-Nuxtjs)

# Features

- 🔍 Search Anime/Manga: Quickly find your favorite anime/manga by title, filters
- 📝 Detailed Info: See information such as type, status, episodes, and score
- 🌟 Characters: Explore the main characters of each anime
- 🎥 Trailers: Watch YouTube trailers (if available)
- 📖 Read Manga: Browse and read manga chapters directly from the app
- 💾 Save Anime/Manga: Save your favorite anime and manga to your personal list for easy access

# Tech Stack

- Frontend: Vue.js 3, TypeScript
- Backend API: Jikan API, Myanimelist API, MangaDex API
- Database: Firebase Firestore
- Deployment: [Vercel](https://vercel.com/)

# Getting Started

## Prerequisites

1. Node.js (v14+ recommended)
2. Vue CLI (if not already installed)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MegumiKatou02/Anime-List.git
   cd Anime-List
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment variables file:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be running at http://localhost:5173.

### Config .env

| Name                                | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | API Key for the Firebase project                      |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Domain used for Firebase Authentication               |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID                                   |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket URL                           |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID for Firebase Cloud Messaging                |
| `VITE_FIREBASE_APP_ID`              | Firebase App ID                                       |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Measurement ID for Firebase Analytics (if applicable) |
| `VITE_CLIENT_ID_MYANIMELIST`        | Client ID for MyAnimeList API                         |
| `VITE_DISCORD_CLIENT_ID`            | Discord Client ID                                     |
| `VITE_DISCORD_CLIENT_SECRET`        | Discord Client Secret                                 |
| `VITE_DISCORD_REDIRECT_URI`         | Redirect URI for Discord OAuth                        |
| `VITE_TURNSTILE_SITE_KEY`           | Turnstile site key for CAPTCHA                        |

# Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request
