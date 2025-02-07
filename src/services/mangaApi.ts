import axios from 'axios'
import type { Manga, MangaData, Relationship, Tag } from '@/types/manga'

export class MangaService {
  private baseUrl: string
  private api

  constructor() {
    this.baseUrl = '/mangadex-api'
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)

        if (error.response?.status === 404) {
          throw new Error('Manga not found')
        }
        if (error.response?.status === 429) {
          throw new Error('Too many requests. Please try again later.')
        }

        throw new Error('An error occurred while fetching manga data')
      },
    )
  }

  async getMangaById(id: string): Promise<Manga> {
    try {
      const response = await this.api.get(`/manga/${id}`, {
        params: { 'includes[]': 'cover_art' },
      })
      const mangaData = response.data.data
      return this.transformMangaDetail(mangaData)
    } catch (error) {
      console.error('Error fetching manga:', error)
      throw error
    }
  }

  async getMangaChapterCount(mangaId: string): Promise<number> {
    try {
      const response = await this.api.get('/chapter', {
        params: {
          manga: mangaId,
          limit: 1,
        },
      })
      const totalChapters = response.data.total
      return totalChapters || 0
    } catch (error) {
      console.error('Error fetching chapter count:', error)
      throw new Error('Manga not found')
    }
  }

  async searchManga(query: string): Promise<Manga[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/manga?limit=20&title=${encodeURIComponent(query)}&includes[]=cover_art`,
        {
          headers: {
            Referer: 'https://mangadex.org',
            'Cache-Control': 'no-cache',
          },
        },
      )

      const data = await response.json()

      return this.transformMangaData(data.data)
    } catch (error) {
      console.error('Error searching manga:', error)
      return []
    }
  }

  async getMangaByGenre(
    genre: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Manga[]; total: number }> {
    try {
      const response = await this.api.get('/manga/genre', {
        params: {
          genre,
          page,
          limit,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching manga by genre:', error)
      throw error
    }
  }

  async getPopularManga(page = 1, limit = 20): Promise<{ data: Manga[]; total: number }> {
    try {
      const response = await this.api.get('/manga/popular', {
        params: {
          page,
          limit,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching popular manga:', error)
      throw error
    }
  }

  async getLatestManga(page = 1, limit = 20): Promise<{ data: Manga[]; total: number }> {
    try {
      const response = await this.api.get('/manga/latest', {
        params: {
          page,
          limit,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching latest manga:', error)
      throw error
    }
  }

  async getRecommendedManga(mangaId: string, limit = 6): Promise<Manga[]> {
    try {
      const response = await this.api.get(`/manga/${mangaId}/recommendations`, {
        params: { limit },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      throw error
    }
  }

  async getMangaStats(mangaId: string): Promise<{
    totalViews: number
    monthlyViews: number
    averageRating: number
    totalRatings: number
  }> {
    try {
      const response = await this.api.get(`/manga/${mangaId}/stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching manga stats:', error)
      throw error
    }
  }

  async getTopManga(): Promise<Manga[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/manga?limit=30&order[rating]=desc&includes[]=cover_art`,
        {
          headers: {
            Referer: 'https://mangadex.org',
            'Cache-Control': 'no-cache',
          },
        },
      )
      const data = await response.json()

      return this.transformMangaData(data.data)
    } catch (error) {
      console.error('Error fetching top manga:', error)
      return []
    }
  }
  private transformMangaData(data: MangaData[]): Manga[] {
    return data.map((manga) => {
      const coverFile = manga.relationships.find((rel: Relationship) => rel.type === 'cover_art')
        ?.attributes?.fileName

      const title =
        manga.attributes.title.en ||
        Object.values(manga.attributes.title).find((t) => t !== undefined) ||
        'Unknown Title'

      const coverImage = coverFile
        ? `https://mangadex.org/covers/${manga.id}/${coverFile}.256.jpg`
        : 'https://via.placeholder.com/200x300'

      return {
        id: manga.id,
        title,
        description: manga.attributes.description.en || 'No description available',
        status: manga.attributes.status,
        coverImage,
        rating: manga.attributes.rating?.average || 0,
        genres: manga.attributes.tags
          .filter((tag: Tag) => tag.attributes.group === 'genre')
          .map((tag: Tag) => tag.attributes.name.en),
        author: manga.attributes.author || 'Unknown Author',
        releaseYear: new Date(manga.attributes.createdAt).getFullYear(),
        mangaDexId: manga.id,
      }
    })
  }
  private transformMangaDetail(mangaData: MangaData): Manga {
    const coverRelationship = mangaData.relationships.find((rel) => rel.type === 'cover_art')
    const coverFile = coverRelationship?.attributes?.fileName

    const title = mangaData.attributes.title.en || 'Unknown Title'

    const coverImage = coverFile
      ? `https://mangadex.org/covers/${mangaData.id}/${coverFile}.256.jpg`
      : 'https://via.placeholder.com/200x300'

    return {
      id: mangaData.id,
      title,
      coverImage,
      description: mangaData.attributes.description.en || 'No description available',
      status: mangaData.attributes.status,
      rating: mangaData.attributes.rating?.average || 0,
      genres: mangaData.attributes.tags
        .filter((tag: Tag) => tag.attributes.group === 'genre')
        .map((tag: Tag) => tag.attributes.name.en),
      author: 'Unknown Author',
      releaseYear: new Date(mangaData.attributes.createdAt).getFullYear(),
      mangaDexId: mangaData.id,
    }
  }
}
