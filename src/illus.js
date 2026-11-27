// Small pencil drawings for the paywall: the free-days seal, the funnel of "העסק במספרים",
// and the ring around an amount. Same look as the icons: a soft tint, sky-blue
// hatching a little off the lines, and an outline with a light grain.
import { html } from './lib.js';

const INK = '#2d3e66';
const BLUE = '#0038b8';
const GREEN = '#12805c';

// The stamp of the free days: a scalloped seal, pressed a little crooked.
export function Seal({ n, class: cls = '' }) {
  const pts = Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const r = 46 + 3 * Math.cos(a * 16);
    return `${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`;
  });
  const d = `M${pts.join(' L')} Z`;
  return html`<svg viewBox="0 0 100 100" class=${'overflow-visible ' + cls} role="img" aria-label=${`${n} ימים חינם`} text-anchor="middle" fill="#ffffff" font-family="Rubik, Assistant, sans-serif">
    <g style=${{ filter: 'url(#pencil-rough)' }}>
      <path d=${d} fill="#8fb3ef" transform="translate(2 2.6)" opacity=".7" />
      <path d=${d} fill=${BLUE} /><path d=${d} fill="url(#pencil-hatch-light)" />
      <circle cx="50" cy="50" r="39.5" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3.2 3.6" stroke-linecap="round" opacity=".75" />
    </g>
    <text x="50" y="51" font-size="38" font-weight="900">${n}</text>
    <text x="50" y="67" font-size="14.5" font-weight="800" direction="rtl">ימים חינם</text>
  </svg>`;
}

// Three tiers, wide to narrow; the last one is the goal.
export function FunnelShape({ class: cls = '' }) {
  const tiers = ['M3 3 C80 1.4 172 1.6 249 3 C246 14 241 27 234 37 C162 39 90 38.6 18 37 C11 27 6 14 3 3 Z', 'M22 45 C92 43.4 160 43.6 230 45 C227 56 222 69 215 79 C156 81 96 80.6 37 79 C30 69 25 56 22 45 Z', 'M41 87 C98 85.4 154 85.6 211 87 C208 98 203 111 196 121 C150 123 102 122.6 56 121 C49 111 44 98 41 87 Z'];
  const tint = ['#ffffff', '#dde9fc', '#bcd3f6'];
  return html`<svg viewBox="0 0 252 124" preserveAspectRatio="none" class=${'overflow-visible ' + cls} aria-hidden="true" stroke-linejoin="round" style=${{ filter: 'url(#pencil-rough)' }}>
    ${tiers.map((d, i) => html`<g key=${i}>
      <path d=${d} fill=${tint[i]} />
      ${i > 0 && html`<path d=${d} fill="url(#pencil-hatch-lg)" opacity=${i === 2 ? 0.7 : 0.45} />`}
      <path d=${d} fill="none" stroke=${INK} stroke-width="1.8" />
    </g>`)}
  </svg>`;
}

// A pencil ring around an amount; draws itself.
export function Ring({ color = GREEN, class: cls = '' }) {
  return html`<svg viewBox="0 0 200 64" preserveAspectRatio="none" class=${'overflow-visible ' + cls} aria-hidden="true" style=${{ filter: 'url(#pencil-rough)' }}>
    <path class="pencil-draw" style=${{ animationDuration: '.9s' }} pathLength="1" d="M128 5 C70 -2 8 8 4 32 C1 56 66 62 112 60 C164 58 198 48 196 29 C194 10 138 2 92 6" fill="none" stroke=${color} stroke-width="2.4" stroke-linecap="round" opacity=".75" />
  </svg>`;
}
