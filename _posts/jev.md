---
title: "Jev 触ってみた"
excerpt: "Jev を色々と呼び出してみて感触を掴む"
date: "2026-09-19"
tech: "jev"
---

## はじめに
Jev が賑わせてるので触ってみた。

https://lolipop.jp/ai/gateway/info/product/2026-09-18/

1週間限定で無料で触れるとのことだったので、試してみた。

## やったこと
LOLIPOP AI ゲートウェイを使う。

APIキーを発行して適当にモデル一覧を読んでみる。
```sh
$ curl "$AI_GATEWAY_BASE_URL/v1/models" -H "Authorization: Bearer $AI_GATEWAY_API_KEY" | jq .
```

モデルがあったので呼び出す。
```json
{
  "id": "typesafe/jev-latest",
  "object": "model",
  "created": 0,
  "owned_by": "lolipop-ai-gateway",
  "output_modality": "probabilistic_decision",
  "byokRequired": false
}
```

一旦、なんのこっちゃ分からないが呼び出してみる。
```sh
$ curl "$AI_GATEWAY_BASE_URL/v1/systemone" \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-latest",
    "state": "この問い合わせは、注文した商品が届かず、明日までに必要だという内容です。",
    "questions": {
      "department": {
        "type": "choice",
        "instructions": "この問い合わせはどの担当に回すべきですか？",
        "criteria": {
          "delivery": "配送や未着に関する問い合わせ",
          "billing": "請求や支払いに関する問い合わせ",
          "other": "どちらにも該当しない問い合わせ"
        }
      }
    }
  }'
```

返ってきた。
```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "delivery",
      "confidence": 1,
      "probabilities": {
        "other": 0,
        "delivery": 1,
        "billing": 0
      }
    }
  },
  "usage": {
    "input_tokens": 411,
    "output_tokens": 38
  }
}
```

answers が実際のレスポンスに対応。

注文した商品が届かないので、どこの部署が担当すべきかというと、delivery(配送部署) で、確かに自明だから confidence が 1 で他の選択肢はない、というように解釈しているっぽい。

試しに state を以下のようにして返金を匂わせる形にしてみた。

```diff
---この問い合わせは、注文した商品が届かず、明日までに必要だという内容です。
+++この問い合わせは、注文した商品が届かず、明日までに必要だが、明日までに届かない場合、返金対応を求めているとのこと。
```

```json
"answers": {
  "department": {
    "type": "choice",
    "choice": "delivery",
    "confidence": 0.98,
    "probabilities": {
      "delivery": 0.99,
      "other": 0,
      "billing": 0.01
    }
  }
},
```

billing 側が微増した。

逆に、返金対応がメインであることを渡してみた。

```diff
---この問い合わせは、注文した商品が届かず、明日までに必要だが、明日までに届かない場合、返金対応を求めているとのこと。
+++この問い合わせは、注文した商品について、返金対応を求めているとのこと。
```

こうなると、ほぼbilling が勝つようになる。

```json
"department": {
    "type": "choice",
    "choice": "billing",
    "confidence": 0.97,
    "probabilities": {
      "other": 0.02,
      "delivery": 0,
      "billing": 0.98
    }
  }
},
```

### 公式のドキュメントを読む
https://typesafe.ai/blog/introducing-system-one-models-and-jev 

テキスト出力は行わず、事前に決められた構造化データの上で、与えられた条件や文脈から意思決定をすることに最適化されたモデル、みたいな感じぽい。
あとめっちゃ早いしめっちゃ安い。登場する "smart if statements" という単語がわかりやすかった。あとめっちゃ並列(255) でクエリを投げれるのも強みみたい。

https://docs.typesafe.ai/api

APIドキュメントを見る。現状はこの1エンドポイントのみ提供されている。シンプル。
- POST https://api.typesafe.ai/v1/systemone

#### request body
3つ。
- state
- model
- questions

state はモデルが評価するためのデータを含める。今までのLLM的な価値観だとここに質問を書きたくなるけど、何を意思決定してほしいかの題材？を渡すっぽい。
プレーンテキストでもobjectやarrayなどのデータ構造をそのまま渡せる。

model は単にどのバージョンの Jev を使うかという話。

questions は　string と Question の map になってるみたいで、特定のキーと一緒に質問や命令を渡すとそのキー配下に答えを返してくれるみたい。
確かに最初の例で

```json
'{
  "model": "typesafe/jev-latest",
  "state": "この問い合わせは、注文した商品が届かず、明日までに必要だという内容です。",
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "この問い合わせはどの担当に回すべきですか？",
      "criteria": {
        "delivery": "配送や未着に関する問い合わせ",
        "billing": "請求や支払いに関する問い合わせ",
        "other": "どちらにも該当しない問い合わせ"
      }
    }
  }
}'
```

"department" というキーを渡しているが、対応する回答も department キー配下に得られている。

```json
"department": {
    "type": "choice",
    "choice": "billing",
    "confidence": 0.97,
    "probabilities": {
      "other": 0.02,
      "delivery": 0,
      "billing": 0.98
    }
  }
},
```

#### question について
https://docs.typesafe.ai/api#question-types

type として3種類定義されている。
- Noul
- Choice
- Score

Noul は Yes/No の質問、Choice は選択肢からどれか1つを選択してもらう、Score は選択肢について0~1で評価をしてくれるみたい。

