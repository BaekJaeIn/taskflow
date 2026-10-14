# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

TaskFlow는 TDD 기반 할 일 관리 앱입니다. 개발은 테스트 주도 개발 방식을 따릅니다. 실패하는 테스트를 먼저 작성한 뒤 구현합니다.

## 현재 상태

현재 저장소는 빈 스캐폴드입니다. 소스 코드, 패키지 매니페스트, 도구 설정이 아직 없어서 확정된 빌드/린트/테스트 명령어가 없습니다. `package.json` 스크립트가 만들어지면 단일 테스트 실행 방법(Vitest, Playwright)을 포함한 실제 명령어를 여기에 추가하고 이 섹션은 삭제하세요.
## 구조

- `backend/` — 서버 측 코드 (Hono, Drizzle ORM, SQLite, Zod). 테스트는 `backend/tests/`에 위치
- `frontend/` — 클라이언트 앱 (React, Vite, TailwindCSS)
- `e2e/` — 프론트엔드와 백엔드를 아우르는 E2E 테스트 (Playwright)

단위/통합 테스트는 Vitest를 사용합니다.

원격 저장소: https://github.com/BaekJaeIn/taskflow.git (로컬에는 아직 `.git`이 없어 `git init` 및 remote 연결이 필요함)
