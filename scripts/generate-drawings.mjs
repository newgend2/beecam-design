import {writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {frameParts as parts,parameters as P,sourceURL} from '../docs/js/data.js';
const out=fileURLToPath(new URL('../docs/',import.meta.url));
await mkdir(out+'drawings',{recursive:true});await mkdir(out+'downloads',{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const line=(x1,y1,x2,y2,cl='line')=>`<line class="${cl}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const rect=(x,y,w,h,cl='part')=>`<rect class="${cl}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const txt=(x,y,text,cl='text',anchor='start')=>`<text class="${cl}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`;
function dh(x1,x2,y,from,label){return line(x1,from,x1,y+7,'ext')+line(x2,from,x2,y+7,'ext')+line(x1,y,x2,y,'dim')+txt((x1+x2)/2,y-9,label,'text','middle');}
function dv(y1,y2,x,from,label){return line(from,y1,x+7,y1,'ext')+line(from,y2,x+7,y2,'ext')+line(x,y1,x,y2,'dim')+`<text class="text" transform="translate(${x-10},${(y1+y2)/2}) rotate(-90)" text-anchor="middle">${esc(label)}</text>`;}
function svg(title,subtitle,body,w=900,h=370){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 10 0 L 0 5 L 10 10" fill="none" stroke="#246c80" stroke-width="1.5"/></marker></defs><style>text{font-family:Arial,sans-serif;fill:#27424f}.title{font-size:22px;font-weight:600}.small{font-size:12px;fill:#667e89}.text{font-size:14px}.caption{font-size:13px;letter-spacing:1px;fill:#5f7885}.line{stroke:#587785;stroke-width:1.3;fill:none}.part{stroke:#3b6273;stroke-width:1.5;fill:#edf3f6}.ext{stroke:#8da5af;stroke-width:.8}.dim{stroke:#246c80;stroke-width:1;marker-start:url(#arrow);marker-end:url(#arrow)}.pending{stroke:#8c7029;stroke-dasharray:6 4;stroke-width:1.5;fill:#fff7df}.hole{stroke:#466e80;stroke-width:1.5;fill:white}</style><rect width="100%" height="100%" fill="white"/>${txt(35,39,title,'title')}${txt(35,63,subtitle,'small')}${body}${line(35,h-43,w-35,h-43,'ext')}${txt(35,h-21,'BEECAM · FRAME REV 0.1 · ALL DIMENSIONS mm · DO NOT SCALE','small')}${txt(w-35,h-21,'REFERENCE DRAWING','small','end')}</svg>`;}
for(const p of parts){let body='';
 if(p.kind==='extrusion'){
  const scale=.86,x=75,y=145,w=p.length*scale;
  body=rect(x,y,w,20*.86)+line(x,y+6,x+w,y+6)+line(x,y+11,x+w,y+11)+dh(x,x+w,112,y,p.length)+dv(y,y+17.2,45,x,'20')+txt(x,206,'SIDE VIEW','caption');
  body+=rect(730,133,60,60)+rect(754,133,12,18)+rect(754,175,12,18)+rect(730,157,18,12)+rect(772,157,18,12)+`<circle class="hole" cx="760" cy="163" r="6"/>`+dh(730,790,107,133,'20')+dv(133,193,820,790,'20')+txt(712,226,'END VIEW','caption');
  body+=txt(75,264,`Quantity ${p.qty} · 80/20 20-2020 · square-cut ends`)+txt(75,289,'20 × 20 envelope and cut length specified; slot and bore details are schematic.','small');
 }else if(p.id==='largeBracket'||p.id==='smallBracket'){
  const size=p.id==='largeBracket'?38:18,s=3.4,x=110,y=130,d=size*s;
  body+=`<path class="part" d="M${x},${y}v${d}h${d}v-10H${x+10}V${y}Z"/><path class="line" d="M${x+10},${y+10}L${x+d-5},${y+d-10}"/>`+dh(x,x+d,100,y,size)+dv(y,y+d,77,x,size)+txt(x,y+d+27,'SIDE ENVELOPE','caption');
  body+=rect(445,133,18*s,d)+dh(445,445+18*s,106,133,'18')+txt(537,158,p.id==='largeBracket'?'4 holes total':'2 slotted holes total')+txt(537,183,p.id==='largeBracket'?'2 per mounting face':'1 per mounting face')+txt(537,208,p.id==='largeBracket'?'Single support':'Dual supports');
  body+=txt(537,252,'Hole geometry and casting details omitted.','small')+txt(537,274,'See linked manufacturer CAD before fabrication.','small');
 }else if(p.id==='plate'){
  const x=110,y=110,s=3.6,d=40*s;body=rect(x,y,d,d);
  for(const a of [10,30])for(const b of [10,30])body+=`<circle class="hole" cx="${x+a*s}" cy="${y+b*s}" r="${5.56*s/2}"/>`;
  body+=dh(x,x+d,85,y,'40')+dv(y,y+d,76,x,'40')+dh(x+10*s,x+30*s,282,y+d,'20 centres');
  body+=rect(414,110,4*s,d)+dh(414,414+4*s,85,110,'4')+txt(508,145,'4 × Ø5.56 through holes')+txt(508,176,'20 × 20 hole-centre pattern')+txt(508,207,'10 mm edge-to-centre offset')+txt(508,258,'Recommended plate hardware: M5 × 10 mm.','small');
 }else if(p.id==='screw'){
  body=rect(170,163,160,50)+`<path class="part" d="M170 139Q117 139 117 188Q117 237 170 237Z"/>`;
  for(let x=183;x<330;x+=12)body+=line(x,166,x-9,210,'ext');
  body+=dh(170,330,119,163,'8 (under head)')+dv(139,237,80,117,'Ø9.32 head')+txt(445,159,'M5 × 0.8 thread')+txt(445,192,'Head height: 2.63')+txt(445,225,'Hex drive: 3')+txt(445,265,'Thread and head profiles are schematic.','small');
 }else if(p.id==='nut'){
  body=rect(120,118,135,135)+`<circle class="hole" cx="187.5" cy="185.5" r="37.5"/>`+dh(120,255,89,118,'9')+dv(118,253,83,120,'9')+rect(390,118,135,45)+dv(118,163,558,525,'3')+txt(120,287,'FRONT','caption')+txt(390,200,'SIDE','caption')+txt(618,166,'M5 × 0.8')+txt(618,193,'Through thread');
 }
 await writeFile(out+`drawings/${p.id}.svg`,svg(`${p.code} / ${p.name}`,`${p.sku} · ${p.kind==='extrusion'?'Designer-supplied cut length':'80/20 catalogue dimensions · schematic geometry'}`,body));
}
let body='';const s=.68,fy=555,fx=265,sx=825;
const front=(x,y,w,h,cl='part')=>rect(fx+x*s,fy-(y+h)*s,w*s,h*s,cl);
const side=(z,y,w,h,cl='part')=>rect(sx+z*s,fy-(y+h)*s,w*s,h*s,cl);
body+=txt(110,105,'FRONT','caption')+front(-10,0,20,570)+front(-210,100,420,20)+front(-210,100,20,20)+front(190,100,20,20)+front(-10,0,20,100);
body+=front(-10,570-P.upperArmTopGap-20,20,20,'pending')+dh(fx-210*s,fx+210*s,595,fy-100*s,'420')+dv(fy-570*s,fy,fx-255*s,fx-10*s,'570');
body+=txt(680,105,'SIDE','caption')+side(-10,0,20,570)+side(10,0,20,100)+side(10,100,20,20)+side(30,100,280,20)+side(10,570-P.upperArmTopGap-20,220,20,'pending');
body+=dh(sx+10*s,sx+230*s,fy-(570-P.upperArmTopGap)*s-30,fy-(570-P.upperArmTopGap)*s,'220')+dh(sx+30*s,sx+310*s,595,fy-100*s,'280')+dv(fy-100*s,fy,sx-46, sx+10*s,'100');
body+=txt(715,145,'Dashed: upper-arm height pending','small');
const px=265,py=651,ps=.49;const plan=(x,z,w,d)=>rect(px+x*ps,py+z*ps,w*ps,d*ps);
body+=txt(110,631,'PLAN / PLATFORM MEMBERS','caption')+plan(-210,10,420,20)+plan(-210,30,20,280)+plan(190,30,20,280)+plan(-10,-10,20,20)+dh(px-210*ps,px+210*ps,827,py+310*ps,'420');
body+=txt(650,684,'CONNECTIONS','caption')+txt(650,713,'100 mm support and stem: bottoms flush.')+txt(650,739,'Crossbar rests on top of the short support.')+txt(650,765,'Corner alignment and hardware positions are photo-inferred.')+txt(650,805,'Slots and brackets omitted for clarity.','small');
await writeFile(out+'drawings/assembly.svg',svg('01 / Aluminum frame','Orthographic arrangement · six 20 × 20 mm extrusion members',body,1200,900));
const csvCell=x=>'"'+String(x).replaceAll('"','""')+'"';
const rows=[['reference','part','manufacturer','part_id','cut_length_mm','quantity','quantity_status','notes','product_url'],...parts.map(p=>[p.code,p.name,'80/20',p.sku,p.length||'',p.qty,p.kind==='extrusion'?'designer supplied':'provisional',p.note,sourceURL(p.sku)])];
await writeFile(out+'downloads/frame-materials.csv',rows.map(r=>r.map(csvCell).join(',')).join('\n')+'\n');
await writeFile(out+'downloads/frame-dimensions.json',JSON.stringify({units:'mm',revision:'0.1',parameters:P,parts},null,2)+'\n');
console.log(`Generated ${parts.length+1} SVG drawings, materials CSV, and dimension data.`);
