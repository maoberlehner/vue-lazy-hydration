const path = require('path'); // eslint-disable-line

module.exports = {
	resolve: {
		extensions: ['.js', '.ts', '.json', '.vue'],
		alias: {
			'/': path.resolve(__dirname, './src/static'),
			'~': path.resolve(__dirname, './src'),
			// '~~': path.resolve(__dirname, './'),
			'@': path.resolve(__dirname, './src'),
			'@@': path.resolve(__dirname, './'),
			assets: path.resolve(__dirname, './src/assets'),
			'~assets': path.resolve(__dirname, './src/assets'),
			'~/assets': path.resolve(__dirname, './src/assets'),
			static: path.resolve(__dirname, './src/static')
		},
		modules: [
			'node_modules',
			path.resolve(__dirname, './node_modules'),
			path.resolve(__dirname, './node_modules/nuxt/node_modules')
		]
	}
};
