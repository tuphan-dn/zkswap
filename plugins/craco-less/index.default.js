/**
 * Credit https://github.com/DocSpring/craco-less
 * This modification to let craco-less to work with webpack 5
 * file-loader is no longer available in webpack 5
 * look for asset/resource instead of file-loader
 */

const path = require('path')
const { deepClone, styleRuleByName } = require('./utils')

const pathSep = path.sep
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  const { throwUnexpectedConfigError } = require('@craco/craco')

  const throwError = (message, githubIssueQuery) =>
    throwUnexpectedConfigError({
      packageName: 'craco-less',
      githubRepo: 'DocSpring/craco-less',
      message,
      githubIssueQuery,
    })

  pluginOptions = pluginOptions || {}

  const createLessRule = ({ baseRule, overrideRule }) => {
    baseRule = deepClone(baseRule)
    let lessRule = {
      ...baseRule,
      ...overrideRule,
      use: [],
    }

    const loaders = baseRule.use
    loaders.forEach((ruleOrLoader) => {
      let rule
      if (typeof ruleOrLoader === 'string') {
        rule = {
          loader: ruleOrLoader,
          options: {},
        }
      } else {
        rule = ruleOrLoader
      }

      if (
        (context.env === 'development' || context.env === 'test') &&
        rule.loader.includes(`${pathSep}style-loader${pathSep}`)
      ) {
        lessRule.use.push({
          loader: rule.loader,
          options: {
            ...rule.options,
            ...(pluginOptions.styleLoaderOptions || {}),
          },
        })
      } else if (rule.loader.includes(`${pathSep}css-loader${pathSep}`)) {
        lessRule.use.push({
          loader: rule.loader,
          options: {
            ...rule.options,
            ...(pluginOptions.cssLoaderOptions || {}),
          },
        })
      } else if (rule.loader.includes(`${pathSep}postcss-loader${pathSep}`)) {
        lessRule.use.push({
          loader: rule.loader,
          options: {
            ...rule.options,
            ...(pluginOptions.postcssLoaderOptions || {}),
          },
        })
      } else if (
        rule.loader.includes(`${pathSep}resolve-url-loader${pathSep}`)
      ) {
        lessRule.use.push({
          loader: rule.loader,
          options: {
            ...rule.options,
            ...(pluginOptions.resolveUrlLoaderOptions || {}),
          },
        })
      } else if (
        context.env === 'production' &&
        rule.loader.includes(`${pathSep}mini-css-extract-plugin${pathSep}`)
      ) {
        lessRule.use.push({
          loader: rule.loader,
          options: {
            ...rule.options,
            ...(pluginOptions.miniCssExtractPluginOptions || {}),
          },
        })
      } else if (rule.loader.includes(`${pathSep}sass-loader${pathSep}`)) {
        lessRule.use.push({
          loader: require.resolve('less-loader'),
          options: {
            ...rule.options,
            ...pluginOptions.lessLoaderOptions,
          },
        })
      } else {
        throwError(
          `Found an unhandled loader in the ${context.env} webpack config: ${rule.loader}`,
          'webpack+unknown+rule',
        )
      }
    })

    return lessRule
  }

  const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf)
  if (!oneOfRule) {
    throwError(
      "Can't find a 'oneOf' rule under module.rules in the " +
        `${context.env} webpack config!`,
      'webpack+rules+oneOf',
    )
  }

  const sassRule = oneOfRule.oneOf.find(styleRuleByName('scss|sass', false))
  if (!sassRule) {
    throwError(
      "Can't find the webpack rule to match scss/sass files in the " +
        `${context.env} webpack config!`,
      'webpack+rules+scss+sass',
    )
  }
  let lessRule = createLessRule({
    baseRule: sassRule,
    overrideRule: {
      test: lessRegex,
      exclude: lessModuleRegex,
    },
  })

  if (pluginOptions.modifyLessRule) {
    lessRule = pluginOptions.modifyLessRule(lessRule, context)
  }

  const sassModuleRule = oneOfRule.oneOf.find(
    styleRuleByName('scss|sass', true),
  )
  if (!sassModuleRule) {
    throwError(
      "Can't find the webpack rule to match scss/sass module files in the " +
        `${context.env} webpack config!`,
      'webpack+rules+scss+sass',
    )
  }
  let lessModuleRule = createLessRule({
    baseRule: sassModuleRule,
    overrideRule: {
      test: lessModuleRegex,
    },
  })

  if (pluginOptions.modifyLessModuleRule) {
    lessModuleRule = pluginOptions.modifyLessModuleRule(lessModuleRule, context)
  }

  let assetResourceIndex = oneOfRule.oneOf.findIndex(
    (rule) => rule.type === 'asset/resource',
  )
  if (assetResourceIndex === -1) {
    throwError(
      `Can't find asset/resource in the ${context.env} webpack config!`,
      'webpack+asset/resource',
    )
  }

  oneOfRule.oneOf.splice(assetResourceIndex, 0, lessRule, lessModuleRule)

  return webpackConfig
}

module.exports = { overrideWebpackConfig }
