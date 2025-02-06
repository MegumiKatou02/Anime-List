import type { Manga, MangaData, Relationship, Tag } from '@/types/manga'

export class MangaService {
  private baseUrl = '/mangadex-api'

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

  async getTopManga(): Promise<Manga[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/manga?limit=20&order[rating]=desc&includes[]=cover_art`,
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

  private async transformMangaData(data: MangaData[]): Promise<Manga[]> {
    const mangaList = await Promise.all(
      data.map(async (manga) => {
        const coverFile = manga.relationships.find((rel: Relationship) => rel.type === 'cover_art')
          ?.attributes?.fileName

        const title =
          manga.attributes.title.en ||
          Object.values(manga.attributes.title).find((t) => t !== undefined) ||
          'Unknown Title'

        const getCoverImage = async (mangaId: string, fileName: string) => {
          try {
            const response = await fetch(
              `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`,
              {
                headers: {
                  Referer: 'https://mangadex.org',
                },
              },
            )
            if (response.ok) {
              return response.url
            }
          } catch (error) {
            console.error('Error fetching cover image:', error)
          }
          return 'https://via.placeholder.com/200x300'
        }

        const coverImage = coverFile
          ? await getCoverImage(manga.id, coverFile)
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
        }
      }),
    )
    return mangaList
  }
}
