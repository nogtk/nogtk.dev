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
            <article className="mb-32">
              <Head>
                <title>{title}</title>
                /* TODO: Refactor as Component (try to next-seo) */
                <meta property="og:image" content={`https://res.cloudinary.com/di1lterwq/image/upload/l_text:TakaoPGothic_70:${title},co_rgb:000,w_900,c_fit/v1684028422/ogp_sample3_e9gwlv.png`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="og:title" content="nogtk.dev" />
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
