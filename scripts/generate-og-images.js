const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const React = require('react');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');

const WIDTH = 1200;
const HEIGHT = 630;
const FONT_FAMILY = 'Noto Sans JP';
const COLORS = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  blue: '#268bd2',
  cyan: '#2aa198',
  yellow: '#b58900',
};

const loadFont = (fileName) => {
  return fs.readFileSync(path.join(__dirname, 'fonts', fileName));
};

const fonts = [
  {
    name: FONT_FAMILY,
    data: loadFont('NotoSansJP-Regular.otf'),
    weight: 400,
    style: 'normal',
  },
  {
    name: FONT_FAMILY,
    data: loadFont('NotoSansJP-Bold.otf'),
    weight: 700,
    style: 'normal',
  },
];

const h = React.createElement;

const getCharWidth = (char) => {
  if (/[\s]/.test(char)) return 0.35;
  if (/[\x00-\x7F]/.test(char)) return 0.58;
  return 1;
};

const getTokenWidth = (token) => {
  return [...token].reduce((width, char) => width + getCharWidth(char), 0);
};

// 日本語タイトルをOGPの横幅に収めるため、おおよその字幅で折り返す。
const splitTextIntoLines = (text, maxWidth = 16, maxLines = 3) => {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  const tokens = normalized.match(/[A-Za-z0-9_:+#./-]+|\s+|./gu) || [];
  const lines = [];
  let currentLine = '';
  let currentWidth = 0;

  for (const token of tokens) {
    const tokenWidth = getTokenWidth(token);
    if (currentLine && currentWidth + tokenWidth > maxWidth) {
      lines.push(currentLine.trim());
      currentLine = token.trimStart();
      currentWidth = getTokenWidth(currentLine);
      if (lines.length === maxLines) break;
      continue;
    }

    currentLine += token;
    currentWidth += tokenWidth;
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine.trim());
  }

  const renderedText = lines.join('');
  if (renderedText.length < normalized.length && lines.length > 0) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[。、,.，．\s]+$/, '')}...`;
  }

  return lines;
};

const getTitleFontSize = (lineCount) => {
  if (lineCount >= 3) return 46;
  if (lineCount === 2) return 56;
  return 64;
};

const generateOGImageSVG = async (title) => {
  const titleLines = splitTextIntoLines(title);
  const titleFontSize = getTitleFontSize(titleLines.length);

  return satori(
    h(
      'div',
      {
        style: {
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          position: 'relative',
          backgroundColor: COLORS.base3,
          color: COLORS.base02,
          fontFamily: FONT_FAMILY,
          padding: '68px 78px',
          overflow: 'hidden',
        },
      },
      h('div', {
        style: {
          position: 'absolute',
          left: 48,
          top: 48,
          right: 48,
          bottom: 48,
          border: `3px solid ${COLORS.base2}`,
        },
      }),
      h('div', {
          style: {
            position: 'absolute',
            left: 78,
            top: 150,
            width: 8,
            height: 330,
            backgroundColor: COLORS.blue,
        },
      }),
      h('div', {
          style: {
            position: 'absolute',
            left: 102,
            top: 150,
            width: 8,
            height: 330,
            backgroundColor: COLORS.cyan,
          opacity: 0.5,
        },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            right: 78,
            top: 68,
            display: 'flex',
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 700,
            color: COLORS.base02,
          },
        },
        'nogtk.dev',
      ),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 150,
            top: 0,
            width: 900,
            height: HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: titleFontSize,
            lineHeight: 1.18,
            fontWeight: 700,
            color: COLORS.base02,
            textAlign: 'center',
          },
        },
        ...titleLines.map((line) => h('div', { style: { display: 'flex' }, key: line }, line)),
      ),
      h('div', {
        style: {
          position: 'absolute',
          right: 78,
          bottom: 72,
          width: 210,
          height: 10,
          backgroundColor: COLORS.base2,
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          right: 78,
          bottom: 92,
          width: 126,
          height: 10,
          backgroundColor: COLORS.base2,
        },
      }),
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    },
  );
};

const renderSvgToPng = (svgContent) => {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: WIDTH,
    },
  });
  return resvg.render().asPng();
};

// 記事のOG画像を生成
const generatePostOGImages = async () => {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const publicOGDirectory = path.join(process.cwd(), 'public', 'assets', 'og');
  
  // OG画像ディレクトリを作成
  if (!fs.existsSync(publicOGDirectory)) {
    fs.mkdirSync(publicOGDirectory, { recursive: true });
  }
  
  const filenames = fs.readdirSync(postsDirectory);
  
  for (const filename of filenames) {
    if (!filename.endsWith('.md')) continue;
    
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    const slug = filename.replace(/\.md$/, '');
    const title = data.title || slug;
    console.log(`Generating OG image for: ${title}`);

    const svgContent = await generateOGImageSVG(title);
    const pngPath = path.join(publicOGDirectory, `${slug}.png`);
    fs.writeFileSync(pngPath, renderSvgToPng(svgContent));

    console.log(`✓ Generated: ${pngPath}`);
  }
};

// スクリプト実行
if (require.main === module) {
  console.log('🎨 Generating OG images...');
  generatePostOGImages()
    .then(() => {
      console.log('✅ OG images generation completed!');
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { generatePostOGImages, generateOGImageSVG };
