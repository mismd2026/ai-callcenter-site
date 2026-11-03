/**
 * FAQ の整備に伴って、AI が自動で解決できる割合がどう伸びるかのモデル試算。
 *
 * 前提（画面で変えられる）:
 *  - 問い合わせの種類は「よくある質問ほど件数が多い」偏り（ジップの法則）に従う
 *  - FAQ は件数の多い質問から順に整備される（未回答レビューで多い順に登録していく運用）
 *  - AI が解決できる割合 = FAQ が網羅する問い合わせの割合 × 回答精度
 *  - 苦情・解約など「必ず人に代わる」問い合わせは AI の対象外
 *
 * 実績値ではなく、導入計画の目安を考えるためのモデル。
 */

export interface LearningAssumptions {
  questionTypes: number; // 問い合わせの種類の数（言い換えをまとめた単位）
  skew: number; // 偏りの強さ（1.0 前後。大きいほど上位に集中）
  initialFaqs: number; // 導入時に CSV などで登録する FAQ の数
  faqsPerWeek: number; // 未回答レビューで毎週追加する FAQ の数
  answerAccuracy: number; // FAQ にある質問に AI が正しく答える割合（0〜1）
  forcedHumanShare: number; // 必ず人に代わる問い合わせの割合（0〜1）
  targetRate: number; // 目標とする AI 解決率（0〜1）
  manualTestWeeks: number; // 本稼働前の手動テスト期間（週）
}

export const DEFAULT_LEARNING: LearningAssumptions = {
  questionTypes: 500,
  skew: 0.9,
  initialFaqs: 20,
  faqsPerWeek: 10,
  answerAccuracy: 0.9,
  forcedHumanShare: 0.15,
  targetRate: 0.6,
  manualTestWeeks: 2,
};

/** 上位 n 種類の質問が、問い合わせ全体の何割を占めるか */
export function coverage(n: number, types: number, skew: number): number {
  const top = Math.min(Math.max(0, Math.floor(n)), types);
  let all = 0;
  let covered = 0;
  for (let i = 1; i <= types; i++) {
    const w = 1 / i ** skew;
    all += w;
    if (i <= top) covered += w;
  }
  return all ? covered / all : 0;
}

export function resolutionRate(faqs: number, a: LearningAssumptions): number {
  return coverage(faqs, a.questionTypes, a.skew) * a.answerAccuracy * (1 - a.forcedHumanShare);
}

/** AI が解決できる割合の上限（FAQ をすべて整備した場合） */
export function ceilingRate(a: LearningAssumptions): number {
  return a.answerAccuracy * (1 - a.forcedHumanShare);
}

export interface WeekPoint {
  week: number;
  faqs: number;
  rate: number; // 0〜1
  phase: '手動テスト' | '本稼働';
}

export function curve(a: LearningAssumptions, weeks = 24): WeekPoint[] {
  const points: WeekPoint[] = [];
  for (let w = 0; w <= weeks; w++) {
    const faqs = Math.min(a.questionTypes, a.initialFaqs + a.faqsPerWeek * w);
    points.push({
      week: w,
      faqs,
      rate: resolutionRate(faqs, a),
      phase: w < a.manualTestWeeks ? '手動テスト' : '本稼働',
    });
  }
  return points;
}

/** 目標に届く週（届かなければ null） */
export function weeksToTarget(a: LearningAssumptions, maxWeeks = 104): number | null {
  if (ceilingRate(a) < a.targetRate) return null;
  for (let w = 0; w <= maxWeeks; w++) {
    const faqs = Math.min(a.questionTypes, a.initialFaqs + a.faqsPerWeek * w);
    if (resolutionRate(faqs, a) >= a.targetRate) return w;
  }
  return null;
}

/** 目標に必要な FAQ の数（届かなければ null） */
export function faqsForTarget(a: LearningAssumptions): number | null {
  for (let n = 0; n <= a.questionTypes; n++) if (resolutionRate(n, a) >= a.targetRate) return n;
  return null;
}
