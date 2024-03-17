The content is rendered from markdown file using the [:markdown](https://github.com/webdiscus/pug-loader) filter and CSS styles of GitHub.

The `:markdown` filter transform markdown to HTML and highlights code syntax.

This filter requires the additional [markdown-it](https://github.com/markdown-it/markdown-it), [prismjs](https://prismjs.com) and **parse5** modules:
```
npm install -D markdown-it prismjs parse5
```

Enable the `:markdown` filter in the Pug Plugin:
```js
const PugPlugin = require('pug-plugin');

module.exports = {
  plugins: [
    new PugPlugin({
      entry: {
        // the Pug tempalte containing a markdown
        index: 'src/views/markdown.pug', // => dist/index.html
      },
      // pug preprocessor options
      preprocessorOptions: {
        // enable build-in filter `:markdown`
        markdown: {
          highlight: {
            use: 'prismjs', // use the `prismjs` module as highlighter, must be installed
          },
        },
      },
    }),
  ],
};
```

The `highlight` options

| Option    |  Type   | Description                                                                                                                           |
|-----------|:-------:|---------------------------------------------------------------------------------------------------------------------------------------|
| `use`     | string  | The name of a highlighting npm module. The module must be installed. Currently, is supported the [prismjs](https://prismjs.com) only. |
| `verbose` | boolean | Enable output process info in console. Use it in development mode only. Defaults is false.                                            |


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
