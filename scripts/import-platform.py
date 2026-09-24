"""Extract only explicit geometry and drawing units from the supplied CAD files.

Raw originals are archived privately. Public DXFs are new, geometry-only exports
with millimetre coordinates and no author, application, path or machine metadata.
"""
from pathlib import Path
from collections import Counter
import argparse, hashlib, json, math, shutil, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('source_dir', type=Path)
args = parser.parse_args()
private = ROOT / 'private' / 'platform-sources'
private.mkdir(parents=True, exist_ok=True)
public = ROOT / 'docs' / 'downloads'
public.mkdir(exist_ok=True)
assets = ROOT / 'docs' / 'assets'
assets.mkdir(exist_ok=True)
names = ['imaging_platform_420x300mm_91.39mmdiameter.DXF', 'vane_stopper.dxf',
         'contrast_mm_42_30.svg', 'cambox_plate_v2.DXF']
manifest = []
for name in names:
    source = args.source_dir / name
    dest = private / name
    data = source.read_bytes()
    if dest.exists() and dest.read_bytes() != data:
        raise ValueError(f'Private source already exists with different bytes: {name}')
    if not dest.exists():
        shutil.copyfile(source, dest)
    manifest.append({'source': str(source), 'archive': name, 'sha256': hashlib.sha256(data).hexdigest()})
