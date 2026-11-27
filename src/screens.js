// The screens of the paywall mockup:
//   paywall  - one plan card (price, what opens, accountant) with the "העסק במספרים" note on its left; 5 free days
//   checkout - stand-in for the clearing company's hosted page (CHING): save a card, 0 ₪ today
//   welcome  - the trial started: the chapters are open, the dates of the trial
//   home     - after "לא עכשיו": chapter 3 waits on the home page
import { html, useState, Icon, PencilCheck, cx, money } from './lib.js';
import { Button, Mark, Note, Panel, SharkAvatar } from './components.js';
import { FunnelShape, Ring, Seal } from './illus.js';
import { USER, NUMBERS, PRICE, ACCOUNTANT, ACCOUNTANT_ITEMS, TRIAL, TRIAL_DAYS, UNLOCKS, yearSaving, perMonthOf, onceOf, roiMonths, DEMO_COUPON } from './data.js';

// What is charged on the first charge day, by the user's choice.
export function chargeOf(plan) {
  const base = PRICE[plan.interval].charge;
  const acc = plan.accountant ? (plan.interval === 'year' ? ACCOUNTANT.perMonth * 12 : ACCOUNTANT.perMonth) + ACCOUNTANT.setup : 0;
  return base + acc;
}

function Heading({ eyebrow, title, sub, children }) {
  return html`<div class=${cx('fb-heading', children ? 'relative mb-3 max-md:pe-[84px] lg:mb-11' : 'mb-4')}>
    <span class="fb-eyebrow">${eyebrow}</span>
    <h1 class=${cx('fb-h1 md:text-[36px]', children ? 'text-[23px]' : 'text-[28px]')}>${title[0]}<${Mark}>${title[1]}<//>${title[2] || ''}</h1>
    ${sub && html`<p>${sub}</p>`}
    ${children}
  </div>`;
}

// ---------- paywall ----------
// Right: one card with the whole offer, top to bottom: price, what opens, accountant add-on.
// Left, same height: the note with the summary of "העסק במספרים" and what one deal is worth.
// Under both, one quiet line: the code and the legal links. On the phone the plan comes first.

function Billing({ interval, onChange }) {
  return html`<div role="radiogroup" aria-label="תקופת חיוב" class="inline-flex shrink-0 rounded-xl border border-line bg-canvas p-1">
    ${[['month', 'חודשי'], ['year', 'שנתי']].map(([id, label]) => html`<button key=${id} type="button" role="radio" aria-checked=${interval === id} onClick=${() => onChange(id)} class=${cx('h-9 rounded-[10px] px-4 text-[15px] font-bold cursor-pointer', interval === id ? 'bg-[#cfe0fb] text-ink shadow-sm' : 'text-muted hover:text-brand-600')}>${label}</button>`)}
  </div>`;
}

function PlanCard({ plan, up }) {
  const year = plan.interval === 'year';
  const [details, setDetails] = useState(false);
  return html`<${Panel} class="!p-0 flex flex-col overflow-hidden md:h-full">
    <div class="px-5 pb-3 pt-4 md:px-6">
      <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p class="font-display text-[20px] font-extrabold">מנוי FlowBiz</p>
          <p class="mt-1 flex items-baseline gap-2.5"><b class="font-display text-[54px] font-black leading-none tabular-nums">${money(perMonthOf(plan))}</b><span class="text-[18px] font-semibold text-muted">לחודש</span></p>
        </div>
        <div class="flex flex-col gap-2 max-md:w-full md:items-end">
          <${Billing} interval=${plan.interval} onChange=${(interval) => up({ interval })} />
          <span class="text-[14px] text-muted max-md:order-first">${year ? html`${money(perMonthOf(plan) * 12)} בחיוב שנתי · <b class="text-money">חיסכון של ${money(yearSaving)}</b>` : 'חיוב חודשי'}</span>
        </div>
      </div>
    </div>
    <div class="flex-1 border-t border-line px-5 pb-1.5 pt-2 md:px-6 md:pb-2 md:pt-2"><${Unlocks} /></div>
    <div class="border-t border-line bg-canvas/60 px-5 py-2.5 md:px-6">
      <div class="flex items-center gap-3">
        <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
          <input type="checkbox" checked=${plan.accountant} onChange=${(e) => up({ accountant: e.target.checked })} class="h-5 w-5 shrink-0 cursor-pointer accent-[#0038b8]" />
          <span class="min-w-0 text-[15px]"><b>להוסיף רואה חשבון</b> <span class="text-muted"><span class="whitespace-nowrap">· ${money(ACCOUNTANT.perMonth)} לחודש</span>${plan.accountant && html` <span>ועוד <span class="whitespace-nowrap">${money(onceOf(plan))} חד פעמי</span> לפתיחת התיק ברשויות</span>`}</span></span>
        </label>
        <button type="button" class="shrink-0 text-[13px] font-bold text-brand-600 hover:underline cursor-pointer" onClick=${() => setDetails(!details)} aria-expanded=${details}>פרטים</button>
      </div>
      ${details && html`<ul class="rise mt-2 space-y-1 ps-8 text-[14px]">
        ${ACCOUNTANT_ITEMS.map((t) => html`<li key=${t} class="flex items-center gap-1.5"><${Icon} name="check" size=${14} class="text-brand-600" />${t}</li>`)}
        ${!plan.accountant && html`<li class="text-muted">ועוד ${money(ACCOUNTANT.setup)} חד פעמי לפתיחת התיק ברשויות</li>`}
      </ul>`}
    </div>
  <//>`;
}

