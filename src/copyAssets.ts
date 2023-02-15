import fse from 'fs-extra'

export async function copyAssets () {
  await fse.copySync("assets","dist/assets")
}