import assert from 'node:assert/strict';
import {createSchool,stepSchool,boundsFor} from './src/biology/fish-motion.mjs';
import {createFish,poseFish} from './src/scene/fish.mjs';
import {createOrganisms,frondGeometry} from './src/scene/organisms.mjs';
import {createWater,createCaustics} from './src/scene/water.mjs';
import {addHabitatDetails,createTree} from './src/scene/habitat.mjs';
import * as T from 'three';
for(const id of ['red','duck','green']){
 const school=createSchool(id);const starts=school.map(f=>({x:f.x,z:f.z})),speeds=school.map(()=>[]);let minSpacing=Infinity;
 for(let j=0;j<7200;j++){stepSchool(school,1/60,{id,oxygen:8,flow:.1});for(const f of school){assert.ok([f.x,f.y,f.z,f.vx,f.vz,f.heading].every(Number.isFinite));const b=f.bounds;assert.ok(f.x>=b.x0-1e-8&&f.x<=b.x1+1e-8&&f.z>=b.z0-1e-8&&f.z<=b.z1+1e-8);assert.ok(f.y>=b.y0&&f.y<=b.y1);if(j%60===0)speeds[f.index].push(f.speed);}}
 assert.ok(school.filter((f,i)=>Math.hypot(f.x-starts[i].x,f.z-starts[i].z)>.25).length>=20,'fish explore distinct positions');
 assert.ok(speeds.every(a=>Math.max(...a)-Math.min(...a)>.05),'every fish changes swimming speed');
 const headingDiversity=new Set(school.map(f=>Math.round(f.heading*2)));assert.ok(headingDiversity.size>5,'fish do not share one orbital heading');
 const healthyY=school.reduce((n,f)=>n+f.y,0)/school.length;
 for(let j=0;j<2400;j++)stepSchool(school,1/60,{id,oxygen:1.5});
 assert.ok(school.reduce((n,f)=>n+f.y,0)/school.length>healthyY+.1,'hypoxia changes preferred depth');
 stepSchool(school,.05,{id,damage:.2});for(let j=0;j<200;j++)stepSchool(school,.05,{id,damage:0,oxygen:8});assert.ok(school.slice(0,6).every(f=>f.dead),'dead fish do not revive');
 const snap=JSON.stringify(school);stepSchool(school,0,{id});assert.equal(JSON.stringify(school),snap,'paused motion unchanged');
 console.log(id+': 120 s bounded independent movement, speed variation, hypoxia response and irreversible damage verified');
}
const moving=createSchool('red');for(let j=0;j<600;j++){const offset=-3.3*j/600;const cages=Array.from({length:4},(_,i)=>({x:-1.5+Math.floor(i/2)*2.35+offset,z:-1.6+i%2*2.35}));stepSchool(moving,1/60,{id:'red',cages});for(let i=0;i<20;i++){const f=moving[i],b=boundsFor('red',i,cages);assert.ok(f.x>=b.x0&&f.x<=b.x1&&f.z>=b.z0&&f.z<=b.z1);}}
const root=new T.Group();root.add(createFish(1));poseFish(root.children[0],createSchool('red')[0]);const organisms=createOrganisms();organisms.update(24);root.add(organisms.group,createWater().water,createCaustics().mesh,createTree(1,-5));addHabitatDetails(root,'duck');root.add(new T.Mesh(frondGeometry()));let vertices=0;root.traverse(o=>{const a=o.geometry?.attributes.position;if(a){assert.ok(Array.from(a.array).every(Number.isFinite));vertices+=a.count;}if(o.isInstancedMesh)assert.ok(Array.from(o.instanceMatrix.array).every(Number.isFinite));});assert.ok(vertices>3000);console.log('Moving-pen containment and procedural 3D geometry verified ('+vertices+' vertex positions); GPU rendering requires device QA.');
