import * as fs from 'fs'
import nodeHtmlToImage from 'node-html-to-image'
import font2base64 from 'node-font2base64'

import { blogsDirPath, getBlogDirFilePath } from './path.js';

const regular = font2base64.encodeToDataUrlSync('./fonts/NotoSerifJP-Bold.otf')
const medium = font2base64.encodeToDataUrlSync('./fonts/NotoSerifJP-Medium.otf')
const bold = font2base64.encodeToDataUrlSync('./fonts/NotoSerifJP-Bold.otf')

const template  = `
<html>
<head>
  <style>
    @font-face {
      font-family: 'roboto';
      src: url(${regular}) format('opentype');
      src: url(${medium}) format('opentype');
      src: url(${bold}) format('opentype');
    }
    body {
      width: 1200px;
      height: 630px;
    }

    .title {
      color: #707070;
      font-size: 64px;
      padding: 32px;
      word-break: break-all;
      font-weight: bold;
      font-family: 'roboto';
    }

    .footer {
      background-color: #E3E4DB;
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 32px 48px;
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
      width: 1104px;
    }

    .footer-logo {
      width: 48px;
      height: 48px;
    }

    .footer-title {
      margin-left: 16px;
      color: #707070;
      font-size: 48px;
      font-weight: bold;
      font-family: 'roboto';
    }
  </style>
</head>
<body>
  <div class="title">{{title}}</div>
  <div class="footer">
    <img src="{{logo}}" class="footer-logo"/>
    <div class="footer-title">pi</div>
  </div>
</body>
</html>`

export async function makeOgp (): Promise<void> {
  const fileNames = fs.readdirSync(blogsDirPath)
    .filter(filePath => filePath.endsWith('.md'))
    .map(fileName => fileName.replace('.md', ''))

  const logo = fs.readFileSync('./assets/logo.png');
  const base64Image: string = Buffer.from(logo).toString('base64');
  const logoDataURI = 'data:image/png;base64,' + base64Image

  const tags: string[] = []

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
      const pushed = tags.some(tag => tag === metaDataTag)
      if (!pushed) {
        tags.push(metaDataTag)
      }
    })

    return {
      output: `./dist/${fileName}-og.png`,
      title: metaData.title,
      logo: logoDataURI
    }
  })

  tags.forEach(tag => {
    data.push(
      {
        output: `./dist/${tag}-og.png`,
        title: `${tag} の記事一覧`,
        logo: logoDataURI
      }
    )
  })

  data.push({
    output: `./dist/index-og.png`,
    title: '日報とか学んだこととかメモ',
    logo: logoDataURI
  })

  await nodeHtmlToImage({
    html: template,
    content: data
  })
}

interface MetaData {
  title: string
  description: string
  icon: string
  date: string
  tags: string[]
  path: string
}