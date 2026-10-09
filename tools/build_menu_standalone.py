"""Bundle the digital menu into one self-contained HTML file (dist/digital-menu.html)."""
import base64, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
uri = lambda p: f"data:image/{p.suffix[1:]};base64,{b64(p)}"

html = (R/'menu.html').read_text()
css = (R/'css/menu.css').read_text()
css = re.sub(r'url\(\.\./assets/fonts/([^)]+)\)', lambda m: f"url(data:font/woff2;base64,{b64(R/'assets/fonts'/m.group(1))})", css)
html = re.sub(r'<link rel="preload"[^>]*>\n', '', html)
html = html.replace('<link rel="stylesheet" href="css/menu.css">', f'<style>{css}</style>')
inline = lambda s: re.sub(r"menu/img/([\w-]+\.(?:webp|png))", lambda m: uri(R/'menu/img'/m.group(1)) if (R/'menu/img'/m.group(1)).exists() else m.group(0), s)
data_js = (R/'js/menu-data.js').read_text()
data_js = data_js.replace("const I = (f) => 'menu/img/' + f + '.webp';", "const I = (f) => window.__IMG[f];")
imgs = {p.stem: uri(p) for p in sorted((R/'menu/img').glob('*.webp'))}
import json
html = inline(html)
tail = f"<script>window.__IMG={json.dumps(imgs)}</script><script>{data_js}</script><script>{(R/'js/menu.js').read_text()}</script>"
html = re.sub(r'<script src="[^"]+"></script>\n?', '', html).replace('</body>', tail + '</body>')
out = R/'dist/digital-menu.html'
out.write_text(html)
print(out, round(out.stat().st_size / 1e6, 2), 'MB')
