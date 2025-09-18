import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get('/api/health');
        setServerStatus(response.data);
      } catch (error) {
        setServerStatus({ status: 'error', message: '서버에 연결할 수 없습니다.' });
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  if (loading) {
    return <div className="loading">서버 상태를 확인하는 중...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>웹 서버 프로젝트에 오신 것을 환영합니다!</h2>
        <p>이 프로젝트는 Flask 백엔드와 React 프론트엔드로 구성된 풀스택 웹 애플리케이션입니다.</p>
        
        <h3>서버 상태</h3>
        <div className={serverStatus.status === 'healthy' ? 'success' : 'error'}>
          <strong>상태:</strong> {serverStatus.status}<br/>
          <strong>메시지:</strong> {serverStatus.message}
        </div>
      </div>

      <div className="card">
        <h3>기능</h3>
        <ul>
          <li><strong>사용자 관리:</strong> 사용자 목록 조회 및 새 사용자 추가</li>
          <li><strong>게시글 관리:</strong> 게시글 목록 조회 및 새 게시글 작성</li>
          <li><strong>RESTful API:</strong> Flask로 구현된 REST API</li>
          <li><strong>반응형 UI:</strong> React로 구현된 모던한 사용자 인터페이스</li>
        </ul>
      </div>

      <div className="card">
        <h3>사용 방법</h3>
        <ol>
          <li>백엔드 서버 실행: <code>cd backend && python app.py</code></li>
          <li>프론트엔드 서버 실행: <code>cd frontend && npm start</code></li>
          <li>브라우저에서 <code>http://localhost:3000</code> 접속</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
