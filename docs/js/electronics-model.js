import * as THREE from '../vendor/three.module.js';
import {electronicsParameters as E} from './data.js?v=da3b2fb6589e';
// Board outlines use manufacturer dimensions; confirmed and estimated heights live in data.js.
export function addElectronics({group,mesh,addLabel,plateY,centerZ,roundedRect,flat,hole,ring,cyl,box,cameraHoles,cameraY}){
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.48,...extra});
 const green=material(0x166a45),black=material(0x182224),red=material(0xb82037),blue=material(0x226a94),gold=material(0xc6a250,{metalness:.7}),silver=material(0xbac3c5,{metalness:.7}),white=material(0xe4ece5),glass=material(0x101d2a,{metalness:.3,roughness:.15});
 const top=plateY+3,z=centerZ,piX=-E.piCenterCAD[0],piZ=z+E.piCenterCAD[1],rtcX=-E.rtcCenterCAD[0],rtcZ=z+E.rtcCenterCAD[1];
 const piY=top+E.piStandOff,wittyY=piY+E.pcbThickness+E.wittyStandOff,qwiicY=wittyY-4.6,rtcY=top+E.rtcStandOff,oledY=wittyY+E.pcbThickness+E.oledStandOff;
 const create=(id,pos,explode,label,offset=[55,-22])=>{const g=group(id,pos,explode,true);if(label)addLabel(id,g,pos,offset);return g;};
 const piHoles=[[-11.5062,-28.9941],[11.5062,-28.9941],[-11.5062,28.9941],[11.5062,28.9941]];
 const hex=(g,x,y,v,h,r=2.5,ri=1.25)=>{const s=new THREE.Shape();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=r*Math.cos(a),py=r*Math.sin(a);i?s.lineTo(px,py):s.moveTo(px,py);}s.closePath();hole(s,0,0,ri);flat(s,h,g,[x,y,v],gold);};
 const screw=(g,x,y,v,r=1.25,h=6)=>{cyl(g,r,h,[x,y+h/2,v],silver);cyl(g,r*1.9,1.5,[x,y-.75,v],silver);box(g,[r*2.6,.15,.4],[x,y-1.52,v],black);};
 const pcb=(g,w,d,holes,mat,thickness=1.6)=>{const s=roundedRect(w,d,2);for(const h of holes)hole(s,h[0],h[1],h[2]||1.375);flat(s,thickness,g,[0,0,0],mat);for(const [x,v,r=1.375] of holes)ring(g,r+.7,r,.08,[-x,thickness,v],gold);};
 // Text labels are surface markings; disabled in geometry-only Node validation.
 const marking=(g,text,width,depth,pos,color='#dfe9d7')=>{
  if(typeof document==='undefined')return;
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.clearRect(0,0,512,128);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 44px monospace';ctx.fillText(text,256,64);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide});
  const m=mesh(new THREE.PlaneGeometry(width,depth),mat,g,pos);m.rotation.x=-Math.PI/2;
 };
 const pads=create('velcro',[0,plateY,z],[0,-80,-15]);
 const padLocations=[[-13,-53],[53,-53],[53,0],[53,53],[-53,53]];
 for(const [x,v]of padLocations){cyl(pads,10,1.4,[x,-.75,v],black);cyl(pads,10,1.4,[x,-2.25,v],black);}
 const pi=create('piZero',[piX,piY,piZ],[-25,-125,0],true,[-65,-25]);pcb(pi,30,65,piHoles,green);
 // Ports face inward toward the camera. CSI connector is at the rear short edge.
 box(pi,[12,1.8,13],[1,2.5,1],black);marking(pi,'RP3A0',9,3,[1,3.45,1]);
 for(const v of [-8,4]){box(pi,[6,3.2,8],[13,3.1,v],silver);box(pi,[.3,1.9,5.9],[16.1,3.2,v],black);}
 box(pi,[7,4.3,11],[12,3.6,22],silver);box(pi,[.3,2.6,8],[15.6,3.6,22],black);
 box(pi,[17,2.5,4],[0,2.85,-31],white);box(pi,[15,.6,1],[0,4.4,-32],black);
 box(pi,[13,1.6,13],[0,-.8,26],silver);
 // Pi male GPIO, with the separate female stacking connector fitted above it.
 box(pi,[5.08,2.54,50.8],[-11.5,2.87,0],black);
 for(let row=0;row<2;row++)for(let i=0;i<20;i++)box(pi,[.64,6,.64],[-12.77+row*2.54,7.1,(i-9.5)*2.54],gold);
 for(let i=0;i<13;i++){box(pi,[1.6,.6,1],[6,1.95,-23+i*3.2],silver);box(pi,[1,.8,1.4],[8,2.05,-22+i*3.2],black);}
 marking(pi,'ZERO 2 W',20,3,[0,1.7,-18]);
 const sd=create('microSD',[piX,piY-1.7,piZ+29],[-25,-117,24]);box(sd,[11,1,15],[0,0,0],black);box(sd,[10,.15,6],[0,-.57,3],red);marking(sd,'128',8,3,[0,.57,3]);
 const piSupports=create('piStandoffs',[piX,top,piZ],[-25,-105,0]);
 for(const [x,v]of piHoles){hex(piSupports,x,0,v,E.piStandOff);cyl(piSupports,1.25,6,[x,E.piStandOff+3,v],gold);}
 const under=create('plateScrews',[0,plateY,z],[0,-75,0]);
 for(const [x,v]of piHoles)screw(under,piX+x,-.1,piZ-z+v);
 const rtcMounts=[[-10.16,6.35],[10.16,6.35]];
 for(const [x,v]of rtcMounts)screw(under,rtcX+x,-.1,rtcZ-z+v);
 const posts=create('wittyStandoffs',[piX,piY+1.6,piZ],[-25,-145,0]);for(const [x,v]of piHoles.filter(p=>p[1]>0)){hex(posts,x,0,v,E.wittyStandOff);cyl(posts,1.25,6,[x,E.wittyStandOff+3,v],gold);}
 const retainers=create('stackRetainers',[piX,piY+1.6,piZ],[-25,-160,0]);
 for(const [x,v]of piHoles)hex(retainers,x,v<0?0:E.wittyStandOff+1.6,v,E.retainerLength);
 const witty=create('wittyPi',[piX,wittyY,piZ],[-25,-180,0],true,[-55,5]);pcb(witty,30,65,piHoles,black);
 box(witty,[5.1,3.5,50.8],[-11.5,3.35,0],black);
 for(let row=0;row<2;row++)for(let i=0;i<20;i++){box(witty,[1.1,.15,1.1],[-12.77+row*2.54,5.13,(i-9.5)*2.54],gold);box(witty,[.6,.16,.6],[-12.77+row*2.54,5.22,(i-9.5)*2.54],black);}
 // Major package envelopes follow the manufacturer's STEP component locations.
 for(const [cx,cv,w,d,h]of [[5.1,19.72,6,8.8,1.7],[-4.6,-12.37,4.9,5.78,1.45],[5.58,-3.17,5.78,4.9,1.45],[5.3,3.38,1.5,6.9,1.4]])box(witty,[w,h,d],[cx,1.6+h/2,cv],black);
 box(witty,[6.8,3.18,8.94],[12.5,3.19,-21.3],silver);box(witty,[.25,1.5,6.5],[16,3.2,-21.3],black);
 box(witty,[4.06,1.5,6.1],[.2,2.35,29.2],silver);box(witty,[2,1,2],[.2,3.6,29.2],gold);
 for(let i=0;i<12;i++){box(witty,[1,.6,1.8],[8,1.95,-10+i*2.6],silver);box(witty,[1.6,.6,.8],[4,1.95,-9+i*2.6],gold);}
 marking(witty,'WITTY PI 4 MINI',19,3,[2,1.75,11]);
 const header=create('stackHeader',[piX-11.5,piY+4.2,piZ],[-45,-153,0],false);
 const housingHeight=E.headerHeight-E.headerPinLength;
 box(header,[E.headerWidth,housingHeight,E.headerLength],[0,housingHeight/2,0],black);
 for(let row=0;row<2;row++)for(let i=0;i<20;i++)box(header,[E.headerPinWidth,E.headerPinLength,E.headerPinWidth],[(row-.5)*E.headerPitch,housingHeight+E.headerPinLength/2,(i-9.5)*E.headerPitch],gold);
 // DEV-14459: outline 52.324 x 22.987, GPIO at the inner long edge.
 const qx=piX-11.5-7.2765;
 const hat=create('qwiicHat',[qx,qwiicY,piZ],[-70,-163,0],true,[-85,25]);pcb(hat,E.qwiicDepth,E.qwiicWidth,[],red);
 for(let row=0;row<2;row++)for(let i=0;i<20;i++)ring(hat,.85,.42,.1,[7.2765-1.27+row*2.54,1.6,(i-9.5)*2.54],gold);
 for(let i=0;i<20;i++)ring(hat,.8,.43,.1,[-2.6,1.6,(i-9.5)*2.54],silver);
 const portZ=[-13.462,-4.572,4.318,13.2088];
 for(const v of portZ){box(hat,[5,3,6],[-6.4135,-1.5,v],black);box(hat,[.25,1.8,4.6],[-9,-1.5,v],white);}
 marking(hat,'QWIIC HAT',19,3,[-1.5,1.72,17.8]);
 const oledZ=piZ-17.5;
 const oled=create('oled',[piX,oledY,oledZ],[-25,-215,-12],true,[65,-20]);
 pcb(oled,27,27,[[-11.5,-11.5,1.1],[11.5,-11.5,1.1],[-11.5,11.5,1.1],[11.5,11.5,1.1]],blue,1.2);
 box(oled,[23,1.3,20],[0,1.85,0],glass);box(oled,[20,.05,3],[0,2.53,-7],material(0x282717));
 box(oled,[12,.3,3],[0,1.4,11],black);marking(oled,'SSD1306',16,2.5,[0,1.35,11.7]);
 const oledSupports=create('oledStandoffs',[piX,wittyY+1.6,oledZ],[-25,-197,-12]);
 const oledBolts=create('oledScrews',[piX,wittyY,oledZ],[-25,-229,-12]);
 for(const x of [-11.5,11.5]){
  hex(oledSupports,x,0,-11.5,E.oledStandOff,2.2,1.05);
  // Heads sit above the OLED; illustrative shanks enter the brass spacers below.
  const y=oledY-wittyY+1.2;
  cyl(oledBolts,1,10,[x,y-5,-11.5],silver);cyl(oledBolts,1.9,1.5,[x,y+.75,-11.5],black);
  box(oledBolts,[2.5,.15,.4],[x,y+1.52,-11.5],silver);
 }
 const rtc=create('rtc',[rtcX,rtcY,rtcZ],[45,-132,-20],true,[65,-5]);pcb(rtc,25.4,17.78,rtcMounts.map(([x,v])=>[x,v,1.5]),black,1.57);
 // Board is inverted in the assembly: battery holder above, IC and JST below.
 box(rtc,[7.6,2.4,10],[.318,-1.2,-1.4],black);
 for(const x of [-10.16,10.16]){box(rtc,[4.95,2.96,6],[x,-1.48,0],black);box(rtc,[.15,1.8,4],[x+Math.sign(x)*2.5,-1.5,0],white);}
 ring(rtc,6.8,6.1,1.3,[0,1.57,0],silver);box(rtc,[18,.6,4],[0,4.2,0],silver);
 for(let i=0;i<8;i++)ring(rtc,.85,.4,.12,[(i-3.5)*2.54,1.57,-6.35],gold);
 marking(rtc,'DS3231',13,2,[0,1.73,7.4]);
 const battery=create('rtcBattery',[rtcX,rtcY+2.65,rtcZ],[45,-145,-20]);cyl(battery,6,2,[0,0,0],silver);marking(battery,'+',5,5,[0,1.04,0]);
 const rtcSupports=create('rtcStandoffs',[rtcX,top,rtcZ],[45,-111,-20]);for(const [x,v]of rtcMounts)hex(rtcSupports,x,0,v,E.rtcStandOff);
 // Camera screws, nuts, spacer nuts and washers are separate selectable items.
 const camScrews=create('cameraScrews',[0,plateY,z],[0,-145,-15]);
 const camNuts=create('cameraNuts',[0,cameraY+1.12,z],[0,-157,-15]);
 const camSpacers=create('cameraSpacerNuts',[0,top,z],[0,-125,-15]);
 const camWashers=create('cameraWashers',[0,top+2,z],[0,-130,-15]);
 for(const h of cameraHoles){const x=-h.center[0],v=h.center[1];screw(camScrews,x,0,v,1,9);hex(camSpacers,x,0,v,2,2.5,1.25);ring(camWashers,2.5,1.1,.3,[x,0,v],silver);hex(camNuts,x,0,v,1.6,2.2,1);}
 // All paths use installed coordinates and follow the lid as one rigid assembly.
 const wires=create('jstCables',[0,0,0],[0,-175,-10],false);
 const tube=(g,pts,r,mat)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),50,r,6,false),mat,g,[0,0,0]);
 addLabel('jstCables',wires,[-36,top+53,z-38],[70,35]);
 const wireColors=[0x191e24,0xbc2938,0xe0c84b,0x265ba3];
 const rtStart=[qx-10,qwiicY-1.5,piZ+portZ[2]],rtEnd=[rtcX-12.7,rtcY-1.4,rtcZ];
 for(let i=0;i<4;i++){const dx=(i-1.5)*.65;tube(wires,[[rtStart[0],rtStart[1],rtStart[2]+dx],[-60+dx,top+45,z+7],[-36+dx,top+53,z-38],[10+dx,top+30,z-45],[rtEnd[0],rtEnd[1],rtEnd[2]+dx]],.34,material(wireColors[i]));}
 tube(wires,[[-57,top+45,z+7],[-36,top+53,z-38],[10,top+30,z-45]],1.45,black);
 // Left-to-right pin order is defined looking at the screen with its pin edge above it.
 for(let i=0;i<4;i++){const x=piX+(i-1.5)*2.54,ez=oledZ-12.4;ring(oled,1,.5,.1,[(i-1.5)*2.54,1.21,-12.4],gold);tube(wires,[[qx-10,qwiicY-1.5,piZ-4.572+i*.6],[qx-15-i*.5,piY+4,piZ-9],[piX+17+i,top+39,oledZ-2],[x,oledY+2,ez]],.38,material(wireColors[i]));}
 const ribbon=create('csiCable',[0,0,0],[25,-164,-5],false);
 addLabel('csiCable',ribbon,[4,top+55,z-8],[70,0]);
 const pts=[[0,cameraY+2.8,z+54],[0,top+15,z+30],[4,top+55,z-8],[-1,top+56,z-36],[piX,piY+7,piZ-37],[piX,piY+3,piZ-32]];
 const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),positions=[],uv=[],indices=[];
 for(let i=0;i<=90;i++){const p=curve.getPoint(i/90),w=16-(i/90)*4;positions.push(p.x-w/2,p.y,p.z,p.x+w/2,p.y,p.z);uv.push(0,i/90,1,i/90);if(i<90){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,material(0xd88c1a,{side:THREE.DoubleSide,metalness:.25}),ribbon,[0,0,0]);
 for(let i=0;i<8;i++){const d=(i-3.5)*1.1;tube(ribbon,pts.map(p=>[p[0]+d,p[1]+.07,p[2]]),.055,gold);}
 return {piY,wittyY,qwiicY,rtcY,oledY,velcroPairs:5,rtcStandoffs:2,tallSupports:2,retainers:4,oledWireOrder:['black','red','yellow','blue'],routedJstCables:2};
}
