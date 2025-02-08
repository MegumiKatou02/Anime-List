import axios from 'axios'
import type {
  AdjacentChapters,
  Chapter,
  ChapterData,
  ChapterResponse,
  Manga,
  MangaData,
  Relationship,
  Tag,
} from '@/types/manga'

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
        params: { 'includes[]': ['cover_art', 'author'] },
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

  async getStatisticsManga(
    mangaId: string,
  ): Promise<{ rating: number; follows: number; comments: number }> {
    try {
      const response = await this.api.get(`/statistics/manga/${mangaId}`)
      const mangaStatistics = response.data.statistics[mangaId]

      if (!mangaStatistics) {
        throw new Error('Statistics not found for this manga')
      }

      return {
        rating: mangaStatistics.rating,
        follows: mangaStatistics.follows,
        comments: mangaStatistics.comments,
      }
    } catch (error) {
      console.error('Error fetching statistics manga:', error)
      throw new Error('Just a Error')
    }
  }

  async searchManga(query: string): Promise<Manga[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/manga?limit=50&title=${encodeURIComponent(query)}&includes[]=cover_art`,
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

  async getMangaChapters(mangaId: string): Promise<Chapter[]> {
    try {
      const response = await this.api.get(`/manga/${mangaId}/feed`, {
        params: {
          'includes[]': ['user', 'scanlation_group'],
          'order[chapter]': 'desc',
          limit: '500',
        },
      })

      const data: ChapterResponse = response.data
      // console.log(data.data)

      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('No valid chapters found in response')
      }

      return data.data.map((chapter) => {
        const uploader = chapter.relationships.find((rel) => rel.type === 'user')
        const uploaderName = uploader?.attributes?.username || 'Unknown'

        return {
          id: chapter.id,
          number: chapter.attributes.chapter || 'oneshot',
          volume: chapter.attributes.volume,
          language: 'en',
          publishedAt: chapter.attributes.publishAt,
          uploader: uploaderName,
          comments: 0,
        }
      })
    } catch (error) {
      console.error('Error fetching manga chapters:', error)
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
        `${this.baseUrl}/manga?limit=50&order[rating]=desc&includes[]=cover_art`,
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

  async getChapter(chapterId: string): Promise<Chapter> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chapter/${chapterId}?includes[]=manga&includes[]=scanlation_group`,
      )
      if (!response.ok) throw new Error('Failed to fetch chapter')

      const data = await response.json()
      const chapter = data.data

      const mangaTitle =
        chapter.relationships.find((rel: Relationship) => rel.type === 'manga')?.attributes?.title
          ?.en || 'Unknown'

      return {
        id: chapter.id,
        number: chapter.attributes.chapter || '0',
        volume: chapter.attributes.volume,
        language: chapter.attributes.translatedLanguage,
        publishedAt: chapter.attributes.publishAt,
        uploader:
          chapter.relationships.find((rel: Relationship) => rel.type === 'scanlation_group')
            ?.attributes?.name || 'Unknown',
        comments: 0,
        mangaTitle,
      }
    } catch (error) {
      console.error('Error fetching chapter:', error)
      throw error
    }
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/at-home/server/${chapterId}`)
      if (!response.ok) throw new Error('Failed to fetch chapter pages')

      const data = await response.json()
      const { baseUrl, chapter } = data

      return chapter.dataSaver.map(
        (page: string) => `${baseUrl}/data-saver/${chapter.hash}/${page}`,
      )
    } catch (error) {
      console.error('Error fetching chapter pages:', error)
      throw error
    }
  }
  async getAdjacentChapters(mangaId: string, currentChapter: string): Promise<AdjacentChapters> {
    try {
      const response = await this.api.get(`/manga/${mangaId}/feed`, {
        params: {
          'translatedLanguage[]': ['en'],
          'order[chapter]': 'asc',
          'includes[]': ['scanlation_group'],
        },
      })

      if (!response) throw new Error('Failed to fetch chapters')

      const data = await response.data
      const chapters = data.data

      const currentIndex = chapters.findIndex(
        (chapter: ChapterData) => chapter.attributes.chapter === currentChapter,
      )

      return {
        previous: currentIndex > 0 ? this.formatChapter(chapters[currentIndex - 1]) : null,
        next:
          currentIndex < chapters.length - 1
            ? this.formatChapter(chapters[currentIndex + 1])
            : null,
      }
    } catch (error) {
      console.error('Error fetching adjacent chapters:', error)
      throw error
    }
  }
  private formatChapter(chapterData: ChapterData): Chapter {
    return {
      id: chapterData.id,
      number: chapterData.attributes.chapter || '0',
      volume: chapterData.attributes.volume,
      language: chapterData.attributes.translatedLanguage,
      publishedAt: chapterData.attributes.publishAt,
      uploader:
        chapterData.relationships.find((rel: Relationship) => rel.type === 'scanlation_group')
          ?.attributes?.name || 'Unknown',
      comments: 0,
      mangaTitle:
        chapterData.relationships.find((rel: Relationship) => rel.type === 'manga')?.attributes
          ?.title?.en || 'Unknown',
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
      author: mangaData.relationships[0].attributes?.name || 'Unknown Author',
      releaseYear: new Date(mangaData.attributes.createdAt).getFullYear(),
      mangaDexId: mangaData.id,
    }
  }
}
