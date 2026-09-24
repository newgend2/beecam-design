import assert from 'node:assert/strict';
import * as THREE from '../docs/vendor/three.module.js';
import G from '../docs/js/enclosure-geometry.js';
import {enclosureParameters as P,parts} from '../docs/js/data.js';
import {addEnclosure,plateShape} from '../docs/js/enclosure-model.js';
const near=(a,b,t=.0001)=>assert.ok(Math.abs(a-b)<t,`${a} vs ${b}`);
assert.equal(P.mountThickness,3);assert.equal(P.internalThickness,3);
assert.equal(G.internal.conversion,25.4);assert.equal(G.internal.holes.length,13);assert.equal(G.internal.cutouts.length,3);assert.equal(G.mount.holes.length,6);
near(Math.max(...G.internal.outline.map(p=>p[0]))-Math.min(...G.internal.outline.map(p=>p[0])),128.4986);
assert.deepEqual(G.lidPorts.camera,{center:[0,41.032019625],diameter:22});
assert.deepEqual(G.lidPorts.cable,{center:[37.3253,-37.3253],diameter:22});
near(P.centerZ+G.lidPorts.camera.center[1],165);
assert.equal(parts.length,new Set(parts.map(p=>p.id)).size);
// Triangulate the actual plate mesh and compare net area to the analytic shape.
const shape=plateShape(G.internal),geo=new THREE.ShapeGeometry(shape,256),v=geo.attributes.position,ix=geo.index;
let area=0;
for(let i=0;i<ix.count;i+=3){const [a,b,c]=[0,1,2].map(j=>new THREE.Vector2(v.getX(ix.getX(i+j)),v.getY(ix.getX(i+j))));area+=Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))/2;}
const expected=128.4986**2-(4-Math.PI)*3.81**2-G.internal.holes.reduce((a,h)=>a+Math.PI*h.radius**2,0)-100-12.7*22.86-10.16*7.62;
near(area,expected,.5);
const scene=new THREE.Scene(),registry=[];
const api=addEnclosure({partGroup(id,pos,explode){const g=new THREE.Group();g.position.fromArray(pos);g.userData={id,base:new THREE.Vector3(...pos),explode:new THREE.Vector3(...explode)};registry.push(g);scene.add(g);return g;},mesh(geo,mat,parent,pos=[0,0,0]){const m=new THREE.Mesh(geo,mat);m.position.fromArray(pos);parent.add(m);return m;},bolt(){},addLabel(){}});
const group=id=>registry.find(g=>g.userData.id===id);
scene.updateMatrixWorld(true);
const lid=group('boxLid').children[0],body=group('boxBody');
const ray=(point,direction,objects)=>new THREE.Raycaster(new THREE.Vector3(...point),new THREE.Vector3(...direction),0,100).intersectObjects(objects,false);
for(const p of Object.values(G.lidPorts)){
 const x=-p.center[0],z=P.centerZ+p.center[1];
 assert.equal(ray([x,380,z],[0,1,0],[lid]).length,0,'Port must be a real through-hole');
 assert.ok(ray([x+12.5,380,z],[0,1,0],[lid]).length>0,'Material must surround each hole');
}
const rightWall=body.children.find(m=>m.position.x===64.5);
assert.equal(ray([90,438,P.centerZ],[-1,0,0],[rightWall]).length,0,'Side port must pass through wall');
assert.ok(ray([90,438+16,P.centerZ],[-1,0,0],[rightWall]).length>0);
// The plate and camera must move rigidly with the lid, not remain in the shell.
const coords=()=>['boxLid','piPlate','aiCamera','lidGland'].map(id=>group(id).position.clone());
const before=coords();api.setOpen(true);scene.updateMatrixWorld(true);const after=coords();
for(let i=1;i<4;i++)near(before[0].distanceTo(before[i]),after[0].distanceTo(after[i]));
assert.ok(before[2].distanceTo(after[2])>40);
api.setExplode(1);api.setExplode(0);api.setOpen(false);
coords().forEach((p,i)=>near(p.distanceTo(before[i]),0));
console.log('PASS: DXF conversion, plate net area, all three real port cutouts, optical alignment, rigid lid motion and reversible explosion.');
