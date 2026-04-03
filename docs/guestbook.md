# 방명록 UI·상태·동작 규칙

## 구성

- **섹션**: `components/sections/GuestbookSection.tsx` (서버) — 전용 페이지 `app/guestbook/page.tsx`에서 렌더(제목·부제·레이아웃)
- **패널**: `components/guestbook/GuestbookPanel.tsx` (`"use client"`) — 로그 영역 + 입력 폼
- **데이터**: `data/guestbook.ts` — 타입, mock 목록, 게스트 파스텔 팔레트, 관리자 고정 말풍선 클래스

## 톤·레이아웃

- **대화형이 아닌 기록**: 실시간 채팅이 아니라 아카이브된 로그 느낌(모노스페이스 타임스탬프, 스크롤 영역)
- **레이아웃(페이지)**: 메시지 리스트(스크롤 카드)와 입력 폼(입력 카드)을 구분된 섹션으로 배치하고, 패널은 `max-w-2xl` 수준에서 중앙 정렬해 “게시판처럼 퍼지는” 인상을 줄입니다.
- **admin**: 말풍선 **왼쪽** 정렬, 색상은 `adminBubbleClass`로 **고정**
- **guest**: **오른쪽** 정렬, `bubbleColor`에 따라 파스텔 말풍선
- **금지**: 타이핑 인디케이터, 온라인 상태, 읽음 표시 없음

## 입력 영역

- 닉네임, 메시지, **파스텔 색 스와치**(`guestBubblePalette`) — 게스트 글에만 적용
- 제출 시 **클라이언트 상태에만** 항목 추가(mock·데모). 새로고침 시 서버 mock으로 복귀
- 추후 서버 액션·API·DB 연동 시 이 동작을 대체

## 앵커

- 히어로/헤더의 `방명록` 버튼은 `href="/guestbook"`로 연결

## 메인 섹션으로 돌아갈 때(내비)

방명록에서 상단 메뉴로 메인의 `/#about` 등으로 이동할 때, 메인 홈의 **인트로 최소 대기**와 **앵커 스크롤** 문제를 피하기 위해 별도 패턴을 씁니다. 배경·파일·주의사항은 **[guestbook-main-navigation.md](./guestbook-main-navigation.md)** 를 참고하세요.

## 추후

- 서버 저장·관리자 검수·스팸 방지([admin.md](./admin.md))
- 빈 목록 카피, 전송 중/에러 처리
