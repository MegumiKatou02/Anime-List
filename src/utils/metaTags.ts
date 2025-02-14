import type { MetaData } from '@/services/metadata'

export const updateMetaTags = (data: MetaData) => {
  document.title = data.title

  updateMetaTag('og:title', data.title)
  updateMetaTag('og:description', data.description)
  if (data.image) {
    updateMetaTag('og:image', data.image)
  }
  updateMetaTag('og:type', data.type || 'website')

  updateMetaTag('twitter:title', data.title)
  updateMetaTag('twitter:description', data.description)
  if (data.image) {
    updateMetaTag('twitter:image', data.image)
  }
}

const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement

  if (!element) {
    element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  }

  if (element) {
    element.setAttribute('content', content)
  } else {
    element = document.createElement('meta')
    if (name.startsWith('og:')) {
      element.setAttribute('property', name)
    } else {
      element.setAttribute('name', name)
    }
    element.setAttribute('content', content)
    document.head.appendChild(element)
  }
}

export const resetMetaTags = () => {
  updateMetaTags({
    title: 'Anime List',
    description:
      'Tra cứu thông tin anime/manga miễn phí, không quảng cáo, không tư bản. Truy cập ngay trang web anime/manga đầu hàng VN :penguin:',
    image: 'https://anime-list-view.vercel.app/images/animelist-banner.jpg?v=2',
    type: 'website',
  })
}
