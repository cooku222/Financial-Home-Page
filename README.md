# Web Server Project

Flask 백엔드와 React 프론트엔드로 구성된 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
web-server-project/
├── backend/                 # Flask 백엔드
│   ├── app.py              # 메인 Flask 애플리케이션
│   ├── requirements.txt    # Python 의존성
│   ├── .env               # 환경 변수
│   └── .gitignore         # Git 무시 파일
├── frontend/               # React 프론트엔드
│   ├── public/
│   │   └── index.html     # HTML 템플릿
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   │   └── Navbar.js
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── Home.js
│   │   │   ├── Users.js
│   │   │   └── Posts.js
│   │   ├── App.js         # 메인 App 컴포넌트
│   │   ├── App.css        # App 스타일
│   │   ├── index.js       # 진입점
│   │   └── index.css      # 전역 스타일
│   └── package.json       # Node.js 의존성
└── README.md              # 프로젝트 문서
```

## 기능

### 백엔드 (Flask)
- **RESTful API**: 사용자 및 게시글 관리 API
- **CORS 지원**: 프론트엔드와의 통신을 위한 CORS 설정
- **에러 핸들링**: 404, 500 에러 처리
- **환경 변수**: .env 파일을 통한 설정 관리

### 프론트엔드 (React)
- **사용자 관리**: 사용자 목록 조회 및 새 사용자 추가
- **게시글 관리**: 게시글 목록 조회 및 새 게시글 작성
- **반응형 UI**: 모던하고 사용자 친화적인 인터페이스
- **라우팅**: React Router를 통한 페이지 네비게이션

## 설치 및 실행

### 1. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python app.py
```

백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

### 2. 프론트엔드 설정

```bash
# 새 터미널에서 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드 서버는 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 기본
- `GET /` - 서버 상태 확인
- `GET /api/health` - 헬스 체크

### 사용자 관리
- `GET /api/users` - 사용자 목록 조회
- `POST /api/users` - 새 사용자 추가
- `GET /api/users/<id>` - 특정 사용자 조회

### 게시글 관리
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 새 게시글 작성

## 사용 예시

### 사용자 추가
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "홍길동", "email": "hong@example.com"}'
```

### 게시글 작성
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "첫 번째 게시글", "content": "안녕하세요!", "author": "홍길동"}'
```

## 기술 스택

### 백엔드
- **Python 3.x**
- **Flask** - 웹 프레임워크
- **Flask-CORS** - CORS 처리
- **python-dotenv** - 환경 변수 관리

### 프론트엔드
- **React 18** - UI 라이브러리
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **CSS3** - 스타일링

## 개발 환경

- Node.js 16.x 이상
- Python 3.8 이상
- npm 또는 yarn

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

