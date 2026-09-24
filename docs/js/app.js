import { parts,totalLength,sourceURL } from './data.js';
import { createViewer } from './model.js';
const $=s=>document.querySelector(s);
let viewer=null,selected=null;
function stats(rows){$('#detail-stats').innerHTML=rows.map(([k,v])=>`<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join('');}
function setView(view){document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});for(const n of ['explore','drawings','materials'])$(`#${n}-view`).hidden=n!==view;}
function showDrawing(id){setView('drawings');requestAnimationFrame(()=>document.getElementById(`drawing-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}));}
function selectPart(id){
  selected=id;const p=parts.find(p=>p.id===id);viewer?.select(id);
  document.querySelectorAll('.part-button').forEach(b=>{const active=b.dataset.part===id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});
  $('#select-frame').classList.toggle('selected',!id);
  if(!p){$('#detail-eyebrow').textContent='ASSEMBLY DETAILS';$('#detail-title').textContent='Aluminum frame';$('#detail-description').textContent='The structural skeleton of the camera trap: one vertical stem, a U-shaped platform support, and an upper mounting arm.';stats([['Stem height','570 mm'],['Platform width','420 mm'],['Cut members','6'],['Net extrusion',`${totalLength.toLocaleString()} mm`],['Profile','20 × 20 mm']]);$('#detail-actions').innerHTML='<button id="part-drawing">View frame drawing ↗</button>';$('#part-drawing').onclick=()=>showDrawing('assembly');return;}
  $('#detail-eyebrow').textContent=`${p.code} / ${p.kind==='extrusion'?'CUT MEMBER':'HARDWARE'}`;$('#detail-title').textContent=p.name;$('#detail-description').textContent=p.note;
  stats([['80/20 part',p.sku],['Quantity',String(p.qty)+(p.kind==='hardware'?' · provisional':'')],...(p.length?[['Cut length',p.length+' mm'],['Cross section','20 × 20 mm']]:[['Size',p.dims]]),['Source',p.kind==='extrusion'?'Designer dimensions':'80/20 specifications']]);
  $('#detail-actions').innerHTML='<button id="isolate-part">Isolate part</button><button id="part-drawing">View drawing ↗</button><a class="button" target="_blank" rel="noopener" href="'+sourceURL(p.sku)+'">80/20 product page ↗</a>';
  $('#isolate-part').onclick=()=>{setView('explore');const isolated=viewer?.isolate();$('#isolate-part').textContent=isolated?'Show assembly':'Isolate part';};$('#part-drawing').onclick=()=>showDrawing(p.id);
}
$('#parts-list').innerHTML=parts.map((p,i)=>`<button class="part-button ${i===6?'hardware-group':''}" data-part="${p.id}" aria-pressed="false"><span class="part-code">${p.code}</span><span>${p.name.replace(' platform','').replace(' mounting','').replace(' parallel','').replace('Supported corner bracket','Corner brackets').replace('Compact corner bracket','Compact bracket').replace('Square joining plate','Joining plate').replace('Button-head screw','Screws').replace('Slide-in T-nut block','T-nuts')}</span>${p.length?`<span class="length">${p.length}</span>`:''}</button>`).join('');
document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>selectPart(b.dataset.part));
$('#select-frame').onclick=()=>selectPart(null);
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#whole-scope').onclick=()=>setScope(false);$('#inside-scope').onclick=()=>setScope(true);
function setScope(inside){$('#inside-tree').hidden=!inside;$('#whole-tree').hidden=inside;for(const [id,active]of [['inside-scope',inside],['whole-scope',!inside]]){const b=$('#'+id);b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}if(inside){$('#detail-eyebrow').textContent='INTERNALS / NEXT ASSEMBLY';$('#detail-title').textContent='Inside the enclosure';$('#detail-description').textContent='The weatherproof box and the acrylic electronics mount will be documented as two separate groups. Their dimensions have not yet been supplied. The frame remains visible for context.';stats([]);$('#detail-actions').innerHTML='';}else selectPart(selected);}
try{viewer=createViewer($('#canvas-host'),$('#part-labels'),selectPart);window.beecamViewer=viewer;}catch(error){console.error(error);$('#viewer-error').hidden=false;$('#hardware-toggle').disabled=true;$('#explode').disabled=true;}
$('#labels-toggle').onchange=e=>viewer?.setLabels(e.target.checked);$('#hardware-toggle').onchange=e=>viewer?.setHardware(e.target.checked);
$('#explode').oninput=e=>{viewer?.setExplode(Number(e.target.value)/100);$('#explode-value').value=e.target.value+'%';};
document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{viewer?.setCamera(b.dataset.camera);document.querySelectorAll('[data-camera]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',active);});});
$('#reset-view').onclick=()=>{viewer?.reset();$('#explode').value=0;$('#explode-value').value='0%';viewer?.setExplode(0);$('#hardware-toggle').checked=true;viewer?.setHardware(true);$('#labels-toggle').checked=true;viewer?.setLabels(true);document.querySelector('[data-camera="iso"]').click();selectPart(null);};
$('#fallback-drawings').onclick=()=>setView('drawings');$('#print-drawings').onclick=()=>window.print();
$('#bom-body').innerHTML=parts.map(p=>`<tr><td>${p.code}</td><td>${p.name}</td><td><a href="${sourceURL(p.sku)}" target="_blank" rel="noopener">${p.sku} ↗</a></td><td>${p.length?p.length+' mm':p.dims}</td><td>${p.qty}</td><td>${p.kind==='extrusion'?'Supplied':'Provisional'}</td></tr>`).join('');
$('#drawing-grid').innerHTML=[{id:'assembly',code:'01',name:'Frame assembly',note:'Front, side and plan views. The dashed upper-arm location is provisional; no confirmed mounting-height dimension is assigned.'},...parts].map(p=>`<article class="drawing-card" id="drawing-${p.id}"><figure><img src="drawings/${p.id}.svg" alt="Dimensioned reference drawing: ${p.name}" loading="lazy"><figcaption><span>${p.code} · ${p.name}</span><a href="drawings/${p.id}.svg" download>SVG ↓</a></figcaption></figure><p>${p.note}</p></article>`).join('');
selectPart(null);
