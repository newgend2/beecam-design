# BeeCam design

An open camera-trap assembly explorer with a labelled 3D model, dimensioned
reference drawings, custom acrylic DXFs, printable artwork and a consolidated
parts list. Explore the complete camera or the removable electronics assembly.

**[Assembly explorer](https://newgend2.github.io/beecam-design/)** ·
**[Parts list](https://newgend2.github.io/beecam-design/#materials)** ·
**[Source](https://github.com/newgend2/beecam-design)**

## Release 1.0

The frame uses six 80/20 20-2020 members: **570, 420, 280, 280, 220 and 100 mm**.
Allow saw kerf beyond the 1,870 mm net cut length. The 100 mm support sits beside
the stem with both bottoms flush; the platform crossbar rests on it. Set the
upper arm's height in the stem slot and align the camera lens over the vane.

Use four 14057 brackets, one 14060 bracket and one 20-4167 joining plate.
All black extrusion bolts are **11-5308 M5 × 8 mm**, paired with **14122 T-nuts**.
The per-camera total is **32 of each**: 22 frame, 8 platform and 2 box-to-arm.

The 420 × 300 mm imaging platform has two 3 mm acrylic panels and a Ø91.39 mm
opening for a prebuilt [BanfieldBio blue vane trap](https://www.bluevanetraps.com).
Four 3 mm acrylic stopper inserts sit between the vanes. Print the contrast
artwork on adhesive weatherproof vinyl; centre one complete bullseye on each
stopper. The trap's collection jar and lid are not installed.

The nominal 150 × 150 × 90 mm Zulkit enclosure hangs beneath the arm on a
135 × 170 × 3 mm acrylic mounting plate. The lid faces down, with hinges toward
the stem. Add two Ø22 mm lid ports, located from the internal acrylic plate,
and a centred Ø28 mm side port. Register the internal plate in the lid before
transferring the drilling datums. The enclosure includes its lid, cable gland
and four mounting screws.

## Electronics assembly

The 3 mm internal acrylic plate carries a Raspberry Pi Zero 2 W, Witty Pi 4 Mini,
full-size SparkFun DEV-14459 Qwiic HAT, SSD1306 OLED, Adafruit DS3231 STEMMA QT RTC,
CR1220 cell and Raspberry Pi AI Camera. Five Ø20 mm hook-and-loop pairs attach
the plate to the lid. Black dots are used in the build; the linked white dots
are an alternative.

Brass standoff bodies are 15 mm under the Pi, 20 mm between Pi and Witty Pi at
the end opposite the OLED, 10 mm under the OLED and 10 mm under the RTC.
The Pi and tall Witty supports have 6 mm male threads. Four 5 mm standoffs act
as retaining nuts: two at the OLED end of the Pi and two above Witty Pi.
Six M2.5 × 6 mm screws secure the Pi and RTC standoffs from under the acrylic.
Hardware comes from the HELIFOUNER 242-piece M2.5 kit and Kadrick 660-piece M2 kit.

The camera uses four M2 screws and nuts, with one M2.5 nut and one M2 washer as
spacers at each mounting point. Select M2 screw lengths for secure engagement
through each joint without bottoming out.

The Frienda 2×20 header measures **51 × 5 × 23 mm overall**, with **12 mm male
pins**, **2.54 mm pitch** and approximately **0.6 mm pin thickness**. Its sockets
fit the Pi GPIO pins; the male pins pass through the Qwiic HAT into Witty Pi.
One header is used from an eight-pack.

Two 200 mm JST SH cables connect the HAT to the RTC and OLED. Remove one connector
on the OLED cable and solder the leads left-to-right **black, red, yellow, blue**,
viewed from the screen side with the pin edge at the top. Use the AI Camera's
included 22-pin-to-15-pin ribbon to connect it to the Pi Zero. The microSD card
is 128 GB; its full-size SD adapter is shared setup equipment.

## Power and field mounting

Choose one power configuration per camera:

- **Solar:** Voltaic CORE K-P150-V102, with a 50 W panel, 12 V / 18 Ah battery,
  integrated charge controller and panel bracket. The C304 regulator supplies
  5 V to Witty Pi through USB-C.
- **Portable:** Voltaic V75 USB-A Always On output, connected to Witty Pi by a
  USB-A-to-USB-C cable. Recharge between deployments.

Runtime depends on the camera schedule and operating conditions. Attach the
camera stem to a ground-driven T-post with two locally sourced hose clamps
that fit around both members.

## Model and drawing scope

Acrylic outlines and hole positions follow the design DXFs. Inch-based source
geometry is converted at 25.4 mm/in. Use the DXFs for custom acrylic cutting and
manufacturer specifications for fit-critical checks on purchased parts.
The Witty Pi PCB and 184 component solids use UUGear’s STEP geometry; its
fitted GPIO socket and display colours are added separately. The AI Camera
follows the manufacturer physical specification, with its CSI connector facing
the plate centre. The Pi Zero 2 W follows Raspberry Pi’s mechanical drawing,
including the USB and HDMI positions; its components remain reference geometry.
The 3D model simplifies extrusion slots, castings, enclosure mouldings, other board
components and cable routing. It illustrates assembly; it is not manufacturing
CAD for purchased parts. No blue vane fabrication drawings are provided.

`docs/js/data.js` is the shared source for parts, dimensions and procurement
quantities. Generators produce the SVG drawings and CSV/Markdown downloads.
Native CAD and reference photos remain unchanged in ignored private storage.
To regenerate the Witty mesh, run `scripts/export-witty-mesh.py` with FreeCAD’s
Python and `FREECAD_LIB` set to its library directory; pass the vendor STEP path.
Web assets contain geometry-only DXFs, sanitized artwork and curated photo copies. Original CAD
notices are retained in the normalized exports.

## Field setup panel

The **Field setup** tab (`#field`) introduces the blue vane visual lure, the
earlier flower-shaped prototypes, the non-lethal adaptation, solar-powered field stations, camera images and ArUco
re-sightings. Section links and expandable questions support a short presentation.
Select a photo to enlarge it; use the arrow buttons or left/right keys to move
between photos and Escape to close. The tagged-bee crop retains its original
279 × 272 pixels. The movement example is illustrative, not a study result.

Original photographs remain in ignored private storage. Browser copies in
`docs/media/` have orientation applied and metadata removed, with no retouching
or cropping. The six reviewed copies are recorded by checksum in
`scripts/field-media-manifest.json`; the privacy audit rejects unknown or changed
raster files and metadata-bearing headers. New photo copies require the same
review before updating that manifest.

## Preview

```sh
python3 -m http.server 8767 --directory docs --bind 127.0.0.1
```

Open http://127.0.0.1:8767/. All runtime dependencies are vendored; after download,
the viewer requires no CDN, account or backend. ES modules require HTTP serving.

## Regenerate and check

```sh
# When source geometry changes (requires ezdxf):
python3 scripts/import-platform.py /path/to/source-folder
python3 scripts/import-enclosure.py /path/to/source-folder
node scripts/generate-drawings.mjs
node scripts/generate-platform-drawings.mjs
node scripts/generate-enclosure-drawings.mjs
node scripts/generate-electronics-drawings.mjs
node scripts/generate-materials.mjs
node scripts/version-assets.mjs
node scripts/version-assets.mjs --check
node tests/data-checks.mjs
node tests/enclosure-checks.mjs
node tests/electronics-checks.mjs
node tests/materials-checks.mjs
python3 scripts/audit-public.py
```

Regenerate outputs after changing the shared data. Asset versioning stamps the
entry point and application-module imports to prevent mixed cached versions.
Browser checks cover assembly selection, lid motion, isolation, drawings,
parts-list search, repository-subpath URLs and responsive layouts. The
`tests/stopper-occlusion.mjs` rendering check protects the side-view sticker fit.

Publish only `docs/` from the `main` branch using GitHub Pages. Inspect staged
files and check the complete site before publishing. Keep `private/`, original
photos, machine-specific notes and credentials out of Git.

## Sources and reuse

Product sources are linked from the viewer and parts list. The geometry source
manifest is `docs/downloads/electronics-sources.json`. Board references include
Raspberry Pi mechanical drawings, UUGear Witty Pi STEP, SparkFun DEV-14459 Eagle
files and Adafruit DS3231 Eagle/STEP files. Header dimensions come from the
[Frienda listing diagram](https://www.amazon.com/dp/B084Q4W1PW).

Original viewer code and original reference drawings use the MIT license.
Three.js 0.180.0 is vendored under its MIT license in
`docs/vendor/THREE-LICENSE.txt`. Product names, trademarks and manufacturer CAD
remain their owners'. Design geometry and artwork retain original third-party
notices; the viewer code license does not relicense commercial trap designs.
