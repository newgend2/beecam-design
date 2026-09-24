import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {parts,materialRows,materialSections,platformParameters,electronicsParameters} from '../docs/js/data.js';

const byId=id=>materialRows.find(row=>row.id===id);
assert.equal(new Set(materialRows.map(row=>row.id)).size,materialRows.length);
for(const row of materialRows){
  assert.ok(row.quantity && row.unit && row.spec,`Incomplete material: ${row.id}`);
  assert.ok(!('review' in row),`Review metadata in release row: ${row.id}`);
  if(row.download)await access(new URL('../docs/'+row.download,import.meta.url));
}
// Every physical extrusion fastener contributes exactly once to procurement.
for(const [sku,id] of [['11-5308','bolts8020'],['14122','nuts8020']]){
  assert.equal(materialRows.filter(row=>row.partId===sku).length,1);
  assert.equal(byId(id).quantity,32);
  assert.equal(parts.filter(part=>part.sku===sku).reduce((n,part)=>n+part.qty,0),32);
  assert.equal(byId(id).status,'Per camera');
}
assert.equal(materialRows.filter(row=>row.partId==='20-2020').reduce((n,row)=>n+row.quantity,0),6);
assert.equal(byId('jstCables').quantity,2);
assert.equal(byId('blueTrap').quantity,1);
assert.equal(byId('velcro').unit,'pairs');
assert.equal(byId('velcro').quantity,5);
assert.equal(byId('boxScrews').status,'Included');
assert.equal(byId('lidGland').status,'Included');
assert.notEqual(byId('solarKit').section,byId('v75').section);
assert.equal(byId('solarKit').partId,'K-P150-V102');
assert.equal(byId('solarConverter').partId,'C304');
assert.equal(byId('solarKit').status,'Per camera');
assert.equal(byId('solarConverter').status,'Per camera');
assert.equal(byId('fieldPost').quantity,1);
assert.equal(byId('fieldClamps').quantity,2);
assert.equal(byId('fieldClamps').status,'Per camera');
assert.equal(byId('csiCable').status,'Included');
assert.equal(byId('stoppers').quantity,4);
assert.equal(platformParameters.stopperCountConfirmed,true);
assert.equal(electronicsParameters.rtcStandOff,10);
assert.equal(electronicsParameters.rtcHeightConfirmed,true);
assert.match(byId('helifounerKit').spec,/242/);
assert.equal(byId('helifounerKit').source,'https://www.amazon.com/dp/B0B7SNCFF1');
assert.equal(byId('stackHeader').source,'https://www.amazon.com/dp/B084Q4W1PW');
assert.equal(byId('blueTrap').source,'https://www.bluevanetraps.com');
assert.match(byId('pattern').notes,/weatherproof vinyl/);
for(const id of ['solar-power','portable-power'])assert.match(materialSections.find(s=>s.id===id).scope,/Choose A or B/);
for(const id of ['vaneFunnel','crossVanes']){
  assert.equal(parts.find(p=>p.id===id).drawing,false);
  assert.ok(!parts.find(p=>p.id===id).download);
  await assert.rejects(access(new URL(`../docs/drawings/${id}.svg`,import.meta.url)));
}
for(const name of ['vane-cone-mm.stl','vane-cone-geometry.json'])await assert.rejects(access(new URL('../docs/downloads/'+name,import.meta.url)));

// Read generated CSV independently, preserving quotes and embedded commas.
const csv=await readFile(new URL('../docs/downloads/camera-materials.csv',import.meta.url),'utf8');
const parsed=[];let row=[],field='',quoted=false;
for(let i=0;i<csv.length;i++){
  const c=csv[i];
  if(c==='"'){if(quoted&&csv[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(!quoted&&(c===','||c==='\n')){row.push(field);field='';if(c==='\n'){parsed.push(row);row=[];}}
  else field+=c;
}
assert.equal(parsed.length,materialRows.length+1);
const columns=parsed.shift();
for(let i=0;i<parsed.length;i++){
  const exported=Object.fromEntries(columns.map((key,col)=>[key,parsed[i][col]]));
  assert.equal(exported.quantity,String(materialRows[i].quantity));
  assert.equal(exported.supply,materialRows[i].status);
  assert.equal(exported.part_id,materialRows[i].partId||'');
}
const frameCsv=await readFile(new URL('../docs/downloads/frame-materials.csv',import.meta.url),'utf8');
assert.ok(!frameCsv.includes('"provisional"'));
const publicText=[await readFile(new URL('../docs/index.html',import.meta.url),'utf8'),await readFile(new URL('../docs/downloads/beecam-materials.md',import.meta.url),'utf8'),csv,...parts.map(p=>[p.note,p.basis,p.dims].join(' '))].join('\n');
assert.doesNotMatch(publicText,/\b(draft|unconfirmed|unverified|provisional|pending|designer)\b|to confirm|as requested|your mounting/i);
console.log(`PASS: ${materialRows.length} material rows, consolidated quantities, alternative power options, download scope and CSV consistency.`);
