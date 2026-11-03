/**
 * 処理能力と費用の試算。
 * ai-callcenter-ollama の cost_model.py（Erlang C）をブラウザで動くように移植したもの。
 * 数値はすべて画面で変えられる「仮定」で、実績値ではない。
 */

/** 待ちが発生する確率（Erlang C）。大きな人数でも桁あふれしないよう Erlang B の漸化式で計算する。 */
export function erlangC(trafficErlangs: number, agents: number): number {
  const a = trafficErlangs;
  if (agents <= a) return 1;
  let b = 1;
  for (let k = 1; k <= agents; k++) b = (a * b) / (k + a * b);
  return (agents * b) / (agents - a * (1 - b));
}

/** 目標の応答率（例：80%を20秒以内）を満たす最小の人数 */
export function agentsForServiceLevel(
  trafficErlangs: number,
  ahtSec: number,
  targetSl = 0.8,
  answerWithinSec = 20,
): number {
  if (trafficErlangs <= 0) return 0;
  let n = Math.max(1, Math.ceil(trafficErlangs));
  for (;;) {
    const sl = 1 - erlangC(trafficErlangs, n) * Math.exp((-(n - trafficErlangs) * answerWithinSec) / ahtSec);
    if (sl >= targetSl) return n;
    n++;
  }
}

export interface Workload {
  peakCallsPerHour: number;
  aiHandleTimeSec: number; // AI が 1 通話にかける時間
  humanHandleTimeSec: number; // 人が 1 通話にかける時間（後処理を含む）
  aiResolutionRate: number; // AI だけで完結する割合（0〜1）
}

export interface CostAssumptions {
  operatorMonthlyCost: number; // オペレーター1人の月額（人件費・管理費・席代を含む）
  hiringCostPerOperator: number; // 採用・研修 1 人あたり
  annualAttritionRate: number; // 年間の離職率（0〜1）
  businessDaysPerMonth: number;
  dailyCallsPerPeakHour: number; // 1 日の件数 ≒ ピーク時 × この倍率
}

export const DEFAULT_WORKLOAD: Workload = {
  peakCallsPerHour: 120,
  aiHandleTimeSec: 240,
  humanHandleTimeSec: 360,
  aiResolutionRate: 0.6,
};

export const DEFAULT_COSTS: CostAssumptions = {
  operatorMonthlyCost: 350_000,
  hiringCostPerOperator: 200_000,
  annualAttritionRate: 0.3,
  businessDaysPerMonth: 21,
  dailyCallsPerPeakHour: 7,
};

export interface Comparison {
  monthlyCalls: number;
  humanOnly: { operators: number; monthly: number; perCall: number };
  withAi: {
    concurrentAiCalls: number; // AI 側に必要な同時通話数（3割の余裕込み）
    operators: number; // AI で完結しない通話に必要な人数
    platformMonthly: number; // AI コールセンターの利用料
    operatorMonthly: number;
    monthly: number;
    perCall: number;
  };
  monthlySaving: number;
}

/** 有人のみ と AI 併用 の月額を比べる。platformFee は必要な同時通話数から利用料を返す関数。 */
export function compare(
  w: Workload,
  c: CostAssumptions,
  platformFee: (concurrentCalls: number, monthlyCalls: number) => number,
): Comparison {
  const monthlyCalls = Math.round(w.peakCallsPerHour * c.dailyCallsPerPeakHour * c.businessDaysPerMonth);
  // 採用・研修費は離職で入れ替わる分を月割りで載せる
  const perOperator = c.operatorMonthlyCost + (c.hiringCostPerOperator * c.annualAttritionRate) / 12;

  const humanErlangs = (w.peakCallsPerHour * w.humanHandleTimeSec) / 3600;
  const humanOps = agentsForServiceLevel(humanErlangs, w.humanHandleTimeSec);
  const humanMonthly = Math.round(humanOps * perOperator);

  const aiErlangs = (w.peakCallsPerHour * w.aiHandleTimeSec) / 3600;
  const concurrentAiCalls = Math.max(1, Math.ceil(aiErlangs * 1.3));
  const remainingErlangs = (w.peakCallsPerHour * (1 - w.aiResolutionRate) * w.humanHandleTimeSec) / 3600;
  const aiOps = agentsForServiceLevel(remainingErlangs, w.humanHandleTimeSec);
  const platformMonthly = Math.round(platformFee(concurrentAiCalls, monthlyCalls));
  const operatorMonthly = Math.round(aiOps * perOperator);
  const aiMonthly = platformMonthly + operatorMonthly;

  return {
    monthlyCalls,
    humanOnly: { operators: humanOps, monthly: humanMonthly, perCall: humanMonthly / Math.max(monthlyCalls, 1) },
    withAi: {
      concurrentAiCalls,
      operators: aiOps,
      platformMonthly,
      operatorMonthly,
      monthly: aiMonthly,
      perCall: aiMonthly / Math.max(monthlyCalls, 1),
    },
    monthlySaving: humanMonthly - aiMonthly,
  };
}
