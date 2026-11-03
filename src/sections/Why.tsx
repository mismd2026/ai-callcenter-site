import { Card, Section } from '../components/ui';

const POINTS = [
  {
    title: '人に頼らずに、件数の波を吸収する',
    body: '月末・キャンペーン・障害時など、問い合わせが急に増えても AI が同時に応対します。よくある質問は AI が答え、人は判断が必要な問い合わせに集中できます。',
  },
  {
    title: '採用・離職に左右されない',
    body: '席を埋めるための採用や研修、欠員の補充に追われる運用から離れられます。FAQ を整えた分だけ、応対の品質が積み上がっていきます。',
  },
  {
    title: '会話を社外に出さない',
    body: '音声認識・回答・音声合成をすべて自社の環境で動かし、外部のクラウド AI を使いません。医療・金融・自治体など、データの扱いに厳しい業種を想定しています。',
  },
  {
    title: '無理に AI に任せきらない',
    body: '「人と話したい」「解約したい」などは、すぐにオペレーターへつなぎます。人が受けた電話も同じ画面で記録でき、少しずつ AI に任せる範囲を広げられます。',
  },
];

export default function Why() {
  return (
    <Section
      id="why"
      eyebrow="WHY AI"
      title="なぜ今、AI コールセンターなのか"
      lead="人を増やして対応する方法は、費用も時間もかかり、続けること自体が難しくなっています。AI と人の役割を分けることで、少ない人数でも応対の質と量を保てます。"
      tone="gray"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {POINTS.map((p, i) => (
          <Card key={p.title}>
            <div className="font-mono text-xs text-[#0F9B8E]">0{i + 1}</div>
            <h3 className="font-semibold text-lg mt-1">{p.title}</h3>
            <p className="text-sm text-[#475467] mt-2 leading-relaxed">{p.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