### 各 question タイプを呼び出してみる
```json
{
  "model": "typesafe/jev-latest",
  "state": "注文した商品がまだ届きません。支払いは済んでいます。来週の引っ越しで使う予定だったので困っています。配送状況を確認して、間に合わないならキャンセルしたいです。",
  "questions": {
    "needs_urgent_action": {
      "type": "noul",
      "instructions": "この問い合わせには、期限を意識した早めの対応要求が含まれていますか？",
      "criteria": {
        "true": "期限や予定があり、早めの対応を求めている",
        "false": "急ぎの期限や早めの対応要求はない"
      }
    },
    "department": {
      "type": "choice",
      "instructions": "この問い合わせは、どの担当に回すべきですか？",
      "criteria": {
        "delivery": "商品の配送状況や未着に関する問い合わせ",
        "billing": "支払い、請求、決済に関する問い合わせ",
        "cancellation": "注文キャンセルや解約に関する問い合わせ",
        "other": "上記に該当しない問い合わせ"
      }
    },
    "customer_frustration": {
      "type": "score",
      "instructions": "顧客の不満の強さを評価してください。",
      "criteria": [
        "冷静に状況を説明している",
        "困っている、不満を感じている",
        "強く怒っている、厳しい表現がある"
      ]
    }
  }
}
```

```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "needs_urgent_action": {
      "type": "noul",
      "noul": 0.96
    },
    "department": {
      "type": "choice",
      "choice": "delivery",
      "confidence": 0.99,
      "probabilities": {
        "delivery": 0.99,
        "other": 0,
        "cancellation": 0.01,
        "billing": 0
      }
    },
    "customer_frustration": {
      "type": "score",
      "score": 0.99,
      "confidence": 0.98,
      "legend": {
        "0": "冷静に状況を説明している",
        "1": "困っている、不満を感じている",
        "2": "強く怒っている、厳しい表現がある"
      },
      "probabilities": {
        "0": 0.01,
        "1": 0.99,
        "2": 0
      }
    }
  },
  "usage": {
    "input_tokens": 677,
    "output_tokens": 85
  }
}
```

Noul も 0.96 という数値で返ってくるのか。0がNoで1がYesでそのグラデーションという感じみたい。
scoreやchoiceにもprobabilitiesというキーがあるし、自信度をモデルが返してくれるのは結構ありがたい気がする。

```json
'{
    "model": "typesafe/jev-latest",
    "state": "注文した商品が届かないまま、支払いだけは済んでいます。何度問い合わせても連 絡がなく、こちらは予定を大幅に狂わされました。いい加減にしてください。今日中に配送状況を 説明し、届かないなら全額返金してください。対応しない場合は消費者センターへの相談も検討し ます。",
    "questions": {
      "customer_frustration": {
        "type": "score",
        "instructions": "顧客の不満の強さを評価してください。",
        "criteria": [
          "冷静に状況を説明している",
          "困っている、不満を感じている",
          "強く怒っている、厳しい表現がある"
        ]
      }
    }
  }'
```

こんな感じでブチギレさせると、ちゃんと "2" (強く怒っている、厳しい表現がある) が1として返る。

```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "customer_frustration": {
      "type": "score",
      "score": 2,
      "confidence": 0.99,
      "legend": {
        "0": "冷静に状況を説明している",
        "1": "困っている、不満を感じている",
        "2": "強く怒っている、厳しい表現がある"
      },
      "probabilities": {
        "0": 0,
        "1": 0,
        "2": 1
      }
    }
  },
  "usage": {
    "input_tokens": 477,
    "output_tokens": 20
  }
}
```

無理やり曖昧にさせると、ちゃんと confidence が下がる。

```json
{
  "model": "typesafe/jev-latest",
  "state": "注文した商品が届いていないような気がしますが、家族が受け取っている可能性もあります。配送済みの通知を見た気もしますが、別の注文だったかもしれません。支払いは済んでいると思いますが、請求に見覚えがない気もします。来週使う予定だったような気もしますが、そもそも本当に必要だったかは分かりません。キャンセルしたい気もしますが、届くならそのままでも構いません。急いでいるわけではありませんが、できれば早めに確認してほしく、ただ今日中でなくても問題ありません。特に怒ってはいませんが、少し困っているような、そうでもないような状態です。",
  "questions": {
    "customer_frustration": {
      "type": "score",
      "instructions": "顧客の不満の強さを評価してください。",
      "criteria": [
        "冷静に状況を説明している",
        "困っている、不満を感じている",
        "強く怒っている、厳しい表現がある"
      ]
    }
  }
}
```

```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "customer_frustration": {
      "type": "score",
      "score": 0.65,
      "confidence": 0.47,
      "legend": {
        "0": "冷静に状況を説明している",
        "1": "困っている、不満を感じている",
        "2": "強く怒っている、厳しい表現がある"
      },
      "probabilities": {
        "0": 0.35,
        "1": 0.65,
        "2": 0
      }
    }
  },
  "usage": {
    "input_tokens": 611,
    "output_tokens": 20
  }
}
```

## わかったこと
確かにこれは色々アイデアが降ってくるのわかるなーという感想。
LLMベースで条件判定しているところとかを置き換えたくなるし、LLMのサポート役という感じで紹介されてたのも頷ける。

従量課金だとアレなので、早くサブスクリプションに含めて自由に呼び出せるようになってくれたら嬉しい。
