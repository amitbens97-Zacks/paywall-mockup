// Small pencil drawings for the paywall: one per chapter, the funnel of "העסק במספרים",
// the ring around an amount, and tally marks. Same look as the icons: a soft tint, sky-blue
// hatching a little off the lines, and an outline with a light grain.
import { html } from './lib.js';

const INK = '#2d3e66';
const BLUE = '#0038b8';
const GREEN = '#12805c';

// A closed shape: tint + hatching + outline.
const Shape = ({ d, tint = '#dde9fc', stroke = INK, w = 2.2 }) => html`<g>
  <path d=${d} fill=${tint} stroke="none" transform="translate(1.6 1.8)" />
  <path d=${d} fill="url(#pencil-hatch-lg)" stroke="none" opacity=".75" transform="translate(1.6 1.8)" />
  <path d=${d} fill="none" stroke=${stroke} stroke-width=${w} />
</g>`;
const Line = ({ d, stroke = INK, w = 2.2, o = 1 }) => html`<path d=${d} fill="none" stroke=${stroke} stroke-width=${w} opacity=${o} />`;

const circle = (x, y, r) => `M${x - r} ${y} C${x - r} ${y - r * 0.58} ${x - r * 0.54} ${y - r} ${x + 0.4} ${y - r} C${x + r * 0.58} ${y - r * 0.98} ${x + r} ${y - r * 0.54} ${x + r} ${y} C${x + r * 0.98} ${y + r * 0.58} ${x + r * 0.54} ${y + r} ${x} ${y + r} C${x - r * 0.58} ${y + r} ${x - r} ${y + r * 0.54} ${x - r} ${y} Z`;

// A gear: n teeth between the two radii.
function gear(x, y, r1, r2, n) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const s = Math.PI / n;
    for (const [da, r] of [[-0.62, r1], [-0.4, r2], [0.4, r2], [0.62, r1]]) p.push(`${(x + Math.cos(a + da * s) * r).toFixed(1)} ${(y + Math.sin(a + da * s) * r).toFixed(1)}`);
  }
  return `M${p.join(' L')} Z`;
}

const DRAWINGS = {
  // a shop sign with a star: the brand
  brand: html`<${Line} d="M12 14 C28 12.6 52 13 68 14" w=${2.6} /><${Line} d="M24 14 L22 25 M56 14 L58 25" w=${1.8} />
    <${Shape} d="M12 27 C30 24.6 52 25 68 27 C69.6 38 69.4 50 68 60 C50 62 30 61.6 12 60 C10.6 49 10.6 38 12 27 Z" />
    <${Shape} d="M40 31.5 L43.6 39.2 L52 40.2 L45.8 46 L47.5 54.2 L40 50 L32.5 54.2 L34.2 46 L28 40.2 L36.4 39.2 Z" tint="#ffffff" stroke=${BLUE} w=${2} />`,
  // a person and a coin: paying clients
  clients: html`<${Shape} d="M10 64 C10 50 17 42.5 29 42.5 C41 42.5 48 50 48 64 C36 65.4 22 65.4 10 64 Z" />
    <${Shape} d=${circle(29, 27, 11)} tint="#ffffff" />
    <${Shape} d=${circle(58, 37, 14)} tint="#e7f4ef" stroke=${GREEN} />
    <text x="58" y="44" text-anchor="middle" font-family="Rubik, sans-serif" font-size="18" font-weight="800" fill=${GREEN}>₪</text>
    <${Line} d="M58 16 L58 11 M71 21 L74 17 M45 21 L42.5 17.5" stroke=${GREEN} w=${1.8} o=".8" />`,
  // two speech bubbles, the second with a check: the call that closes
  calls: html`<${Shape} d="M9 13 C22 10.6 36 10.8 49 13 C50.6 20 50.6 28 49 35 C39 36.6 31 36.8 23 36.2 L14 44 L15 35.8 L9 35 C7.4 28 7.4 20 9 13 Z" tint="#ffffff" />
    <${Line} d="M17 20.5 C25 19.8 33 20 41 20.6 M17 27.5 C23 27 28 27 33 27.4" w=${1.9} o=".55" />
    <${Shape} d="M32 35 C45 32.6 58 32.8 70 35 C71.6 42 71.6 49 70 56 L66 56.4 L67.5 65 L58 57.6 C49 58 40 57.6 32 56 C30.4 49 30.4 42 32 35 Z" />
    <${Line} d="M42.5 45.8 C44.6 47.4 46.4 49.2 48 51.6 C51.2 46.4 55 42.6 59.5 39.6" stroke=${BLUE} w=${3} />`,
  // gears that turn each other: the business that runs itself
  system: html`<${Shape} d=${gear(31, 41, 16.5, 22, 9)} /><${Shape} d=${circle(31, 41, 7)} tint="#ffffff" />
    <${Shape} d=${gear(60, 21, 9.5, 13.6, 8)} tint="#ffffff" stroke=${BLUE} w=${2} /><${Line} d=${circle(60, 21, 3.4)} stroke=${BLUE} w=${1.8} />
    <${Line} d="M71 46 C69 55 63 61.5 55 64 M55 64 L61 65.6 M55 64 L58.6 58.8" stroke=${BLUE} w=${2} />`,
};

