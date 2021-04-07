import React from 'react'
import Link from 'next/link'
import Prismic from '@prismicio/client'
import { Date, RichText } from 'prismic-reactjs'

const apiEndpoint = 'https://prismicio-docs-v3.cdn.prismic.io/api/v2'

const Client = Prismic.client(apiEndpoint)

const linkResolver = (doc) => {
  return '/' + doc.uid
}

export default function Home({ doc, nextPost }) {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <div>{RichText.asText(doc?.data?.title)}</div>
      <Link href={'/' + nextPost?.uid}>Next</Link>
    </div>
  )
}

export async function getStaticProps() {
  const response = await Client.query(
    // Replace `article` with your doc type
    Prismic.Predicates.at('document.type', 'article'),
    { orderings: '[document.first_publication_date desc]' },
  )
  const doc = response.results[0]
  const nextPost = ( // Replace `article` with your doc type
    await Client.query(Prismic.Predicates.at('document.type', 'article'), {
      pageSize: 1,
      after: doc.id,
      orderings: '[document.first_publication_date desc]',
    })
  ).results[0]

  return {
    props: {
      doc,
      nextPost,
    },
  }
}
