const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');

// 技術カラーマッピング
const getTechColor = (technology) => {
  const techColors = {
    django: '#092E20',
    python: '#3776AB',
    docker: '#2496ED',
    kotlin: '#7F52FF',
    rust: '#000000',
    git: '#F05032',
    javascript: '#F7DF1E',
    typescript: '#007ACC',
    react: '#61DAFB',
    nextjs: '#000000',
    aws: '#FF9900',
    default: '#4A5568'
  };
  return techColors[technology?.toLowerCase()] || techColors.default;
};

// 技術名を推測する関数
const inferTechFromTitle = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('django')) return 'django';
  if (titleLower.includes('docker')) return 'docker';
  if (titleLower.includes('kotlin')) return 'kotlin';
  if (titleLower.includes('rust')) return 'rust';
  if (titleLower.includes('python')) return 'python';
  if (titleLower.includes('s3') || titleLower.includes('aws')) return 'aws';
  return 'tech';
};

// テキストを複数行に分割する関数
const splitTextIntoLines = (text, maxCharsPerLine = 20) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // 単語が長すぎる場合は強制的に分割
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

const escapeXml = (text) => {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// SVG でOG画像を生成
const generateOGImageSVG = (title, tech) => {
  const width = 1200;
  const height = 630;
  const techColor = getTechColor(tech);
  
  // タイトルの行分割とフォントサイズの調整
  const titleLines = splitTextIntoLines(title, 25);
  const maxLines = 3;
  const displayLines = titleLines.slice(0, maxLines);
  
  // 行数に応じてフォントサイズを調整
  let fontSize = 48;
  if (displayLines.length >= 3) {
    fontSize = 36;
  } else if (displayLines.length >= 2) {
    fontSize = 42;
  }
  
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = displayLines.length * lineHeight;
  const startY = 300 - (totalTextHeight / 2) + (lineHeight / 2);
  
  // タイトルのSVGテキスト要素を生成
  const titleSVG = displayLines.map((line, index) => {
    const y = startY + (index * lineHeight);
    // 最後の行で切り詰められた場合は "..." を追加
    const displayText = (index === maxLines - 1 && titleLines.length > maxLines) 
      ? line + '...' 
      : line;
    return `<text x="${width/2}" y="${y}" text-anchor="middle" fill="#2D3748" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">${escapeXml(displayText)}</text>`;
  }).join('\n  ');
  
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${techColor}20;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${techColor}10;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="100%" height="100%" fill="#f7fafc"/>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- 装飾円 -->
  <circle cx="${width - 70}" cy="70" r="50" fill="${techColor}30"/>
  <circle cx="70" cy="${height - 70}" r="30" fill="${techColor}20"/>
  
  <!-- 技術タグ -->
  <rect x="${width/2 - 100}" y="180" width="200" height="40" rx="20" fill="${techColor}"/>
  <text x="${width/2}" y="205" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${escapeXml(tech.toUpperCase())}</text>
  
  <!-- タイトル -->
  ${titleSVG}
  
  <!-- サイト名 -->
  <text x="${width/2}" y="450" text-anchor="middle" fill="#718096" font-family="Arial, sans-serif" font-size="28">nogtk.dev</text>
</svg>`;
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
    const tech = data.tech || inferTechFromTitle(title);
    
    console.log(`Generating OG image for: ${title} (tech: ${tech})`);
    
    const svgContent = generateOGImageSVG(title, tech);
    const pngPath = path.join(publicOGDirectory, `${slug}.png`);
    await sharp(Buffer.from(svgContent))
      .png()
      .toFile(pngPath);
    
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
