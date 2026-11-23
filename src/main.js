// Paywall mockup: the screen that opens chapters 3-6 after the free part (steps 1-5).
// Flow: step 6 shows names the shark already wrote (one clear, two locked) → the paywall
// (one plan, yearly = 200 ₪ a month, 7 free days, accountant as an add-on) → the clearing
// company's page (a stand-in) → the trial started, every name opens.
// "לא עכשיו" → home, where chapter 3 waits.
// Link params: ?screen=taste|paywall|checkout|welcome|home, ?interval=year|month, ?user=m|f, ?embed = phone layout.
// Shift+D opens the developer notes and the screen list. "?" in the top bar = the shark's explanation.
import { html, render, useState, useEffect, useRef, Icon, cx, confetti } from './lib.js';
import { Logo, TopBar, BottomBar, Status, PrimaryButton, Button, Toast, PartnerBubble } from './components.js';
import { USER, TRIAL_DAYS, PRICE, g } from './data.js';
import { EXPLAIN, ExplainButton, SharkTalk } from './explain.js';
import { Taste, Paywall, Checkout, Welcome, Home } from './screens.js';
import { DevPanel } from './devnotes.js';
import { EMBED, IS_PHONE, readView, saveView, writeHandoff, takeHandoff, applyPhoneViewport, ViewToggle, PhonePreview } from './viewswitch.js';

const params = new URLSearchParams(location.search);
const SCREENS = ['taste', 'paywall', 'checkout', 'welcome', 'home'];
const STEP6 = { name: 'שם ולוגו', chapterNo: 3, chapter: 'בניית מותג אישי', icon: 'palette' };
const OPEN = { name: 'פתיחת הפרקים הבאים', chapterNo: 3, chapter: 'בניית מותג אישי', icon: 'lock-open' };

const SHARK = {
  taste: 'כתבתי שמות מהתוכנית שלך. אחד כבר כאן, השאר מחכים בפרק 3.',
  checkout: 'היום לא יורד כסף. תזכורת תגיע יום לפני החיוב.',
  welcome: g('יאללה, בוחרים שם. איזה מהם מדבר אליך?', 'יאללה, בוחרים שם. איזה מהם מדבר אלייך?'),
  home: 'השמות לעסק מחכים לך בפרק 3.',
};

// The paywall line follows the billing choice: the core product's price in months of FlowBiz.
const paywallLine = (interval) => {
  const months = Math.floor(USER.core.price / PRICE[interval].perMonth);
  const span = months === 24 ? 'שנתיים' : `${months} חודשים`;
  return `${USER.clientOne} שסוגר תהליך מכסה ${span} של FlowBiz. מכאן אני ממשיך איתך למותג וללקוחות.`;
};

