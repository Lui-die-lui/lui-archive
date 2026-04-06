# Lui Archive

## 1. 프로젝트 소개

**Lui Archive**는 개인 포트폴리오 웹사이트이자, 동시에 Next.js 기반으로 동작하는 소규모 콘텐츠 관리 구조를 갖춘 프로젝트입니다. 방문자에게는 한 화면에서 소개·기술·프로젝트·학습 이력을 순서대로 훑을 수 있는 흐름을 제공하고, 외부 링크(GitHub README, 배포 서비스 등)로 근거를 바로 확인할 수 있게 연결합니다. 운영 측면에서는 PostgreSQL에 콘텐츠를 두고 관리자 경로에서만 수정할 수 있게 해, “보여주는 페이지”와 “데이터·권한”을 분리했습니다. 화면 연출만이 아니라 정보 구조(섹션 순서, 앵커 내비, 카드 단위 정보 분리)와 유지보수 단위(섹션·API·문서)를 같이 맞추는 데 초점을 두었습니다.

## 2. 배포 링크

| 구분 | URL |
|------|-----|
| 프로덕션(배포 사이트) | `https://` *(본인 배포 URL을 기입하세요)* |
| 저장소 | `https://` *(GitHub 등 원격 저장소 URL을 기입하세요)* |

## 3. 프로젝트 기간

- **개발·기능 정리**: *(시작 월~종료 월 등 본인 일정 기입)*
- **프로덕션 배포 완료**: 2026년 4월 기준

## 4. 기술 스택

### Frontend

- Next.js 16 (App Router), React 19, TypeScript
- 서버 컴포넌트와 클라이언트 컴포넌트를 구간별로 나누어 사용

### Styling

- Tailwind CSS v4, PostCSS (`@tailwindcss/postcss`)
- `class-variance-authority`, `clsx`, `tailwind-merge`로 클래스 조합 정리

### Backend / Data / Auth

- PostgreSQL, Prisma ORM (`@prisma/client` 6.x)
- Firebase Authentication(Google 로그인), Firebase Admin(ID 토큰 검증)
- Firebase Storage(프로젝트 썸네일 등 업로드)
- About 섹션 GitHub 기여 카드: GitHub GraphQL API(서버 전용, 토큰은 서버 환경 변수)

### Deployment / Infra

- 프론트·서버리스 함수: Vercel 배포 전제
- DB 호스팅: Supabase(Postgres) 연동 전제(풀러 URL + `pgbouncer=true` 등)

### Tools / 기타 라이브러리

- `@dnd-kit`(관리자 화면에서 프로젝트·자격증 순서 변경)
- Recharts(관리자 대시보드 방문·방명록 추이 차트)
- ESLint(`eslint-config-next`)

## 5. 주요 기능

### 방문자(사용자) 관점

- **스크롤 기반 단일 메인 페이지**: Hero → About → Skills → Projects → Certs → 방명록 진입 → Footer 순으로 한 흐름에서 정보를 읽도록 구성
- **About**: GitHub 기여 활동을 카드 형태로 요약(서버에서 GraphQL 조회)
- **Skills**: 카테고리별 기술·설명 표시(모바일 캐러셀, 넓은 화면 그리드)
- **Projects**: 카드별 요약, 기술 태그, **README 링크**와 **Live 링크**(배포 URL이 있을 때만 노출)
- **Certs**: 수료·자격 정보, 공개 링크 유무에 따른 표시 구분
- **Guestbook**: 별도 라우트(`/guestbook`)에서 방문 메시지 작성·열람(수신 설정에 따라 비관리자 작성 제한 가능)
- **상단 내비·앵커**: 섹션 이동과 스크롤 보정을 고려한 구조

### 관리자·운영 관점

- **`/admin`**: 허용된 Google 계정만 세션 발급(이메일 화이트리스트 + Firebase 검증)
- **대시보드**: 방문 로그·방명록 요약, 방명록 수신 ON/OFF(`SiteSettings`)
- **Projects / Certs**: DB 연동 CRUD, 드래그로 정렬 후 저장, 프로젝트 썸네일은 Storage 업로드 후 URL 저장
- **Guestbook**: 관리자 답글·삭제·일괄 선택 삭제 등 운영 동작

## 6. 페이지·섹션 구성

| 경로·위치 | 설명 |
|-----------|------|
| `/` | 메인 포트폴리오: 위 절 순서의 섹션 |
| `/guestbook` | 방명록 전용 페이지(문서 스크롤 잠금 등 레이아웃 분리) |
| `/admin/login` | 관리자 Google 로그인 |
| `/admin` | 대시보드 및 설정 |

섹션을 페이지 단위로 쪼개지 않고 메인은 한 페이지에 두어, 채용·협업 맥락에서 **스크롤 한 번에 전체 맥락**을 보도록 했습니다. 방명록만 트래픽·레이아웃 특성상 별도 URL로 분리했습니다.

## 7. 프로젝트 구조

```
app/              App Router 페이지, API Route, 레이아웃
components/       섹션·레이아웃·UI·관리자·게스트북 등
data/             타입·정적 보조 데이터
lib/              Prisma 클라이언트, 인증·API 보조 로직
prisma/           schema.prisma, seed 스크립트
docs/             설계·운영·트러블슈팅 문서(인덱스: docs/README.md)
public/           정적 자산
```

