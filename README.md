# BeeCam design

A static assembly explorer for an open camera-trap design. The viewer documents
the aluminum frame, imaging platform, weatherproof enclosure, internal acrylic
plate, Raspberry Pi AI Camera and internal electronics stack.

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
component geometry. The internal electronics are now included as described below. Source photos are not published.

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
node scripts/generate-electronics-drawings.mjs
node scripts/version-assets.mjs
node scripts/version-assets.mjs --check
node tests/data-checks.mjs
node tests/enclosure-checks.mjs
node tests/electronics-checks.mjs
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

## Internal electronics (revision 0.4)

The lid carries the 3 mm acrylic, Pi Zero 2 W, Witty Pi 4 Mini, full-size
DEV-14459 Qwiic HAT, SSD1306 OLED, DS3231 STEMMA QT RTC with CR1220, and AI Camera.
Board mounting positions follow the supplied acrylic DXF. All parts follow lid
opening and have independent selection and exploded offsets. The HAT projects
outwards alongside the Pi and sits just beneath Witty Pi on the shared 2×20 header.

Five Ø20 mm hook-and-loop **pairs** use ten adhesive dots. Their positions and
compressed 3 mm thickness are approximate; black appearance follows the photos,
while the supplied listing resolves to a white variant. Camera fasteners are
four M2 screws, four M2 nuts, four M2.5 spacer nuts and four M2 washers.
The RTC uses **two** mounting holes, matching Adafruit CAD and the photos, not
all four candidate acrylic holes. Six underside M2.5 screws support Pi and RTC.
OLED spacer/bolt count is provisionally two, inferred from the photos.

Confirmed HELIFOUNER body lengths: acrylic→Pi 15 mm (four), Pi→Witty Pi 20 mm (two, opposite OLED), Witty Pi→OLED 10 mm (two). Pi and tall Witty standoffs have 6 mm male threads. Four 5 mm standoffs act as nuts: two on Pi at the OLED end, two on Witty at the other end. Acrylic→RTC remains an illustrative 10 mm. M2 hardware comes from the Kadrick 660-piece kit. Camera nut/washer
stack is shown as 2.3 mm. These values are in electronicsParameters in data.js; confirmed sizes are distinguished from the remaining estimates.
OLED PCB size (27 mm square), retention details, header height and all screw
lengths require confirmation before procurement or fabrication.

Two 200 mm JST SH connections are routed: HAT→RTC and HAT→OLED. The OLED end
is stripped and soldered black/red/yellow/blue from left to right when viewed
from the screen side with the pin edge at the top, as specified by the designer.
The corrected BOM has two cables, confirmed by the designer.
Cable curves document topology, not a measured 200 mm route. CSI uses an orange
Pi Zero adapter ribbon; length is unspecified. The microSD card is 128 GB; its
retail SD adapter is not mounted in the model. One OLED is used from a five-pack,
and one CR1220 is used from a five-pack.

Manufacturer sources checked 24 September 2026:

- [Pi Zero 2 W mechanical drawing](https://datasheets.raspberrypi.com/rpizero2/raspberry-pi-zero-2-w-mechanical-drawing.pdf) — 65 × 30 mm, 58 × 23 mm nominal mounting pitch.
- [UUGear Witty Pi 4 Mini STEP](https://www.uugear.com/repo/WittyPi4/WittyPi4Mini.step) — major package bounds measured with FreeCAD; display is simplified.
- [SparkFun DEV-14459 Eagle files](https://github.com/sparkfun/Qwiic_Hat_for_Raspberry_Pi) — 52.324 × 22.987 mm board and connector layout. Manufacturer files retain their CC BY-SA 4.0 hardware license; linked, not redistributed.
- [Adafruit DS3231 CAD](https://github.com/adafruit/Adafruit_CAD_Parts/tree/main/5188%20DS3231%20RTC) and [Eagle PCB](https://github.com/adafruit/Adafruit-DS3231-Precision-RTC-Breakout-PCB) — board outline, two mounting holes and component envelopes.
- [Hosyond OLED](https://www.amazon.com/dp/B09C5K91H7) — 0.96 inch SSD1306, 128 × 64, blue/yellow, five-pack; exact board dimensions unverified.
- [20 mm hook-and-loop dots](https://www.amazon.com/dp/B07XHRYYXJ).

The supplied stacking-header short link resolves to the enclosure, so no header
purchase link is shown. The model follows the designer's 2×20 female-to-male
connection description. Vendor CAD links are available on each relevant part.
The geometry-only source manifest is docs/downloads/electronics-sources.json;
inspect-electronics-cad.py reproduces STEP bounds using a FreeCAD Python runtime.
Native sources and reference photos remain private; drawings and meshes are
original simplified reference illustrations, not vendor fabrication models.
