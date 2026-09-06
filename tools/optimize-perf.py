#!/usr/bin/env python3
"""One-off performance asset build. Does not change visual dimensions or colors."""
from __future__ import annotations

import io
import json
import re
import ssl
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageSequence

ROOT = Path(__file__).resolve().parents[1]
CTX = ssl.create_default_context()

USED_ICON_UNICODES = [
    0xF145, 0xF220, 0xF221, 0xF27F, 0xF280, 0xF285, 0xF32F, 0xF344,
    0xF3ED, 0xF437, 0xF471, 0xF472, 0xF479, 0xF47F, 0xF4FE, 0xF585,
    0xF5B8, 0xF5CB, 0xF62A, 0xF669, 0xF6CF, 0xF071,
]

ICON_RULES = {
    "arrow-up-short": "\\f145",
    "camera": "\\f220",
    "camera2": "\\f221",
    "chevron-double-left": "\\f27f",
    "chevron-double-right": "\\f280",
    "chevron-right": "\\f285",
    "envelope": "\\f32f",
    "facebook": "\\f344",
    "github": "\\f3ed",
    "instagram": "\\f437",
    "link": "\\f471",
    "linkedin": "\\f472",
    "list": "\\f479",
    "map": "\\f47f",
    "plus": "\\f4fe",
    "stack": "\\f585",
    "telephone-inbound": "\\f5b8",
    "textarea-t": "\\f5cb",
    "x": "\\f62a",
    "wordpress": "\\f669",
    "window-fullscreen": "\\f6cf",
}

JPEG_TARGETS = [
    ROOT / "assets/img/slide/slide-1.jpg",
    ROOT / "assets/img/slide/slide-3.jpg",
    ROOT / "assets/img/face.jpg",
    ROOT / "assets/img/cta-bg.jpg",
    ROOT / "img/face.jpg",
    ROOT / "img/bg1.jpg",
    ROOT / "img/bg3.jpg",
    ROOT / "bg_red_box.jpg",
]
JPEG_TARGETS += sorted((ROOT / "assets/img/portfolio").glob("portfolio-*.jpg"))
JPEG_TARGETS += sorted((ROOT / "assets/img/cube").glob("*.jpg")) if (ROOT / "assets/img/cube").exists() else []

PNG_TARGETS = [
    ROOT / "logo.png",
    ROOT / "img/logo.png",
    ROOT / "img/estoque1.png",
]
PNG_TARGETS += [ROOT / "img" / f"{i}.png" for i in range(1, 15)]
PNG_TARGETS += [ROOT / "figma" / f"{i}.png" for i in range(1, 11)]
if (ROOT / "assets/img/skills").exists():
    PNG_TARGETS += list((ROOT / "assets/img/skills").glob("*.png"))
for name in ("poster01.png", "poster02.png", "poster03.png", "still01.png", "still02.png", "still03.png"):
    PNG_TARGETS.append(ROOT / "assets/img" / name)

GIF_TARGETS = [
    ROOT / "assets/img/HUD.gif",
    ROOT / "assets/img/ocean.gif",
]


def kb(path: Path) -> float:
    return path.stat().st_size / 1024 if path.exists() else 0


def replace_if_smaller(src: Path, data: bytes, label: str) -> None:
    if not data or len(data) >= src.stat().st_size:
        print(f"  skip {label}: no gain ({kb(src):.1f} KB)")
        return
    src.write_bytes(data)
    print(f"  wrote {label}: {len(data)/1024:.1f} KB")


def optimize_jpeg(path: Path) -> None:
    if not path.exists():
        return
    before = kb(path)
    im = Image.open(path)
    im = im.convert("RGB")
    best = path.read_bytes()
    for quality in (86, 82, 78):
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
        if len(buf.getvalue()) < len(best) * 0.97:
            best = buf.getvalue()
            break
        if len(buf.getvalue()) < len(best):
            best = buf.getvalue()
    replace_if_smaller(path, best, f"{path.relative_to(ROOT)} ({before:.1f} KB)")


def optimize_png(path: Path, max_edge: int | None = None) -> None:
    if not path.exists():
        return
    before = kb(path)
    im = Image.open(path)
    if max_edge and max(im.size) > max_edge:
        im.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    buf = io.BytesIO()
    save_kw = {"format": "PNG", "optimize": True}
    if im.mode == "RGBA":
        im.save(buf, **save_kw)
    else:
        im.save(buf, **save_kw)
    replace_if_smaller(path, buf.getvalue(), f"{path.relative_to(ROOT)} ({before:.1f} KB)")


def gif_to_webp(path: Path) -> Path | None:
    if not path.exists():
        return None
    dest = path.with_suffix(".webp")
    frames = []
    durations = []
    with Image.open(path) as im:
        for frame in ImageSequence.Iterator(im):
            frames.append(frame.convert("RGBA"))
            durations.append(int(frame.info.get("duration", 80) or 80))
    if not frames:
        return None
    frames[0].save(
        dest,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=78,
        method=6,
    )
    print(f"  {path.name} {kb(path):.1f} KB -> {dest.name} {kb(dest):.1f} KB")
    return dest


