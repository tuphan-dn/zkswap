/**
 * Disable warnings & Minimal logs
 */

const path = require('path')

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  // Disable verbose stat
  webpackConfig.stats = 'errors-only'
  // Disable "Failed to parse source map"
  const pathSep = path.sep
  webpackConfig.module.rules.forEach((rule) => {
    if (rule.loader?.includes(`${pathSep}source-map-loader${pathSep}`)) {
      const { exclude } = rule
      if (typeof exclude === 'array') exclude.push(/node_modules/)
      else rule.exclude = [exclude, /node_modules/]
    }
  })
  return webpackConfig
}

const overrideDevServerConfig = ({
  devServerConfig,
  cracoConfig,
  pluginOptions,
  context,
}) => {
  devServerConfig.client.overlay = {
    warnings: false,
    errors: true,
  }
  return devServerConfig
}

module.exports = { overrideWebpackConfig, overrideDevServerConfig }
