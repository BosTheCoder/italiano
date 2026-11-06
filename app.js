// Parla! — spaced-repetition Italian phrase trainer. Data comes from data.js (UNITS, CARDS).
const KEY = 'italiano.v1', MIN = 60e3, DAY = 864e5, GOAL = 50;
const AGAIN = 0, HARD = 1, GOOD = 2;   // wrong / right with choices / typed it right
const app = document.getElementById('app');
let S = JSON.parse(localStorage.getItem(KEY) || 'null') || { cards: {}, xp: 0, day: { date: '', xp: 0 }, streak: { last: '', count: 0 } };
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
const ymd = d => d.toLocaleDateString('en-CA');
const today = () => ymd(new Date());
const esc = s => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];

// ---------- spaced repetition (SM-2, simplified) ----------
// Wrong: back in 1 minute. Right: 10 min, then 1 day, then interval × ease.
// Right only with multiple choice ("hard"): the interval barely grows and ease drops.
function schedule(c, g, now) {
  c = { due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, ...c };
  if (g === AGAIN) return Object.assign(c, { reps: 0, lapses: c.lapses + 1, ease: Math.max(1.3, c.ease - .2), ivl: 0, due: now + MIN });
  c.reps++;
  if (c.reps === 1) return Object.assign(c, { ivl: 0, due: now + 10 * MIN });
  if (c.reps === 2) c.ivl = 1;
  else if (g === GOOD) c.ivl = Math.max(c.ivl + 1, Math.round(c.ivl * c.ease));
  else { c.ivl = Math.max(c.ivl, Math.round(c.ivl * 1.2)); c.ease = Math.max(1.3, c.ease - .15); }
  c.due = now + c.ivl * DAY;
  return c;
}
const grade = (id, g) => { S.cards[id] = schedule(S.cards[id], g, Date.now()); save(); };
const isDue = id => S.cards[id] && S.cards[id].due <= Date.now();
const learned = c => (S.cards[c.id]?.reps || 0) >= 2;

// ---------- marking a typed answer ----------
// Forgiving on accents, capitals, punctuation and "..." placeholders; a small typo still counts.
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {                                   // edit distance; swapping two letters counts as one edit
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1]));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}
function mark(typed, target) {                       // 'exact' | 'typo' | 'wrong'
  const a = norm(typed);
  if (!a) return 'wrong';
  const sim = Math.max(...[target, ...target.split(' / ')].map(t => { const b = norm(t); return 1 - lev(a, b) / Math.max(a.length, b.length); }));
  return sim === 1 ? 'exact' : sim >= .8 ? 'typo' : 'wrong';
}

// ---------- audio ----------
const player = new Audio();
function play(id, slow) { player.src = `audio/${id}${slow ? 's' : ''}.mp3`; player.play().catch(() => {}); }
let actx;
function beep(ok) {
  try {
    actx ||= new AudioContext();
    (ok ? [660, 880] : [220, 180]).forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * .1;
      o.frequency.value = f; o.type = ok ? 'sine' : 'square';
      g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .18);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .2);
    });
  } catch { }
}
const sounds = id => `<button class="circ" data-play="${id}" aria-label="Play">🔊</button><button class="circ lem" data-slow="${id}" aria-label="Play slowly">🐢</button>`;
function wireSounds(root) {
  root.querySelectorAll('[data-play]').forEach(b => b.onclick = () => play(b.dataset.play));
  root.querySelectorAll('[data-slow]').forEach(b => b.onclick = () => play(b.dataset.slow, true));
}

// ---------- home ----------
function stats() {
  if (S.day.date !== today()) S.day = { date: today(), xp: 0 };
  const y = ymd(new Date(Date.now() - DAY));
  const streak = S.streak.last === today() || S.streak.last === y ? S.streak.count : 0;
  return { streak, xp: S.day.xp };
}
function home() {
  const { streak, xp } = stats();
  const due = CARDS.filter(c => isDue(c.id)).length, fresh = CARDS.filter(c => !S.cards[c.id]).length;
  const sub = due || fresh ? `${due} to review · ${Math.min(fresh, due >= 8 ? 2 : 5)} new` : 'All caught up. Practise anyway?';
  app.innerHTML = `
    <div class="top"><span class="brand">Parla!</span><span class="stats"><span title="Day streak">🔥 ${streak}</span><span title="XP today">⭐ ${xp}</span></span></div>
    <div class="goal"><i style="width:${Math.min(100, xp / GOAL * 100)}%"></i></div>
    <div class="small">${xp >= GOAL ? 'Daily goal done. Bravo!' : `${GOAL - xp} XP to today’s goal`}</div>
    <div class="start"><button class="btn go" id="go">Start lesson</button><div class="small">${sub}</div></div>
    <div class="units">${UNITS.map((u, i) => {
      const cs = CARDS.filter(c => c.unit === i), n = cs.filter(learned).length;
      return `<button class="unit" data-u="${i}"><span class="ic">${u.icon}</span><span style="flex:1"><span class="nm">${esc(u.name)}</span><span class="bar"><i style="width:${n / cs.length * 100}%"></i></span></span><span class="ct">${n}/${cs.length}</span></button>`;
    }).join('')}</div>
    <button class="link" id="pb">📖 Phrasebook: tap any phrase to hear it</button>`;
  app.querySelector('#go').onclick = () => startLesson(null);
  app.querySelectorAll('.unit').forEach(b => b.onclick = () => startLesson(+b.dataset.u));
  app.querySelector('#pb').onclick = phrasebook;
}

