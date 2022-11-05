
export const blogsDirPath = './blogs/'
export const distDirPath = './dist/'
export const resourceUrl = 'https://blog-bga.pages.dev'

export const sitemapFilePath = `${distDirPath}sitemap.xml`

export function getBlogDirFilePath (filePath: string): string {
  return `${blogsDirPath}${filePath}.md`
}

export function getDistDirFilePath (filePath: string): string {
  return `${distDirPath}${filePath}.json`
}

export function getDistPagingJsonPath (index: number): string {
  return `${distDirPath}page-${index}.json`
}

export function getDistTagsJsonPath (): string {
  return `${distDirPath}tags.json`
}
