import {writeFile} from 'node:fs/promises';
import {materialSections,materialRows,materialsRelease,totalLength} from '../docs/js/data.js';
const out=new URL('../docs/downloads/',import.meta.url);
const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const header=['category','scope','item','part_id','specification','quantity','unit','supply','notes','source','download'];
const rows=materialRows.map(r=>[r.category,r.scope,r.item,r.partId||'',r.spec,r.quantity,r.unit,r.status,r.notes,r.source||'',r.download||'']);
await writeFile(new URL('camera-materials.csv',out),[header,...rows].map(r=>r.map(cell).join(',')).join('\n')+'\n');
const esc=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const link=(text,url)=>url?`[${esc(text)}](${url})`:esc(text);
let md=`# BeeCam camera-trap materials list\n\nRelease ${materialsRelease.version}. Materials for remote monitoring of bumble bees.\n\nQuantities are **per camera** unless marked shared, included or as needed. Kits and multipacks supply the individual pieces listed.\n\n**80/20 total:** six 20-2020 members, ${totalLength.toLocaleString('en-US')} mm net; 4 × 14057, 1 × 14060, 1 × 20-4167, **32 × 11-5308 bolts and 32 × 14122 nuts**. Bolt/nut breakdown: 22 frame + 8 platform + 2 box-to-arm. Add saw kerf to raw extrusion stock.\n\n**Cables:** two 200 mm JST SH cables, one each for RTC and OLED. The CSI ribbon is included with the AI Camera.\n\n**Power: choose one option.** A: Voltaic CORE K-P150-V102 50 W solar / 18 Ah battery with C304 USB-C regulator. B: Voltaic V75 with a USB-A-to-USB-C cable.\n`;
for(const section of materialSections){
 md+=`\n## ${section.title}\n\n${section.scope}. ${section.note}\n\n| Item | Specification | Quantity | Notes | Supply |\n| --- | --- | ---: | --- | --- |\n`;
 for(const r of materialRows.filter(r=>r.section===section.id))md+=`| ${link(r.item,r.source)} | ${esc(r.partId?r.partId+' · '+r.spec:r.spec)} | ${esc(r.quantity)} ${esc(r.unit)} | ${esc(r.notes)}${r.download?' '+link('Design file','https://newgend2.github.io/beecam-design/'+r.download):''} | ${r.status} |\n`;
}
md+='\n## Assembly reference\n\nThe blue vane trap is purchased prebuilt. Use the design DXFs for the custom acrylic panels, four stopper inserts and enclosure mounting plates. Print the contrast artwork on adhesive weatherproof vinyl. Fit the stem to a ground-driven T-post using two locally sourced hose clamps.\n\nSelect M2 screw lengths to suit each joint, with secure thread engagement and no bottoming out. Purchased component details and cable routes in the viewer are schematic; use manufacturer specifications for fit-critical checks. Set the upper-arm height in the stem slot and centre the camera lens over the vane.\n';
md+=`\nProduct sources checked ${materialsRelease.checked}. Prices and stock are not tracked.\n`;
await writeFile(new URL('beecam-materials.md',out),md);
console.log(`Generated ${materialRows.length} consolidated material rows for release ${materialsRelease.version}.`);
