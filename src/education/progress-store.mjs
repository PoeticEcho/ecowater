// Only completed chapters are stored. No personal information or server sync.
export const PROGRESS_KEY='ecowater.learning.v1';
const ids=['red','duck','green'];
const actionKeys=['air','clay','cut','move','collect','flow','wheel'];
const validNumber=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
export function normalizeProgress(value){
  const empty={completed:{},elapsed:0};
  if(!value||value.version!==1||!value.completed||typeof value.completed!=='object')return empty;
  const completed={};
  for(const id of ids){
    const r=value.completed[id];
    if(!r||!Number.isInteger(r.score)||!validNumber(r.score,0,2)||!validNumber(r.peak,0,1)||!validNumber(r.day,0,100000)||!validNumber(r.elapsed,0,864000))continue;
    completed[id]={score:r.score,peak:r.peak,day:r.day,elapsed:r.elapsed,actions:[...new Set(Array.isArray(r.actions)?r.actions.filter(k=>actionKeys.includes(k)):[])]};
  }
  return {completed,elapsed:Object.keys(completed).length&&validNumber(value.elapsed,0,864000)?value.elapsed:0};
}
export function createProgressStore(getStorage=()=>globalThis.localStorage){
  return {
    load(){
      try{const raw=getStorage().getItem(PROGRESS_KEY);let parsed=null;try{parsed=JSON.parse(raw);}catch{}return {...normalizeProgress(parsed),available:true};}
      catch{return {completed:{},elapsed:0,available:false};}
    },
    save(completed,elapsed){
      try{const safe=normalizeProgress({version:1,completed,elapsed});getStorage().setItem(PROGRESS_KEY,JSON.stringify({version:1,...safe}));return true;}catch{return false;}
    },
    clear(){try{getStorage().removeItem(PROGRESS_KEY);return true;}catch{return false;}}
  };
}
