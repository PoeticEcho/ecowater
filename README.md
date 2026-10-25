# EcoWater 3D · 에코워터 생태 탐험

아이패드 가로 화면을 위한 3개 수역, 약 10분의 관찰–원인 이해–대처–기억 확인 수업.

**체험 주소:** https://poeticecho.github.io/ecowater/

바다의 적조, 연못의 개구리밥, 강의 남조류 증식을 각각 탐험합니다. 수질의 변화를 관찰하고 원인을 확인한 다음, 직접 대응하거나 예방하는 활동과 기억 확인 2문제를 마치면 수역별 스탬프를 받습니다. 세 스탬프를 모으면 탐험이 완료됩니다. 완료 기록은 현재 브라우저에만 저장됩니다.

아이패드 가로 화면을 중심으로 설계했으며 터치·펜·마우스 입력을 지원합니다. WebGL을 사용할 수 없는 환경에서는 2D 관찰 모드로 전환합니다. 수치와 생물 표현은 학습용 모형이며 실제 수질 예측이나 방제 판단에 사용할 수 없습니다.

## 개발과 배포

- `npm run test`: 수질·교육 흐름, 독립 유영·경계·산소 반응·3D 지오메트리 검사
- `npm run build`: `dist/index.html` 생성
- 소스는 기능별 모듈과 SVG·WebP 에셋으로 관리한다. 배포물은 Three.js, OrbitControls, CSS, 에셋을 모두 포함하는 단일 HTML이며 외부 CDN을 사용하지 않는다.
- 기존 Sites 프로젝트와 공개 범위는 `.openai/hosting.json`에 연결되어 있다.

## 파일의 책임

| 파일 | 책임 |
| --- | --- |
| `app.js` | HUD, 패널, 교육 화면 전환, 입력, 장면과 상태 연결 |
| `model.mjs` | 수질·증식·피해·조치의 단순화된 수업 모형 |
| `course.mjs` | 시나리오 콘텐츠, 10일차 사건, 단계·퀴즈 |
| `src/biology/fish-motion.mjs` | 렌더링과 독립적인 개체별 목표 탐색, 군집·분리, 경계·도구 회피, 산소 반응 |
| `src/scene/fish.mjs` | 공유 지오메트리 기반 물고기 몸체·아가미·눈·지느러미·꼬리 애니메이션 |
| `src/scene/organisms.mjs` | 확대 와편모조류·개구리밥·남조류 군체, 인스턴스용 엽상체 |
| `src/scene/water.mjs` | 수면 파동·반사·증식 무늬, 수중 바닥 빛무늬 |
| `src/scene/habitat.mjs` | 수변 나무·하상 자갈·침수식물·고사목 |
| `src/education/field-guide.mjs` | 생물 도감, 생태학적 해석과 관찰 질문 |
| `assets/*.svg` | 직접 제작한 형태 설명 삽화, 현미경 사진이 아님 |
| `fallback.mjs` | WebGL 미지원 환경의 Canvas 2D 호환 관찰 모드; 같은 물고기 행동 상태 사용 |
| `shell.html`, `style.css` | 접근 가능한 화면 구조와 반응형 스타일 |

## 행동 모형

26마리의 물고기가 개별 난수 상태·속도·깊이 선호·목표점을 가진다. 목표 갱신 시간은 개체마다 다르며, 순항/느린 유영/짧은 가속을 섞는다. 가까운 이웃 회피와 약한 방향·군집 추종, 경계 회피를 합성한 후 속도를 부드럽게 바꾼다. 원형 궤도는 사용하지 않는다. 실제 종의 행동을 보정한 생태 예측 모형은 아니다.

적조 장면의 20마리는 4개 가두리에 배치하고, 나머지는 야생 개체로 표현한다. 가두리 이동 시 내부 개체의 좌표와 경계도 함께 이동한다. 저산소 상태는 유영 속도·깊이 선호에 연결한다. 폐사는 되돌리지 않는다. 유영 계산은 25ms 이하 단계, 이웃 수는 26마리로 제한한다. 꼬리 운동은 개체의 실제 속도에 연동한다.

