// Demo data for the paywall mockup. The user finished chapters 1-2 (steps 1-5) and
// clicked step 6 "שם ולוגו", the first step of chapter 3. Everything the paywall says
// about her business comes from what she already filled in (steps 2, 3 and 5).
// Demo business: a couples therapist (target audience: מטפלים, יועצים, מלווים, מאמנים).

export const PARTNER = { name: 'הכריש', role: 'השותף העסקי' };

// ?user=m switches the demo user to the male form (the "איך נפנה אליך?" setting).
function pickGender() {
  const q = new URLSearchParams(location.search).get('user');
  if (q === 'm' || q === 'f') return q;
  try {
    const v = localStorage.getItem('flowbiz-pw-user');
    if (v === 'm' || v === 'f') return v;
  } catch {}
  return 'f';
}
export const GENDER = pickGender();
export const g = (m, f) => (GENDER === 'f' ? f : m);
export function setDemoGender(v) {
  try {
    localStorage.setItem('flowbiz-pw-user', v);
  } catch {}
  const u = new URL(location.href);
  u.searchParams.set('user', v);
  location.href = u.toString();
}

// From the user's own steps: name (signup), field (step 2), core product (step 3),
// monthly goal (step 5). The client is a couple: "הזוג", "הם" (third person).
export const USER = {
  name: g('אורי', 'שירה'),
  full: g('אורי לוי', 'שירה לוי'),
  kind: g('מטפל זוגי', 'מטפלת זוגית'),
  core: { name: 'תהליך זוגי · 12 מפגשים', price: 4800 },
  goal: 12000,
  clientOne: 'זוג אחד',
};

// The summary of step 5 "העסק במספרים" (same rules as that step's mockup: before tax, close rate
// 20%, lead to call 40%, its defaults). goal = what is left each month after the fixed expenses.
const FIXED = 2000; // fixed expenses a month
const CLOSE = 0.2;
const LEAD_TO_CALL = 0.4;
const clients = Math.ceil((USER.goal + FIXED) / USER.core.price); // 14,000 / 4,800 → 3 couples
export const NUMBERS = {
  fixed: FIXED,
  clients,
  leads: Math.ceil(clients / CLOSE / LEAD_TO_CALL), // 15 calls → 38 leads
  calls: Math.ceil(clients / CLOSE),
};

// Prices (Amit, 23.11.2026): monthly 350 ₪, yearly shown as 200 ₪ a month (2,400 ₪ a year).
// 5 free days for every new subscriber (Amit, 23.11: 7 → 5). The accountant add-on keeps today's gap
// (500 - 350 = 150 ₪ a month) and today's one-time 249 ₪ for opening the files.
export const TRIAL_DAYS = 5;
export const PRICE = {
  month: { perMonth: 350, charge: 350, label: 'חודשי' },
  year: { perMonth: 200, charge: 2400, label: 'שנתי' },
};
export const ACCOUNTANT = { perMonth: 150, setup: 249 };
export const yearSaving = PRICE.month.perMonth * 12 - PRICE.year.charge; // 4,200 - 2,400 = 1,800
// What the chosen plan costs a month, and what is paid once (the accountant's setup).
export const perMonthOf = (plan) => PRICE[plan.interval].perMonth + (plan.accountant ? ACCOUNTANT.perMonth : 0);
export const onceOf = (plan) => (plan.accountant ? ACCOUNTANT.setup : 0);
// How many months of the chosen plan one sale of the core product covers.
export const roiMonths = (plan) => Math.floor((USER.core.price - onceOf(plan)) / perMonthOf(plan)); // 13 monthly, 24 yearly
export const yearSavingPct = Math.round((yearSaving / (PRICE.month.perMonth * 12)) * 100); // 43

// What opens. Chapters 3-6 of the 15-step journey (journey v14, 03.11.2026).
// gets: what the user walks away with, per chapter and per step (Amit 23.11: short and sharp).
export const UNLOCKS = [
  { n: 3, title: 'בניית מותג אישי', icon: 'palette', gets: 'מותג והצעה שמוכרים', steps: [
    { name: 'שם ולוגו', gets: 'זהות לעסק' },
    { name: 'דף המסרים', gets: 'מה להגיד ללקוח' },
    { name: 'הצעה מנצחת', gets: 'הצעה שקשה לסרב לה' },
    { name: 'דף נחיתה', gets: 'עמוד שמביא פניות' },
  ] },
  { n: 4, title: 'מביאים לקוחות', icon: 'megaphone', gets: 'הלקוחות המשלמים הראשונים', steps: [
    { name: 'מכונת תוכן שיווקי', gets: 'פוסטים ופלייר מוכנים' },
    { name: 'לקוחות משלמים', gets: 'פניות שהופכות ללקוחות' },
  ] },
  { n: 5, title: 'מגדילים מכירות', icon: 'trending-up', gets: 'יותר שיחות שנסגרות', steps: [
    { name: 'חדר התרגול', gets: 'שיחת מכירה בביטחון' },
    { name: 'שירות לקוחות אוטומטי', gets: 'מענה מיידי לכל פנייה' },
  ] },
  { n: 6, title: 'העסק שתמיד רצית', icon: 'users', gets: 'עסק שמנהל את עצמו', steps: [
    { name: 'ניהול לקוחות', gets: 'כל הלקוחות במקום אחד' },
    { name: 'פגישת מיקוד', gets: 'פגישה אישית, עלינו' },
  ] },
];
export const UNLOCK_STEPS = UNLOCKS.reduce((n, c) => n + c.steps.length, 0); // 10

export const ACCOUNTANT_ITEMS = ['רואה חשבון שמלווה את העסק', 'ישות משפטית ומחשבון מס', 'פתיחת תיק או מעבר מול רואה החשבון'];

// "Today" in the mockup, so the trial dates are fixed and readable.
export const TODAY = new Date('2026-11-23T10:00:00');
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const short = (d) => `${d.getDate()}.${d.getMonth() + 1}`;
export const TRIAL = {
  start: short(TODAY),
  remind: short(addDays(TODAY, TRIAL_DAYS - 1)), // a day before the charge
  charge: short(addDays(TODAY, TRIAL_DAYS)),
};

// A demo coupon for the mockup: FLOW100 = free (today: a 100% coupon passes the paywall).
export const DEMO_COUPON = 'FLOW100';

// Messages after "לא עכשיו" (shown in the developer notes and on the home card).
export const NUDGES = [
  { when: 'למחרת', text: 'הפרקים הבאים מחכים לך. 5 ימים חינם, בלי חיוב היום.' },
  { when: 'אחרי 3 ימים', text: 'זוג אחד שסוגר תהליך מכסה יותר משנה של FlowBiz. פרק 3 מחכה לך.' },
  { when: 'אחרי 7 ימים', text: 'התוכנית העסקית שלך מוכנה כבר שבוע. רוצה להמשיך לפרק 3?' },
];
