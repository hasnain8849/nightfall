#!/usr/bin/env python3
"""Download Stitch images and map them to sections by HTML context."""
import re, os, urllib.request

BASE = '/home/z/my-project/download/stitch'
ASSETS = '/home/z/my-project/public/assets'
os.makedirs(ASSETS, exist_ok=True)

def context_of(html, url):
    """Find surrounding HTML comment/purpose for an image URL."""
    idx = html.find(url)
    if idx == -1:
        return 'NOT_IN_DESKTOP'
    # look back 600 chars for data-purpose or section marker
    back = html[max(0, idx-600):idx]
    purposes = re.findall(r'data-purpose="([^"]+)"', back)
    begins = re.findall(r'BEGIN: (\w+)', back)
    return f"purpose={purposes[-1] if purposes else '?'} section={begins[-1] if begins else '?'}"

with open(f'{BASE}/desktop.html') as f:
    html = f.read()
with open(f'{BASE}/mobile.html') as f:
    mhtml = f.read()

urls = []
for src_name, doc in [('desktop', html), ('mobile', mhtml)]:
    for u in re.findall(r'https://lh3\.googleusercontent\.com/aida-public/[^\'\")\s]+', doc):
        if u not in [x[0] for x in urls]:
            urls.append((u, src_name))

report = []
for i, (u, src) in enumerate(urls):
    ctx = context_of(html, u)
    if 'NOT_IN_DESKTOP' in ctx:
        idx = mhtml.find(u)
        back = mhtml[max(0, idx-600):idx]
        purposes = re.findall(r'data-purpose="([^"]+)"', back)
        begins = re.findall(r'BEGIN: (\w+)', back)
        ctx = f"purpose={purposes[-1] if purposes else '?'} section={begins[-1] if begins else '?'}"
    name = f"img_{i:02d}.jpg"
    try:
        req = urllib.request.Request(u + '=w1600', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(f'{ASSETS}/{name}', 'wb') as f:
            f.write(data)
        report.append((name, src, ctx[:80], len(data)))
        print(f"{name} [{src}] {ctx[:80]} ({len(data)//1024}KB)")
    except Exception as e:
        print(f"{name} FAILED: {e}")

print("\nDONE", len(report))
