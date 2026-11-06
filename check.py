# /// script
# dependencies = ["playwright"]
# ///
"""End-to-end check: plays a full lesson in a phone-sized browser and checks the
spaced-repetition state it leaves behind. Screenshots go to ./shots/.
Run: uv run check.py   (set CHROME=/path/to/chrome if Playwright's own browser isn't installed)"""
import functools, glob, http.server, json, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent
SHOTS = ROOT / "shots"; SHOTS.mkdir(exist_ok=True)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(type("Q", (http.server.SimpleHTTPRequestHandler,), {"log_message": lambda *a: None}), directory=str(ROOT)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{srv.server_port}/"
chrome = os.environ.get("CHROME") or next(iter(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome"))), None)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2); pg = ctx.new_page()
    errors = []; pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL); pg.wait_for_selector("#go")
    pg.screenshot(path=SHOTS / "1-home.png")

    # SRS maths: right → 10 min → 1 day → grows; wrong → 1 min and reps reset; "hard" (used choices) barely grows
    r = pg.evaluate("""() => { let c, t = 0, out = [];
      for (const g of [GOOD, GOOD, GOOD, GOOD, AGAIN]) { c = schedule(c, g, t); out.push([c.reps, Math.round(c.due / 60e3)]); }
      return out; }""")
    assert r == [[1, 10], [2, 1440], [3, 3 * 1440], [4, 8 * 1440], [0, 1]], r
    good, hard = pg.evaluate("[GOOD, HARD].map(g => schedule({reps: 3, ivl: 3, ease: 2.5}, g, 0).ivl)")
    assert hard < good, (hard, good)
    assert pg.evaluate("mark(\"dov'e il bagno\", \"Dov'è il bagno?\")") == "exact"
    assert pg.evaluate("mark('Vorrei', 'Vorrei...')") == "exact"
    assert pg.evaluate("mark('no', 'Sì / No')") == "exact"
    assert pg.evaluate("mark('grazei', 'Grazie')") == "typo"
    assert pg.evaluate("mark('ciao', 'Grazie')") == "wrong"

    pg.click("#go")
    recalls, n = 0, 0
    while not pg.query_selector(".done") and n < 60:
        n += 1
        item = pg.evaluate("L.items[L.i]")
        cid, typ, it = item["c"]["id"], item["type"], item["c"]["it"]
        if n <= 2: pg.screenshot(path=SHOTS / f"2-{n:02d}-{typ}.png")
        if typ == "intro":
            pg.click("#cont"); continue
        recalls += 1
        if recalls == 1:                       # make it easier, then pick wrong: comes back later
            pg.screenshot(path=SHOTS / "2-recall.png")
            pg.click("#easy"); pg.click(f".opt:not([data-id='{cid}'])")
        elif recalls == 2:                     # choices, right answer: "hard"
            pg.click("#easy"); pg.screenshot(path=SHOTS / "2-choices.png"); pg.click(f".opt[data-id='{cid}']")
        elif recalls == 3:                     # typed with a typo: still right
            pg.fill("#ans", it[:-1] + "x" if len(it) > 6 else it); pg.click("#check")
        else:
            pg.fill("#ans", it.upper()); pg.press("#ans", "Enter")
        pg.wait_for_selector(".sheet"); pg.wait_for_timeout(300)
        if recalls <= 3: pg.screenshot(path=SHOTS / f"3-feedback-{recalls}.png")
        pg.click(".sheet #cont")
    pg.screenshot(path=SHOTS / "4-done.png")
    st = pg.evaluate("JSON.parse(localStorage.getItem('italiano.v1'))")
    assert len(st["cards"]) == 5, len(st["cards"])                     # 5 new phrases introduced
    assert all(c["reps"] == 1 for c in st["cards"].values()), st["cards"]  # each got right once (the missed one on retry)
    assert sum(c["lapses"] for c in st["cards"].values()) == 1
    assert st["day"]["xp"] > 0 and st["streak"]["count"] == 1

    pg.click("#cont"); pg.click("#pb"); pg.fill("#q", "bagno")
    assert pg.locator(".pbrow").count() == 1
    pg.screenshot(path=SHOTS / "5-phrasebook.png")

    # Offline: the service worker serves everything, audio included
    pg.wait_for_function("navigator.serviceWorker.controller", timeout=30000)
    pg.wait_for_function("caches.open('parla-audio-v1').then(c => c.keys()).then(k => k.length >= 2 * CARDS.length)", timeout=60000)
    ctx.set_offline(True); pg.reload(); pg.wait_for_selector("#go")
    assert pg.evaluate("document.fonts.check(\"20px 'Baloo 2'\")")
    pg.click("#go"); pg.wait_for_selector(".tile")
    assert pg.evaluate("fetch('audio/' + L.items[0].c.id + 's.mp3').then(r => r.ok)")
    assert not errors, errors
    b.close()
print("OK", json.dumps({k: v["reps"] for k, v in st["cards"].items()}))
