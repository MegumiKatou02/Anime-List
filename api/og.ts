import { VercelRequest, VercelResponse } from '@vercel/node'
import { MangaService } from '../src/services/mangaApi'
import { Manga } from '../src/types/manga'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  const mangaService = new MangaService()
  const mangaById = await mangaService.getMangaById(id as string)
  const manga: Manga = mangaService.transformMangaDetail(mangaById)

  const og_image = `https://og.mangadex.org/og-image/manga/${id}`

  res.setHeader('Content-Type', 'text/html')
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta property="og:title" content="${manga.title}" />
            <meta property="og:description" content="${manga.description}" />
            <meta property="og:image" content="${og_image}" />
            <meta property="og:url" content="https://anime-list-view.vercel.app/${id}" />
        </head>
        <body>
            <script>
                window.location.href = "/#/manga/${id}";
            </script>
        </body>
        </html>
    `)
}
