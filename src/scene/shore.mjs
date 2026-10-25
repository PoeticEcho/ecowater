import * as T from 'three';
import {random} from '../biology/fish-motion.mjs';
// Small repeatable material textures; no network requests or large terrain meshes.
export function createTerrainTexture(kind){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d'),rng=random(921);
  ctx.fillStyle={earth:'#d4c9a9',grass:'#c6d3ac',rock:'#c6cbc0'}[kind];ctx.fillRect(0,0,256,256);
  for(let i=0;i<3800;i++){const x=rng()*256,y=rng()*256;ctx.fillStyle=`rgba(${rng()>.5?'255,255,225':'58,75,49'},${.03+rng()*.12})`;ctx.fillRect(x,y,1+rng()*3,kind==='grass'?2+rng()*7:1+rng()*3);}
  const map=new T.CanvasTexture(canvas);map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(2,2);map.colorSpace=T.SRGBColorSpace;return map;
}
export function addShoreDetails(parent,id){
  const group=new T.Group();parent.add(group);const rng=random(1402),d=new T.Object3D();
  const stones=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:'#a4ac91',roughness:1}),120);
  for(let i=0;i<120;i++){const x=-6+rng()*14,z=-4.2+Math.sin(x*1.7)*.18+rng()*.18;d.position.set(x,-.07+rng()*.13,z);d.scale.set(.06+rng()*.11,.04+rng()*.09,.07+rng()*.15);d.rotation.set(rng(),rng()*6,rng());d.updateMatrix();stones.setMatrixAt(i,d.matrix);stones.setColorAt(i,new T.Color().setHSL(.12,.1,.43+rng()*.28));}
  stones.receiveShadow=true;group.add(stones);
  // Grass seed heads remain above the bank, keeping the experimental water visible.
  const grass=new T.InstancedMesh(new T.ConeGeometry(.025,.45,4),new T.MeshStandardMaterial({color:'#728966',roughness:1}),160);
  for(let i=0;i<160;i++){d.position.set(-7+rng()*14,.65,-5.4+rng()*.7);d.scale.setScalar(.6+rng()*.8);d.rotation.set((rng()-.5)*.25,rng()*6,(rng()-.5)*.3);d.updateMatrix();grass.setMatrixAt(i,d.matrix);}group.add(grass);
  const outcrop=new T.InstancedMesh(new T.IcosahedronGeometry(1,2),new T.MeshStandardMaterial({color:id==='red'?'#9ba99a':'#99af84',roughness:1}),9);
  for(let i=0;i<9;i++){d.position.set(-7+i*1.7,.45,-5.65);d.scale.set(.5+rng()*.45,.2+rng()*.4,.25+rng()*.2);d.rotation.set(0,rng()*6,0);d.updateMatrix();outcrop.setMatrixAt(i,d.matrix);}outcrop.castShadow=true;outcrop.receiveShadow=true;group.add(outcrop);
  return group;
}
