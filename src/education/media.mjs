import redOrganism from '../../assets/generated/dinoflagellate.webp';
import duckOrganism from '../../assets/generated/duckweed.webp';
import greenOrganism from '../../assets/generated/microcystis.webp';
import redScene from '../../assets/generated/coastal-red-tide.webp';
import duckScene from '../../assets/generated/duckweed-pond.webp';
import greenScene from '../../assets/generated/river-bloom.webp';
export const media={red:{organism:redOrganism,scene:redScene,caption:'연안 양식장 · 적갈색 집적'},duck:{organism:duckOrganism,scene:duckScene,caption:'정체된 연못 · 수면 피복'},green:{organism:greenOrganism,scene:greenScene,caption:'보 상류 · 남조류 표층 집적'}};
export function landscape(id){const m=media[id];return `<figure class="habitat-plate"><img src="${m.scene}" alt="${m.caption}을 표현한 교육용 생성 삽화" width="1400" height="788"><figcaption>${m.caption} · 실제 현장 사진이 아닌 교육용 삽화</figcaption></figure>`;}
