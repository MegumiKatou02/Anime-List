export interface Manga {
  id: string
  title: string
  coverImage: string
  description: string
  author: string
  releaseYear: number
  rating: number
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
  genres: string[]
  mangaDexId: string
  alternativeTitles?: string[]
  lastUpdated?: string
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
    name?: string
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
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
  rating?: {
    average?: number
  }
  tags: Tag[]
  year?: number
  author?: string
  createdAt: string
}

export interface MangaData {
  id: string
  attributes: MangaAttributes
  relationships: Relationship[]
}

export interface Chapter {
  id: string
  number: number
  title: string
  teamId: string
  uploadDate: string
  pages: string[]
}

export interface TranslationTeam {
  id: string
  name: string
  language: string
}

export interface ApiChapter {
  id: string
  attributes: {
    chapter: string
    title?: string
    publishAt: string
  }
  relationships: ApiRelationship[]
}

interface ApiRelationship {
  id: string
  type: string
}

export interface ApiTranslationTeam {
  id: string
  attributes: {
    name: string
    language?: string
  }
}
