import { useState } from 'react';
import Launch from './sections/Launch';
import Learning from './sections/Learning';
import Pricing from './sections/Pricing';
import Simulator from './sections/Simulator';
import Situation from './sections/Situation';
import Why from './sections/Why';
import { PRICE_REFERENCES, SOURCES } from './sources';

const NAV = [
  ['situation', '現状'],
  ['why', '必要性'],
  ['launch', '立ち上げ比較'],
  ['simulator', '処理能力'],
  ['learning', '学習'],
  ['pricing', '価格の目安'],
  ['demo', 'デモ'],
] as const;

const PORTAL_DEMO = 'https://mismd2026.github.io/ai-callcenter-portal/';
const REPOS = [
  ['ai-callcenter-ollama', 'AI コールセンター本体（音声認識・RAG・3層エスカレーション・GCP へのデプロイ）'],
  ['ai-callcenter-portal', '顧客ポータル・CMS・通話入力・運用コンソール'],
  ['terraform-gcp-baseline', 'ネットワークの土台（外部 IP なし・IAP 経由のみ）'],
  ['ai-callcenter-site', 'このページ'],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[#E4E7EC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-bold">
          <span className="w-7 h-7 rounded-lg bg-[#0F9B8E] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
          </span>
          AI Call Center
        </a>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="px-3 py-1.5 rounded-md text-[#475467] hover:text-[#1A2332] hover:bg-[#F2F4F7]">
              {label}
            </a>
          ))}
        </nav>
        <button className="md:hidden text-sm px-3 py-1.5 rounded-md border border-[#D0D5DD]" onClick={() => setOpen(!open)} aria-expanded={open}>
          メニュー
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-[#E4E7EC] px-4 py-2 grid grid-cols-3 gap-1 text-sm bg-white">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="px-2 py-2 rounded-md text-[#475467] hover:bg-[#F2F4F7]">
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-[#12161C] text-[#E8EAED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <div className="font-mono text-xs tracking-widest text-[#3DD68C]">SELF-HOSTED AI CALL CENTER</div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight mt-4 max-w-3xl">
          人が足りなくても、
          <br />
          電話に出られるコールセンターへ。
        </h1>
        <p className="mt-6 text-[#AAB4C0] max-w-2xl leading-relaxed">
          よくある問い合わせは AI が FAQ をもとに答え、判断が必要な電話だけを人につなぎます。会話は社外のクラウド AI に出さず、自社の環境だけで処理します。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#simulator" className="rounded-lg bg-[#3DD68C] text-[#0B0E12] px-5 py-3 text-sm font-semibold hover:bg-[#5FE0A2]">
            自社の件数で試算する
          </a>
          <a href={PORTAL_DEMO} className="rounded-lg border border-[#3A4556] px-5 py-3 text-sm font-semibold hover:bg-white/5">
            管理画面のデモを見る
          </a>
        </div>
        <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
          {[
            ['本稼働まで', '約4週', '有人なら約13週（想定）'],
            ['会話データ', '社外に出さない', '外部のクラウド AI 不使用'],
            ['人への切り替え', '3段階', 'FAQ 読み上げ → AI 回答 → 有人'],
            ['価格の目安', '1件50〜200円', '従量課金の場合（公開情報から整理）'],
          ].map(([k, v, s]) => (
            <div key={k}>
              <dt className="text-xs text-[#8B95A5]">{k}</dt>
              <dd className="font-display font-bold text-xl mt-1">{v}</dd>
              <dd className="text-xs text-[#8B95A5] mt-0.5">{s}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="bg-[#12161C] text-[#E8EAED] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="font-mono text-xs tracking-widest text-[#3DD68C]">DEMO</div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mt-2">実際の管理画面を触ってみる</h2>
        <p className="mt-3 text-[#AAB4C0] max-w-3xl">
          契約管理者・オペレーター・閲覧者・運用管理者の4つの立場で、ダッシュボード、FAQ の管理、通話入力、運用コンソールを確認できます（ログイン不要・架空のデータ）。
        </p>
        <a href={PORTAL_DEMO} className="inline-block mt-6 rounded-lg bg-[#3DD68C] text-[#0B0E12] px-5 py-3 text-sm font-semibold hover:bg-[#5FE0A2]">
          顧客ポータルのデモを開く
        </a>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {REPOS.map(([name, desc]) => (
            <a key={name} href={`https://github.com/mismd2026/${name}`} className="rounded-xl border border-[#2A3341] bg-[#161B23] p-5 hover:border-[#3A4556]">
              <div className="font-mono text-sm text-[#3DD68C]">{name}</div>
              <div className="text-sm text-[#AAB4C0] mt-1">{desc}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B0E12] text-[#8B95A5] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-4">
        <div>
          <div className="font-semibold text-[#AAB4C0] mb-2">出典</div>
          <ol className="space-y-1 list-decimal list-inside">
            {SOURCES.map((s, i) => (
              <li key={s.url} id={`source-${i + 1}`}>
                <a href={s.url} className="hover:text-[#E8EAED] underline underline-offset-2">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <div className="font-semibold text-[#AAB4C0] mb-2">価格の目安で参考にした公開情報</div>
          <ul className="space-y-1">
            {PRICE_REFERENCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="hover:text-[#E8EAED] underline underline-offset-2">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="leading-relaxed">
          このページはポートフォリオとして作成したプロトタイプの紹介ページです。試算・期間はすべて仮定にもとづく目安です。価格は公開情報から整理した目安で、このプロトタイプの料金ではありません。掲載している社名・サービス名は各社の商標です。各社とは提携関係になく、掲載について各社の確認を得たものではありません。
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  // 「処理能力」の AI 解決率と「学習」の目標を連動させる
  const [aiRate, setAiRate] = useState(0.6);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Situation />
        <Why />
        <Launch />
        <Simulator aiRate={aiRate} onAiRate={setAiRate} />
        <Learning target={aiRate} onTarget={setAiRate} />
        <Pricing />
        <Demo />
      </main>
      <Footer />
    </>
  );
}