(private / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')

def read_dxf(path):
    lines = path.read_text().splitlines()
    pairs = [(int(lines[i].strip()), lines[i+1].strip()) for i in range(0, len(lines), 2)]
    units = next(int(pairs[i+1][1]) for i,p in enumerate(pairs) if p == (9, '$INSUNITS'))
    entities, current, inside = [], None, False
    for code, value in pairs:
        if (code,value) == (2,'ENTITIES'):
            inside = True
            continue
        if not inside:
            continue
        if code == 0:
            if current:
                entities.append(current)
            if value == 'ENDSEC':
                break
            current = {'type':value, 'groups':[]}
        elif current:
            current['groups'].append((code,value))
    return units, entities

def val(e, code, default=None):
    return next((float(v) for c,v in e['groups'] if c == code), default)

units, entities = read_dxf(private / names[0])
assert units == 4, 'Platform source must use millimetres'
lines = [e for e in entities if e['type'] == 'LINE']
circles = [e for e in entities if e['type'] == 'CIRCLE']
assert len(lines) == 10 and len(circles) == 9
minx = min(val(e,c) for e in lines for c in [10,11])
miny = min(val(e,c) for e in lines for c in [20,21])
maxx = max(val(e,c) for e in lines for c in [10,11])
maxy = max(val(e,c) for e in lines for c in [20,21])
assert math.isclose(maxx-minx,420) and math.isclose(maxy-miny,300)
norm = lambda x,y: [round(x-minx,9), round(y-miny,9)]
outlines = [{'a':norm(val(e,10),val(e,20)), 'b':norm(val(e,11),val(e,21))} for e in lines]
holes = [{'center':norm(val(e,10),val(e,20)), 'radius':round(val(e,40),9)} for e in circles]
opening = max(holes, key=lambda h:h['radius'])
bolt_holes = sorted([h for h in holes if h != opening], key=lambda h:h['center'])
assert opening == {'center':[210.0,145.0], 'radius':45.695}
assert all(math.isclose(h['radius'],2.75) for h in bolt_holes)
assert sorted(set(round(p[1],6) for l in outlines for p in [l['a'],l['b']])) == [0,130,145,300]

units, stopper_entities = read_dxf(private / names[1])
assert units == 1, 'Stopper source must use inches'
vertices = [e for e in stopper_entities if e['type'] == 'VERTEX']
assert len(vertices) == 3
verts = [{'point':[val(e,10)*25.4,val(e,20)*25.4], 'bulge':val(e,42,0)} for e in vertices]
p1,p2 = verts[2]['point'],verts[0]['point']
bulge = verts[2]['bulge']; chord = math.dist(p1,p2)
radius = chord*(1+bulge**2)/(4*bulge)
distance = chord*(1-bulge**2)/(4*bulge)
cx = (p1[0]+p2[0])/2-distance*(p2[1]-p1[1])/chord
cy = (p1[1]+p2[1])/2+distance*(p2[0]-p1[0])/chord
assert math.isclose(radius,53.34) and abs(cx)<1e-8 and abs(cy)<1e-8

geometry = {'units':'mm', 'platform':{'size':[420,300], 'opening':opening,
    'boltHoles':bolt_holes, 'cutLines':outlines, 'sourceUnits':'mm'},
    'stopper':{'vertices':verts, 'arcRadius':round(radius,9), 'arcCenter':[round(cx,9),round(cy,9)],
    'arcSweepDegrees':4*math.atan(bulge)*180/math.pi,'sourceUnits':'inch','conversion':25.4,
    'clearanceFromVaneCenter':1.27, 'straightEdge':p1[0]-1.27}}
(public / 'platform-geometry.json').write_text(json.dumps(geometry, indent=2)+'\n')
(ROOT/'docs'/'js'/'platform-geometry.js').write_text('// Extracted from supplied DXF geometry by scripts/import-platform.py.\nexport default '+json.dumps(geometry,indent=2)+';\n')

def write_dxf(name, parts, notice=None):
    pairs = [(0,'SECTION'),(2,'HEADER'),(9,'$ACADVER'),(1,'AC1015'),(9,'$INSUNITS'),(70,4),
             (9,'$MEASUREMENT'),(70,1),(0,'ENDSEC'),(0,'SECTION'),(2,'ENTITIES')]
    if notice:
        pairs.append((999,notice))
    pairs.extend(parts)
    pairs += [(0,'ENDSEC'),(0,'EOF')]
    (public/name).write_text(''.join(f'{c}\n{v:.12g}\n' if isinstance(v,float) else f'{c}\n{v}\n' for c,v in pairs))

output=[]
for l in outlines:
    output += [(0,'LINE'),(100,'AcDbEntity'),(8,'CUT'),(100,'AcDbLine'),(10,l['a'][0]),(20,l['a'][1]),(30,0),
               (11,l['b'][0]),(21,l['b'][1]),(31,0)]
for h in holes:
    output += [(0,'CIRCLE'),(100,'AcDbEntity'),(8,'CUT'),(100,'AcDbCircle'),(10,h['center'][0]),(20,h['center'][1]),(30,0),(40,h['radius'])]
write_dxf('imaging-platform-mm.dxf',output,
          'Source drawing notice: SOLIDWORKS Educational Product. For Instructional Use Only.')
output=[(0,'LWPOLYLINE'),(100,'AcDbEntity'),(8,'CUT'),(100,'AcDbPolyline'),(90,3),(70,1)]
for vert in verts:
    output += [(10,vert['point'][0]),(20,vert['point'][1]),(42,vert['bulge'])]
write_dxf('vane-stopper-mm.dxf',output)

# Retain the actual vector artwork and all clipping. Strip editor-only metadata.
SVG='http://www.w3.org/2000/svg'
ET.register_namespace('',SVG)
original=ET.parse(private/names[2]).getroot()
allowed_tags={'svg','g','defs','clipPath','rect','circle'}
allowed_attrs={'width','height','viewBox','version','id','style','x','y','rx','ry','cx','cy','r',
               'transform','clip-path','clipPathUnits','fill','stroke','stroke-width'}
def clean(el):
    if el.tag.split('}')[-1] not in allowed_tags:
        return None
    new=ET.Element(el.tag,{k:v for k,v in el.attrib.items() if k in allowed_attrs})
    for child in el:
        result=clean(child)
        if result is not None:
            new.append(result)
    return new
sanitized=clean(original)
assert sanitized.attrib['width']=='420mm' and sanitized.attrib['height']=='300mm'
ET.ElementTree(sanitized).write(assets/'contrast-pattern.svg',encoding='utf-8',xml_declaration=True)
print('Imported 420 × 300 platform, Ø91.39 opening, eight Ø5.5 holes, R53.34 stopper and exact sticker artwork.')
