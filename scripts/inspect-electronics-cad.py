"""Measure official electronics STEP solids with FreeCAD, without copying metadata.
Usage: FREECAD_LIB=/path/to/FreeCAD/lib python inspect-electronics-cad.py part.step
Prints millimetre component bounds for comparison with the schematic viewer.
"""
import os,sys,json
sys.path.insert(0,os.environ['FREECAD_LIB'])
import Part
s=Part.Shape();s.read(sys.argv[1])
def bounds(shape):
 b=shape.BoundBox
 return [round(v,6) for v in [b.XMin,b.YMin,b.ZMin,b.XMax,b.YMax,b.ZMax]]
print(json.dumps({'units':'mm','bounds':bounds(s),'solids':[{'bounds':bounds(v),'volume':round(v.Volume,6)} for v in s.Solids]},indent=2))
