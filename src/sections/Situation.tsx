import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SOURCES } from '../sources';
import { Card, Section } from '../components/ui';

// 矢野経済研究所（2025年4月3日発表）：コールセンターサービス事業者が提供する AI サービスの国内市場規模
const AI_MARKET = [
  { year: '2023年度', value: 60, note: '推計' },
  { year: '2024年度', value: 90, note: '見込' },
  { year: '2028年度', value: 250, note: '予測' },
];

function Ref({ n }: { n: number }) {
  return (
    <a href={`#source-${n}`} className="text-[#0F9B8E] text-xs align-super ml-0.5 hover:underline">
      [{n}]
    </a>
  );
}

export default function Situation() {
  return (
    <Section
      id="situation"
      eyebrow="SITUATION"
      title="コールセンターを取り巻く今"
      lead="問い合わせは減らない一方で、電話に出る人を集め、育て、続けてもらうことが年々難しくなっています。"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <div className="text-xs text-[#667085]">働き手の減少</div>
          <div className="font-display font-bold text-3xl mt-2">
            5,275<span className="text-lg">万人</span>
          </div>
          <p className="text-sm text-[#475467] mt-2">
            2050年の生産年齢人口（15〜64歳）の見込み。2021年から29.2%減ります。1995年をピークに減り続けています。
            <Ref n={1} />
          </p>
        </Card>
        <Card>
          <div className="text-xs text-[#667085]">人件費の上昇</div>
          <div className="font-display font-bold text-3xl mt-2">
            1,227<span className="text-lg">円</span>
            <span className="text-base text-[#B42318] ml-2">+2.9%</span>
          </div>
          <p className="text-sm text-[#475467] mt-2">
            三大都市圏のアルバイト・パート募集時の平均時給（全職種、2025年2月、前年同月比）。席を埋めるための費用は上がり続けています。
            <Ref n={2} />
          </p>
        </Card>
        <Card>
          <div className="text-xs text-[#667085]">オペレーター不足</div>
          <div className="font-display font-bold text-3xl mt-2">続いている</div>
          <p className="text-sm text-[#475467] mt-2">
            「2024年も、コールセンターのオペレーター人材は不足した状態が続いていた」とされ、業務の自動化ニーズは引き続き拡大しています。
            <Ref n={3} />
          </p>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">コールセンター向け AI サービスの国内市場規模</h3>
          <span className="text-xs text-[#98A2B3]">単位：億円（事業者売上高ベース）</span>
        </div>
        <p className="text-sm text-[#475467] mt-1">
          2022年度から2028年度までの年平均成長率は30.8%と予測されています。
          <Ref n={3} />
        </p>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AI_MARKET} margin={{ top: 24, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#667085' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number, _n, p) => [`${v}億円（${p.payload.note}）`, '市場規模']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {AI_MARKET.map((d) => (
                  <Cell key={d.year} fill={d.note === '予測' ? '#9ED9D3' : '#0F9B8E'} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(v: number) => `${v}億円`} style={{ fontSize: 12, fill: '#1A2332' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-[#98A2B3]">2023年度は推計、2024年度は見込、2028年度は予測。出典：{SOURCES[2].title}</p>
      </Card>
    </Section>
  );
}
