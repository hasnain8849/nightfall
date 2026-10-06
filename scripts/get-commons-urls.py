#!/usr/bin/env python3
"""Get direct URLs + metadata for chosen Commons video files."""
import json
import urllib.parse
import urllib.request

UA = {'User-Agent': 'NightfallSiteBuilder/1.0 (contact: dev@nightfall.example)'}

FILES = [
    'File:Clouds over full moon at night (Free HD stock video).webm',
    'File:Laserbeam laser show in Bad Westernkotten 20240817 212704.webm',
    'File:Laserbeam laser show in Bad Westernkotten 20240817 213138.webm',
    'File:Laser LY-RGBW01 presets in smoke PC291932.webm',
    'File:Peterfeuer der FF Leonstein 2026 mit Funkenflug - Video 1.webm',
    'File:Fog.ogv',
    'File:Foggy day of hyrcanian forest of iran.webm',
    'File:Lightning storm over Colorado, USA.ogg',
]

def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

d = api({
    'action': 'query', 'format': 'json', 'prop': 'imageinfo',
    'iiprop': 'url|size|metadata', 'titles': '|'.join(FILES),
})

out = {}
for page in d['query']['pages'].values():
    title = page['title']
    ii = page.get('imageinfo', [{}])[0]
    entry = {
        'url': ii.get('url'),
        'size_mb': round(ii.get('size', 0) / 1e6, 1),
        'w': ii.get('width'), 'h': ii.get('height'),
    }
    # duration hides in metadata list
    for m in ii.get('metadata', []):
        if m.get('name') == 'length':
            entry['duration_s'] = round(float(m['value']), 1)
    out[title] = entry
    print(title)
    print('   ', entry)

with open('/home/z/my-project/scripts/commons-urls.json', 'w') as f:
    json.dump(out, f, indent=2)
