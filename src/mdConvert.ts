import * as fs from 'fs'
import { marked } from 'marked'

import { blogsDirPath, distDirPath, getBlogDirFilePath, getDistDirFilePath, getDistPagingJsonPath, getDistTagsJsonPath, getHtmlFilePath } from './path.js'


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

    fs.writeFileSync(distDirFilePath, html)
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