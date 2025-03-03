import { useHead } from '@vueuse/head'

interface MetaParams {
  title: string
  description: string
  image: string
  url: string
}

export function useMeta({ title, description, image, url }: MetaParams) {
  useHead({
    title: title + ' - Anime List',
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  })
}
