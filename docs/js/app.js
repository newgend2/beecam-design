import drawingIndex from './drawing-index.js?v=c454cde96b62';
import {parts,totalLength,sourceURL,materialSections,materialRows} from './data.js?v=c454cde96b62';
import {createViewer} from './model.js?v=c454cde96b62';
import {initFieldPhotos} from './field.js?v=c454cde96b62';
const $=s=>document.querySelector(s);
let viewer=null,selected=null,assembly='enclosure',inside=false;
const names={frame:'Aluminum frame',platform:'Imaging platform',enclosure:'Weatherproof box',internals:'Acrylic + electronics'};
const order={frame:'01',platform:'02',enclosure:'03',internals:'04'};
const drawingPath=p=>p.id==='pattern'?'assets/contrast-pattern.svg':`drawings/${({platformNuts:'nut',platformScrews:'screw',boxArmNuts:'nut',boxArmScrews:'screw'}[p.id]||p.id)}.svg`;
const drawingFile=p=>`${drawingPath(p)}?v=${drawingIndex[drawingPath(p)].revision}`;
const drawingSize=p=>drawingIndex[drawingPath(p)];
const drawingAssembly={frame:'assembly',platform:'platformAssembly',enclosure:'enclosureAssembly',internals:'internalsAssembly'};
function stats(rows){$('#detail-stats').innerHTML=rows.map(([k,v])=>`<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join('');}
function setView(view,preserveAnchor=false){
  document.querySelector('.workspace').classList.toggle('materials-mode',view==='materials');
  document.querySelector('.workspace').classList.toggle('field-mode',view==='field');
  document.body.dataset.view=view;
  if(!preserveAnchor)history.replaceState(null,'',location.pathname+location.search+(view==='explore'?'':`#${view}`));
  document.querySelectorAll('button[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  for(const n of ['explore','drawings','materials','field'])$(`#${n}-view`).hidden=n!==view;
  if(!preserveAnchor&&$('.view-tabs').getBoundingClientRect().top<0)$('.view-tabs').scrollIntoView({block:'start'});
}
function showDrawing(id){setView('drawings');requestAnimationFrame(()=>document.getElementById(`drawing-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}));}
function selectAssembly(id){
  assembly=id;selected=null;viewer?.select(null);viewer?.setLabelScope(id);
  document.querySelectorAll('[data-assembly-select]').forEach(button=>{const active=button.dataset.assemblySelect===id;button.classList.toggle('selected',active);button.setAttribute('aria-expanded',active);button.nextElementSibling.hidden=!active;});
  $('#viewer-eyebrow').textContent=`${inside?'INTERNALS':order[id]} / ${names[id].toUpperCase()}`;
  selectPart(null);
}
function selectPart(id){
  const p=parts.find(p=>p.id===id);
  if(p?.assembly==='internals'&&!inside)setScope(true);
  if(p&&p.assembly!==assembly)selectAssembly(p.assembly);
  selected=id;viewer?.select(id);
  if(p){$(`#${p.assembly}-toggle`).checked=true;viewer?.setAssembly(p.assembly,true);}
  document.querySelectorAll('.part-button').forEach(b=>{const active=b.dataset.part===id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});
  if(!p){
    $('#detail-eyebrow').textContent='ASSEMBLY DETAILS';$('#detail-title').textContent=names[assembly];
    const details={
      frame:['The structural skeleton: one vertical stem, a U-shaped platform support, and an upper mounting arm.',[['Stem height','570 mm'],['Platform width','420 mm'],['Cut members','6'],['Net extrusion',`${totalLength.toLocaleString()} mm`],['Profile','20 × 20 mm']]],
      platform:['Two acrylic panels close around the blue trap. Patterned inserts inside the crossed vanes stop insects falling through the funnel.',[['Footprint','420 × 300 mm'],['Acrylic thickness','3 mm'],['Trap opening','Ø91.39 mm'],['Mounting holes','8 × Ø5.5 mm'],['Stopper radius','53.34 mm'],['Blue vane trap','Purchased prebuilt']]],
      enclosure:['The box hangs beneath the upper arm, with its lens facing the vane. Open the lid to inspect the acrylic plate and camera.',[['Overall envelope','150 × 150 × 90 mm'],['Mounting plate','135 × 170 × 3 mm'],['Lid ports','2 × Ø22 mm'],['Right-side port','Ø28 mm'],['Lens alignment','Over vane']]],
      internals:['The removable acrylic plate follows the acrylic design DXF. Its camera mount locates the optical axis and lid opening. The Pi, Witty Pi, full-size Qwiic HAT and OLED form one stack. The RTC mounts separately. Five hook-and-loop pairs attach the acrylic to the lid.',[['Plate size','128.499 mm square'],['Acrylic thickness','3 mm'],['Cable clearance','Ø31.75 mm'],['Camera hole pitch','21 × 12.5 mm'],['Pi / Witty / OLED','15 / 20 / 10 mm'],['RTC standoffs','10 mm'],['Lid attachment','5 hook-and-loop pairs']]],
    };
    $('#detail-description').textContent=details[assembly][0];stats(details[assembly][1]);
    $('#detail-actions').innerHTML=`<button id="part-drawing">View assembly drawing ↗</button>`+(assembly==='enclosure'?'<button id="explore-internals">Explore internals</button>':'');
    $('#part-drawing').onclick=()=>showDrawing(drawingAssembly[assembly]);
    if($('#explore-internals'))$('#explore-internals').onclick=()=>{setView('explore');setScope(true);};
    return;
  }
  $('#detail-eyebrow').textContent=`${p.code} / ${p.assembly.toUpperCase()}`;
  $('#detail-title').textContent=p.name;$('#detail-description').textContent=p.note;
  stats([...(p.sku?[['80/20 part',p.sku]]:[]),['Quantity',String(p.qty)],...(p.length?[['Cut length',p.length+' mm'],['Cross section','20 × 20 mm']]:[['Size',p.dims]]),['Basis',p.basis||(p.kind==='extrusion'?'Cut specification':'Catalogue specification')]]);
  const source=p.source||(p.sku?sourceURL(p.sku):null);
  $('#detail-actions').innerHTML='<button id="isolate-part">Isolate part</button>'+(p.drawing===false?'':'<button id="part-drawing">View drawing ↗</button>')+(p.download?`<a class="button" href="${p.download}" download>Download ${p.kind==='graphic'?'pattern SVG':p.download.endsWith('.stl')?'STL':'DXF in mm'} ↓</a>`:'')+(p.id==='pattern'||p.id==='stoppers'?'<a class="button" href="assets/stopper-contrast.svg" download>Stopper sticker SVG ↓</a>':'')+(p.cadSource?`<a class="button" href="${p.cadSource}" target="_blank" rel="noopener">Manufacturer CAD / drawing ↗</a>`:'')+(source?`<a class="button" target="_blank" rel="noopener" href="${source}">${p.sku?'80/20 product page':'Product source'} ↗</a>`:'');
  $('#isolate-part').onclick=()=>{setView('explore');$('#isolate-part').textContent=viewer?.isolate()?'Show assembly':'Isolate part';};
  if($('#part-drawing'))$('#part-drawing').onclick=()=>showDrawing(({platformScrews:'screw',boxArmScrews:'screw',platformNuts:'nut',boxArmNuts:'nut'})[p.id]||p.id);
}
const shortName=p=>({largeBracket:'Corner brackets',smallBracket:'Compact bracket',plate:'Joining plate',screw:'11-5308 bolts',nut:'14122 nuts',rearPanel:'Rear panel',frontPanel:'Front panel',vaneFunnel:'Funnel & collar',crossVanes:'Blue vanes',stoppers:'Stopper inserts',pattern:'Sticker pattern',platformScrews:'11-5308 bolts',platformNuts:'14122 nuts',boxBody:'Body',boxLid:'Drilled lid',boxMount:'Mounting plate',lidGland:'Cable gland',sideBulkhead:'Capped bulkhead',boxScrews:'Box screws',boxArmScrews:'11-5308 bolts',boxArmNuts:'14122 nuts',piPlate:'Acrylic Pi plate',aiCamera:'AI Camera',cameraScrews:'Camera M2 screws'}[p.id]||p.name.replace(' platform','').replace(' mounting','').replace(' parallel',''));
for(const button of document.querySelectorAll('[data-assembly-select]')){
  const a=button.dataset.assemblySelect;
  button.nextElementSibling.innerHTML=parts.filter(p=>p.assembly===a).map(p=>`<button class="part-button" data-part="${p.id}" aria-pressed="false"><span class="part-code">${p.code}</span><span>${shortName(p)}</span>${p.length?`<span class="length">${p.length}</span>`:''}</button>`).join('');
  button.onclick=()=>selectAssembly(a);
}
for(const a of Object.keys(names))$(`#${a}-toggle`).onchange=e=>viewer?.setAssembly(a,e.target.checked);
document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>selectPart(b.dataset.part));
document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#whole-scope').onclick=()=>setScope(false);$('#inside-scope').onclick=()=>setScope(true);
function setScope(value){
  inside=value;$('#inside-tree').hidden=!inside;$('#whole-tree').hidden=inside;
  for(const [id,active]of [['inside-scope',inside],['whole-scope',!inside]]){const b=$('#'+id);b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}
  $('#frame-toggle').parentElement.hidden=inside;$('#platform-toggle').parentElement.hidden=inside;$('#pattern-toggle').parentElement.hidden=inside;
  viewer?.setScope(inside);$('#lid-toggle').checked=inside;
  if(inside)for(const a of ['enclosure','internals']){$(`#${a}-toggle`).checked=true;viewer?.setAssembly(a,true);}
  $('[data-camera="iso"]').click();selectAssembly(inside?'internals':'enclosure');
}
try{viewer=createViewer($('#canvas-host'),$('#part-labels'),selectPart);window.beecamViewer=viewer;}catch(error){console.error(error);$('#viewer-error').hidden=false;$('#hardware-toggle').disabled=true;$('#explode').disabled=true;}
$('#labels-toggle').onchange=e=>viewer?.setLabels(e.target.checked);
$('#hardware-toggle').onchange=e=>viewer?.setHardware(e.target.checked);
$('#pattern-toggle').onchange=e=>viewer?.setPattern(e.target.checked);
$('#lid-toggle').onchange=e=>viewer?.setLid(e.target.checked);
$('#explode').oninput=e=>{viewer?.setExplode(Number(e.target.value)/100);$('#explode-value').value=e.target.value+'%';};
document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{viewer?.setCamera(b.dataset.camera);document.querySelectorAll('[data-camera]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',active);});});
$('#reset-view').onclick=()=>{
  viewer?.reset();$('#explode').value=0;$('#explode-value').value='0%';viewer?.setExplode(0);
  for(const a of Object.keys(names)){$(`#${a}-toggle`).checked=true;viewer?.setAssembly(a,true);}
  $('#hardware-toggle').checked=true;viewer?.setHardware(true);$('#labels-toggle').checked=true;viewer?.setLabels(true);$('#pattern-toggle').checked=true;viewer?.setPattern(true);
  setScope(inside);
};
$('#fallback-drawings').onclick=()=>setView('drawings');$('#print-drawings').onclick=()=>window.print();
// One purchase row per item, with installed quantities separate from shared stock.
const escapeHTML=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const materialLink=(url,label)=>`<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)} ↗</a>`;
$('#material-groups').innerHTML=materialSections.map(section=>`<section class="material-section" id="materials-${section.id}"><div class="material-heading"><h3>${escapeHTML(section.title)}</h3><span>${escapeHTML(section.scope)}</span></div><p class="muted">${escapeHTML(section.note)}</p><div class="table-wrap"><table class="materials-table"><thead><tr><th>Item / specification</th><th>Quantity</th><th>Use / purchasing notes</th><th>Supply</th></tr></thead><tbody>${materialRows.filter(r=>r.section===section.id).map(r=>`<tr data-material="${r.id}"><td><strong>${r.source?materialLink(r.source,r.item):escapeHTML(r.item)}</strong><small>${r.partId?escapeHTML(r.partId)+' · ':''}${escapeHTML(r.spec)}</small>${r.download?`<a href="${r.download}" download>Download ${r.download.endsWith('.svg')?'artwork':'DXF'} ↓</a>`:''}</td><td class="material-quantity"><strong>${escapeHTML(r.quantity)}</strong><small>${escapeHTML(r.unit)}</small></td><td>${escapeHTML(r.notes)}</td><td><span class="material-status">${escapeHTML(r.status)}</span></td></tr>`).join('')}</tbody></table></div></section>`).join('');
$('#materials-navigation').innerHTML=materialSections.map(s=>`<a href="#materials-${s.id}">${escapeHTML(s.title)}</a>`).join('');
$('button[data-view="materials"] span').textContent=materialRows.length;
function filterMaterials(){
 const query=$('#materials-search').value.trim().toLowerCase();
 for(const row of document.querySelectorAll('[data-material]'))row.hidden=!!(query&&!row.textContent.toLowerCase().includes(query));
 for(const section of document.querySelectorAll('.material-section'))section.hidden=![...section.querySelectorAll('[data-material]')].some(row=>!row.hidden);
 const shown=document.querySelectorAll('[data-material]:not([hidden])').length;
 $('#materials-result-count').textContent=`${shown} of ${materialRows.length} line items`;
 $('#materials-empty').hidden=shown>0;
}
$('#materials-search').oninput=filterMaterials;filterMaterials();
$('#print-materials').onclick=()=>window.print();
const drawingParts=Object.keys(names).flatMap(a=>[{id:drawingAssembly[a],code:order[a],name:names[a]+' layout',note:a==='enclosure'?'Lid ports follow the internal plate datums. Shell mouldings and wall thickness are schematic.':a==='internals'?'Board layout, standoff lengths and cable connections. Purchased component details and cable curves are schematic.':a==='frame'?'Front, side and plan views. Adjust the dashed upper-arm position in the stem slot.':'DXF plan geometry, opening, stepped seam and bolt-hole positions.'},...parts.filter(p=>p.assembly===a&&p.drawing!==false&&!['platformScrews','platformNuts','boxArmScrews','boxArmNuts'].includes(p.id))]);
$('#drawing-grid').innerHTML=drawingParts.map(p=>`<article class="drawing-card" id="drawing-${p.id}"><figure><img src="${drawingFile(p)}" width="${drawingSize(p).width}" height="${drawingSize(p).height}" alt="Reference drawing: ${p.name}" loading="lazy"><figcaption><span>${p.code} · ${p.name}</span><a href="${drawingFile(p)}" download>SVG ↓</a></figcaption></figure><p>${p.note}${p.download&&p.kind!=='graphic'?` <a href="${p.download}" download>Download CAD</a>`:''}</p></article>`).join('');
selectAssembly('enclosure');
initFieldPhotos();
function viewFromHash(){
if(/^#materials/.test(location.hash)){
  setView('materials',true);
  requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
}else if(location.hash==='#drawings')setView('drawings',true);
else if(/^#field(?:-|$)/.test(location.hash)){
  setView('field',true);
  requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
}else if(!location.hash)setView('explore',true);
}
viewFromHash();
window.addEventListener('hashchange',viewFromHash);
