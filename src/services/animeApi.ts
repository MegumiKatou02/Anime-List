import axios from 'axios'
import type { Anime } from '@/types/anime'
import { ArrayUtils } from '@/utils/array'

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

  async searchAnime(query: string): Promise<Anime[]> {
    const response = await axios.get(`${BASE_URL}/anime`, {
      headers: this.getHeaders(),
      params: {
        q: query,
        limit: 20,
        fields:
          'status,id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
      },
    })
    return response.data.data.map((item: { node: Anime }) => item.node)
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
          limit: 100,
          fields:
            'status,id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
          offset: randomOffset,
        },
      })

      let animeList = response.data.data.map((item: { node: Anime }) => item.node)

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
}
