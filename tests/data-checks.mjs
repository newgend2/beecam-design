import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {frameParts as parts,parameters,totalLength,platformParts,platformParameters} from '../docs/js/data.js';
const members=parts.filter(p=>p.kind==='extrusion');
assert.deepEqual(members.map(p=>p.length).sort((a,b)=>a-b),[100,220,280,280,420,570]);
assert.equal(totalLength,1870);
assert.equal(new Set(parts.map(p=>p.id)).size,parts.length);
assert.equal(parameters.lowerConnectionConfirmed,true);
assert.equal(parameters.upperArmPositionConfirmed,false);
const qty=id=>parts.find(p=>p.id===id).qty;
assert.equal(qty('screw'),4*qty('largeBracket')+2*qty('smallBracket')+4*qty('plate'));
assert.equal(qty('nut'),qty('screw'));
const data=JSON.parse(await readFile(new URL('../docs/downloads/frame-dimensions.json',import.meta.url),'utf8'));
assert.deepEqual(data.parameters,parameters);assert.deepEqual(data.parts,parts);
for(const p of parts){const svg=await readFile(new URL(`../docs/drawings/${p.id}.svg`,import.meta.url),'utf8');assert.ok(svg.includes(p.sku));if(p.length)assert.ok(svg.includes('>'+p.length+'</text>'));}
console.log('PASS: cut lengths, hardware arithmetic, confidence state and generated downloads.');

const G=(await import('../docs/js/platform-geometry.js')).default;
assert.deepEqual(G.platform.size,[420,300]);
assert.deepEqual(G.platform.opening.center,[210,145]);
assert.equal(G.platform.opening.radius,45.695);
assert.equal(G.platform.boltHoles.length,8);
assert.equal(platformParameters.acrylicThickness,3);
assert.equal(platformParameters.stopperThickness,3);
assert.equal(G.stopper.arcRadius,53.34);
assert.equal(G.stopper.conversion,25.4);
// Independent area checks catch winding/arc/triangulation errors in the web meshes.
const THREE=await import('../docs/vendor/three.module.js');
const {panelShape,stopperShape}=await import('../docs/js/platform-shapes.js');
function area(shape){const g=new THREE.ShapeGeometry(shape,512),p=g.attributes.position,ix=g.index;let a=0;for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>new THREE.Vector2(p.getX(ix.getX(i+j)),p.getY(ix.getX(i+j))));a+=Math.abs((vs[1].x-vs[0].x)*(vs[2].y-vs[0].y)-(vs[2].x-vs[0].x)*(vs[1].y-vs[0].y))/2;}return a;}
assert.ok(Math.abs(area(panelShape(true))+area(panelShape(false))-(420*300-Math.PI*45.695**2-8*Math.PI*2.75**2))<.1);
assert.ok(area(stopperShape())>2100&&area(stopperShape())<2200);
const snapshot=JSON.parse(await readFile(new URL('../docs/downloads/platform-geometry.json',import.meta.url),'utf8'));
assert.deepEqual(snapshot,G);
for(const p of platformParts){if(p.download)assert.ok((await readFile(new URL('../docs/'+p.download,import.meta.url))).length);}
console.log('PASS: platform units, exact holes, 3 mm thickness, triangulated panel area, stopper outline and CAD exports.');

const C=(await import('../docs/js/cone-geometry.js')).default;
assert.equal(C.height,91.44);assert.equal(C.rimOuterDiameter,139.7);
assert.deepEqual(C.profile[0],C.profile.at(-1));assert.equal(C.profile.length,11);
assert.equal(platformParameters.coneProfileConfirmed,true);
assert.equal(platformParameters.coneSeatingConfirmed,false);
console.log('PASS: converted cone profile, closed profile chain, internal display geometry.');
