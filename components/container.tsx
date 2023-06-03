type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {
  return <div className="container max-w-4xl md:max-w-2xl m-auto px-5 ">{children}</div>
}

export default Container
