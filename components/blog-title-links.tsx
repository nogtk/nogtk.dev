import Link from "next/link";

const BlogTitleLinks = () => {
  return (
    <div className="flex flex-none justify-center justify-between">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/" className="hover:underline">About</Link>
    </div>
  )
}

export default BlogTitleLinks;
