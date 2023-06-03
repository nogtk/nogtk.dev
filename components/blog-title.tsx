import Link from 'next/link'
import BlogTitleLinks from './blog-title-links'

const BlogTitle = () => {
  return (
    <div className="w-max m-auto mb-8">
      <h2 className="text-3xl mt-8 mb-4 font-bold flex justify-center">
        <Link href="/" className="hover:underline">
          nogtk.dev 👕
        </Link>
      </h2>
      <BlogTitleLinks />
    </div>
  )
}

export default BlogTitle