`src/` 디렉터리는 사용하지 않습니다. 기능별로 `components/sections`, `components/admin` 등 하위 폴더로 나누어 찾기 쉽게 유지했습니다.

## 8. 구현하면서 신경 쓴 포인트

- **정보 전달 우선**: 프로젝트 카드에서 설명·태그·README·Live를 역할별로 분리해, “무엇을 했는지 / 무엇으로 만들었는지 / 어디서 확인할 수 있는지”를 빠르게 구분할 수 있게 함
- **섹션 단위 유지보수**: 메인 페이지는 섹션 컴포넌트 조합으로 유지해, 한 영역 수정이 다른 영역으로 번지지 않도록 함
- **데이터와 UI 분리**: 공개 페이지는 Prisma로 DB 조회, 민감한 쓰기·관리는 `/admin`과 API 라우트에서만 처리
- **접근 제어**: 관리자 이메일 고정 + Firebase 토큰 검증으로 단순하지만 명확한 1인 운영 모델 유지
- **배포 환경 가정**: 서버리스에서 DB 연결 수·PgBouncer 제약을 고려해 Prisma 연결 문자열(`DATABASE_URL` / `DIRECT_URL`) 역할을 나눔

## 9. 트러블슈팅·개선 포인트

- **Supabase Transaction pooler + Prisma**: 풀러 URL에 `pgbouncer=true`가 빠지면 `prepared statement already exists`(Postgres `42P05`) 등 쿼리 오류가 발생할 수 있음. Vercel의 `DATABASE_URL`에 Prisma·Supabase 문서에 맞는 파라미터를 포함했는지 확인하는 과정이 필요했음
- **관리자 대시보드·DB**: 배포 환경 변수 누락 또는 스키마 미반영 시 통계 쿼리 실패 → `DATABASE_URL`·`SiteVisit` 등 테이블 존재 여부를 기준으로 점검
- **문서화**: 동일 이슈 재발 방지를 위해 `docs/troubleshooting-prisma-supabase-pooler.md` 등에 원인·대응을 남김

## 10. 아쉬운 점 및 추후 개선 예정

우선순위를 붙여 정리합니다.

1. **높음**: Prisma를 `db push` 중심에서 **`migrate` 이력 관리**로 전환해, 환경별 스키마 변경을 추적 가능하게 할 것
2. **중간**: 관리자 기능·API에 대한 **자동 테스트**(핵심 API·인증 플로우) 보강
3. **중간**: 방명록·대시보드 등 **접근성**(키보드·스크린리더) 점검 및 개선
4. **낮음**: 콘텐츠 다국어 필요 시 i18n 구조 검토(현재는 한국어 중심)

## 11. 실행 방법

```bash
# 1. 저장소 클론
git clone <원격-저장소-URL>
cd lui-archive

# 2. 의존성 설치
npm install

# 3. 환경 변수
# 루트에 .env 파일을 만들고 아래 §12 항목을 채웁니다. (.env.example 참고)

# 4. DB 스키마 반영(로컬 또는 대상 DB URL 기준)
npx prisma db push
npm run db:generate

# 5. 개발 서버
npm run dev
# http://localhost:3000

# 6. 프로덕션 빌드·실행
npm run build
npm start
```

개발용 초기 데이터가 필요하면 `npm run db:seed`를 사용할 수 있습니다. **운영 DB에는 시드가 기존 데이터를 지우는 구간이 있으므로 실행 전 반드시 확인**하세요.

## 12. 환경 변수

실제 비밀 값은 저장소에 넣지 않습니다. 이름과 용도만 정리합니다.

| 변수명 | 용도 |
|--------|------|
| `DATABASE_URL` | Prisma 런타임·빌드 시 DB 연결. Supabase **pooler** 사용 시 `pgbouncer=true` 포함 권장 |
| `DIRECT_URL` | `prisma db push` / migrate / Studio 등 **직접 연결**(일반적으로 5432) |
| `GITHUB_USERNAME` | About GitHub 카드용(선택, 실패 시 핸들 폴백 등) |
| `GITHUB_TOKEN` | GitHub GraphQL 호출(서버 전용, PAT) |
| `ADMIN_EMAIL` | 관리자로 인정할 Google 계정 이메일 |
| `ADMIN_SESSION_SECRET` | 관리자 세션 HMAC용 시크릿 |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin 프로젝트 ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin 서비스 계정 이메일 |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin 개인 키(줄바꿈은 `\n` 이스케이프 등) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API 키 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage 버킷 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM 발신자 ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase 앱 ID |

상세 예시와 주의사항은 루트 **`.env.example`** 및 **`docs/`** 문서를 참고하세요.

## 13. 작성자 정보

- **이름**: *(기입)*
- **역할 / 포지션**: *(기입)*
- **연락처**: *(이메일·GitHub 프로필 등 기입)*
- **이 저장소**: `private`일 수 있음 — 공개 정책은 저장소 소유자 기준

---

상세 설계·화면 규칙·DB 이식 절차는 **[docs/README.md](./docs/README.md)** 에서 모아 볼 수 있습니다.
