import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from '../docs/vendor/three.module.js';
import {addEnclosure} from '../docs/js/enclosure-model.js';
import {parts,electronicsParameters as E,enclosureParameters as P,aiCameraParameters as A} from '../docs/js/data.js';
import G from '../docs/js/enclosure-geometry.js';
const scene=new THREE.Scene(),groups=[];
const api=addEnclosure({partGroup(id,pos,explode){const g=new THREE.Group();g.position.fromArray(pos);g.userData={id,base:new THREE.Vector3(...pos),explode:new THREE.Vector3(...explode)};scene.add(g);groups.push(g);return g;},mesh(geometry,material,parent,pos=[0,0,0]){const m=new THREE.Mesh(geometry,material);m.position.fromArray(pos);parent.add(m);return m;},bolt(){},addLabel(){}});
const get=id=>groups.find(g=>g.userData.id===id),part=id=>parts.find(p=>p.id===id),near=(a,b)=>assert.ok(Math.abs(a-b)<.0001,`${a} != ${b}`);
for(const p of parts.filter(p=>p.assembly==='internals')){assert.ok(get(p.id),p.id+' missing mesh');assert.ok(existsSync(new URL('../docs/drawings/'+p.id+'.svg',import.meta.url)),p.id+' missing drawing');}
assert.equal(part('velcro').qty,5);assert.equal(get('velcro').children.length,10);
assert.equal(part('jstCables').qty,2);assert.equal(api.inspect().electronics.routedJstCables,2);
assert.deepEqual(api.inspect().electronics.oledWireOrder,['black','red','yellow','blue']);
assert.equal(part('wittyStandoffs').qty,2);assert.equal(part('stackRetainers').qty,4);
assert.equal(part('plateScrews').qty,6);assert.equal(part('rtcStandoffs').qty,2);
near(E.piStandOff,15);near(E.wittyStandOff,20);near(E.oledStandOff,10);near(E.maleThreadLength,6);
const plateTop=api.inspect().plateY+3;
near(get('piZero').position.y-plateTop,15);
near(get('wittyPi').position.y-get('piZero').position.y-1.6,20);
near(get('oled').position.y-get('wittyPi').position.y-1.6,10);
near(get('rtc').position.y-plateTop,10);
// Catalogue envelope includes the socket body and 12 mm exposed pins.
const headerBounds=new THREE.Box3().setFromObject(get('stackHeader')).getSize(new THREE.Vector3());
near(headerBounds.x,5);near(headerBounds.y,23);near(headerBounds.z,51);
assert.equal(get('stackHeader').children.length,41);
for(const pin of get('stackHeader').children.slice(1))near(pin.geometry.parameters.height,12);
// Each mounting post intersects an actual source acrylic hole, not a photo guess.
for(const id of ['piStandoffs','rtcStandoffs'])for(const post of get(id).children.filter(m=>m.geometry.type==='ExtrudeGeometry')){
 const x=-(get(id).position.x+post.position.x),v=get(id).position.z-P.centerZ+post.position.z;
 assert.ok(G.internal.holes.some(h=>Math.hypot(h.center[0]-x,h.center[1]-v)<.0001),`${id}: hole ${x},${v}`);
}
assert.ok(get('wittyStandoffs').children.every(m=>m.position.z>0),'Tall supports only opposite OLED');
// Regression: cable leaves the inward-facing camera edge, never the outer hole row.
const camera=get('aiCamera'),socket=camera.getObjectByName('camera-csi-socket');
const endpoints=get('csiCable').userData.endpoints;
near(socket.position.z-socket.geometry.parameters.depth/2,14.5-23.862);
near(endpoints.camera[2]-camera.position.z,14.5-23.862);
near(endpoints.camera[1]-camera.position.y,1.12+2.75/2);
const ribbonMesh=get('csiCable').children.find(m=>m.geometry.type==='BufferGeometry');
const positions=ribbonMesh.geometry.attributes.position;
near((positions.getZ(0)+positions.getZ(1))/2,endpoints.camera[2]);
assert.ok(positions.getZ(2)<positions.getZ(0),'Ribbon must first travel inward out of the camera socket');
const pi=get('piZero'),piSocket=pi.getObjectByName('pi-csi-socket');
near(endpoints.pi[2]-pi.position.z,-32.5);
near(piSocket.position.z-piSocket.geometry.parameters.depth/2,-32.5);
// Optical axis and mounting holes stay registered while camera body changes.
near(A.lensFromOuterEdge,14.5);near(A.holeDiameter,2.2);near(A.pcbThickness,1.12);
const cameraPCB=camera.children.find(m=>m.geometry.type==='ExtrudeGeometry');
const boardBounds=new THREE.Box3().setFromBufferAttribute(cameraPCB.geometry.attributes.position);
near(boardBounds.max.x-boardBounds.min.x,25);near(boardBounds.max.z-boardBounds.min.z,23.862);
for(const h of G.internal.holes.filter(h=>h.radius===1)){
 const expectedZ=h.center[1]-G.lidPorts.camera.center[1];
 assert.ok(camera.children.some(m=>m.position.z===expectedZ&&m.position.y===A.pcbThickness));
}
// The Witty board is imported geometry, with the source's USB shell and component solids.
const cadMeshes=get('wittyPi').children.filter(m=>m.name.startsWith('witty-step-'));
assert.equal(cadMeshes.length,4);
assert.ok(cadMeshes.reduce((n,m)=>n+m.geometry.index.count/3,0)>10000);
const cadBounds=new THREE.Box3();cadMeshes.forEach(m=>cadBounds.union(new THREE.Box3().setFromBufferAttribute(m.geometry.attributes.position)));
assert.ok(Math.abs(cadBounds.min.z+32.511)<.02&&Math.abs(cadBounds.max.x-15.896)<.02,'Manufacturer STEP transformed to installed board coordinates');
// USB centres are 41.4 / 54 mm from the SD end in the official Pi drawing.
assert.deepEqual(E.piUSBFromLeft,[41.4,54]);near(E.piHDMIFromLeft,12.4);
scene.updateMatrixWorld(true);
// Principal boards fit below the closed shell back, and remain within side walls.
for(const id of ['piZero','wittyPi','qwiicHat','oled','rtc','stackHeader','csiCable','jstCables']){
 const b=new THREE.Box3().setFromObject(get(id));assert.ok(b.max.y<api.inspect().backY-3,`${id} hits back`);assert.ok(b.min.x>-64.5&&b.max.x<64.5,`${id} hits side wall`);
}
const ids=parts.filter(p=>p.assembly==='internals').map(p=>p.id),start=ids.map(id=>get(id).position.clone()),lid=get('boxLid').position.clone();
api.setOpen(true);
ids.forEach((id,i)=>near(get(id).position.distanceTo(get('boxLid').position),start[i].distanceTo(lid)));
api.setExplode(.75);api.setExplode(0);api.setOpen(false);
ids.forEach((id,i)=>near(get(id).position.distanceTo(start[i]),0));
console.log('PASS: all internal meshes/drawings, confirmed spacer heights and asymmetric supports, CAD hole registration, five Velcro pairs, two JST routes, closed-shell clearance and rigid/reversible lid motion.');
