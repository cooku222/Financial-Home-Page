import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

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

  if (loading) {
    return <div className="loading">사용자 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>사용자 관리</h2>
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
