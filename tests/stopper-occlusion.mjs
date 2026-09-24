import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:900,height:600}});
const url=process.env.VIEWER_URL||'http://127.0.0.1:8767/';
await page.goto(url);await page.waitForFunction(()=>window.beecamViewer);
await mkdir(new URL('../private/',import.meta.url),{recursive:true});
try{
const output=await page.evaluate(async()=>{
 const THREE=await import('./vendor/three.module.js');const {addPlatform}=await import('./js/platform-model.js');const {platformParameters:P}=await import('./js/data.js');
 const scene=new THREE.Scene();scene.background=new THREE.Color('#eeeeee');scene.add(new THREE.HemisphereLight(0xffffff,0xffffff,3));
 const groups=[];
 const partGroup=(id,pos)=>{const g=new THREE.Group();g.position.set(...pos);g.userData.id=id;groups.push(g);scene.add(g);return g;};
 const mesh=(geo,mat,g,pos=[0,0,0])=>{const m=new THREE.Mesh(geo,mat.clone());m.position.set(...pos);g.add(m);return m;};
 const loaded=new Promise(resolve=>{THREE.DefaultLoadingManager.onLoad=resolve;});
 addPlatform({partGroup,mesh,bolt(){},addLabel(){}});
 for(const g of groups)g.visible=['vaneFunnel','crossVanes','stoppers'].includes(g.userData.id);
 const canvas=document.createElement('canvas');document.body.replaceChildren(canvas);document.body.style='margin:0';
 const renderer=new THREE.WebGLRenderer({canvas,antialias:false,preserveDrawingBuffer:true});renderer.setSize(900,600);renderer.outputColorSpace=THREE.SRGBColorSpace;
 await Promise.race([loaded,new Promise((_,reject)=>setTimeout(()=>reject(Error('Texture load timed out')),10000))]);
 const camera=new THREE.OrthographicCamera(-100,100,66.6667,-66.6667,.1,2000);
 const pixels=new Uint8Array(900*600*4),gl=renderer.getContext(),results=[];
 // At 5 degrees the opaque funnel must hide the entire sticker surface.
 // The overhead view is a positive control that the patterns actually loaded.
 for(const [azimuth,degrees] of [[0,5],[Math.PI/2,5],[Math.PI,5],[Math.PI*1.5,5],[0,60]]){
  const elev=degrees*Math.PI/180,target=new THREE.Vector3(0,P.stopperBaseYIllustrative+1.5,165);
  camera.position.copy(target).add(new THREE.Vector3(Math.cos(azimuth)*1000,Math.tan(elev)*1000,Math.sin(azimuth)*1000));camera.lookAt(target);
  renderer.render(scene,camera);gl.readPixels(0,0,900,600,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let patternPixels=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+1]>150&&pixels[i+2]<100)patternPixels++;
  results.push({azimuth,degrees,patternPixels});
 }
 return results;
});
for(const r of output.filter(r=>r.degrees===5))assert.equal(r.patternPixels,0,`Stopper pattern leaks through wall at azimuth ${r.azimuth}`);
assert.ok(output.at(-1).patternPixels>1000,'Patterns must be visible from above');
await page.screenshot({path:new URL('../private/stopper-occlusion-top.png',import.meta.url).pathname});
console.log('PASS: no sticker pixels through the funnel in four side views; overhead pattern visible.');
}finally{await browser.close();}
