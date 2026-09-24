# BeeCam design

A static assembly explorer for an open camera-trap design. This first revision
documents the aluminum frame. The imaging platform, weatherproof enclosure,
and acrylic electronics mount will be added as separate assemblies.

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

## Sources

Designer-supplied dimensions and four reference photographs; product dimensions
checked 23 September 2026 against:

- https://8020.net/20-2020.html
- https://8020.net/14057.html
- https://8020.net/14060.html
- https://8020.net/20-4167.html
- https://8020.net/11-5308.html
- https://8020.net/14122.html

Original photographs are not published or modified. Drawings are original
schematics derived from dimensions, not redistributed manufacturer drawings.

## Regenerate downloads

```sh
node scripts/generate-drawings.mjs
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
