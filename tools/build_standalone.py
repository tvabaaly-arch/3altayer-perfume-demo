"""Bundle the demo into one self-contained HTML file (dist/3altayer-homepage-demo.html)."""
import base64, json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
mime = {'.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2'}
imgs = {p.name: f"data:{mime[p.suffix]};base64,{b64(p)}" for p in (R/'assets/img').iterdir()}

html = (R/'index.html').read_text()
css = (R/'css/style.css').read_text()
css = re.sub(r'url\(\.\./assets/fonts/([^)]+)\)', lambda m: f"url(data:font/woff2;base64,{b64(R/'assets/fonts'/m.group(1))})", css)
html = re.sub(r'<link rel="(?:icon|preload)"[^>]*>\n', '', html)
html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>{css}</style>')
html = re.sub(r'src="assets/img/([^"]+)"', r'src="data:," data-img="\1"', html)
data_js = re.sub(r"'assets/img/([^']+)'", r"__IMG['\1']", (R/'js/data.js').read_text())
scripts = ''.join(f'<script>{(R/p).read_text()}</script>' for p in ['assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js', 'assets/vendor/lenis.min.js'])
boot = "<script>window.__IMG=" + json.dumps(imgs) + ";document.querySelectorAll('[data-img]').forEach(function(i){i.src=__IMG[i.dataset.img]});</script>"
tail = boot + scripts + f'<script>{data_js}</script><script>{(R/"js/main.js").read_text()}</script>'
html = re.sub(r'<script src="[^"]+"></script>\n?', '', html).replace('</body>', tail + '</body>')
out = R/'dist/3altayer-homepage-demo.html'
out.write_text(html)
print(out, round(out.stat().st_size / 1e6, 2), 'MB')
