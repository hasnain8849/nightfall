#!/usr/bin/env python3
"""Search Wikimedia Commons for atmospheric videos suitable for Nightfall haunted site."""
import json
import urllib.parse
import urllib.request
import sys

UA = {'User-Agent': 'NightfallSiteBuilder/1.0 (contact: dev@nightfall.example)'}

TERMS = [
    'lightning storm timelapse filetype:video',
    'laser show filetype:video',
    'bonfire sparks filetype:video',
    'thunderstorm night filetype:video',
    'fog forest filetype:video',
    'nightclub lights filetype:video',
    'fireworks night filetype:video',
    'candles dark filetype:video',
    'smoke dark background filetype:video',
    'full moon clouds night filetype:video',
]

def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

results = {}
for term in TERMS:
    try:
        d = api({
            'action': 'query', 'format': 'json', 'list': 'search',
            'srnamespace': 6, 'srlimit': 6, 'srsearch': term,
        })
        hits = [r['title'] for r in d.get('query', {}).get('search', [])]
        results[term] = hits
        print(f"\n== {term}")
        for h in hits:
            print('  ', h)
    except Exception as e:
        print(f"{term}: ERROR {e}", file=sys.stderr)

with open('/home/z/my-project/scripts/commons-results.json', 'w') as f:
    json.dump(results, f, indent=2)
