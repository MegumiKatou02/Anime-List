export interface Manga {
  id: string
  title: string
  description: string
  status: string
  coverImage: string
  rating: number
  genres: string[]
}

export interface Tag {
  attributes: {
    group: string
    name: {
      en: string
    }
  }
}

export interface Relationship {
  type: string
  attributes?: {
    fileName?: string
  }
}

interface MangaAttributes {
  title: {
    en?: string
    [key: string]: string | undefined
  }
  description: {
    en?: string
  }
  status: string
  rating?: {
    average?: number
  }
  tags: Tag[]
}

export interface MangaData {
  id: string
  attributes: MangaAttributes
  relationships: Relationship[]
}
