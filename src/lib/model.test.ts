import { describe, expect, it } from 'vitest';
import { agentsForServiceLevel, compare, DEFAULT_COSTS, DEFAULT_WORKLOAD, erlangC } from './capacity';
import { coverage, curve, DEFAULT_LEARNING, faqsForTarget, resolutionRate, weeksToTarget } from './learning';
import { breakEvenCalls, cheapestFee, monthlyFee, PLANS, planFor } from './pricing';

describe('Erlang C（cost_model.py と同じ値）', () => {
  it('教科書の例：10アーラン・12人で待ち確率 ≒ 0.4494', () => {
    expect(erlangC(10, 12)).toBeCloseTo(0.4494, 3);
  });
  it('人数が負荷以下なら必ず待つ', () => {
    expect(erlangC(10, 10)).toBe(1);
  });
  it('大きな人数でも計算できる（桁あふれしない）', () => {
    const p = erlangC(400, 430);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });
  it('目標の応答率には負荷より多い人数が必要', () => {
    expect(agentsForServiceLevel(10, 180)).toBeGreaterThan(10);
    expect(agentsForServiceLevel(0, 180)).toBe(0);
  });
});

describe('有人のみ と AI 併用 の比較', () => {
  const fee = (c: number, m: number) => cheapestFee(c, m).fee ?? 0;
  it('AI の解決率が高いほど、必要な人数と費用が下がる', () => {
    const low = compare({ ...DEFAULT_WORKLOAD, aiResolutionRate: 0.3 }, DEFAULT_COSTS, fee);
    const high = compare({ ...DEFAULT_WORKLOAD, aiResolutionRate: 0.8 }, DEFAULT_COSTS, fee);
    expect(high.withAi.operators).toBeLessThan(low.withAi.operators);
    expect(high.withAi.monthly).toBeLessThan(low.withAi.monthly);
    expect(high.humanOnly).toEqual(low.humanOnly);
  });
  it('月間件数 = ピーク × 倍率 × 営業日', () => {
    const r = compare(DEFAULT_WORKLOAD, DEFAULT_COSTS, fee);
    expect(r.monthlyCalls).toBe(120 * 7 * 21);
    expect(r.monthlySaving).toBe(r.humanOnly.monthly - r.withAi.monthly);
  });
});

describe('料金', () => {
  const small = PLANS[0];
  it('サブスクは件数によらず定額、従量は件数に比例', () => {
    expect(monthlyFee(small, 'subscription', 0)).toBe(120_000);
    expect(monthlyFee(small, 'subscription', 9999)).toBe(120_000);
    expect(monthlyFee(small, 'metered', 1000)).toBe(60_000 + 30 * 1000);
  });
  it('損益分岐の件数を境に、安い方式が切り替わる', () => {
    const be = breakEvenCalls(small)!;
    expect(be).toBe(2000);
    expect(cheapestFee(5, be - 100).model).toBe('metered');
    expect(cheapestFee(5, be + 100).model).toBe('subscription');
  });
  it('同時通話数に合うプランを選ぶ', () => {
    expect(planFor(8).tier).toBe('small');
    expect(planFor(80).tier).toBe('mid_take');
    expect(planFor(500).tier).toBe('large');
    expect(cheapestFee(500, 1).fee).toBeNull();
  });
});

describe('FAQ 整備による学習曲線', () => {
  it('上位の質問ほど問い合わせの多くを占める', () => {
    expect(coverage(0, 400, 1)).toBe(0);
    expect(coverage(400, 400, 1)).toBeCloseTo(1);
    expect(coverage(40, 400, 1)).toBeGreaterThan(0.6); // 上位1割で6割超（偏りが1.0のとき）
  });
  it('解決率は FAQ が増えるほど上がり、上限（精度×AI対象）を超えない', () => {
    const points = curve(DEFAULT_LEARNING, 30);
    for (let i = 1; i < points.length; i++) expect(points[i].rate).toBeGreaterThanOrEqual(points[i - 1].rate);
    const ceiling = DEFAULT_LEARNING.answerAccuracy * (1 - DEFAULT_LEARNING.forcedHumanShare);
    expect(points[points.length - 1].rate).toBeLessThanOrEqual(ceiling + 1e-9);
  });
  it('目標に届く週と必要な FAQ 数がつじつまが合う', () => {
    const w = weeksToTarget(DEFAULT_LEARNING)!;
    const need = faqsForTarget(DEFAULT_LEARNING)!;
    const faqsAtW = DEFAULT_LEARNING.initialFaqs + DEFAULT_LEARNING.faqsPerWeek * w;
    expect(faqsAtW).toBeGreaterThanOrEqual(need);
    expect(resolutionRate(faqsAtW, DEFAULT_LEARNING)).toBeGreaterThanOrEqual(DEFAULT_LEARNING.targetRate);
  });
  it('上限を超える目標には届かない', () => {
    expect(weeksToTarget({ ...DEFAULT_LEARNING, targetRate: 0.9 })).toBeNull();
  });
});
