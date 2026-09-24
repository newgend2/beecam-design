"""Export only geometry from a validated cone BRep (FreeCAD Python runtime).
Convert the designer's IPT with InventorLoader's STEP strategy first. The SAT
strategy produces invalid faces for this file and must not be used as geometry.
Usage: FREECAD_LIB=/path/to/FreeCAD/lib python extract-cone.py converted.brep
"""
import os,sys,json,math,struct
from pathlib import Path
sys.path.insert(0,os.environ['FREECAD_LIB'])
import FreeCAD,Part,MeshPart
root=Path(__file__).resolve().parents[1]
s=Part.Shape();s.read(sys.argv[1])
assert s.isValid() and s.isClosed() and len(s.Faces)==10
edges=[]
for face in s.Faces:
    rings=[]
    for e in face.Edges:
        c=e.Curve
        if hasattr(c,'Radius') and hasattr(c,'Center'):
            p=(round(c.Radius,9),round(c.Center.y-s.BoundBox.YMin,9))
            if p not in rings:rings.append(p)
    assert len(rings)==2, 'Expected two circular boundaries per revolved surface'
    edges.append(rings)
points=[min(p for edge in edges for p in edge if abs(p[1])<1e-7)]
while edges:
    index=next(i for i,e in enumerate(edges) if points[-1] in e)
    edge=edges.pop(index)
    points.append(edge[1] if edge[0]==points[-1] else edge[0])
assert points[0]==points[-1] and len(points)==11
outline=Part.makePolygon([FreeCAD.Vector(r,y,0) for r,y in points])
solid=Part.Face(outline).revolve(FreeCAD.Vector(),FreeCAD.Vector(0,1,0),360)
assert solid.isValid() and solid.isClosed()
assert abs(solid.Volume-abs(s.Volume))<.01, 'Reconstructed profile must preserve imported volume'
meta={'units':'mm','source':'Designer-supplied Inventor cone; STEP conversion, validated closed shell','height':round(s.BoundBox.YLength,6),'rimOuterDiameter':round(s.BoundBox.XLength,6),'rimInnerDiameter':round(next(r*2 for r,y in points if abs(y-s.BoundBox.YLength)<1e-7 and r<69),6),'profile':points,'volumeMm3':round(solid.Volume,6),'seatingConfirmed':False}
(root/'docs/downloads/vane-cone-geometry.json').write_text(json.dumps(meta,indent=2)+'\n')
(root/'docs/js/cone-geometry.js').write_text('// Geometry only; see scripts/extract-cone.py. Axis Y; lower outlet Y=0.\nexport default '+json.dumps(meta,indent=2)+';\n')
mesh=MeshPart.meshFromShape(Shape=solid,LinearDeflection=.08,AngularDeflection=.08,Relative=False)
# Explicit binary STL, fixed anonymous header, millimetre coordinates only.
with (root/'docs/downloads/vane-cone-mm.stl').open('wb') as f:
    f.write(b'BeeCam cone geometry; units millimetres'.ljust(80,b' '));f.write(struct.pack('<I',mesh.CountFacets))
    for facet in mesh.Facets:
        values=list(facet.Normal)
        for p in facet.Points:values.extend(p)
        f.write(struct.pack('<12fH',*values,0))
print(json.dumps({k:v for k,v in meta.items() if k!='profile'},indent=2))
