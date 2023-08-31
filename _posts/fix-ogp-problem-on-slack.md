---
title: "og:description と description が異なるとOGPの画像展開が動かなくなるみたい"
excerpt: "metaタグ周りをいじっていて、OGPの画像展開がうまく動かなくなったので、調査したところ og:description と description が異なることが原因みたいだったので、忘備録としてまとめておきます。"
date: "2023-08-31"
---

## next-seo を導入した

OGP 周りの設定のために [next-seo](https://github.com/garmeeh/next-seo) を導入し、meta タグ周りをいじっていたところ、OGP の画像展開がうまく動かなくなっていることに気付きました。

X(旧 Twitter) 上では展開できているが、Slack など他のアプリケーション上では展開できていない という状態です。

![invalid-ogp](/assets/blog/posts/fix-ogp-problem-on-slack/screenshot1.png)

## 調査を進めるが...

調査したこと

- とりあえずキャッシュクリアを試してみるが改善せず
- [og:description が空だと slack で OGP が展開されない](https://hai3.net/blog/og-description-slack-ogp/) という記事を発見したが、description は空ではない
- [og:description に HTML タグが含まれると表示されない](https://qiita.com/harunbu/items/be15779f33581d53f74c) という Qiita の記事を発見したので、調べたが HTML タグは含まれていない
- [meta タグの charset が utf-8 でないと表示されない](https://ideal-reality.com/computer/web/slack-url/) という記事を参考に調べたが charset は utf-8 になっている

ということで割と行き詰まってしまいました。

## 問題は description と og:description の値が異なることにあった

ちょうど OGP 周りのコードを見ていたこともあり、いくつか修正したいことがあったので直していました。そのひとつに、 `NextSeo` というコンポーネント上で、`description` と `openGraph.description` とで、別の値が設定されていた問題を修正しました。

https://github.com/nogtk/nogtk.dev/commit/2e0bfe01344bdd5a0e4fdbab662a9b92aa2819df

少し話はそれますが、next-seo では、description というプロパティがあり、このプロパティをセットすることで、`meta description` タグと、`og:description` タグの両方に値が設定されます。

https://github.com/garmeeh/next-seo/blob/f8b907f1b047b1844fd04a7e549d6589868e11ac/src/meta/buildTags.tsx#L182-L190
https://github.com/garmeeh/next-seo/blob/f8b907f1b047b1844fd04a7e549d6589868e11ac/src/meta/buildTags.tsx#L276-L284

なので、`openGraph` の中の `description` プロパティは削除することにしました。

すると...

![valid-ogp](/assets/blog/posts/fix-ogp-problem-on-slack/screenshot2.png)

OGP の展開が復活しています！🎉

やはり description 周りが関連していたので、ここらへんに当たりをつけて調べることが有効だったようです。
