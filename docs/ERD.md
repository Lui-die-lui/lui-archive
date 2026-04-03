# ERD (Entity Relationship Diagram)

`prisma/schema.prisma` 기준 엔티티와 관계를 **Mermaid** `erDiagram`으로 표현합니다. GitHub·VS Code 미리보기·Notion 등에서 Mermaid를 지원하면 그래프로 렌더됩니다.

---

## 관계도

```mermaid
erDiagram
  SkillCategoryContent {
    SkillCategorySlug slug PK
    string techStack
    string description
    datetime createdAt
    datetime updatedAt
  }

  Project {
    string id PK
    string publicId UK
    string title
    string summary
    string thumbnailUrl
    string readmeUrl
    string deployUrl
    int sortOrder
    datetime createdAt
    datetime updatedAt
  }

  ProjectTechLine {
    string id PK
    string projectId FK
    int sortOrder
    string label
  }

  ProjectTagOnProject {
    string projectId PK_FK
    ProjectKindTag tag PK
  }

  Certification {
    string id PK
    string title
    string issuer
    string issuedAtLabel
    string url
    boolean hasPublicLink
    string avatarText
    CertAvatarVariant avatarVariant
    int sortOrder
    datetime createdAt
    datetime updatedAt
  }

  GuestbookEntry {
    string id PK
    GuestbookAuthorType authorType
    string nickname
    string message
    GuestbookBubbleColor bubbleColor
    datetime createdAt
  }

  SiteSettings {
    int id PK
    boolean guestbookSubmissionsOpen
    datetime updatedAt
  }

  SiteVisit {
    string id PK
    datetime createdAt
  }

  Project ||--o{ ProjectTechLine : "techLines"
  Project ||--o{ ProjectTagOnProject : "tagLinks"
```

---

## Enum (참고)

관계 테이블이 아닌 **열거형**은 아래와 같습니다. ERD에는 타입 이름만 표기했습니다.

| Enum | 용도 |
|------|------|
| `SkillCategorySlug` | 스킬 카드 4슬롯 PK |
| `ProjectKindTag` | 프로젝트 태그 (`TEAM`, `PERSONAL`, `IN_PROGRESS`) |
| `CertAvatarVariant` | 수료 카드 아바타 스타일 |
| `GuestbookAuthorType` | 방명록 작성자 |
| `GuestbookBubbleColor` | 게스트 말풍선 색 |

---

## 관련 문서

- [cms-prisma-design.md](./cms-prisma-design.md) — 모델 역할·운영 단위
- `prisma/schema.prisma` — 단일 소스
