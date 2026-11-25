// Developer notes (Shift+D): the demo user, quick jumps, and what ג׳וליוס needs to know.
import { html, Icon, cx } from './lib.js';
import { GENDER, setDemoGender, PRICE, ACCOUNTANT, TRIAL_DAYS, NUDGES, DEMO_COUPON } from './data.js';

export const JUMPS = [
  { id: 'paywall', label: 'מסך הפרקים הבאים' },
  { id: 'checkout', label: 'עמוד התשלום (במקום CHING)' },
  { id: 'welcome', label: 'הניסיון התחיל' },
  { id: 'home', label: 'דף הבית אחרי "לא עכשיו"' },
];

const NOTES = [
  {
    title: 'מתי המסך מופיע',
    items: [
      'שלבים 1 עד 5 פתוחים לכולם. עמוד הכספים נפתח בחינם בסוף שלב 5.',
      'המסך נפתח בלחיצה על פרק 3 או על שלב בו (ההחלטה מ-03.11). היום הוא קופץ מיד אחרי "תחזית פיננסית".',
    ],
  },
  {
    title: 'מחירים וניסיון',
    items: [
      `חודשי ${PRICE.month.perMonth} ₪. שנתי מוצג ${PRICE.year.perMonth} ₪ לחודש, ${PRICE.year.charge.toLocaleString('he-IL')} ₪ בחיוב אחד. ברירת המחדל: חודשי.`,
      `${TRIAL_DAYS} ימים חינם לכל מנוי חדש. שומרים כרטיס, 0 ₪ היום, תזכורת יום לפני החיוב.`,
      'CHING: מנוי עם תקופת ניסיון. canAccessPaidStep כבר פותח גישה במצב trialing.',
      `רואה חשבון = תוספת בתיבת סימון: ${ACCOUNTANT.perMonth} ₪ לחודש ועוד ${ACCOUNTANT.setup} ₪ פעם אחת. במקום שני כרטיסי מסלול.`,
      'ביטול בקליק מההגדרות, תחת "המנוי שלי". ביטול לפני סוף הניסיון: אין חיוב.',
    ],
  },
  {
    title: 'מה המסך מראה',
    items: [
      'כרטיס המנוי: חודשי/שנתי, המחיר, ורואה חשבון כתוספת. הסימון מעדכן את המחיר ומראה את התשלום החד-פעמי. בתוך הכרטיס גם "מה נפתח": 4 תוצאות, אחת לכל פרק (לחיצה מציגה את השלבים). משמאל, באותו גובה: פתק "העסק במספרים" עם הסיכום של שלב 5. בטלפון: המנוי קודם.',
      'הפתק: יעד, לקוחות ופניות בחודש מהסיכום של שלב 5, בדיוק כמו שהם שם. המילה "זוגות" מתחלפת לפי סוג הלקוח.',
      'שווי עסקה: מחיר מוצר הליבה. במנוי חודשי של הלקוח: המחיר כפול מספר החודשים שהוא נשאר (משלב 5). "מכסה X חודשים": השווי פחות תשלום חד-פעמי, חלקי המחיר לחודש של הבחירה, מעוגל למטה. אם יוצא פחות מחודש: כמה עסקאות מכסות חודש.',
      'מי שדילג על שלב 5: בלי הפתק. כרטיס המנוי לבד, באמצע.',
      'כותרת: "התוכנית העסקית מוכנה" ומתחתיה השם הפרטי ו"ממשיכים עם מנוי". מתחתיה רק "5 ימים חינם, וביטול בקליק".',
      `קוד קופון מאחורי קישור קטן "יש לי קוד". במוקאפ: ${DEMO_COUPON} פותח הכל.`,
      'לחיצה אחת עד עמוד הסליקה: בלי החלון "תשלום מאובטח" שיש היום באמצע.',
      'תנאי שימוש, מדיניות פרטיות, הצהרת נגישות ותמיכה: כולם קישורים. כתובת התמיכה על הדומיין של FlowBiz, לא Gmail.',
    ],
  },
  {
    title: 'אחרי "לא עכשיו"',
    items: [
      'דף הבית מראה כרטיס "פרק 3" עם השלבים שלו, וכפתור לניסיון.',
      ...NUDGES.map((n) => `${n.when}: "${n.text}"`),
    ],
  },
  {
    title: 'מדידה',
    items: ['אירועים: המסך נצפה, בחירת שנתי/חודשי, רואה חשבון, מעבר לסליקה, ניסיון התחיל, ביטול בניסיון, חיוב ראשון עבר, "לא עכשיו", חזרה מתזכורת.'],
  },
  {
    title: 'פתוח להחלטה',
    items: [
      'מחיר רואה החשבון בחיוב שנתי (במוקאפ: 150 ₪ כפול 12).',
      'האם הניסיון חל גם על רואה החשבון ועל 249 ₪ פתיחת התיקים.',
      'האם להציג מחיר כולל מע״מ.',
      'האם קופון חל על הניסיון או מחליף אותו.',
    ],
  },
];

export function DevPanel({ open, onClose, onJump }) {
  const box = 'mb-4 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-3';
  const btn = 'rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-start text-[13px] font-semibold hover:bg-brand-50 cursor-pointer';
  return html`<aside class=${cx('fixed inset-y-0 end-0 z-[70] flex w-full max-w-sm flex-col border-s border-slate-200 bg-white shadow-2xl transition-transform duration-200', open ? 'translate-x-0' : '-translate-x-full pointer-events-none invisible')} aria-hidden=${!open}>
    <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <h2 class="flex items-center gap-2 text-[16px] font-bold text-slate-900"><${Icon} name="code-xml" size=${17} /> הערות למפתחים</h2>
      <button type="button" onClick=${onClose} aria-label="סגירה" class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"><${Icon} name="x" size=${18} /></button>
    </div>
    <div class="thin-scroll flex-1 overflow-y-auto p-4 text-[14px] leading-relaxed text-slate-700">
      <section class=${box}>
        <h3 class="mb-2 font-bold text-brand-900">המשתמש לדוגמה</h3>
        <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="המשתמש לדוגמה">
          ${[
            ['f', 'שירה', 'פנייה בלשון נקבה'],
            ['m', 'אורי', 'פנייה בלשון זכר'],
          ].map(([id, name, sub]) => html`<button key=${id} type="button" role="radio" aria-checked=${GENDER === id} onClick=${() => GENDER !== id && setDemoGender(id)} class=${cx('rounded-lg border px-3 py-1.5 text-start cursor-pointer', GENDER === id ? 'border-brand-600 bg-brand-100 text-brand-600' : 'border-brand-200 bg-white text-brand-900')}><b class="block text-[14px]">${name}</b><small class="text-[12px]">${sub}</small></button>`)}
        </div>
      </section>
      <section class=${box}>
        <h3 class="mb-2 font-bold text-brand-900">מעבר מהיר בין המסכים</h3>
        <div class="flex flex-col gap-1.5">${JUMPS.map((j) => html`<button key=${j.id} type="button" onClick=${() => onJump(j.id)} class=${btn}>${j.label}</button>`)}</div>
      </section>
      ${NOTES.map((n) => html`<section key=${n.title} class="mb-4 p-1">
        <h3 class="mb-1.5 font-bold text-slate-900">${n.title}</h3>
        <ul class="list-disc space-y-1 ps-4">${n.items.map((t) => html`<li>${t}</li>`)}</ul>
      </section>`)}
    </div>
  </aside>`;
}
