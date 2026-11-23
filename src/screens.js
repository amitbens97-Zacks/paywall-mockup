// The screens of the paywall mockup:
//   paywall  - one card: plan, price, what opens, accountant add-on; 5 free days
//   checkout - stand-in for the clearing company's hosted page (CHING): save a card, 0 ₪ today
//   welcome  - the trial started: the chapters are open, the dates of the trial
//   home     - after "לא עכשיו": chapter 3 waits on the home page
import { html, useState, Icon, PencilCheck, cx, money } from './lib.js';
import { Button, Mark, Panel, SharkAvatar } from './components.js';
import { USER, PRICE, ACCOUNTANT, ACCOUNTANT_ITEMS, TRIAL, TRIAL_DAYS, UNLOCKS, yearSaving, DEMO_COUPON } from './data.js';

// What is charged on the first charge day, by the user's choice.
export function chargeOf(plan) {
  const base = PRICE[plan.interval].charge;
  const acc = plan.accountant ? (plan.interval === 'year' ? ACCOUNTANT.perMonth * 12 : ACCOUNTANT.perMonth) + ACCOUNTANT.setup : 0;
  return base + acc;
}

function Heading({ eyebrow, title, sub }) {
  return html`<div class="fb-heading mb-4">
    <span class="fb-eyebrow">${eyebrow}</span>
    <h1 class="fb-h1 text-[28px] md:text-[36px]">${title[0]}<${Mark}>${title[1]}<//>${title[2] || ''}</h1>
    ${sub && html`<p>${sub}</p>`}
  </div>`;
}

// ---------- paywall ----------
// One card, read top to bottom: the plan, the price, what it opens, the accountant add-on.
// The button sits in the fixed bottom bar. Nothing else on the page (Amit 23.11: as clean as possible).

function Billing({ interval, onChange }) {
  return html`<div role="radiogroup" aria-label="תקופת חיוב" class="inline-flex shrink-0 rounded-xl border border-line bg-canvas p-1">
    ${[['month', 'חודשי'], ['year', 'שנתי']].map(([id, label]) => html`<button key=${id} type="button" role="radio" aria-checked=${interval === id} onClick=${() => onChange(id)} class=${cx('h-9 rounded-[10px] px-4 text-[15px] font-bold cursor-pointer', interval === id ? 'bg-brand-600 text-white shadow-sm' : 'text-muted hover:text-brand-600')}>${label}</button>`)}
  </div>`;
}

function PlanCard({ plan, up }) {
  const p = PRICE[plan.interval];
  const year = plan.interval === 'year';
  const [details, setDetails] = useState(false);
  return html`<${Panel} class="!p-0 overflow-hidden">
    <div class="px-5 pb-4 pt-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="font-display text-[20px] font-extrabold">מנוי FlowBiz</p>
        <${Billing} interval=${plan.interval} onChange=${(interval) => up({ interval })} />
      </div>
      <p class="mt-4 flex items-baseline gap-2"><b class="font-display text-[44px] font-black leading-none tabular-nums">${money(p.perMonth)}</b><span class="text-[16px] font-semibold text-muted">לחודש</span></p>
      <p class="mt-1.5 text-[14px] text-muted">${year ? html`${money(p.charge)} בחיוב שנתי · <b class="text-money">חוסך ${money(yearSaving)}</b>` : 'חיוב חודשי'}</p>
    </div>
    <ul class="space-y-2 border-t border-line px-5 py-4" aria-label="מה נפתח">
      ${UNLOCKS.map((c) => html`<li key=${c.n} class="flex items-center gap-2.5 text-[16px]"><${Icon} name="check" size=${18} class="shrink-0 text-brand-600" /><span class="min-w-0"><b>${c.gets}</b> <span class="text-[14px] text-muted">· פרק ${c.n}</span></span></li>`)}
    </ul>
    <div class="border-t border-line bg-canvas/60 px-5 py-3">
      <div class="flex items-center gap-3">
        <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
          <input type="checkbox" checked=${plan.accountant} onChange=${(e) => up({ accountant: e.target.checked })} class="h-5 w-5 shrink-0 cursor-pointer accent-[#0038b8]" />
          <span class="min-w-0 text-[15px]"><b>להוסיף רואה חשבון</b> <span class="text-muted">· ${money(ACCOUNTANT.perMonth)} לחודש</span></span>
        </label>
        <button type="button" class="shrink-0 text-[13px] font-bold text-brand-600 hover:underline cursor-pointer" onClick=${() => setDetails(!details)} aria-expanded=${details}>פרטים</button>
      </div>
      ${details && html`<ul class="rise mt-2 space-y-1 ps-8 text-[14px]">
        ${ACCOUNTANT_ITEMS.map((t) => html`<li key=${t} class="flex items-center gap-1.5"><${Icon} name="check" size=${14} class="text-brand-600" />${t}</li>`)}
        <li class="text-muted">ועוד ${money(ACCOUNTANT.setup)} פעם אחת, לפתיחת התיקים ברשויות</li>
      </ul>`}
    </div>
  <//>`;
}