function phrasebook() {
  app.innerHTML = `<div class="lbar"><button class="x" id="back" aria-label="Back">✕</button><b style="flex:1">Phrasebook</b></div>
    <input class="search" id="q" placeholder="Search English or Italian" type="search">
    <div class="pb" id="list"></div>`;
  const draw = q => {
    q = norm(q || '');
    app.querySelector('#list').innerHTML = UNITS.map((u, i) => {
      const rows = CARDS.filter(c => c.unit === i && (!q || norm(c.it + ' ' + c.en).includes(q)));
      return rows.length ? `<h2>${u.icon} ${esc(u.name)}</h2>` + rows.map(c =>
        `<button class="pbrow" data-id="${c.id}"><span class="e">${c.pic}</span><span><span class="t">${esc(c.it)}</span><br><span>${esc(c.en)}</span><br><span class="s">${esc(c.pron)}</span></span></button>`).join('') : '';
    }).join('');
    app.querySelectorAll('.pbrow').forEach(b => b.onclick = () => play(b.dataset.id));
  };
  draw();
  app.querySelector('#q').oninput = e => draw(e.target.value);
  app.querySelector('#back').onclick = home;
}

// ---------- lesson ----------
let L;
function buildLesson(unit) {
  const pool = unit == null ? CARDS : CARDS.filter(c => c.unit === unit);
  const due = pool.filter(c => isDue(c.id)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due).slice(0, 10);
  let fresh = pool.filter(c => !S.cards[c.id]);
  if (unit == null) fresh.sort((a, b) => b.star - a.star);   // bold "learn these first" phrases go first
  fresh = fresh.slice(0, due.length >= 8 ? 2 : 5);
  let rev = shuffle(due);
  if (!rev.length && !fresh.length)                              // nothing due: extra practice on what's soonest
    rev = shuffle(pool.filter(c => S.cards[c.id]).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due).slice(0, 8));
  // Each new phrase is shown, then tested a couple of cards later; reviews fill the gaps.
  const items = [], pend = [], recall = c => ({ type: 'recall', c });
  for (const c of fresh) {
    items.push({ type: 'intro', c });
    if (pend.length) items.push(recall(pend.shift()));
    pend.push(c);
    if (rev.length) items.push(recall(rev.shift()));
  }
  while (rev.length || pend.length) {
    if (pend.length) items.push(recall(pend.shift()));
    if (rev.length) items.push(recall(rev.shift()));
  }
  return items;
}
function startLesson(unit) {
  L = { items: buildLesson(unit), i: 0, right: 0, tries: 0, xp: 0, combo: 0, fails: {} };
  next();
}
function header() {
  return `<div class="lbar"><button class="x" id="quit" aria-label="Quit lesson">✕</button>
    <div class="prog"><i style="width:${L.i / L.items.length * 100}%"></i></div>
    <span class="combo">${L.combo >= 3 ? '🔥' + L.combo : ''}</span></div>`;
}
function next() {
  if (L.i >= L.items.length) return finish();
  const it = L.items[L.i];
  (it.type === 'intro' ? intro : recall)(it.c);
  app.querySelector('#quit').onclick = home;
}

function intro(c) {
  app.innerHTML = header() + `<div class="body">
    <div class="ask">New phrase ✨</div>
    <div class="tile">${c.pic}</div>
    <div class="it">${esc(c.it)}</div><div class="pron">${esc(c.pron)}</div><div class="en">${esc(c.en)}</div>
    <div class="speak">${sounds(c.id)}</div></div>
    <div class="foot"><button class="btn" id="cont">Continue</button></div>`;
  wireSounds(app);
  play(c.id);
  if (!S.cards[c.id]) { S.cards[c.id] = { due: Date.now(), ivl: 0, ease: 2.5, reps: 0, lapses: 0 }; save(); }
  app.querySelector('#cont').onclick = () => { L.i++; next(); };
}

