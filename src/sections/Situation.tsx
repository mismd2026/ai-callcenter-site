import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SOURCES } from '../sources';
import { Card, Ref, Section } from '../components/ui';

// 矢野経済研究所（2026年5月29日発表）：コールセンターサービス事業者が提供する AI サービスの国内市場規模
const AI_MARKET = [
  { year: '2023年度', value: 60, note: '実績' },
  { year: '2024年度', value: 90, note: '実績' },
  { year: '2029年度', value: 313, note: '予測' },
];

// 最近の動き（要約はこのページで書いたもの。詳しくは出典の記事を参照）
const NEWS = [
  {
    date: '2026年10月',
    who: 'みなと銀行',
    title: '全支店の代表電話を自動応答に',
    body: '番号は変えずに自動応答を入れ、1か月分の着信を分析して案内を設計。試行した店舗では電話の約4割が行員を介さずに終わり、応答率も上がった。',
    source: 6,
  },
  {
    date: '2026年10月',
    who: 'ドコモSMTBネット銀行',
    title: '電話とチャットで同じ AI 応対基盤',
    body: '電話とチャットで同じナレッジを使い、FAQ や手続きの案内は AI、個別の確認や判断が必要なものはオペレーターに引き継ぐ分担で本番稼働。',
    source: 7,
  },
  {
    date: '2026年10月',
    who: '厚生労働省（各労働局）',
    title: 'カスタマーハラスメント対策が義務に',
    body: '事業主に、方針の明確化と周知、相談体制の整備、発生後の対応が求められるようになった。電話の最前線に立つ人をどう守るかも、コールセンター運営の論点になっている。',
    source: 8,
  },
  {
    date: '2025年12月',
    who: '三菱UFJ銀行',
    title: '生成 AI が用件を聞いて担当につなぐ',
    body: 'フリーダイヤルの一部で、生成 AI が顧客の話す用件を聞き取って最適なオペレーターに振り分ける受付を開始。受電内容の分析にも生成 AI を使い始めた。',
    source: 5,
  },
];

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
          2024年度は前年度の1.5倍に伸び、2029年度には313億円に達すると予測されています（2023〜2029年度の年平均成長率31.7%）。一方で、生成 AI を使ったサービスを導入済みの企業は19%、導入予定は30%にとどまり、電話の最前線では誤った回答（ハルシネーション）をどう抑えるかが課題とされています。
          <Ref n={4} />
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
        <p className="text-xs text-[#98A2B3]">2023・2024年度は実績、2029年度は予測。出典：{SOURCES[3].title}</p>
      </Card>

      <div className="mt-12">
        <h3 className="font-semibold text-lg">最近の動き</h3>
        <p className="text-sm text-[#475467] mt-1">金融機関を中心に、電話の一次受付を AI に任せ、判断が必要なものだけを人に渡す形が広がっています。詳しくは各記事をご覧ください。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {NEWS.map((n) => (
            <a
              key={n.title}
              href={SOURCES[n.source - 1].url}
              className="group rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6 hover:border-[#0F9B8E]/50 transition-colors"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-[#667085]">
                <span className="font-mono">{n.date}</span>
                <span>{n.who}</span>
              </div>
              <h4 className="font-semibold mt-1.5 group-hover:text-[#0F9B8E]">{n.title}</h4>
              <p className="text-sm text-[#475467] mt-2 leading-relaxed">{n.body}</p>
              <div className="text-xs text-[#0F9B8E] mt-3">記事を読む →</div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
