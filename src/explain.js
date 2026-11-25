// "הסבר מהכריש": the round "?" in the top bar, next to "לדף הבית", on every screen
// (same button as the practice room and steps 5 and 8). It opens the shark's note:
// what we do here, what you see, why it matters, then "לשאול את הכריש" with ready
// questions. Every answer rests on the prices and the trial in data.js, nothing else.
import { html, useState, useRef, useEffect, Icon, cx } from './lib.js';
import { g, USER, PRICE, TRIAL, TRIAL_DAYS, ACCOUNTANT, yearSaving } from './data.js';

const nf = (n) => n.toLocaleString('he-IL');

export const EXPLAIN = {
  paywall: {
    title: 'הפרקים הבאים',
    what: 'כאן פותחים את פרקים 3 עד 6.',
    see: `המסלול, המחיר, ומה נפתח בכל פרק. ${TRIAL_DAYS} ימים חינם.`,
    why: `${USER.clientOne} שסוגר ${USER.core.name.split(' · ')[0]} מכסה יותר משנה של מנוי.`,
    qa: [
      [`מה קורה אחרי ${TRIAL_DAYS} הימים?`, `ב-${TRIAL.remind} תקבל${g('', 'י')} תזכורת. ב-${TRIAL.charge} מתחיל החיוב לפי המסלול שבחרת. עד אז לא משלמים כלום.`],
      ['איך מבטלים?', 'בקליק, מההגדרות, בכל רגע. ביטול לפני סוף הניסיון: לא משלמים כלום.'],
      ['מה ההבדל בין חודשי לשנתי?', `חודשי: ${PRICE.month.perMonth} ₪ כל חודש. שנתי: ${PRICE.year.perMonth} ₪ לחודש, ${nf(PRICE.year.charge)} ₪ בחיוב אחד. חיסכון של ${nf(yearSaving)} ₪ בשנה.`],
      ['צריך רואה חשבון?', `לא חייבים. מי שרוצה ליווי: עוד ${ACCOUNTANT.perMonth} ₪ לחודש, ו-${ACCOUNTANT.setup} ₪ פעם אחת לפתיחת התיקים.`],
      ['ומה אם לא אמשיך?', 'מה שבנית נשאר שלך: התוכנית העסקית ועמוד הכספים נשארים פתוחים.'],
    ],
  },
  checkout: {
    title: 'תשלום מאובטח',
    what: 'כאן שומרים אמצעי תשלום.',
    see: `היום לא יורד כסף. החיוב הראשון ב-${TRIAL.charge}.`,
    why: 'הכרטיס נשמר אצל חברת הסליקה, לא אצלנו.',
    qa: [['למה צריך כרטיס אם זה חינם?', 'כדי שאחרי הניסיון הכל ימשיך בלי עצירה. תזכורת תגיע יום לפני החיוב.']],
  },
  welcome: {
    title: 'הפרקים פתוחים',
    what: 'פרקים 3 עד 6 פתוחים.',
    see: 'ארבעת הפרקים, והתאריכים של הניסיון.',
    why: 'ממשיכים מאיפה שעצרת, בפרק 3.',
    qa: [['איפה רואים את המנוי?', 'בהגדרות, תחת "המנוי שלי": המסלול, תאריך החיוב וביטול.']],
  },
  home: {
    title: 'דף הבית',
    what: 'כאן רואים מה מחכה לך.',
    see: 'פרק 3 נעול. התוכנית העסקית ועמוד הכספים פתוחים.',
    why: `אפשר לחזור מתי ${g('שתרצה', 'שתרצי')}. ${TRIAL_DAYS} הימים החינמיים מחכים.`,
    qa: [['מה עוד פתוח לי?', 'שלבים 1 עד 5, התוכנית העסקית ועמוד הכספים.']],
  },
};

