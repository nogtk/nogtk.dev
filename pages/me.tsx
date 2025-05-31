import Container from "../components/container";
import Layout from "../components/layout";
import Head from "next/head";
import BlogTitle from "../components/blog-title";

export default function Me() {
  return (
    <>
      <Layout>
        <Head>
          <title>About Me - nogtk.dev</title>
        </Head>
        <div className="min-h-screen bg-gray-100">
          <BlogTitle />
          <Container>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">About Me</h1>
                
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    こんにちは、nogtk です。
                  </p>
                  
                  <p className="text-gray-700 mb-6">
                    ソフトウェア開発や技術について学んだことを記録するためのブログを書いています。
                    日々の開発で得られた知見や興味深い技術について共有していきたいと思います。
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Links</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <a 
                        href="https://github.com/nogtk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <a 
                        href="https://twitter.com/_nogtk_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter/X
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Layout>
    </>
  );
}
