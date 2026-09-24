import {writeFile,mkdir} from 'node:fs/promises';
import {platformParameters as P} from '../docs/js/data.js';
import G from '../docs/js/platform-geometry.js';
import {stopperCentroid} from '../docs/js/platform-shapes.js';
const out=new URL('../docs/',import.meta.url);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,cl='label',anchor='start')=>`<text x="${x}" y="${y}" class="${cl}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,cl='edge')=>`<line class="${cl}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const dh=(x1,x2,y,from,label)=>line(x1,from,x1,y+6,'ext')+line(x2,from,x2,y+6,'ext')+line(x1,y,x2,y,'dim')+text((x1+x2)/2,y-9,label,'label','middle');
const dv=(y1,y2,x,from,label)=>line(from,y1,x+6,y1,'ext')+line(from,y2,x+6,y2,'ext')+line(x,y1,x,y2,'dim')+`<text class="label" transform="translate(${x-9},${(y1+y2)/2}) rotate(-90)" text-anchor="middle">${esc(label)}</text>`;
const circle=(cx,cy,r)=>`<circle class="hole" cx="${cx}" cy="${cy}" r="${r}"/>`;
const path=d=>`<path class="part" d="${d}"/>`;
const svg=(title,sub,body,height=650)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-label="${esc(title)}"><defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M10 0L0 5L10 10" fill="none" stroke="#246c80"/></marker></defs><style>text{font-family:Arial,sans-serif;fill:#27424f}.title{font-size:22px;font-weight:600}.label{font-size:14px}.small{font-size:12px;fill:#657c86}.part{fill:#edf3f6;stroke:#3b6273;stroke-width:1.3}.hole{fill:white;stroke:#3b6273;stroke-width:1}.edge{stroke:#3b6273;stroke-width:1;fill:none}.ext{stroke:#8da5af;stroke-width:.8}.dim{stroke:#246c80;stroke-width:1;marker-start:url(#arr);marker-end:url(#arr)}.dash{stroke:#a18443;stroke-width:1;stroke-dasharray:5 4;fill:none}</style><rect width="100%" height="100%" fill="white"/>${text(35,40,title,'title')}${text(35,64,sub,'small')}${body}${line(35,height-42,965,height-42,'ext')}${text(35,height-20,'BEECAM · PLATFORM REV 1.0 · DIMENSIONS mm · DO NOT SCALE','small')}${text(965,height-20,'REFERENCE DRAWING','small','end')}</svg>`;
const put=async(id,title,sub,body,h)=>writeFile(new URL(`drawings/${id}.svg`,out),svg(title,sub,body,h));
await mkdir(new URL('drawings/',out),{recursive:true});
// Exact plan boundary in source coordinates. Flip source Y for the drawing.
const panel=rear=>`M0 ${rear?300:0}H420V130H350V145H255.695A45.695 45.695 0 0 ${rear?1:0} 164.305 145H70V130H0Z`;
for(const id of ['platformAssembly','rearPanel','frontPanel']){
 const assembly=id==='platformAssembly',rear=id==='rearPanel';
 let b=`<g transform="translate(100 480) scale(1 -1)">${assembly?path(panel(true))+path(panel(false)):path(panel(rear))}`;
 for(const h of G.platform.boltHoles)if(assembly||(h.center[1]>130)===rear)b+=circle(...h.center,h.radius);
 b+='</g>'+dh(100,520,135,180,'420')+dv(assembly?180:rear?180:335,assembly?480:rear?350:480,65,100,assembly?'300':rear?'170 max':'145 max');
 b+=line(310,290,575,235,'ext')+text(590,233,assembly?'Ø91.39 opening':'R45.695 opening cutout');
 b+=text(590,270,'Opening centre: X210, Y145')+text(590,295,'Datum: lower-left of assembled plan');
 b+=text(590,335,`${assembly?8:4} × Ø5.5 through holes`)+text(590,360,'Hole columns: X10 and X410');
 b+=text(590,385,assembly?'Rows: Y10, 120, 140, 290':rear?'Rows: Y140, 290':'Rows: Y10, 120');
 b+=text(590,425,`Acrylic thickness: ${P.acrylicThickness}`)+text(590,450,'Stepped seam: Y130 / Y145');
 b+=text(590,475,'Step positions: X70 and X350');
 b+=text(100,518,'NEAR STEM / REAR = TOP OF PLAN','small')+text(100,546,assembly?'Two panels form one continuous 420 × 300 surface.':'Coordinates refer to the assembled platform datum.','small');
 await put(id,assembly?'02 / Imaging platform plan':`${rear?'P1 / Rear':'P2 / Front'} acrylic panel`,'Acrylic design DXF · 3 mm thickness',b);
}
let b=`<g transform="translate(135 425) scale(4 -4)">${path('M1.27 53.324878809L1.27 1.27L53.324878809 1.27A53.34 53.34 0 0 1 1.27 53.324878809Z')}</g>`;
b+=line(135,425,286,274,'dim')+text(225,310,'R53.34')+dh(140.08,348.2995,465,419.92,'52.055 straight edge');
b+=text(490,180,'3 mm acrylic')+text(490,220,'Arc centre at the vane-axis intersection')+text(490,255,'Straight cuts offset 1.27 from each axis')+text(490,290,'Nominal gap between opposite inserts: 2.54');
b+=text(490,345,'Source DXF uses inches; converted ×25.4.')+text(490,385,'Four inserts per camera.')+text(490,420,'Centre one blue/yellow vinyl bullseye on each insert.','small');
await put('stoppers','P5 / Acrylic stopper insert','One rounded quadrant · design outline converted to mm',b,560);
// One full bullseye at the area centroid of the exact stopper outline.
const [cx,cy]=stopperCentroid(),r=G.stopper.arcRadius;
const stopperSVG=`<svg xmlns="http://www.w3.org/2000/svg" width="${r}mm" height="${r}mm" viewBox="0 0 ${r} ${r}" role="img" aria-label="Stopper sticker: centred blue and yellow bullseye"><g transform="translate(0 ${r}) scale(1 -1)"><path fill="#00d400" d="M1.27 53.324878809L1.27 1.27L53.324878809 1.27A${r} ${r} 0 0 1 1.27 53.324878809Z"/><circle fill="#0000ff" cx="${cx}" cy="${cy}" r="${P.stopperBullseyeOuterRadius}"/><circle fill="#ffff32" cx="${cx}" cy="${cy}" r="${P.stopperBullseyeInnerRadius}"/></g></svg>`;
await writeFile(new URL('assets/stopper-contrast.svg',out),stopperSVG+'\n');
console.log('Generated custom acrylic platform drawings and stopper artwork.');
