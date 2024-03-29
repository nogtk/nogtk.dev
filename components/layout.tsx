import Meta from "./meta";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-max">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
