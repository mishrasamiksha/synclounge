const path = require('path');
const git = require('git-rev-sync');

const saveConfig = require('./config');

const config = saveConfig('public/config.json');
console.log(config);

process.env.VUE_APP_VERSION = require('./package.json').version;

try {
  process.env.VUE_APP_GIT_HASH = git.short();
  process.env.VUE_APP_GIT_DATE = git.date().toISOString();
} catch (e) {
  // Sometimes on CI stuff they build with .git being present
  // TODO: find better way to do this
  process.env.VUE_APP_GIT_DATE = new Date().toISOString();
  console.log('env', process.env);

  if (process.env.SOURCE_COMMIT) {
    process.env.VUE_APP_GIT_HASH = process.env.SOURCE_COMMIT.substring(0, 7);
  }
}

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-eval-source-map',
    resolve: {
      alias: {
        // Alias @ to /src folder for ES/TS imports
        '@': path.join(__dirname, '/src'),
      },
    },
    node: false,
  },

  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false,
  //     analyzerMode: 'server',
  //   },
  // },

  css: {
    extract: process.env.NODE_ENV === 'production' ? {
      ignoreOrder: true,
    } : false,
  },
};
