#!/usr/bin/env python3
"""
Simple Authentication Server for Detection Lab Platform
Provides JWT authentication endpoints for the React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import hashlib
import json
import os
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow React dev server

# Configuration
JWT_SECRET = "detection-lab-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
USERS_FILE = "users.json"

# In-memory user storage (in production, use a real database)
def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_tokens(user_id):
    """Create access and refresh tokens"""
    access_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    
    refresh_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return access_token, refresh_token

def verify_token(token):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'success': False, 'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'success': False, 'error': 'Token is invalid or expired'}), 401
        
        request.current_user_id = payload['user_id']
        return f(*args, **kwargs)
    
    return decorated

@app.route('/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['name', 'email', 'password', 'confirmPassword']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        if data['password'] != data['confirmPassword']:
            return jsonify({
                'success': False,
                'error': 'Passwords do not match'
            }), 400
        
        if len(data['password']) < 8:
            return jsonify({
                'success': False,
                'error': 'Password must be at least 8 characters'
            }), 400
        
        # Load existing users
        users = load_users()
        
        # Check if user already exists
        if data['email'] in users:
            return jsonify({
                'success': False,
                'error': 'User already exists'
            }), 409
        
        # Create new user
        user_id = f"user_{len(users) + 1}"
        users[data['email']] = {
            'id': user_id,
            'name': data['name'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'role': 'analyst',  # Default role
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Save users
        save_users(users)
        
        # Create tokens
        access_token, refresh_token = create_tokens(user_id)
        
        # Return user data and tokens
        user_data = {
            'id': user_id,
            'name': data['name'],
            'email': data['email'],
            'role': 'analyst'
        }
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_data,
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400
        
        # Load users
        users = load_users()
        
        # Check if user exists
        user = users.get(data['email'])
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Verify password
        if user['password'] != hash_password(data['password']):
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Create tokens
        access_token, refresh_token = create_tokens(user['id'])
        
        # Return user data and tokens
        user_data = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_data,
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500

@app.route('/auth/refresh', methods=['POST'])
def refresh():
    """Refresh access token"""
    try:
        data = request.get_json()
        refresh_token = data.get('refreshToken')
        
        if not refresh_token:
            return jsonify({
                'success': False,
                'error': 'Refresh token is required'
            }), 400
        
        # Verify refresh token
        payload = verify_token(refresh_token)
        if not payload or payload.get('type') != 'refresh':
            return jsonify({
                'success': False,
                'error': 'Invalid refresh token'
            }), 401
        
        # Create new tokens
        access_token, new_refresh_token = create_tokens(payload['user_id'])
        
        return jsonify({
            'success': True,
            'data': {
                'token': access_token,
                'refreshToken': new_refresh_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Token refresh failed: {str(e)}'
        }), 500

@app.route('/auth/logout', methods=['POST'])
@token_required
def logout():
    """Logout user (in a real app, you'd invalidate the token)"""
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

@app.route('/auth/profile', methods=['GET'])
@token_required
def get_profile():
    """Get user profile"""
    try:
        users = load_users()
        user = None
        
        # Find user by ID
        for email, user_data in users.items():
            if user_data['id'] == request.current_user_id:
                user = user_data
                break
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
        
        return jsonify({
            'success': True,
            'data': user_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get profile: {str(e)}'
        }), 500

@app.route('/auth/profile', methods=['PUT'])
@token_required
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        users = load_users()
        
        # Find and update user
        user_updated = False
        for email, user_data in users.items():
            if user_data['id'] == request.current_user_id:
                if 'name' in data:
                    user_data['name'] = data['name']
                if 'email' in data and data['email'] != email:
                    # Email change requires more complex handling
                    pass
                user_updated = True
                break
        
        if not user_updated:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        save_users(users)
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to update profile: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'detection-lab-auth',
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    print("🔐 Detection Lab Authentication Server")
    print("=" * 40)
    print("🚀 Starting auth server...")
    print("🌐 Auth endpoints available at: http://localhost:5000/auth/")
    print("📋 Endpoints:")
    print("   POST /auth/register")
    print("   POST /auth/login") 
    print("   POST /auth/refresh")
    print("   POST /auth/logout")
    print("   GET  /auth/profile")
    print("   PUT  /auth/profile")
    print("   GET  /health")
    print("\n✅ CORS enabled for http://localhost:3000")
    print("-" * 40)
    
    app.run(host='0.0.0.0', port=5000, debug=True) 