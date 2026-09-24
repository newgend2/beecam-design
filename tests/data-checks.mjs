import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parts,parameters,totalLength} from '../docs/js/data.js';
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
