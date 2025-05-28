# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal tech blog (nogtk.dev) built with Next.js using static site generation. Blog posts are written in Markdown and stored in the `_posts/` directory. The site uses the Zenn ecosystem for enhanced Markdown rendering and is deployed to Firebase Hosting.

## Development Commands

### Local Development
```bash
# Preferred development method via Docker
docker compose build --no-cache
docker compose up

# Alternative: Direct development
yarn dev

# Verify local server
curl -I -s localhost:3000 | grep HTTP/ | awk '{print $2}'  # Should return 200
```

### Build and Type Checking
```bash
yarn build      # Production build with static export
yarn typecheck  # TypeScript validation
yarn start      # Serve production build locally
```

## Architecture

### Content Management
- Blog posts are Markdown files in `_posts/` with frontmatter (title, excerpt, date, coverImage)
- Posts are processed at build time using `gray-matter` and `zenn-markdown-html`
- Static generation creates individual pages for each post via `[slug].tsx`

### Key Directories
- `pages/` - Next.js file-based routing (index.tsx, _app.tsx, _document.tsx, posts/[slug].tsx)
- `components/` - Reusable React components organized by feature
- `lib/` - Core utilities (api.ts for post fetching, markdownHtml.ts for processing)
- `interfaces/` - TypeScript type definitions
- `_posts/` - Markdown blog posts
- `public/assets/blog/` - Static assets for blog posts

### Static Site Generation
- Configured with `output: 'export'` in next.config.js for static hosting
- Uses `getStaticProps` and `getStaticPaths` for pre-rendering
- Trailing slashes enforced for Firebase Hosting compatibility

### Styling and UI
- Tailwind CSS with custom theme configuration
- Zenn content CSS for rich Markdown styling
- Table of contents generation using tocbot
- Responsive design with mobile-first approach

## Adding New Blog Posts

1. Create a new `.md` file in `_posts/` with required frontmatter:
   ```yaml
   ---
   title: 'Post Title'
   excerpt: 'Brief description'
   coverImage: '/assets/blog/posts/slug/cover.jpg'
   date: '2024-01-01T05:35:07.322Z'
   ---
   ```

2. Add any assets to `public/assets/blog/posts/[slug]/`

3. The post will be automatically included in the build via the static generation system