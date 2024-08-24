type Props = {
  title: string;
  date: string;
};

const PostTitle = ({ title, date }: Props) => {
  return (
    <>
      <h2 className="text-3xl leading-12 font-bold text-gray-900">{title}</h2>
      <div className="mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
      </div>
    </>
  );
};

export default PostTitle;
