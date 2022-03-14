const { CracoLessPlugin } = require('./plugins/craco-less')
const CracoSilence = require('./plugins/craco-silence')
const CracoCompatibility = require('./plugins/craco-compatibility')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoSilence,
    },
    {
      plugin: CracoCompatibility,
    },
  ],
}