## 교육상의 구분

- 적조·개구리밥·남조류는 같은 생물이 아니다. 생태적 역할과 과도한 증식의 영향을 구분한다.
- 녹색 물만으로 독성을 판단하지 않는다. 형태·밀도·산소·독소 검사와 현장 안내를 함께 본다.
- 광합성, 야간 호흡, 유기물 분해를 설명하되 이 앱의 DO가 실제 주야 변동을 계산한다고 주장하지 않는다.
- 수문 방류나 표층 혼합은 원인 제거와 다르다. 하류와 수역 전체의 상태를 고려한다.
- 확대 모형과 SVG는 구조 학습용이다. 정확한 종 동정, 실제 크기·배율, 현미경 실사로 사용하지 않는다. 개구리밥 도감은 뿌리 하나를 가지는 렘나형 예시다.
- 10일차, 지수, 회복 시간, 행동 변화는 교육용 압축·단순화이다. 실제 현장 예측이나 방제 지시가 아니다.

## 콘텐츠 근거

- 국립수산과학원 적조정보: https://www.nifs.go.kr/portal/pcon0000040/systA/actionConts.do
- NOAA, harmful algal blooms: https://oceanservice.noaa.gov/facts/habharm.html
- US EPA, cyanobacteria: https://www.epa.gov/habs/learn-about-harmful-algae-cyanobacteria-and-cyanotoxins
- US EPA, nutrients/oxygen pathways: https://www.epa.gov/caddis/nutrients
- RHS, duckweed morphology/ecology: https://www.rhs.org.uk/weeds/duckweed
- Smithsonian, harmful marine dinoflagellate taxa: https://naturalhistory.si.edu/research/botany/research/dinoflagellates/harmful-marine-dinoflagellate-taxa
- UNH PhycoKey, Microcystis colony morphology: https://cfb.unh.edu/phycokey/Choices/Cyanobacteria/cyano_colonies/MICROCYSTIS/Microcystis_key.html

## 검증 범위

자동 검사는 수질/교육 단계와 유영·지오메트리를 검증한다. WebGL 미지원 브라우저에서는 2D 호환 모드로 기능을 점검한다. 실제 iPad Safari의 GPU 출력, 터치 제스처, 장시간 프레임률은 실제 기기에서 별도로 확인해야 한다. 60fps를 보장하지 않는다.

## GitHub 시작하기

Node.js 20 이상에서 저장소를 내려받은 뒤 `npm ci`, `npm test`, `npm run build`를 순서대로 실행하세요. 완성본은 `dist/index.html`입니다. 로컬에서는 `python3 -m http.server 8080 --directory dist` 후 localhost:8080을 엽니다.

GitHub Pages의 Actions 배포 워크플로가 포함되어 있습니다. 저장소 Settings → Pages → Source를 GitHub Actions로 선택한 뒤 main 브랜치에 push하세요. `.git`, `node_modules`, 개인 Sites 프로젝트 설정·자격증명은 ZIP에서 제외했습니다.

이 저장소는 `PoeticEcho/ecowater`의 프로젝트 Pages를 대상으로 합니다. 기본 주소는 `https://poeticecho.github.io/ecowater/`이고, `main`에 변경 사항을 올리면 검사·빌드 후 `dist/`가 배포됩니다. 배포 실패 시 저장소 Actions의 **Publish Pages** 실행 기록을 확인하세요.

### 이미지와 공유

`assets/generated/`에 최종 파비콘(ICO, PNG), 1200×630 OG JPG, 생물 3종·풍경 3종의 WebP 이미지가 있습니다. 생성 삽화는 도감과 시나리오 선택·원인 설명에서 사용합니다. 세 생물 구조 삽화도 assets에 있습니다. 새 주소로 공개할 때 shell.html의 og:image를 실제 배포 주소의 절대 URL로 설정하세요. 논문 그림·현미경 사진으로 오인하지 않도록 삽화 표기를 유지하세요.

### 연구와 라이선스

