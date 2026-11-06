// Parla! — spaced-repetition Italian phrase trainer. Data comes from data.js (UNITS, CARDS).
const KEY = 'italiano.v1', MIN = 60e3, DAY = 864e5, GOAL = 50;
const app = document.getElementById('app');
const byId = Object.fromEntries(CARDS.map(c => [c.id, c]));
let S = JSON.parse(localStorage.getItem(KEY) || 'null') || { cards: {}, xp: 0, day: { date: '', xp: 0 }, streak: { last: '', count: 0 } };
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
const ymd = d => d.toLocaleDateString('en-CA');
const today = () => ymd(new Date());
const esc = s => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];

// ---------- spaced repetition (SM-2, simplified) ----------
// Fail: back to 1 minute. Pass: 10 min, then 1 day, then interval × ease.
function schedule(c, ok, now) {
  c = { due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, ...c };
  if (!ok) Object.assign(c, { reps: 0, lapses: c.lapses + 1, ease: Math.max(1.3, c.ease - .2), ivl: 0, due: now + MIN });
  else {
    c.reps++;
    c.ivl = c.reps === 1 ? 0 : c.reps === 2 ? 1 : Math.max(c.ivl + 1, Math.round(c.ivl * c.ease));
    c.due = now + (c.reps === 1 ? 10 * MIN : c.ivl * DAY);
  }
  return c;
}
const grade = (id, ok) => { S.cards[id] = schedule(S.cards[id], ok, Date.now()); save(); };
const isDue = id => S.cards[id] && S.cards[id].due <= Date.now();
const learned = c => (S.cards[c.id]?.reps || 0) >= 2;

// ---------- audio ----------
const player = new Audio();
function play(id, slow) { player.src = `audio/${id}${slow ? 's' : ''}.mp3`; player.play().catch(() => {}); }
let actx;
function beep(ok) {
  try {
    actx ||= new AudioContext();
    const notes = ok ? [660, 880] : [220, 180];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * .1;
      o.frequency.value = f; o.type = ok ? 'sine' : 'square';
      g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .18);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .2);
    });
  } catch { }
}

// ---------- speech recognition (Chrome on Android; needs a connection) ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\.\.\./g, ' ').replace(/[^a-z' ]/g, ' ').replace(/'/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]; d[0] = i;
    for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] !== b[j - 1])); prev = t; }
  }
  return d[b.length];
}
function similarity(heard, target) {
  const options = target.split(' / ');          // "Sì / No": saying either counts
  return Math.max(...options.map(t => {
    const a = norm(heard), b = norm(t);
    if (!a || !b) return 0;
    return 1 - lev(a, b) / Math.max(a.length, b.length);
  }));
}
// On-device Italian recognition (newer Chrome): one download, then the check works with no connection.
const SR_LOCAL = { langs: ['it-IT'], processLocally: true };
let localSR = false;
async function srStatus() {
  try { return SR?.available ? await SR.available(SR_LOCAL) : 'unsupported'; } catch { return 'unsupported'; }
}
const canCheck = () => !!SR && (localSR || navigator.onLine);

function listen(target, btn, out) {
  if (!SR) return Promise.resolve(null);
  return new Promise(res => {
    const r = new SR(); r.lang = 'it-IT'; r.maxAlternatives = 5; r.interimResults = false;
    if (localSR) r.processLocally = true;
    let best = null;
    btn.classList.add('on'); out.textContent = 'Listening…';
    r.onresult = e => {
      for (const alt of e.results[0]) {
        const score = similarity(alt.transcript, target);
        if (!best || score > best.score) best = { heard: alt.transcript, score };
      }
    };
    r.onerror = e => { out.textContent = e.error === 'network' ? 'Speech check needs a connection. Grade yourself below.' : e.error === 'not-allowed' ? 'Allow the microphone to check your speaking.' : 'Didn’t catch that. Try again.'; };
    r.onend = () => { btn.classList.remove('on'); res(best); };
    r.start();
  });
}
// No speech check available (offline, no language pack): record yourself, hear it, then the native speaker.
let recorder;
function recordBack(c, btn, out, after = () => play(c.id)) {
  if (recorder) { recorder.stop?.(); return; }               // second tap stops early (ignored while the mic is starting)
  recorder = {};
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const chunks = [], r = recorder = new MediaRecorder(stream);
    r.ondataavailable = e => chunks.push(e.data);
    r.onstop = () => {
      stream.getTracks().forEach(t => t.stop()); recorder = null; btn.classList.remove('on');
      const me = new Audio(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })));
      out.textContent = '▶ That’s you. Now the native speaker…';
      me.onended = () => { out.textContent = 'Tap 🎤 to try again'; after(); };
      me.play().catch(after);
    };
    player.pause(); btn.classList.add('on'); out.textContent = 'Recording… tap 🎤 to stop';
    r.start(); setTimeout(() => r.state === 'recording' && r.stop(), 5000);
  }).catch(() => { recorder = null; out.textContent = 'Allow the microphone to record yourself.'; });
}
async function useMic(c, btn, out, after) {
  if (!canCheck()) return recordBack(c, btn, out, after), null;
  const best = await listen(c.it, btn, out); showHeard(out, best); return best;
}
const micHint = () => canCheck() ? 'Tap 🎤 and say it back' : 'Tap 🎤, say it, and hear yourself back';

