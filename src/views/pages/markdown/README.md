The content is rendered from markdown file using the [:markdown](https://github.com/webdiscus/pug-loader) filter and CSS styles of GitHub.

The `:markdown` filter transform markdown to HTML and highlights code syntax.

This filter requires the [markdown-it](https://github.com/markdown-it/markdown-it) and [prismjs](https://prismjs.com) modules:
```
npm install -D markdown-it prismjs
```

Enable the filter for the Pug rule in _webpack config_:
```js
const PugPlugin = require('pug-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
          // enable embedded filters
          embedFilters: {
            // enable :markdown filter
            markdown: {
              // enable highlighting in markdown
              highlight: {
                verbose: true,
                use: 'prismjs',
              },
            },
          },
        },
      },
    ],
  },
};
```

The `highlight` options

| Option    |  Type   | Description                                                                                                                           |
|-----------|:-------:|---------------------------------------------------------------------------------------------------------------------------------------|
| `verbose` | boolean | Enable output process info in console. Use it in development mode only. Defaults is false.                                            |
| `use`     | string  | The name of a highlighting npm module. The module must be installed. Currently, is supported the [prismjs](https://prismjs.com) only. |


## Usage of markdown as plain text
```pug
  :markdown
    _HTML_
    ```html
    <!-- Comment -->
    <div class="container">
      <p>Paragraph</p>
    </div>
    ```
    _JavaScript_
    ```js
    const arr = [1, 2, 'banana'];
    ```
```

Display highlighted code blocks:

> _HTML_
> ```html
> <!-- Comment -->
> <div class="container">
>   <p>Paragraph</p>
> </div>
> ```
> _JavaScript_
> ```js
> const arr = [1, 2, 'banana'];
> ```

## Usage of markdown as included file

```pug
h1 Markdown
include:markdown ./README.md
```

💡 For more information and examples, see the [:markdown](https://webdiscus.github.io/pug-loader/pug-filters/markdown.html) site.
