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
        <h2>거래 내역 관리</h2>
        
        {/* 거래 메모 시스템 */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            {showCommentForm ? '메모 닫기' : '거래 메모 작성'}
          </button>
        </div>

        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>거래 메모 작성</h4>
            <div className="form-group">
              <label>메모 내용:</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="거래에 대한 메모를 입력하세요..."
                required
              />
            </div>
            <button type="submit" className="btn">메모 저장</button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              거래에 대한 상세 메모를 작성합니다
            </p>
          </form>
        )}

        {/* 문서 업로드 */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn" 
            onClick={() => setShowFileUpload(!showFileUpload)}
          >
            {showFileUpload ? '업로드 닫기' : '문서 업로드'}
          </button>
        </div>

        {showFileUpload && (
          <form onSubmit={handleFileUpload} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4>거래 관련 문서 업로드</h4>
            <div className="form-group">
              <label>문서 선택:</label>
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="btn">업로드</button>
            {uploadStatus && <p style={{ color: 'green', marginTop: '10px' }}>{uploadStatus}</p>}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              거래 관련 서류를 업로드합니다
            </p>
          </form>
        )}

        <button 
          className="btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '새 거래 등록'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>거래 제목:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="거래의 제목을 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <label>처리 직원:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="거래를 처리한 직원명"
                required
              />
            </div>
            <div className="form-group">
              <label>거래 내용:</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="거래의 상세 내용을 입력하세요"
                required
              />
            </div>
            <button type="submit" className="btn">거래 등록</button>
          </form>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <h3>거래 내역 ({posts.length}건)</h3>
        {posts.length === 0 ? (
          <p>등록된 거래가 없습니다.</p>
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
                <p><strong>처리 직원:</strong> {post.author}</p>
                <p><strong>거래 ID:</strong> {post.id}</p>
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
