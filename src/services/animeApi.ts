import axios from 'axios'
import type { Anime, Studio } from '@/types/anime'
import { ArrayUtils } from '@/utils/array'
import { ChineseStudios } from '@/utils/studios'

const BASE_URL = '/api'

export class AnimeService {
  private clientId: string

  constructor() {
    this.clientId = import.meta.env.VITE_CLIENT_ID_MYANIMELIST
  }

  private getHeaders() {
    return {
      'X-MAL-CLIENT-ID': this.clientId,
    }
  }

  async getTopAnime(limit: number = 10): Promise<Anime[]> {
    const response = await axios.get(`${BASE_URL}/anime/ranking`, {
      headers: this.getHeaders(),
      params: {
        ranking_type: 'all',
        limit,
        fields:
          'status,id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
      },
    })
    return response.data.data.map((item: { node: Anime }) => item.node)
  }

  async getRelatedAnimeMyanimelist(animeId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/anime/${animeId}`, {
        headers: this.getHeaders(),
        params: {
          fields: 'related_anime',
        },
      })

      return response.data.related_anime.map(
        (item: { node: Anime; relation_type_formatted: string }) => {
          return {
            data: item.node,
            relation_type_formatted: item.relation_type_formatted,
          }
        },
      )
    } catch (error) {
      console.error('Error fetching anime detail:', error)
      throw error
    }
  }

  async searchAnime(query: string): Promise<Anime[]> {
    const response = await axios.get(`${BASE_URL}/anime`, {
      headers: this.getHeaders(),
      params: {
        q: query,
        nsfw: true,
        limit: 100,
        fields:
          'status,id,alternative_titles,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
      },
    })
    const animeData = response.data.data

    return animeData.map((item: { node: Anime }) => item.node)
  }

  searchAnimeWithFilter(animeList: Anime[], status: string, genres: number[]) {
    const filteredAnime = animeList.filter((anime: Anime) => {
      const isStatusMatching = status.length === 0 || anime.status === status

      const isGenreMatching =
        genres.length === 0 ||
        (anime.genres &&
          Array.isArray(anime.genres) &&
          genres.every((genreId) => anime.genres.some((genre) => genre.id === genreId)))

      return isStatusMatching && isGenreMatching
    })

    return filteredAnime
  }

  async getShuffledAnimeListFromAPI(type: string = 'all'): Promise<Anime[]> {
    if (type === 'currently_airing') {
      type = 'airing'
    } else if (type === 'not_yet_aired') {
      type = 'upcoming'
    } else {
      type = 'all'
    }

    try {
      const randomOffset = Math.floor(Math.random() * 101)
      const response = await axios.get(`${BASE_URL}/anime/ranking`, {
        headers: this.getHeaders(),
        params: {
          ranking_type: type,
          limit: 115,
          nsfw: true,
          fields:
            'status,id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres,studios,media_type',
          offset: randomOffset,
        },
      })

      // Không lọc hết nổi mấy thằng tung của :(
      const isJapaneseAnime = (anime: Anime) => {
        return (
          anime.start_date &&
          parseInt(anime.start_date.slice(0, 4)) >= 2000 &&
          anime.studios &&
          anime.studios.every((studio: Studio) => !ChineseStudios.includes(studio.name))
        )
      }

      let animeList = response.data.data
        .map((item: { node: Anime }) => item.node)
        .filter(isJapaneseAnime)

      animeList = ArrayUtils.FisherYatesShuffle<Anime>(animeList)

      return animeList
    } catch (error) {
      console.error('Error fetching and shuffling anime list:', error)
      throw error
    }
  }
  async getAnimeByGenre(genreId: string): Promise<Anime[]> {
    const response = await axios.get(`${BASE_URL}/anime`, {
      headers: this.getHeaders(),
      params: {
        genres: genreId,
        limit: 20,
        fields: 'id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
      },
    })
    return response.data.data.map((item: { node: Anime }) => item.node)
  }

  // Jikan
  async getAnimeDetail(animeId: string) {
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`)

      return data
    } catch {
      throw new Error('Lỗi khi tải thông tin anime')
    }
  }

  async getAnimeCharacterDetail(animeId: string) {
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/characters`)

      return data
    } catch {
      throw new Error('Lỗi khi tải thông tin nhân vật')
    }
  }
}
