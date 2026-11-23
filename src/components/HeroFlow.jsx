import { CalendarCheck, BellRing, Bot } from 'lucide-react';

// Hero'daki "örnek akış" paneli: bir WhatsApp randevu botunun gerçekte nasıl çalıştığını gösterir.
// Adımlar açılışta bir kez sırayla belirir (index.css > .flow-step), sonra sabit kalır.
// Metinler i18n dosyalarında hero.demo altında.
export default function HeroFlow({ demo }) {
  const steps = [
    ...demo.messages.map((msg) => ({ kind: 'msg', ...msg })),
    ...demo.events.map((text, i) => ({ kind: 'event', text, icon: i === 0 ? CalendarCheck : BellRing })),
  ];

  return (
    <figure className="overflow-hidden rounded-card border border-line bg-surface shadow-[0_1px_0_var(--color-line),0_24px_48px_-32px_color-mix(in_oklab,var(--color-fg)_35%,transparent)]">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <span className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
            <Bot className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-fg">{demo.title}</span>
            <span className="block text-xs text-fg-subtle">{demo.label}</span>
          </span>
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-muted">{demo.channel}</span>
      </figcaption>

      <ol className="space-y-3 bg-page/60 px-5 py-5">
        {steps.map((step, i) => {
          if (step.kind === 'event') {
            const Icon = step.icon;
            return (
              <li key={step.text} className="flow-step flex items-center gap-2.5 text-sm text-accent" style={{ '--i': i }}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-medium">{step.text}</span>
              </li>
            );
          }
          const fromBot = step.from === 'bot';
          return (
            <li key={step.text} className={`flow-step flex ${fromBot ? 'justify-end' : 'justify-start'}`} style={{ '--i': i }}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                  fromBot ? 'rounded-br-md bg-accent text-accent-ink' : 'rounded-bl-md border border-line bg-surface text-fg'
                }`}
              >
                <span className="sr-only">{fromBot ? demo.bot : demo.customer}: </span>
                {step.text}
                <span className={`mt-1 block text-right text-[0.6875rem] tabular-nums ${fromBot ? 'text-accent-ink/75' : 'text-fg-subtle'}`}>
                  {step.time}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="flow-step border-t border-line px-5 py-4 text-sm leading-relaxed text-fg-muted" style={{ '--i': steps.length }}>
        {demo.result}
      </p>
    </figure>
  );
}
