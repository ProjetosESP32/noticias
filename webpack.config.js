const { join } = require('path')
const Encore = require('@symfony/webpack-encore')

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev')
}

Encore.setOutputPath('./public/assets')
Encore.setPublicPath('/assets')
Encore.addEntry('app', './resources/js/app.js')
Encore.addEntry('news', './resources/js/news.js')

Encore.enablePostCssLoader()

Encore.splitEntryChunks()
Encore.enableSingleRuntimeChunk()
Encore.cleanupOutputBeforeBuild()

Encore.enableBuildCache({
  config: [__filename],
})

Encore.enableSourceMaps(!Encore.isProduction())
Encore.enableVersioning(Encore.isProduction())

Encore.configureDevServerOptions(options => {
  /**
   * Normalize "options.static" property to an array
   */
  if (!options.static) {
    options.static = []
  } else if (!Array.isArray(options.static)) {
    options.static = [options.static]
  }

  /**
   * Enable live reload and add views directory
   */
  options.liveReload = true
  options.static.push({
    directory: join(__dirname, './resources/views'),
    watch: true,
  })
})

const config = Encore.getWebpackConfig()
config.infrastructureLogging = {
  level: 'warn',
}
config.stats = 'errors-warnings'

module.exports = config
