import C from './cone-geometry.js?v=da3b2fb6589e';
import G from './platform-geometry.js?v=da3b2fb6589e';
import E from './enclosure-geometry.js?v=da3b2fb6589e';
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
  {"id":"stem","code":"A1","name":"Vertical stem","sku":"20-2020","length":570,"qty":1,"kind":"extrusion","note":"Main vertical member, cut to 570 mm."},
  {"id":"crossbar","code":"A2","name":"Platform crossbar","sku":"20-2020","length":420,"qty":1,"kind":"extrusion","note":"Centred across the top of the 100 mm support. Keep the bottom ends of the stem and support flush."},
  {"id":"leftRail","code":"A3","name":"Left platform rail","sku":"20-2020","length":280,"qty":1,"kind":"extrusion","note":"Joins the front face of the crossbar at 90°. Align its outer edge with the crossbar end."},
  {"id":"rightRail","code":"A4","name":"Right platform rail","sku":"20-2020","length":280,"qty":1,"kind":"extrusion","note":"Matches the left rail. Together the three platform members form an open U."},
  {"id":"upperArm","code":"A5","name":"Upper mounting arm","sku":"20-2020","length":220,"qty":1,"kind":"extrusion","note":"Projects forward from the stem. Adjust its vertical position in the stem slot to set the camera height."},
  {"id":"lowerSupport","code":"A6","name":"Lower parallel support","sku":"20-2020","length":100,"qty":1,"kind":"extrusion","note":"Parallel to and touching the stem on its front face, with both bottoms flush. Supports the crossbar at its top."},
  {"id":"largeBracket","code":"H1","name":"Supported corner bracket","sku":"14057","qty":4,"kind":"hardware","dims":"38 × 38 × 18 mm","basis":"80/20 catalogue specification","note":"Four mounting holes: two on each face. Use one bracket at the upper arm, two at the platform corners and one below the crossbar."},
  {"id":"smallBracket","code":"H2","name":"Compact corner bracket","sku":"14060","qty":1,"kind":"hardware","dims":"18 × 18 × 18 mm","basis":"80/20 catalogue specification","note":"Fits below the crossbar, opposite the larger bracket. Two slotted mounting holes and dual supports."},
  {"id":"plate","code":"H3","name":"Square joining plate","sku":"20-4167","qty":1,"kind":"hardware","dims":"40 × 40 × 4 mm","note":"Four holes on a 20 mm square pattern join the stem and short support. Fasten with four 11-5308 bolts and four 14122 nuts.","basis":"80/20 catalogue specification"},
  {"id":"screw","code":"H4","name":"80/20 black button-head bolt","sku":"11-5308","qty":22,"kind":"hardware","dims":"M5 × 0.8 · 8 mm long","note":"All frame, imaging-platform and box-to-arm black bolts are 80/20 11-5308 (M5 × 8 mm). This assembly uses 22: 16 at four 14057 brackets, 2 at one 14060 bracket and 4 at the joining plate. The consolidated parts list adds 8 platform and 2 arm bolts.","basis":"80/20 11-5308"},
  {"id":"nut","code":"H5","name":"80/20 slide-in T-nut","sku":"14122","qty":22,"kind":"hardware","dims":"9 × 9 × 3 mm · M5","note":"All frame, imaging-platform and box-to-arm T-nuts are 80/20 14122. This assembly uses 22. Add 8 platform and 2 arm nuts for the consolidated total.","basis":"80/20 14122"},
];
// Seat the outer taper at the top edge of the hole; an inferred assembly position.
const coneBaseY=123-(40.64+(G.platform.opening.radius-43.109444444)*50.8/(C.rimOuterDiameter/2-43.109444444));
const stopperBaseY=coneBaseY+(G.stopper.arcRadius-19.170225713)*C.height/(C.rimInnerDiameter/2-19.170225713);
const vaneAboveRimIllustrative=155;
export const platformParameters = {
  acrylicThickness: 3,
  stopperThickness: 3,
  stopperCount: 4,
  stopperCountConfirmed: true,
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
  {"id":"rearPanel","code":"P1","name":"Rear acrylic panel","qty":1,"kind":"acrylic","dims":"420 mm wide · 3 mm thick","basis":"Acrylic design DXF","download":"downloads/imaging-platform-mm.dxf","note":"Rear half of the 420 × 300 mm platform, nearest the stem. Includes the stepped joint, half of the Ø91.39 mm opening and four Ø5.5 mm bolt holes. Cut from 3 mm acrylic."},
  {"id":"frontPanel","code":"P2","name":"Front acrylic panel","qty":1,"kind":"acrylic","dims":"420 mm wide · 3 mm thick","basis":"Acrylic design DXF","download":"downloads/imaging-platform-mm.dxf","note":"Front half of the platform, towards the open ends of the aluminum rails. Shares the stepped seam and circular opening with the rear panel; four Ø5.5 mm mounting holes. Cut from 3 mm acrylic."},
  {"id":"vaneFunnel","code":"P3","name":"Blue trap funnel & collar","qty":1,"kind":"included","dims":"Included in prebuilt blue vane trap","basis":"Purchased trap component","download":null,"source":"https://www.bluevanetraps.com","note":"Funnel and collar included with the BanfieldBio prebuilt blue vane trap. Close the two acrylic platform panels around the funnel. The collection jar and lid are not used in this assembly.","drawing":false},
  {"id":"crossVanes","code":"P4","name":"Blue trap vanes","qty":2,"kind":"included","dims":"Included in prebuilt blue vane trap","basis":"Purchased trap component","source":"https://www.bluevanetraps.com","note":"Two crossed blue vanes included with the BanfieldBio trap. Order one complete trap per camera; the vanes and funnel are included components.","drawing":false},
  {"id":"stoppers","code":"P5","name":"Acrylic stopper inserts","qty":4,"kind":"acrylic","dims":"R53.34 mm · 3 mm thick","basis":"Acrylic design DXF","download":"downloads/vane-stopper-mm.dxf","note":"Four 3 mm acrylic inserts sit inside the funnel, one in each quadrant between the vanes. The rounded outline has a 53.34 mm outer radius and two perpendicular straight edges. Each insert carries one centred blue-and-yellow bullseye."},
  {"id":"pattern","code":"P6","name":"Weatherproof vinyl contrast stickers","qty":1,"kind":"graphic","dims":"420 × 300 mm sheet + insert patches","basis":"Vector artwork","download":"assets/contrast-pattern.svg","note":"Print the green, blue and yellow artwork on adhesive weatherproof vinyl. Use one 420 × 300 mm sheet across the platform seam and four separate stopper patches. Each stopper patch has a complete centred blue ring and yellow centre."},
  {"id":"platformScrews","code":"P7","name":"80/20 black button-head bolt","qty":8,"kind":"hardware","dims":"M5 × 8 mm","basis":"80/20 11-5308 · eight DXF holes","note":"Eight 11-5308 bolts attach the two acrylic panels. Same bolt as the frame and box-to-arm mount; one per platform mounting hole.","sku":"11-5308"},
  {"id":"platformNuts","code":"P8","name":"80/20 slide-in T-nut","sku":"14122","qty":8,"kind":"hardware","dims":"M5 · 20 series","basis":"80/20 14122","note":"Eight 14122 slide-in T-nuts, one per platform bolt. Included in the consolidated 80/20 nut total."},
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
  {"id":"boxBody","code":"B1","name":"Enclosure body","qty":1,"kind":"purchased","dims":"150 × 150 × 90 mm overall","basis":"Product envelope and port layout","source":"https://www.amazon.com/dp/B08KWD8TFY","note":"Zulkit hinged ABS enclosure with lid, mounting screws and cable glands. Hangs below the arm via the outer acrylic plate. Add a centred Ø28 mm cable-access hole to the right body wall. Mouldings, wall taper, hinges and latches are shown schematically."},
  {"id":"boxLid","code":"B2","name":"Drilled enclosure lid","qty":1,"kind":"included","dims":"2 × Ø22 mm added ports","basis":"Port diameters and acrylic datums","note":"Included with the enclosure. Faces down toward the imaging platform, with hinges toward the stem and latches toward the open end of the arm. Locate the camera hole at the midpoint of the internal plate’s inner camera-hole pair; align the other port with the large acrylic clearance hole. Open the lid to inspect the removable electronics assembly."},
  {"id":"boxMount","code":"B3","name":"Outer acrylic mounting plate","qty":1,"kind":"acrylic","dims":"135 × 170 × 3 mm","basis":"Acrylic design DXF","download":"downloads/mount-plate-mm.dxf","note":"Rounded acrylic plate with six Ø5.5 mm holes. Four enclosure screws use the 117 × 116 mm pattern. Two arm fasteners use the central holes, 154 mm apart. The 3 mm plate sits against the underside of the 220 mm extrusion."},
  {"id":"lidGland","code":"B4","name":"Lid cable gland","qty":1,"kind":"included","dims":"Ø22 mm lid port","basis":"Supplied with enclosure · shape schematic","source":"https://www.amazon.com/dp/B08KWD8TFY","note":"Use one gland included with the enclosure in the Ø22 mm lid hole. Its centre aligns with the internal plate’s Ø31.75 mm clearance opening. Gland hardware is shown schematically."},
  {"id":"sideBulkhead","code":"B5","name":"Capped side bulkhead","qty":1,"kind":"purchased","dims":"Ø28 mm wall hole · 27 mm thread","basis":"Port diameter and product specification","source":"https://www.amazon.com/dp/B0DHLLMRRK","note":"PATIKIL PVC bulkhead with screw-on cap, NPT 1/2-inch female × GHT 3/4-inch male. One fitting from a six-pack. Install in a centred Ø28 mm hole on the right body wall. Listed thread diameter is 27 mm; the cap and flange are shown schematically."},
  {"id":"boxScrews","code":"B6","name":"Supplied enclosure screws","qty":4,"kind":"included","dims":"Size supplied with box","basis":"Four included with enclosure","note":"Four larger screws supplied with the enclosure secure the outer acrylic mounting plate. Reuse the supplied screws; no separate purchase or replacement screw size is specified."},
  {"id":"boxArmScrews","code":"B7","name":"80/20 black button-head bolt","sku":"11-5308","qty":2,"kind":"hardware","dims":"M5 × 8 mm","basis":"80/20 mounting hardware","note":"Two 11-5308 bolts through the acrylic tabs into the underside of the 220 mm arm. Same bolt as the frame and imaging platform; included in the consolidated total."},
  {"id":"boxArmNuts","code":"B8","name":"80/20 slide-in T-nut","sku":"14122","qty":2,"kind":"hardware","dims":"M5 · 20 series","basis":"80/20 mounting hardware","note":"Two 14122 slide-in T-nuts, one for each mounting-plate tab. Included in the consolidated total."},
];
export const internalParts = [
  {"id":"piPlate","code":"E1","name":"Internal acrylic Pi plate","qty":1,"kind":"acrylic","dims":"128.499 × 128.499 × 3 mm","basis":"Acrylic design DXF","download":"downloads/internal-plate-mm.dxf","note":"3 mm acrylic plate with thirteen circular holes and three rectangular cutouts. Large cable clearance is Ø31.75 mm; camera holes are Ø2 mm on a 21 × 12.5 mm pattern. Centre the plate in the lid and attach it with five Ø20 mm hook-and-loop pairs."},
  {"id":"aiCamera","code":"E2","name":"Raspberry Pi AI Camera","qty":1,"kind":"purchased","dims":"25 × 24 × 11.9 mm module","basis":"Official module envelope · schematic detail","source":"https://www.raspberrypi.com/products/ai-camera/","note":"The lens faces down through the lid, directly over the vane centre. The acrylic hole pattern locates the module. Board components and lens body are simplified; the reference envelope is 25 × 24 × 11.9 mm."},
  {"id":"cameraScrews","code":"E3","name":"Camera M2 screws","qty":4,"kind":"hardware","dims":"M2","basis":"Assembly specification + DXF holes","note":"Four M2 screws and nuts hold the camera. Place one M2.5 nut and one M2 washer between the acrylic and PCB at each mounting point. Select screws from the Kadrick 660-piece kit with enough length to engage the retaining nuts."},
  {"id":"cameraNuts","code":"E4","name":"Camera M2 nuts","qty":4,"kind":"hardware","dims":"M2","basis":"Assembly specification","note":"One retaining nut per camera screw. Threaded on the electronics side of the camera."},
  {"id":"cameraSpacerNuts","code":"E5","name":"Camera spacer nuts","qty":4,"kind":"hardware","dims":"M2.5 nuts used as spacers","basis":"Assembly specification","note":"One M2.5 nut around each M2 screw, between the acrylic and camera board. These nuts act as spacers; separate M2 nuts retain the screws."},
  {"id":"cameraWashers","code":"E6","name":"Camera spacer washers","qty":4,"kind":"hardware","dims":"M2 washers","basis":"Assembly specification","note":"One M2 washer at each camera mounting point, between the spacer nut and PCB."},
  {"id":"velcro","code":"E7","name":"Circular hook-and-loop pairs","qty":5,"kind":"hardware","dims":"5 pairs · Ø20 mm · black","basis":"Assembly specification","note":"Five paired connections attach the acrylic to the lid: ten adhesive dots. The build uses black dots. The linked white Ø20 mm alternative can serve the same attachment role. Pad placement and compressed thickness are schematic.","source":"https://www.amazon.com/dp/B07XHRYYXJ"},
  {"id":"piZero","code":"E8","name":"Raspberry Pi Zero 2 W","qty":1,"kind":"purchased","dims":"65 × 30 mm PCB","basis":"Official mechanical drawing","note":"Pre-soldered 40-pin GPIO version. Mounted on four brass standoffs at the acrylic Pi hole pattern. Nominal board mounting pitch is 58 × 23 mm; acrylic design pitch is 57.988 × 23.012 mm. Component bodies are simplified.","source":"https://www.adafruit.com/product/6008"},
  {"id":"piStandoffs","code":"E9","name":"Pi brass standoffs","qty":4,"kind":"hardware","dims":"15 mm body + 6 mm male thread","basis":"HELIFOUNER standoff kit","note":"Four HELIFOUNER brass standoffs support the Pi 15 mm above the acrylic. Each has a 6 mm male thread. M2.5 screws secure them from under the acrylic. The OLED end uses 5 mm standoffs as retaining nuts; the opposite end threads into the 20 mm supports."},
  {"id":"plateScrews","code":"E10","name":"Underside M2.5 screws","qty":6,"kind":"hardware","dims":"M2.5 × 6 mm","basis":"4 Pi + 2 RTC mounting points","note":"Six screws from the HELIFOUNER 242-piece kit secure the standoffs from beneath the acrylic: four for the Pi and two for the RTC."},
  {"id":"wittyPi","code":"E11","name":"Witty Pi 4 Mini","qty":1,"kind":"purchased","dims":"65 × 30 mm nominal PCB","basis":"UUGear STEP + product dimensions","note":"Power scheduler above the Pi, supported by two 20 mm brass standoffs at the end opposite the OLED. The shared GPIO header connects it through the Qwiic HAT to the Pi. Major component envelopes follow the UUGear STEP model.","source":"https://www.uugear.com/product/witty-pi-4-mini/"},
  {"id":"wittyStandoffs","code":"E12","name":"Pi-to-Witty brass standoffs","qty":2,"kind":"hardware","dims":"20 mm body + 6 mm male thread","basis":"HELIFOUNER standoff kit","note":"Two HELIFOUNER 20 mm brass supports at the end opposite the OLED. Their 6 mm male threads pass through Witty Pi and receive 5 mm standoffs as retaining nuts. There are no tall supports at the OLED end of the Pi."},
  {"id":"stackHeader","code":"E13","name":"Frienda 2×20 extra-tall stacking header","qty":1,"kind":"purchased","dims":"51 × 5 × 23 mm · 2.54 mm pitch","basis":"Product dimension diagram","note":"One header from an eight-pack. Female sockets fit the Pi GPIO pins; 12 mm male pins pass through the Qwiic HAT into Witty Pi. Overall envelope: 51 × 5 × 23 mm. Pin spacing: 2.54 mm; pin thickness: approximately 0.6 mm.","source":"https://www.amazon.com/dp/B084Q4W1PW"},
  {"id":"qwiicHat","code":"E14","name":"SparkFun Qwiic HAT DEV-14459","qty":1,"kind":"purchased","dims":"52.324 × 22.987 mm PCB","basis":"Official SparkFun Eagle board","note":"Full-size DEV-14459 Qwiic HAT, with four JST SH ports. Shares the 2×20 pins just under Witty Pi and projects outwards beside the Pi. This is the specified HAT, not the Qwiic pHAT. Outline and connector positions come from SparkFun CAD.","source":"https://www.sparkfun.com/sparkfun-qwiic-hat-for-raspberry-pi.html"},
  {"id":"oled","code":"E15","name":"SSD1306 OLED display","qty":1,"kind":"purchased","dims":"0.96 inch · 128 × 64 pixels","basis":"Product specification · schematic PCB","note":"Hosyond blue/yellow I2C OLED, one display from a five-pack. Mount above one end of Witty Pi on 10 mm brass spacers. The PCB outline and hole layout are schematic. Viewed from the screen side with the pin edge at the top, solder black, red, yellow and blue wires from left to right.","source":"https://www.amazon.com/dp/B09C5K91H7"},
  {"id":"oledStandoffs","code":"E16","name":"OLED brass spacers","qty":2,"kind":"hardware","dims":"10 mm brass spacer","basis":"Assembly specification","note":"Two 10 mm brass spacers support the OLED above Witty Pi. Secure the display with M2 bolts from the Kadrick 660-piece kit."},
  {"id":"oledScrews","code":"E17","name":"OLED M2 bolts","qty":2,"kind":"hardware","dims":"M2","basis":"Kadrick 660-piece kit","note":"Two M2 bolts secure the OLED through its 10 mm spacers to Witty Pi. Select length for the assembled joint, allowing secure engagement without bottoming out."},
  {"id":"rtc","code":"E18","name":"Adafruit DS3231 STEMMA QT","qty":1,"kind":"purchased","dims":"25.4 × 17.78 mm PCB","basis":"Official Adafruit Eagle + STEP","note":"External precision RTC, mounted battery-side up on two brass standoffs. Its two Ø3 mm board holes are 20.32 mm apart; the other two nearby acrylic holes remain unused. Two JST SH connectors; one connects to the HAT.","source":"https://www.adafruit.com/product/5188"},
  {"id":"rtcStandoffs","code":"E19","name":"RTC brass standoffs","qty":2,"kind":"hardware","dims":"M2.5 · 10 mm body","basis":"Assembly specification","note":"Two 10 mm brass standoffs support the RTC at its acrylic mounting pattern, leaving clearance for the underside IC. Secure from below with M2.5 screws."},
  {"id":"rtcBattery","code":"E20","name":"CR1220 backup battery","qty":1,"kind":"purchased","dims":"Ø12 × 2 mm · 3 V","basis":"Assembly specification","note":"One Maxell CR1220 in the RTC holder. Purchase one five-pack; only one cell is used per camera.","source":"https://batteriesamerica.com/products/cr1220-5pk"},
  {"id":"microSD","code":"E21","name":"SanDisk Extreme microSDXC","qty":1,"kind":"purchased","dims":"128 GB · microSD","basis":"Assembly specification","note":"One 128 GB microSDXC UHS-I card in the Pi. Select the retail package with an SD adapter; the adapter is a setup accessory and is not mounted in the camera.","source":"https://shop.sandisk.com/products/memory-cards/microsd-cards/sandisk-extreme-uhs-i-microsd?sku=SDSQXA1-128G-GN6MA"},
  {"id":"jstCables","code":"E22","name":"JST SH 4-pin cables","qty":2,"kind":"purchased","dims":"200 mm each · 1 mm pitch","basis":"Assembly specification","note":"Two 200 mm cables: HAT to RTC, and HAT to OLED. The OLED cable has one connector removed and black/red/yellow/blue wires soldered at the display. Curves show connection topology, not measured routing length.","source":"https://www.adafruit.com/product/4401"},
  {"id":"csiCable","code":"E23","name":"Orange CSI camera ribbon","qty":1,"kind":"included","dims":"Pi Zero camera adapter ribbon","basis":"Included with AI Camera","note":"Use the camera-package ribbon with a 22-pin Pi Zero end and 15-pin camera end. Connect the AI Camera to the Pi Zero CSI socket. The orange ribbon route is shown schematically; no separate cable purchase is required.","source":"https://www.raspberrypi.com/products/ai-camera/"},
  {"id":"stackRetainers","code":"E24","name":"5 mm brass retaining standoffs","qty":4,"kind":"hardware","dims":"5 mm body · HELIFOUNER","basis":"Assembly specification","note":"Two 5 mm standoffs act as nuts on the Pi at the OLED end. Two more retain Witty Pi on the tall supports at the opposite end. Threaded portions are schematic; the model shows the 5 mm hex bodies."},
];
export const parts = [...frameParts.map(p=>({...p,assembly:'frame'})),...platformParts.map(p=>({...p,assembly:'platform'})),...enclosureParts.map(p=>({...p,assembly:'enclosure'})),...internalParts.map(p=>({...p,assembly:'internals',cadSource:({piZero:'https://datasheets.raspberrypi.com/rpizero2/raspberry-pi-zero-2-w-mechanical-drawing.pdf',wittyPi:'https://www.uugear.com/repo/WittyPi4/WittyPi4Mini.step',qwiicHat:'https://github.com/sparkfun/Qwiic_Hat_for_Raspberry_Pi',rtc:'https://github.com/adafruit/Adafruit_CAD_Parts/tree/main/5188%20DS3231%20RTC'})[p.id]}))];
export const totalLength = frameParts.filter(p=>p.kind==='extrusion').reduce((sum,p)=>sum+p.length*p.qty,0);
export const sourceURL = sku => `https://8020.net/${sku}.html`;

