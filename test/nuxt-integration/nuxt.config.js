export default {
  mode: 'universal',
  modern: 'client',
  srcDir: 'src/',
  build: {
    extractCSS: true,
    filenames: {
      app: ({ isModern }) => `${!isModern ? 'legacy-' : ''}[name].js`,
      chunk: ({ isModern }) => `${!isModern ? 'legacy-' : ''}[name].js`,
      css: () => '[name].css'
    },
  }
}
