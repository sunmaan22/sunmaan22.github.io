# sunmaan22.github.io

개인 포트폴리오 사이트. 순수 HTML/CSS/JS로 작성된 정적 다중 페이지 사이트로, 빌드 도구나 백엔드 없이 GitHub Pages에서 바로 서빙됩니다.

- 배포: https://sunmaan22.github.io
- `index.html` — 홈 (hero, 기술 스택, 프로젝트 카드 그리드)
- `projects/*.html` — 프로젝트별 상세 페이지
- `assets/css/style.css`, `assets/js/main.js` — 모든 페이지가 공유하는 디자인 시스템 및 스크립트

## 로컬에서 보기

별도 서버 없이 `index.html`을 브라우저로 바로 열면 됩니다.

## 페이지 추가하기

1. `projects/`에 새 HTML 파일을 만들고, 기존 상세 페이지의 `<nav>`·`page-hero`·`project`/`project.dark` 구조를 그대로 복사
2. `index.html`의 `project-grid`에 카드 링크 추가, `<nav>`에 링크 추가 (모든 페이지의 nav에 반영)
