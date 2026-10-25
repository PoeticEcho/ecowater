export {canEarnStamp} from '../education/achievements.mjs';
import {icon} from './icons.mjs';
export const stampNames={red:'바다 지킴이',duck:'연못 지킴이',green:'강 지킴이'};
export function stamp(id,earned=false){return `<div class="eco-stamp stamp-${id} ${earned?'is-earned':''}" aria-label="${stampNames[id]} · ${earned?'획득':'미획득'}">${icon(earned?'check':id==='red'?'fish':id==='duck'?'leaf':'water')}<b>${stampNames[id]}</b><small>${earned?'배움 완료':'탐험 대기'}</small></div>`;}
export function passport(completed){return Object.keys(stampNames).map(id=>stamp(id,!!completed[id])).join('');}
