import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data.posts);
      setError(null);
    } catch (err) {
      setError('게시글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', formData);
      setFormData({ title: '', content: '', author: '' });
      setShowForm(false);
      fetchPosts(); // 목록 새로고침
    } catch (err) {
      setError('게시글 작성에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">게시글 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>게시글 관리</h2>
        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '새 게시글 작성'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>제목:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>작성자:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>내용:</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn">게시글 작성</button>
          </form>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h3>게시글 목록 ({posts.length}개)</h3>
        {posts.length === 0 ? (
          <p>작성된 게시글이 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {posts.map(post => (
              <div key={post.id} style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}>
                <h4>{post.title}</h4>
                <p><strong>작성자:</strong> {post.author}</p>
                <p><strong>ID:</strong> {post.id}</p>
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  {post.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
