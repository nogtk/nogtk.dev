# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) に対するガイダンスを提供します。

## プロジェクト概要

これはNext.jsを使用した静的サイト生成による個人技術ブログ（nogtk.dev）です。ブログ記事はMarkdownで書かれ、`_posts/`ディレクトリに保存されています。サイトは拡張されたMarkdownレンダリングのためにZennエコシステムを使用し、Firebase Hostingにデプロイされています。

## 開発コマンド

### ローカル開発
```bash
# Dockerを使用した推奨開発方法
docker compose build --no-cache
docker compose up

# 代替：直接開発
yarn dev

# ローカルサーバーの確認
curl -I -s localhost:3000 | grep HTTP/ | awk '{print $2}'  # 200を返すはず
```

### ビルドと型チェック
```bash
yarn build      # 静的エクスポート付きプロダクションビルド
yarn typecheck  # TypeScriptバリデーション
yarn start      # プロダクションビルドをローカルで提供
```

## アーキテクチャ

### コンテンツ管理
- ブログ記事は`_posts/`内のMarkdownファイルで、フロントマター（title、excerpt、date、coverImage）付き
- 記事は`gray-matter`と`zenn-markdown-html`を使用してビルド時に処理される
- 静的生成は`[slug].tsx`を通じて各記事の個別ページを作成する

### 主要ディレクトリ
- `pages/` - Next.jsファイルベースルーティング（index.tsx、_app.tsx、_document.tsx、posts/[slug].tsx）
- `components/` - 機能別に整理された再利用可能なReactコンポーネント
- `lib/` - コアユーティリティ（記事取得用のapi.ts、処理用のmarkdownHtml.ts）
- `interfaces/` - TypeScript型定義
- `_posts/` - Markdownブログ記事
- `public/assets/blog/` - ブログ記事用の静的アセット

### 静的サイト生成
- 静的ホスティング用にnext.config.jsで`output: 'export'`で設定
- プリレンダリングに`getStaticProps`と`getStaticPaths`を使用
- Firebase Hosting互換性のためにトレイリングスラッシュを強制

### スタイリングとUI
- カスタムテーマ設定でTailwind CSS
- リッチなMarkdownスタイリングのためのZenn content CSS
- tocbotを使用した目次生成
- モバイルファーストアプローチのレスポンシブデザイン

## 新しいブログ記事の追加

1. 必要なフロントマターを含む新しい`.md`ファイルを`_posts/`に作成：
   ```yaml
   ---
   title: '記事タイトル'
   excerpt: '簡潔な説明'
   coverImage: '/assets/blog/posts/slug/cover.jpg'
   date: '2024-01-01T05:35:07.322Z'
   ---
   ```

2. `public/assets/blog/posts/[slug]/`にアセットを追加

3. 記事は静的生成システムを通じて自動的にビルドに含まれる

## その他
- githubのissueやPR、projectのREADMEに画像リンクがある場合は gh-asset を使って画像をダウンロードして、その画像内の内容を含めて実装計画を作ること
  - `gh-asset download <asset_id> .claude/local/assets`
  - 参考: https://github.com/YuitoSato/gh-asset
