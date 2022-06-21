const path = require('path');

// load constants from .env file
require('dotenv').config();

module.exports = {
  static: {
    directory: path.join(process.cwd(), './dist'),
  },

  watchFiles: {
    paths: ['src/**/*.*', 'README.md'],
    options: {
      usePolling: true,
    },
  },

  devMiddleware: {
    // use it for debug of generating assets only
    //writeToDisk: true,
  },

  // open in default browser
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
      {from: /^\/$/, to: '/index.html'},
      {from: /./, to: '/404.html'},
    ],
  },
};
