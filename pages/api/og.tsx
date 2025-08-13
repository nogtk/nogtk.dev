import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Blog Post';
    const tech = searchParams.get('tech') || 'Tech';

    // 技術に応じた色を設定
    const getTechColor = (technology: string) => {
      const techColors: Record<string, string> = {
        django: '#092E20',
        python: '#3776AB',
        docker: '#2496ED',
        kotlin: '#7F52FF',
        rust: '#000000',
        javascript: '#F7DF1E',
        typescript: '#007ACC',
        react: '#61DAFB',
        nextjs: '#000000',
        default: '#4A5568'
      };
      return techColors[technology.toLowerCase()] || techColors.default;
    };

    const techColor = getTechColor(tech);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f7fafc',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          {/* 背景グラデーション */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${techColor}20, ${techColor}10)`,
            }}
          />
          
          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              maxWidth: '800px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* 技術タグ */}
            <div
              style={{
                backgroundColor: techColor,
                color: 'white',
                padding: '8px 24px',
                borderRadius: '20px',
                fontSize: '24px',
                fontWeight: 500,
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {tech}
            </div>
            
            {/* タイトル */}
            <div
              style={{
                color: '#2D3748',
                fontSize: '48px',
                fontWeight: 'bold',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              {title}
            </div>
            
            {/* サイト名 */}
            <div
              style={{
                color: '#718096',
                fontSize: '28px',
                fontWeight: 400,
              }}
            >
              nogtk.dev
            </div>
          </div>
          
          {/* 装飾要素 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '100px',
              height: '100px',
              backgroundColor: techColor + '30',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '60px',
              height: '60px',
              backgroundColor: techColor + '20',
              borderRadius: '50%',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}