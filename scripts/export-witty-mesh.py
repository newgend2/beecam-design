"""Tessellate UUGear's Witty Pi 4 Mini STEP into a metadata-free viewer mesh.

Run with FreeCAD's Python and FREECAD_LIB pointing to its lib directory:
  python scripts/export-witty-mesh.py /path/to/WittyPi4Mini.step
Only solid leaf geometry is exported. Display colours are assigned here; the
source STEP does not include the fitted GPIO socket, added by the viewer.
"""
import sys, os, json, hashlib
from pathlib import Path
sys.path.insert(0,os.environ['FREECAD_LIB'])
import FreeCAD, Import, MeshPart
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1])
doc=FreeCAD.newDocument('WittyMesh')
Import.insert(str(source.resolve()),doc.Name)
leaves=[o for o in doc.Objects if o.TypeId=='Part::Feature' and o.Shape.Solids]
meshes={}
for o in leaves:
    shape=o.Shape.copy()
    # Leaf shapes include local placement; apply the enclosing STEP assembly.
    shape.Placement=o.getGlobalPlacement().multiply(o.Placement.inverse()).multiply(shape.Placement)
    b=shape.BoundBox
    # Keep manufacturer geometry; surface colours are explanatory styling.
    color='board' if o.Label=='Board' else 'metal' if min(b.XLength,b.YLength,b.ZLength)<.42 else 'package'
    if 'CAPACITOR' in o.Label: color='ceramic'
    if o.Label=='User_Library-USB_Type-C_6pin_Socket007': color='metal'
    dest=meshes.setdefault(color,{'positions':[],'indices':[]})
    for face in shape.Faces:
        verts,triangles=MeshPart.meshFromShape(Shape=face,LinearDeflection=.08,AngularDeflection=.3,Relative=False).Topology
        offset=len(dest['positions'])//3
        for v in verts:
            dest['positions'].extend(round(a,4) for a in (v.y-15,v.z+1.58127954,v.x-32.5))
        for tri in triangles: dest['indices'].extend(offset+i for i in tri)
result={'source':'https://www.uugear.com/repo/WittyPi4/WittyPi4Mini.step',
        'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
        'units':'mm','leafSolids':len(leaves),'meshes':meshes}
target=root/'docs/js/witty-cad-geometry.js'
target.write_text('// UUGear Witty Pi 4 Mini STEP, tessellated by scripts/export-witty-mesh.py.\nexport default '+json.dumps(result,separators=(',',':'))+';\n')
print('Exported',len(leaves),'solid features;',sum(len(m['indices'])//3 for m in meshes.values()),'triangles;',target.stat().st_size,'bytes')