function showHeard(out, best) {
  if (!best) return;
  const pct = Math.round(best.score * 100);
  const verdict = pct >= 80 ? 'Perfetto! 🎉' : pct >= 60 ? 'Close! 👌' : 'Try again 💪';
  out.innerHTML = `I heard “<b>${esc(best.heard)}</b>” · ${pct}% · ${verdict}`;
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
    <button class="link" id="pb">📖 Phrasebook: tap any phrase to hear it</button>
    <div class="small" id="sr" style="text-align:center"></div>`;
  srStatus().then(s => {
    localSR = s === 'available';
    const el = app.querySelector('#sr'); if (!el) return;
    if (s === 'downloadable') {
      el.innerHTML = '<button class="btn ghost">⬇️ Download the Italian speech check so 🎤 works offline</button>';
      el.firstChild.onclick = async () => { el.textContent = 'Downloading…'; try { await SR.install(SR_LOCAL); } catch { } home(); };
    } else el.textContent = { downloading: 'Downloading the Italian speech check…', available: '✅ 🎤 speech check works offline' }[s] || '';
  });
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
function quiz(c, fresh) {
  const reps = S.cards[c.id]?.reps || 0;
  return { type: fresh ? 'listen' : reps < 2 ? pick(['listen', 'choose']) : pick(['listen', 'choose', 'speak', 'speak']), c };
}
function buildLesson(unit) {
  const now = Date.now(), pool = unit == null ? CARDS : CARDS.filter(c => c.unit === unit);
  const due = pool.filter(c => isDue(c.id)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due).slice(0, 10);
  let fresh = pool.filter(c => !S.cards[c.id]);
  if (unit == null) fresh.sort((a, b) => b.star - a.star);   // bold "learn these first" phrases go first
  fresh = fresh.slice(0, due.length >= 8 ? 2 : 5);
  let rev = shuffle(due);
  if (!rev.length && !fresh.length)                              // nothing due: extra practice on what's soonest
    rev = shuffle(pool.filter(c => S.cards[c.id]).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due).slice(0, 8));
  const items = [], pend = [];
  for (const c of fresh) {
    items.push({ type: 'intro', c });
    if (pend.length) items.push(quiz(pend.shift(), true));
    pend.push(c);
    if (rev.length) items.push(quiz(rev.shift()));
  }
  while (rev.length || pend.length) {
    if (pend.length) items.push(quiz(pend.shift(), true));
    if (rev.length) items.push(quiz(rev.shift()));
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
  ({ intro, listen: listenQ, choose, speak })[it.type](it.c);
  app.querySelector('#quit').onclick = home;
}
function distractors(c, field) {
  const same = shuffle(CARDS.filter(o => o.unit === c.unit && o.id !== c.id && o[field] !== c[field]));
  const other = shuffle(CARDS.filter(o => o.unit !== c.unit && o[field] !== c[field]));
  return [...same, ...other].slice(0, 3);
}
function micBlock(c) {
  return `<div class="speak">
      <button class="circ" data-a="play" aria-label="Play">🔊</button>
      <button class="circ lem" data-a="slow" aria-label="Play slowly">🐢</button>
      <button class="circ mic" data-a="mic" aria-label="Say it">🎤</button>
    </div><div class="heard" id="heard">${micHint()}</div>`;
}
function wireMic(c) {
  app.querySelector('[data-a=play]').onclick = () => play(c.id);
  app.querySelector('[data-a=slow]').onclick = () => play(c.id, true);
  const mic = app.querySelector('[data-a=mic]'), out = app.querySelector('#heard');
  mic.onclick = () => { player.pause(); useMic(c, mic, out); };
}

function intro(c) {
  app.innerHTML = header() + `<div class="body">
    <div class="ask">New phrase ✨</div>
    <div class="tile">${c.pic}</div>
    <div class="it">${esc(c.it)}</div><div class="pron">${esc(c.pron)}</div><div class="en">${esc(c.en)}</div>
    ${micBlock(c)}</div><div class="foot"><button class="btn" id="cont">Continue</button></div>`;
  wireMic(c);
  play(c.id);
  if (!S.cards[c.id]) { S.cards[c.id] = { due: Date.now(), ivl: 0, ease: 2.5, reps: 0, lapses: 0 }; save(); }
  app.querySelector('#cont').onclick = () => { L.i++; next(); };
}

function listenQ(c) {
  const opts = shuffle([c, ...distractors(c, 'en')]);
  app.innerHTML = header() + `<div class="body">
    <div class="ask">What did you hear?</div>
    <div class="speak"><button class="circ big" data-a="play" aria-label="Play">🔊</button><button class="circ lem" data-a="slow" aria-label="Play slowly" style="align-self:end">🐢</button></div>
    <div class="opts">${opts.map(o => `<button class="opt" data-id="${o.id}">${esc(o.en)}</button>`).join('')}</div></div>`;
  app.querySelector('[data-a=play]').onclick = () => play(c.id);
  app.querySelector('[data-a=slow]').onclick = () => play(c.id, true);
  play(c.id);
  wireOptions(c);
}

function choose(c) {
  const opts = shuffle([c, ...distractors(c, 'it')]);
  app.innerHTML = header() + `<div class="body">
    <div class="ask">How do you say this?</div>
    <div class="tile sm">${c.pic}</div><div class="en"><b>${esc(c.en)}</b></div>
    <div class="opts">${opts.map(o => `<button class="opt" data-id="${o.id}">${esc(o.it)}</button>`).join('')}</div></div>`;
  wireOptions(c);
}

function wireOptions(c) {
  app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    const ok = b.dataset.id === c.id;
    app.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.id === c.id) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    answer(c, ok);
  });
}

function speak(c) {
  app.innerHTML = header() + `<div class="body">
    <div class="ask">Say it in Italian</div>
    <div class="tile sm">${c.pic}</div><div class="en"><b>${esc(c.en)}</b></div>
    <div class="speak"><button class="circ mic big" data-a="mic" aria-label="Say it">🎤</button></div>
    <div class="heard" id="heard">${micHint()}</div></div>
    <div class="foot" id="foot"><button class="btn ghost" id="reveal">Show answer</button></div>`;
  const mic = app.querySelector('[data-a=mic]'), out = app.querySelector('#heard');
  const reveal = () => {
    play(c.id);
    app.querySelector('#foot').innerHTML = `<div class="it" style="margin-bottom:4px">${esc(c.it)}</div><div class="pron" style="margin-bottom:12px">${esc(c.pron)}</div>
      <div class="row"><button class="btn no" id="miss">I missed it</button><button class="btn go" id="got">I got it</button></div>`;
    app.querySelector('#miss').onclick = () => answer(c, false, true);
    app.querySelector('#got').onclick = () => answer(c, true, true);
  };
  mic.onclick = async () => {
    const b = await useMic(c, mic, out, reveal);
    if (b && b.score >= .8) answer(c, true);
    else if (b) reveal();
  };
  app.querySelector('#reveal').onclick = reveal;
}

const PRAISE = ['Bravo!', 'Perfetto!', 'Fantastico!', 'Bellissimo!', 'Esatto!', 'Grande!'];
function answer(c, ok, alreadyHeard) {
  L.tries++;
  grade(c.id, ok);
  beep(ok);
  if (ok) { L.right++; L.combo++; L.xp += 10 + (L.combo >= 5 ? 5 : 0); }
  else {
    L.combo = 0;
    L.fails[c.id] = (L.fails[c.id] || 0) + 1;
    if (L.fails[c.id] < 3) L.items.push({ type: pick(['listen', 'choose']), c });   // try it again later this lesson
  }
  if (!alreadyHeard) setTimeout(() => play(c.id), ok ? 350 : 500);
  const sheet = document.createElement('div');
  sheet.className = 'sheet ' + (ok ? 'ok' : 'bad');
  sheet.innerHTML = `<div><h2>${ok ? pick(PRAISE) + (L.combo >= 3 ? ` 🔥${L.combo}` : '') : 'Not quite'}</h2>
    <div class="ans">${c.pic} ${esc(c.it)}</div><div>${esc(c.en)} · <i>${esc(c.pron)}</i></div>
    <div class="row" style="margin-top:6px"><button class="btn ghost" id="again" style="flex:0 0 64px" aria-label="Hear it again">🔊</button>
    <button class="btn ${ok ? 'go' : 'no'}" id="cont">Continue</button></div></div>`;
  document.body.appendChild(sheet);
  sheet.querySelector('#again').onclick = () => play(c.id);
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
