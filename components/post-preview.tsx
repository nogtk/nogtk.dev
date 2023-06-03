import DateFormatter from './date-formatter'
import Link from 'next/link'

type Props = {
  title: string
  date: string
  excerpt: string
  slug: string
}

const PostPreview = ({
  title,
  date,
  excerpt,
  slug,
}: Props) => {
  return (
    <div className="flex flex-col items-center border-b-4">
      <h3 className="text-3xl leading-snug justify-center mb-2">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline text-blue-600"
        >
          {title}
        </Link>
      </h3>
      <div className="text-md">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-md leading-relaxed mb-4">{excerpt}</p>
    </div>
  )
}

export default PostPreview
