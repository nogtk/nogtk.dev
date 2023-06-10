import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'

const Meta = () => {
  return (
    <Head>
      <link
        rel="icon"
        sizes="32x32"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>👕</text></svg>"
      />
      <link
        rel="icon"
        sizes="16x16"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>👕</text></svg>"
      />
      <link
        rel="icon alternate"
        type="image/png"
        href="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f455.png"
      />
      <meta
        name="description"
        content={`A statically generated blog example using Next.js and ${CMS_NAME}.`}
      />
    </Head>
  )
}

export default Meta
