export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, user-scalable=no',
			title: 'Comodoro',
			meta: [
				{
					name: 'description',
					content: 'another pomodoro timer app.',
				},
				{
					name: 'theme-color',
					content: '#000000',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: '/favicon.svg',
				},
			],
		},
	},
	compatibilityDate: '2024-07-03',
	css: [
		'@/assets/styles/fonts/geist.css',
		'@/assets/styles/app.css',
	],
	devtools: { enabled: false },
	eslint: {
		config: {
			standalone: false,
		},
	},
	experimental: {
		typedPages: true,
	},
	future: {
		compatibilityVersion: 4,
	},
	imports: {
		dirs: [
			'./icons',
		],
	},
	modules: ['@nuxt/eslint', '@vueuse/nuxt', '@pinia/nuxt'],
	postcss: {
		plugins: {
			'@tailwindcss/postcss': {},
		},
	},

	typescript: {
		strict: true,
	},
})