export function ExplainButton({ class: cls = '' }) {
  return html`<span class=${cx('group relative inline-flex shrink-0', cls)}>
    <button type="button" onClick=${(e) => (e.currentTarget.blur(), window.dispatchEvent(new CustomEvent('fb:explain')))} aria-label="הסבר מהכריש על המסך הזה" class="no-print grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-display text-[22px] font-black leading-none text-brand-600 ring-[1.5px] ring-brand-300 transition hover:bg-brand-600 hover:text-white hover:ring-brand-600 focus-visible:bg-brand-600 focus-visible:text-white cursor-pointer">?</button>
    <span role="tooltip" class="pointer-events-none absolute end-0 top-[calc(100%+8px)] z-30 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[13px] font-bold text-white shadow-lg group-hover:block group-focus-within:block">הסבר מהכריש על המסך הזה</span>
  </span>`;
}

export function SharkTalk({ screen }) {
  const ex = EXPLAIN[screen] || EXPLAIN.paywall;
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef(null);
  useEffect(() => list.current?.scrollTo(0, 1e6), [msgs.length, busy]);
  const asked = new Set(msgs.filter((x) => x.me).map((x) => x.text));
  const send = async (q) => {
    q = q.trim();
    if (!q || busy) return;
    setText('');
    setMsgs((x) => [...x, { me: true, text: q }]);
    setBusy(true);
    const ready = ex.qa.find(([k]) => k === q);
    await new Promise((r) => setTimeout(r, 450));
    const reply = ready ? ready[1] : 'במוקאפ אני עונה על השאלות המוכנות. במערכת אפשר לשאול אותי כל דבר.';
    setMsgs((x) => [...x, { me: false, text: reply }]);
    setBusy(false);
  };

  if (!chat)
    return html`<div class="text-[15px] leading-relaxed">
      <p class="mb-2 font-display text-[17px] font-bold text-brand-900">${ex.title}</p>
      <p>${ex.what}</p>
      <p class="mt-1.5 text-muted">${ex.see}</p>
      <p class="mt-2 rounded-xl bg-brand-50 px-3 py-2 font-semibold text-brand-900">${ex.why}</p>
      <button type="button" onClick=${() => setChat(true)} class="mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-600 hover:underline cursor-pointer"><${Icon} name="message-circle" size=${16} />לשאול את הכריש</button>
    </div>`;

  return html`<div class="text-[15px]">
    <button type="button" onClick=${() => setChat(false)} class="mb-2 inline-flex items-center gap-1 text-[13px] font-bold text-muted hover:text-ink cursor-pointer"><${Icon} name="arrow-right" size=${14} />חזרה להסבר</button>
    <div ref=${list} class="thin-scroll flex max-h-[240px] flex-col gap-2 overflow-y-auto">
      ${msgs.length === 0 && html`<p class="text-muted">${g('מה תרצה לדעת?', 'מה תרצי לדעת?')}</p>`}
      ${msgs.map((x, i) => html`<p key=${i} class=${cx('max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-snug', x.me ? 'self-start rounded-ss-md bg-brand-600 text-white' : 'self-end rounded-se-md bg-canvas ring-1 ring-line')}>${x.text}</p>`)}
      ${busy && html`<p class="self-end rounded-2xl bg-canvas px-3 py-2 text-muted ring-1 ring-line">הכריש כותב...</p>`}
    </div>
    ${ex.qa.some(([q]) => !asked.has(q)) && html`<div class="mt-2.5 flex flex-wrap gap-1.5">${ex.qa.filter(([q]) => !asked.has(q)).map(([q]) => html`<button key=${q} type="button" onClick=${() => send(q)} class="rounded-full bg-white px-2.5 py-1 text-start text-[13px] font-semibold text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50 cursor-pointer">${q}</button>`)}</div>`}
    <form class="mt-2.5 flex gap-1.5" onSubmit=${(e) => (e.preventDefault(), send(text))}>
      <input value=${text} onInput=${(e) => setText(e.target.value)} onKeyDown=${(e) => e.stopPropagation()} placeholder="לשאול..." aria-label="שאלה לכריש" class="h-10 min-w-0 flex-1 rounded-xl bg-white px-3 text-[15px] ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand-300" />
      <button type="submit" disabled=${!text.trim() || busy} aria-label="לשלוח" class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white disabled:opacity-40 cursor-pointer"><${Icon} name="send" size=${17} /></button>
    </form>
  </div>`;
}
