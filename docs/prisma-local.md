# 로컬에서 Prisma — 스키마 반영·클라이언트 생성·시드

Neon 등 **PostgreSQL**에 연결해 `prisma/schema.prisma`를 DB에 맞추고, `@prisma/client`를 생성한 뒤 초기 데이터를 넣는 절차입니다.

---

## 사전 준비

1. **의존성 설치** (최초 1회 또는 `package.json` 변경 후)

   ```bash
   npm install
   ```

2. **환경 변수**  
   프로젝트 루트 `.env`에 PostgreSQL 연결 문자열을 둡니다.

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   ```

   예시 키 이름만 보고 싶다면 루트 `.env.example`을 참고하세요.

3. **Prisma가 `.env`를 읽음**  
   `npx prisma …` 명령은 기본적으로 루트 `.env`의 `DATABASE_URL`을 사용합니다. 값이 없으면 `prisma validate` 등이 실패합니다.

---

## 권장 순서 (로컬)

아래는 **스키마를 처음 DB에 올리거나 변경 후 반영**할 때의 일반적인 흐름입니다.

### 1) 스키마 검증 (선택)

```bash
npx prisma validate
```

`DATABASE_URL`이 비어 있으면 오류가 납니다. CI나 스키마만 확인할 때는 임시로 유효한 형식의 URL을 넣어도 됩니다(실제 DB 연결은 하지 않아도 `validate`는 통과할 수 있음).

### 2) DB에 스키마 반영 (`db push`)

로컬·개발 DB에 테이블을 맞출 때:

```bash
npx prisma db push
```

- 마이그레이션 파일을 쌓지 않고, 현재 `schema.prisma`와 DB를 **동기화**합니다.  
- 팀·운영에서는 `prisma migrate dev`로 이력을 남기는 편이 안전합니다(별도 정책에 따름).

### 3) Prisma Client 생성

스키마를 바꾼 뒤 타입·클라이언트를 갱신할 때:

```bash
npm run db:generate
```

(`db push` 직후에 자동 생성되는 경우도 있으나, **스키마만 수정한 뒤**에는 `generate`를 한 번 돌리는 습관이 안전합니다.)

### 4) 시드 (초기 데이터)

```bash
npm run db:seed
```

- `package.json`의 `prisma.seed` → `npx tsx prisma/seed.ts`  
- 기존 `data/*.ts` mock과 맞춘 샘플 데이터가 들어갑니다.  
- **프로젝트** 행은 시드마다 `deleteMany` 후 다시 넣는 방식이라, 로컬 반복용입니다. 운영 DB에서는 백업 후 실행하세요.

### 5) 데이터 확인 (선택)

```bash
npm run db:studio
```

브라우저에서 테이블 내용을 확인할 수 있습니다.

---

## 한 줄 요약

`.env`에 `DATABASE_URL`을 넣은 뒤:

```bash
npx prisma db push
npm run db:generate
npm run db:seed
```

(`db:generate`는 위 순서에서 생략해도 되는 경우가 있으나, 스키마 변경 후에는 명시적으로 실행하는 것을 권장합니다.)

---

## npm 스크립트 참고

| 스크립트 | 설명 |
|----------|------|
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | `prisma db push` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | `prisma db seed` → `prisma/seed.ts` |
| `npm run db:studio` | `prisma studio` |

---

## 관련 문서·파일

- [cms-prisma-design.md](./cms-prisma-design.md) — 모델 설계·시드 의도
- [ERD.md](./ERD.md) — 관계도(Mermaid)
- `prisma/schema.prisma`, `prisma/seed.ts`, `lib/prisma.ts`