`docs/RESEARCH.md`에서 근거와 구현의 경계를 확인하세요. Three.js 등 의존성에는 해당 패키지 라이선스가 적용됩니다. 프로젝트 자체의 공개 라이선스는 소유자가 결정해야 하므로 임의의 MIT 라이선스를 부여하지 않았습니다.

### 기기 확인

실제 iPad에서 회전·핀치·도구 배치·7초 패널 접힘·수역 전환·10일차 사건·회복·퀴즈를 확인하세요. WebGL 성능과 60fps는 보장하지 않습니다. 자동 행동 검사는 실제 어종 행동의 타당성 검증을 대체하지 않습니다.

## 에셋 통합 배포판

최종 파비콘은 OG에 맞춘 어두운 물빛·세이지색 물방울·잎 모티프입니다. 브라우저 탭은 ICO/32px PNG, iPad 홈 화면은 180px PNG를 사용합니다. `assets/generated/ASSETS.md`에 에셋별 의미와 생성 방식이 있습니다. 기각된 이전 파비콘 시안은 배포하지 않습니다.

이미지와 아이콘은 `dist/index.html`에 포함되어 다운로드한 HTML에서도 교육 화면을 열 수 있습니다. 공유 크롤러용 OG 이미지는 별도 공개 파일이므로 `dist/assets/`도 함께 배포하세요. GitHub Pages로 옮길 때 `shell.html`의 og:image 절대 주소를 새 도메인/저장소 경로에 맞추세요.

`npm test` 후 `npm run build`로 재생성하세요. 배포 폴더는 `dist/`입니다. ZIP에는 GitHub Pages 워크플로가 포함되어 있고 Sites의 개인 프로젝트 설정·Git 이력·자격증명·node_modules는 제외됩니다.

## 스탬프 미션 · 최종 정리판

- 세 수역마다 원인 도감 → 직접 회복 또는 예방 → 기억 확인 2문제를 마치면 스탬프를 얻습니다.
- 바다 지킴이 / 연못 지킴이 / 강 지킴이 3개를 모으면 학습 완료입니다. 퀴즈만 맞히거나 자유 실험을 하는 것으로는 획득하지 않습니다.
- 화면 오른쪽 위 스탬프북에서 모은 결과와 비교 리포트를 확인합니다. 완료한 수역과 스탬프, 완료 시점의 누적 학습 시간이 이 기기의 브라우저에 저장됩니다. 미완료 수역은 재방문 시 처음부터 시작합니다.
- 도구를 선택하면 마우스·펜·터치에 아이콘과 도구 이름이 따라옵니다. 손가락에 가리지 않도록 위로 띄우며, 수면 밖은 점선으로 표시합니다. 추천 위치 배치와 Escape/취소도 지원합니다.
- `assets/icons/`: Lucide 기반 27개 개별 SVG와 ISC 라이선스. 도구·설명·관찰·내비게이션을 같은 선 두께와 색으로 통일했습니다.
- `src/ui/`: 아이콘 레지스트리, 스탬프북, 포인터 미리보기. `src/education/achievements.mjs`: 학습 완료 조건.
- `src/scene/shore.mjs`: 반복 지형 텍스처, 얕은 물 자갈, 강변 풀과 바위. 작은 텍스처와 인스턴싱으로 부하를 제한합니다.

최종 검증 범위와 남은 기기 점검은 `docs/RELEASE-REVIEW.md`를 참고하세요.

## 학습 이어가기

`src/education/progress-store.mjs`가 버전이 있는 로컬 저장 형식을 관리합니다. 개인 정보나 서버 전송 없이 완료한 미션만 저장합니다. 시작 화면은 획득한 스탬프를 표시하고 다음 미완료 수역으로 안내합니다. 3개 완료 시 스탬프북으로 연결됩니다. 새 탐험은 확인 화면을 거친 뒤 이 앱의 저장 키만 지웁니다. 브라우저 데이터 삭제, 다른 기기나 도메인으로 이동하면 기록은 이어지지 않습니다. 저장 차단·용량 초과·손상 데이터는 안전하게 처리하고 학습 기능은 계속 제공합니다.
