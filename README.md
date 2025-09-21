
# 토스 스타일 금융 앱

토스 스타일의 모던한 금융 서비스 웹 애플리케이션입니다. Next.js 14, TypeScript, Tailwind CSS를 기반으로 구축되었습니다.

## 🚀 주요 기능

### 🔐 인증 시스템
- **로그인/회원가입**: 이메일 기반 인증
- **2단계 인증 (2FA)**: 보안 강화를 위한 추가 인증 단계
- **JWT 토큰**: 안전한 세션 관리

### 💰 계좌 관리
- **계좌 목록**: 사용자의 모든 계좌 조회
- **계좌 상세**: 잔액 및 거래 내역 확인
- **주계좌 설정**: 기본 계좌 지정

### 💸 송금 시스템
- **송금 플로우**: 확인 → 인증 → 확정 단계
- **Idempotency Key**: 중복 송금 방지
- **실시간 잔액 확인**: 송금 전 잔액 검증
- **송금 내역**: 완료된 송금 추적

### 📊 거래 내역
- **페이징**: 대량 데이터 효율적 처리
- **필터링**: 계좌별, 기간별 필터
- **검색**: 거래 내역 검색 기능

### 🔔 알림 시스템
- **실시간 알림**: 송금, 입금 알림
- **읽음 상태**: 알림 읽음/안읽음 관리

## 🛠 기술 스택

### Frontend
- **Next.js 14**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **React Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증

### Testing & Quality
- **Storybook**: 컴포넌트 카탈로그
- **Playwright**: E2E 테스트
- **Jest + React Testing Library**: 단위 테스트
- **ESLint + Prettier**: 코드 품질 관리

### Mock & Development
- **MSW (Mock Service Worker)**: API 모킹
- **React Query Devtools**: 개발 도구

### Backend (Legacy)
- **Flask**: Python 웹 프레임워크 (기존 백엔드)
- **SQLite**: 데이터베이스

## 📁 프로젝트 구조

```
Financial-Home-Page/
├── frontend/                 # Next.js 프론트엔드 (메인)
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── lib/             # 유틸리티 및 설정
│   │   ├── stores/          # Zustand 스토어
│   │   ├── types/           # TypeScript 타입
│   │   └── mocks/           # Mock API
│   ├── tests/               # E2E 테스트
│   ├── .storybook/          # Storybook 설정
│   └── README.md            # 프론트엔드 문서
└── README.md               # 프로젝트 전체 문서
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 프론트엔드 실행 (권장)

1. **프론트엔드 디렉토리로 이동**
   ```bash
   cd frontend
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   앱이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

4. **Storybook 실행**
   ```bash
   npm run storybook
   ```
   Storybook이 [http://localhost:6006](http://localhost:6006)에서 실행됩니다.

### 백엔드 실행 (선택사항)

기존 Flask 백엔드를 사용하려면:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

## 🧪 테스트

### E2E 테스트
```bash
cd frontend
npm run test:e2e
```

### 단위 테스트
```bash
cd frontend
npm run test
```

### 테스트 커버리지
```bash
cd frontend
npm run test:coverage
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: 토스 블루 (#0ea5e9)
- **Secondary**: 그레이 톤
- **Success**: 그린 (#22c55e)
- **Warning**: 옐로우 (#f59e0b)
- **Error**: 레드 (#ef4444)

### 컴포넌트
- **Button**: 5가지 변형 (primary, secondary, outline, ghost, destructive)
- **Input**: 라벨, 에러, 헬퍼 텍스트 지원
- **Card**: 3가지 스타일 (default, elevated, outlined)
- **Modal**: 접근성 준수, 키보드 네비게이션

## 🔧 API 명세

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/2fa` - 2단계 인증

### 계좌
- `GET /api/accounts` - 계좌 목록
- `GET /api/accounts/:id` - 계좌 상세

### 거래
- `GET /api/transactions` - 거래 내역 (페이징)
- `POST /api/transfer` - 송금

### 알림
- `GET /api/notifications` - 알림 목록
- `PATCH /api/notifications/:id/read` - 알림 읽음 처리

## 🧪 테스트 계정

개발 및 테스트를 위한 Mock 계정:

```
이메일: toss@example.com
비밀번호: password123
```

## 🔒 보안 기능

- **JWT 토큰**: httpOnly 쿠키 사용 권장
- **Idempotency Key**: 중복 요청 방지
- **입력 검증**: Zod 스키마 검증
- **XSS 방지**: React 기본 보안 + CSP 헤더
- **CSRF 보호**: SameSite 쿠키 설정

## ♿ 접근성 (WCAG 2.1 AA)

- **키보드 네비게이션**: 모든 기능 키보드 접근 가능
- **스크린 리더**: ARIA 라벨 및 역할 정의
- **색상 대비**: 4.5:1 이상 대비율
- **포커스 표시**: 명확한 포커스 인디케이터
- **Skip Link**: 메인 콘텐츠로 바로 이동

## 📱 반응형 디자인

- **모바일**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px 이상

## 🚀 성능 최적화

- **코드 스플리팅**: Next.js 자동 코드 분할
- **이미지 최적화**: WebP/AVIF 포맷 지원
- **번들 최적화**: Tree shaking 및 압축
- **캐싱**: React Query 캐싱 전략
- **Lighthouse 점수**: 90+ 목표

## 📦 빌드 및 배포

### 프로덕션 빌드
```bash
cd frontend
npm run build
```

### 프로덕션 서버 실행
```bash
cd frontend
npm run start
```

### 번들 분석
```bash
cd frontend
npm run analyze
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.

---

**토스 스타일 금융 앱** - 안전하고 편리한 금융 서비스를 경험해보세요! 🚀


