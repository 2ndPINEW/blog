import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';

export async function imageMin (): Promise<void> {
  await imagemin(['assets/*.{jpg,png,jpeg}'], {
		destination: 'dist/assets',
		plugins: [
			imageminWebp({quality: 100}),
		]
	})

	await imagemin(['assets/*.{jpg,png,jpeg}'], {
		destination: 'dist/assets',
		plugins: [
			imageminPngquant({quality: [1, 1]}),
		]
	});
}