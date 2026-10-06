#!/usr/bin/env python3
"""Round 2: search Commons for crowd/halloween-themed clips."""
import json
import urllib.parse
import urllib.request

UA = {'User-Agent': 'NightfallSiteBuilder/1.0 (contact: dev@nightfall.example)'}

TERMS = [
    'crowd concert night filetype:video',
    'festival crowd filetype:video',
    'jack-o-lantern filetype:video',
    'halloween pumpkins filetype:video',
    'bats flying filetype:video',
    'ravens crows filetype:video',
    'spooky forest filetype:video',
    'disc jockey filetype:video',
    'smoke machine filetype:video',
    'candle flame dark filetype:video',
]

def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

for term in TERMS:
    try:
        d = api({'action': 'query', 'format': 'json', 'list': 'search',
                 'srnamespace': 6, 'srlimit': 5, 'srsearch': term})
        hits = [r['title'] for r in d.get('query', {}).get('search', [])]
        print(f"\n== {term}")
        for h in hits:
            print('  ', h)
    except Exception as e:
        print(f"{term}: ERROR {e}")
