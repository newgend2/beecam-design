import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from '../docs/vendor/three.module.js';
import {addEnclosure} from '../docs/js/enclosure-model.js';
import {parts,electronicsParameters as E,enclosureParameters as P} from '../docs/js/data.js';
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
// Each mounting post intersects an actual source acrylic hole, not a photo guess.
for(const id of ['piStandoffs','rtcStandoffs'])for(const post of get(id).children.filter(m=>m.geometry.type==='ExtrudeGeometry')){
 const x=-(get(id).position.x+post.position.x),v=get(id).position.z-P.centerZ+post.position.z;
 assert.ok(G.internal.holes.some(h=>Math.hypot(h.center[0]-x,h.center[1]-v)<.0001),`${id}: hole ${x},${v}`);
}
assert.ok(get('wittyStandoffs').children.every(m=>m.position.z>0),'Tall supports only opposite OLED');
scene.updateMatrixWorld(true);
// Principal boards fit below the closed shell back, and remain within side walls.
for(const id of ['piZero','wittyPi','qwiicHat','oled','rtc','csiCable','jstCables']){
 const b=new THREE.Box3().setFromObject(get(id));assert.ok(b.max.y<api.inspect().backY-3,`${id} hits back`);assert.ok(b.min.x>-64.5&&b.max.x<64.5,`${id} hits side wall`);
}
const ids=parts.filter(p=>p.assembly==='internals').map(p=>p.id),start=ids.map(id=>get(id).position.clone()),lid=get('boxLid').position.clone();
api.setOpen(true);
ids.forEach((id,i)=>near(get(id).position.distanceTo(get('boxLid').position),start[i].distanceTo(lid)));
api.setExplode(.75);api.setExplode(0);api.setOpen(false);
ids.forEach((id,i)=>near(get(id).position.distanceTo(start[i]),0));
console.log('PASS: all internal meshes/drawings, confirmed spacer heights and asymmetric supports, CAD hole registration, five Velcro pairs, two JST routes, closed-shell clearance and rigid/reversible lid motion.');
