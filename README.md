# BeeCam design

A static assembly explorer for an open camera-trap design. The viewer documents the aluminum frame and imaging platform. The weatherproof
enclosure and acrylic electronics mount will be added as separate assemblies.

**Viewer:** https://newgend2.github.io/beecam-design/

**Source:** https://github.com/newgend2/beecam-design

## Preview

Serve `docs/` with a local HTTP server, for example:

```sh
python3 -m http.server 8767 --directory docs --bind 127.0.0.1
```

Open http://127.0.0.1:8767/. All viewer dependencies are local; no CDN, account,
backend or internet connection is required after download. ES modules require
HTTP serving rather than opening index.html as a file.

## Model and evidence

`docs/js/data.js` is the dimension and part-list source. `docs/js/model.js`
assembles the interactive schematic with Three.js. Lengths are in millimetres:
570, 420, 280, 280, 220 and 100 (1,870 total before kerf).

The designer confirmed the 100 mm vertical support is parallel to the stem,
both bottoms are flush, and the crossbar rests on the short support.
The 220 mm arm is temporarily shown with its top 70 mm below the stem top.
This is a placeholder awaiting a measurement, not a confirmed dimension.
Crossbar centring, rail end alignment, plate position and bracket placement
are inferred from supplied photographs.

Hardware count is provisionally four 14057 brackets, one 14060 bracket, one
20-4167 plate and 22 screw/nut pairs. 14057 has four holes, while 14060 has two.
The supplied screw ID 11-5308 is M5 × 8 mm. 80/20 recommends M5 × 10 mm screws
with the 4 mm plate; verify this connection before ordering. No load rating,
structural verification, fit certification or manufacturing tolerances are asserted.

The 20 mm outer profile envelope and specified cut lengths are modelled to
size. Slot/fillet/bore details, bracket castings and threads are simplified.
Purchased parts should use manufacturer CAD for fabrication or clearance checks.

## Imaging platform

The two acrylic panel outlines and eight Ø5.5 mm mounting holes come from the
supplied platform DXF. The assembled footprint is 420 × 300 mm, with a Ø91.39 mm
opening centred at X210, Y145 measured from the lower-left of the exported plan.
The stepped seam follows the source geometry. Panel and stopper thicknesses
are confirmed as 3 mm. The original SVG supplies the sticker artwork; web copies
retain its vector shapes and colours while removing editor metadata.

The stopper DXF uses inches. Its rounded quadrant is converted to millimetres
at exactly 25.4 mm/in: R53.34, with straight cuts 1.27 mm from each vane axis.
Four inserts are displayed provisionally; their count and installed height are
unconfirmed. Each insert now carries one complete blue-and-yellow bullseye at
its area centroid. This requested layout is available in `stopper-contrast.svg`;
its 33 mm outer diameter is a visual layout choice, not a measured sticker size.
The funnel uses the supplied Inventor cone profile: Ø139.7 mm outer rim and
91.44 mm total height. FreeCAD + InventorLoader STEP conversion produced a valid
closed 10-face shell. The revolved profile reproduces its volume within 0.01 mm³;
the initial SAT conversion had incomplete faces and was rejected. The public
STL is generated from the validated profile with a fixed anonymous header.
`extract-cone.py` exports geometry from that converted BRep. Cone seating is
inferred by touching the taper to the hole's top edge; stopper height is inferred
from the inside taper. Neither position is a confirmed measurement. Small
moulded tabs absent from the source CAD are omitted. The crossed vanes remain
photo-based estimates pending their own CAD files. The supplied front-view
reference suggests roughly 155 mm above the rim, 125 mm maximum width and
45 mm tip width. Those proportions are estimated using the known 139.7 mm rim
as a scale; perspective and hidden seating prevent a fabrication measurement.
Model and drawing share the same parameterized silhouette.
Platform screw count is eight; screw length and the assumed 14122 nut ID need
confirmation. The combined materials CSV keeps these qualifications alongside
quantities. The camera-box DXF is archived privately for the next assembly.

Source files remain unchanged in ignored private storage. Only reconstructed
geometry-only DXFs, explicit dimension data and sanitized SVG artwork are
published. The DXF educational notice is retained in the normalized exports.

## Sources

Designer-supplied dimensions and four reference photographs; product dimensions
checked 23 September 2026 against:

- https://8020.net/20-2020.html
- https://8020.net/14057.html
- https://8020.net/14060.html
- https://8020.net/20-4167.html
- https://8020.net/11-5308.html
- https://8020.net/14122.html

Original photographs and native CAD files are not published or modified. Drawings are original
schematics derived from dimensions, not redistributed manufacturer drawings.

## Regenerate downloads

```sh
# Import supplied DXF/SVG geometry when sources change:
python3 scripts/import-platform.py /path/to/source-folder
node scripts/generate-drawings.mjs
node scripts/generate-platform-drawings.mjs
node tests/data-checks.mjs
python3 scripts/audit-public.py
```

Drawings and exports are generated from the shared data. Commit updated outputs
after changing dimensions. UI tests use Playwright when available.

## GitHub Pages

Publish the `docs/` directory from the `main` branch. All asset paths are relative
and support a repository subpath. Never publish `private/`, source photos,
machine-specific notes or credentials. Run checks, inspect staged changes and
verify the page at its repository subpath before publishing.

## Reuse

Original viewer code and original reference drawings use the MIT license.
Three.js 0.180.0 is vendored under its MIT license in
`docs/vendor/THREE-LICENSE.txt`. The 80/20 name and part identifiers refer to
third-party products; their trademarks and manufacturer CAD remain their owners'.
Supplied design geometry and artwork retain any original third-party notices;
the viewer code license does not relicense commercial trap designs.