// What opens: four small icons, one outcome per chapter (a list on the phone).
// A tap shows the chapter's steps under the row; one open at a time.
function Steps({ c }) {
  return html`<ul class="grid gap-x-5 gap-y-1 rounded-xl bg-brand-50 px-4 py-2.5 text-[14px] leading-snug md:grid-cols-2">${c.steps.map((x) => html`<li key=${x.name}><b>${x.gets}</b> <span class="text-muted">· ${x.name}</span></li>`)}</ul>`;
}

function Unlocks() {
  const [open, setOpen] = useState(null);
  const cur = UNLOCKS.find((c) => c.n === open);
  return html`<p class="text-[14px] font-bold text-muted">מה נפתח</p>
    <ol class="mt-1.5 grid gap-x-3 md:grid-cols-4" aria-label="מה נפתח">
      ${UNLOCKS.map((c) => {
        const on = open === c.n;
        return html`<li key=${c.n} class="min-w-0">
          <button type="button" aria-expanded=${on} onClick=${() => setOpen(on ? null : c.n)} class=${cx('group flex w-full cursor-pointer items-center gap-3 rounded-xl text-start max-md:h-11 md:flex-col md:gap-1 md:py-1 md:text-center', on && 'md:bg-brand-50')}>
            <span class="fb-chip-ic h-11 w-11 shrink-0"><${Icon} name=${c.icon} size=${22} /></span>
            <span class="min-w-0 flex-1 md:flex md:flex-col md:items-center">
              <b class=${cx('block font-display text-[17px] font-extrabold leading-tight tracking-[-0.01em] group-hover:text-brand-600', on && 'text-brand-600')}>${c.gets}</b>
              <span class="inline-flex items-center gap-0.5 text-[13px] font-semibold text-brand-600 max-md:hidden">${c.steps.length} שלבים<${Icon} name="chevron-down" size=${13} class=${cx('transition-transform', on && 'rotate-180')} /></span>
            </span>
            <span class="shrink-0 text-[13px] text-muted md:hidden">${c.steps.length} שלבים</span>
            <${Icon} name="chevron-down" size=${15} class=${cx('shrink-0 text-muted transition-transform md:hidden', on && 'rotate-180')} />
          </button>
          ${on && html`<div class="rise my-1.5 md:hidden"><${Steps} c=${c} /></div>`}
        </li>`;
      })}
    </ol>
    ${cur && html`<div key=${cur.n} class="rise mt-2 max-md:hidden"><${Steps} c=${cur} /></div>`}`;
}