function Timeline({ plan, started }) {
  const pts = [
    [started ? 'check' : 'lock-open', 'היום', started ? 'הכל פתוח' : 'הכל נפתח', '0 ₪'],
    ['bell', TRIAL.remind, 'תזכורת במייל', null],
    ['credit-card', TRIAL.charge, 'חיוב ראשון', money(chargeOf(plan))],
  ];
  return html`<div aria-label=${`${TRIAL_DAYS} ימי ניסיון`}>
    <p class="mb-2 text-[15px] font-bold">${TRIAL_DAYS} ימים חינם</p>
    <ol class="relative grid grid-cols-3 gap-2">
      <span class="absolute inset-x-[16%] top-[17px] h-[2px] bg-brand-200" aria-hidden="true"></span>
      ${pts.map(([icon, when, what, amount], i) => html`<li key=${when} class="relative flex flex-col items-center text-center">
        <span class=${cx('grid h-9 w-9 place-items-center rounded-full ring-2', i === 0 ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-brand-600 ring-brand-200')}><${Icon} name=${icon} size=${17} /></span>
        <b class="mt-1.5 text-[14px]">${when}</b>
        <span class="text-[13px] text-muted">${what}</span>
        ${amount && html`<span class=${cx('text-[14px] font-bold tabular-nums', i === 0 ? 'text-money' : 'text-ink')}>${amount}</span>`}
      </li>`)}
    </ol>
  </div>`;
}

function Coupon({ onValid }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  if (!open) return html`<button type="button" class="text-[14px] font-semibold text-muted underline underline-offset-4 hover:text-brand-600 cursor-pointer" onClick=${() => setOpen(true)}>יש לי קוד</button>`;
  const apply = () => (code.trim().toUpperCase() === DEMO_COUPON ? onValid(code.trim().toUpperCase()) : setErr('הקוד לא תקין'));
  return html`<div class="rise max-w-sm">
    <div class="flex gap-1.5">
      <input value=${code} onInput=${(e) => (setCode(e.target.value.toUpperCase()), setErr(''))} onKeyDown=${(e) => (e.stopPropagation(), e.key === 'Enter' && apply())} placeholder="קוד" aria-label="קוד קופון" dir="ltr" class="h-10 min-w-0 flex-1 rounded-xl bg-white px-3 text-center text-[15px] font-bold tracking-wider ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand-300" />
      <${Button} variant="mini" onClick=${apply}>להחיל<//>
    </div>
    ${err && html`<p class="mt-1 text-[13px] font-semibold text-error" role="alert">${err}</p>`}
  </div>`;
}

function Legal({ notify }) {
  const links = ['תנאי שימוש', 'מדיניות פרטיות', 'הצהרת נגישות'];
  return html`<footer class="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-line pt-4 text-[13px] text-muted">
    ${links.map((l) => html`<a key=${l} href="#" class="hover:text-brand-600 hover:underline" onClick=${(e) => (e.preventDefault(), notify(`במערכת: עמוד "${l}"`, 'file-text'))}>${l}</a>`)}
    <a href="#" class="hover:text-brand-600 hover:underline" onClick=${(e) => (e.preventDefault(), notify('במערכת: כתובת תמיכה על הדומיין של FlowBiz', 'mail'))}>תמיכה</a>
  </footer>`;
}

export function Paywall({ plan, up, onCoupon, notify }) {
  return html`<div class="mx-auto max-w-xl px-4 py-5 md:py-8">
    <${Heading} eyebrow="סיימת את החלק החינמי" title=${['ממשיכים עם ', 'מנוי', '']} sub=${`${TRIAL_DAYS} ימים חינם, וביטול בקליק בכל רגע.`} />
    <${PlanCard} plan=${plan} up=${up} />
    <div class="mt-3 flex justify-center"><${Coupon} onValid=${onCoupon} /></div>
    <${Legal} notify=${notify} />
  </div>`;
}

// ---------- checkout: the hosted payment page stands in here ----------

export function Checkout({ plan }) {
  const rows = [
    ['המסלול', `FlowBiz ${PRICE[plan.interval].label}${plan.accountant ? ' + רואה חשבון' : ''}`],
    ['היום', '0 ₪'],
    [`ב-${TRIAL.charge}`, money(chargeOf(plan))],
  ];
  return html`<div class="mx-auto max-w-lg px-4 py-6 md:py-10">
    <${Heading} eyebrow="תשלום מאובטח" title=${['היום ', 'לא יורד כסף', '']} sub=${`שומרים כרטיס, ו-${TRIAL_DAYS} הימים מתחילים.`} />
    <${Panel}>
      <dl class="space-y-1.5 text-[15px]">
        ${rows.map(([k, v], i) => html`<div key=${k} class=${cx('flex items-baseline justify-between gap-3', i === 2 && 'border-t border-line pt-1.5 font-bold')}><dt>${k}</dt><dd class=${cx('tabular-nums', i === 1 && 'font-bold text-money')}>${v}</dd></div>`)}
      </dl>
      <div class="mt-4 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-4 py-6 text-center text-[14px] text-muted">
        <${Icon} name="shield-check" size=${26} class="mx-auto mb-1.5 text-brand-600" />
        כאן נפתח עמוד התשלום של חברת הסליקה.<br />במוקאפ אין שדות כרטיס.
      </div>
    <//>
  </div>`;
}

// ---------- welcome: the trial started ----------

// The four chapters, now open.
function OpenChapters() {
  return html`<ul class="grid gap-2 sm:grid-cols-2">
    ${UNLOCKS.map((c, i) => html`<li key=${c.n} class="rise flex items-center gap-3 rounded-2xl border-[1.5px] border-brand-300 bg-white px-4 py-3" style=${{ animationDelay: `${i * 80}ms` }}>
      <span class="fb-chip-ic h-9 w-9 shrink-0"><${Icon} name=${c.icon} size=${18} /></span>
      <span class="min-w-0 flex-1"><b class="block text-[16px]">${c.title}</b><span class="text-[13px] font-semibold text-brand-700">${c.gets}</span></span>
      <${PencilCheck} size=${20} color="#0038b8" delay=${i * 80} />
    </li>`)}
  </ul>`;
}

export function Welcome({ plan, coupon }) {
  return html`<div class="mx-auto max-w-3xl px-4 py-6 md:px-7 md:py-10">
    <${Heading}
      eyebrow=${coupon ? `קוד ${coupon}` : 'הפרקים פתוחים'}
      title=${coupon ? ['פרקים 3 עד 6 ', 'פתוחים', ''] : [`${TRIAL_DAYS} הימים שלך `, 'התחילו', '']}
      sub=${coupon ? 'הקוד פתח את המסלול. אין חיוב.' : `החיוב הראשון ב-${TRIAL.charge}, ותזכורת יום לפני.`}
    />
    <${OpenChapters} />
    ${!coupon && html`<div class="mt-6 max-w-md"><${Timeline} plan=${plan} started /></div>`}
  </div>`;
}

// ---------- home: after "לא עכשיו" ----------

export function Home({ onOpen, notify }) {
  return html`<div class="mx-auto max-w-4xl px-4 py-6 md:px-7 md:py-8">
    <h1 class="mb-4 font-display text-[28px] font-black">שלום ${USER.name}</h1>
    <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
      <${Panel}>
        <span class="fb-eyebrow">פרק 3 · בניית מותג אישי</span>
        <p class="mt-1 font-display text-[22px] font-extrabold">הפרקים הבאים מחכים לך</p>
        <ul class="mt-3 grid gap-2 sm:grid-cols-2">
          ${UNLOCKS[0].steps.map((s) => html`<li key=${s.name} class="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[15px] ring-1 ring-line"><${Icon} name="lock-keyhole" size=${15} class="shrink-0 text-muted" /><span class="min-w-0"><b>${s.gets}</b> <span class="text-[13px] text-muted">· ${s.name}</span></span></li>`)}
        </ul>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <${Button} onClick=${onOpen}>להתחיל ${TRIAL_DAYS} ימים חינם<${Icon} name="arrow-left" size=${18} /><//>
          <span class="text-[14px] text-muted">היום 0 ₪ · ביטול בקליק</span>
        </div>
      <//>
      <div class="space-y-2">
        ${[
          ['file-text', 'התוכנית העסקית', 'פתוחה'],
          ['wallet', 'עמוד הכספים', 'פתוח'],
        ].map(([icon, t, s]) => html`<button key=${t} type="button" onClick=${() => notify(`במערכת: ${t}`, icon)} class="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-start ring-1 ring-line hover:ring-brand-300 cursor-pointer">
          <span class="fb-chip-ic h-9 w-9 shrink-0"><${Icon} name=${icon} size=${18} /></span>
          <span class="min-w-0 flex-1"><b class="block text-[15px]">${t}</b><span class="text-[13px] text-muted">${s}</span></span>
          <${PencilCheck} size=${18} color="#0038b8" />
        </button>`)}
      </div>
    </div>
  </div>`;
}

export { SharkAvatar };
