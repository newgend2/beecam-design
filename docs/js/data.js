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
export const parts = [
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
export const totalLength = parts.filter(p=>p.kind==='extrusion').reduce((sum,p)=>sum+p.length*p.qty,0);
export const sourceURL = sku => `https://8020.net/${sku}.html`;
