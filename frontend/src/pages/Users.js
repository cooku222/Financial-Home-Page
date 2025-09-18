import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // 로그인 관련 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData);
      setFormData({ name: '', email: '' });
      setShowForm(false);
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      setError('사용자 추가에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 로그인 관련 함수들
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', loginData);
      setIsLoggedIn(true);
      setCurrentUser(response.data.user);
      setShowLogin(false);
      setError(null);
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleLoginInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // 사용자 검색 관련 함수들
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.users);
      setError(null);
    } catch (err) {
      setError('검색에 실패했습니다.');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="loading">사용자 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>사용자 관리</h2>
        
        {/* 로그인 상태 표시 */}
        {isLoggedIn ? (
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            <p>로그인됨: <strong>{currentUser?.username}</strong> 
              {currentUser?.is_admin && <span style={{ color: 'red' }}> (관리자)</span>}
            </p>
            <button className="btn btn-secondary" onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <button 
              className="btn" 
              onClick={() => setShowLogin(!showLogin)}
            >
              {showLogin ? '취소' : '로그인'}
            </button>
          </div>
        )}

        {/* 로그인 폼 */}
        {showLogin && !isLoggedIn && (
          <form onSubmit={handleLogin} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>로그인</h4>
            <div className="form-group">
              <label>사용자명:</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required
              />
            </div>
            <button type="submit" className="btn">로그인</button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              테스트 계정: admin/admin123, user1/password123
            </p>
          </form>
        )}

        {/* 사용자 검색 기능 */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? '검색 닫기' : '사용자 검색'}
          </button>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>사용자 검색</h4>
            <div className="form-group">
              <label>검색어:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="사용자명 또는 이메일로 검색"
                required
              />
            </div>
            <button type="submit" className="btn">검색</button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              테스트: 다양한 검색어를 입력해보세요
            </p>
          </form>
        )}

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>검색 결과 ({searchResults.length}개)</h4>
            {searchResults.map(user => (
              <div key={user.id} style={{ 
                border: '1px solid #eee', 
                padding: '10px', 
                margin: '5px 0',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>사용자명:</strong> {user.username}</p>
                <p><strong>비밀번호:</strong> {user.password}</p>
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>관리자:</strong> {user.is_admin ? '예' : '아니오'}</p>
              </div>
            ))}
          </div>
        )}

        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '새 사용자 추가'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>이름:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>이메일:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn">사용자 추가</button>
          </form>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h3>사용자 목록 ({users.length}명)</h3>
        {users.length === 0 ? (
          <p>등록된 사용자가 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {users.map(user => (
              <div key={user.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}>
                <h4>{user.name}</h4>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>이메일:</strong> {user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
