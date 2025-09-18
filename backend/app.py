from flask import Flask, jsonify, request, session, render_template_string
from flask_cors import CORS
import os
import sqlite3
import hashlib
import base64
import pickle
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS 설정으로 프론트엔드와 통신 가능하게 함

# 취약점: 약한 시크릿 키
app.secret_key = 'weak_secret_key_123'

# 데이터베이스 초기화
def init_db():
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    
    # 사용자 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            is_admin INTEGER DEFAULT 0
        )
    ''')
    
    # 게시글 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT,
            author TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 테스트 데이터 삽입
    test_users = [
        ('admin', 'admin123', 'admin@example.com', 1),
        ('user1', 'password123', 'user1@example.com', 0),
        ('user2', 'password456', 'user2@example.com', 0)
    ]
    
    for user in test_users:
        cursor.execute(
            "INSERT OR IGNORE INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)",
            user
        )
    
    conn.commit()
    conn.close()

init_db()

# 기본 라우트
@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to Flask Web Server!',
        'status': 'success',
        'version': '1.0.0'
    })

# API 라우트들
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running properly'
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    # 샘플 사용자 데이터
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'},
        {'id': 3, 'name': 'Bob Johnson', 'email': 'bob@example.com'}
    ]
    return jsonify({
        'users': users,
        'count': len(users)
    })

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({
            'error': 'Name and email are required'
        }), 400
    
    # 실제로는 데이터베이스에 저장
    new_user = {
        'id': 4,  # 실제로는 DB에서 생성된 ID
        'name': data['name'],
        'email': data['email']
    }
    
    return jsonify({
        'message': 'User created successfully',
        'user': new_user
    }), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # 샘플 사용자 데이터
    users = {
        1: {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
        2: {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'},
        3: {'id': 3, 'name': 'Bob Johnson', 'email': 'bob@example.com'}
    }
    
    if user_id in users:
        return jsonify(users[user_id])
    else:
        return jsonify({
            'error': 'User not found'
        }), 404

@app.route('/api/posts', methods=['GET'])
def get_posts():
    # 샘플 포스트 데이터
    posts = [
        {'id': 1, 'title': 'First Post', 'content': 'This is the first post', 'author': 'John Doe'},
        {'id': 2, 'title': 'Second Post', 'content': 'This is the second post', 'author': 'Jane Smith'},
        {'id': 3, 'title': 'Third Post', 'content': 'This is the third post', 'author': 'Bob Johnson'}
    ]
    return jsonify({
        'posts': posts,
        'count': len(posts)
    })

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({
            'error': 'Title and content are required'
        }), 400
    
    # 실제로는 데이터베이스에 저장
    new_post = {
        'id': 4,  # 실제로는 DB에서 생성된 ID
        'title': data['title'],
        'content': data['content'],
        'author': data.get('author', 'Anonymous')
    }
    
    return jsonify({
        'message': 'Post created successfully',
        'post': new_post
    }), 201

# ========== 취약점이 포함된 엔드포인트들 ==========

# 사용자 검색 API
@app.route('/api/search', methods=['GET'])
def search_users():
    query = request.args.get('q', '')
    
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    
    # SQL Injection 가능한 쿼리 (의도적 취약점)
    sql_query = f"SELECT * FROM users WHERE username LIKE '%{query}%' OR email LIKE '%{query}%'"
    cursor.execute(sql_query)
    results = cursor.fetchall()
    conn.close()
    
    users = []
    for row in results:
        users.append({
            'id': row[0],
            'username': row[1],
            'password': row[2],
            'email': row[3],
            'is_admin': row[4]
        })
    
    return jsonify({'users': users})

# 로그인 API
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    
    # 약한 인증 로직 (의도적 취약점)
    cursor.execute(f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'")
    user = cursor.fetchone()
    conn.close()
    
    if user:
        # 세션 설정
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['is_admin'] = user[4]
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[3],
                'is_admin': user[4]
            }
        })
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# 관리자 패널 API
@app.route('/api/admin', methods=['GET'])
def admin_panel():
    # 약한 권한 검사 (의도적 취약점)
    if session.get('is_admin') == 1:
        return jsonify({
            'message': 'Welcome to admin panel',
            'secret_data': 'This is sensitive admin information',
            'all_users': 'List of all users would be here'
        })
    else:
        return jsonify({'error': 'Access denied'}), 403

# 댓글 추가 API
@app.route('/api/comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    comment = data.get('comment', '')
    
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)", 
                   ('Comment', comment, session.get('username', 'Anonymous')))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Comment added successfully'})

# 파일 접근 API
@app.route('/api/file', methods=['GET'])
def get_file():
    filename = request.args.get('name', '')
    
    # Directory Traversal 취약점 (의도적)
    try:
        with open(f'uploads/{filename}', 'r') as f:
            content = f.read()
        return jsonify({'content': content})
    except:
        return jsonify({'error': 'File not found'}), 404

# 파일 업로드 API
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # 파일 타입 검증 없음 (의도적 취약점)
    filename = file.filename
    file.save(f'uploads/{filename}')
    
    return jsonify({'message': 'File uploaded successfully', 'filename': filename})

# 디버그 정보 API
@app.route('/api/debug', methods=['GET'])
def debug_info():
    # 정보 노출 취약점 (의도적)
    return jsonify({
        'environment': dict(os.environ),
        'session': dict(session),
        'request_headers': dict(request.headers),
        'database_path': 'vulnerable.db'
    })

# 송금 API
@app.route('/api/transfer', methods=['POST'])
def transfer_money():
    data = request.get_json()
    amount = data.get('amount')
    to_user = data.get('to_user')
    
    # CSRF 토큰 검증 없음 (의도적 취약점)
    if session.get('user_id'):
        return jsonify({
            'message': f'Transferred ${amount} to {to_user}',
            'transaction_id': 'TXN123456'
        })
    else:
        return jsonify({'error': 'Not authenticated'}), 401

# 설정 저장 API
@app.route('/api/preferences', methods=['POST'])
def save_preferences():
    data = request.get_json()
    preferences = data.get('preferences', '')
    
    # 안전하지 않은 역직렬화 (의도적 취약점)
    try:
        decoded = base64.b64decode(preferences)
        deserialized = pickle.loads(decoded)
        return jsonify({'message': 'Preferences saved', 'data': deserialized})
    except:
        return jsonify({'error': 'Invalid preferences format'}), 400

# 에러 핸들러
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