def minify_css(text: str) -> str:
    calcs = []

    def save_calc(match: re.Match[str]) -> str:
        calcs.append(re.sub(r"\s+", " ", match.group(0)))
        return f"___CALC{len(calcs) - 1}___"

    text = re.sub(r"calc\((?:[^()]|\([^()]*\))*\)", save_calc, text)
    text = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s*([{}:;,>~])\s*", r"\1", text)
    text = re.sub(r";}", "}", text)
    text = text.replace("!important", " !important")
    for i, calc in enumerate(calcs):
        text = text.replace(f"___CALC{i}___", calc)
    return text.strip()


def write_icon_css() -> None:
    css = [
        '@font-face{font-display:swap;font-family:"bootstrap-icons";src:url("./fonts/bootstrap-icons-used.woff2") format("woff2")}',
        '.bi::before,[class*=" bi-"]::before,[class^=bi-]::before{display:inline-block;font-family:bootstrap-icons !important;font-style:normal;font-weight:400 !important;font-variant:normal;text-transform:none;line-height:1;vertical-align:-.125em;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}',
    ]
    for name, code in ICON_RULES.items():
        css.append(f".bi-{name}::before{{content:\"{code}\"}}")
    out = ROOT / "assets/vendor/bootstrap-icons/bootstrap-icons-used.css"
    out.write_text("".join(css), encoding="utf-8")
    print(f"  wrote {out.relative_to(ROOT)} ({kb(out):.1f} KB)")


def subset_icons() -> None:
    from fontTools.subset import Options, Subsetter, load_font, save_font

    src = ROOT / "assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2"
    dest = ROOT / "assets/vendor/bootstrap-icons/fonts/bootstrap-icons-used.woff2"
    options = Options(flavor="woff2")
    font = load_font(str(src), options)
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=USED_ICON_UNICODES)
    subsetter.subset(font)
    save_font(font, str(dest), options)
    print(f"  icon font {kb(src):.1f} KB -> {kb(dest):.1f} KB")


def download(url: str, headers: dict | None = None) -> bytes:
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
        return resp.read()


def fetch_fonts() -> None:
    font_dir = ROOT / "assets/fonts"
    font_dir.mkdir(parents=True, exist_ok=True)
    css_url = (
        "https://fonts.googleapis.com/css2"
        "?family=Orbitron:wght@400;500;700;900"
        "&family=Raleway:wght@900"
        "&family=Oswald:wght@300"
        "&family=Lato:wght@300;400;700;900"
        "&display=swap"
    )
    raw = download(
        css_url,
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            )
        },
    ).decode("utf-8")
    blocks = re.split(r"(?=@font-face)", raw)
    out_css = []
    seen = {}
    for block in blocks:
        if "@font-face" not in block:
            continue
        family = re.search(r"font-family:\s*'([^']+)'", block)
        weight = re.search(r"font-weight:\s*(\d+)", block)
        woff2 = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", block)
        urange = re.search(r"unicode-range:\s*([^;]+);", block)
        if not (family and weight and woff2):
            continue
        # Keep latin (+ latin-ext if present) only to stay visually identical for English/latin text.
        range_txt = urange.group(1) if urange else ""
        if "U+0100-02BA" in range_txt or "U+0000-00FF" in range_txt or not range_txt:
            pass
        else:
            continue
        key = f"{family.group(1).lower()}-{weight.group(1)}"
        if "U+0100-02BA" in range_txt:
            key += "-ext"
        if key in seen:
            continue
        seen[key] = True
        dest = font_dir / f"{key}.woff2"
        if not dest.exists():
            dest.write_bytes(download(woff2.group(1)))
            print(f"  downloaded {dest.name} ({kb(dest):.1f} KB)")
        else:
            print(f"  exists {dest.name} ({kb(dest):.1f} KB)")
        face = (
            f"@font-face{{font-family:'{family.group(1)}';font-style:normal;"
            f"font-weight:{weight.group(1)};font-display:swap;"
            f"src:url('../fonts/{dest.name}') format('woff2');"
        )
        if range_txt:
            face += f"unicode-range:{range_txt};"
        face += "}"
        out_css.append(face)
    css_path = ROOT / "assets/css/fonts.css"
    css_path.write_text("".join(out_css), encoding="utf-8")
    print(f"  wrote fonts.css ({kb(css_path):.1f} KB), {len(out_css)} faces")


def minify_style() -> None:
    src = ROOT / "assets/css/style.css"
    dest = ROOT / "assets/css/style.min.css"
    dest.write_text(minify_css(src.read_text(encoding="utf-8")), encoding="utf-8")
    print(f"  style.css {kb(src):.1f} KB -> style.min.css {kb(dest):.1f} KB")


def main() -> None:
    print("== JPEG ==")
    for path in JPEG_TARGETS:
        optimize_jpeg(path)

    print("== PNG ==")
    for path in PNG_TARGETS:
        max_edge = None
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        if "/skills/" in rel:
            max_edge = 96
        elif rel.startswith("img/") and re.match(r"img/\d+\.png$", rel):
            max_edge = 962
        elif rel.startswith("figma/"):
            max_edge = 800
        elif path.name in {"logo.png", "estoque1.png"}:
            max_edge = 162
        optimize_png(path, max_edge=max_edge)

    print("== GIF -> WebP ==")
    for path in GIF_TARGETS:
        gif_to_webp(path)

    print("== Icons ==")
    subset_icons()
    write_icon_css()

    print("== Fonts ==")
    fetch_fonts()

    print("== Minify CSS ==")
    minify_style()
    print("done")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("ERROR", exc, file=sys.stderr)
        raise
