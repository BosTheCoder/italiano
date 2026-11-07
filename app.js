// Parla! — spaced-repetition Italian phrase trainer. Data comes from data.js (UNITS, CARDS).
const KEY = 'italiano.v1', MIN = 60e3, DAY = 864e5, GOAL = 50;
const AGAIN = 0, HARD = 1, GOOD = 2;   // wrong / right with choices / typed it right
const app = document.getElementById('app');
let S = JSON.parse(localStorage.getItem(KEY) || 'null') || { cards: {}, xp: 0, day: { date: '', xp: 0 }, streak: { last: '', count: 0 } };
S.log ||= [];                          // every answer: {t, id, r: exact|typo|wrong|pick|pickwrong, a: what you answered}
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
// A right answer before the phrase is due is just practice: it doesn't move it on, so you can't cram it to "learned".
const grade = (id, g) => { const c = S.cards[id]; if (g !== AGAIN && c?.reps && c.due > Date.now()) return; S.cards[id] = schedule(c, g, Date.now()); save(); };
const isDue = id => S.cards[id] && S.cards[id].due <= Date.now();
const learned = c => (S.cards[c.id]?.reps || 0) >= 3;   // right when met, again 10+ min later, and again a day+ after that
const byId = Object.fromEntries(CARDS.map(c => [c.id, c]));
const BAD = new Set(['wrong', 'pickwrong']);
const RES = { exact: ['✅', 'Typed it'], typo: ['✅', 'Typed it, small typo'], wrong: ['❌', 'Typed it wrong'], pick: ['🔘', 'Right with choices'], pickwrong: ['❌', 'Wrong choice'] };
const LEVELS = ['New', 'Learning', 'Getting there', 'Strong'];
const level = id => { const c = S.cards[id]; return !c ? 0 : c.ivl >= 7 ? 3 : c.ivl >= 1 ? 2 : 1; };

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
      // Dark green = learned (right twice), light green = started but not learned yet.
      const cs = CARDS.filter(c => c.unit === i), n = cs.filter(learned).length, met = cs.filter(c => S.cards[c.id]).length;
      const a = n / cs.length * 100, b = met / cs.length * 100;
      return `<button class="unit" data-u="${i}"><span class="ic">${u.icon}</span><span style="flex:1"><span class="nm">${esc(u.name)}</span><span class="bar" style="background:linear-gradient(90deg,var(--basil) ${a}%,var(--leaf) ${a}% ${b}%,var(--sky) ${b}%)"></span><span class="ct">${n} of ${cs.length} learned${met > n ? ` · ${met - n} started` : ''}</span></span></button>`;
    }).join('')}</div>
    <div class="row"><button class="link" id="pb">📖 My phrases</button><button class="link" id="hist">🕘 History</button></div>`;
  app.querySelector('#go').onclick = () => startLesson(null);
  app.querySelectorAll('.unit').forEach(b => b.onclick = () => startLesson(+b.dataset.u));
  app.querySelector('#pb').onclick = phrasebook;
  app.querySelector('#hist').onclick = history;
}

// Search matches the Italian, the English and the group name ("flirting" finds the whole group).
const hay = c => norm(`${c.it} ${c.en} ${UNITS[c.unit].name}`);
function listScreen(title, tabs, draw) {
  app.innerHTML = `<div class="lbar"><button class="x" id="back" aria-label="Back">✕</button><b style="flex:1">${title}</b></div>
    <input class="search" id="q" placeholder="Search Italian, English or a group" type="search">
    <div class="seg">${tabs.map((t, i) => `<button data-t="${i}" class="${i ? '' : 'on'}">${t}</button>`).join('')}</div>
    <div class="pb" id="list"></div>`;
  let tab = 0;
  const redraw = () => {
    const q = norm(app.querySelector('#q').value);
    app.querySelector('#list').innerHTML = draw(tab, c => !q || hay(c).includes(q));
    app.querySelectorAll('.pbrow').forEach(b => b.onclick = () => play(b.dataset.id));
  };
  app.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    tab = +b.dataset.t; app.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); redraw();
  });
  app.querySelector('#q').oninput = redraw;
  app.querySelector('#back').onclick = home;
  redraw();
}

function phrasebook() {
  const tally = {};
  for (const e of S.log) (tally[e.id] ||= [0, 0])[BAD.has(e.r) ? 1 : 0]++;
  const row = c => {
    const lv = level(c.id), [r, w] = tally[c.id] || [0, 0];
    return `<button class="pbrow" data-id="${c.id}"><span class="e">${c.pic}</span><span style="flex:1"><span class="t">${esc(c.it)}</span><br><span>${esc(c.en)}</span><br><span class="s">${esc(c.pron)}</span></span>
      <span class="lv"><span class="dots l${lv}"><i></i><i></i><i></i></span>${LEVELS[lv]}${r + w ? `<span>✓${r} ✗${w}</span>` : ''}</span></button>`;
  };
  // Weakest first: phrases you've met, lowest level then most-missed; unseen ones last.
  const weak = c => { const [r, w] = tally[c.id] || [0, 0], lv = level(c.id); return (lv || 9) * 10 - w / (r + w || 1); };
  listScreen('My phrases', ['By group', 'Weakest first'], (tab, ok) => {
    const hit = CARDS.filter(ok);
    if (!hit.length) return '<p class="small">No phrases match.</p>';
    if (tab) return hit.sort((a, b) => weak(a) - weak(b)).map(row).join('');
    return UNITS.map((u, i) => { const rows = hit.filter(c => c.unit === i); return rows.length ? `<h2>${u.icon} ${esc(u.name)}</h2>` + rows.map(row).join('') : ''; }).join('');
  });
}

function dayName(t) {
  const d = ymd(new Date(t));
  return d === today() ? 'Today' : d === ymd(new Date(Date.now() - DAY)) ? 'Yesterday' : new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
const yourAnswer = e => e.a && e.r !== 'exact' && e.r !== 'pick' ? `<br><span class="s">You: <s>${esc(e.a)}</s></span>` : '';
function history() {
  listScreen('History', ['All answers', 'Mistakes'], (tab, ok) => {
    let out = '', last = '';
    for (const e of S.log.slice().reverse()) {
      const c = byId[e.id];
      if (!c || !ok(c) || (tab && !BAD.has(e.r))) continue;
      const d = dayName(e.t);
      if (d !== last) { out += `<h2>${d}</h2>`; last = d; }
      out += `<button class="pbrow${BAD.has(e.r) ? ' miss' : ''}" data-id="${c.id}"><span class="e">${c.pic}</span><span style="flex:1"><span class="t">${esc(c.it)}</span><br><span>${esc(c.en)}</span>${yourAnswer(e)}</span><span class="r" title="${RES[e.r][1]}">${RES[e.r][0]}</span></button>`;
    }
    return out || `<p class="small">${S.log.length ? 'Nothing here. Bravo!' : 'Your answers show up here after a lesson.'}</p>`;
  });
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
  L = { items: buildLesson(unit), start: S.log.length, i: 0, right: 0, tries: 0, xp: 0, combo: 0, fails: {} };
  next();
}
function header() {
  return `<div class="lbar"><button class="x" id="quit" aria-label="Quit lesson">✕</button>
    ${S.log.length > L.start ? '<button class="x" id="prev" aria-label="Previous answers">↩</button>' : ''}
    <div class="prog"><i style="width:${L.i / L.items.length * 100}%"></i></div>
    <span class="combo">${L.combo >= 3 ? '🔥' + L.combo : ''}</span></div>`;
}
function next() {
  if (L.i >= L.items.length) return finish();
  const it = L.items[L.i];
  (it.type === 'intro' ? intro : recall)(it.c);
  app.querySelector('#quit').onclick = home;
  const prev = app.querySelector('#prev');
  if (prev) prev.onclick = () => past(S.log.length - L.start - 1);
}

// Look back over this lesson's answers without losing your place.
function past(k) {
  const es = S.log.slice(L.start), e = es[k], c = byId[e.id];
  document.getElementById('past')?.remove();
  const sh = document.createElement('div');
  sh.id = 'past'; sh.className = 'sheet ' + (BAD.has(e.r) ? 'bad' : 'ok');
  sh.innerHTML = `<div><h2>${RES[e.r][0]} ${RES[e.r][1]}</h2><div class="small">Answer ${k + 1} of ${es.length}</div>
    <div class="ans">${c.pic} ${esc(c.it)}</div><div>${esc(c.en)} · <i>${esc(c.pron)}</i>${yourAnswer(e)}</div>
    <div class="speak" style="justify-content:flex-start">${sounds(c.id)}</div>
    <div class="row"><button class="btn ghost" id="pp" ${k ? '' : 'disabled'}aria-label="Earlier answer">◀</button><button class="btn ghost" id="pn" ${k < es.length - 1 ? '' : 'disabled'}aria-label="Later answer">▶</button><button class="btn" id="pc">Close</button></div></div>`;
  document.body.appendChild(sh);
  wireSounds(sh);
  sh.querySelector('#pp').onclick = () => past(k - 1);
  sh.querySelector('#pn').onclick = () => past(k + 1);
  sh.querySelector('#pc').onclick = () => sh.remove();
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
    answer(c, m === 'wrong' ? AGAIN : GOOD, { r: m, a: input.value });
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
      answer(c, ok ? HARD : AGAIN, { r: ok ? 'pick' : 'pickwrong', a: byId[b.dataset.id].it });
    });
  };
}
function distractors(c) {
  const same = shuffle(CARDS.filter(o => o.unit === c.unit && o.id !== c.id && o.it !== c.it));
  const other = shuffle(CARDS.filter(o => o.unit !== c.unit && o.it !== c.it));
  return [...same, ...other].slice(0, 3);
}

const PRAISE = ['Bravo!', 'Perfetto!', 'Fantastico!', 'Bellissimo!', 'Esatto!', 'Grande!'];
function answer(c, g, { r, a }) {
  const ok = g !== AGAIN, typo = r === 'typo';
  L.tries++;
  S.log.push({ t: Date.now(), id: c.id, r, a });
  if (S.log.length > 5000) S.log.splice(0, S.log.length - 5000);
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
  const yours = a && (r === 'typo' || r === 'wrong') ? `<div>You wrote: <s>${esc(a)}</s></div>` : '';
  const sheet = document.createElement('div');
  sheet.className = 'sheet ' + (ok ? 'ok' : 'bad');
  sheet.innerHTML = `<div><h2>${title}</h2>
    <div class="ans">${c.pic} ${esc(c.it)}</div><div>${esc(c.en)} · <i>${esc(c.pron)}</i></div>${yours}
    <div class="row" style="margin-top:6px"><span class="speak" style="flex:0 0 auto">${sounds(c.id)}</span>
    <button class="btn ${ok ? 'go' : 'no'}" id="cont">Continue</button></div></div>`;
  document.body.appendChild(sheet);
  wireSounds(sheet);
  sheet.querySelector('#cont').onclick = () => { sheet.remove(); document.getElementById('past')?.remove(); L.i++; next(); };
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
