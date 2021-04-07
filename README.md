This is a basic example of a "Next Post" button in a Next.js project with Prismic.

To bootstrap this project, download the folder and run `npm i`.

In `~/pages/index.js` and `~/pages/[uid].js`, replace the repo name and document type with your repo name and document type. Here's what that looks like in `~/pages/[uid].js`:

```js
// ~/pages/[uid].js

//...

// Replace api endpoint
const apiEndpoint = 'https://prismicio-docs-v3.cdn.prismic.io/api/v2'

// ...

export async function getStaticProps({ params }) {
  const { uid } = params

  // Replace `article` with your doc type

  const doc = await Client.getByUID('article', uid)
  console.log({ doc })
  const nextResponse = await Client.query(
    // Replace `article` with your doc type
    Prismic.Predicates.at('document.type', 'article'),
    {
      pageSize: 1,
      after: doc?.id,
      orderings: '[document.first_publication_date desc]',
    },
  )
  const prevResponse = await Client.query(
    // Replace `article` with your doc type
    Prismic.Predicates.at('document.type', 'article'),
    {
      pageSize: 1,
      after: doc?.id,
      orderings: '[document.first_publication_date]',
    },
  )
  const nextPost = nextResponse?.results[0] || null
  const prevPost = prevResponse?.results[0] || null
  return {
    props: {
      doc,
      nextPost,
      prevPost,
    },
  }
}

export async function getStaticPaths() {
  // If you have more than 100 documents, this function must be recursive
  const { results } = await Client.query(
    Prismic.Predicates.at('document.type', 'article'),
    {
      orderings: '[document.first_publication_date desc]',
    },
  )
  const paths = results.map((result) => {
    return {
      params: {
        uid: result.uid + '',
      },
    }
  })
  return {
    paths,
    fallback: false,
  }
}
```

### ⚠️ Warning

The `getStaticPaths` function in `~/pages/[uid].js` only generates paths for the first 100 documents of the provided type in your repo. If you have more than 100 documents of that type, you'll need to fetch them recursively. (Post on the Prismic forum for instruction on how to do this.)
