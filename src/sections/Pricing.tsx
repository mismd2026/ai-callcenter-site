import { BY_APPROACH, BY_BILLING, type PriceRange } from '../lib/market';
import { PRICE_REFERENCES } from '../sources';
import { Card, Section } from '../components/ui';

function RangeTable({ rows, head }: { rows: PriceRange[]; head: [string, string, string] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="text-left text-xs text-[#667085] border-b border-[#E4E7EC]">
            {head.map((h) => (
              <th key={h} className="font-medium py-2 px-1">
                {h}
              </th>
            ))}
            <th className="font-medium py-2 px-1">向いている場面</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-[#F2F4F7] last:border-0 align-top">
              <td className="py-2.5 px-1 font-medium">{r.name}</td>
              <td className="py-2.5 px-1 text-[#475467]">{r.initial}</td>
              <td className="py-2.5 px-1 font-mono text-[13px]">{r.monthly}</td>
              <td className="py-2.5 px-1 text-[#475467]">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="PRICE RANGE"
      title="AI による電話応対の価格の目安"
      lead={`導入のしかたと課金方式によって、費用の桁が変わります。公開されている相場の記事${PRICE_REFERENCES.length}件から、2026年時点の価格の目安を幅で整理しました。`}
      tone="gray"
    >
      <div className="grid grid-cols-1 gap-5">
        <Card>
          <h3 className="font-semibold">導入のしかたごとの目安</h3>
          <p className="text-sm text-[#475467] mt-1">既製のクラウドサービスを使うか、既存の仕組みに組み込むか、一から作るかで、初期費用は数万円から千万円単位まで開きます。</p>
          <div className="mt-4">
            <RangeTable rows={BY_APPROACH} head={['方式', '初期費用', '月額']} />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">課金方式ごとの目安</h3>
          <p className="text-sm text-[#475467] mt-1">
            件数が少なければ1件ごとに払う従量課金、件数が多ければ月額固定のほうが割安になりやすい、というのが一般的な選び方です。規模の大きいサービスは個別見積もりが多く、目安より高くなる傾向があります。
          </p>
          <div className="mt-4">
            <RangeTable rows={BY_BILLING} head={['方式', '初期費用', '利用料']} />
          </div>
        </Card>
      </div>
      <p className="text-xs text-[#98A2B3] mt-4 leading-relaxed">
        特定のサービスの価格ではなく、公開情報から整理した目安です（参考にした公開情報はページ下部に掲載）。税の扱いや含まれる範囲はサービスごとに異なります。このページで紹介しているプロトタイプ自体の料金ではありません。
      </p>
    </Section>
  );
}
