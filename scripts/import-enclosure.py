"""Archive original DXFs; export explicit millimetre geometry without metadata."""
from pathlib import Path
import json, math, hashlib, shutil, sys
import ezdxf
from ezdxf.path import make_path

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
archive = root/'private/enclosure-sources'
archive.mkdir(exist_ok=True)
manifest = []
result = {'units':'mm'}
for key, name, scale in [('mount','cambox_plate_v2.DXF',1),('internal','pi_plate_v2.dxf',25.4)]:
    raw = (source/name).read_bytes()
    dest = archive/name
    if dest.exists():
        assert dest.read_bytes() == raw
    else:
        shutil.copyfile(source/name,dest)
    manifest.append({'source':str(source/name),'archive':name,'sha256':hashlib.sha256(raw).hexdigest()})
    doc = ezdxf.readfile(dest)
    assert doc.units == (1 if scale == 25.4 else 4)
    contours, edges, circles, entities = [], [], [], []
    for e in doc.modelspace():
        typ=e.dxftype()
        if typ == 'CIRCLE':
            circles.append({'center':[round(c*scale,9) for c in tuple(e.dxf.center)[:2]],'radius':round(e.dxf.radius*scale,9)})
            entities.append([(0,'CIRCLE'),(8,'CUT'),(10,circles[-1]['center'][0]),(20,circles[-1]['center'][1]),(30,0),(40,circles[-1]['radius'])])
        elif typ in ('POLYLINE','LINE','ARC'):
            pts=[[round(v.x*scale,9),round(v.y*scale,9)] for v in make_path(e).flattening(.01/scale)]
            if typ == 'POLYLINE':
                contours.append(pts)
                vertices=e.vertices
                pairs=[(0,'LWPOLYLINE'),(100,'AcDbEntity'),(8,'CUT'),(100,'AcDbPolyline'),(90,len(vertices)),(70,1)]
                for v in vertices:pairs.extend([(10,v.dxf.location.x*scale),(20,v.dxf.location.y*scale),(42,v.dxf.bulge)])
            elif typ == 'LINE':
                edges.append(pts)
                pairs=[(0,'LINE'),(8,'CUT'),(10,e.dxf.start.x),(20,e.dxf.start.y),(30,0),(11,e.dxf.end.x),(21,e.dxf.end.y),(31,0)]
            else:
                edges.append(pts)
                pairs=[(0,'ARC'),(8,'CUT'),(10,e.dxf.center.x),(20,e.dxf.center.y),(30,0),(40,e.dxf.radius),(50,e.dxf.start_angle),(51,e.dxf.end_angle)]
            entities.append(pairs)
    if edges:
        chain=edges.pop(0)
        while edges:
            for i,edge in enumerate(edges):
                if math.dist(chain[-1],edge[0])<1e-6:break
                if math.dist(chain[-1],edge[-1])<1e-6:
                    edge=edge[::-1];break
            else:raise ValueError('Unconnected mount outline')
            chain.extend(edge[1:]);edges.pop(i)
        assert math.dist(chain[0],chain[-1])<1e-6
        contours.append(chain)
    area=lambda pts:abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(pts,pts[1:]+pts[:1]))/2)
    contours.sort(key=area,reverse=True)
    result[key]={'sourceUnits':'inch' if scale==25.4 else 'mm','conversion':scale,'outline':contours[0],'cutouts':contours[1:],'holes':circles}
    pairs=[(0,'SECTION'),(2,'HEADER'),(9,'$ACADVER'),(1,'AC1015'),(9,'$INSUNITS'),(70,4),(0,'ENDSEC'),(0,'SECTION'),(2,'ENTITIES')]
    if key=='mount':pairs.append((999,'Source drawing notice: SOLIDWORKS Educational Product. For Instructional Use Only.'))
    for ent in entities:pairs.extend(ent)
    pairs.extend([(0,'ENDSEC'),(0,'EOF')])
    (root/f'docs/downloads/{key}-plate-mm.dxf').write_text(''.join(f'{c}\n{v:.12g}\n' if isinstance(v,float) else f'{c}\n{v}\n' for c,v in pairs))
camera_holes=[h for h in result['internal']['holes'] if abs(h['radius']-1)<1e-6]
inner=sorted(camera_holes,key=lambda h:h['center'][1])[:2]
result['lidPorts']={'camera':{'center':[round(sum(h['center'][i] for h in inner)/2,9) for i in (0,1)],'diameter':22},'cable':{'center':max(result['internal']['holes'],key=lambda h:h['radius'])['center'],'diameter':22}}
(archive/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(root/'docs/downloads/enclosure-geometry.json').write_text(json.dumps(result,indent=2)+'\n')
(root/'docs/js/enclosure-geometry.js').write_text('// Supplied DXF geometry, converted by scripts/import-enclosure.py.\nexport default '+json.dumps(result,indent=2)+';\n')
print('Imported enclosure plates. Lid ports in internal CAD coordinates:',result['lidPorts'])
