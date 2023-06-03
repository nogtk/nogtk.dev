import Link from "next/link";

const BlogTitleLinks = () => {
  return (
    <div className="flex justify-center">
      <Link href="/" className="hover:underline">Home</Link>
    </div>
  )
}

export default BlogTitleLinks;
