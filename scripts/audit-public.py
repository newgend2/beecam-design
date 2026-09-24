"""Audit the public artifact, including SVG metadata, links and hosting size."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET
root = Path(__file__).resolve().parents[1]
public = root / 'docs'
problems = []
total = 0
for p in public.rglob('*'):
    if not p.is_file():
        continue
    total += p.stat().st_size
    relative = p.relative_to(public)
    if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.heic', '.webp'}:
        problems.append(f'Unexpected raster asset needs metadata review: {relative}')
    text = p.read_text(errors='replace')
    for pattern in [r'/Users/', r'/private/var/', r'file://', r'gh[pousr]_[A-Za-z0-9]{20,}', r'-----BEGIN .*PRIVATE KEY', r'localhost', r'127\.0\.0\.1']:
        if re.search(pattern, text):
            problems.append(f'Private/local content: {relative}: {pattern}')
    if p.suffix == '.svg':
        doc = ET.fromstring(text)
        if any(x.tag.split('}')[-1] in {'metadata', 'script', 'image'} for x in doc.iter()):
            problems.append(f'Embedded metadata or executable/remote content: {relative}')
    if p.suffix == '.html':
        for link in re.findall(r'(?:src|href)="([^"]+)"', text):
            if link.startswith(('https:', 'data:', '#')):
                continue
            if not (p.parent / link.split('#')[0].split('?')[0]).exists():
                problems.append(f'Missing local link: {relative}: {link}')
if total >= 1_000_000_000:
    problems.append('Site exceeds 1 GB hosting budget')
if problems:
    raise SystemExit('\n'.join(problems))
print(f'PASS: {len(list(public.rglob("*")))} entries; {total:,} bytes; no private paths, credentials, photo metadata or broken static HTML links.')
