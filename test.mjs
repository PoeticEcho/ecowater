import {canEarnStamp} from './src/education/achievements.mjs';
import assert from 'node:assert/strict';
import {initial,step,act,scenarios} from './model.mjs';
for(const id of Object.keys(scenarios)){
 const s=initial(id);
 for(let i=0;i<1000;i++)step(s,.1);
 assert(s.bloom<.15,`${id}: baseline must remain low`);
 Object.assign(s,{month:scenarios[id].month,light:.95,inflow:.95,pollutionLevel:.92,bloom:.12});
 for(let i=0;i<700;i++)step(s,.1);
 assert(s.bloom>.6,`${id}: enriched summer conditions cause bloom`);
 assert(s.dissolvedOxygen<5,`${id}: bloom causes oxygen stress`);
 const before=JSON.stringify(s);
 assert.equal(act(s,id==='red'?'collect':'clay').ok,false);
 assert.equal(JSON.stringify(s),before,'Inappropriate actions must not change simulation');
 act(s,'cut');act(s,'air');act(s,id==='red'?'clay':id==='duck'?'collect':'flow');
 for(let i=0;i<3500;i++)step(s,.1);
 assert(s.recovered,`${id}: combined management restores water quality`);
 assert(s.dissolvedOxygen>5);
 console.log(`${id}: stable water → bloom → stress → recovery verified`);
}
const paused=initial();paused.paused=true;const before=JSON.stringify(paused);step(paused,100);assert.equal(JSON.stringify(paused),before);
const injured=initial();injured.damage=.4;act(injured,'air');for(let i=0;i<100;i++)step(injured,.1);assert(injured.damage>=.4,'Recovery cannot resurrect dead fish');
console.log('Pause and irreversible biological damage verified');
// A child who never opens either control panel must still reach the teaching event.
for(const id of Object.keys(scenarios)){
 const s=initial(id,'guided');
 for(let i=0;i<600;i++)step(s,.1);
 assert.equal(s.lesson.phase,'investigate',`${id}: unattended guided scenario reaches incident`);
 assert(s.day>=10&&s.day<10.1,`${id}: event occurs at day 10`);
 assert(s.bloom>.42,`${id}: the incident is supported by bloom state`);
 const frozen=JSON.stringify(s);for(let i=0;i<1000;i++)step(s,.1);
 assert.equal(JSON.stringify(s),frozen,'An unanswered incident must wait without secretly curing itself');
 const beforeBloom=s.bloom;act(s,'air');for(let i=0;i<50;i++)step(s,.1);
 assert(s.bloom>=beforeBloom*.9,'Oxygen must not be represented as bloom removal');
 for(const key of {red:['clay','cut'],duck:['collect','cut'],green:['wheel','flow','cut']}[id])act(s,key);
 for(let i=0;i<1000;i++)step(s,.1);
 assert.equal(s.lesson.phase,'reflect',`${id}: direct intervention reaches reflection`);
 assert(s.recovered,`${id}: recovery is measurable`);
 console.log(`${id}: no-menu day-10 event, observation hold and user-led recovery verified`);
}
const prevent=initial('duck','guided');act(prevent,'cut');for(let i=0;i<1800;i++)step(prevent,.1);
assert.equal(prevent.lesson.phase,'prevented','Early prevention should be recognized instead of forcing a bloom');
const reading=initial('green','guided');reading.paused=true;const readBefore=JSON.stringify(reading);step(reading,20);assert.equal(JSON.stringify(reading),readBefore,'Reading must not advance the event');
console.log('Early prevention and reading pauses verified');

// A stamp represents both an achieved intervention/prevention and understood causes.
for(const id of Object.keys(scenarios)){
 const s=initial(id,'guided');
 for(let i=0;i<600;i++)step(s,.1);
 s.lesson.read=true;s.lesson.answers=[{correct:true},{correct:true}];
 assert(!canEarnStamp(s),'Quiz alone must not grant an unsolved mission stamp');
 for(const key of {red:['air','clay','cut'],duck:['collect','cut'],green:['wheel','flow','cut']}[id])act(s,key);
 for(let i=0;i<1000;i++)step(s,.1);
 assert(canEarnStamp(s),id+': recovered and understood earns stamp');
 s.lesson.answers[1].correct=false;assert(!canEarnStamp(s),'Unresolved answer must not earn stamp');
 s.lesson.answers[1].correct=true;s.lesson.read=false;assert(!canEarnStamp(s),'Reading required');
 s.lesson.read=true;s.mode='free';assert(!canEarnStamp(s),'Free play cannot grant course stamps');
}
prevent.lesson.read=true;prevent.lesson.prevention=true;prevent.lesson.phase='quiz';prevent.lesson.answers=[{correct:true},{correct:true}];
assert(canEarnStamp(prevent),'Prevention remains recognized after entering quiz');
console.log('Three mission stamp gates, prevention, incorrect answers and free-play isolation verified');
