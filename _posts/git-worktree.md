---
title: "git worktree を調べてみた"
excerpt: "git worktree の概念や具体的な運用パターンを整理するための調査メモです。"
tech: "git"
date: "2025-09-16"
---

## 動機
Vibe coding や Agentic Coding の流れの中で、複数タスクを並行して AI Agent に進めてもらうケースが増えてきていると思う。その中でよく git worktree という言葉を見かけるようになった。
自分も vibe-kanban(https://www.vibekanban.com/) を使っていて、間接的に git worktree を使っているのだが、仕組みとしてあまりよく理解できていないものだったので、調べてみた。

## git worktree とは
1つのリポジトリで複数の作業ツリーを同時に持つことができるという git の機能である。
「同時に複数のブランチを別々のフォルダでチェックアウトしておきたい」というニーズを満たすことができる。

https://git-scm.com/docs/git-worktree

公式のページはここ。

## 色々コマンドを打ってみる
これで作業ツリーを追加できる。

```bash
$ git branch feature-a
$ git worktree add ../feature-a feature-a
Preparing worktree (checking out 'feature-a')
HEAD is now at 5a8ee4b Initial commit
```

ディレクトリごとに別のブランチとして振る舞っていて個別に commit できる。

```bash
$ echo "updated" >> README.md
$ git commit -am "commit"
$ git log --oneline --decorate
4291ad5 (HEAD -> master) commit
5a8ee4b (feature-a) Initial commit
```

```bash
$ cd ../feature-a/
$ echo "updated on feature-a" >> ../feature-a/README.md
$ git commit -am "commit"
$ git log --oneline --decorate
f29a9ba (HEAD -> feature-a) commit
5a8ee4b Initial commit
```

.git/worktrees/ 以下に作業ツリーの情報が保存されている。
worktree 側の .git には、gitdir として worktree の大元の .git/worktrees/ 以下を指すようになっている。

```bash
$ tree -L 3 .git/worktrees/
.git/worktrees/
└── feature-a
    ├── COMMIT_EDITMSG
    ├── HEAD
    ├── ORIG_HEAD
    ├── commondir
    ├── gitdir
    ├── index
    ├── logs
    │   └── HEAD
    └── refs

4 directories, 7 files
```

```bash
$ cat ../feature-a/.git 
gitdir: /Users/takanaoga/git-worktree-handson/.git/worktrees/feature-a
```

ワークツリーの一覧

```bash
$ git worktree list
/Users/takanaoga/git-worktree-handson  4291ad5 [master]
/Users/takanaoga/feature-a             f29a9ba [feature-a]
```

lock してから remove しようとしてもエラーになる

```bash
$ git worktree lock ../feature-a
$ git worktree remove ../feature-a
fatal: cannot remove a locked working tree;
use 'remove -f -f' to override or unlock first
```

ちなみに rm -rf は普通にできた。そうなると worktree 上では prunable という扱いになるみたい。

```bash
$ rm -rf ../feature-a
$ git worktree list
/Users/takanaoga/git-worktree-handson  4291ad5 [master]
/Users/takanaoga/feature-a             f29a9ba [feature-a] prunable
```

なので、prune すると worktree 上から削除される。

```bash
$ git worktree prune
$ git worktree list
/Users/takanaoga/git-worktree-handson  4291ad5 [master]
```

その他、worktree はブランチ指定だけでなく、コミットハッシュやタグ指定もできるので、過去の状態を別ディレクトリでチェックアウトしておくこともできる。これは便利そう。


## 参考資料
https://chatgpt.com/share/68ca006e-4640-8000-9706-388506b4e29d

ChatGPT の学習モードで対話しながらやったログ。
