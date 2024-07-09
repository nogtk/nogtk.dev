---
title: "Rubocop のちょっとしたTIPS"
excerpt: "業務でRubocopを使っている時のTIPSをまとめてみます"
date: "2024-07-09"
---

Rubocop とはとかそういう諸々は割愛です。開発も盛んですし、Ruby/Rails を使う理由の一つにもなり得る、いいツールだなと思っています。開発者・メンテナの皆さんに日々感謝です。

数年業務でも使ってきたので、いくつか備忘録的に TIPS や日々の開発での向き合い方をまとめておこうと思います。

## 1 cop ずつ自動修正してレビュワーフレンドリーにする
`--only` オプションを使って、1 つの cop を対象に検出や自動修正を行うことができます。
rubocop のバージョンアップ時などに、1つのファイルが複数の cop に引っかかる場合があります。
まあ一気にやってもいいんですが、1つずつ cop を指定して、コミットも分けることで、レビュワーがよりレビューしやすいPRになるなと考えています。

```sh
$ rubocop file_name.rb -a --only
```

https://docs.rubocop.org/rubocop/usage/basic_usage.html#command-line-flags

使ったことはないですが `--except` で逆に特定の cop を除外することもできるみたいですね。

## safe autocorrect と autocorrect を使い分ける
`rubocop -a` と `rubocop -A` は異なります。
- `-a` または `--autocorrect`
    - safe autocorrect と呼ばれるものです
    - rubocop 側で、実行前後で評価結果が変わらないことが保証されている cop です
- `-A` または `--autocorrect-all`
    - autocorrect と呼ばれるものです
    - 実行前後で評価結果が変わることがある（ =同一性が保証されていない） cop です

https://docs.rubocop.org/rubocop/usage/autocorrect.html

> Some automatic corrections might change (slightly) the semantics of the code, meaning they’d produce code that’s mostly equivalent to the original code, but not 100% equivalent

公式ドキュメントにも、大体同じ評価結果となるコードを生成するが、 100% ではないことが書かれています。

`-A` による autocorrect を書ける場合、前後で評価結果が変わっていないか確認するといいでしょう。テストコードが書きたくなります。
反対に `-a` は、壊れる心配は基本ないので、ガンガン自動修正していって問題ないと思っています。もし前後で評価結果が変わる場合は、コントリビュートチャンスですね。

これまた知りませんでしたが以下のように `--disable-uncorrectable` をつけると、インラインで無効化できる rubocop:todo コメントを自動付加してくれるようですね。ちょっと一時的にオフにしておきたい時などに便利そうです。

```sh
$ rubocop --autocorrect --disable-uncorrectable
```

## rubocop_todo.yaml を利用して、プロジェクトの途中から rubocop を導入する
プロジェクトの途中で rubocop を導入すると、過去のコードがたくさん違反するケースがあるでしょう。
そんな時に `--auto-gen-config` コマンドを叩くと、現在違反しているコードに対して、検出を一時的に抑制する rubocop_todo.yaml が生成されます。
既存コードの修正はさておき、新規で書くコードに対しては rubocop を適用させたいといったケースに便利です。

また、既存コードについても rubocop_todo はcop ごとに対象のファイルをリスト形式で表示してくれますし、先述したインラインコメントではなく、ファイル上で一元管理できるので、管理や修正が楽です。

## rubocop_todo.yaml と rubocop.yaml の使い分け
途中で導入した場合に、rubocop_todo.yaml をすぐに片付けて既存コードベースも全て rubocop に対応させられればいいのですが、なかなか難しいケースもあると思います。その時に、rubocop_todo.yaml と rubocop.yaml、どちらに設定を記載するべきか悩むことがあります。

個人的な見解は以下です
- rubocop_todo.yaml
    - 後続のPRや別タスクなどで修正する前提で、一時的に抑制したいもの
- rubocop.yaml
    - チーム内で合意が取れている、共通のルールとして適用しないもの

rubocop.yaml は恒常的に抑制したりオプションとして変更したいものを記述し、rubocop_todo.yaml は一時的に抑制したいものを記述するといいかなと思っています。

## 実行を高速化する
### LSP
Rubocop は LSP (Language Server Protocol) に対応し、VSCode や Vim(coc.nvim) などのエディタで、より高速に違反の検出及び自動修正を行うことができます。

https://docs.rubocop.org/rubocop/usage/lsp.html

VS Code であれば、拡張機能をインストールするだけで LSP を利用できます。
https://github.com/rubocop/vscode-rubocop

CLI から実行するより圧倒的に高速ですし、保存のコールバックで自動的に修正が走るような設定にしておくことで、開発者自身がわざわざ実行しなくても勝手に修正が行われるので、開発効率が向上します。

### Server Mode
```sh
$ rubocop --start-server
```

こちらのコマンドで、Rubocop をサーバモードとして起動することができ、こちらも実行の高速化ができます。
LSP が使える環境では不要だと思いますが、2024年7月現在、Rubymineをはじめとする IntelliJ 系の IDE では LSP がまだ対応していないため、こちらを使っています。

https://docs.rubocop.org/rubocop/usage/server.html

> You can reduce the RuboCop boot time significantly (something like 850x faster) by using the --server command-line option.

850倍も早くなるようです。便利ですね。
