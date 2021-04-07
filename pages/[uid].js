import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Prismic from '@prismicio/client'
import { Date, RichText } from 'prismic-reactjs'

const apiEndpoint = 'https://prismicio-docs-v3.cdn.prismic.io/api/v2'

const Client = Prismic.client(apiEndpoint)

const linkResolver = (doc) => {
  return '/' + doc.uid
}

export default function Page({ doc, nextPost, prevPost }) {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <div>{RichText.asText(doc?.data?.title)}</div>
      {prevPost && <Link href={'/' + prevPost?.uid}>Back</Link>}
      {nextPost && <Link href={'/' + nextPost?.uid}>Next</Link>}
    </div>
  )
}

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
