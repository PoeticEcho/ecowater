import {icon} from './icons.mjs';
// Pointer Events cover mouse, stylus and touch. Offset above a finger, never intercept input.
export function createToolPreview(actions,getSelection,isWater){
  const el=document.createElement('div');el.id='tool-preview';el.hidden=true;el.setAttribute('aria-hidden','true');document.body.appendChild(el);
  let last=null,key=null;
  function hide(){el.hidden=true;key=null;}
  function update(e=last){
    if(e)last={clientX:e.clientX,clientY:e.clientY,pointerType:e.pointerType};
    const selected=getSelection();
    if(!selected||!last||document.querySelector('dialog[open]')){hide();return;}
    if(key!==selected){key=selected;el.innerHTML=`<span>${icon(actions[key].icon)}</span><b>${actions[key].name}</b><small></small>`;}
    const valid=isWater(last);el.dataset.valid=String(!!valid);
    el.querySelector('small').textContent=valid?'여기에 배치':'수면으로 이동';
    const x=Math.max(78,Math.min(innerWidth-78,last.clientX));
    const y=Math.max(100,Math.min(innerHeight-70,last.clientY));
    el.style.left=x+'px';el.style.top=(y-(last.pointerType==='touch'?88:68))+'px';el.hidden=false;
  }
  document.addEventListener('pointermove',update);
  document.addEventListener('pointerdown',update);
  document.addEventListener('pointerup',e=>{last=e;if(e.pointerType==='touch')hide();});
  document.addEventListener('pointercancel',hide);
  document.addEventListener('pointerleave',hide);
  window.addEventListener('blur',hide);
  return {update,hide};
}
