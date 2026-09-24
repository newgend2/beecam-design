import C from './cone-geometry.js';
import G from './platform-geometry.js';
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
  vaneHeightIllustrative: 240,
  vaneWidthIllustrative: 130,
  vaneThicknessIllustrative: 2.54,
  stopperBaseYIllustrative: stopperBaseY,
};
export const platformParts = [
  {id:'rearPanel',code:'P1',name:'Rear acrylic panel',qty:1,kind:'acrylic',dims:'420 mm wide · 3 mm thick',basis:'Supplied DXF + confirmed thickness',download:'downloads/imaging-platform-mm.dxf',note:'Rear half of the 420 × 300 mm platform, nearest the stem. The stepped joint, half of the Ø91.39 mm opening, and four Ø5.5 mm bolt holes come from the supplied DXF. Acrylic thickness confirmed as 3 mm.'},
  {id:'frontPanel',code:'P2',name:'Front acrylic panel',qty:1,kind:'acrylic',dims:'420 mm wide · 3 mm thick',basis:'Supplied DXF + confirmed thickness',download:'downloads/imaging-platform-mm.dxf',note:'Front half of the platform, towards the open ends of the aluminum rails. Shares the stepped seam and circular opening with the rear panel; four Ø5.5 mm mounting holes. Acrylic thickness confirmed as 3 mm.'},
  {id:'vaneFunnel',code:'P3',name:'Blue funnel & collar',qty:1,kind:'purchased',dims:'Ø139.7 rim × 91.44 mm high',basis:'Supplied Inventor cone CAD',download:'downloads/vane-cone-mm.stl',source:'https://www.bluevanetraps.com/',note:'Revolved profile extracted from the supplied vane cone Inventor file and validated as a closed shape through STEP conversion. Includes the lower collar and hollow outlet. Rim diameter 139.7 mm; overall height 91.44 mm. Vertical placement assumes the taper seats at the top of the Ø91.39 mm platform opening; confirm this fit on the physical trap. Small moulded features absent from the source CAD are not added.'},
  {id:'crossVanes',code:'P4',name:'Crossed blue vanes',qty:2,kind:'purchased',dims:'Illustrative envelope',basis:'Photo approximation · CAD pending',source:'https://www.bluevanetraps.com/',note:'Two perpendicular blue vanes above the funnel. The current representation is a photo-based placeholder. Exact outline, slots, thickness and attachment features await the original CAD model.'},
  {id:'stoppers',code:'P5',name:'Acrylic stopper inserts',qty:4,kind:'acrylic',dims:'R53.34 mm · 3 mm thick',basis:'Supplied DXF · quantity pending',download:'downloads/vane-stopper-mm.dxf',note:'Each supplied outline is a rounded quadrant with a 53.34 mm outer radius and two perpendicular straight edges. Converted from the DXF’s inch units at 25.4 mm/in. Thickness confirmed as 3 mm. Four copies are shown provisionally; quantity and installed height need confirmation.'},
  {id:'pattern',code:'P6',name:'High-contrast sticker',qty:1,kind:'graphic',dims:'420 × 300 mm sheet + insert patches',basis:'Supplied SVG',download:'assets/contrast-pattern.svg',note:'Uses the actual supplied green, blue and yellow vector artwork at its 420 × 300 mm page size. The platform shares one continuous pattern across the seam. Additional patches cover the stopper inserts; their pattern registration is illustrative.'},
  {id:'platformScrews',code:'P7',name:'Platform screws',qty:8,kind:'hardware',dims:'M5 · length to confirm',basis:'Eight DXF mounting holes',note:'One screw per Ø5.5 mm platform hole. Screw length has not been specified for the 3 mm acrylic panels. Eight screws are shown schematically; confirm length and thread engagement before ordering.'},
  {id:'platformNuts',code:'P8',name:'Platform slide-in nuts',sku:'14122',qty:8,kind:'hardware',dims:'M5 · 20 series',basis:'Frame hardware inferred',note:'Eight slide-in nuts, one per platform screw. The viewer uses the same 14122 M5 nut as the frame; verify this part ID for the platform hardware.'},
];
export const parts = [...frameParts.map(p=>({...p,assembly:'frame'})),...platformParts.map(p=>({...p,assembly:'platform'}))];
export const totalLength = frameParts.filter(p=>p.kind==='extrusion').reduce((sum,p)=>sum+p.length*p.qty,0);
export const sourceURL = sku => `https://8020.net/${sku}.html`;
