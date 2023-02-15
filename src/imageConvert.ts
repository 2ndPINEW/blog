import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';

await imageMin()

export async function imageMin (): Promise<void> {
	// jpg画像をpngにする、jpg対応ちゃんとしたほうが良いけど困ったら考える
	await imagemin(['assets/*.{jpg,jpeg}'], {
		destination: 'assets/',
		plugins: [
			imageminPngquant({quality: [1, 1]}),
		]
	});

	// png画像をwebpにする
  await imagemin(['assets/*.png'], {
		destination: 'assets/',
		plugins: [
			imageminWebp({quality: 100}),
		]
	})
}