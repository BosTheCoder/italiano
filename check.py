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
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    errors = []; pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL); pg.wait_for_selector("#go")
    pg.screenshot(path=SHOTS / "1-home.png")

    # SRS maths: pass → 10 min → 1 day → grows; fail → 1 min and reps reset
    r = pg.evaluate("""() => { let c, t = 0, out = [];
      for (const ok of [true, true, true, true, false]) { c = schedule(c, ok, t); out.push([c.reps, Math.round(c.due / 60e3)]); }
      return out; }""")
    assert r == [[1, 10], [2, 1440], [3, 3 * 1440], [4, 8 * 1440], [0, 1]], r
    assert pg.evaluate("similarity('dove il bagno', \"Dov'è il bagno?\")") > .8
    assert pg.evaluate("similarity('no', 'Sì / No')") == 1

    pg.click("#go")
    seen, wrong_done, n = set(), False, 0
    while not pg.query_selector(".done") and n < 60:
        n += 1
        item = pg.evaluate("L.items[L.i]")
        cid, typ = item["c"]["id"], item["type"]
        if n in (1, 2, 3) or typ not in seen: pg.screenshot(path=SHOTS / f"2-{n:02d}-{typ}.png"); seen.add(typ)
        if typ == "intro":
            pg.click("#cont")
        elif typ == "speak":
            pg.click("#reveal"); pg.click("#got")
        else:
            if not wrong_done:   # answer the first quiz wrongly to exercise the retry path
                pg.click(f".opt:not([data-id='{cid}'])"); wrong_done = True
            else:
                pg.click(f".opt[data-id='{cid}']")
        if typ != "intro":
            if "fb" not in seen: pg.wait_for_selector(".sheet"); pg.wait_for_timeout(400); pg.screenshot(path=SHOTS / "3-feedback.png"); seen.add("fb")
            pg.click(".sheet #cont")
    pg.screenshot(path=SHOTS / "4-done.png")
    st = pg.evaluate("JSON.parse(localStorage.getItem('italiano.v1'))")
    assert len(st["cards"]) == 5, len(st["cards"])                     # 5 new phrases introduced
    assert all(c["reps"] == 1 for c in st["cards"].values()), st["cards"]  # each passed once (the failed one on retry)
    assert sum(c["lapses"] for c in st["cards"].values()) == 1
    assert st["day"]["xp"] > 0 and st["streak"]["count"] == 1

    pg.click("#cont"); pg.click("#pb"); pg.fill("#q", "bagno")
    assert pg.locator(".pbrow").count() == 1
    pg.screenshot(path=SHOTS / "5-phrasebook.png")
    assert not errors, errors
    b.close()
print("OK", json.dumps({k: v["reps"] for k, v in st["cards"].items()}))
