import axios from 'axios'
import type { Anime } from '@/types/anime'

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
        fields: 'id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
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
        fields: 'id,title,main_picture,mean,rank,popularity,synopsis,start_date,end_date,genres',
      },
    })
    return response.data.data.map((item: { node: Anime }) => item.node)
  }
}
