#!/usr/bin/env python3
"""
MongoDB-Enabled Authentication Server for Detection Lab Platform
Provides JWT authentication endpoints with MongoDB storage
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import hashlib
import os
from datetime import datetime, timedelta
from functools import wraps
from pymongo import MongoClient, errors
from pymongo.collection import Collection
from bson import ObjectId
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration from environment variables
JWT_SECRET = os.getenv('JWT_SECRET', 'detection-lab-secret-key-change-in-production')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'detection_lab')
MONGODB_COLLECTION_USERS = os.getenv('MONGODB_COLLECTION_USERS', 'users')
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
AUTH_HOST = os.getenv('AUTH_HOST', '0.0.0.0')
AUTH_PORT = int(os.getenv('AUTH_PORT', 5000))
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# Enable CORS
CORS(app, origins=CORS_ORIGINS)

# MongoDB connection
try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    client.admin.command('ping')
    db = client[MONGODB_DATABASE]
    users_collection: Collection = db[MONGODB_COLLECTION_USERS]
    logger.info(f"✅ Connected to MongoDB: {MONGODB_DATABASE}")
    
    # Create indexes for performance and uniqueness
    users_collection.create_index("email", unique=True)
    users_collection.create_index("user_id", unique=True)
    logger.info("✅ Database indexes created")
    
except errors.ServerSelectionTimeoutError:
    logger.error("❌ Failed to connect to MongoDB. Please ensure MongoDB is running.")
    exit(1)
except Exception as e:
    logger.error(f"❌ Database connection error: {e}")
    exit(1)

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt"""
    salt = "detection_lab_salt"  # In production, use a random salt per user
    return hashlib.sha256((password + salt).encode()).hexdigest()

def create_tokens(user_id: str) -> tuple[str, str]:
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

def verify_token(token: str) -> dict | None:
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

def generate_user_id() -> str:
    """Generate a unique user ID"""
    import uuid
    return f"user_{uuid.uuid4().hex[:8]}"

