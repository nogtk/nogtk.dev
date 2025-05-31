const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 技術カラーマッピング
const getTechColor = (technology) => {
  const techColors = {
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
  return 'tech';
};

// SVG でOG画像を生成
const generateOGImageSVG = (title, tech) => {
  const width = 1200;
  const height = 630;
  const techColor = getTechColor(tech);
  
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
  <text x="${width/2}" y="205" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${tech.toUpperCase()}</text>
  
  <!-- タイトル -->
  <text x="${width/2}" y="300" text-anchor="middle" fill="#2D3748" font-family="Arial, sans-serif" font-size="48" font-weight="bold">${title}</text>
  
  <!-- サイト名 -->
  <text x="${width/2}" y="400" text-anchor="middle" fill="#718096" font-family="Arial, sans-serif" font-size="28">nogtk.dev</text>
</svg>`;
};

// 記事のOG画像を生成
const generatePostOGImages = () => {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const publicOGDirectory = path.join(process.cwd(), 'public', 'assets', 'og');
  
  // OG画像ディレクトリを作成
  if (!fs.existsSync(publicOGDirectory)) {
    fs.mkdirSync(publicOGDirectory, { recursive: true });
  }
  
  const filenames = fs.readdirSync(postsDirectory);
  
  filenames.forEach((filename) => {
    if (!filename.endsWith('.md')) return;
    
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    const slug = filename.replace(/\.md$/, '');
    const title = data.title || slug;
    const tech = data.tech || inferTechFromTitle(title);
    
    console.log(`Generating OG image for: ${title} (tech: ${tech})`);
    
    const svgContent = generateOGImageSVG(title, tech);
    const svgPath = path.join(publicOGDirectory, `${slug}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    
    console.log(`✓ Generated: ${svgPath}`);
  });
};

// スクリプト実行
if (require.main === module) {
  console.log('🎨 Generating OG images...');
  generatePostOGImages();
  console.log('✅ OG images generation completed!');
}

module.exports = { generatePostOGImages, generateOGImageSVG };