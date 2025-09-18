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
        <h2>SecureBank 관리자 대시보드</h2>
        <p>금융 서비스 관리 시스템에 오신 것을 환영합니다. 고객 정보, 거래 내역, 시스템 상태를 한눈에 확인하세요.</p>
        
        <h3>시스템 상태</h3>
        <div className={serverStatus.status === 'healthy' ? 'success' : 'error'}>
          <strong>상태:</strong> {serverStatus.status}<br/>
          <strong>메시지:</strong> {serverStatus.message}
        </div>
      </div>

      <div className="card">
        <h3>주요 기능</h3>
        <ul>
          <li><strong>고객 관리:</strong> 고객 정보 조회, 신규 고객 등록, 고객 검색</li>
          <li><strong>거래 내역:</strong> 거래 기록 조회, 거래 승인, 거래 내역 관리</li>
          <li><strong>보안 관리:</strong> 접근 권한 관리, 보안 설정</li>
          <li><strong>시스템 모니터링:</strong> 실시간 시스템 상태 확인</li>
        </ul>
      </div>

      <div className="card">
        <h3>빠른 시작</h3>
        <ol>
          <li>고객 관리 메뉴에서 고객 정보를 확인하세요</li>
          <li>거래 내역 메뉴에서 최근 거래를 검토하세요</li>
          <li>시스템 상태를 정기적으로 모니터링하세요</li>
        </ol>
      </div>

      {/* 관리자 도구 */}
      <div className="card">
        <h3>관리자 도구</h3>
        
        {/* 관리자 패널 */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn" onClick={handleAdminPanel}>
            관리자 패널 접근
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            시스템 관리자 전용 기능에 접근합니다
          </p>
        </div>

        {adminData && showAdminPanel && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px' }}>
            <h4>관리자 패널 정보</h4>
            <pre>{JSON.stringify(adminData, null, 2)}</pre>
            <button className="btn btn-secondary" onClick={() => setShowAdminPanel(false)}>닫기</button>
          </div>
        )}

        {/* 시스템 진단 */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn" onClick={handleDebugInfo}>
            시스템 진단
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            시스템 상태 및 환경 정보를 확인합니다
          </p>
        </div>

        {debugInfo && showDebugInfo && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px' }}>
            <h4>시스템 진단 결과</h4>
            <pre style={{ fontSize: '10px', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button className="btn btn-secondary" onClick={() => setShowDebugInfo(false)}>닫기</button>
          </div>
        )}

        {/* 자금 이체 */}
        <div style={{ marginBottom: '20px' }}>
          <h4>자금 이체</h4>
          <form onSubmit={handleTransfer} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div className="form-group">
              <label>이체 금액:</label>
              <input
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleTransferInputChange}
                placeholder="이체할 금액을 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <label>수취인:</label>
              <input
                type="text"
                name="to_user"
                value={transferData.to_user}
                onChange={handleTransferInputChange}
                placeholder="수취인 계좌번호 또는 이름"
                required
              />
            </div>
            <button type="submit" className="btn">이체 실행</button>
            {transferResult && <p style={{ color: 'green', marginTop: '10px' }}>{transferResult}</p>}
          </form>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            고객 계좌 간 자금 이체를 처리합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
