import * as fs from 'fs'
import { getBlogDirFilePath } from './path';

const template  = `{
  "title": "MM/DDの記事",
  "description": "MM/DDの記事のサンプルです。説明文がここに入ります",
  "icon": "/assets/test.png",
  "date": "YYYY/MM/DD",
  "tags": ["Astro", "Hugo", "Sample"]
}
---metadata

# hoge
hogehoge

## today
YYYY/MM/DD

![img](/assets/test.png)`

export function makeTemplates (): void {
  const startDate = new Date("2021-04-14");
  const endDate = new Date("2022-04-24");
 
  for(let d = startDate; d <= endDate; d.setDate(d.getDate()+1)) {
    const year = d.getFullYear().toString()
    const month = ('00' + (d.getMonth() + 1)).slice(-2)
    const date = ('00' + d.getDate()).slice(-2)
    const blogDirFilePath = getBlogDirFilePath(`${year}${month}${date}`)

    const md = template
      .replaceAll('YYYY', year)
      .replaceAll('MM', month)
      .replaceAll('DD', date)

    fs.writeFileSync(blogDirFilePath, md)
  }
}