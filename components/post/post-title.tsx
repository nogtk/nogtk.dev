type Props = {
  title: string;
  date: string;
};

const PostTitle = ({ title, date }: Props) => {
  return (
    <>
      <h1 className="text-4xl leading-tight font-bold text-slate-900 mb-2">{title}</h1>
      <div className="text-sm text-slate-500 mb-6">公開日: {date}</div>
    </>
  );
};

export default PostTitle;
