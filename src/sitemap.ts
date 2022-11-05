import * as fs from 'fs'
import { blogsDirPath, getBlogDirFilePath, sitemapFilePath } from './path.js';

const siteMapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

{{urlset}}

</urlset>
`

const urlTemplate = `
  <url>
    <loc>{{loc}}</loc>
    <lastmod>{{lastmod}}</lastmod>
    <changefreq>{{changefreq}}</changefreq>
  </url>
`

const origin = 'https://obake.land/'

export function generateSitemap (): void {
  const fileNames = fs.readdirSync(blogsDirPath)
    .filter(filePath => filePath.endsWith('.md'))
    .map(fileName => fileName.replace('.md', ''))

  const tags: { tag: string, lastUpdate: string }[] = []

  const data = fileNames.map(fileName => {
    const blogDirFilePath = getBlogDirFilePath(fileName)
    const file = fs.readFileSync(blogDirFilePath, { encoding: "utf8" })

    const data = file.split('---metadata')
    if (data.length !== 2) {
      console.error(`Metadata reade error: ${fileName}`)
      process.exit(1)
    }

    const metaData: MetaData = JSON.parse(data[0])
    metaData.tags.forEach(metaDataTag => {
      const pushed = tags.find(tag => tag.tag === metaDataTag)
      if (!pushed) {
        tags.push({
          tag: metaDataTag,
          lastUpdate: metaData.date.replaceAll('/', '-')
        })
      } else {
        pushed.lastUpdate = metaData.date.replaceAll('/', '-')
      }
    })

    return {
      loc: `${origin}blog/${fileName}`,
      lastmod: metaData.date.replaceAll('/', '-'),
      changefreq: 'never'
    }
  })

  tags.forEach(tag => {
    data.push(
      {
        loc: `${origin}tags/${tag.tag}`,
        lastmod: tag.lastUpdate,
        changefreq: 'weekly'
      }
    )
  })

  const now = new Date()
  data.push({
    loc: `${origin}`,
    lastmod: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
    changefreq: 'weekly'
  })

  const urlset = data.map(v => {
    return urlTemplate
      .replace('{{loc}}', v.loc)
      .replace('{{lastmod}}', v.lastmod)
      .replace('{{changefreq}}', v.changefreq)
  }).join('')

  const sitemap = siteMapTemplate.replace('{{urlset}}', urlset)
  fs.writeFileSync(sitemapFilePath, sitemap)
}

interface MetaData {
  title: string
  description: string
  icon: string
  date: string
  tags: string[]
  path: string
}