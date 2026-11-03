# AI Call Center — 紹介サイト

自社完結型の AI コールセンター（[ai-callcenter-ollama](https://github.com/mismd2026/ai-callcenter-ollama)）を、契約を検討する企業向けに紹介するページです。
導入を判断するときに知りたい「どれだけの問い合わせをこなせるか」「FAQ を整えるとどこまで AI が答えられるか」「それにどれくらい時間がかかるか」を、グラフとシミュレーターで確認できます。

**公開ページ**：https://mismd2026.github.io/ai-callcenter-site/

## 内容

| セクション | 内容 |
| --- | --- |
| 現状 | 働き手の減少、人件費の上昇、オペレーター不足、AI サービス市場の伸び（出典付き） |
| 必要性 | 件数の波の吸収、採用・離職からの解放、会話を社外に出さない、AI に任せきらない設計 |
| 立ち上げ比較 | 有人コールセンターと AI コールセンターの、本稼働までの流れと期間（ガントチャート） |
| 処理能力 | ピーク時の件数と AI 解決率から、必要な人数と月額を比較（Erlang C） |
| 学習 | FAQ の整備に伴う AI 解決率の推移と、目標に届くまでの週数 |
| 料金 | サブスク（月額定額）と従量課金の切り替え、損益分岐の件数 |
| デモ | [顧客ポータルのデモ](https://mismd2026.github.io/ai-callcenter-portal/)と関連リポジトリへのリンク |

「処理能力」の AI 解決率と「学習」の目標は連動していて、FAQ の整備計画から費用の見通しまでを続けて試せます。

## 試算のしくみ

- **処理能力**（`src/lib/capacity.ts`）：ai-callcenter-ollama の `cost_model.py`（Erlang C）を TypeScript に移植。大きな人数でも桁あふれしないよう、Erlang B の漸化式で計算しています。人数は「80% の電話に 20 秒以内に出る」水準で求めます
- **学習曲線**（`src/lib/learning.ts`）：問い合わせの偏りがジップの法則に従い、FAQ を件数の多い順に整備すると仮定したモデル。AI 解決率 ＝ FAQ の網羅率 × 回答精度 ×（1 − 必ず人に代わる割合）
- **料金**（`src/lib/pricing.ts`）：プランごとのサブスク料金と、従量課金の基本料金・通話単価。ポータルの契約データ（`billing_model` / `per_call_fee`）と同じ考え方です

計算は単体テストで確認しています（`src/lib/model.test.ts`。Erlang C の教科書の値、損益分岐、学習曲線の単調性など）。

> 試算・料金・期間はすべて仮定にもとづく目安です。実績値や実際の提供条件ではありません。

## 技術スタック

React 18 / TypeScript / Vite / Tailwind CSS / Recharts / Vitest / GitHub Actions（型チェック → テスト → ビルド → GitHub Pages）

## ローカルでの実行

```bash
npm install
npm run dev
npm test
```

## License

MIT
