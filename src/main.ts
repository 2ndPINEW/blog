import { mdToHtmlAndJson } from "./mdConvert.js";
import { imageMin } from "./imageConvert.js";
import * as fs from 'fs'

main ()

async function main () {
  mdToHtmlAndJson()
  await imageMin()

  const file = fs.readFileSync('./src/_headers', { encoding: "utf8" })
  fs.writeFileSync('./dist/_headers', file)
}