# 방명록 UI·상태·동작 규칙

## 구성

- **섹션**: `components/sections/GuestbookSection.tsx` (서버) — 제목·부제·레이아웃
- **패널**: `components/guestbook/GuestbookPanel.tsx` (`"use client"`) — 로그 영역 + 입력 폼
- **데이터**: `data/guestbook.ts` — 타입, mock 목록, 게스트 파스텔 팔레트, 관리자 고정 말풍선 클래스

## 톤·레이아웃

- **대화형이 아닌 기록**: 실시간 채팅이 아니라 아카이브된 로그 느낌(모노스페이스 타임스탬프, 스크롤 영역)
- **admin**: 말풍선 **왼쪽** 정렬, 색상은 `adminBubbleClass`로 **고정**
- **guest**: **오른쪽** 정렬, `bubbleColor`에 따라 파스텔 말풍선
- **금지**: 타이핑 인디케이터, 온라인 상태, 읽음 표시 없음

## 입력 영역

- 닉네임, 메시지, **파스텔 색 스와치**(`guestBubblePalette`) — 게스트 글에만 적용
- 제출 시 **클라이언트 상태에만** 항목 추가(mock·데모). 새로고침 시 서버 mock으로 복귀
- 추후 서버 액션·API·DB 연동 시 이 동작을 대체

## 앵커

- 섹션 `id="guestbook"`, 히어로 내비 `방명록`과 연결

## 추후

- 서버 저장·관리자 검수·스팸 방지([admin.md](./admin.md))
- 빈 목록 카피, 전송 중/에러 처리
