import * as THREE from '../vendor/three.module.js';
import G from './enclosure-geometry.js?v=9506fc6a12d4';
import {enclosureParameters as P} from './data.js?v=9506fc6a12d4';

export function plateShape(data){
  const shape=new THREE.Shape(data.outline.map(p=>new THREE.Vector2(...p)));
  for(const pts of data.cutouts)shape.holes.push(new THREE.Path(pts.map(p=>new THREE.Vector2(...p))));
  for(const h of data.holes){const hole=new THREE.Path();hole.absarc(...h.center,h.radius,0,Math.PI*2,true);shape.holes.push(hole);}
  return shape;
}
export function roundedRect(w,h,r=5){
  const s=new THREE.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
export function addEnclosure({partGroup,mesh,bolt,addLabel}){
  const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.44,metalness:0,...extra});
  const white=material(0xe7ebea),black=material(0x202629),metal=material(0xbfc2b9,{metalness:.6});
  const clear=material(0x95cdd8,{transparent:true,opacity:.30,depthWrite:false,side:THREE.DoubleSide});
  const green=material(0x1a6044),gold=material(0xcfaa51,{metalness:.5});
  const z=P.centerZ,backY=P.mountTopY-P.mountThickness,lidY=backY-P.height,seamY=lidY+P.lidDepthIllustrative;
  const groups=[],moving=[];
  const group=(id,pos,explode,lid=false)=>{const g=partGroup(id,pos,explode);groups.push(g);if(lid)moving.push(g);return g;};
  const box=(g,size,pos,mat=white)=>mesh(new THREE.BoxGeometry(...size),mat,g,pos);
  const extrude=(shape,t)=>new THREE.ExtrudeGeometry(shape,{depth:t,bevelEnabled:false,curveSegments:32});
  // CAD X is mirrored for the exterior lid view; CAD Y points toward the front.
  const flat=(shape,t,g,pos,mat=white)=>{const geo=extrude(shape,t);geo.rotateX(-Math.PI/2);geo.rotateY(Math.PI);return mesh(geo,mat,g,pos);};
  const hole=(shape,x,y,r)=>{const h=new THREE.Path();h.absarc(x,y,r,0,Math.PI*2,true);shape.holes.push(h);};
  const ring=(g,ro,ri,h,pos,mat=black,sides=64)=>{const s=new THREE.Shape();s.absarc(0,0,ro,0,Math.PI*2);hole(s,0,0,ri);const geo=extrude(s,h);geo.rotateX(-Math.PI/2);return mesh(geo,mat,g,pos);};
  const cyl=(g,r,h,pos,mat=black,n=48)=>mesh(new THREE.CylinderGeometry(r,r,h,n),mat,g,pos);
  const body=group('boxBody',[0,backY,z],[0,65,0]);
  const back=roundedRect(135,135,5);for(const h of G.mount.holes.filter(h=>h.center[0]!==0))hole(back,...h.center,h.radius);
  flat(back,3,body,[0,-3,0]);
  box(body,[3,75,129],[-66,-40.5,0]);
  for(const s of [-1,1])box(body,[135,75,3],[0,-40.5,s*66]);
  // Real hole through the right-hand wall, centred in the enclosure body.
  const side=roundedRect(129,75,1);hole(side,0,1.5,14);
  const sideGeo=extrude(side,3);sideGeo.rotateY(Math.PI/2);mesh(sideGeo,white,body,[64.5,-40.5,0]);
  const flange=roundedRect(150,150,6);flange.holes.push(new THREE.Path(roundedRect(129,129,4).getPoints(32)));
  flat(flange,3,body,[0,-78,0]);
  const seal=roundedRect(147,147,5);seal.holes.push(new THREE.Path(roundedRect(139,139,3).getPoints(32)));
  flat(seal,1,body,[0,-79,0],black);
  // Corner bosses beneath the four mounting screws.
  for(const h of G.mount.holes.filter(h=>h.center[0]!==0))ring(body,5,2.75,13,[-h.center[0],-16,h.center[1]],white);
  const mount=group('boxMount',[0,backY,z],[0,105,0]);flat(plateShape(G.mount),3,mount,[0,0,0],clear);
  const screws=group('boxScrews',[0,backY,z],[0,125,0]);
  for(const h of G.mount.holes.filter(h=>h.center[0]!==0)){
    const x=-h.center[0],v=h.center[1];cyl(screws,4.8,2.8,[x,4.4,v],metal);cyl(screws,2.5,12,[x,-3,v],metal);
    box(screws,[5,.15,.9],[x,5.85,v],black);box(screws,[.9,.15,5],[x,5.85,v],black);
  }
  const armScrews=group('boxArmScrews',[0,backY,z],[0,135,0]);
  for(const h of G.mount.holes.filter(h=>h.center[0]===0))bolt(armScrews,[0,0,h.center[1]],[0,-1,0],'boxArmScrews','boxArmNuts',8);
  const lid=group('boxLid',[0,lidY,z],[0,-45,0],true);
  const face=roundedRect(150,150,6);for(const p of Object.values(G.lidPorts))hole(face,...p.center,p.diameter/2);
  flat(face,3,lid,[0,0,0]);
  const lip=roundedRect(150,150,6);lip.holes.push(new THREE.Path(roundedRect(144,144,4).getPoints(32)));flat(lip,8,lid,[0,3,0]);
  for(const x of [-48,48]){
    const hinge=cyl(body,4,22,[x,-78,-77],white);hinge.rotation.z=Math.PI/2;
    const pin=cyl(lid,2,24,[x,12,-77],metal);pin.rotation.z=Math.PI/2;
    box(lid,[18,10,8],[x,10,77]);box(body,[19,6,8],[x,-76,77]);
  }
  const cable=G.lidPorts.cable.center;
  const gland=group('lidGland',[-cable[0],lidY,z+cable[1]],[-35,-70,0],true);
  ring(gland,10.5,6,14,[0,-5,0]);ring(gland,14,6,5,[0,-5,0]);ring(gland,12.5,6,15,[0,-20,0]);ring(gland,11.5,6,4,[0,-24,0]);ring(gland,14,6,3,[0,3,0]);
  // External capped access fitting: axis points out of the right wall.
  const cap=group('sideBulkhead',[67.5,backY-39,z],[55,45,0]);
  const capAssembly=new THREE.Group();capAssembly.rotation.z=-Math.PI/2;cap.add(capAssembly);
  ring(capAssembly,13.5,9.25,12,[0,-7,0]);ring(capAssembly,19,9.25,4,[0,0,0]);
  const hex=cyl(capAssembly,19,8,[0,8,0],black,6);
  cyl(capAssembly,17,17,[0,20,0]);
  for(let i=0;i<60;i++){const a=i*Math.PI/30;const ridge=box(capAssembly,[.7,15,.7],[17*Math.cos(a),20,17*Math.sin(a)],black);ridge.rotation.y=-a;}
  const plateY=lidY+3+P.internalStandOffIllustrative;
  const plate=group('piPlate',[0,plateY,z],[0,-95,-15],true);flat(plateShape(G.internal),3,plate,[0,0,0],clear);
  for(const [x,v] of [[-53,-53],[53,-53],[-53,0],[53,0],[-53,53],[27,53]])cyl(plate,9,2.8,[x,-1.5,v],black);
  const cameraHoles=G.internal.holes.filter(h=>Math.abs(h.radius-1)<.00001);
  const c=G.lidPorts.camera.center;
  const boardBottom=plateY+3+P.cameraStandOffIllustrative;
  const camera=group('aiCamera',[-c[0],boardBottom,z+c[1]],[0,-135,-15],true);
  const board=roundedRect(25,24,2);
  // Inner hole row is the optical-axis datum, per the designer.
  for(const h of cameraHoles)hole(board,h.center[0]-c[0],h.center[1]-c[1]-3.5,1.1);
  flat(board,1.12,camera,[0,0,3.5],green);
  for(const h of cameraHoles)ring(camera,2.1,1.1,.08,[-h.center[0],1.12,h.center[1]-c[1]],gold);
  box(camera,[12,5,19.5],[0,-2.5,4.7],black);cyl(camera,4.5,5.5,[0,-7.75,0]);cyl(camera,3.3,.18,[0,-10.58,0],material(0x253b58,{metalness:.5,roughness:.12}));
  box(camera,[18,2.5,4],[0,2.35,13],white);box(camera,[6,1,5],[6,1.6,-5],black);
  const camHardware=group('cameraScrews',[0,plateY,z],[0,-145,-15],true);
  for(const h of cameraHoles){const x=-h.center[0],v=h.center[1];ring(camHardware,1.9,1,2,[x,3,v],metal);cyl(camHardware,1,7,[x,3.5,v],metal);cyl(camHardware,2,1,[x,6.7,v],metal);}
  addLabel('boxBody',body,[65,backY-25,z],[60,-25]);addLabel('boxMount',mount,[-55,backY+3,z+70],[-65,-30]);
  addLabel('boxLid',lid,[-55,lidY,z+45],[-60,25]);addLabel('sideBulkhead',cap,[95,backY-39,z],[50,20]);
  addLabel('lidGland',gland,[-cable[0],lidY-15,z+cable[1]],[-35,30]);
  addLabel('piPlate',plate,[-50,plateY+3,z+5],[-45,20]);addLabel('aiCamera',camera,[0,boardBottom,z+c[1]],[55,-20]);
  const pivot=new THREE.Vector3(0,seamY,z-77),axis=new THREE.Vector3(1,0,0);
  let opened=false,amount=0;
  function update(){for(const g of groups){g.position.copy(g.userData.base);g.quaternion.identity();if(opened&&moving.includes(g)){g.position.sub(pivot).applyAxisAngle(axis,Math.PI/2).add(pivot);g.quaternion.setFromAxisAngle(axis,Math.PI/2);}g.position.addScaledVector(g.userData.explode,amount);}}
  return {setOpen(value){opened=value;update();},setExplode(value){amount=value;update();},anchor(point,g){const p=point.clone();if(opened&&moving.includes(g))p.sub(pivot).applyAxisAngle(axis,Math.PI/2).add(pivot);return p.addScaledVector(g.userData.explode,amount);},inspect(){return {open:opened,centerZ:z,lensZ:z+c[1],backY,lidY,plateY,cameraY:boardBottom};}};
}
