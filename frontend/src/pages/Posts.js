import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  
  // 댓글 관련 상태
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // 파일 업로드 관련 상태
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

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

  // 댓글 관련 함수들
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/comment', { comment: commentText });
      setCommentText('');
      setShowCommentForm(false);
      fetchPosts();
      setError(null);
    } catch (err) {
      setError('댓글 추가에 실패했습니다.');
    }
  };

  // 파일 업로드 관련 함수들
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus(`파일 업로드 성공: ${response.data.filename}`);
      setSelectedFile(null);
      setError(null);
    } catch (err) {
      setError('파일 업로드에 실패했습니다.');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (loading) {
    return <div className="loading">게시글 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>게시글 관리</h2>
        
        {/* 댓글 시스템 */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            {showCommentForm ? '댓글 닫기' : '댓글 작성'}
          </button>
        </div>

        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>댓글 작성</h4>
            <div className="form-group">
              <label>댓글:</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                required
              />
            </div>
            <button type="submit" className="btn">댓글 작성</button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              다양한 댓글을 작성해보세요
            </p>
          </form>
        )}

        {/* 파일 업로드 */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setShowFileUpload(!showFileUpload)}
          >
            {showFileUpload ? '업로드 닫기' : '파일 업로드'}
          </button>
        </div>

        {showFileUpload && (
          <form onSubmit={handleFileUpload} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>파일 업로드</h4>
            <div className="form-group">
              <label>파일 선택:</label>
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="btn">업로드</button>
            {uploadStatus && <p style={{ color: 'green', marginTop: '10px' }}>{uploadStatus}</p>}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              다양한 파일을 업로드해보세요
            </p>
          </form>
        )}

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
