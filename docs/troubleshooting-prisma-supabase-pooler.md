# 트러블슈팅: Prisma + Supabase 풀러 — `prepared statement already exists` (42P05)

## 증상

배포(Vercel 등) 후 로그나 화면에 다음과 비슷한 오류가 납니다.

- `PrismaClientUnknownRequestError`
- Postgres `code: "42P05"`
- `prepared statement "s6" already exists` (번호는 매번 다를 수 있음)

Skills·프로젝트·관리자 대시보드 등 **DB를 쓰는 모든 경로**에서 발생할 수 있습니다.

## 원인

**Supabase Transaction pooler**(PgBouncer, 보통 포트 **6543**)와 Prisma의 **prepared statement** 사용 방식이 맞지 않을 때 자주 발생합니다.  
연결 풀에서 요청이 다른 서버 세션으로 갈 때 동일 이름의 prepared statement가 이미 있다고 Postgres가 거절하는 패턴입니다.

## 해결

**Vercel(및 런타임)의 `DATABASE_URL`** 이 Supabase **pooler**를 가리킬 때, 연결 문자열에 **`pgbouncer=true`** 가 반드시 포함되어야 합니다.

예시(형식만 참고, 값은 대시보드에서 복사):

```text
postgresql://postgres.xxxx:[PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres?pgbouncer=true
```

이미 `?sslmode=require` 등 다른 쿼리가 있으면 **`&pgbouncer=true`** 로 이어 붙입니다.

```text
...?sslmode=require&pgbouncer=true
```

1. Supabase **Dashboard → Connect → ORMs → Prisma** 에서 안내하는 **Transaction pooler** URI를 복사해, `pgbouncer=true` 가 들어 있는지 확인합니다.  
2. **Vercel → Project → Settings → Environment Variables** 에서 Production(필요 시 Preview)의 `DATABASE_URL` 을 위와 같이 수정합니다.  
3. **Redeploy** 합니다.

`DIRECT_URL`(포트 5432 직접 연결)은 **`db push` / `migrate` / Studio** 용으로 두고, **앱 런타임 Prisma 쿼리는 pooler `DATABASE_URL`** 을 쓰는 현재 구조를 유지하면 됩니다. `pgbouncer=true` 는 **pooler URL에만** 필요합니다.

## 참고

- [Prisma — Configure Prisma Client with PgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#configure-prisma-client-with-pgbouncer)
- 루트 `.env.example` 의 `DATABASE_URL` 주석

## 관련 문서

- [supabase-db-migration.md](./supabase-db-migration.md) — 데이터 이식
- [prisma-local.md](./prisma-local.md) — 로컬 Prisma 절차
