import {writeFile} from 'node:fs/promises';
import G from '../docs/js/enclosure-geometry.js';
import {enclosureParameters as P} from '../docs/js/data.js';
const out=new URL('../docs/drawings/',import.meta.url);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const t=(x,y,s,cl='label',anchor='start')=>`<text x="${x}" y="${y}" class="${cl}" text-anchor="${anchor}">${esc(s)}</text>`;
const l=(x1,y1,x2,y2,cl='edge')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cl}"/>`;
const dh=(x1,x2,y,from,label)=>l(x1,from,x1,y+5,'ext')+l(x2,from,x2,y+5,'ext')+l(x1,y,x2,y,'dim')+t((x1+x2)/2,y-8,label,'label','middle');
const dv=(y1,y2,x,from,label)=>l(from,y1,x+5,y1,'ext')+l(from,y2,x+5,y2,'ext')+l(x,y1,x,y2,'dim')+`<text class="label" transform="translate(${x-10},${(y1+y2)/2}) rotate(-90)" text-anchor="middle">${esc(label)}</text>`;
const circle=(x,y,r,cl='hole')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cl}"/>`;
const poly=pts=>`<path class="part" d="${pts.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')}Z"/>`;
const rect=(x,y,w,h,r=0,cl='part')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${cl}"/>`;
const drawing=(title,sub,body,h=680)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h}" viewBox="0 0 1000 ${h}" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M10 0L0 5L10 10" fill="none" stroke="#246c80"/></marker></defs><style>text{font-family:Arial,sans-serif;fill:#27424f}.title{font-size:22px;font-weight:600}.label{font-size:14px}.small{font-size:12px;fill:#657c86}.part{fill:#edf3f6;stroke:#3b6273;stroke-width:1.3}.hole{fill:white;stroke:#3b6273;stroke-width:1}.edge{stroke:#3b6273;stroke-width:1;fill:none}.ext{stroke:#8da5af;stroke-width:.8}.dim{stroke:#246c80;stroke-width:1;marker-start:url(#arrow);marker-end:url(#arrow)}.dash{fill:none;stroke:#b38838;stroke-dasharray:5 4;stroke-width:1}</style><rect width="100%" height="100%" fill="white"/>${t(35,40,title,'title')}${t(35,65,sub,'small')}${body}${l(35,h-42,965,h-42,'ext')}${t(35,h-20,'BEECAM · REV 0.3 · DIMENSIONS mm · DO NOT SCALE','small')}${t(965,h-20,'REFERENCE ONLY','small','end')}</svg>`;
const put=async(id,title,sub,b,h)=>writeFile(new URL(id+'.svg',out),drawing(title,sub,b,h));
const plan=d=>poly(d.outline)+d.cutouts.map(pts=>`<path class="hole" d="${pts.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')}Z"/>`).join('')+d.holes.map(h=>circle(...h.center,h.radius)).join('');
let b=`<g transform="translate(285 325) scale(2 -2)">${plan(G.mount)}</g>`;
b+=dh(150,420,115,155,'135')+dv(155,495,110,150,'170')+l(285,133,285,517,'dash');
b+=t(520,150,'3 mm acrylic · confirmed')+t(520,188,'6 × Ø5.5 through holes')+t(520,226,'4 box screws: 117 × 116 hole pattern')+t(520,264,'2 arm screws: 154 centre spacing');
b+=t(520,318,'Coordinates from plate centre:')+t(520,347,'Box: (±58.5, ±58.0)')+t(520,376,'Arm: (0, ±77.0)')+t(520,418,'Rounded edges follow the supplied DXF.')+t(520,455,'Plate sits between box and arm underside.');
b+=t(75,551,'Original drawing notice: SOLIDWORKS Educational Product. For Instructional Use Only.','small');
await put('boxMount','B3 / External enclosure mounting plate','Exact supplied millimetre DXF · geometry-only CAD download available',b,625);
// Interior plate retains original CAD orientation and centre datum.
b=`<g transform="translate(275 290) scale(2.45 -2.45)">${plan(G.internal)}</g>`;
b+=dh(117.588,432.412,102,132.588,'128.499')+dv(132.588,447.412,80,117.588,'128.499');
b+=t(510,125,'3 mm acrylic · confirmed')+t(510,157,'Source units: inches; converted ×25.4')+t(510,202,'Camera cutout: 12.7 × 22.86')+t(510,234,'Camera holes: 4 × Ø2, pitch 21 × 12.5')+t(510,266,'Cable clearance: Ø31.75')+t(510,298,'Other cutouts: 10 × 10 and 10.16 × 7.62');
b+=t(510,345,'Lid camera centre: (0, 41.032)')+t(510,377,'Lid gland centre: (37.325, −37.325)')+t(510,409,'These lid holes are Ø22, not Ø31.75.');
b+=t(75,486,'HOLE COORDINATES · CAD DATUM AT PLATE CENTRE','small');
const holes=G.internal.holes;
for(let col=0;col<2;col++){
 const x=75+col*450;b+=t(x,513,'X')+t(x+130,513,'Y')+t(x+260,513,'Diameter');
 holes.slice(col*7,(col+1)*7).forEach((h,i)=>{const y=540+i*27;b+=t(x,y,h.center[0].toFixed(3))+t(x+130,y,h.center[1].toFixed(3))+t(x+260,y,(2*h.radius).toFixed(3));});
}
b+=t(75,763,'All 13 circular holes and all 3 rectangular cutouts retained. R3.81 outside corners.','small')+t(75,790,'Plate centring in lid and support-pad spacing inferred from photos; confirm before drilling.','small');
await put('piPlate','E1 / Internal acrylic Pi plate','Exact source plan · camera port uses the inner mounting-hole pair midpoint',b,870);
await put('internalsAssembly','04 / Acrylic and camera layout','Plan in source DXF orientation · camera faces down through the lid',b,870);
// Exterior lid face, mirrored relative to internal DXF as viewed from outside.
b=rect(100,155,360,360,14)+l(280,140,280,530,'dash')+l(85,335,475,335,'dash');
for(const [name,p]of Object.entries(G.lidPorts)){const x=280-p.center[0]*2.4,y=335-p.center[1]*2.4;b+=circle(x,y,26.4)+l(x-8,y,x+8,y,'ext')+l(x,y-8,x,y+8,'ext');}
b+=dh(100,460,112,155,'150 overall')+dv(155,515,65,100,'150 overall');
b+=t(525,150,'EXTERIOR LID VIEW')+t(525,184,'Latch / camera edge shown at top')+t(525,224,'Camera: Ø22 at X75, Y116.032')+t(525,256,'Cable: Ø22 at X37.675, Y37.675')+t(525,293,'Datum: bottom-left of 150 × 150 envelope')+t(525,334,'Port locations derived from centred Pi plate.')+t(525,366,'Confirm plate-to-lid registration before drilling.')+t(525,412,'Camera port is the midpoint of the inner')+t(525,438,'camera bolt-hole pair, not the rectangle centre.');
b+=t(100,555,'Hinge, latch and rounded-shell details are schematic.','small');
await put('boxLid','B2 / Modified enclosure lid','Two added Ø22 mm ports · lens and included cable gland',b,635);
let body=rect(100,160,300,180,10)+circle(250,238,28)+dh(100,400,120,160,'150 nominal envelope')+dv(160,340,65,100,'90 overall');
body+=l(100,316,400,316,'dash')+t(100,370,'RIGHT SIDE · not a moulding section','small');
body+=t(495,160,'Zulkit enclosure · 150 × 150 × 90')+t(495,200,'Side access: Ø28, centred on body wall')+t(495,240,'Four back holes align to B3: 117 × 116')+t(495,280,'Included lid closes the downward-facing opening')+t(495,340,'Lid split and 3 mm walls are illustrative.')+t(495,380,'Purchased shell geometry is not fabrication CAD.');
await put('boxBody','B1 / Weatherproof enclosure body','Product envelope; added holes specified by designer',body,520);
let assembly=rect(95,115,340,6,1)+rect(240,75,50,40,0)+rect(115,121,300,180,10)+l(115,277,415,277,'dash');
assembly+=rect(130,280,270,6,0)+l(310,265,310,460,'dash')+rect(280,270,60,4,0)+circle(310,290,8);
assembly+=t(470,95,'220 mm arm')+t(470,132,'3 mm outer acrylic mounting plate')+t(470,178,'90 mm enclosure height')+t(470,223,'Internal plate: 3 mm acrylic')+t(470,265,'Camera optical axis points down')+t(470,307,'Lens aligned above vane centre (confirmed)');
assembly+=t(100,410,'ASSEMBLED SIDE STACK · SPACING SCHEMATIC','small')+t(100,455,'Port and plate geometry use CAD; lid depth, pads and camera spacers remain approximate.','small')+t(100,485,'Whole-camera box position still inherits the provisional upper-arm height.','small');
await put('enclosureAssembly','03 / Enclosure mounting and camera alignment','Box top attaches beneath upper arm; lid faces imaging platform',assembly,570);
for(const [id,title,sub,lines]of [
 ['lidGland','B4 / Included lid cable gland','One gland used from enclosure kit',['Panel hole: Ø22','Internal acrylic clearance: Ø31.75','Centre shared with large DXF hole','Compression cap, nut and seal: schematic']],
 ['sideBulkhead','B5 / Capped side access fitting','PATIKIL PVC bulkhead · one fitting used',['Panel hole: Ø28','Nominal thread outside diameter: 27','NPT 1/2-inch female × GHT 3/4-inch male','Cap and overall projection: schematic']],
 ['boxScrews','B6 / Supplied enclosure mounting screws','Four screws included with purchased enclosure',['Quantity: 4','Hole pattern: 117 × 116','Acrylic clearance holes: Ø5.5','Screw diameter and length: to confirm']],
 ['cameraScrews','E3 / Camera mounting hardware','Four mounting points; screw and spacer specifications pending',['Quantity: 4 mounting locations','Plate holes: Ø2','Hole pattern: 21 × 12.5','Screw length and spacer height: to confirm']],
 ]){
  let v=id.includes('Screws')?rect(130,195,170,18)+rect(110,182,20,44,5):rect(125,185,145,65,12)+rect(175,168,35,99,2)+rect(240,177,50,82,8);
  lines.forEach((line,i)=>v+=t(430,155+i*45,line));
  v+=t(90,345,'Schematic hardware silhouette; not a manufacturing drawing.','small');await put(id,title,sub,v,430);
}
let cam=rect(120,160,250,240,20);
for(const x of [140,350])for(const y of [180,305])cam+=circle(x,y,11);
cam+=rect(185,245,120,120,4)+circle(245,305,45)+circle(245,305,28);
cam+=dh(120,370,115,160,'25')+dv(160,400,80,120,'24');
cam+=t(470,155,'Module envelope: 25 × 24 × 11.9')+t(470,195,'Four board mounting holes: Ø2.2 nominal')+t(470,235,'Plate holes: Ø2 from supplied DXF')+t(470,275,'Pitch: 21 × 12.5')+t(470,335,'Optical axis follows designer’s inner-row datum.')+t(470,375,'Components and lens body are schematic.');
await put('aiCamera','E2 / Raspberry Pi AI Camera','Reference envelope from Raspberry Pi; installed position from designer CAD',cam,500);
console.log('Generated enclosure, port, acrylic and camera reference drawings.');
