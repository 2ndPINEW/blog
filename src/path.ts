
export const blogsDirPath = './blogs/'
export const distDirPath = './dist/'

export function getBlogDirFilePath (filePath: string): string {
  return `${blogsDirPath}${filePath}.md`
}

export function getDistDirFilePath (filePath: string): string {
  return `${distDirPath}${filePath}.html`
}

export function getHtmlFilePath (filePath: string): string {
  return `/${filePath}.html`
}

export function getDistPagingJsonPath (index: number): string {
  return `${distDirPath}page-${index}.json`
}

export function getDistTagsJsonPath (): string {
  return `${distDirPath}tags.json`
}