function App({ view: shellView, onViewChange }) {
  const handoff = useRef(takeHandoff()).current;
  const [screen, setScreen] = useState(() => handoff?.screen || (SCREENS.includes(params.get('screen')) ? params.get('screen') : 'taste'));
  const [plan, setPlan] = useState(() => handoff?.plan || { interval: params.get('interval') === 'month' ? 'month' : 'year', accountant: false });
  const [coupon, setCoupon] = useState(handoff?.coupon || null);
  const [toast, setToast] = useState(null);
  const [dev, setDev] = useState(false);
  const [unread, setUnread] = useState(true);
  const [busy, setBusy] = useState(false);
  const [explain, setExplain] = useState({ screen: null, n: 0 });
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const timers = useRef({});

  useEffect(() => {
    window.__flowbizSnapshot = () => ({ screen, plan, coupon });
  });
  useEffect(() => {
    const q = new URLSearchParams();
    q.set('screen', screen);
    q.set('interval', plan.interval);
    if (EMBED) q.set('embed', '1');
    if (params.get('user')) q.set('user', params.get('user'));
    history.replaceState(null, '', `${location.pathname}?${q}`);
  }, [screen, plan.interval]);
  useEffect(() => {
    setUnread(true);
    document.querySelector('main')?.scrollTo(0, 0);
    if (screen === 'welcome') setTimeout(() => confetti('step'), 150);
  }, [screen]);
  useEffect(() => {
    const k = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (e.key === 'D' && e.shiftKey && !typing) setDev((d) => !d);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => {
    const open = () => setExplain((x) => ({ screen: screenRef.current, n: x.n + 1 }));
    window.addEventListener('fb:explain', open);
    return () => window.removeEventListener('fb:explain', open);
  }, []);

  const notify = (text, icon = 'info') => {
    setToast({ id: Date.now(), text, icon });
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToast(null), 2800);
  };
  const up = (patch) => setPlan((p) => ({ ...p, ...patch }));
  const go = (s) => {
    setDev(false);
    setScreen(s);
  };
  // "להתחיל 7 ימים חינם": one click to the clearing page (a short wait, as the redirect).
  const startTrial = () => {
    setBusy(true);
    setTimeout(() => (setBusy(false), go('checkout')), 700);
  };
  const onCoupon = (code) => {
    setCoupon(code);
    notify(`הקוד ${code} פתח את המסלול`, 'ticket');
    go('welcome');
  };

  const devBtn = html`<button type="button" onClick=${() => setDev((d) => !d)} title="הערות למפתחים (Shift+D)" aria-label="הערות למפתחים" class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-brand-50 hover:text-brand-600 cursor-pointer max-md:hidden"><${Icon} name="code-xml" size=${18} /></button>`;
  const tools = html`${!EMBED && html`<${ViewToggle} view=${shellView} onChange=${onViewChange} class="max-md:hidden" />`}${devBtn}${EXPLAIN[screen] && html`<${ExplainButton} />`}`;

  let top;
  if (screen === 'home') {
    top = html`<header class="no-print z-20 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 md:px-6">
      <${Logo} size="sm" />
      <nav class="ms-4 hidden items-center gap-1 lg:flex">
        ${[
          ['house', 'בית'],
          ['calendar-days', 'יומן'],
          ['list-checks', 'משימות'],
          ['wallet', 'כספים'],
          ['folder-open', 'קבצים'],
        ].map(([icon, label], i) => html`<button key=${label} type="button" onClick=${() => i && notify('במוקאפ הפריט הזה לא פעיל')} class=${cx('inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold cursor-pointer', i === 0 ? 'bg-brand-100 text-brand-600' : 'text-muted hover:bg-brand-50 hover:text-brand-600')}><${Icon} name=${icon} size=${17} />${label}</button>`)}
      </nav>
      <span class="ms-auto"></span>
      <div class="flex items-center gap-2">${tools}</div>
    </header>`;
  } else {
    top = html`<${TopBar} step=${screen === 'taste' ? STEP6 : OPEN} progress=${null} tools=${tools} onHome=${() => go('home')} />`;
  }

  const body = {
    taste: html`<${Taste} />`,
    paywall: html`<${Paywall} plan=${plan} up=${up} onCoupon=${onCoupon} notify=${notify} />`,
    checkout: html`<${Checkout} plan=${plan} />`,
    welcome: html`<${Welcome} plan=${plan} coupon=${coupon} />`,
    home: html`<${Home} onOpen=${() => go('paywall')} notify=${notify} />`,
  }[screen];

  const bottom = {
    taste: html`<${BottomBar}
      back=${html`<${Button} variant="secondary" onClick=${() => go('home')}>לדף הבית<//>`}
      status=${html`<${Status} hint="עוד 2 שמות מחכים" />`}
      primary=${html`<${PrimaryButton} label="לכל השמות" onClick=${() => go('paywall')} />`}
    />`,
    paywall: html`<${BottomBar}
      back=${html`<${Button} variant="text" onClick=${() => (notify('אפשר לחזור מתי שרוצים. הניסיון מחכה', 'clock'), go('home'))}>לא עכשיו<//>`}
      status=${html`<${Status} hint=${html`<span><b class="text-money">היום 0 ₪</b> · ביטול בקליק</span>`} />`}
      primary=${html`<${Button} onClick=${startTrial} disabled=${busy}>${busy ? 'מעבירים לתשלום...' : `להתחיל ${TRIAL_DAYS} ימים חינם`}<${Icon} name="arrow-left" size=${20} /><//>`}
    />`,
    checkout: html`<${BottomBar}
      back=${html`<${Button} variant="secondary" onClick=${() => go('paywall')}>חזרה<//>`}
      status=${html`<${Status} hint="במערכת: עמוד הסליקה" />`}
      primary=${html`<${PrimaryButton} label="סימולציה: הכרטיס נשמר" check onClick=${() => go('welcome')} />`}
    />`,
    welcome: html`<${BottomBar}
      extra=${html`<${Button} variant="text" onClick=${() => go('home')}><${Icon} name="house" size=${16} />לדף הבית<//>`}
      primary=${html`<${PrimaryButton} label="לבחור שם" onClick=${() => notify('במערכת: ממשיכים בשלב 6, שם ולוגו', 'palette')} />`}
    />`,
    home: null,
  }[screen];

  const explainHere = explain.screen === screen && !!EXPLAIN[screen];
  return html`<div class="fb-notebook flex h-dvh flex-col text-ink" dir="rtl">
    ${top}
    <div class="relative min-h-0 flex-1">
      <main class="thin-scroll relative h-full overflow-y-auto">${body}</main>
      <${PartnerBubble}
        key=${screen}
        message=${screen === 'paywall' ? paywallLine(plan.interval) : SHARK[screen]}
        unread=${unread}
        onRead=${() => setUnread(false)}
        mood=${screen === 'welcome' ? 'happy' : 'calm'}
        openKey=${explainHere ? explain.n : 0}
        body=${explainHere && html`<${SharkTalk} key=${explain.n} screen=${screen} />`}
        onClose=${() => setExplain((x) => (x.screen ? { ...x, screen: null } : x))}
      />
    </div>
    ${bottom}
    <${Toast} toast=${toast} />
    <${DevPanel} open=${dev} onClose=${() => setDev(false)} onJump=${go} />
  </div>`;
}

function Root() {
  const [view, setView] = useState(readView);
  useEffect(() => applyPhoneViewport(view), [view]);
  const change = (v) => {
    if (v === 'mobile') {
      try {
        writeHandoff(window.__flowbizSnapshot?.());
      } catch {}
    }
    saveView(v);
    setView(v);
  };
  if (!EMBED && !IS_PHONE && view === 'mobile') return html`<${PhonePreview} onSwitch=${change} title="פתיחת הפרקים הבאים" />`;
  return html`<${App} view=${view} onViewChange=${change} />`;
}

applyPhoneViewport(readView());
render(html`<${Root} />`, document.getElementById('app'));
