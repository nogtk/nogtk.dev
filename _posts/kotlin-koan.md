---
title: "Kotlin Koanをやった"
excerpt: "Kotlin のキャッチアップを兼ねて、Kotlin Koan をやってみました。簡単な始め方とやりながらのメモを残しておきます。"
date: "2024-02-04"
---

## Kotlin Koan

業務でサーバサイド Kotlin を触ることになったので、Kotlin の基礎を学ぶために Kotlin Koan をやりました。

https://kotlinlang.org/docs/koans.html

> Kotlin Koans are a series of exercises designed primarily for Java developers, to help you become familiar with the Kotlin syntax. Each exercise is created as a failing unit test, and your job is to make it pass.

失敗するテストを通すという形式で、Kotlin の文法に慣れ親しむことができるそうです。

## やったこと

[Koans online](https://play.kotlinlang.org/koans) というブラウザ上で試せるものもあるみたいでしたが、どうせならローカルでやりたかったので、JetBrains が提供する Academy plugin を利用した進め方でやってみます。

早速、Intellij IDEA の Community Edition に Academy plugin をインストールします。

![Alt text](/assets/blog/posts/kotlin-koan/getting-started.png =600x)

`Learn to program` を選択すると、コースを選ぶことができるので、Kotlin Koans を選択します。

![Alt text](/assets/blog/posts/kotlin-koan/start-kotlin-koan.png =600x)

内容としては、スクショのように、右側に課題とそれに関連するドキュメントのリンクが表示され、左側にコードを書いていく形式です。書き終わると、右下の `Check` ボタンを押すことで、テストが実行され、合格すると次の課題に進めます。

![Alt text](/assets/blog/posts/kotlin-koan/content.png =600x)

各章ごとに完了するとこんなダイアログが出てきて、ちょっとした達成感があります。

![Alt text](/assets/blog/posts/kotlin-koan/complete.png =600x)

## Kotlin の REPL について

https://www.jetbrains.com/help/idea/kotlin-repl.html

Intellij に同梱されていました。トライアンドエラーでコードが書けるので、挙動をサッと確認したい時にかなり便利そうです。

### メモ

- エルビス演算子
  - `?:` こういうやつ
  - null の場合に右側の値を返す
    - `a ?: b` は `a` が `null` でなければ `a` を返し、`null` であれば `b` を返す
- return について
  - Kotlin だと、関数の戻り値を明示的に書かなくても、最後に評価された式が戻り値になる
  - `return` を明示的に書かなくてもいいのは Ruby のノリで書けるのでラク
- Nothing 型
  - 何も返さない関数の戻り値の型
  - 例えば、例外を投げる関数など
  - https://phoneappli.hatenablog.com/entry/2021/03/30/180749
    - Nothing? 型で null しか入らない入れ物を定義できるみたい
- sealed class
  - 継承できるクラスを制限するためのキーワード
  - https://kotlinlang.org/docs/sealed-classes.html#location-of-direct-subclasses
  - enum の拡張みたいなことができるらしい
- when について
  - https://kotlinlang.org/docs/control-flow.html#when-expression
  - かなり応用範囲が広くて、最初は戸惑いそうだけど慣れれば便利っぽい感じ
  - 関数の定義に when を使って、処理を分岐するのがかなりリーダブルにかけて良さげに見えた
    - Rust の match と同じ雰囲気を感じた
- find と filter について
  - filter は対象の条件にマッチしない場合は空配列を返す
  - find は対象の条件にマッチしない場合は null を返す
  - filter は対象の条件を抽出したもの、find は最初にマッチしたものを返すという挙動を理解すると自ずと理解ができる
