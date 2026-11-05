import type { ReactNode } from 'react';

export const yen = (n: number | null | undefined) =>
  n == null ? '個別見積もり' : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(n);
export const pct = (r: number) => `${Math.round(r * 100)}%`;
export const num = (n: number) => new Intl.NumberFormat('ja-JP').format(Math.round(n));

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = 'white',
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  tone?: 'white' | 'gray' | 'dark';
}) {
  const bg = { white: 'bg-white', gray: 'bg-[#F7F8FA]', dark: 'bg-[#12161C] text-[#E8EAED]' }[tone];
  return (
    <section id={id} className={`${bg} scroll-mt-16`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className={`font-mono text-xs tracking-widest ${tone === 'dark' ? 'text-[#3DD68C]' : 'text-[#0F9B8E]'}`}>{eyebrow}</div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mt-2">{title}</h2>
        {lead && <p className={`mt-3 max-w-3xl ${tone === 'dark' ? 'text-[#AAB4C0]' : 'text-[#475467]'}`}>{lead}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#E4E7EC] bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  format = (v) => String(v),
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-[#344054]">{label}</span>
        <span className="font-mono font-medium text-[#1A2332]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 accent-[#0F9B8E]"
      />
      {hint && <span className="block text-xs text-[#98A2B3]">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value, sub, tone = 'default' }: { label: string; value: string; sub?: string; tone?: 'default' | 'good' | 'muted' }) {
  const color = { default: 'text-[#1A2332]', good: 'text-[#0F9B8E]', muted: 'text-[#667085]' }[tone];
  return (
    <div>
      <div className="text-xs text-[#667085]">{label}</div>
      <div className={`font-display font-bold text-2xl mt-1 ${color}`}>{value}</div>
      {sub && <div className="text-xs text-[#98A2B3] mt-0.5">{sub}</div>}
    </div>
  );
}

/** 出典への参照（フッターの出典一覧 [n] へ飛ぶ） */
export function Ref({ n }: { n: number }) {
  return (
    <a href={`#source-${n}`} className="text-[#0F9B8E] text-xs align-super ml-0.5 hover:underline">
      [{n}]
    </a>
  );
}

export function Assumption({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs text-[#98A2B3] mt-4 leading-relaxed">
      <span className="inline-block mr-1.5 rounded bg-[#F2F4F7] text-[#667085] px-1.5 py-0.5">試算</span>
      {children}
    </p>
  );
}
