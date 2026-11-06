# /// script
# dependencies = ["edge-tts"]
# ///
"""Generate audio/*.mp3 (normal + slow) and data.js from phrases.json.
Run: uv run build.py   (skips audio files that already exist)"""
import asyncio, hashlib, json, re
from pathlib import Path

import edge_tts

ROOT = Path(__file__).parent
VOICE = "it-IT-DiegoNeural"
SPEEDS = {"": "+0%", "s": "-35%"}


def speakable(it):
    return re.sub(r"\s+", " ", it.replace("...", " ").replace(" / ", ", ")).strip(" ,")


async def tts(text, path, rate, sem):
    async with sem:
        await edge_tts.Communicate(text, VOICE, rate=rate).save(str(path))


async def main():
    units = json.loads((ROOT / "phrases.json").read_text())
    (ROOT / "audio").mkdir(exist_ok=True)
    sem, jobs, cards = asyncio.Semaphore(6), [], []
    for u, unit in enumerate(units):
        for it, en, pic, pron, star in unit["phrases"]:
            key = hashlib.md5(it.encode()).hexdigest()[:8]
            cards.append({"id": key, "it": it, "en": en, "pic": pic, "pron": pron, "star": star, "unit": u})
            for suffix, rate in SPEEDS.items():
                p = ROOT / "audio" / f"{key}{suffix}.mp3"
                if not p.exists():
                    jobs.append(tts(speakable(it), p, rate, sem))
    await asyncio.gather(*jobs)
    meta = [{"name": u["unit"], "icon": u["icon"]} for u in units]
    (ROOT / "data.js").write_text(
        f"const UNITS = {json.dumps(meta, ensure_ascii=False)};\n"
        f"const CARDS = {json.dumps(cards, ensure_ascii=False, indent=0)};\n")
    print(f"{len(cards)} cards, {len(jobs)} audio files generated")


asyncio.run(main())
