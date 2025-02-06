export interface CharacterImage {
  image_url: string
  large_image_url: string
}

export interface Character {
  character: {
    mal_id: number
    images: {
      webp: {
        image_url: string
      }
      jpg: {
        image_url: string
      }
    }
    name: string
  }
  name: string
  role: string
}

export interface CharacterJikan {
  name: string
  name_kanji: string
  images: {
    webp: {
      image_url: string
    }
    jpg: {
      image_url: string
    }
  }
  nicknames: Array<string>
  favorites: number
  about: string
}

export interface AnimeJikan {
  images: {
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  title: string
  title_japanese: string
  status: string
  type: string
  synopsis: string
  episodes: string
  score: number
  genres: Array<{
    mal_id: number
    name: string
  }>
  rank: number
  broadcast: {
    day: string
    time: string
    timezone: string
    string: string
  }
  mal_id: number
}

export interface Anime {
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
  status: string
}

export interface Genres {
  mal_id: number
  name: string
}
