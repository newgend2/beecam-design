import C from './cone-geometry.js?v=9506fc6a12d4';
import G from './platform-geometry.js?v=9506fc6a12d4';
import E from './enclosure-geometry.js?v=9506fc6a12d4';
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
  internalStandOffIllustrative:3, cameraStandOffIllustrative:2,
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
  {id:'piPlate',code:'E1',name:'Internal acrylic Pi plate',qty:1,kind:'acrylic',dims:'128.499 × 128.499 × 3 mm',basis:'Supplied DXF + confirmed thickness',download:'downloads/internal-plate-mm.dxf',note:'Exact supplied outline, thirteen circular holes and three rectangular cutouts, converted from inches at 25.4 mm/in. Large clearance hole is Ø31.75 mm. Camera mounting holes are Ø2 mm on a 21 × 12.5 mm pattern. The plate is shown centred in the lid, supported above it by photo-inferred hook-and-loop pads; installed spacing and retaining details remain provisional.'},
  {id:'aiCamera',code:'E2',name:'Raspberry Pi AI Camera',qty:1,kind:'purchased',dims:'25 × 24 × 11.9 mm module',basis:'Official module envelope · schematic detail',source:'https://www.raspberrypi.com/products/ai-camera/',note:'Lens faces down through the lid and directly over the vane centre, as confirmed by the designer. Module envelope comes from Raspberry Pi; mounting position comes from the supplied acrylic DXF. Board components, lens body and mounting spacers are simplified. Other control and power electronics will be added in the next pass.'},
  {id:'cameraScrews',code:'E3',name:'Camera mounting hardware',qty:4,kind:'hardware',dims:'4 mounting points · size to confirm',basis:'Four DXF camera holes',note:'Four screw/spacer locations are shown at the camera plate holes. Screw specification, spacers and installed height require confirmation; the displayed fasteners are schematic.'},
];
export const parts = [...frameParts.map(p=>({...p,assembly:'frame'})),...platformParts.map(p=>({...p,assembly:'platform'})),...enclosureParts.map(p=>({...p,assembly:'enclosure'})),...internalParts.map(p=>({...p,assembly:'internals'}))];
export const totalLength = frameParts.filter(p=>p.kind==='extrusion').reduce((sum,p)=>sum+p.length*p.qty,0);
export const sourceURL = sku => `https://8020.net/${sku}.html`;
