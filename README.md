This is a basic example of a "Next Post" button in a Next.js project with Prismic.

To bootstrap this project, download the folder and run `npm i`.

In `~/pages/index.js` and `~/pages/[uid].js`, replace the repo name and document type with your repo name and document type:

```js
// replace api endpoint
const apiEndpoint = 'https://prismicio-docs-v3.cdn.prismic.io/api/v2'

// ...

export async function getStaticProps({ params }) {
  // replace document type ("article")
  const response = await Client.query(
    Prismic.Predicates.at('document.type', 'article'),
  )
  const doc = response.results[0]
  const nextPost = // replace document type ("article")
  (
    await Client.query(Prismic.Predicates.at('document.type', 'article'), {
      pageSize: 1,
      after: doc.id,
      orderings: '[my.post.date]',
    })
  ).results[0]

  // ...
}
```
