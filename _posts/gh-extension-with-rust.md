---
title: 'Rust のクロスコンパイルを利用して自作 GitHub CLI extension をリリースする'
excerpt: ''
date: '2023-07-27'
---

## gh extension とは
https://docs.github.com/en/github-cli/github-cli/creating-github-cli-extensions

GitHub が提供する公式CLIの `gh` コマンドに拡張コマンドとして任意の振る舞いをもたせられるコマンドが GitHub CLI extension です。
リポジトリ名を `gh-` から始めるなど、いくつか制約があるみたいです。

### --precompiled=other オプションを使ってみる
上記のブログを眺めていると
> You can use the --precompiled=other argument to create a project for your non-Go precompiled extension, including workflow scaffolding.

scaffold を生成することが出来る記述を発見しました。ちなみに `--precompiled=go` で Go の雛形も生成できるとのこと。他の言語も増やしてほしいですね。
今回は Rust で実装する予定なので `--precompiled=other` として実行します。

コマンドを叩くと以下のようなインストとともに、いくつかファイルが生成されました。
```sh
$ gh extension create --precompiled=other activity
✓ Created directory gh-activity
✓ Initialized git repository
✓ Made initial commit
✓ Set up extension scaffolding

gh-activity is ready for development!

Next Steps
- run 'cd gh-activity; gh extension install .' to install your extension locally
- fill in script/build.sh with your compilation script for automated builds
- compile a gh-activity binary locally and run 'gh activity' to see changes
- run 'gh repo create' to share your extension with others

For more information on writing extensions:
https://docs.github.com/github-cli/github-cli/creating-github-cli-extensions
```

今回は `gh activity` として実行できる CLI アプリケーションを想定します。

>  The repository must have an executable file at its root with the same name as the repository or a set of precompiled binary executables attached to a release.

後者の 「a set of precompiled binary executables attached to a release.」こっちには後で触れます。
とりあえずまずはディレクトリと同名の `gh-activity` というバイナリファイルを用意することで、`gh activity` コマンドとして実行できるみたいなので、サンプルでバイナリを出力してみます。

以下のようなCのサンプルプログラムを作り、`gh-activity` というファイル名を吐き出すようにコンパイルします。

```c
#include <stdio.h>

int main() {
	printf("hello\n");
	return 0;
}
```

```sh
# コンパイル
$ gcc -o ./gh-activity test.c

# バイナリを直接実行
$ ./gh-activity
hello

# gh activity コマンド経由で実行
$ gh activity
hello
```

hello と出力することができました。

## 作られた他のファイルを見てみる
2つのファイルが作成されています。
- .github/workflows/release.yml
- script/build.sh

### release.yml
```yml:release.yml
name: release
on:
  push:
    tags:
      - "v*"
permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cli/gh-extension-precompile@v1
        with:
          build_script_override: "script/build.sh"
```

```sh:build.sh
#!/usr/bin/env bash
echo "TODO implement this script."
echo "It should build binaries in dist/<platform>-<arch>[.exe] as needed."
exit 1
```

`release.yml` は GitHub Action のマニフェストファイルになっていて、tag を push することで GitHub extension としてリリースすることが出来るようです。
そして `build.sh` を実行するようになっており、 `dist/<platform>-<arch>[.exe]` の形式で、サポートしたい環境毎の実行ファイルを定義できるようです。
この形式の具体についても公式ドキュメントに記載があります。
> For example, an extension named whoami compiled for Windows 64bit would have the name gh-whoami-windows-amd64.exe while the same extension compiled for Linux 32bit would have the name gh-whoami-linux-386

そして、完全な対応表となるコードのリンクも貼られていました。
https://github.com/cli/cli/blob/14f704fd0da58cc01413ee4ba16f13f27e33d15e/pkg/cmd/extension/manager.go#L696

今回は、Rust のビルドツールである Cargo が提供するクロスコンパイルの機能を使って複数環境向けのバイナリを生成したいので、`dist/<platform>-<arch>[.exe]` の形式でファイルを出力する方式を採用したいと思います。

### extension をリリースするために必要なこと
ここまでをまとめると以下のように理解できます。
- 作成したプログラムから実行ファイルを生成し `dist` ディレクトリ配下に置く。このときファイル名を `<platform>-<arch>[.exe]` という規則に合わせて命名する
- ↑ の処理を実行するスクリプトを `script/build.sh` に書く
- tag を push する (あとはGitHub Actionで自動でリリースされる)

## Rust で CLI アプリケーションを実装する
アプリケーションの実装自体については、今回は割愛します。

実装したもの
https://github.com/nogtk/gh-activity

インタラクティブに PullRequest を gh コマンド経由で検索できる `gh activity` というコマンドを実装しました。
(この実装については別の記事にしたいと思います。)

今回はアプリケーションではなく、GitHub CLI extension としてリリースするために必要な内容についてのみ記載したいと思います。

## GitHub Actions
### バイナリの生成
現状は以下のようなマニフェストになっています。GitHub Action の `matrix` 構文を使って、Windows/Mac/Linux、さらに X86, ARM の2つのCPUアーキテクチャ、計6つの環境でビルドを行うようにしています。

https://github.com/nogtk/gh-activity/blob/main/.github/workflows/release.yml

実行結果の一例
https://github.com/nogtk/gh-activity/actions/runs/5645411521

`cargo build` する際に、 `--target` というオプションを指定することで、対象の環境向けにビルドすることが出来ます。 `matrix.target` として指定している値がそれらで、この値は [The rustc book](https://doc.rust-lang.org/nightly/rustc/platform-support.html) に一覧として記載されています。


### バイナリの配置
ビルドしたバイナリを `dist` ディレクトリ配下に配置するために、 `script/build.sh` を以下のように書き換えました。

https://github.com/nogtk/gh-activity/blob/main/script/build.sh

単純に前のステップでビルドしたバイナリを `dist` 配下のディレクトリにコピーするだけです。コピーする際にファイル名を `<platform>-<arch>[.exe]` という規則に合わせてリネームしています。この規則性については前述の通りです。

mv しているだけなので、わざわざシェルスクリプトとして切り出さなくても良いのかもしれません。ここらのリリースのためのステップに関してはもう少しブラッシュアップが出来そうではあります。

### リリース
リリースについては簡単です。こちらも前述の通り、tag を push することで自動生成された GitHub Action が発火して、更新した実装に対してバイナリの生成と配布を行ってくれます。完了後 `gh extension upgrade activity` を実行すると、アップデートされることを確認できます。

## まとめ
今回は GitHub CLI extension を作成するために、特に Golang 以外をの言語を使う場合に必要な内容についてまとめました。
scaffold が用意されているとはいえ、実行ファイルの命名など色々と知識が必要だったので、もう少しラフに実行できるようになると良いなと思いました。
（公式ドキュメントをちゃんと読めばいいという話ではありますが）

また、Golang を指定して scaffold を生成した場合は、アプリケーションの知識だけで実装できるみたいなので、他の言語を使う場合よりかはハードルが低いと感じました。サクッと作りたい場合は Golang か、あるいはコンパイルの必要がない ShellScript で実装するのが良さそうです。
[GitHub CLI extension の一覧ページ](https://github.com/topics/gh-extension) には ShellScript、Golang の順で実装されたライブラリが多いのも、その理由の1つなのかなと感じました。
