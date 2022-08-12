const path = require('path');
const PugPlugin = require('pug-plugin');

const loaders = require('./webpack/loaders');
const devServer = require('./webpack/devServer');

module.exports = (env, argv) => {
  const isDocs = env.docs === 'true';
  const isProd = argv.mode === 'production';

  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: 'auto',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
      chunkFilename: 'assets/js/[id].[contenthash:8].js',
      clean: true,
    },

    resolve: {
      // aliases used in sources
      alias: {
        Root: __dirname,
        Src: path.join(__dirname, 'src/'),
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/assets/images/'),
        Fonts: path.join(__dirname, 'src/assets/fonts/'),
        Styles: path.join(__dirname, 'src/assets/styles/'),
        Scripts: path.join(__dirname, 'src/assets/scripts/'),
      },
      // resolve omitted extensions
      extensions: ['.js', '.ts'],
    },

    entry: {
      // !!! ATTENTION !!!
      //
      // The pug-plugin enable to use script and style source files directly in Pug, so easy:
      //
      //   link(href=require('./styles.scss') rel='stylesheet')
      //   script(src=require('./main.js'))
      //
      // Don't define styles and js files in entry. You can require source files of js and scss directly in Pug.
      // Don't use `html-webpack-plugin` to render Pug files in HTML. Pug plugin do it directly from here and much faster.
      // Don't use `mini-css-extract-plugin` to extract CSS from styles. Pug plugin extract CSS from style sources required in Pug.

      // Please, see more details under https://github.com/webdiscus/pug-plugin

      // Define Pug files directly in entry:
      404: 'src/views/pages/404.pug',
      index: 'src/views/pages/home/index.pug',
      icons: 'src/views/pages/icons/index.pug',
      markdown: 'src/views/pages/markdown/index.pug',
      recipes: 'src/views/pages/recipes/index.pug',
    },

    plugins: [
      // enable processing of Pug files from entry
      new PugPlugin({
        verbose: !isProd, // output information about the process to console
        pretty: !isProd, // output formatted HTML
        // extract CSS from style source files specified directly in Pug
        extractCss: {
          // output filename of styles
          filename: 'assets/css/[name].[contenthash:8].css',
        },
      }),
    ],

    module: {
      rules: [
        // pug
        loaders.pugLoader({
          // enable filters only those used in pug
          embedFilters: {
            // :escape
            escape: true,
            // :code
            code: {
              className: 'language-',
            },
            // :highlight
            highlight: {
              verbose: !isProd,
              use: 'prismjs', // name of highlighting npm package, must be installed
            },
            // :markdown
            markdown: {
              highlight: {
                verbose: !isProd,
                use: 'prismjs', // name of highlighting npm package, must be installed
              },
            },
          },
        }),

        // styles
        loaders.sassLoader(),

        // images
        loaders.imageLoader(),

        // inline images by size (to force inline use the `?inline` query)
        ...loaders.inlineImageLoader(2 * 1024),

        // fonts
        loaders.fontLoader(
          // generates filename including last directory name to group fonts by name
          (pathData) => `assets/fonts/${path.basename(path.dirname(pathData.filename))}/[name][ext][query]`
        ),
      ],
    },

    performance: {
      hints: isProd ? 'error' : 'warning',
      // in development mode the size of entrypoint and assets is bigger than in production
      maxEntrypointSize: (isProd ? 3000 : 15000) * 1024,
      maxAssetSize: (isProd ? 3000 : 4000) * 1024,
    },

    stats: {
      colors: true,
      // see https://webpack.js.org/configuration/stats/#stats-presets
      preset: isProd ? 'errors-only' : 'minimal',
      // enable @debug output
      loggingDebug: isProd ? [] : ['sass-loader'],
    },
  };

  if (!isProd) {
    config.devServer = devServer;
    config.watchOptions = {
      //aggregateTimeout: 1000,
      ignored: ['**/node_modules'],
    };
  }

  if (isDocs) {
    config.output.path = path.join(__dirname, 'docs');
    config.output.publicPath = '/webpack-starter-pug-scss-js/';
  }

  return config;
};
