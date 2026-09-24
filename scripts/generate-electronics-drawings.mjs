import {writeFile} from 'node:fs/promises';
import {internalParts,electronicsParameters as E} from '../docs/js/data.js';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const text=(x,y,s,c='label',anchor='start')=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x,y,a,b,c='edge')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" class="${c}"/>`;
const rect=(x,y,w,h,fill='#ecf2f4',r=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="#466571"/>`;
const circle=(x,y,r,fill='white')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#466571"/>`;
const dh=(x1,x2,y,from,s)=>line(x1,from,x1,y+6,'ext')+line(x2,from,x2,y+6,'ext')+line(x1,y,x2,y,'dim')+text((x1+x2)/2,y-8,s,'label','middle');
const dv=(y1,y2,x,from,s)=>line(from,y1,x+6,y1,'ext')+line(from,y2,x+6,y2,'ext')+line(x,y1,x,y2,'dim')+`<text class="label" transform="translate(${x-10} ${(y1+y2)/2}) rotate(-90)" text-anchor="middle">${esc(s)}</text>`;
function wrap(s,x,y,max=65){const words=s.split(' ');let rows=[''];for(const w of words){if((rows.at(-1)+' '+w).length>max)rows.push('');rows[rows.length-1]+=(rows.at(-1)?' ':'')+w;}return rows.map((r,i)=>text(x,y+i*21,r,'small')).join('');}
function svg(title,sub,b,h=640){return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h}" viewBox="0 0 1000 ${h}" role="img" aria-label="${esc(title)}"><defs><marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M10 0L0 5L10 10" fill="none" stroke="#28758a"/></marker></defs><style>text{font-family:Arial,sans-serif;fill:#25424f}.title{font-size:22px;font-weight:bold}.label{font-size:14px}.small{font-size:12px;fill:#59717d}.edge{stroke:#466571;stroke-width:1.2;fill:none}.ext{stroke:#8da5af;stroke-width:.8}.dim{stroke:#28758a;stroke-width:1;marker-start:url(#a);marker-end:url(#a)}</style><rect width="100%" height="100%" fill="white"/>${text(35,40,title,'title')}${text(35,67,sub,'small')}${b}${line(35,h-42,965,h-42,'ext')}${text(35,h-20,'BEECAM · REV 1.0 · DIMENSIONS mm · REFERENCE ONLY','small')}${text(965,h-20,'NOT A FABRICATION DRAWING','small','end')}</svg>`;}
const save=(id,title,sub,b,h)=>writeFile(new URL(`../docs/drawings/${id}.svg`,import.meta.url),svg(title,sub,b,h));
const boards={piZero:[30,65,23,58,2.75,'#bbddc5'],wittyPi:[30,65,23,58,2.75,'#bec8ca'],qwiicHat:[22.987,52.324,0,0,0,'#f5c5c9'],oled:[27,27,23,23,2.2,'#c5dfed'],rtc:[25.4,17.78,20.32,0,3,'#bec8ca']};
for(const p of internalParts.filter(p=>!['piPlate','aiCamera'].includes(p.id))){
 let b='';const spec=boards[p.id];
 if(spec){const [w,d,px,py,hole,c]=spec,k=Math.min(5,300/d),x=255-w*k/2,y=165;
  b=rect(x,y,w*k,d*k,c,10)+dh(x,x+w*k,y-32,y,`${w}${p.id==='oled'?' ≈':''}`)+dv(y,y+d*k,x-36,x,`${d}${p.id==='oled'?' ≈':''}`);
  if(px)for(const dx of [-px/2,px/2])for(const dy of py?[-py/2,py/2]:[6.35])b+=circle(255+dx*k,y+d*k/2-dy*k,hole*k/2);
  if(p.id==='oled')b+=rect(x+2*k,y+4*k,23*k,19*k,'#202d3c',2);
  if(p.id==='rtc')b+=circle(255,y+d*k/2,6*k,'#d4dadd');
  if(['piZero','wittyPi'].includes(p.id))b+=rect(x+1*k,y+7*k,5*k,51*k,'#35434b',1);
  if(p.id==='qwiicHat')for(let i=0;i<4;i++)b+=rect(x+2*k,y+(12+i*8.89)*k,5*k,6*k,'#35434b',1);
  b+=text(490,158,'BOARD PLAN / INSTALLED ORIENTATION')+text(490,192,p.dims)+text(490,231,px?`Mounting pitch: ${px}${py?' × '+py:''}`:'2×20 shared GPIO connection');
  b+=text(490,266,p.id==='rtc'?'2 × Ø3 board holes; battery side faces inward':px?`Nominal board holes: Ø${hole}`:'4 Qwiic ports along the outer edge');
  b+=wrap(p.note,490,310,61);
 }else if(p.id==='velcro'){
  b=circle(220,235,85,'#343b40')+dh(135,305,365,320,'Ø20')+rect(140,420,160,10,'#343b40')+rect(140,432,160,10,'#343b40')+text(135,473,'Paired side view · thickness approximate','small');
  b+=text(450,158,'5 paired connections / 10 individual dots')+text(450,196,'One dot on acrylic; mating dot on lid')+wrap(p.note,450,245);
 }else if(p.id==='rtcBattery'){
  b=circle(220,225,75,'#d5dddf')+text(220,240,'+','title','middle')+dh(145,295,343,300,'Ø12')+rect(145,388,150,25,'#d5dddf')+dv(388,413,110,145,'2');b+=text(460,160,'CR1220 · 3 V · one cell per RTC')+wrap(p.note,460,210);
 }else if(p.id==='stackHeader'){
  const k=5,x=115,y=170,w=E.headerLength*k,housing=(E.headerHeight-E.headerPinLength)*k,pin=E.headerPinLength*k;
  b=text(x,110,'SOCKET PLAN','small')+rect(x,y,w,E.headerWidth*k,'#394950',1);
  for(let row=0;row<2;row++)for(let i=0;i<20;i++)b+=rect(x+w/2+(i-9.5)*E.headerPitch*k-2,y+E.headerWidth*k/2+(row-.5)*E.headerPitch*k-2,4,4,'#d0b761',0);
  b+=dh(x,x+w,140,y,'51')+dv(y,y+E.headerWidth*k,85,x,'5')+text(x,263,'SIDE VIEW','small')+rect(x,300,w,housing,'#394950',1);
  for(let i=0;i<20;i++)b+=rect(x+w/2+(i-9.5)*E.headerPitch*k-E.headerPinWidth*k/2,300+housing,E.headerPinWidth*k,pin,'#d0b761',0);
  b+=dv(300,300+housing+pin,85,x,'23 overall')+dv(300+housing,300+housing+pin,410,x+w,'12 pins');
  b+=text(490,150,'2 rows × 20 pins · 2.54 mm pitch')+text(490,186,'Pin thickness: approximately 0.6')+text(490,222,'Female socket onto Pi GPIO')+text(490,258,'Male pins through HAT to Witty Pi')+wrap(p.note,490,310,61);
 }else if(['csiCable','jstCables'].includes(p.id)){
  b=rect(105,206,70,40,'#394950')+rect(342,206,70,40,'#394950');for(let i=0;i<4;i++)b+=`<path d="M175 ${217+i*6} C225 ${140+i*6} 290 ${292+i*6} 342 ${217+i*6}" stroke="${p.id==='csiCable'?'#cb881e':['#202429','#c23545','#d5b832','#3579b0'][i]}" stroke-width="5" fill="none"/>`;
  b+=text(470,160,p.dims)+wrap(p.note,470,211,61);
  if(p.id==='jstCables')b+=text(105,350,'OLED pin edge, viewed from screen side:')+text(105,384,'BLACK  /  RED  /  YELLOW  /  BLUE')+text(105,433,'2 cables / 2 installed routes','small');
 }else if(p.id==='microSD'){
  b=rect(140,150,165,225,'#263440',8)+rect(140,150,165,80,'#c74d50',8)+text(222,208,'128 GB','title','middle')+dh(140,305,433,375,'11 nominal')+dv(150,375,103,140,'15 nominal');b+=text(470,162,'128 GB microSDXC UHS-I')+wrap(p.note,470,220);
 }else{
  const standoff=p.id.toLowerCase().includes('standoff')||p.id==='stackRetainers',isNut=p.id.includes('Nuts'),washer=p.id.includes('Washers');
  const h=({piStandoffs:E.piStandOff,wittyStandoffs:E.wittyStandOff,rtcStandoffs:E.rtcStandOff,oledStandoffs:E.oledStandOff,stackRetainers:E.retainerLength})[p.id];
  if(standoff)b=rect(175,180,100,180,'#dbc78b')+rect(210,360,30,55,'#dbc78b')+circle(225,125,50,'#dbc78b')+circle(225,125,15)+dv(180,360,132,175,`${h} body`);
  else if(isNut||washer)b=circle(225,230,75,'#c4ced3')+circle(225,230,30)+text(225,350,washer?'M2 washer':p.id==='cameraSpacerNuts'?'M2.5 spacer nut':'M2 retaining nut','label','middle');
  else b=rect(100,216,42,64,'#bac5ca')+rect(142,233,225,30,'#bac5ca')+text(100,332,p.id==='plateScrews'?'M2.5 × 6 mm':'Select length to suit joint','small');
  b+=text(455,160,`${p.qty} used · ${p.dims}`)+wrap(p.note,455,207,64)+text(455,386,'Allow secure engagement without bottoming out.','small');
 }
 await save(p.id,`${p.code} / ${p.name}`,p.basis,b);
}
// Combined assembly: installed layout, side stack, and explicit cable topology.
let b=text(60,110,'ACRYLIC PLAN · electronics side')+text(590,110,'STACK SECTION · not to scale');
const k=2.7,cx=260,cy=325;
b+=rect(cx-64.25*k,cy-64.25*k,128.5*k,128.5*k,'#edf5f6',12);
const boardPlan=(x,v,w,d,color,label)=>rect(cx+x*k-w*k/2,cy+v*k-d*k/2,w*k,d*k,color,4)+text(cx+x*k,cy+v*k,label,'small','middle');
b+=boardPlan(-28.2067,21.0312,30,65,'#badcc7','Pi / Witty')+boardPlan(-46.9832,21.0312,22.987,52.324,'#efc5cd','HAT')+boardPlan(-28.2067,3.5312,27,27,'#c3dceb','OLED')+boardPlan(36.3347,-45.2247,25.4,17.78,'#c6d0d4','RTC')+boardPlan(0,44.532,25,24,'#badcc7','Camera');
b+=circle(cx-37.3253*k,cy-37.3253*k,15.875*k)+text(cx-37.3253*k,cy-37.3253*k,'Gland','small','middle');
for(const [x,v]of [[-13,-53],[53,-53],[53,0],[53,53],[-53,53]])b+=circle(cx+x*k,cy+v*k,10*k,'#3b4247');
b+=dh(cx-64.25*k,cx+64.25*k,538,499,'128.499')+text(70,577,'5 × Ø20 hook-and-loop pairs; pad locations approximate.','small');
for(const [y,w,label,color]of [[462,280,'3 mm acrylic','#dbe9eb'],[390,160,'Pi Zero 2 W','#badcc7'],[267,160,'Witty Pi 4 Mini','#c6d0d4'],[288,115,'Qwiic HAT','#efc5cd'],[212,95,'OLED','#c3dceb']])b+=rect(600,y,w,8,color)+text(770,y-6,label,'small');
for(const x of [615,745])b+=rect(x,398,8,64,'#dbc78b');
b+=rect(745,275,8,115,'#dbc78b')+rect(745,250,8,17,'#dbc78b')+rect(615,373,8,17,'#dbc78b');
b+=rect(615,220,8,47,'#dbc78b')+dv(398,462,569,600,'15')+dv(275,390,569,600,'20')+dv(220,267,569,600,'10');
b+=text(590,520,'5 mm retainers: Pi at OLED end; Witty at other end.','small')+text(590,550,'RTC standoffs: 10 mm body length.','small');
b+=line(50,609,950,609,'ext')+text(60,644,'CONNECTIONS');
const entries=['Pi GPIO → 2×20 female header → Qwiic HAT → Witty Pi','Qwiic HAT → 200 mm JST SH → DS3231 + CR1220','Qwiic HAT → 200 mm JST SH → soldered OLED pins','AI Camera → orange CSI adapter ribbon → Pi Zero'];
entries.forEach((s,i)=>b+=text(80,680+i*32,s));
b+=text(80,830,'OLED order (screen side, pin edge above): black · red · yellow · blue','small')+text(80,857,'2 cables. HELIFOUNER 242-piece brass kit; Kadrick 660-piece M2 kit.','small');
await save('internalsAssembly','04 / Internal electronics assembly','Board envelopes, acrylic mounting datums and installed standoff lengths',b,930);
console.log('Generated electronics reference drawings, hardware cards and assembly wiring layout.');
