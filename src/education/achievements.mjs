export function canEarnStamp(state){
  return state.mode==='guided' && (state.recovered || state.lesson.phase==='prevented' || state.lesson.prevention) && state.lesson.read && state.lesson.answers.length===2 && state.lesson.answers.every(a=>a?.correct);
}
