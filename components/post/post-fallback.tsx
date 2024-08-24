import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const PostFallback = ({ children }: Props) => {
  return (
    <h1 className="text-5xl tracking-tighter leading-tight md:leading-none mb-4 text-center">
      {children}
    </h1>
  );
};

export default PostFallback;
