import {parts,totalLength,sourceURL} from './data.js';
import {createViewer} from './model.js';
const $=s=>document.querySelector(s);
let viewer=null,selected=null,assembly='platform';
const names={frame:'Aluminum frame',platform:'Imaging platform'};
const drawingFile=p=>p.id==='pattern'?'assets/contrast-pattern.svg':`drawings/${p.id==='platformNuts'?'nut':p.id}.svg`;
function stats(rows){$('#detail-stats').innerHTML=rows.map(([k,v])=>`<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`).join('');}
function setView(view){
  document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  for(const n of ['explore','drawings','materials'])$(`#${n}-view`).hidden=n!==view;
}
function showDrawing(id){setView('drawings');requestAnimationFrame(()=>document.getElementById(`drawing-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}));}
function selectAssembly(id){
  assembly=id;selected=null;viewer?.select(null);viewer?.setLabelScope(id);
  for(const a of ['frame','platform']){
    const active=id===a,button=$(`#select-${a}`);button.classList.toggle('selected',active);button.setAttribute('aria-expanded',active);
    $(a==='frame'?'#parts-list':'#platform-parts-list').hidden=!active;
  }
  $('#viewer-eyebrow').textContent=id==='frame'?'01 / ALUMINUM FRAME':'02 / IMAGING PLATFORM';
  selectPart(null);
}
function selectPart(id){
  const p=parts.find(p=>p.id===id);
  if(p&&p.assembly!==assembly)selectAssembly(p.assembly);
  selected=id;viewer?.select(id);
  if(p){$(`#${p.assembly}-toggle`).checked=true;viewer?.setAssembly(p.assembly,true);}
  document.querySelectorAll('.part-button').forEach(b=>{const active=b.dataset.part===id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});
  if(!p){
    $('#detail-eyebrow').textContent='ASSEMBLY DETAILS';$('#detail-title').textContent=names[assembly];
    if(assembly==='frame'){
      $('#detail-description').textContent='The structural skeleton: one vertical stem, a U-shaped platform support, and an upper mounting arm.';
      stats([['Stem height','570 mm'],['Platform width','420 mm'],['Cut members','6'],['Net extrusion',`${totalLength.toLocaleString()} mm`],['Profile','20 × 20 mm']]);
    }else{
      $('#detail-description').textContent='Two acrylic panels close around the blue trap. Patterned inserts inside the crossed vanes stop insects falling through the funnel.';
      stats([['Footprint','420 × 300 mm'],['Acrylic thickness','3 mm · confirmed'],['Trap opening','Ø91.39 mm'],['Mounting holes','8 × Ø5.5 mm'],['Stopper radius','53.34 mm'],['Funnel profile','Supplied CAD']]);
    }
    $('#detail-actions').innerHTML=`<button id="part-drawing">View ${assembly} drawing ↗</button>`;
    $('#part-drawing').onclick=()=>showDrawing(assembly==='frame'?'assembly':'platformAssembly');return;
  }
  $('#detail-eyebrow').textContent=`${p.code} / ${p.assembly.toUpperCase()}`;
  $('#detail-title').textContent=p.name;$('#detail-description').textContent=p.note;
  stats([...(p.sku?[['80/20 part',p.sku]]:[]),['Quantity',String(p.qty)],...(p.length?[['Cut length',p.length+' mm'],['Cross section','20 × 20 mm']]:[['Size',p.dims]]),['Basis',p.basis||(p.kind==='extrusion'?'Designer dimensions':'Catalogue; count provisional')]]);
  const source=p.source||(p.sku?sourceURL(p.sku):null);
  $('#detail-actions').innerHTML='<button id="isolate-part">Isolate part</button><button id="part-drawing">View drawing ↗</button>'+(p.download?`<a class="button" href="${p.download}" download>Download ${p.kind==='graphic'?'pattern SVG':p.download.endsWith('.stl')?'STL':'DXF in mm'} ↓</a>`:'')+(source?`<a class="button" target="_blank" rel="noopener" href="${source}">${p.sku?'80/20 product page':'Blue vane trap source'} ↗</a>`:'');
  $('#isolate-part').onclick=()=>{setView('explore');$('#isolate-part').textContent=viewer?.isolate()?'Show assembly':'Isolate part';};
  $('#part-drawing').onclick=()=>showDrawing(p.id);
}
const shortName=p=>({largeBracket:'Corner brackets',smallBracket:'Compact bracket',plate:'Joining plate',screw:'Screws',nut:'T-nuts',rearPanel:'Rear panel',frontPanel:'Front panel',vaneFunnel:'Funnel & collar',crossVanes:'Blue vanes',stoppers:'Stopper inserts',pattern:'Sticker pattern',platformScrews:'Mounting screws',platformNuts:'Slide-in nuts'}[p.id]||p.name.replace(' platform','').replace(' mounting','').replace(' parallel',''));
for(const a of ['frame','platform']){
  $(a==='frame'?'#parts-list':'#platform-parts-list').innerHTML=parts.filter(p=>p.assembly===a).map(p=>`<button class="part-button" data-part="${p.id}" aria-pressed="false"><span class="part-code">${p.code}</span><span>${shortName(p)}</span>${p.length?`<span class="length">${p.length}</span>`:''}</button>`).join('');
  $(`#select-${a}`).onclick=()=>selectAssembly(a);
  $(`#${a}-toggle`).onchange=e=>viewer?.setAssembly(a,e.target.checked);
}
document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>selectPart(b.dataset.part));
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#whole-scope').onclick=()=>setScope(false);$('#inside-scope').onclick=()=>setScope(true);
function setScope(inside){
  $('#inside-tree').hidden=!inside;$('#whole-tree').hidden=inside;
  for(const [id,active]of [['inside-scope',inside],['whole-scope',!inside]]){const b=$('#'+id);b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}
  if(inside){$('#detail-eyebrow').textContent='INTERNALS / NEXT ASSEMBLY';$('#detail-title').textContent='Inside the enclosure';$('#detail-description').textContent='The weatherproof box and acrylic electronics mount will be documented next. The frame and platform remain visible for context.';stats([]);$('#detail-actions').innerHTML='';}else selectPart(selected);
}
try{viewer=createViewer($('#canvas-host'),$('#part-labels'),selectPart);window.beecamViewer=viewer;}catch(error){console.error(error);$('#viewer-error').hidden=false;$('#hardware-toggle').disabled=true;$('#explode').disabled=true;}
$('#labels-toggle').onchange=e=>viewer?.setLabels(e.target.checked);
$('#hardware-toggle').onchange=e=>viewer?.setHardware(e.target.checked);
$('#pattern-toggle').onchange=e=>viewer?.setPattern(e.target.checked);
$('#explode').oninput=e=>{viewer?.setExplode(Number(e.target.value)/100);$('#explode-value').value=e.target.value+'%';};
document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{viewer?.setCamera(b.dataset.camera);document.querySelectorAll('[data-camera]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',active);});});
$('#reset-view').onclick=()=>{
  viewer?.reset();$('#explode').value=0;$('#explode-value').value='0%';viewer?.setExplode(0);
  for(const a of ['frame','platform']){$(`#${a}-toggle`).checked=true;viewer?.setAssembly(a,true);}
  $('#hardware-toggle').checked=true;viewer?.setHardware(true);$('#labels-toggle').checked=true;viewer?.setLabels(true);$('#pattern-toggle').checked=true;viewer?.setPattern(true);
  $('[data-camera="iso"]').click();selectAssembly('platform');
};
$('#fallback-drawings').onclick=()=>setView('drawings');$('#print-drawings').onclick=()=>window.print();
$('#bom-body').innerHTML=parts.map(p=>`<tr><td>${p.code}</td><td>${p.name}</td><td>${p.sku?`<a href="${sourceURL(p.sku)}" target="_blank" rel="noopener">${p.sku} ↗</a>`:p.download?`<a href="${p.download}" download>${p.kind==='graphic'?'SVG':'CAD'} ↓</a>`:p.kind==='purchased'?'Blue trap':'To confirm'}</td><td>${p.length?p.length+' mm':p.dims}</td><td>${p.qty}</td><td>${p.basis||(p.kind==='extrusion'?'Supplied':'Provisional')}</td></tr>`).join('');
const drawingParts=[{id:'platformAssembly',code:'02',name:'Imaging platform layout',note:'DXF plan geometry, opening, stepped seam and bolt-hole positions. Acrylic panels and inserts are 3 mm thick.'},...parts.filter(p=>p.assembly==='platform'),{id:'assembly',code:'01',name:'Frame assembly',note:'Front, side and plan views. The dashed upper-arm location is provisional.'},...parts.filter(p=>p.assembly==='frame')];
$('#drawing-grid').innerHTML=drawingParts.map(p=>`<article class="drawing-card" id="drawing-${p.id}"><figure><img src="${drawingFile(p)}" alt="Reference drawing: ${p.name}" loading="lazy"><figcaption><span>${p.code} · ${p.name}</span><a href="${drawingFile(p)}" download>SVG ↓</a></figcaption></figure><p>${p.note}${p.download&&p.kind!=='graphic'?` <a href="${p.download}" download>Download CAD</a>`:''}</p></article>`).join('');
selectAssembly('platform');
