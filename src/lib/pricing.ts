/**
 * 料金プラン（試算用の仮の価格）。
 * 基本は月額定額（サブスクリプション）。通話数が少ない・変動が大きい場合に向けて、
 * 基本料金を下げて通話ごとに課金する従量課金オプションを選べる。
 * ポータル（ai-callcenter-portal）の契約データの billing_model / per_call_fee と同じ考え方。
 */

export type BillingModel = 'subscription' | 'metered';

export interface Plan {
  tier: string;
  label: string;
  concurrentLimit: number; // 同時に受けられる通話数
  subscriptionMonthly: number | null; // null = 個別見積もり
  meteredBase: number | null;
  perCallFee: number | null;
  highlights: string[];
}

export const PLANS: Plan[] = [
  {
    tier: 'small',
    label: '最小プラン',
    concurrentLimit: 10,
    subscriptionMonthly: 120_000,
    meteredBase: 60_000,
    perCallFee: 30,
    highlights: ['同時10通話', 'FAQ・応答設定の CMS', '通話入力（有人対応の記録）'],
  },
  {
    tier: 'mid_ume',
    label: '中間プラン（梅）',
    concurrentLimit: 30,
    subscriptionMonthly: 350_000,
    meteredBase: 175_000,
    perCallFee: 25,
    highlights: ['同時30通話', '複数拠点の契約をまとめて管理', '導入支援クレジット付き'],
  },
  {
    tier: 'mid_take',
    label: '中間プラン（竹）',
    concurrentLimit: 100,
    subscriptionMonthly: 1_000_000,
    meteredBase: 500_000,
    perCallFee: 20,
    highlights: ['同時100通話', '専任の導入担当', '月次の改善レポート'],
  },
  {
    tier: 'mid_matsu',
    label: '中間プラン（松）',
    concurrentLimit: 200,
    subscriptionMonthly: 1_800_000,
    meteredBase: 900_000,
    perCallFee: 18,
    highlights: ['同時200通話', 'GPU の専有', '稼働率の保証（SLA）'],
  },
  {
    tier: 'large',
    label: '大規模プラン',
    concurrentLimit: Infinity,
    subscriptionMonthly: null,
    meteredBase: null,
    perCallFee: null,
    highlights: ['同時200通話超', '自社データセンター・閉域網での構築', '個別にお見積もり'],
  },
];

export function monthlyFee(plan: Plan, model: BillingModel, monthlyCalls: number): number | null {
  if (model === 'subscription') return plan.subscriptionMonthly;
  if (plan.meteredBase == null || plan.perCallFee == null) return null;
  return plan.meteredBase + plan.perCallFee * monthlyCalls;
}

/** 従量課金のほうが安くなる月間通話数の上限（これ未満なら従量課金が割安） */
export function breakEvenCalls(plan: Plan): number | null {
  if (plan.subscriptionMonthly == null || plan.meteredBase == null || !plan.perCallFee) return null;
  return Math.floor((plan.subscriptionMonthly - plan.meteredBase) / plan.perCallFee);
}

/** 必要な同時通話数を満たす最小のプラン */
export function planFor(concurrentCalls: number): Plan {
  return PLANS.find((p) => p.concurrentLimit >= concurrentCalls) ?? PLANS[PLANS.length - 1];
}

/** 必要な同時通話数と月間通話数から、安いほうの課金方式で利用料を出す */
export function cheapestFee(concurrentCalls: number, monthlyCalls: number): { plan: Plan; model: BillingModel; fee: number | null } {
  const plan = planFor(concurrentCalls);
  const sub = monthlyFee(plan, 'subscription', monthlyCalls);
  const met = monthlyFee(plan, 'metered', monthlyCalls);
  if (sub == null) return { plan, model: 'subscription', fee: null };
  if (met != null && met < sub) return { plan, model: 'metered', fee: met };
  return { plan, model: 'subscription', fee: sub };
}
