/**
 * AI による電話応対の市場の価格帯（公開されている相場記事・料金ページから）。
 * このページのプロトタイプ自体の料金ではない。数字は各出典の掲載時点のもの。
 * source は src/sources.ts の番号（ページ内の [n]）。
 */

export interface PriceRange {
  name: string;
  initial: string; // 初期費用
  monthly: string; // 月額・従量
  note: string;
  source: number;
}

/** 導入方式ごとの相場 */
export const BY_APPROACH: PriceRange[] = [
  { name: 'クラウド型の AI 電話サービス', initial: '0〜10万円程度', monthly: '月1万〜5万円程度', note: '小規模向けの SaaS', source: 9 },
  { name: 'クラウド PBX ＋ IVR ＋ 音声認識', initial: '10万〜50万円程度', monthly: '月3万〜10万円程度', note: '既存の電話設備の延長で組む', source: 9 },
  { name: '既存の CTI に AI を連携', initial: '50万〜300万円程度', monthly: '月5万〜20万円程度', note: 'コールセンターの仕組みに後付けする', source: 9 },
  { name: 'フルスクラッチ開発', initial: '300万〜1,000万円超', monthly: '—', note: '要件に合わせて一から作る', source: 9 },
];

/** 課金方式ごとの相場（ボイスボット） */
export const BY_BILLING: PriceRange[] = [
  { name: '従量課金型', initial: 'サービスごとに異なる', monthly: '応答1件あたり50〜200円程度', note: '件数が少ない企業向け', source: 10 },
  { name: '月額固定型', initial: '10万円〜', monthly: '月1万〜35万円程度', note: '件数が多い企業向け', source: 10 },
];

/** 従量課金型の相場（1件あたり、円） */
export const PER_CALL_RANGE = { min: 50, max: 200, typical: 100 } as const;

/** 1件あたりの単価から、AI 応対の月額を出す（すべての電話をまず AI が受ける前提） */
export function meteredFee(perCallYen: number, monthlyCalls: number): number {
  return Math.max(0, perCallYen) * Math.max(0, monthlyCalls);
}