// Installed spacer body lengths. Units mm.
export const electronicsParameters = {
 piCenterCAD:[28.2067,21.0312],rtcCenterCAD:[-36.3347,-45.2247],
 piStandOff:15,wittyStandOff:20,rtcStandOff:10,oledStandOff:10,retainerLength:5,maleThreadLength:6,
 pcbThickness:1.6,velcroDiameter:20,velcroCount:5,
 headerLength:51,headerWidth:5,headerHeight:23,headerPinLength:12,headerPinWidth:0.6,headerPitch:2.54,
 qwiicWidth:52.324,qwiicDepth:22.987,oledSize:27,
 piAndWittyAndOledHeightsConfirmed:true,rtcHeightConfirmed:true,
};

// Consolidated procurement list. Model part IDs retain location-specific selection,
// while identical purchased hardware appears only once in this list.
export const materialsRelease = {version:'1.0',checked:'2026-09-24'};
const partById=id=>parts.find(p=>p.id===id);
const sumParts=ids=>ids.reduce((n,id)=>n+partById(id).qty,0);
const material=(id,options={})=>{const p=partById(id);return {id,item:p.name,quantity:p.qty,unit:'each',spec:p.length?`${p.length} mm cut · 20 × 20 mm profile`:p.dims,source:p.source||(p.sku?sourceURL(p.sku):''),partId:p.sku||'',download:p.download||'',notes:'',...options};};
export const materialSections = [
 {"id":"aluminum","title":"80/20 aluminum & hardware","scope":"Per camera","note":"Six cut members, 1,870 mm net extrusion. Allow additional stock for saw kerf. All black extrusion bolts use one part number, and all T-nuts use one part number.",items:[
  material('stem',{"item":"20-2020 extrusion · vertical stem"}),
  material('crossbar',{"item":"20-2020 extrusion · platform crossbar"}),
  material('leftRail',{"id":"rails","item":"20-2020 extrusion · platform rails","quantity":2}),
  material('upperArm',{"item":"20-2020 extrusion · upper arm"}),
  material('lowerSupport',{"item":"20-2020 extrusion · short support"}),
  material('largeBracket',{"notes":"Four-hole inside corner bracket with single support. One upper-arm joint, two platform corners and one crossbar support."}),
  material('smallBracket',{"notes":"Two-hole slotted inside corner bracket with dual support. Other crossbar support."}),
  material('plate',{"notes":"Joins the 100 mm support to the stem."}),
  material('screw',{"id":"bolts8020","quantity":sumParts(["screw","platformScrews","boxArmScrews"]),"notes":"11-5308 throughout: 22 frame + 8 imaging platform + 2 box-to-arm. M5 × 8 mm; all black extrusion bolts use this part."}),
  material('nut',{"id":"nuts8020","quantity":sumParts(["nut","platformNuts","boxArmNuts"]),"notes":"14122 throughout: one nut per 11-5308 bolt. Load from the extrusion ends."}),
 ]},
 {"id":"platform-materials","title":"Imaging platform & prebuilt trap","scope":"Per camera","note":"The blue vane trap is purchased prebuilt. Only the custom acrylic parts and sticker artwork need fabrication.",items:[
  material('rearPanel',{"notes":"One rear panel from the platform design DXF."}),
  material('frontPanel',{"notes":"One front panel; the two panels form a 420 × 300 mm platform."}),
  {"id":"blueTrap","item":"BanfieldBio blue vane insect trap","quantity":1,"unit":"assembly","spec":"Includes funnel/collar and crossed vanes","source":"https://www.bluevanetraps.com","notes":"BanfieldBio supplies cases of 24 complete traps. Use one vane/funnel assembly per camera; the collection jar and lid are not installed."},
  material('stoppers',{"notes":"Four custom 3 mm acrylic inserts; one centred blue/yellow bullseye on each."}),
  material('pattern',{"unit":"set","notes":"Adhesive weatherproof vinyl: one 420 × 300 mm platform print plus four stopper patches. Platform fasteners are counted in the 80/20 section."}),
 ]},
 {"id":"enclosure-materials","title":"Weatherproof box & acrylic mounts","scope":"Per camera","note":"The lid, one lid gland and four outer-plate screws come with the enclosure. Do not purchase these a second time.",items:[
  material('boxBody',{"item":"Zulkit hinged weatherproof enclosure","notes":"Includes lid, gasket, supplied cable gland(s) and mounting screws. Add two Ø22 mm lid ports and one centred Ø28 mm side port."}),
  material('lidGland',{"unit":"included","notes":"Use one supplied gland in the lid; included with the enclosure."}),
  material('boxScrews',{"unit":"included","notes":"Use four supplied enclosure screws for the outer acrylic mounting plate."}),
  material('sideBulkhead',{"notes":"One PATIKIL capped fitting from the linked six-pack. Fits the Ø28 mm side hole."}),
  material('boxMount',{"notes":"3 mm acrylic; four box screws plus two 11-5308/14122 pairs already counted above."}),
  material('piPlate',{"notes":"3 mm acrylic, cut from the design DXF."}),
  material('velcro',{"unit":"pairs","notes":"Five mating pairs = ten adhesive dots. Black in the build; the linked white Ø20 mm alternative is suitable."}),
 ]},
 {"id":"electronics-materials","title":"Electronics & installed cables","scope":"Per camera","note":"Quantities are installed per camera, even when the purchase link is a multipack.",items:[
  material('piZero',{"item":"Raspberry Pi Zero 2 W with pre-soldered GPIO header","notes":"Adafruit 6008; pre-soldered 40-pin header."}),
  material('aiCamera',{"notes":"Raspberry Pi AI Camera."}),
  material('microSD',{"notes":"128 GB microSDXC UHS-I; select the package with an SD adapter. Adapter is shared setup equipment."}),
  material('wittyPi',{"notes":"Scheduled power management and real-time clock."}),
  material('qwiicHat',{"notes":"Use full-size DEV-14459, as specified; mounts below Witty Pi on the shared GPIO pins."}),
  material('rtc',{"notes":"Adafruit 5188; separate precision RTC."}),
  material('rtcBattery',{"unit":"cell","notes":"One CR1220 cell installed; linked Maxell package contains five."}),
  material('oled',{"item":"Hosyond SSD1306 OLED display","notes":"0.96 inch, 128 × 64, blue/yellow; one display from the linked five-pack. Board outline is schematic in the viewer."}),
  material('stackHeader',{"notes":"One Frienda header from an eight-pack. 51 × 5 × 23 mm overall; 12 mm male pins, approximately 0.6 mm thick, at 2.54 mm pitch."}),
  material('jstCables',{"notes":"Exactly two 200 mm cables: Qwiic HAT → RTC and Qwiic HAT → OLED. Remove one OLED-end connector; solder black/red/yellow/blue left-to-right at its pin edge."}),
  material('csiCable',{"unit":"included","notes":"Included with the AI Camera package. Use its 22-pin Pi Zero to 15-pin camera ribbon."}),
 ]},
 {"id":"small-hardware-materials","title":"Small fasteners & brass standoffs","scope":"Per camera","note":"These are individual pieces drawn from the assortment kits below. They are separate from the 80/20 hardware.",items:[
  material('piStandoffs',{"notes":"M2.5 HELIFOUNER; four 15 mm bodies with 6 mm male threads."}),
  material('wittyStandoffs',{"notes":"M2.5 HELIFOUNER; two 20 mm bodies with 6 mm male threads, opposite the OLED."}),
  material('stackRetainers',{"notes":"Four 5 mm bodies used as nuts: two on Pi at the OLED end, two on Witty at the opposite end."}),
  material('oledStandoffs',{"notes":"Two 10 mm brass spacers between Witty Pi and OLED."}),
  material('rtcStandoffs',{"notes":"Two M2.5 brass standoffs with 10 mm bodies support the RTC."}),
  material('plateScrews',{"notes":"Six M2.5 × 6 mm screws from the HELIFOUNER kit: four under the Pi mounts, two under the RTC mounts."}),
  {"id":"rtcTopHardware","item":"RTC upper retaining fasteners","quantity":2,"unit":"mounting points","spec":"M2.5 retaining hardware","source":"","notes":"Secure both RTC mounting holes with matching M2.5 retaining hardware from the brass standoff kit."},
  material('cameraScrews',{"notes":"Four M2 screws from the Kadrick kit. Select length to engage the nuts through the acrylic, spacers and PCB."}),
  material('cameraNuts',{"notes":"Four M2 retaining nuts, one per camera screw."}),
  material('cameraSpacerNuts',{"notes":"Four M2.5 nuts used as camera spacers, not as the retaining nuts."}),
  material('cameraWashers',{"notes":"Four M2 washers, one at each camera mounting point."}),
  material('oledScrews',{"notes":"Two M2 bolts from the Kadrick kit; select length for the PCB and 10 mm spacer assembly."}),
 ]},
 {"id":"solar-power","title":"Power option A · solar field setup","scope":"Choose A or B · per camera","note":"Used in the field: Voltaic 50 W panel + 18 Ah battery → 12 V-to-5 V converter → USB-C input on Witty Pi. Power options A and B are alternatives, not cumulative requirements.",items:[
  {"id":"solarKit","item":"Voltaic CORE solar power system","quantity":1,"unit":"kit","partId":"K-P150-V102","spec":"50 W solar panel + 12 V, 18 Ah battery","source":"https://voltaicsystems.com/50-watt-core/","notes":"Includes the panel bracket and integrated battery charge controller. Select the C304 output option listed below."},
  {"id":"solarConverter","item":"Voltaic 12 V-to-5 V USB-C regulator","quantity":1,"unit":"set","partId":"C304","spec":"M16 battery input → regulated USB-C output","source":"https://voltaicsystems.com/C304/","notes":"Connects the CORE battery to the Witty Pi USB-C input. Count once if supplied as the kit’s selected output option."},
 ]},
 {"id":"portable-power","title":"Power option B · lighter battery setup","scope":"Choose A or B · per camera","note":"Portable option: Voltaic V75 USB-A Always On output → USB-C cable → Witty Pi. Recharge the battery between deployments; runtime depends on the camera schedule.",items:[
  {"id":"v75","item":"Voltaic V75 USB battery pack","quantity":1,"unit":"battery","spec":"V75 · USB-A Always On output","source":"https://voltaicsystems.com/v75","notes":"Use a USB-A Always On output and USB-A-to-USB-C cable to power Witty Pi."},
  {"id":"usbPowerCable","item":"USB-A-to-USB-C power cable","quantity":1,"unit":"cable","spec":"V75 USB-A → Witty Pi USB-C","source":"","notes":"One installed cable. Use a suitable included cable if provided; otherwise supply one separately. Choose length for the mounting arrangement."},
 ]},
 {"id":"field-mounting","title":"Field mounting","scope":"Per camera","note":"Two hose clamps secure the camera stem to a T-post driven into the ground. This hardware is separate from the solar panel bracket.",items:[
  {"id":"fieldPost","item":"T-post","quantity":1,"unit":"post","spec":"Ground-driven camera support","source":"","notes":"Choose post length for the site and camera mounting height."},
  {"id":"fieldClamps","item":"Hose clamps","quantity":2,"unit":"clamps","spec":"Clamping range to suit stem plus T-post","source":"","notes":"Two standard hose clamps from a local hardware store; choose a range that fits around the stem and T-post together."},
 ]},
 {"id":"kits-materials","title":"Shared hardware assortments","scope":"Shared stock","note":"Replenish individual sizes as needed. These kits supply the per-camera pieces above and are not additional installed hardware.",items:[
  {"id":"helifounerKit","item":"HELIFOUNER M2.5 brass standoff / screw / nut kit","quantity":1,"unit":"shared kit","spec":"242 pieces · M2.5","source":"https://www.amazon.com/dp/B0B7SNCFF1","notes":"M2.5 brass standoffs, screws and nuts. Includes M2.5 × 6 mm screws. Shared stock for the individual pieces above."},
  {"id":"kadrickKit","item":"Kadrick M2 screw / nut / washer kit","quantity":1,"unit":"shared kit","spec":"660 pieces","source":"https://www.walmart.com/ip/3571165561","notes":"Shared stock for camera and OLED M2 screws, camera retaining nuts and washers."},
 ]},
 {"id":"setup-materials","title":"Shared setup & data transfer","scope":"Shared equipment","note":"Equipment for configuration and data transfer. Shared quantities are not multiplied by the number of cameras.",items:[
  {"id":"computer","item":"Linux laptop or desktop","quantity":1,"unit":"shared","spec":"Ubuntu used by the lab","notes":"A built-in microSD slot works directly; a full-size SD slot works with the card’s adapter.","source":""},
  {"id":"cardReader","item":"USB-C microSD card reader / writer","quantity":1,"unit":"if needed","spec":"Adafruit 5212 · USB-C host port","source":"https://www.adafruit.com/product/5212","notes":"Only needed if the computer has no suitable card slot."},
  {"id":"ssd","item":"Samsung T7 Shield portable SSD","quantity":1,"unit":"shared","spec":"2 TB","source":"https://www.samsung.com/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7-shield-usb-3-2-2tb-black-mu-pe2t0s-am/","notes":"Used for transferring camera data."},
  {"id":"ethernet","item":"Ethernet cable","quantity":1,"unit":"shared","spec":"Cat6 · choose suitable length","source":"https://www.startech.com/en-us/cables/n6patch9yl","notes":"The linked cable is 9 ft."},
  {"id":"hdmi","item":"HDMI-to-mini-HDMI cable","quantity":1,"unit":"shared","spec":"Adafruit 2775 · 1.5 m example","source":"https://www.adafruit.com/product/2775","notes":"For the Pi Zero mini-HDMI output during local setup."},
  {"id":"usbHub","item":"SMAYS micro-USB hub with Ethernet adapter","quantity":1,"unit":"shared","spec":"SMAYS B00L32UUJK","source":"https://www.amazon.com/dp/B00L32UUJK","notes":"Local setup / Ethernet connection to the Pi."},
 ]},
 {"id":"fabrication-materials","title":"Shared fabrication & assembly supplies","scope":"As needed","note":"Use existing equipment or fabrication services for cutting, drilling and wiring.",items:[
  {"id":"drivers","item":"Hex key and small screwdrivers","quantity":1,"unit":"shared set","spec":"3 mm hex drive for 11-5308; bits matching small screws","source":"","notes":"Assembly of the extrusion and electronics hardware."},
  {"id":"cutting","item":"Extrusion and acrylic cutting / deburring","quantity":"As needed","unit":"service or tools","spec":"Cut six extrusion members; cut 3 mm acrylic to design DXFs","source":"","notes":"Allow saw kerf and acrylic nesting waste. Fabrication can be outsourced."},
  {"id":"drilling","item":"Enclosure drilling tools","quantity":1,"unit":"shared set","spec":"22 mm and 28 mm holes","source":"","notes":"Two lid ports and one side port; mounting datums are documented in the drawings."},
  {"id":"soldering","item":"Soldering equipment and solder","quantity":"As needed","unit":"shared supplies","spec":"OLED cable termination","source":"","notes":"Includes wire stripping/cutting tools for the four soldered OLED leads."},
 ]},
];
export const materialRows=materialSections.flatMap(section=>section.items.map(item=>({...item,section:section.id,category:section.title,scope:section.scope,status:item.unit==='included'?'Included':section.scope.startsWith('Shared')?'Shared':section.scope==='As needed'?'As needed':'Per camera'})));
