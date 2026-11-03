import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { compare, DEFAULT_COSTS, DEFAULT_WORKLOAD } from '../lib/capacity';
import { cheapestFee } from '../lib/pricing';
import { Assumption, Card, num, pct, Section, Slider, Stat, yen } from '../components/ui';

export default function Simulator({ aiRate, onAiRate }: { aiRate: number; onAiRate: (r: number) => void }) {
  const [peak, setPeak] = useState(DEFAULT_WORKLOAD.peakCallsPerHour);
  const [humanAht, setHumanAht] = useState(DEFAULT_WORKLOAD.humanHandleTimeSec);
  const [opCost, setOpCost] = useState(DEFAULT_COSTS.operatorMonthlyCost);

  const result = useMemo(
    () =>
      compare(
        { ...DEFAULT_WORKLOAD, peakCallsPerHour: peak, humanHandleTimeSec: humanAht, aiResolutionRate: aiRate },
        { ...DEFAULT_COSTS, operatorMonthlyCost: opCost },
        (c, m) => cheapestFee(c, m).fee ?? NaN,
      ),
    [peak, humanAht, opCost, aiRate],
  );
  const choice = cheapestFee(result.withAi.concurrentAiCalls, result.monthlyCalls);
  const custom = choice.fee == null;

  const chart = [
    { name: '有人のみ', オペレーター: result.humanOnly.monthly, 'AI 利用料': 0 },
    { name: 'AI 併用', オペレーター: result.withAi.operatorMonthly, 'AI 利用料': custom ? 0 : result.withAi.platformMonthly },
  ];

  return (
    <Section
      id="simulator"
      eyebrow="SIMULATOR"
      title="どれだけの問い合わせをこなせるか"
      lead="ピーク時の件数と AI で完結する割合から、必要なオペレーターの人数と月額の目安を出します。人数は「80%の電話に20秒以内に出る」水準で計算しています（Erlang C）。"
      tone="gray"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        <Card className="space-y-5">
          <Slider label="ピーク時の問い合わせ（1時間あたり）" value={peak} min={10} max={600} step={10} format={(v) => `${v}件`} onChange={setPeak} />
          <Slider
            label="AI で完結する割合"
            value={aiRate}
            min={0}
            max={0.85}
            step={0.05}
            format={pct}
            onChange={onAiRate}
            hint="下の「学習の進み方」で目標にした割合と連動します"
          />
          <Slider label="人が 1 件にかける時間（後処理込み）" value={humanAht} min={120} max={900} step={30} format={(v) => `${v / 60}分`} onChange={setHumanAht} />
          <Slider
            label="オペレーター 1 人の月額"
            value={opCost}
            min={200_000}
            max={600_000}
            step={10_000}
            format={yen}
            onChange={setOpCost}
            hint="人件費・管理費・席代などを含む"
          />
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <Stat label="月間の問い合わせ" value={`${num(result.monthlyCalls)}件`} sub="ピーク × 7 × 21営業日" />
              <Stat label="有人のみの人数" value={`${result.humanOnly.operators}人`} tone="muted" />
              <Stat label="AI 併用の人数" value={`${result.withAi.operators}人`} tone="good" sub={`AI の同時通話 ${result.withAi.concurrentAiCalls}`} />
              <Stat
                label="月額の差"
                value={custom ? '個別見積もり' : yen(result.monthlySaving)}
                tone="good"
                sub={custom ? undefined : `1件あたり ${yen(result.humanOnly.perCall)} → ${yen(result.withAi.perCall)}`}
              />
            </div>
          </Card>
          <Card>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">月額の比較</h3>
              <span className="text-xs text-[#667085]">
                AI の利用料：{choice.plan.label}・{choice.model === 'subscription' ? 'サブスク' : '従量課金'}（安いほうを自動で選択）
              </span>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E7EC" />
                  <XAxis type="number" tickFormatter={(v: number) => `${Math.round(v / 10_000)}万`} tick={{ fontSize: 11, fill: '#667085' }} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12, fill: '#344054' }} />
                  <Tooltip formatter={(v: number) => yen(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="オペレーター" stackId="a" fill="#98A2B3" />
                  <Bar dataKey="AI 利用料" stackId="a" fill="#0F9B8E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <Assumption>
        AI 側の通話時間は1件4分、AI の同時通話数は3割の余裕を見込んでいます。採用・研修・欠員にかかる費用は、数え方や期間で大きく変わるため含めていません（有人の費用は実際にはこれより大きくなります）。ai-callcenter-ollama の試算ロジック（cost_model.py）をブラウザで動かしています。料金は下の「料金」の仮の価格です。
      </Assumption>
    </Section>
  );
}
