#!/usr/bin/env python3
"""
Test Data Generator for Detection Lab MongoDB
Creates sample users for testing MongoDB Compass functionality
"""

import os
import sys
from pymongo import MongoClient
import hashlib
from datetime import datetime, timedelta
import random

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt (same as auth server)"""
    salt = "detection_lab_salt"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def generate_test_users():
    """Generate test users for the database"""
    return [
        {
            "user_id": "admin_001",
            "name": "Alice Administrator",
            "email": "admin@detectionlab.com",
            "password": hash_password("admin123"),
            "role": "admin",
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow() - timedelta(days=5),
            "last_login": datetime.utcnow() - timedelta(hours=2),
            "is_active": True
        },
        {
            "user_id": "analyst_001", 
            "name": "Bob Analyst",
            "email": "bob.analyst@detectionlab.com",
            "password": hash_password("analyst123"),
            "role": "analyst",
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=25),
            "updated_at": datetime.utcnow() - timedelta(days=10),
            "last_login": datetime.utcnow() - timedelta(minutes=30),
            "is_active": True
        },
        {
            "user_id": "analyst_002",
            "name": "Carol Chen",
            "email": "carol.chen@detectionlab.com", 
            "password": hash_password("security123"),
            "role": "analyst",
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=20),
            "updated_at": datetime.utcnow() - timedelta(days=3),
            "last_login": datetime.utcnow() - timedelta(hours=6),
            "is_active": True
        },
        {
            "user_id": "viewer_001",
            "name": "David Viewer",
            "email": "david.viewer@detectionlab.com",
            "password": hash_password("viewer123"),
            "role": "viewer",
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=15),
            "updated_at": datetime.utcnow() - timedelta(days=15),
            "last_login": datetime.utcnow() - timedelta(days=3),
            "is_active": True
        },
        {
            "user_id": "analyst_003",
            "name": "Eve Security",
            "email": "eve@external-company.com",
            "password": hash_password("external123"),
            "role": "analyst", 
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=10),
            "updated_at": datetime.utcnow() - timedelta(days=2),
            "last_login": None,  # Never logged in
            "is_active": True
        },
        {
            "user_id": "inactive_001",
            "name": "Frank Former",
            "email": "frank.former@detectionlab.com",
            "password": hash_password("former123"),
            "role": "analyst",
            "avatar": None,
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow() - timedelta(days=30),
            "last_login": datetime.utcnow() - timedelta(days=45),
            "is_active": False  # Deactivated account
        }
    ]

def generate_test_sessions():
    """Generate test session data"""
    return [
        {
            "user_id": "admin_001",
            "session_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "ip_address": "192.168.1.100",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "expires_at": datetime.utcnow() + timedelta(hours=22),
            "is_active": True
        },
        {
            "user_id": "analyst_001",
            "session_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "ip_address": "192.168.1.101", 
            "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "created_at": datetime.utcnow() - timedelta(minutes=30),
            "expires_at": datetime.utcnow() + timedelta(hours=23, minutes=30),
            "is_active": True
        }
    ]

def generate_test_audit_logs():
    """Generate test audit log entries"""
    actions = ["login", "logout", "profile_update", "password_change", "role_change"]
    users = ["admin_001", "analyst_001", "analyst_002", "viewer_001"]
    ips = ["192.168.1.100", "192.168.1.101", "192.168.1.102", "10.0.0.50"]
    
    logs = []
    for i in range(50):  # Generate 50 random log entries
        logs.append({
            "user_id": random.choice(users),
            "action": random.choice(actions),
            "ip_address": random.choice(ips),
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "timestamp": datetime.utcnow() - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            ),
            "success": random.choice([True, True, True, False]),  # Mostly successful
            "details": {
                "endpoint": f"/auth/{random.choice(actions)}",
                "status_code": random.choice([200, 200, 200, 401, 403])
            }
        })
    
    return sorted(logs, key=lambda x: x["timestamp"], reverse=True)

def main():
    """Main function to populate test data"""
    print("🧪 Detection Lab Test Data Generator")
    print("=" * 50)
    
    # MongoDB connection
    try:
        client = MongoClient("mongodb://localhost:27017/")
        client.admin.command('ping')
        db = client["detection_lab"]
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("Make sure MongoDB is running on localhost:27017")
        return
    
    # Collections
    users_collection = db["users"]
    sessions_collection = db["sessions"] 
    audit_collection = db["audit_logs"]
    
    # Generate test data
    print("\n📊 Generating test data...")
    
    # Users
    test_users = generate_test_users()
    print(f"👥 Generated {len(test_users)} test users")
    
    # Check if users already exist
    existing_users = users_collection.count_documents({})
    if existing_users > 0:
        response = input(f"Found {existing_users} existing users. Replace with test data? (y/N): ")
        if response.lower() != 'y':
            print("Skipping user data generation")
        else:
            users_collection.delete_many({})
            users_collection.insert_many(test_users)
            print("✅ Test users inserted")
    else:
        users_collection.insert_many(test_users)
        print("✅ Test users inserted")
    
    # Sessions
    test_sessions = generate_test_sessions()
    sessions_collection.delete_many({})  # Clear existing sessions
    sessions_collection.insert_many(test_sessions)
    print(f"🔐 Generated {len(test_sessions)} active sessions")
    
    # Audit logs
    test_logs = generate_test_audit_logs()
    audit_collection.delete_many({})  # Clear existing logs
    audit_collection.insert_many(test_logs)
    print(f"📝 Generated {len(test_logs)} audit log entries")
    
    print("\n🎉 Test data generation complete!")
    print("\n📋 Generated Data Summary:")
    print(f"   👥 Users: {users_collection.count_documents({})}")
    print(f"      - Admins: {users_collection.count_documents({'role': 'admin'})}")
    print(f"      - Analysts: {users_collection.count_documents({'role': 'analyst'})}")
    print(f"      - Viewers: {users_collection.count_documents({'role': 'viewer'})}")
    print(f"      - Active: {users_collection.count_documents({'is_active': True})}")
    print(f"      - Inactive: {users_collection.count_documents({'is_active': False})}")
    print(f"   🔐 Sessions: {sessions_collection.count_documents({})}")
    print(f"   📝 Audit Logs: {audit_collection.count_documents({})}")
    
    print("\n🔍 Test Credentials:")
    print("   Admin: admin@detectionlab.com / admin123")
    print("   Analyst: bob.analyst@detectionlab.com / analyst123")
    print("   Viewer: david.viewer@detectionlab.com / viewer123")
    
    print("\n📊 Next Steps:")
    print("   1. Open MongoDB Compass")
    print("   2. Connect to: mongodb://localhost:27017")
    print("   3. Navigate to 'detection_lab' database")
    print("   4. Explore the collections and data")
    print("   5. Try the sample queries from the guide")

if __name__ == "__main__":
    main() 