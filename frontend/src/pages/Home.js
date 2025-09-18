import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 관리자 패널 관련 상태
  const [adminData, setAdminData] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // 디버그 정보 관련 상태
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // CSRF 테스트 관련 상태
  const [transferData, setTransferData] = useState({ amount: '', to_user: '' });
  const [transferResult, setTransferResult] = useState('');

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

  // 관리자 패널 관련 함수들
  const handleAdminPanel = async () => {
    try {
      const response = await axios.get('/api/admin');
      setAdminData(response.data);
      setShowAdminPanel(true);
    } catch (err) {
      alert('관리자 권한이 필요합니다.');
    }
  };

  // 디버그 정보 관련 함수들
  const handleDebugInfo = async () => {
    try {
      const response = await axios.get('/api/debug');
      setDebugInfo(response.data);
      setShowDebugInfo(true);
    } catch (err) {
      alert('디버그 정보를 가져올 수 없습니다.');
    }
  };

  // 송금 관련 함수들
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/transfer', transferData);
      setTransferResult(response.data.message);
    } catch (err) {
      setTransferResult('송금에 실패했습니다.');
    }
  };

  const handleTransferInputChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

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

      {/* 추가 기능들 */}
      <div className="card">
        <h3>추가 기능</h3>
        
        {/* 관리자 패널 */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn" onClick={handleAdminPanel}>
            관리자 패널 접근
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            관리자 권한이 필요한 기능에 접근해보세요
          </p>
        </div>

        {adminData && showAdminPanel && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px' }}>
            <h4>관리자 패널 데이터</h4>
            <pre>{JSON.stringify(adminData, null, 2)}</pre>
            <button className="btn btn-secondary" onClick={() => setShowAdminPanel(false)}>닫기</button>
          </div>
        )}

        {/* 디버그 정보 */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn" onClick={handleDebugInfo}>
            디버그 정보 가져오기
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            시스템 정보를 확인해보세요
          </p>
        </div>

        {debugInfo && showDebugInfo && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px' }}>
            <h4>디버그 정보</h4>
            <pre style={{ fontSize: '10px', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button className="btn btn-secondary" onClick={() => setShowDebugInfo(false)}>닫기</button>
          </div>
        )}

        {/* 송금 기능 */}
        <div style={{ marginBottom: '20px' }}>
          <h4>송금 기능</h4>
          <form onSubmit={handleTransfer} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div className="form-group">
              <label>금액:</label>
              <input
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleTransferInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>받는 사람:</label>
              <input
                type="text"
                name="to_user"
                value={transferData.to_user}
                onChange={handleTransferInputChange}
                required
              />
            </div>
            <button type="submit" className="btn">송금</button>
            {transferResult && <p style={{ color: 'green', marginTop: '10px' }}>{transferResult}</p>}
          </form>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            송금 기능을 테스트해보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
