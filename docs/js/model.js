import * as THREE from '../vendor/three.module.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { parameters as P, parts } from './data.js';
import { addPlatform } from './platform-model.js';

const v = xyz => new THREE.Vector3(...xyz);
export function createViewer(host, labelsHost, onSelect) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#eaf0f3');
  const camera = new THREE.PerspectiveCamera(36,1,1,6000);
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true; controls.dampingFactor=.12;
  controls.minDistance=140; controls.maxDistance=2400;
  controls.target.set(0,275,70);
  scene.add(new THREE.HemisphereLight(0xf7fcff,0x5e7988,2.4));
  const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(-350,800,550); scene.add(key);
  const rim=new THREE.DirectionalLight(0xc3e3ee,1.3);rim.position.set(550,250,-300);scene.add(rim);
  const grid=new THREE.GridHelper(1200,24,0xbdcdd5,0xd5dfe4);grid.position.set(0,-2,80);scene.add(grid);
  const root=new THREE.Group();scene.add(root);
  const registry=[],clickables=[],labelItems=[];
  const leaders=document.createElementNS('http://www.w3.org/2000/svg','svg');leaders.setAttribute('aria-hidden','true');leaders.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';labelsHost.append(leaders);
  const mat=(c,metal=.3)=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:metal});
  const aluminum=mat(0xb7c9d1,.45),cast=mat(0x94a8b2,.3),black=mat(0x263139,.1),nutMat=mat(0x8e9c9f,.5);
  function mesh(geometry,material,parent,pos=[0,0,0]){
    const m=new THREE.Mesh(geometry,material.clone());m.position.copy(v(pos));parent.add(m);return m;
  }
  function box(parent,size,pos,material=cast){return mesh(new THREE.BoxGeometry(...size),material,parent,pos);}
  function partGroup(id,pos,explode){const p=parts.find(p=>p.id===id);const g=new THREE.Group();g.position.copy(v(pos));g.userData={id,base:v(pos),explode:v(explode),assembly:p?.assembly||'frame',hardware:p?.kind==='hardware'};root.add(g);registry.push(g);return g;}
  function addLabel(id,g,anchor,offset){const p=parts.find(p=>p.id===id);const label=document.createElement('button');label.className='part-label';label.innerHTML=`<b>${p.code}</b>${p.name.replace(' acrylic','').replace('Blue funnel & collar','Funnel').replace('Crossed blue vanes','Blue vanes').replace('Acrylic stopper inserts','Stoppers')}`;label.setAttribute('aria-label',p.name);label.onclick=()=>onSelect(id);labelsHost.append(label);const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('stroke','#74909e');leader.setAttribute('stroke-width','1');leaders.append(leader);labelItems.push({label,leader,anchor:v(anchor),group:g,offset});}
  // A schematic four-slot cross-section. Outer 20 mm envelope and cut lengths are exact.
  // Slot/fillet/central-bore details are illustrative, not manufacturer CAD.
  function profileShape(){
    const edge=[[-10,10],[-3,10],[-3,8],[-6,8],[-6,5],[-3,3],[3,3],[6,5],[6,8],[3,8],[3,10],[10,10]];
    const points=[];
    for(let k=0;k<4;k++)for(const [x0,y0] of edge){let x=x0,y=y0;for(let j=0;j<k;j++)[x,y]=[y,-x];points.push(new THREE.Vector2(x,y));}
    const shape=new THREE.Shape(points);const hole=new THREE.Path();hole.absarc(0,0,2.1,0,Math.PI*2,true);shape.holes.push(hole);return shape;
  }
  const shape=profileShape();
  const locations={
    stem:{start:[0,0,0],axis:[0,1,0],e:[0,20,-50],label:[-26,300,0]},
    crossbar:{start:[-210,110,20],axis:[1,0,0],e:[0,0,55],label:[65,110,33]},
    leftRail:{start:[-200,110,30],axis:[0,0,1],e:[-85,0,75],label:[-213,115,205]},
    rightRail:{start:[200,110,30],axis:[0,0,1],e:[85,0,75],label:[215,115,200]},
    upperArm:{start:[0,P.stem-P.upperArmTopGap-10,10],axis:[0,0,1],e:[0,85,45],label:[15,P.stem-P.upperArmTopGap+12,175]},
    lowerSupport:{start:[0,0,20],axis:[0,1,0],e:[0,-30,70],label:[32,43,25]},
  };
  for(const p of parts.filter(p=>p.kind==='extrusion')){
    const l=locations[p.id],g=partGroup(p.id,l.start,l.e);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:p.length,bevelEnabled:false,steps:1,curveSegments:12});
    const m=mesh(geometry,aluminum,g);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),v(l.axis));
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,35),new THREE.LineBasicMaterial({color:0x6b8592,transparent:true,opacity:.33}));m.add(edge);
    const label=document.createElement('button');label.className='part-label';label.innerHTML=`<b>${p.code}</b>${p.length} mm`;label.setAttribute('aria-label',`${p.name}, ${p.length} millimetres`);label.onclick=()=>onSelect(p.id);labelsHost.append(label);
    const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('stroke','#74909e');leader.setAttribute('stroke-width','1');leaders.append(leader);
    const offsets={stem:[-58,0],crossbar:[-30,25],leftRail:[-24,26],rightRail:[32,25],upperArm:[48,-16],lowerSupport:[62,20]};
    labelItems.push({label,leader,anchor:v(l.label),group:g,offset:offsets[p.id]});
  }
  function bolt(parent,position,axis,screwId='screw',nutId='nut',length=8){
    const g=new THREE.Group();g.position.copy(v(position));g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v(axis));parent.add(g);
    const head=mesh(new THREE.CylinderGeometry(4.66,4.66,2.63,20),black,g,[0,1.315,0]);head.userData.id=screwId;
    const socket=mesh(new THREE.CylinderGeometry(1.65,1.65,.12,6),mat(0x0a1015),g,[0,2.67,0]);socket.userData.id=screwId;
    const shaft=mesh(new THREE.CylinderGeometry(2.5,2.5,length,12),black,g,[0,-length/2,0]);shaft.userData.id=screwId;
    const nut=box(g,[9,3,9],[0,-(length-2),0],nutMat);nut.userData.id=nutId;
  }
  // Local u/v plane is the right angle; local w is bracket width.
  function bracket(id,size,pos,u,dirV,explode){
    const g=partGroup(id,pos,explode);const uv=v(u),vv=v(dirV),w=new THREE.Vector3().crossVectors(uv,vv);
    g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(uv,vv,w));
    box(g,[size,3,18],[size/2,1.5,0]);box(g,[3,size,18],[1.5,size/2,0]);
    const triangle=new THREE.Shape([new THREE.Vector2(3,3),new THREE.Vector2(size,3),new THREE.Vector2(3,size)]);
    const geo=new THREE.ExtrudeGeometry(triangle,{depth:2,bevelEnabled:false});
    mesh(geo,cast,g,[0,0,-9]);if(id==='smallBracket')mesh(geo,cast,g,[0,0,7]);
    for(const t of size===38?[11,29]:[10]){bolt(g,[t,3,0],[0,1,0]);bolt(g,[3,t,0],[1,0,0]);}
    return g;
  }
  const armTop=P.stem-P.upperArmTopGap;
  bracket('largeBracket',38,[0,armTop,10],[0,1,0],[0,0,1],[0,90,45]);
  bracket('largeBracket',38,[-190,110,30],[1,0,0],[0,0,1],[-70,35,85]);
  bracket('largeBracket',38,[190,110,30],[-1,0,0],[0,0,1],[70,35,85]);
  bracket('largeBracket',38,[-10,100,20],[-1,0,0],[0,-1,0],[-40,-25,65]);
  bracket('smallBracket',18,[10,100,20],[1,0,0],[0,-1,0],[40,-25,65]);
  const plate=partGroup('plate',[12,45,10],[45,-20,40]);box(plate,[4,40,40],[0,0,0]);
  for(const y of [-10,10])for(const z of [-10,10])bolt(plate,[2,y,z],[1,0,0]);
  addPlatform({partGroup,mesh,bolt,addLabel});
  for(const g of registry){g.userData.partIds=new Set([g.userData.id]);g.traverse(m=>{if(m.isMesh){m.userData.id??=g.userData.id;g.userData.partIds.add(m.userData.id);m.userData.baseColor=m.material.color.clone();clickables.push(m);}});}
  let selected=null,labels=true,hardware=true,explode=0,isolated=false,pattern=true,labelScope='platform';
  const assemblies={frame:true,platform:true};
  function updateVisibility(){for(const g of registry){g.visible=assemblies[g.userData.assembly]&&(!g.userData.hardware||hardware)&&(!isolated||g.userData.partIds.has(selected));g.traverse(m=>{if(!m.isMesh&&!m.isLineSegments)return;m.visible=(!isolated||g.userData.id===selected||m.userData.id===selected)&&(m.userData.id!=='pattern'||pattern);});}}
  function select(id){selected=id;isolated=false;for(const m of clickables){m.material.color.copy(m.userData.baseColor);m.material.emissive?.setHex(0);if(m.userData.id===id){m.material.color.setHex(0x40a9bb);m.material.emissive?.setHex(0x0c2830);}}for(const l of labelItems)l.label.classList.toggle('selected',l.group.userData.id===id);updateVisibility();}
  let fitScale=1;
  function setCamera(name='iso'){
    camera.up.set(0,1,0);controls.target.set(0,275,75);
    const views={iso:[-740,650,950],front:[0,280,1250],side:[1250,280,75],top:[0,1200,76]};
    if(name==='top'){controls.target.set(0,0,120);camera.up.set(0,0,-1);}
    camera.position.copy(v(views[name]||views.iso));camera.position.sub(controls.target).multiplyScalar(fitScale).add(controls.target);controls.update();
  }
  setCamera();
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;const nextScale=Math.max(1,.98/camera.aspect);camera.position.sub(controls.target).multiplyScalar(nextScale/fitScale).add(controls.target);fitScale=nextScale;camera.updateProjectionMatrix();renderer.setSize(w,h);};new ResizeObserver(resize).observe(host);resize();
  const raycaster=new THREE.Raycaster();let start=null;
  renderer.domElement.addEventListener('pointerdown',e=>{start=[e.clientX,e.clientY]});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>5)return;
    const r=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
    const hit=raycaster.intersectObjects(clickables,false).find(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent;}return true;});
    if(hit)onSelect(hit.object.userData.id);
  });
  host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();const offset=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')s.theta-=.12;if(e.key==='ArrowRight')s.theta+=.12;if(e.key==='ArrowUp')s.phi=Math.max(.05,s.phi-.12);if(e.key==='ArrowDown')s.phi=Math.min(Math.PI-.05,s.phi+.12);if(e.key==='+')s.radius*=.9;if(e.key==='-')s.radius*=1.1;camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();}});
  function render(){requestAnimationFrame(render);controls.update();renderer.render(scene,camera);const w=host.clientWidth,h=host.clientHeight;
    const placed=[];
    for(const l of labelItems){const p=l.anchor.clone().addScaledVector(l.group.userData.explode,explode).project(camera);const show=labels&&l.group.visible&&l.group.userData.assembly===labelScope&&p.z<1&&p.z>-1;l.label.hidden=!show;l.leader.style.display=show?'':'none';if(show){const ax=(p.x+1)/2*w,ay=(1-p.y)/2*h;let x=ax+l.offset[0],y=ay+l.offset[1];x=Math.max(60,Math.min(w-60,x));y=Math.max(115,Math.min(h-45,y));for(const prev of placed)if(Math.abs(x-prev.x)<110&&Math.abs(y-prev.y)<28)y+=30;placed.push({x,y});l.label.style.left=x+'px';l.label.style.top=y+'px';l.leader.setAttribute('x1',ax);l.leader.setAttribute('y1',ay);l.leader.setAttribute('x2',x);l.leader.setAttribute('y2',y);}}
  }render();
  return {select,setCamera,setLabels(value){labels=value;},setLabelScope(value){labelScope=value;},setAssembly(id,value){assemblies[id]=value;updateVisibility();},setPattern(value){pattern=value;updateVisibility();},setHardware(value){hardware=value;updateVisibility();},setExplode(value){explode=value;for(const g of registry)g.position.copy(g.userData.base).addScaledVector(g.userData.explode,value);},isolate(){isolated=!isolated;updateVisibility();return isolated;},reset(){select(null);setCamera();},inspect(){return {members:registry.filter(g=>locations[g.userData.id]).length,brackets:registry.filter(g=>g.userData.id.includes('Bracket')).length,screws:clickables.filter(m=>m.userData.id==='screw').length/3,nuts:clickables.filter(m=>m.userData.id==='nut').length,platformScrews:clickables.filter(m=>m.userData.id==='platformScrews').length/3,platformNuts:clickables.filter(m=>m.userData.id==='platformNuts').length,panels:registry.filter(g=>g.userData.id.endsWith('Panel')).length,stoppers:registry.filter(g=>g.userData.id==='stoppers').length,assemblies:{...assemblies},pattern,selected,explode,hardware};}};
}
