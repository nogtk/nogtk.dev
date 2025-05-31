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
                    <div>
                      <a 
                        href="https://github.com/nogtk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        GitHub
                      </a>
                      <span className="text-gray-500 ml-2">- コードやプロジェクト</span>
                    </div>
                    
                    <div>
                      <a 
                        href="https://twitter.com/nogtk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        Twitter/X
                      </a>
                      <span className="text-gray-500 ml-2">- 技術的な投稿や日常</span>
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