function recall(c) {
  app.innerHTML = header() + `<div class="body">
    <div class="ask">Write it in Italian</div>
    <div class="tile sm">${c.pic}</div><div class="en"><b>${esc(c.en)}</b></div>
    <form id="f"><input class="answer" id="ans" lang="it" placeholder="Type the Italian" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done"></form>
    <div class="opts" id="opts"></div></div>
    <div class="foot row" id="foot"><button class="btn ghost" id="easy" type="button">Show choices</button><button class="btn go" id="check" form="f">Check</button></div>`;
  const input = app.querySelector('#ans');
  input.focus();
  app.querySelector('#f').onsubmit = e => {
    e.preventDefault();
    const m = mark(input.value, c.it);
    input.disabled = true;
    answer(c, m === 'wrong' ? AGAIN : GOOD, { typed: input.value, typo: m === 'typo' });
  };
  app.querySelector('#easy').onclick = () => {
    app.querySelector('#f').remove(); app.querySelector('#foot').remove();
    const opts = shuffle([c, ...distractors(c)]);
    const box = app.querySelector('#opts');
    box.innerHTML = opts.map(o => `<button class="opt" data-id="${o.id}">${esc(o.it)}</button>`).join('');
    box.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const ok = b.dataset.id === c.id;
      box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.id === c.id) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      answer(c, ok ? HARD : AGAIN, {});
    });
  };
}
function distractors(c) {
  const same = shuffle(CARDS.filter(o => o.unit === c.unit && o.id !== c.id && o.it !== c.it));
  const other = shuffle(CARDS.filter(o => o.unit !== c.unit && o.it !== c.it));
  return [...same, ...other].slice(0, 3);
}

const PRAISE = ['Bravo!', 'Perfetto!', 'Fantastico!', 'Bellissimo!', 'Esatto!', 'Grande!'];
function answer(c, g, { typed, typo }) {
  const ok = g !== AGAIN;
  L.tries++;
  grade(c.id, g);
  beep(ok);
  if (ok) { L.right++; L.combo++; L.xp += (g === GOOD ? 10 : 5) + (L.combo >= 5 ? 5 : 0); }
  else {
    L.combo = 0;
    L.fails[c.id] = (L.fails[c.id] || 0) + 1;
    if (L.fails[c.id] < 3) L.items.push({ type: 'recall', c });   // comes back later this lesson
  }
  setTimeout(() => play(c.id), 300);
  const title = !ok ? 'Not quite' : typo ? 'Right, small typo' : pick(PRAISE) + (L.combo >= 3 ? ` 🔥${L.combo}` : '');
  const yours = typed && (typo || !ok) ? `<div>You wrote: <s>${esc(typed)}</s></div>` : '';
  const sheet = document.createElement('div');
  sheet.className = 'sheet ' + (ok ? 'ok' : 'bad');
  sheet.innerHTML = `<div><h2>${title}</h2>
    <div class="ans">${c.pic} ${esc(c.it)}</div><div>${esc(c.en)} · <i>${esc(c.pron)}</i></div>${yours}
    <div class="row" style="margin-top:6px"><span class="speak" style="flex:0 0 auto">${sounds(c.id)}</span>
    <button class="btn ${ok ? 'go' : 'no'}" id="cont">Continue</button></div></div>`;
  document.body.appendChild(sheet);
  wireSounds(sheet);
  sheet.querySelector('#cont').onclick = () => { sheet.remove(); L.i++; next(); };
  sheet.querySelector('#cont').focus();
}

function finish() {
  stats();
  S.day.xp += L.xp; S.xp += L.xp;
  const y = ymd(new Date(Date.now() - DAY));
  if (S.streak.last !== today()) S.streak = { last: today(), count: S.streak.last === y ? S.streak.count + 1 : 1 };
  save();
  const acc = L.tries ? Math.round(L.right / L.tries * 100) : 100;
  app.innerHTML = `<div class="done">
    <div class="tile">${acc >= 90 ? '🏆' : acc >= 70 ? '🍋' : '💪'}</div>
    <h1>${acc >= 90 ? 'Magnifico!' : acc >= 70 ? 'Ben fatto!' : 'Dai, ancora!'}</h1>
    <div class="cards3"><div>⭐ ${L.xp}<small>XP earned</small></div><div>🎯 ${acc}%<small>accuracy</small></div><div>🔥 ${S.streak.count}<small>day streak</small></div></div>
    <button class="btn go" id="cont">Continue</button></div>`;
  app.querySelector('#cont').onclick = home;
  if (acc >= 70 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const conf = document.createElement('div'); conf.className = 'confetti';
    conf.innerHTML = Array.from({ length: 28 }, () => `<span style="left:${Math.random() * 100}%;animation-delay:${Math.random() * .8}s">${pick(['🍋', '🇮🇹', '⭐', '🎉', '☕', '🍝'])}</span>`).join('');
    document.body.appendChild(conf); setTimeout(() => conf.remove(), 3500);
  }
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
home();
