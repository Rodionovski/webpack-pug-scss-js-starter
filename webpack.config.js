const path = require('path');
const PugPlugin = require('pug-plugin');

// load constants from .env file
require('dotenv').config();

module.exports = (env, argv) => {
  const isDocs = env.docs === 'true';
  const isDev = argv.mode === 'development';

  const config = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'inline-source-map' : 'source-map',

    output: {
      path: path.join(__dirname, 'dist'), clean: true,
    },

    resolve: {
      alias: {
        // aliases used in sources
        '@views': path.join(__dirname, 'src/views/'),
        '@images': path.join(__dirname, 'src/assets/images/'),
        '@fonts': path.join(__dirname, 'src/assets/fonts/'),
        '@styles': path.join(__dirname, 'src/assets/styles/'),
        '@scripts': path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    plugins: [
      new PugPlugin({
        // automatically processing templates in the path
        entry: 'src/views/pages/',
        // modify output filename of generated html as you want
        filename: ({ chunk }) => {
          let [name] = chunk.name.split('/');
          if (name === 'home') name = 'index';
          return `${name}.html`;
        },

        // - OR - define pages manually (then disable the `filename` option)
        // entry: {
        //   404: 'src/views/pages/404.pug', // => dist/404.html
        //   index: 'src/views/pages/home/index.pug', // => dist/index.html
        //   icons: 'src/views/pages/icons/index.pug', // => dist/icons.html
        //   markdown: 'src/views/pages/markdown/index.pug', // => dist/markdown.html
        //   recipes: 'src/views/pages/recipes/index.pug', // => dist/recipes.html
        // },

        js: {
          // JS output filename, used if `inline` option is false (defaults)
          filename: 'js/[name].[contenthash:8].js',
          //inline: true, // inlines JS into HTML
        },
        css: {
          // CSS output filename, used if `inline` option is false (defaults)
          filename: 'css/[name].[contenthash:8].css',
          //inline: true, // inlines CSS into HTML
        },

        preprocessorOptions: {
          // enable build-in filters only those used in templates
          embedFilters: {
            // enable the `:escape` filter
            escape: true,
            // enable the `:code` filter
            code: {
              className: 'language-',
            },
            // enable `:highlight` filter
            highlight: {
              use: 'prismjs', // use the `prismjs` module as highlighter, must be installed
              verbose: isDev,
            },
            // enable `:markdown` filter
            markdown: {
              highlight: {
                use: 'prismjs', // use the `prismjs` module as highlighter, must be installed
                verbose: isDev,
              },
            },
          },
        },
        //verbose: 'auto', // output process information to console
      }),
    ],

    module: {
      rules: [
        // styles
        {
          test: /\.(css|sass|scss)$/, use: ['css-loader', 'sass-loader'],
        },

        // images
        {
          test: /\.(png|jpe?g|svg|webp|ico)$/i,
          oneOf: [
            // inline image using `?inline` query
            {
              resourceQuery: /inline/, type: 'asset/inline',
            },
            // auto inline by image size
            {
              type: 'asset', parser: {
                dataUrlCondition: {
                  maxSize: 2048,
                },
              },
              generator: {
                filename: 'img/[name].[hash:8][ext]',
              },
            },
          ],
        },

        // fonts
        {
          test: /\.(woff(2)?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          include: /assets\/fonts|node_modules/, // fonts from `assets/fonts` or `node_modules` directory only
          generator: {
            // generates filename including last directory name to group fonts by name
            filename: (pathData) => `fonts/${path.basename(
              path.dirname(pathData.filename))}/[name][ext][query]`,
          },
        },
      ],
    },

    performance: {
      hints: isDev ? 'warning' : 'error',
      // in development mode the size of entrypoint and assets is bigger than in production
      maxEntrypointSize: (isDev ? 15000 : 5000) * 1024,
      maxAssetSize: (isDev ? 10000 : 5000) * 1024,
    },

    stats: {
      colors: true, // see https://webpack.js.org/configuration/stats/#stats-presets
      preset: isDev ? 'minimal' : 'errors-only', // enable @debug output
      loggingDebug: isDev ? ['sass-loader'] : [],
    },
  };

  if (isDev) {
    config.devServer = {
      static: path.join(process.cwd(), './dist'),
      watchFiles: {
        paths: ['src/**/*.*', 'README.md'],
        options: {
          usePolling: true,
        },
      },

      open: true,
      compress: true,

      // usage https with own certificates
      // define the APP_SSL_KEY and APP_SSL_CERT in .env file
      // https: {
      //   key: fs.readFileSync(process.env.APP_SSL_KEY),
      //   cert: fs.readFileSync(process.env.APP_SSL_CERT),
      // },

      // enable CORS
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Cross-Origin-Opener-Policy': 'same-origin',
      //   'Cross-Origin-Embedder-Policy': 'require-corp',
      // },

      // required for react router
      //historyApiFallback: true,

      // rewrite rules
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.html' },
          { from: /./, to: '/404.html' },
        ],
      },
    };

    config.watchOptions = {
      //aggregateTimeout: 1000,
      ignored: ['**/node_modules'],
    };
  }

  if (isDocs) {
    // generate docs for github.io
    config.output.path = path.join(__dirname, 'docs');
  }

  return config;
};
