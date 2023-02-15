import { mdToHtmlAndJson } from "./mdConvert.js";
import * as fs from 'fs'
import { generateSitemap } from "./sitemap.js";
import { copyAssets } from "./copyAssets.js";

main ()

async function main () {
  mdToHtmlAndJson()
  generateSitemap()
  await copyAssets()

  const file = fs.readFileSync('./src/_headers', { encoding: "utf8" })
  fs.writeFileSync('./dist/_headers', file)
}