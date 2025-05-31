---
title: "django を触る"
excerpt: "ざっくりどんなものか触ってみた"
date: "2025-01-31"
coverImage: "/api/og?title=django%20を触る&tech=django"
---

## 書籍
https://www.manning.com/books/django-in-action

これを読み進めていく

### djangoの実行パスについて
- wsgi.py が起点となる
    - WebServerGatewayInterface で、これが python で書かれた Web アプリケーションと Web サーバーとを接続する
    - Web サーバは wsgi.py を呼び出す

### プロジェクトセットアップ
RiffMates というアプリケーションを作成する。バンドメンバー募集だったりのアプリケーションっぽい。
せっかくなので uv も合わせて使ってみる。（書籍だと普通に pip を使っている）

```sh
$ uv init riff-mates
$ uv sync
$ uv add django
$ uv run django-admin startproject RiffMates .
```

### Hello, World!
色々ファイルが生えますが、manage.py に引数付きで渡すとサーバが立ち上がる。

```sh
uv run ./manage.py runserver
```

![alt text](/assets/blog/posts/hello-django/image.png)

デフォルトの設定は Debug モードが有効化されていて、本番用には無効化した方がいいと書いてある（何が有効となっているかはまだわからない）

### App と言う概念
Module のようなものっぽい。App が model / view などを持つよう。

```sh
$ uv run ./manage.py startapp home
```

ここで生成される幾つかのファイルのうち home/views.py に実際のレスポンスを記載する。
そしてトップレベルの urls.py に、その app と path との対応関係を記載する。

### テンプレート
- Template と Context
    - Template インスタンスの render メソッドの引数に Context を渡す

```python
>>> from django.template import Template, Context
>>> t = Template("Hello {{name}}")  #1
>>> c = Context({"name":"Rumpelstiltskin"}) #2
>>> t.render(c)  #3
'Hello Rumpelstiltskin'
```

Context が template の値をバインドする

### ORM
- Python のモデル定義からマイグレーションファイルを生成できるみたい、便利
  - makemigrations コマンドがある
- migrate コマンドでマイグレーションが走る
  - デフォルトはSQLiteなので、db プロセスを用意したりするのは不要
  - MySQL とか別のエンジンを使いたい時は settings.py の DATABASES を変更すると良さげ
  - できたデータベースの確認用などには dbshell コマンドがある
- `__gt` で greater than みたいに、suffix を追加してクエリが組める、ちょっと気持ち悪さ
- パスパラメータの取得は url の path 定義で型と合わせて定義する
    - `path('musician/<int:musician_id>/', views.musician, name="musician")` みたいな
- ページネーションも標準でサポートされていて、Pagenator インスタンスを view に渡し、DSLで指定する

#### 1:N の関連付けについて

```python
class Venue(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return f"Venue(id={self.id}, name={self.name})"

class Room(models.Model):
    name = models.CharField(max_length=20)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)

    def __str__(self):
        return f"Room(id={self.id}, name={self.name})"
```

こんなようなモデルを定義し、migrate を行うとデータベースが追加される。ちゃんと外部制約がついている。
```sql
sqlite> .schema bands_room
CREATE TABLE IF NOT EXISTS "bands_room" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(20) NOT NULL, "venue_id" bigint NOT NULL REFERENCES "bands_venue" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE INDEX "bands_room_venue_id_16903c8e" ON "bands_room" ("venue_id");
```

```python
>>> len(Venue.objects.filter(room__name__startswith="R"))
1
```

このように、リレーションに対する要素やそれに対するクエリも、同じようにかける。

#### N:N の関連付けについて
```python
class Musician(models.Model):
    name = models.CharField(max_length=20)
    bands = models.ManyToManyField(Band)

    def __str__(self):
        return f"Musician(id={self.id}, name={self.name})"
```

ManyToManyField というメソッドがあり、これを使って関連付けを宣言する。
すると、N:N用の交差テーブルが生成される。へー

```sql
sqlite> .schema bands_band_members
CREATE TABLE IF NOT EXISTS "bands_band_members" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "band_id" bigint NOT NULL REFERENCES "bands_band" ("id") DEFERRABLE INITIALLY DEFERRED, "musician_id" bigint NOT NULL REFERENCES "bands_musician" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE UNIQUE INDEX "bands_band_members_band_id_musician_id_37c80d4a_uniq" ON "bands_band_members" ("band_id", "musician_id");
CREATE INDEX "bands_band_members_band_id_7354f73c" ON "bands_band_members" ("band_id");
CREATE INDEX "bands_band_members_musician_id_2930c024" ON "bands_band_members" ("musician_id");
```

最後に ORM だけど SQL がどうなってるか知らないとパフォーマンスに懸念のあるクエリを書いてしまうよという話が書いてあった。

### Django Admin
- モデルの作成やリストが見れる画面
- 実際にモデルに対するCRUD操作を、色んな設定を追加することでカスタマイズできる
    - 実務レベルでどこまでやっているのかが気になる
    - 便利そうではあるが、ポリシーの設定だったり監査観点でどうなんだろう

### 認証について
- ユーザ認証の仕組みが入っている
- User というモデル（テーブル）がデフォルトで用意されていて、そのモデルと既存のモデルを紐つけることができる
    - OneToOneField というメソッドを使う
- パスワードリセットのための仕組みも入っていて、各ビューを用意し、そこに色々書くことで設定できる
    - API ベースでやる時はどうするんだろうか？

### マイグレーションについて
```
❯ uv run manage.py makemigrations promoters
It is impossible to add a non-nullable field 'famous_for' to promoter without specifying a default. This is because the database needs something to populate existing rows.
Please select a fix:
 1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
 2) Quit and manually define a default value in models.py.
Select an option:
```

後から not nullable のカラムを追加するときに、すでにレコードがあると、それらについてどうする？という注意書きが出てくる、へー。

1 を選ぶと、Python の REPL が起動して、そこでデフォルト値を設定することができる。面白い

```
Please enter the default value as valid Python.
The datetime and django.utils.timezone modules are available, so it is possible to provide e.g. timezone.now as a value.
Type 'exit' to exit this prompt
>>>
```

生成されたマイグレーションスクリプトを見ると、デフォルト値が設定されていることがわかる（今回は空文字にした）

```python
migrations.AddField(
            model_name='promoter',
            name='famous_for',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
```

### その他雑メモ
- `manage.py shell` でREPLが起動する
- `manage.py dbshell` でデータベースに接続できる
- Form モデルが用意されていて、それを使うことでフォームのview生成からバリデーションまでできる
    - Formモデルは、フォーム経由でCRUDするモデルとのマッピングを定義することができて、フォームオブジェクト経由でデータの検証や保存ができる

今回のリポジトリ
https://github.com/nogtk/django-catch-up
