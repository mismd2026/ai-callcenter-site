import { useMemo, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ceilingRate, curve, DEFAULT_LEARNING, faqsForTarget, weeksToTarget, type LearningAssumptions } from '../lib/learning';
import { Assumption, Card, pct, Section, Slider, Stat } from '../components/ui';

export default function Learning({ target, onTarget }: { target: number; onTarget: (r: number) => void }) {
  const [a, setA] = useState<LearningAssumptions>(DEFAULT_LEARNING);
  const assumptions = { ...a, targetRate: target };
  const set = (k: keyof LearningAssumptions) => (v: number) => setA((prev) => ({ ...prev, [k]: v }));

  const points = useMemo(() => curve(assumptions, 24), [a, target]); // eslint-disable-line react-hooks/exhaustive-deps
  const weeks = weeksToTarget(assumptions);
  const needFaqs = faqsForTarget(assumptions);
  const ceiling = ceilingRate(assumptions);
  const data = points.map((p) => ({ week: p.week, rate: Math.round(p.rate * 1000) / 10, faqs: p.faqs }));

  return (
    <Section
      id="learning"
      eyebrow="LEARNING"
      title="FAQ を整えるほど、AI が答えられる範囲が広がる"
      lead="問い合わせは「よくある質問」に集中します。件数の多い質問から FAQ にしていくと、最初の数週間で AI が答えられる割合が大きく伸び、その後はゆるやかに上がっていきます。"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Card>
            <div className="grid grid-cols-3 gap-5">
              <Stat label="目標" value={pct(target)} sub="AI で完結する割合" />
              <Stat label="目標まで" value={weeks == null ? '届かない' : `約${weeks}週`} tone={weeks == null ? 'muted' : 'good'} sub="FAQ 取り込みから" />
              <Stat label="必要な FAQ" value={needFaqs == null ? '―' : `${needFaqs}件`} sub={`上限 ${pct(ceiling)}`} />
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold">AI で完結する割合の推移</h3>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 8, right: 56, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F9B8E" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#0F9B8E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
                  <ReferenceArea x1={0} x2={a.manualTestWeeks} fill="#F5A623" fillOpacity={0.08} label={{ value: '手動テスト', fontSize: 11, fill: '#B54708', position: 'insideTopLeft' }} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(w: number) => `${w}週`} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} unit="%" />
                  <Tooltip formatter={(v: number, k) => (k === 'rate' ? [`${v}%`, 'AI で完結'] : [`${v}件`, 'FAQ'])} labelFormatter={(w) => `${w}週目`} />
                  <ReferenceLine y={target * 100} stroke="#1A2332" strokeDasharray="4 4" label={{ value: `目標 ${pct(target)}`, fontSize: 11, position: 'right', fill: '#1A2332' }} />
                  <ReferenceLine y={ceiling * 100} stroke="#98A2B3" strokeDasharray="2 4" label={{ value: '上限', fontSize: 11, position: 'right', fill: '#98A2B3' }} />
                  {weeks != null && <ReferenceLine x={weeks} stroke="#0F9B8E" strokeDasharray="4 4" />}
                  <Area type="monotone" dataKey="rate" stroke="#0F9B8E" strokeWidth={2.5} fill="url(#rateFill)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#98A2B3] mt-2">
              上限＝回答の精度 ×（1 − 必ず人に代わる問い合わせの割合）。苦情や解約は、FAQ を増やしても AI の対象にしません。
            </p>
          </Card>
        </div>

        <Card className="space-y-5">
          <Slider label="目標とする AI で完結する割合" value={target} min={0.3} max={0.8} step={0.05} format={pct} onChange={onTarget} hint="上の「処理能力」の試算にも反映されます" />
          <Slider label="導入時に取り込む FAQ" value={a.initialFaqs} min={0} max={200} step={5} format={(v) => `${v}件`} onChange={set('initialFaqs')} hint="既存の FAQ を CSV で取り込む想定" />
          <Slider label="毎週追加する FAQ" value={a.faqsPerWeek} min={0} max={50} format={(v) => `${v}件/週`} onChange={set('faqsPerWeek')} hint="未回答レビューから登録する件数" />
          <Slider label="問い合わせの種類" value={a.questionTypes} min={100} max={2000} step={50} format={(v) => `${v}種類`} onChange={set('questionTypes')} hint="業務が広いほど多くなる" />
          <Slider label="回答の精度" value={a.answerAccuracy} min={0.6} max={0.98} step={0.02} format={pct} onChange={set('answerAccuracy')} />
          <Slider label="必ず人に代わる問い合わせ" value={a.forcedHumanShare} min={0} max={0.4} step={0.05} format={pct} onChange={set('forcedHumanShare')} hint="苦情・解約など" />
          <Slider label="手動テストの期間" value={a.manualTestWeeks} min={0} max={6} format={(v) => `${v}週`} onChange={set('manualTestWeeks')} />
        </Card>
      </div>
      <Assumption>
        実績ではなく、導入計画の目安を考えるためのモデルです。問い合わせの偏りはジップの法則（よくある質問ほど件数が多い）に従い、FAQ は件数の多い順に整備すると仮定しています。
      </Assumption>
    </Section>
  );
}
