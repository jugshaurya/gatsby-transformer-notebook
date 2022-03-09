# gatsby-transformer-notebook
<!-- See it in action: <https://gatsby-contrib.github.io/gatsby-transformer-notebook/> -->

- How I created and you can also
https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/creating-a-transformer-plugin/

- What do transformer plugins do?
Transformer plugins “transform” data of one type into another type
a transformer plugin is a normal npm package. It has a package.json file with optional dependencies as well as a gatsby-node.js file where you implement Gatsby’s Node.js APIs.


gatsby-transformer-notebook is transformer plugin that looks for new nodes with a media type of .ipynb (e.g. a notebook file) and creates new Notebook child node(s) by parsing the notebook source into JavaScript objects.

- template used for creating
https://github.com/gatsbyjs/gatsby/tree/817a6c14543c73ea8f56c9f93d401b03adb44e9d/packages/gatsby-source-wikipedia
// TODO
<!-- Code-Highlighting -->
<!-- https://www.npmjs.com/package/notebookjs -->


## Install

`npm install --save @gatsby-contrib/gatsby-transformer-notebook`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    `@gatsby-contrib/gatsby-transformer-notebook`
  ];
}
```

## How to query

```graphql
{
  file(fields: { slug: { eq: $slug } }) {
    fields {
      slug
      shauJupyter
    }
    childJupyterBook {
      html
      fileAbsolutePath
      metadata {
        kernelspec {
          display_name
          language
          name
        }
        language_info {
          codemirror_mode {
            name
            version
          }
          mimetype
          file_extension
          name
          nbconvert_exporter
          pygments_lexer
          version
        }
      }
    }
  }
}
```

## How it works behind the scene ?

- It filters out the files with the `ipynb` extension.
- Each notebook file is parsed into a node of type `JupyterNotebook` along with additional fields to the `JupyterNotebook` GraphQL type such as:
  - `html`: html string
-   `metadata`: jupyter notebooks can embed metadata to indicate authors, titles...
-   `json`: the json notebook code converted into a javascript object with `JSON.parse`.
-   `internal.content`: contains the raw notebook code.

### How to render

```react
export default function ReactComponent({ data }) {
  const html = data.file.childJupyterBook.html;
  const title = data.file.childJupyterBook.fileAbsolutePath.split('/');
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    ></div>
  );
}
```
