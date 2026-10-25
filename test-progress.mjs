import assert from 'node:assert/strict';
import {createProgressStore,PROGRESS_KEY} from './src/education/progress-store.mjs';
const records=new Map([['unrelated','keep']]);
const memory={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v),removeItem:k=>records.delete(k)};
const store=createProgressStore(()=>memory),record={score:2,peak:.8,day:20,elapsed:90,actions:['wheel','flow','cut']};
assert.deepEqual(store.load().completed,{});
assert(store.save({green:record},123));
assert.deepEqual(createProgressStore(()=>memory).load().completed,{green:record});
assert.equal(store.load().elapsed,123);
assert(store.save({red:record,duck:record,green:record},360));
assert.equal(Object.keys(store.load().completed).length,3);
assert(store.clear());assert.deepEqual(store.load().completed,{});assert.equal(records.get('unrelated'),'keep');
for(const raw of ['{broken','null','[]','{"version":99,"completed":{}}']){records.set(PROGRESS_KEY,raw);assert.deepEqual(store.load().completed,{});}
records.set(PROGRESS_KEY,JSON.stringify({version:1,completed:{red:{...record,score:99},duck:{...record,actions:['collect','collect','<script>']},unknown:record},elapsed:-1}));
assert.deepEqual(Object.keys(store.load().completed),['duck']);assert.deepEqual(store.load().completed.duck.actions,['collect']);assert.equal(store.load().elapsed,0);
const denied=createProgressStore(()=>{throw Error('Storage blocked')});assert.equal(denied.load().available,false);assert.equal(denied.save({red:record},100),false);assert.equal(denied.clear(),false);
const quota=createProgressStore(()=>({...memory,setItem(){throw Error('Quota exceeded')}}));assert.equal(quota.save({red:record},100),false);
console.log('Progress survives reload; all three stamps restore; reset is scoped; corrupt, unsupported and blocked storage safely handled.');
