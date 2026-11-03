import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { breakEvenCalls, monthlyFee, PLANS, type BillingModel } from '../lib/pricing';
import { Assumption, Card, num, Section, Slider, yen } from '../components/ui';

export default function Pricing() {
  const [model, setModel] = useState<BillingModel>('subscription');
  const [calls, setCalls] = useState(3000);
  const [selected, setSelected] = useState('small');
  const plan = PLANS.find((p) => p.tier === selected)!;
  const be = breakEvenCalls(plan);

  const chart = Array.from({ length: 11 }, (_, i) => {
    const c = Math.round(((be ?? 5000) * 2 * i) / 10);
    return { calls: c, サブスク: monthlyFee(plan, 'subscription', c), 従量課金: monthlyFee(plan, 'metered', c) };
  });

  return (
    <Section
      id="pricing"
      eyebrow="PRICING"
      title="料金"
      lead="基本は月額定額のサブスクリプションです。通話数が少ない時期や、件数の変動が大きい業務には、基本料金を抑えて通話ごとに支払う従量課金を選べます。"
      tone="gray"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-xl border border-[#D0D5DD] bg-white p-1" role="tablist" aria-label="課金方式">
          {(['subscription', 'metered'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={model === m}
              onClick={() => setModel(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${model === m ? 'bg-[#1A2332] text-white' : 'text-[#475467]'}`}
            >
              {m === 'subscription' ? 'サブスク（月額定額）' : '従量課金'}
            </button>
          ))}
        </div>
        {model === 'metered' && (
          <div className="flex-1 min-w-[240px] max-w-sm">
            <Slider label="月間の通話数" value={calls} min={0} max={60000} step={500} format={(v) => `${num(v)}件`} onChange={setCalls} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {PLANS.map((p) => {
          const fee = monthlyFee(p, model, calls);
          const active = p.tier === selected;
          return (
            <button
              key={p.tier}
              onClick={() => setSelected(p.tier)}
              className={`text-left rounded-2xl border bg-white p-5 transition-colors ${active ? 'border-[#0F9B8E] ring-2 ring-[#0F9B8E]/20' : 'border-[#E4E7EC] hover:border-[#0F9B8E]/50'}`}
            >
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="font-display font-bold text-xl mt-2">{yen(fee)}</div>
              <div className="text-xs text-[#667085] mt-0.5">
                {fee == null ? '構成に合わせてご提案' : model === 'subscription' ? '月額（税抜）' : `基本 ${yen(p.meteredBase)} ＋ ${yen(p.perCallFee)}/通話`}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-[#475467]">
                {p.highlights.map((h) => (
                  <li key={h}>・{h}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <Card className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">{plan.label}：サブスクと従量課金の比較</h3>
          {be != null && (
            <span className="text-sm text-[#475467]">
              月 <span className="font-mono font-medium text-[#1A2332]">{num(be)}件</span> までなら従量課金が割安
            </span>
          )}
        </div>
        {be == null ? (
          <p className="text-sm text-[#475467] mt-3">大規模プランは、構成と通話数に合わせて個別にお見積もりします。</p>
        ) : (
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
                <XAxis dataKey="calls" tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(v: number) => `${num(v)}件`} />
                <YAxis tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(v: number) => `${Math.round(v / 10_000)}万`} />
                <Tooltip formatter={(v: number) => yen(v)} labelFormatter={(v) => `月 ${num(Number(v))}件`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine x={chart.reduce((b, d) => (Math.abs(d.calls - be) < Math.abs(b - be) ? d.calls : b), 0)} stroke="#98A2B3" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="サブスク" stroke="#1A2332" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="従量課金" stroke="#0F9B8E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-sm text-[#475467] mt-4">
          導入時には<strong>導入支援クレジット</strong>をお付けします。従量課金の通話料金など、基本料金以外の費用と相殺されるので、手動テストの期間も費用を抑えて始められます。
        </p>
      </Card>
      <Assumption>価格はポートフォリオ用の試算の仮の値で、実際の提供価格ではありません。</Assumption>
    </Section>
  );
}
