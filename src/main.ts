import { mdToHtmlAndJson } from "./mdConvert.js";
import { imageMin } from "./imageConvert.js";
import * as fs from 'fs'
import { makeOgp } from "./makeOgp.js";

main ()

async function main () {
  mdToHtmlAndJson()
  await imageMin()
  await makeOgp()

  const file = fs.readFileSync('./src/_headers', { encoding: "utf8" })
  fs.writeFileSync('./dist/_headers', file)
}