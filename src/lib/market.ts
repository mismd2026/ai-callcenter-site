/**
 * AI による電話応対の価格の目安。
 * 公開されている相場記事（src/sources.ts の PRICE_REFERENCES）から幅として整理したもので、
 * 特定のサービスの価格でも、このページのプロトタイプの料金でもない。
 */

export interface PriceRange {
  name: string;
  initial: string; // 初期費用
  monthly: string; // 月額・従量
  note: string;
}

/** 導入方式ごとの目安 */
export const BY_APPROACH: PriceRange[] = [
  { name: 'クラウド型の AI 電話サービス', initial: '0〜10万円程度', monthly: '月1万〜5万円程度', note: '小規模向けの SaaS' },
  { name: 'クラウド PBX ＋ IVR ＋ 音声認識', initial: '10万〜50万円程度', monthly: '月3万〜10万円程度', note: '既存の電話設備の延長で組む' },
  { name: '既存の CTI に AI を連携', initial: '50万〜300万円程度', monthly: '月5万〜20万円程度', note: 'コールセンターの仕組みに後付けする' },
  { name: 'フルスクラッチ開発', initial: '300万〜1,000万円超', monthly: '—', note: '要件に合わせて一から作る' },
];

/** 課金方式ごとの目安 */
export const BY_BILLING: PriceRange[] = [
  { name: '従量課金型', initial: 'サービスごとに異なる', monthly: '応答1件あたり50〜200円程度', note: '件数が少ない企業向け' },
  { name: '月額固定型', initial: '10万円〜', monthly: '月1万〜35万円程度', note: '件数が多い企業向け' },
];

/** 従量課金型の目安（1件あたり、円） */
export const PER_CALL_RANGE = { min: 50, max: 200, typical: 100 } as const;

/** 1件あたりの単価から、AI 応対の月額を出す（すべての電話をまず AI が受ける前提） */
export function meteredFee(perCallYen: number, monthlyCalls: number): number {
  return Math.max(0, perCallYen) * Math.max(0, monthlyCalls);
}
