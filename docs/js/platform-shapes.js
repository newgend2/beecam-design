import * as THREE from '../vendor/three.module.js';
import geometry from './platform-geometry.js?v=da3b2fb6589e';
import {platformParameters as P} from './data.js?v=da3b2fb6589e';
import cone from './cone-geometry.js?v=da3b2fb6589e';

export function panelShape(rear) {
  const {center:[cx,cy],radius:r}=geometry.platform.opening;
  const s=new THREE.Shape();
  if(rear){s.moveTo(0,300);s.lineTo(420,300);s.lineTo(420,130);}
  else{s.moveTo(0,0);s.lineTo(420,0);s.lineTo(420,130);}
  s.lineTo(350,130);s.lineTo(350,145);s.lineTo(cx+r,cy);
  s.absarc(cx,cy,r,0,rear?Math.PI:-Math.PI,!rear);
  s.lineTo(70,145);s.lineTo(70,130);s.lineTo(0,130);s.closePath();
  for(const h of geometry.platform.boltHoles){
    if((h.center[1]>130)!==rear)continue;
    const hole=new THREE.Path();hole.absarc(...h.center,h.radius,0,Math.PI*2,true);s.holes.push(hole);
  }
  return s;
}
export function stopperShape(){
  const {vertices,arcRadius:r}=geometry.stopper;
  const [a,b,c]=vertices.map(x=>x.point);const s=new THREE.Shape();
  s.moveTo(...a);s.lineTo(...b);s.lineTo(...c);
  s.absarc(0,0,r,Math.atan2(c[1],c[0]),Math.atan2(a[1],a[0]),false);s.closePath();return s;
}
export function patternUV(geometry,width=420,height=300,offset=[0,0]){
  const p=geometry.attributes.position,uv=[];
  for(let i=0;i<p.count;i++)uv.push((p.getX(i)+offset[0])/width,(p.getY(i)+offset[1])/height);
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return geometry;
}

// A photo-estimated silhouette, parameterized so the model and drawing agree.
export function vaneOutline(){
  const rim=P.coneBaseY+cone.height-P.stopperBaseYIllustrative;
  const half=P.vaneWidthIllustrative/2,tip=P.vaneTipWidthIllustrative/2;
  return [[-52,0],[52,0],[half,rim],[half,rim+P.vaneShoulderAboveRimIllustrative],[tip,P.vaneHeightIllustrative],[-tip,P.vaneHeightIllustrative],[-half,rim+P.vaneShoulderAboveRimIllustrative],[-half,rim]];
}
export function stopperCentroid(){
  const pts=stopperShape().getPoints(512);let cross=0,x=0,y=0;
  for(let i=0;i<pts.length;i++){
    const a=pts[i],b=pts[(i+1)%pts.length],v=a.x*b.y-b.x*a.y;
    cross+=v;x+=(a.x+b.x)*v;y+=(a.y+b.y)*v;
  }
  return [x/(3*cross),y/(3*cross)];
}
