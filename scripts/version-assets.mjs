// Stamp a shared content revision through the application module graph.
// Refreshing the HTML must not combine it with older cached model/data modules.
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../docs/',import.meta.url);
const files=(await readdir(new URL('js/',root))).filter(f=>f.endsWith('.js')).sort();
const clean=s=>s.replace(/\?v=[a-f0-9]{12}/g,'');
const sources=new Map();
const hash=createHash('sha256');
for(const f of files){const s=clean(await readFile(new URL('js/'+f,root),'utf8'));sources.set(f,s);hash.update(f+'\0'+s);}
hash.update(await readFile(new URL('style.css',root)));
for(const f of (await readdir(new URL('assets/',root))).sort())hash.update(await readFile(new URL('assets/'+f,root)));
const revision=hash.digest('hex').slice(0,12);
const outputs=new Map();
for(const [f,s]of sources){
  // Vendor modules are unchanged and retain their shared identity.
  const stamped=s.replace(/(['"])(\.\/[^'"?]+\.js|\.\.\/assets\/[^'"?]+\.svg)\1/g,(_,q,path)=>`${q}${path}?v=${revision}${q}`);
  outputs.set('js/'+f,stamped);
}
const html=clean(await readFile(new URL('index.html',root),'utf8'));
outputs.set('index.html',html.replace('href="style.css"',`href="style.css?v=${revision}"`).replace('src="js/app.js"',`src="js/app.js?v=${revision}"`));
for(const [file,expected]of outputs){
  const path=new URL(file,root),actual=await readFile(path,'utf8');
  if(process.argv.includes('--check')){if(actual!==expected)throw new Error(`Stale asset revision: ${file}. Run node scripts/version-assets.mjs.`);}
  else if(actual!==expected)await writeFile(path,expected);
}
console.log(`${process.argv.includes('--check')?'PASS: consistent':'Stamped'} application asset revision ${revision}.`);
