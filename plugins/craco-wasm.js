/**
 * WebAssembly loader for Webpack 5
 */

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  const wasmExtensionRegExp = /\.wasm$/
  // Add additional extension for WASM and enable WASM
  webpackConfig.resolve.extensions.push('.wasm')
  webpackConfig.experiments = { asyncWebAssembly: true }
  // Exclude the extension from asset/resource
  const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf)
  if (!oneOfRule) {
    throw new Error(
      `Can't find a 'oneOf' rule under module.rules in the ${context.env} webpack config!`,
      'webpack+rules+oneOf',
    )
  }
  let assetResourceIndex = oneOfRule.oneOf.findIndex(
    (rule) => rule.type === 'asset/resource',
  )
  if (!oneOfRule.oneOf[assetResourceIndex].exclude)
    oneOfRule.oneOf[assetResourceIndex].exclude = []
  oneOfRule.oneOf[assetResourceIndex].exclude.push(wasmExtensionRegExp)
  // Add the wasm loader
  const wasmLoader = {
    test: wasmExtensionRegExp,
    exclude: /node_modules/,
    use: [{ loader: 'wasm-loader' }], // Webpack 5 natively supports wasm-loader
    type: 'webassembly/async',
  }
  oneOfRule.oneOf.splice(assetResourceIndex, 0, wasmLoader)
  return webpackConfig
}

module.exports = { overrideWebpackConfig }
