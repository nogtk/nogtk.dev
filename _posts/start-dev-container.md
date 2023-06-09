---
title: 'VSCode の Devcontainers を試した'
excerpt: ''
date: '2023-06-26'
---

ずっと存在は認知していた Devcontainers を試してみようと思います。

## 参考
https://code.visualstudio.com/docs/devcontainers/containers

## devcontainer.json を追加する
ローカルPCのVSCode上で Dev Container を使い、アプリケーションを立ち上げられるようにしたいと思います。
以下のようなjsonファイルを `.devcontainer/devcontainer.json` として配置します。

```json:devcontainer.json
{
  "name": "nogtk.dev",
  "dockerComposeFile": ["../compose.yml"],
  "containerUser": "app",
  "service": "app",
  "workspaceFolder": "/home/workspace"
}
```

Dockerfile 、compose.yml の設定を考慮して、`containerUser` 、 `service` 、`workspaceFolder` あたりを指定しています。
具体的なファイルについては各リポジトリを参照していただければと思います。
- [Dockerfile](https://github.com/nogtk/nogtk.dev/blob/3f1dcc5f155abc908cc4b7f08bdc5d5fbc027a82/Dockerfile)
- [compose.yml](https://github.com/nogtk/nogtk.dev/blob/3f1dcc5f155abc908cc4b7f08bdc5d5fbc027a82/compose.yaml)
  - volume のディレクトリを間違えるないように注意

また詳細な devcontainer.json の各パラメータについては以下の公式ドキュメントを参考にするといいでしょう。
https://containers.dev/implementors/json_reference/

### 動作確認
ここまで設定しプロジェクトをVSCodeで開くと、以下のようにダイアログが出てくるので、`Reopen in Container` からコンテナの起動と主にVSCodeを開き直すことができます。

![container dialog](/assets/blog/posts/start-dev-container/container-dialog.png)

VSCodeと開発環境をセットで立ち上げることができました。`DEV CONTAINERS` のセクションを見ると、`nogtkdev` が起動しており、開発環境もセットで立ち上がっています。

![Alt text](/assets/blog/posts/start-dev-container/vscode-with-container.png)

```shell
$ curl -I -s localhost:3000 | grep HTTP/ | awk '{print $2}'
200
```

## 結局DevContainersの利点とは？
ぶっちゃけただアプリケーションを立ち上げるだけなら、ローカルマシンで `docker compose up` で立ち上げるので十分かなと思いました。
アプリケーションの起動まですべてVSCode上で完結するので、Git操作など開発中の大半のアクティビティをVSCodeでやっている人には恩恵があるのかもしれません。

ただし、VSCode 上の拡張機能や設定を devcontainer.json の設定の1つとして含められることが出来るようで、これをプロジェクトごとに設定できるのは便利そう、とは思いました。詳細については以下のリンクが参考になるでしょう。
https://containers.dev/supporting

これも `.vscode` ディレクトリに設定ファイルを追加して共有すればいいという話ではありますが、アプリケーションの実行環境と開発環境を、Devcontainers として1つのパッケージとして提供出来るのは便利そうではあります。
