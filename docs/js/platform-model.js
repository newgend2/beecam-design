import * as THREE from '../vendor/three.module.js';
import geometry from './platform-geometry.js?v=c454cde96b62';
import cone from './cone-geometry.js?v=c454cde96b62';
import {platformParameters as P} from './data.js?v=c454cde96b62';
import {panelShape,stopperShape,patternUV,vaneOutline} from './platform-shapes.js?v=c454cde96b62';

export function addPlatform({partGroup,mesh,bolt,addLabel}){
  const texture=new THREE.TextureLoader().load(new URL('../assets/contrast-pattern.svg?v=c454cde96b62',import.meta.url).href);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const stopperTexture=new THREE.TextureLoader().load(new URL('../assets/stopper-contrast.svg?v=c454cde96b62',import.meta.url).href);
  stopperTexture.colorSpace=THREE.SRGBColorSpace;stopperTexture.anisotropy=8;
  const acrylic=new THREE.MeshStandardMaterial({color:0xc3e9ed,metalness:0,roughness:.25,transparent:true,opacity:.53,depthWrite:false,side:THREE.DoubleSide});
  const print=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const stopperPrint=print.clone();stopperPrint.map=stopperTexture;
  // Stopper graphics already sit above the acrylic. Slope-based depth bias
  // pulls them through the enclosing blue walls at grazing viewing angles.
  stopperPrint.polygonOffset=false;
  const blue=new THREE.MeshStandardMaterial({color:0x1745d3,metalness:0,roughness:.38,side:THREE.DoubleSide});
  const patternSurfaces=[];
  function surface(s,g,offset=[0,0],width=420,height=300,material=print){
    const cap=mesh(patternUV(new THREE.ShapeGeometry(s,96),width,height,offset),material,g,[0,0,P.acrylicThickness+.035]);cap.userData.id='pattern';patternSurfaces.push(cap);return cap;
  }
  for(const rear of [true,false]){
    const id=rear?'rearPanel':'frontPanel',s=panelShape(rear);
    const g=partGroup(id,[-210,P.surfaceY,310],[0,45,rear?-65:95]);g.userData.assembly='platform';g.rotation.x=-Math.PI/2;
    mesh(new THREE.ExtrudeGeometry(s,{depth:P.acrylicThickness,bevelEnabled:false,curveSegments:96}),acrylic,g);
    surface(s,g);
    const seam=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ShapeGeometry(s,96)),new THREE.LineBasicMaterial({color:0x28454e,transparent:true,opacity:.6}));seam.position.z=P.acrylicThickness+.16;g.add(seam);
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(s,{depth:P.acrylicThickness,bevelEnabled:false,curveSegments:64}),25),new THREE.LineBasicMaterial({color:0x557b83,transparent:true,opacity:.7}));g.add(edges);
    addLabel(id,g,rear?[-90,124,60]:[-80,124,260],rear?[-32,-23]:[-40,22]);
  }
  for(const h of geometry.platform.boltHoles){
    const rear=h.center[1]>130;
    const g=partGroup('platformScrews',[h.center[0]-210,P.surfaceY+P.acrylicThickness,310-h.center[1]],[0,62,rear?-65:95]);g.userData.assembly='platform';g.userData.hardware=true;
    bolt(g,[0,0,0],[0,1,0],'platformScrews','platformNuts',10);
  }
  const cz=310-geometry.platform.opening.center[1];
  const funnel=partGroup('vaneFunnel',[0,P.coneBaseY,cz],[0,75,0]);funnel.userData.assembly='platform';
  const profile=cone.profile.map(([r,y])=>new THREE.Vector2(r,y));
  mesh(new THREE.LatheGeometry(profile,160),blue,funnel);
  addLabel('vaneFunnel',funnel,[60,145,cz],[62,3]);
  const vanes=partGroup('crossVanes',[0,P.stopperBaseYIllustrative,cz],[0,135,0]);vanes.userData.assembly='platform';
  const vaneShape=new THREE.Shape(vaneOutline().map(p=>new THREE.Vector2(...p)));
  const vaneGeo=new THREE.ExtrudeGeometry(vaneShape,{depth:P.vaneThicknessIllustrative,bevelEnabled:false});
  mesh(vaneGeo,blue,vanes,[0,0,-P.vaneThicknessIllustrative/2]);
  const other=mesh(vaneGeo,blue,vanes,[-P.vaneThicknessIllustrative/2,0,0]);other.rotation.y=Math.PI/2;
  addLabel('crossVanes',vanes,[25,P.stopperBaseYIllustrative+P.vaneHeightIllustrative*.72,cz],[58,-20]);
  for(let i=0;i<P.stopperCount;i++){
    const a=i*Math.PI/2,s=stopperShape();const g=partGroup('stoppers',[0,P.stopperBaseYIllustrative,cz],[Math.cos(a+Math.PI/4)*40,85,Math.sin(a+Math.PI/4)*40]);g.userData.assembly='platform';
    g.rotation.set(-Math.PI/2,0,a);mesh(new THREE.ExtrudeGeometry(s,{depth:P.stopperThickness,bevelEnabled:false,curveSegments:96}),acrylic,g);
    surface(s,g,[0,0],geometry.stopper.arcRadius,geometry.stopper.arcRadius,stopperPrint);
    if(i===0)addLabel('stoppers',g,[34,P.stopperBaseYIllustrative+4,cz-26],[-75,-5]);
  }
  return {setPattern(value){for(const m of patternSurfaces)m.visible=value;},patternSurfaces};
}
