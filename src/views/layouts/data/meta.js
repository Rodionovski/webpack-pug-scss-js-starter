const description = 'Webpack starter project with Pug, Sass/SCSS and VanillaJS';
const title = 'Webpack starter project';

// Metadata.
// Each object contains attributes of meta tag.

module.exports = [
  // Robots meta tag, see https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
  { name: 'robots', content: 'index, follow' }, // enable crawling
  //{ name: 'robots', content: 'noindex, nofollow' }, // disable crawling

  // Disable hyperlink for tel. numbers in Safari and iOS
  { name: 'format-detection', content: 'telephone=no' },

  // basic SEO
  { name: 'description', content: description },
  { name: 'keywords', content: 'webpack, pug, scss, js' },
  { name: 'author', content: 'webdiscus' },

  // Open Graph, see https://ogp.me
  { property: 'og:type', content: 'website' },
  { property: 'og:locale', content: 'en_US' },
  { property: 'og:locale:alternate', content: 'de_DE' },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },

  // Twitter Cards, see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
  { property: 'twitter:title', content: title },
  { property: 'twitter:description', content: description },
];
