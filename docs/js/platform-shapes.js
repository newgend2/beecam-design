import * as THREE from '../vendor/three.module.js';
import geometry from './platform-geometry.js';

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
