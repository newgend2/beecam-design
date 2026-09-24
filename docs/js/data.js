import C from './cone-geometry.js?v=e0cc66a16aeb';
import G from './platform-geometry.js?v=e0cc66a16aeb';
import E from './enclosure-geometry.js?v=e0cc66a16aeb';
// Dimensions are millimetres. User measurements and photo inferences stay separate.
export const parameters = {
  profile: 20,
  stem: 570,
  crossbar: 420,
  rail: 280,
  upperArm: 220,
  lowerSupport: 100,
  upperArmTopGap: 70,
  upperArmPositionConfirmed: false,
  lowerConnectionConfirmed: true,
};
export const frameParts = [
  {id:'stem', code:'A1', name:'Vertical stem', sku:'20-2020', length:570, qty:1, kind:'extrusion', note:'Main vertical member. Cut length supplied by the designer.'},
  {id:'crossbar', code:'A2', name:'Platform crossbar', sku:'20-2020', length:420, qty:1, kind:'extrusion', note:'Centred across the top of the 100 mm support. Bottom ends of the stem and support are flush; connection confirmed by the designer.'},
  {id:'leftRail', code:'A3', name:'Left platform rail', sku:'20-2020', length:280, qty:1, kind:'extrusion', note:'Joins the front face of the crossbar at 90°. Outer edge aligned to the crossbar end, inferred from photos.'},
  {id:'rightRail', code:'A4', name:'Right platform rail', sku:'20-2020', length:280, qty:1, kind:'extrusion', note:'Matches the left rail. Together the three platform members form an open U.'},
  {id:'upperArm', code:'A5', name:'Upper mounting arm', sku:'20-2020', length:220, qty:1, kind:'extrusion', note:'Projects forward from the stem. Vertical position is provisional: 70 mm from stem top to arm top, awaiting measurement.'},
  {id:'lowerSupport', code:'A6', name:'Lower parallel support', sku:'20-2020', length:100, qty:1, kind:'extrusion', note:'Parallel to and touching the stem on its front face, with both bottoms flush. Supports the crossbar at its top.'},
  {id:'largeBracket', code:'H1', name:'Supported corner bracket', sku:'14057', qty:4, kind:'hardware', dims:'38 × 38 × 18 mm', note:'Four mounting holes: two on each face. Proposed count: one at the upper arm, two at the platform corners, one below the crossbar. Count and handedness inferred from photos.'},
  {id:'smallBracket', code:'H2', name:'Compact corner bracket', sku:'14060', qty:1, kind:'hardware', dims:'18 × 18 × 18 mm', note:'Two slotted mounting holes and dual supports. One below the crossbar, opposite the larger bracket. Placement inferred from the close-up.'},
  {id:'plate', code:'H3', name:'Square joining plate', sku:'20-4167', qty:1, kind:'hardware', dims:'40 × 40 × 4 mm', note:'Four Ø5.56 mm holes on a 20 mm square pattern. Joins the stem and short support. Height and side are photo-inferred. Manufacturer recommends M5 × 10 mm hardware here; the supplied M5 × 8 mm screw length needs checking for this joint.'},
  {id:'screw', code:'H4', name:'Button-head screw', sku:'11-5308', qty:22, kind:'hardware', dims:'M5 × 0.8 · 8 mm long', note:'Provisional total: 16 for four large brackets, 2 for the compact bracket, and 4 for the plate. Check plate screw length before ordering.'},
  {id:'nut', code:'H5', name:'Slide-in T-nut block', sku:'14122', qty:22, kind:'hardware', dims:'9 × 9 × 3 mm · M5', note:'One per screw, loaded from the extrusion ends. Quantity follows the provisional fastener count.'},
];
// Seat the outer taper at the top edge of the hole; an inferred assembly position.
const coneBaseY=123-(40.64+(G.platform.opening.radius-43.109444444)*50.8/(C.rimOuterDiameter/2-43.109444444));
const stopperBaseY=coneBaseY+(G.stopper.arcRadius-19.170225713)*C.height/(C.rimInnerDiameter/2-19.170225713);
const vaneAboveRimIllustrative=155;
export const platformParameters = {
  acrylicThickness: 3,
  stopperThickness: 3,
  stopperCount: 4,
  stopperCountConfirmed: false,
  surfaceY: 120,
  // Crossed vane envelope is illustrative; cone profile comes from supplied Inventor CAD.
  coneBaseY,
  coneProfileConfirmed:true,
  coneSeatingConfirmed:false,
  vaneModelConfirmed: false,
  vaneAboveRimIllustrative,
  vaneHeightIllustrative: vaneAboveRimIllustrative + coneBaseY + C.height - stopperBaseY,
  vaneWidthIllustrative: 125,
  vaneTipWidthIllustrative: 45,
  vaneShoulderAboveRimIllustrative: 85,
  stopperBullseyeOuterRadius: 16.5,
  stopperBullseyeInnerRadius: 9.5,
  vaneThicknessIllustrative: 2.54,
  stopperBaseYIllustrative: stopperBaseY,
};
export const platformParts = [
  {id:'rearPanel',code:'P1',name:'Rear acrylic panel',qty:1,kind:'acrylic',dims:'420 mm wide · 3 mm thick',basis:'Supplied DXF + confirmed thickness',download:'downloads/imaging-platform-mm.dxf',note:'Rear half of the 420 × 300 mm platform, nearest the stem. The stepped joint, half of the Ø91.39 mm opening, and four Ø5.5 mm bolt holes come from the supplied DXF. Acrylic thickness confirmed as 3 mm.'},
  {id:'frontPanel',code:'P2',name:'Front acrylic panel',qty:1,kind:'acrylic',dims:'420 mm wide · 3 mm thick',basis:'Supplied DXF + confirmed thickness',download:'downloads/imaging-platform-mm.dxf',note:'Front half of the platform, towards the open ends of the aluminum rails. Shares the stepped seam and circular opening with the rear panel; four Ø5.5 mm mounting holes. Acrylic thickness confirmed as 3 mm.'},
  {id:'vaneFunnel',code:'P3',name:'Blue funnel & collar',qty:1,kind:'purchased',dims:'Ø139.7 rim × 91.44 mm high',basis:'Supplied Inventor cone CAD',download:'downloads/vane-cone-mm.stl',source:'https://www.bluevanetraps.com/',note:'Revolved profile extracted from the supplied vane cone Inventor file and validated as a closed shape through STEP conversion. Includes the lower collar and hollow outlet. Rim diameter 139.7 mm; overall height 91.44 mm. Vertical placement assumes the taper seats at the top of the Ø91.39 mm platform opening; confirm this fit on the physical trap. Small moulded features absent from the source CAD are not added.'},
  {id:'crossVanes',code:'P4',name:'Crossed blue vanes',qty:2,kind:'purchased',dims:'≈155 mm above rim × 125 mm wide',basis:'Refined photo estimate · CAD pending',source:'https://www.bluevanetraps.com/',note:'Two perpendicular blue vanes above the funnel. The supplied front-view photo, scaled against the 139.7 mm funnel rim, suggests about 155 mm of exposed fin height, 125 mm maximum width and a 45 mm flat tip. The tapered shoulders now follow those proportions. These are perspective-dependent estimates; hidden depth, slots, thickness and attachment details still need measurements or CAD.'},
  {id:'stoppers',code:'P5',name:'Acrylic stopper inserts',qty:4,kind:'acrylic',dims:'R53.34 mm · 3 mm thick',basis:'Supplied DXF · quantity pending',download:'downloads/vane-stopper-mm.dxf',note:'Each supplied outline is a rounded quadrant with a 53.34 mm outer radius and two perpendicular straight edges. Converted from the DXF’s inch units at 25.4 mm/in. Thickness confirmed as 3 mm. Four copies are shown provisionally; quantity and installed height need confirmation.'},
  {id:'pattern',code:'P6',name:'High-contrast sticker',qty:1,kind:'graphic',dims:'420 × 300 mm sheet + insert patches',basis:'Supplied SVG',download:'assets/contrast-pattern.svg',note:'Uses the actual supplied green, blue and yellow vector artwork at its 420 × 300 mm page size. The platform shares one continuous pattern across the seam. Each stopper has one complete blue ring with a yellow centre placed at the centre of its area, as requested. The stopper graphic is available as a separate SVG; its size is a visual layout choice.'},
  {id:'platformScrews',code:'P7',name:'Platform screws',qty:8,kind:'hardware',dims:'M5 · length to confirm',basis:'Eight DXF mounting holes',note:'One screw per Ø5.5 mm platform hole. Screw length has not been specified for the 3 mm acrylic panels. Eight screws are shown schematically; confirm length and thread engagement before ordering.'},
  {id:'platformNuts',code:'P8',name:'Platform slide-in nuts',sku:'14122',qty:8,kind:'hardware',dims:'M5 · 20 series',basis:'Frame hardware inferred',note:'Eight slide-in nuts, one per platform screw. The viewer uses the same 14122 M5 nut as the frame; verify this part ID for the platform hardware.'},
];
export const enclosureParameters = {
  width:150, depth:150, height:90, bodyWidthIllustrative:135,
  mountThickness:3, internalThickness:3,
  // Designer confirmed optical axis directly above the trap centre.
  centerZ:165-E.lidPorts.camera.center[1],
  mountTopY:parameters.stem-parameters.upperArmTopGap-20,
  wallIllustrative:3, lidDepthIllustrative:12,
  internalStandOffIllustrative:3, cameraStandOffIllustrative:2.3,
  sidePortDiameter:28,
};
export const enclosureParts = [
  {id:'boxBody',code:'B1',name:'Enclosure body',qty:1,kind:'purchased',dims:'150 × 150 × 90 mm overall',basis:'Product envelope + designer ports',source:'https://www.amazon.com/dp/B08KWD8TFY',note:'Zulkit hinged ABS enclosure, supplied with lid, mounting screws and cable glands. Overall envelope from the linked product listing. The top hangs below the arm via the external acrylic plate. Right-side Ø28 mm cable-access hole is centred in the body wall. Wall thickness, taper, corner mouldings and hinge/latch geometry are simplified; the 3D model is a reference, not manufacturer CAD.'},
  {id:'boxLid',code:'B2',name:'Drilled enclosure lid',qty:1,kind:'included',dims:'2 × Ø22 mm added ports',basis:'Designer diameters + DXF centres',note:'Included with B1, not an additional enclosure. Faces down toward the imaging platform. Hinges face the stem and latches face the open end of the arm; orientation corrected by the designer while keeping all port locations fixed. The camera hole follows the midpoint of the internal plate’s inner camera-hole pair; the other port shares the large acrylic clearance-hole centre. Lid shape and depth are schematic. Open the lid to inspect the removable internal plate.'},
  {id:'boxMount',code:'B3',name:'Outer acrylic mounting plate',qty:1,kind:'acrylic',dims:'135 × 170 × 3 mm',basis:'Supplied DXF + confirmed thickness',download:'downloads/mount-plate-mm.dxf',note:'Exact rounded outline and six Ø5.5 mm holes from the supplied DXF. Four enclosure screws use the 117 × 116 mm pattern. Two arm fasteners use the central holes, 154 mm apart. The 3 mm plate sits against the underside of the 220 mm extrusion.'},
  {id:'lidGland',code:'B4',name:'Lid cable gland',qty:1,kind:'included',dims:'Ø22 mm lid port',basis:'Supplied with enclosure · shape schematic',source:'https://www.amazon.com/dp/B08KWD8TFY',note:'One of the glands supplied with B1. Fits the designer’s Ø22 mm lid hole at the centre of the internal plate’s Ø31.75 mm clearance opening. Nut, seal and compression cap are illustrative; dimensions of the gland itself are not confirmed.'},
  {id:'sideBulkhead',code:'B5',name:'Capped side bulkhead',qty:1,kind:'purchased',dims:'Ø28 mm wall hole · 27 mm thread',basis:'Designer hole + linked product',source:'https://www.amazon.com/dp/B0DHLLMRRK',note:'PATIKIL PVC bulkhead with screw-on cap, NPT 1/2-inch female × GHT 3/4-inch male. One fitting used; the linked product is a six-pack. Centred on the right body wall in a Ø28 mm hole. Thread diameter listed as 27 mm; cap, flange and projection are schematic because the listing gives conflicting overall sizes.'},
  {id:'boxScrews',code:'B6',name:'Supplied enclosure screws',qty:4,kind:'hardware',dims:'Size supplied with box',basis:'Designer count · size unconfirmed',note:'Four larger screws provided with the enclosure secure the external acrylic to its back. Located from the mounting-plate DXF. Heads and thread engagement are schematic; do not substitute the M5 extrusion screws.'},
  {id:'boxArmScrews',code:'B7',name:'Arm mounting screws',sku:'11-5308',qty:2,kind:'hardware',dims:'M5 × 8 mm',basis:'Designer specified frame hardware',note:'Two usual 80/20 screws through the acrylic tabs into the underside of the 220 mm arm. The DXF hole spacing is 154 mm. Confirm engagement through the 3 mm acrylic before assembly.'},
  {id:'boxArmNuts',code:'B8',name:'Arm slide-in nuts',sku:'14122',qty:2,kind:'hardware',dims:'M5 · 20 series',basis:'Designer specified frame hardware',note:'Two slide-in nuts inside the lower extrusion slot, one for each mounting-plate tab.'},
];
export const internalParts = [
  {id:'piPlate',code:'E1',name:'Internal acrylic Pi plate',qty:1,kind:'acrylic',dims:'128.499 × 128.499 × 3 mm',basis:'Supplied DXF + confirmed thickness',download:'downloads/internal-plate-mm.dxf',note:'Exact supplied outline, thirteen circular holes and three rectangular cutouts, converted from inches at 25.4 mm/in. Large clearance hole is Ø31.75 mm. Camera mounting holes are Ø2 mm on a 21 × 12.5 mm pattern. The plate is shown centred in the lid, attached with five 20 mm hook-and-loop pairs, as specified by the designer. Pad positions and compressed thickness are photo estimates.'},
  {id:'aiCamera',code:'E2',name:'Raspberry Pi AI Camera',qty:1,kind:'purchased',dims:'25 × 24 × 11.9 mm module',basis:'Official module envelope · schematic detail',source:'https://www.raspberrypi.com/products/ai-camera/',note:'Lens faces down through the lid and directly over the vane centre, as confirmed by the designer. Module envelope comes from Raspberry Pi; mounting position comes from the supplied acrylic DXF. Board components, lens body and mounting spacers are simplified. The Pi, power-management stack and wiring are documented in the internal assembly.'},
  {id:'cameraScrews',code:'E3',name:'Camera M2 screws',qty:4,kind:'hardware',dims:'M2 · length to confirm',basis:'Designer specification + DXF holes',note:'Four M2 screws and M2 nuts hold the camera. An M2.5 nut and M2 washer at each point space the PCB from the acrylic. M2 hardware comes from the Kadrick 660-piece kit. Thread length and installed spacer stack height still need measurement.'},
  {"id": "cameraNuts", "code": "E4", "name": "Camera M2 nuts", "qty": 4, "kind": "hardware", "dims": "M2", "basis": "Designer specification", "note": "One retaining nut per camera screw. Threaded on the electronics side of the camera."},
  {"id": "cameraSpacerNuts", "code": "E5", "name": "Camera spacer nuts", "qty": 4, "kind": "hardware", "dims": "M2.5 nuts used as spacers", "basis": "Designer specification", "note": "One M2.5 nut around each M2 screw, between acrylic and camera board. M2 hardware uses the Kadrick 660-piece kit. Shown with a 2 mm body height; measure the actual hardware."},
  {"id": "cameraWashers", "code": "E6", "name": "Camera spacer washers", "qty": 4, "kind": "hardware", "dims": "M2 washers", "basis": "Designer specification", "note": "One M2 washer per camera mounting point, between spacer nut and PCB. Shown 0.3 mm thick; actual thickness unconfirmed."},
  {"id": "velcro", "code": "E7", "name": "Circular hook-and-loop pairs", "qty": 5, "kind": "hardware", "dims": "5 pairs · Ø20 mm", "basis": "Designer count + linked diameter", "note": "Five paired connections attach the acrylic to the lid: ten individual adhesive dots. Black appearance follows the photos; the supplied listing is the white 20 mm variant. Positions and compressed 3 mm pair thickness are illustrative.", "source": "https://www.amazon.com/dp/B07XHRYYXJ"},
  {"id": "piZero", "code": "E8", "name": "Raspberry Pi Zero 2 W", "qty": 1, "kind": "purchased", "dims": "65 × 30 mm PCB", "basis": "Official mechanical drawing", "note": "Pre-soldered 40-pin GPIO version. Mounted on four brass standoffs at the acrylic Pi hole pattern. Nominal board mounting pitch is 58 × 23 mm; supplied acrylic pitch is 57.988 × 23.012 mm. Component bodies are simplified.", "source": "https://www.adafruit.com/product/6008"},
  {"id": "piStandoffs", "code": "E9", "name": "Pi brass standoffs", "qty": 4, "kind": "hardware", "dims": "15 mm body + 6 mm male thread", "basis": "Designer measurement · HELIFOUNER kit", "note": "Four HELIFOUNER brass standoffs support the Pi 15 mm above the acrylic. Each has a 6 mm male thread. M2.5 screws secure them from under the acrylic. The OLED end uses 5 mm standoffs as retaining nuts; the opposite end threads into the 20 mm supports."},
  {"id": "plateScrews", "code": "E10", "name": "Underside M2.5 screws", "qty": 6, "kind": "hardware", "dims": "M2.5 · length to confirm", "basis": "4 Pi + 2 RTC mounting points", "note": "Four screws secure the Pi standoffs and two secure the RTC standoffs from below the acrylic. Choose length after confirming the standoffs and engagement."},
  {"id": "wittyPi", "code": "E11", "name": "Witty Pi 4 Mini", "qty": 1, "kind": "purchased", "dims": "65 × 30 mm nominal PCB", "basis": "UUGear STEP + product dimensions", "note": "Power scheduler above the Pi, on two taller brass standoffs at the end opposite the OLED. Major component envelopes are measured from the official STEP. The model uses simplified solids. Header revisions and stack height must be checked against the installed board.", "source": "https://www.uugear.com/product/witty-pi-4-mini/"},
  {"id": "wittyStandoffs", "code": "E12", "name": "Pi-to-Witty brass standoffs", "qty": 2, "kind": "hardware", "dims": "20 mm body + 6 mm male thread", "basis": "Designer measurement · HELIFOUNER kit", "note": "Two HELIFOUNER 20 mm brass supports at the end opposite the OLED. Their 6 mm male threads pass through Witty Pi and receive 5 mm standoffs as retaining nuts. There are no tall supports at the OLED end of the Pi."},
  {"id": "stackHeader", "code": "E13", "name": "2×20 stacking header", "qty": 1, "kind": "purchased", "dims": "2.54 mm pitch · height pending", "basis": "Designer connection; product link unresolved", "note": "Female end plugs onto the Pi GPIO pins. Long male pins pass through the Qwiic HAT and into the Witty Pi header. Height is illustrative. The supplied short link resolves to the box, so the exact header and pack of eight remain unverified."},
  {"id": "qwiicHat", "code": "E14", "name": "SparkFun Qwiic HAT DEV-14459", "qty": 1, "kind": "purchased", "dims": "52.324 × 22.987 mm PCB", "basis": "Official SparkFun Eagle board", "note": "Full-size DEV-14459 Qwiic HAT, with four JST SH ports. Shares the 2×20 pins just under Witty Pi and projects outwards beside the Pi. This is the specified HAT, not the Qwiic pHAT. Outline and connector positions come from SparkFun CAD.", "source": "https://www.sparkfun.com/sparkfun-qwiic-hat-for-raspberry-pi.html"},
  {"id": "oled", "code": "E15", "name": "SSD1306 OLED display", "qty": 1, "kind": "purchased", "dims": "0.96 inch · 128 × 64 pixels", "basis": "Resolved Hosyond listing · PCB size estimated", "note": "Hosyond blue/yellow I2C OLED, one display from a five-pack. Mounted over one end of Witty Pi on small brass spacers. Approximate PCB envelope 27 × 27 mm and hole pitch 23 mm need verification. Soldered wire order, viewed from screen side at the pin edge: black, red, yellow, blue.", "source": "https://www.amazon.com/dp/B09C5K91H7"},
  {"id": "oledStandoffs", "code": "E16", "name": "OLED brass spacers", "qty": 2, "kind": "hardware", "dims": "10 mm brass spacer", "basis": "Designer measurement · count from photos", "note": "Two 10 mm brass standoffs space the OLED above Witty Pi at the OLED end. M2 bolts from the Kadrick 660-piece kit secure the display. Thread style and bolt length remain unconfirmed."},
  {"id": "oledScrews", "code": "E17", "name": "OLED M2 bolts", "qty": 2, "kind": "hardware", "dims": "M2 · length to confirm", "basis": "Designer size · Kadrick 660-piece kit", "note": "M2 bolts from the Kadrick 660-piece kit secure the OLED through its 10 mm spacers to Witty Pi. Two are shown from the photos; length and retention details remain unconfirmed."},
  {"id": "rtc", "code": "E18", "name": "Adafruit DS3231 STEMMA QT", "qty": 1, "kind": "purchased", "dims": "25.4 × 17.78 mm PCB", "basis": "Official Adafruit Eagle + STEP", "note": "External precision RTC, mounted battery-side up on two brass standoffs. Its two Ø3 mm board holes are 20.32 mm apart; the other two nearby acrylic holes remain unused. Two JST SH connectors; one connects to the HAT.", "source": "https://www.adafruit.com/product/5188"},
  {"id": "rtcStandoffs", "code": "E19", "name": "RTC brass standoffs", "qty": 2, "kind": "hardware", "dims": "M2.5 · ≈10 mm body", "basis": "Designer type · photo-estimated length", "note": "Two standoffs at the front row of the RTC acrylic hole pattern. Shown 10 mm long, leaving room for the underside IC. M2.5 screws secure them beneath the acrylic."},
  {"id": "rtcBattery", "code": "E20", "name": "CR1220 backup battery", "qty": 1, "kind": "purchased", "dims": "Ø12 × 2 mm · 3 V", "basis": "Designer battery type", "note": "One Maxell CR1220 in the RTC holder. Purchase one five-pack; only one cell is used per camera.", "source": "https://batteriesamerica.com/products/cr1220-5pk"},
  {"id": "microSD", "code": "E21", "name": "SanDisk Extreme microSDXC", "qty": 1, "kind": "purchased", "dims": "128 GB · microSD", "basis": "Designer specified capacity", "note": "One 128 GB microSDXC UHS-I card in the Pi. Select the retail package with an SD adapter; the adapter is a setup accessory and is not mounted in the camera.", "source": "https://shop.sandisk.com/products/memory-cards/microsd-cards/sandisk-extreme-uhs-i-microsd?sku=SDSQXA1-128G-GN6MA"},
  {"id": "jstCables", "code": "E22", "name": "JST SH 4-pin cables", "qty": 2, "kind": "purchased", "dims": "200 mm each · 1 mm pitch", "basis": "Designer corrected quantity and wiring", "note": "Two 200 mm cables: HAT to RTC, and HAT to OLED. The OLED cable has one connector removed and black/red/yellow/blue wires soldered at the display. Curves show connection topology, not measured routing length.", "source": "https://www.adafruit.com/product/4401"},
  {"id": "csiCable", "code": "E23", "name": "Orange CSI camera ribbon", "qty": 1, "kind": "purchased", "dims": "Pi Zero camera adapter ribbon", "basis": "Designer connection · length pending", "note": "Orange flexible camera ribbon connects the AI Camera to the Pi Zero CSI connector. 22-pin Pi Zero end to 15-pin camera end; displayed routing and total length are illustrative, following the reference photos."},
  {"id": "stackRetainers", "code": "E24", "name": "5 mm brass retaining standoffs", "qty": 4, "kind": "hardware", "dims": "5 mm body · HELIFOUNER", "basis": "Designer stack description", "note": "Two 5 mm standoffs act as nuts on the Pi at the OLED end. Two more retain Witty Pi on the tall supports at the opposite end. Threaded portions are schematic; the model shows the 5 mm hex bodies."},
];
export const parts = [...frameParts.map(p=>({...p,assembly:'frame'})),...platformParts.map(p=>({...p,assembly:'platform'})),...enclosureParts.map(p=>({...p,assembly:'enclosure'})),...internalParts.map(p=>({...p,assembly:'internals',cadSource:({piZero:'https://datasheets.raspberrypi.com/rpizero2/raspberry-pi-zero-2-w-mechanical-drawing.pdf',wittyPi:'https://www.uugear.com/repo/WittyPi4/WittyPi4Mini.step',qwiicHat:'https://github.com/sparkfun/Qwiic_Hat_for_Raspberry_Pi',rtc:'https://github.com/adafruit/Adafruit_CAD_Parts/tree/main/5188%20DS3231%20RTC'})[p.id]}))];
export const totalLength = frameParts.filter(p=>p.kind==='extrusion').reduce((sum,p)=>sum+p.length*p.qty,0);
export const sourceURL = sku => `https://8020.net/${sku}.html`;

// Pi/Witty/OLED body lengths confirmed; RTC height remains provisional. Units mm.
export const electronicsParameters = {
 piCenterCAD:[28.2067,21.0312],rtcCenterCAD:[-36.3347,-45.2247],
 piStandOff:15,wittyStandOff:20,rtcStandOff:10,oledStandOff:10,retainerLength:5,maleThreadLength:6,
 pcbThickness:1.6,velcroDiameter:20,velcroCount:5,
 qwiicWidth:52.324,qwiicDepth:22.987,oledSize:27,
 piAndWittyAndOledHeightsConfirmed:true,rtcHeightConfirmed:false,
};