export function Drawing({ name, class: cls = '' }) {
  return html`<svg viewBox="0 0 80 72" class=${'block overflow-visible ' + cls} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style=${{ filter: 'url(#pencil-rough)' }}>${DRAWINGS[name]}</svg>`;
}

// The dashed path between two stations (stretches to its box).
export function Trail({ class: cls = '', down }) {
  return html`<svg viewBox="0 0 100 20" preserveAspectRatio="none" class=${'overflow-visible ' + cls} aria-hidden="true">
    <path d=${down ? 'M2 5 C30 17 66 18 98 8' : 'M2 12 C30 2 68 2 98 12'} fill="none" stroke="#8fb3ef" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 8" vector-effect="non-scaling-stroke" />
  </svg>`;
}

// Three tiers, wide to narrow; the last one is the goal.
export function FunnelShape({ class: cls = '' }) {
  const tiers = ['M3 3 C80 1.4 172 1.6 249 3 C246 14 241 27 234 37 C162 39 90 38.6 18 37 C11 27 6 14 3 3 Z', 'M22 45 C92 43.4 160 43.6 230 45 C227 56 222 69 215 79 C156 81 96 80.6 37 79 C30 69 25 56 22 45 Z', 'M41 87 C98 85.4 154 85.6 211 87 C208 98 203 111 196 121 C150 123 102 122.6 56 121 C49 111 44 98 41 87 Z'];
  const tint = ['#ffffff', '#c3d7f7', BLUE];
  return html`<svg viewBox="0 0 252 124" preserveAspectRatio="none" class=${'overflow-visible ' + cls} aria-hidden="true" stroke-linejoin="round" style=${{ filter: 'url(#pencil-rough)' }}>
    ${tiers.map((d, i) => html`<g key=${i}>
      <path d=${d} fill=${tint[i]} />
      ${i > 0 && html`<path d=${d} fill=${i === 2 ? 'url(#pencil-hatch-light)' : 'url(#pencil-hatch-lg)'} opacity=${i === 2 ? 1 : 0.5} />`}
      <path d=${d} fill="none" stroke=${i === 2 ? BLUE : INK} stroke-width="1.8" />
    </g>`)}
  </svg>`;
}

// A pencil ring around an amount; draws itself.
export function Ring({ color = GREEN, class: cls = '' }) {
  return html`<svg viewBox="0 0 200 64" preserveAspectRatio="none" class=${'overflow-visible ' + cls} aria-hidden="true" style=${{ filter: 'url(#pencil-rough)' }}>
    <path class="pencil-draw" style=${{ animationDuration: '.9s' }} pathLength="1" d="M128 5 C70 -2 8 8 4 32 C1 56 66 62 112 60 C164 58 198 48 196 29 C194 10 138 2 92 6" fill="none" stroke=${color} stroke-width="2.4" stroke-linecap="round" opacity=".75" />
  </svg>`;
}

// Tally marks, five to a group (one mark = one month).
export function Tally({ n, class: cls = '' }) {
  const groups = [];
  for (let i = 0; i < n; i += 5) groups.push(Math.min(5, n - i));
  const W = 32;
  return html`<svg key=${n} width=${groups.length * W - 8} height="20" viewBox=${`0 0 ${groups.length * W - 8} 20`} class=${'overflow-visible ' + cls} aria-hidden="true" stroke=${BLUE} stroke-width="2.1" stroke-linecap="round" fill="none" style=${{ filter: 'url(#pencil-rough)' }}>
    ${groups.map((c, gi) => {
      const x0 = (groups.length - 1 - gi) * W; // right to left
      return html`<g key=${gi}>
        ${Array.from({ length: Math.min(4, c) }, (_, i) => html`<path key=${i} d=${`M${x0 + 21.5 - i * 6} ${2 + (i % 2)} L${x0 + 20.5 - i * 6} ${18 - (i % 2)}`} />`)}
        ${c === 5 && html`<path d=${`M${x0 + 25} 4.5 L${x0 - 1} 15.5`} />`}
      </g>`;
    })}
  </svg>`;
}
