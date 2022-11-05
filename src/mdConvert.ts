import * as fs from 'fs'
import { marked } from 'marked'
import { imageSize } from 'image-size'

import { blogsDirPath, distDirPath, getBlogDirFilePath, getDistDirFilePath, getDistPagingJsonPath, getDistTagsJsonPath, resourceUrl } from './path.js'


interface MetaData {
  title: string
  description: string
  icon: string
  date: string
  tags: string[]
  path: string
}

/**
 * マークダウンの記事をHTMLに変換してインデックス用のJSONを作る
 */
export function mdToHtmlAndJson (): void {
  markedImageTagRenderer()
  const fileNames = fs.readdirSync(blogsDirPath)
    .filter(filePath => filePath.endsWith('.md'))
    .map(fileName => fileName.replace('.md', ''))

  try {
    fs.mkdirSync(distDirPath)
  } catch {}

  const metaDatas: MetaData[] = []
  const tags: string[] = []

  fileNames.forEach(fileName => {
    const blogDirFilePath = getBlogDirFilePath(fileName)
    const distDirFilePath = getDistDirFilePath(fileName)

    const file = fs.readFileSync(blogDirFilePath, { encoding: "utf8" })

    const data = file.split('---metadata')
    if (data.length !== 2) {
      console.error(`Metadata reade error: ${fileName}`)
      process.exit(1)
    }

    const metaData: MetaData = JSON.parse(data[0])
    metaData.path = fileName
    
    metaDatas.push(metaData)

    const markdownData = data[1]
    const html = marked(markdownData)

    const pageData = {
      metaData: metaData,
      html: html
    }

    fs.writeFileSync(distDirFilePath, JSON.stringify(pageData))
  })

  metaDatas.forEach(metaData => {
    metaData.tags.forEach(metaDataTag => {
      const pushed = tags.some(tag => tag === metaDataTag)
      if (!pushed) {
        tags.push(metaDataTag)
      }
    })
  })

  fs.writeFileSync(getDistTagsJsonPath(), JSON.stringify( { tags }))

  metaDatas.reverse()

  fs.writeFileSync(getDistPagingJsonPath(0), JSON.stringify({ contents: metaDatas }))

  const splitArray = (array: any[], n: number) => array.reduce((a: any[], c: any[], i: number) => i % n == 0 ? [...a, [c]] : [...a.slice(0, -1), [...a[a.length - 1], c]], [])

  splitArray(metaDatas, 50).forEach((datas: MetaData[], index: number) => {
    fs.writeFileSync(getDistPagingJsonPath(index + 1), JSON.stringify({ contents: datas }))
  })
}

function markedImageTagRenderer (): void {
  const renderer = {
    image(href: string | null, title: string | null, text: string): string {
      if (!href) return ''

      const size = imageSize(`.${href}`)
      const width = size.width
      const height = size.height


      const pngUrl = `${resourceUrl}${href}`
      const webpUrl = `${resourceUrl}${href}`.replace('.png', '.webp')
  
      // srcset使いたいなー
      // <source width="720" height="404" type="image/webp" srcset="./img/header/big_banner-360.webp 360w, ./img/header/big_banner-480.webp 480w, ./img/header/big_banner-720.webp 720w, ./img/header/big_banner-960.webp 960w, ./img/header/big_banner-1280.webp 1280w, ./img/header/big_banner-1600.webp 1600w, ./img/header/big_banner-1920.webp 1920w">
      // <source width="720" height="404" type="image/png" srcset="./img/header/big_banner-360.png 360w, ./img/header/big_banner-480.png 480w, ./img/header/big_banner-720.png 720w, ./img/header/big_banner-960.png 960w, ./img/header/big_banner-1280.png 1280w, ./img/header/big_banner-1600.png 1600w, ./img/header/big_banner-1920.png 1920w">
      return `
        <picture>
          <source width="${width}" height="${height}" type="image/webp" srcset="${webpUrl}">
          <source width="${width}" height="${height}" type="image/png" srcset="${pngUrl}">
          <img src="${pngUrl}" alt="${title ?? text}" loading="lazy">
        </picture>`
    }
  }

  marked.use({ renderer })
}