// The summary of step 5 as a drawn funnel: inquiries, couples, the goal (all per month). Under it, what one
// deal (the user's core product) is worth, in months of the chosen plan.
function Numbers({ plan }) {
  const m = roiMonths(plan);
  const tiers = [
    [NUMBERS.leads, 'פניות'],
    [NUMBERS.clients, 'זוגות'],
    [money(USER.goal), 'יעד'],
  ];
  return html`<${Note} tilt=${-0.6} class="!px-6 !pb-4 !pt-7 flex flex-col md:h-full">
    <p class="flex items-baseline justify-between"><b class="font-display text-[18px] font-extrabold leading-tight">העסק במספרים</b><span class="text-[14px] text-ink-2">בחודש</span></p>
    <div class="relative mx-auto mt-2 h-[112px] w-full max-w-[280px]">
      <${FunnelShape} class="absolute inset-0 h-full w-full" />
      <dl class="relative m-0 flex h-full flex-col justify-between py-[3px]">
        ${tiers.map(([v, k], i) => html`<div key=${k} class="flex h-8 items-center justify-center gap-1.5"><dt class=${cx('text-[15px]', i < 2 && 'order-2')}>${k}</dt><dd class="m-0 font-display text-[20px] font-extrabold leading-none tabular-nums">${v}</dd></div>`)}
      </dl>
    </div>
    <div class="mt-auto pt-3 text-center">
      <p class="text-[17px] font-bold leading-tight">עסקה אחת שווה לך</p>
      <p class="relative mx-auto mt-1 w-fit px-6 py-1.5 font-display text-[36px] font-black leading-none tabular-nums text-money"><${Ring} class="absolute inset-0 h-full w-full" />${money(USER.core.price)}</p>
      <p class="mt-1.5 text-[16px] font-semibold leading-tight">מכסה ${m === 24 ? 'שנתיים' : `${m} חודשים`} של מנוי</p>
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

// One quiet line under the offer: the code on the right, the links on the left.
function Foot({ onCoupon, notify }) {
  const links = ['תנאי שימוש', 'מדיניות פרטיות', 'הצהרת נגישות'];
  return html`<footer class="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[13px] text-muted max-md:flex-col md:mt-3">
    <${Coupon} onValid=${onCoupon} />
    <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
      ${links.map((l) => html`<a key=${l} href="#" class="hover:text-brand-600 hover:underline" onClick=${(e) => (e.preventDefault(), notify(`במערכת: עמוד "${l}"`, 'file-text'))}>${l}</a>`)}
      <a href="#" class="hover:text-brand-600 hover:underline" onClick=${(e) => (e.preventDefault(), notify('במערכת: כתובת תמיכה על הדומיין של FlowBiz', 'mail'))}>תמיכה</a>
    </nav>
  </footer>`;
}

export function Paywall({ plan, up, onCoupon, notify }) {
  return html`<div class="mx-auto max-w-5xl px-4 py-5 max-md:pb-20 md:px-7 md:pb-3 md:pt-2.5">
    <${Heading} eyebrow="התוכנית העסקית מוכנה" title=${[`${USER.name}, עכשיו זה הזמן `, 'להביא לקוחות', '']} >
      <${Seal} n=${TRIAL_DAYS} class="pointer-events-none absolute -end-1 top-1 h-[84px] w-[84px] -rotate-[8deg] md:end-2 md:-top-3 md:h-[100px] md:w-[100px] lg:hidden" />
    <//>
    <div class="grid gap-7 md:grid-cols-[minmax(0,1fr)_300px] md:gap-8">
      <section class="relative min-w-0">
        <${PlanCard} plan=${plan} up=${up} />
        <${Seal} n=${TRIAL_DAYS} class="pointer-events-none absolute -top-[34px] end-[188px] hidden h-[114px] w-[114px] -rotate-[8deg] lg:block" />
      </section>
      <section class="min-w-0"><${Numbers} plan=${plan} /></section>
    </div>
    <${Foot} onCoupon=${onCoupon} notify=${notify} />
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
      <p class="mt-3 flex items-start rounded-xl bg-brand-50 px-3 py-2.5 gap-2.5 text-[15px] leading-snug"><${Icon} name="rotate-ccw" size=${18} class="mt-0.5 shrink-0 text-brand-600" /><span><b>ביטול בקליק, בכל רגע</b>, בהגדרות תחת "המנוי שלי". ביטול לפני ${TRIAL.charge}: לא יורד שקל.</span></p>
      <div class="mt-3 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-4 py-6 text-center text-[14px] text-muted">
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
      <span class="min-w-0 flex-1"><b class="block text-[16px]">${c.title}</b><span class="text-[13px] font-semibold text-brand-700">${c.steps.map((s) => s.name).join(' · ')}</span></span>
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
