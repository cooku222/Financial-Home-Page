from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS 설정으로 프론트엔드와 통신 가능하게 함

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
