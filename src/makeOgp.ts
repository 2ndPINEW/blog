import * as fs from 'fs'
import nodeHtmlToImage from 'node-html-to-image';

import { blogsDirPath, getBlogDirFilePath } from './path.js';


const template  = `
<html>
<head>
  <style>
    body {
      width: 1200px;
      height: 630px;
    }

    .title {
      color: #707070;
      font-size: 64px;
      padding: 32px;
      word-break: break-all;
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

  for await (const fileName of fileNames) {
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

    await nodeHtmlToImage({
      output: `./dist/${fileName}-og.png`,
      html: template,
      content: {
        title: metaData.title,
        logo: logoDataURI
      }
    }) 
  }

  for await (const tag of tags) {
    await nodeHtmlToImage({
      output: `./dist/${tag}-og.png`,
      html: template,
      content: {
        title: `${tag} の記事一覧`,
        logo: logoDataURI
      }
    }) 
  }

  await nodeHtmlToImage({
    output: `./dist/index-og.png`,
    html: template,
    content: {
      title: 'blog',
      logo: logoDataURI
    }
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