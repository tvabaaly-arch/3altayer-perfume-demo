"""Bundle the demo into one self-contained HTML file (dist/3altayer-homepage-demo.html).

Inlines every stylesheet and script referenced by index.html (in order), embeds fonts and
images as data URIs, and rewrites 'assets/img/...' references in HTML and JS to an image map.
"""
import base64, json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
mime = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2'}
imgs = {p.name: f"data:{mime[p.suffix]};base64,{b64(p)}" for p in sorted((R/'assets/img').iterdir())}

html = (R/'index.html').read_text()
html = re.sub(r'<link rel="(?:icon|preload)"[^>]*>\n', '', html)

def inline_css(m):
    css = (R/m.group(1)).read_text()
    css = re.sub(r'url\(\.\./assets/fonts/([^)]+)\)', lambda f: f"url(data:font/woff2;base64,{b64(R/'assets/fonts'/f.group(1))})", css)
    return f'<style>{css}</style>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)

# images in static HTML
html = re.sub(r'src="assets/img/([^"]+)"', r'src="data:," data-img="\1"', html)

def inline_js(m):
    src = (R/m.group(1)).read_text()
    if not m.group(1).startswith('assets/vendor'):
        src = re.sub(r"(['\"])assets/img/([^'\"]+)\1", r"__IMG['\2']", src)       # 'assets/img/x' strings
    return f'<script>{src}</script>'
scripts = re.findall(r'<script src="[^"]+"></script>', html)
boot = ("<script>window.__IMG=" + json.dumps(imgs) + ";"
        "document.querySelectorAll('[data-img]').forEach(function(i){i.src=__IMG[i.dataset.img]});</script>")
body_js = ''.join(re.sub(r'<script src="([^"]+)"></script>', inline_js, s) for s in scripts)
html = re.sub(r'<script src="[^"]+"></script>\n?', '', html).replace('</body>', boot + body_js + '</body>')

out = R/'dist/3altayer-homepage-demo.html'
out.write_text(html)
print(out, round(out.stat().st_size / 1e6, 2), 'MB')
