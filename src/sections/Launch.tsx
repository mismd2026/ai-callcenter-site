import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Assumption, Card, Section } from '../components/ui';

interface Step {
  name: string;
  start: number; // 週
  weeks: number;
  detail: string;
}

// 立ち上げにかかる期間の目安（想定）。業種や規模で大きく変わる
const HUMAN: Step[] = [
  { name: '席・回線・CTI の準備', start: 0, weeks: 4, detail: 'オフィスの席、電話回線、通話システム、PC の手配と構築' },
  { name: '採用', start: 2, weeks: 6, detail: '求人、面接、条件調整。必要な人数がそろうまで繰り返す' },
  { name: '研修', start: 8, weeks: 3, detail: '商品知識、応対マナー、システム操作の研修' },
  { name: '試行運用（OJT）', start: 11, weeks: 2, detail: '先輩の横で応対し、品質を確認する' },
  { name: '本稼働', start: 13, weeks: 3, detail: '以降も欠員補充・シフト調整・再研修が続く' },
];

const AI: Step[] = [
  { name: '契約・環境構築', start: 0, weeks: 1, detail: 'ネットワークと AI の実行環境を自動で構築（Terraform）' },
  { name: 'FAQ の取り込み', start: 1, weeks: 1, detail: '既存の FAQ を CSV で取り込み、応答設定を決める' },
  { name: '手動テスト', start: 2, weeks: 2, detail: '人が電話を受けて記録し、FAQ の抜けを洗い出す' },
  { name: '本稼働', start: 4, weeks: 12, detail: '未回答の質問を毎週 FAQ に追加し、AI の対応範囲を広げる' },
];

function Timeline({ title, steps, color, total }: { title: string; steps: Step[]; color: string; total: number }) {
  const data = steps.map((s) => ({ name: s.name, offset: s.start, weeks: s.weeks, detail: s.detail }));
  const live = steps.find((s) => s.name === '本稼働')!.start;
  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm">
          本稼働まで <span className="font-display font-bold text-xl" style={{ color }}>約{live}週</span>
        </span>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E7EC" />
            <XAxis type="number" domain={[0, total]} tick={{ fontSize: 11, fill: '#667085' }} unit="週" />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: '#344054' }} />
            <Tooltip
              formatter={(v: number, key) => (key === 'weeks' ? [`${v}週`, '期間'] : [null, null])}
              labelFormatter={(label, payload) => `${label}：${payload?.[0]?.payload?.detail ?? ''}`}
            />
            <Bar dataKey="offset" stackId="a" fill="transparent" />
            <Bar dataKey="weeks" stackId="a" fill={color} radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ol className="mt-2 space-y-1.5 text-sm text-[#475467]">
        {steps.map((s) => (
          <li key={s.name}>
            <span className="font-medium text-[#1A2332]">{s.name}</span>：{s.detail}
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function Launch() {
  return (
    <Section
      id="launch"
      eyebrow="LAUNCH"
      title="立ち上げと運用の流れを比べる"
      lead="有人のコールセンターは、人を集めて育てるまで電話を受けられません。AI コールセンターは環境を自動で作り、既存の FAQ を取り込んで、手動テストをしながら始められます。"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Timeline title="有人のコールセンター" steps={HUMAN} color="#98A2B3" total={16} />
        <Timeline title="AI コールセンター" steps={AI} color="#0F9B8E" total={16} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {[
          ['運用で続く仕事', '欠員補充・シフト・再研修', '未回答レビューで FAQ を追加'],
          ['応対の質のばらつき', '担当者の経験に左右される', 'FAQ に沿って毎回同じ品質'],
          ['問い合わせが増えたとき', '採用からやり直し', '同時通話数の上限を上げるだけ'],
        ].map(([title, human, ai]) => (
          <Card key={title}>
            <div className="text-xs text-[#667085]">{title}</div>
            <div className="mt-3 flex items-start gap-2 text-sm">
              <span className="shrink-0 rounded bg-[#F2F4F7] px-1.5 py-0.5 text-[11px] text-[#475467]">有人</span>
              <span className="text-[#475467]">{human}</span>
            </div>
            <div className="mt-2 flex items-start gap-2 text-sm">
              <span className="shrink-0 rounded bg-[#0F9B8E]/10 px-1.5 py-0.5 text-[11px] text-[#0B7A70]">AI</span>
              <span className="font-medium">{ai}</span>
            </div>
          </Card>
        ))}
      </div>
      <Assumption>期間は一般的な立ち上げの流れをもとにした想定です。規模・業種・既存の FAQ の有無によって変わります。</Assumption>
    </Section>
  );
}