def user_to_dict(user_doc: dict) -> dict:
    """Convert MongoDB user document to API response format"""
    return {
        'id': user_doc['user_id'],
        'name': user_doc['name'],
        'email': user_doc['email'],
        'role': user_doc.get('role', 'analyst'),
        'avatar': user_doc.get('avatar'),
        'created_at': user_doc.get('created_at')
    }

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
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': data['email']})
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'User already exists'
            }), 409
        
        # Create new user
        user_id = generate_user_id()
        user_doc = {
            'user_id': user_id,
            'name': data['name'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'role': 'analyst',  # Default role
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'last_login': None
        }
        
        # Insert user into database
        result = users_collection.insert_one(user_doc)
        logger.info(f"New user registered: {data['email']} (ID: {user_id})")
        
        # Create tokens
        access_token, refresh_token = create_tokens(user_id)
        
        # Update last login
        users_collection.update_one(
            {'user_id': user_id},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Return user data and tokens
        user_data = user_to_dict(user_doc)
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_data,
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 201
        
    except errors.DuplicateKeyError:
        return jsonify({
            'success': False,
            'error': 'User already exists'
        }), 409
    except Exception as e:
        logger.error(f"Registration error: {e}")
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
        
        # Find user in database
        user = users_collection.find_one({'email': data['email']})
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({
                'success': False,
                'error': 'Account is deactivated'
            }), 401
        
        # Verify password
        if user['password'] != hash_password(data['password']):
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Update last login
        users_collection.update_one(
            {'user_id': user['user_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Create tokens
        access_token, refresh_token = create_tokens(user['user_id'])
        
        logger.info(f"User logged in: {data['email']}")
        
        # Return user data and tokens
        user_data = user_to_dict(user)
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_data,
                'token': access_token,
                'refreshToken': refresh_token
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
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
        
        # Check if user still exists and is active
        user = users_collection.find_one({'user_id': payload['user_id']})
        if not user or not user.get('is_active', True):
            return jsonify({
                'success': False,
                'error': 'User not found or inactive'
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
        logger.error(f"Token refresh error: {e}")
        return jsonify({
            'success': False,
            'error': f'Token refresh failed: {str(e)}'
        }), 500

@app.route('/auth/logout', methods=['POST'])
@token_required
def logout():
    """Logout user"""
    try:
        # In a production system, you might want to blacklist the token
        # For now, we'll just log the logout
        user = users_collection.find_one({'user_id': request.current_user_id})
        if user:
            logger.info(f"User logged out: {user['email']}")
        
        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }), 200
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({
            'success': False,
            'error': f'Logout failed: {str(e)}'
        }), 500

@app.route('/auth/profile', methods=['GET'])
@token_required
def get_profile():
    """Get user profile"""
    try:
        user = users_collection.find_one({'user_id': request.current_user_id})
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = user_to_dict(user)
        
        return jsonify({
            'success': True,
            'data': user_data
        }), 200
        
    except Exception as e:
        logger.error(f"Get profile error: {e}")
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
        
        # Build update document
        update_doc = {'updated_at': datetime.utcnow()}
        
        # Allow updating specific fields
        allowed_fields = ['name', 'role', 'avatar']
        for field in allowed_fields:
            if field in data:
                update_doc[field] = data[field]
        
        # Email updates require special handling (check uniqueness)
        if 'email' in data:
            existing_user = users_collection.find_one({
                'email': data['email'],
                'user_id': {'$ne': request.current_user_id}
            })
            if existing_user:
                return jsonify({
                    'success': False,
                    'error': 'Email already in use'
                }), 409
            update_doc['email'] = data['email']
        
        # Update user in database
        result = users_collection.update_one(
            {'user_id': request.current_user_id},
            {'$set': update_doc}
        )
        
        if result.matched_count == 0:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        logger.info(f"Profile updated for user: {request.current_user_id}")
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Update profile error: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to update profile: {str(e)}'
        }), 500

@app.route('/auth/change-password', methods=['POST'])
@token_required
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        
        required_fields = ['currentPassword', 'newPassword', 'confirmPassword']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        if data['newPassword'] != data['confirmPassword']:
            return jsonify({
                'success': False,
                'error': 'New passwords do not match'
            }), 400
        
        if len(data['newPassword']) < 8:
            return jsonify({
                'success': False,
                'error': 'Password must be at least 8 characters'
            }), 400
        
        # Get current user
        user = users_collection.find_one({'user_id': request.current_user_id})
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Verify current password
        if user['password'] != hash_password(data['currentPassword']):
            return jsonify({
                'success': False,
                'error': 'Current password is incorrect'
            }), 401
        
        # Update password
        users_collection.update_one(
            {'user_id': request.current_user_id},
            {
                '$set': {
                    'password': hash_password(data['newPassword']),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Password changed for user: {request.current_user_id}")
        
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Change password error: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to change password: {str(e)}'
        }), 500

@app.route('/auth/users', methods=['GET'])
@token_required
def list_users():
    """List all users (admin only)"""
    try:
        # Check if user is admin
        current_user = users_collection.find_one({'user_id': request.current_user_id})
        if not current_user or current_user.get('role') != 'admin':
            return jsonify({
                'success': False,
                'error': 'Admin access required'
            }), 403
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        
        # Get users
        users_cursor = users_collection.find(
            {'is_active': True},
            {'password': 0}  # Exclude password field
        ).skip(skip).limit(limit).sort('created_at', -1)
        
        users = [user_to_dict(user) for user in users_cursor]
        total_users = users_collection.count_documents({'is_active': True})
        
        return jsonify({
            'success': True,
            'data': {
                'users': users,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': total_users,
                    'pages': (total_users + limit - 1) // limit
                }
            }
        }), 200
        
    except Exception as e:
        logger.error(f"List users error: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to list users: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        # Test database connection
        client.admin.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'service': 'detection-lab-auth',
        'environment': ENVIRONMENT,
        'database': db_status,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print("🔐 Detection Lab Authentication Server (MongoDB)")
    print("=" * 50)
    print(f"🚀 Starting auth server...")
    print(f"🌐 Auth endpoints: http://{AUTH_HOST}:{AUTH_PORT}/auth/")
    print(f"🗄️  Database: {MONGODB_DATABASE}")
    print(f"📝 Environment: {ENVIRONMENT}")
    print("📋 Endpoints:")
    print("   POST /auth/register")
    print("   POST /auth/login") 
    print("   POST /auth/refresh")
    print("   POST /auth/logout")
    print("   GET  /auth/profile")
    print("   PUT  /auth/profile")
    print("   POST /auth/change-password")
    print("   GET  /auth/users (admin)")
    print("   GET  /health")
    print(f"\n✅ CORS enabled for: {', '.join(CORS_ORIGINS)}")
    print("-" * 50)
    
    app.run(host=AUTH_HOST, port=AUTH_PORT, debug=(ENVIRONMENT == 'development')) 