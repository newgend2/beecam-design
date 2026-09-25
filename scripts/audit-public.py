"""Audit the public artifact, including SVG metadata, links and hosting size."""
from pathlib import Path
import hashlib
import json
import re
import struct
import xml.etree.ElementTree as ET
root = Path(__file__).resolve().parents[1]
public = root / 'docs'
problems = []
total = 0
media_manifest = json.loads((root / 'scripts/field-media-manifest.json').read_text())
seen_media = set()

def clean_raster(data, suffix):
    """Allow only image data and essential format headers, with no photo metadata."""
    if suffix == '.png':
        if not data.startswith(b'\x89PNG\r\n\x1a\n'):
            return False
        pos = 8
        while pos + 12 <= len(data):
            length = struct.unpack('>I', data[pos:pos+4])[0]
            kind = data[pos+4:pos+8]
            if kind not in {b'IHDR', b'PLTE', b'IDAT', b'IEND', b'tRNS'}:
                return False
            pos += length + 12
            if kind == b'IEND':
                return pos == len(data)
        return False
    if suffix in {'.jpg', '.jpeg'} and data.startswith(b'\xff\xd8'):
        pos = 2
        while pos + 4 <= len(data):
            if data[pos] != 0xff:
                return False
            marker = data[pos+1]
            # APP1-APP15 / COM can carry EXIF, XMP, IPTC or comments. Only JFIF is allowed.
            if marker in range(0xe1, 0xf0) or marker == 0xfe:
                return False
            if marker == 0xda:
                return data.endswith(b'\xff\xd9')
            length = struct.unpack('>H', data[pos+2:pos+4])[0]
            if length < 2:
                return False
            pos += length + 2
        return False
    return False

for p in public.rglob('*'):
    if not p.is_file():
        continue
    total += p.stat().st_size
    relative = p.relative_to(public)
    if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.heic', '.webp'}:
        name = relative.as_posix()
        expected = media_manifest.get(name)
        data = p.read_bytes()
        if not expected or hashlib.sha256(data).hexdigest() != expected['sha256']:
            problems.append(f'Raster asset missing from reviewed media manifest or changed: {relative}')
        if not clean_raster(data, p.suffix.lower()):
            problems.append(f'Raster contains metadata or unsupported format: {relative}')
        seen_media.add(name)
        continue
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
for missing in media_manifest.keys() - seen_media:
    problems.append(f'Missing reviewed image: {missing}')
if total >= 1_000_000_000:
    problems.append('Site exceeds 1 GB hosting budget')
if problems:
    raise SystemExit('\n'.join(problems))
print(f'PASS: {len(list(public.rglob("*")))} entries; {total:,} bytes; no private paths, credentials, photo metadata or broken static HTML links.')
