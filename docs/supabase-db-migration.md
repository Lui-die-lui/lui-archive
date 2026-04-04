# Supabase(또는 Postgres 간) 데이터 이식 — `pg_dump` / `psql`

로컬·기존 PostgreSQL에 쌓인 **행 데이터**를 Supabase 등 다른 인스턴스로 옮길 때의 절차입니다.  
**스키마(테이블)는 이미 대상 DB에 반영된 상태**라고 가정합니다 (`npx prisma db push` 등). 데이터만 복사하는 방식입니다.

환경 변수 이름·연결 문자열 형식은 루트 `.env.example`과 [prisma-local.md](./prisma-local.md)를 함께 참고하세요.

---

## 사전 조건

1. **원본 DB**  
   데이터가 들어 있는 PostgreSQL (예: 로컬 Docker `localhost:포트`, DB 이름 `lui_archive` 등).

2. **대상 DB (Supabase)**  
   - `prisma/schema.prisma`와 맞는 **테이블·열이 이미 존재**해야 합니다.  
   - 대상에 `DIRECT_URL`(직접 연결, 보통 **포트 5432**)을 사용합니다.  
   - Transaction pooler(6543)는 대용량 `psql` 복원에 부적합할 수 있어 **직접 연결**을 권장합니다.

3. **클라이언트 도구**  
   호스트에 `pg_dump`, `psql`이 있어야 합니다.

   - **Windows**: [PostgreSQL 공식 설치](https://www.postgresql.org/download/windows/) 시 포함되는 `bin` 경로 예시  
     `C:\Program Files\PostgreSQL\18\bin\pg_dump.exe`  
     `C:\Program Files\PostgreSQL\18\bin\psql.exe`  
   - PATH에 없으면 위와 같이 **전체 경로**로 실행합니다.

4. **`.gitignore`**  
   덤프 파일 `data.sql`은 루트에 두지 않거나, 저장 시 `/data.sql`이 무시되도록 되어 있습니다(실수 커밋 방지).

---

## 흐름 요약

| 단계 | 설명 |
|------|------|
| 1 | 대상 Supabase에 스키마만 맞춤 (`DATABASE_URL`/`DIRECT_URL`을 대상으로 `npx prisma db push`) |
| 2 | 원본에서 **`public` 스키마·데이터만** SQL로 덤프 |
| 3 | 대상 `DIRECT_URL`로 **`psql`로 덤프 파일 실행** (SSL 필요) |
| 4 | `npx prisma studio` 등으로 행 수·내용 확인 |

---

## 1) 대상에 스키마 반영 (이미 했다면 생략)

대상 연결 문자열을 `.env`의 `DIRECT_URL`(또는 이식 전용으로 임시 지정)에 맞춘 뒤:

```bash
npx prisma db push
```

원본·대상 **스키마가 동일**해야 아래 데이터만 이식이 안전합니다.

---

## 2) 원본에서 데이터만 덤프

연결 정보는 **원본** 호스트·포트·DB명·사용자·비밀번호에 맞게 바꿉니다.

### URI로 한 줄에 넣는 경우 (비밀번호에 `!` 등 특수문자가 있으면 이스케이프·따옴표 주의)

```bash
pg_dump "원본_DB_URL" --data-only --schema=public --no-owner --no-acl -f data.sql
```

### Windows PowerShell에서 `PGPASSWORD` 사용 (특수문자 비밀번호에 유리)

```powershell
$env:PGPASSWORD = '원본_비밀번호'
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" `
  -h localhost `
  -p 3311 `
  -U postgres `
  -d lui_archive `
  --data-only `
  --schema=public `
  --no-owner `
  --no-acl `
  -f "data.sql"
```

**플래그 설명**

| 플래그 | 의미 |
|--------|------|
| `--data-only` | 테이블 구조는 제외하고 **INSERT/COPY 데이터만** |
| `--schema=public` | Prisma 기본 스키마만 (Supabase 시스템 스키마와 충돌 완화) |
| `--no-owner --no-acl` | 역할·권한 차이로 복원 실패하는 경우 줄임 |

실행 후 프로젝트 루트(또는 지정한 경로)에 `data.sql`이 생성됩니다.

---

## 3) 대상 Supabase에 복원

**직접 연결** 호스트·포트·DB·사용자는 Supabase 대시보드 **Connect**에서 확인합니다.  
SSL이 필요하므로 아래처럼 `sslmode=require`를 쓰거나 환경 변수 `PGSSLMODE=require`를 둡니다.

### URI 사용

```bash
psql "postgresql://postgres:비밀번호@db.<project-ref>.supabase.co:5432/postgres?sslmode=require" -v ON_ERROR_STOP=1 -f data.sql
```

### Windows PowerShell + `PGPASSWORD` / `PGSSLMODE`

```powershell
$env:PGPASSWORD = 'Supabase_DB_비밀번호'
$env:PGSSLMODE = 'require'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" `
  -h db.<project-ref>.supabase.co `
  -p 5432 `
  -U postgres `
  -d postgres `
  -v ON_ERROR_STOP=1 `
  -f "data.sql"
```

성공 시 `COPY n` 형태로 테이블별로 들어간 행 수가 출력됩니다.

---

## 4) 확인

```bash
npx prisma studio
```

`.env`의 `DATABASE_URL` / `DIRECT_URL`이 **대상 Supabase**를 가리키는지 확인한 뒤, 프로젝트·방명록·설정 등이 기대와 맞는지 봅니다.

---

## 하지 말 것

- **운영·이식 직후 대상 DB에서 `npm run db:seed` 실행 금지**  
  `prisma/seed.ts`는 프로젝트·자격증·방명록 등을 `deleteMany` 후 다시 넣는 구간이 있어, 이식한 데이터가 지워질 수 있습니다.

---

## `.env` 정리

- `DATABASE_URL`(풀러)과 `DIRECT_URL`(직접)을 Supabase 문서에 맞게 둡니다.  
- **같은 키 `DATABASE_URL`을 로컬·Supabase에 중복 정의**하면, 로더에 따라 **마지막 줄만** 적용되는 경우가 많습니다. 로컬 개발과 배포를 나누려면 파일을 정리하거나 변수명을 분리하는 편이 안전합니다.

---

## (참고) 스키마+데이터 통째 덤프

대상이 비어 있고 **원본과 동일 구조로 새로 깔아도 될 때**는 `--data-only` 없이 `pg_dump` 후 `pg_restore` 또는 `psql`로 넣는 방식도 가능합니다. 팀 정책·Supabase 기본 객체와의 충돌 여부를 확인하세요.

---

## 관련 문서·파일

- [prisma-local.md](./prisma-local.md) — `db push`, `generate`, 시드
- [cms-prisma-design.md](./cms-prisma-design.md) — 모델·시드 의도
- `prisma/schema.prisma`, `.env.example`, 루트 `.gitignore` (`/data.sql`)
