# BeeCam design

A static assembly explorer for an open camera-trap design. The viewer documents
the aluminum frame, imaging platform, weatherproof enclosure, internal acrylic
plate and Raspberry Pi AI Camera. Other electronics are planned for the next pass.

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
quantities.

Source files remain unchanged in ignored private storage. Only reconstructed
geometry-only DXFs, explicit dimension data and sanitized SVG artwork are
published. The DXF educational notice is retained in the normalized exports.

## Enclosure and camera

The linked Zulkit enclosure has a nominal 150 × 150 × 90 mm envelope. Its lid
faces down toward the trap. The designer corrected the shell orientation: hinges
face the stem and latches face the open end of the arm, with all three port
locations retained in absolute space. The supplied outer mounting-plate DXF is 135 × 170 mm
with six Ø5.5 mm holes: four on a 117 × 116 mm rectangle for the included enclosure
screws, and two 154 mm apart for the usual 80/20 M5 screws and nuts. Both enclosure
acrylic plates are confirmed as 3 mm thick. The lens is confirmed directly above
the vane centre; this places the box centre at Z123.968 in the frame coordinate
system. The box still inherits the unconfirmed upper-arm height.

The internal plate DXF uses inches. Conversion by 25.4 retains its rounded
128.4986 mm square outline, thirteen circular holes and three rectangular cutouts.
The camera mount has four Ø2 mm holes on a 21 × 12.5 mm pattern. In the original
centred CAD coordinates, the inner pair midpoint is (0, 41.032019625). This is
the specified optical-axis datum, not the centre of the rectangular cutout.
The cable-clearance hole centre is (37.3253, -37.3253), diameter 31.75 mm.
Both corresponding lid ports are **22 mm diameter**, as specified by the designer.
The plate is centred in the lid based on the photos; confirm registration before
using the derived exterior-face coordinates to drill a physical enclosure.

The right body wall has a centred Ø28 mm through-hole for the capped PATIKIL
bulkhead. The linked fitting lists a 27 mm male thread but inconsistent overall
dimensions, so its cap, flange and projection remain schematic. One supplied
enclosure gland is used in the lid. The lid and supplied gland/screws are listed
as included parts to avoid counting a second purchased enclosure.

Internals mode hides the frame/platform and opens the lid; the plate, camera,
gland and camera fasteners move with it. The open angle is a display choice,
not a claimed hinge limit. Shell walls, taper, mouldings, gland detail, support
pads, camera spacers and internal installed heights remain illustrative. The
camera uses the official 25 × 24 × 11.9 mm module envelope with simplified
component geometry. Other control/power boards are intentionally deferred at the
designer's request. Source photos are not published.

## Sources

Designer-supplied dimensions and four reference photographs; product dimensions
checked 23 September 2026 against:

- https://8020.net/20-2020.html
- https://8020.net/14057.html
- https://8020.net/14060.html
- https://8020.net/20-4167.html
- https://8020.net/11-5308.html
- https://8020.net/14122.html
- https://www.amazon.com/dp/B08KWD8TFY (Zulkit enclosure)
- https://www.amazon.com/dp/B0DHLLMRRK (PATIKIL capped bulkhead)
- https://www.raspberrypi.com/products/ai-camera/ (camera envelope)

Original photographs and native CAD files are not published or modified. Drawings are original
schematics derived from dimensions, not redistributed manufacturer drawings.

## Regenerate downloads

```sh
# Import supplied DXF/SVG geometry when sources change:
python3 scripts/import-platform.py /path/to/source-folder
# Requires ezdxf; raw enclosure DXFs are archived privately:
python3 scripts/import-enclosure.py /path/to/source-folder
node scripts/generate-drawings.mjs
node scripts/generate-platform-drawings.mjs
node scripts/generate-enclosure-drawings.mjs
node scripts/version-assets.mjs
node scripts/version-assets.mjs --check
node tests/data-checks.mjs
node tests/enclosure-checks.mjs
python3 scripts/audit-public.py
```

Drawings and exports are generated from the shared data. Commit updated outputs
after changing dimensions. UI tests use Playwright when available.
Run the asset-version step after code or artwork edits as well. It stamps a
shared content revision on the entry point and every application-module import,
so browser caches cannot mix a new page with old model or dimension code.
`tests/enclosure-checks.mjs` checks the imported plate area, real port cutouts,
camera alignment and rigid lid motion. `tests/stopper-occlusion.mjs` protects
the earlier side-view sticker occlusion fix.

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
