---
title: "S3 Vectors を削除する"
excerpt: "cls3 を使って AWS S3でベクターデータを削除する"
date: "2025-08-17"
tech: "aws"
---

## はじめに

この記事では、AWS S3に保存されたベクターデータを削除する方法について説明します。

最近ベクトルDBの1つとしてS3がサポートされるようになった※1 いうことで、筆者も Bedrock Knowledge Base のデータソースとして S3 を利用するハンズオンを行なって遊びました。安価にサクッとベクトルデータを扱えるのがとても良きですね。

※1
https://aws.amazon.com/about-aws/whats-new/2025/07/amazon-s3-vectors-preview-native-support-storing-querying-vectors/

ハンズオン終了後、不要になったベクトルデータを格納しているバケットを削除しようとしたところ、削除の I/F がないことに気づきました。どうやら現状だとコンソールからは削除ができないようです。

まあ普通に `aws s3vectors` コマンドを使って削除すればいいだけなんですが、たまたま下のポストを見かけました。便利そうなので今回使ってみることにします。

https://x.com/365_step_tech/status/1950149845986971890

## cls3 を使って S3 Vectors を削除する
いくつかインストールの方法があるようですが、今回は Homebrew を使ってインストールします。

```bash
brew install go-to-k/tap/cls3
```

AWS プロファイルとしては `bedrock-handson` を使って、対象のS3 Vectorsが閲覧できることを確認します。

```bash
$ AWS_PROFILE=bedrock-handson aws s3vectors list-vector-buckets
{
    "vectorBuckets": [
        {
            "vectorBucketName": "bedrock-knowledge-base-3fwe6q",
            "vectorBucketArn": "arn:aws:s3vectors:us-east-1:566318462159:bucket/bedrock-knowledge-base-3fwe6q",
            "creationTime": "2025-07-24T23:11:57+09:00"
        }
    ]
}
```

では実際に cls3 を使って削除してみます。
`-V` を指定することで S3 Vectors の削除を行うことができます。今回は `-f` オプションも指定して、バケットの中身とバケット自体を一緒に削除します。

```
$ cls3 -b bedrock-knowledge-base-3fwe6q -p bedrock-handson -V -f

WRN You are in the Vector Buckets Mode `-V` to clear the Vector Buckets for S3 Vectors. In this mode, operation across regions is not possible, but only in one region. You can specify the region with the `-r` option.
INF Number of buckets:  1
INF Concurrency number: 1
INF Key prefix: 
INF bedrock-knowledge-base-3fwe6q Checking...
bedrock-knowledge-base-3fwe6q Cleared!!!  1 indexes
INF bedrock-knowledge-base-3fwe6q Cleared!!: 1 indexes.
INF bedrock-knowledge-base-3fwe6q Deleted!!
```

リージョンを指定していなかったので警告が出ていますが、それ以外は何も問題なく削除できました。

念のためコンソール上でも削除されていることが確認できました。
![Console confirmation](/assets/blog/posts/delete-s3-vectors/console-confirmation.png)

## おわり
cls3 使って S3 Vectors を削除してみました。まあ特にこれといったことはないですが、こんな感じで雑なアウトプットができるのも個人ブログのいいところだと思うので、今後も肩の力を抜いて雑にアウトプットしていきたいと思います。
