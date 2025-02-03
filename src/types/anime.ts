interface Anime {
  id: number
  title: string
  main_picture: {
    medium: string
    large: string
  }
  mean: number
  rank: number
  popularity: number
  synopsis: string
  start_date?: string
  end_date?: string
  genres: Array<{
    id: number
    name: string
  }>
}

export type { Anime }
