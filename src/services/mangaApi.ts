import type { Manga, MangaData, Relationship, Tag } from '@/types/manga'

export class MangaService {
  private baseUrl = '/mangadex-api'

  async searchManga(query: string): Promise<Manga[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/manga?limit=20&title=${encodeURIComponent(query)}&includes[]=cover_art`,
        {
          headers: {
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

      // const coverImage = coverFile
      //   ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}`
      //   : ''
      // console.log('Cover Image URL:', coverImage)

      return {
        id: manga.id,
        title,
        description: manga.attributes.description.en || 'No description available',
        status: manga.attributes.status,
        coverImage: coverFile ? `/mangadex-covers/covers/${manga.id}/${coverFile}` : '',
        rating: manga.attributes.rating?.average || 0,
        genres: manga.attributes.tags
          .filter((tag: Tag) => tag.attributes.group === 'genre')
          .map((tag: Tag) => tag.attributes.name.en),
      }
    })
  }
}
