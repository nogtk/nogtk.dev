import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import markdownHtml from '../../lib/markdownHtml'
import type PostType from '../../interfaces/post'
import BlogTitle from '../../components/blog-title'
import Script from 'next/script'
import { NextSeo } from 'next-seo'

type Props = {
  post: PostType
}

export default function Post({ post }: Props) {
  const router = useRouter()
  const title = post.title
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Container>
        <BlogTitle />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <NextSeo
              title = {title}
              description = {post.excerpt || 'blog post'}
              openGraph = {{
                title: title,
                url: `https://nogtk.dev/posts/${post.slug}`,
                type: 'article',
                article: {
                  publishedTime: post.date,
                  authors: ['https://twitter.com/_nogtk_']
                },
                images: [
                  {
                    url: `https://res.cloudinary.com/di1lterwq/image/upload/l_text:TakaoPGothic_70:${title},co_rgb:000,w_900,c_fit/v1684028422/ogp_sample3_e9gwlv.png`
                  }
                ]
              }}
            />
            <article className="mb-32">
              <Head>
                <Script src="https://embed.zenn.studio/js/listen-embed-event.js" />
              </Head>
              <PostHeader
                title={post.title}
                date={post.date}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'ogImage',
  ])
  const content = markdownHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
