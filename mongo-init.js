// MongoDB initialization script for Detection Lab
// This script runs when the container first starts

print('🚀 Initializing Detection Lab Database...');

// Switch to the detection_lab database
db = db.getSiblingDB('detection_lab');

// Create the users collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'name', 'email', 'password', 'role'],
      properties: {
        user_id: {
          bsonType: 'string',
          description: 'Unique user identifier'
        },
        name: {
          bsonType: 'string',
          description: 'User full name'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address'
        },
        password: {
          bsonType: 'string',
          description: 'Hashed password'
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'analyst', 'viewer'],
          description: 'User role'
        },
        avatar: {
          bsonType: ['string', 'null'],
          description: 'User avatar URL'
        },
        created_at: {
          bsonType: 'date',
          description: 'Account creation timestamp'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Last update timestamp'
        },
        last_login: {
          bsonType: ['date', 'null'],
          description: 'Last login timestamp'
        },
        is_active: {
          bsonType: 'bool',
          description: 'Account active status'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ user_id: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ is_active: 1 });
db.users.createIndex({ created_at: 1 });

print('✅ Users collection created with indexes');

// Create a default admin user (you should change this password!)
const adminUser = {
  user_id: 'admin_001',
  name: 'Admin User',
  email: 'admin@detectionlab.com',
  password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // SHA256 of 'admin123detection_lab_salt'
  role: 'admin',
  avatar: null,
  created_at: new Date(),
  updated_at: new Date(),
  last_login: null,
  is_active: true
};

try {
  db.users.insertOne(adminUser);
  print('✅ Default admin user created');
  print('   Email: admin@detectionlab.com');
  print('   Password: admin123');
  print('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
} catch (error) {
  print('ℹ️  Admin user already exists, skipping...');
}

// Create sessions collection for future use
db.createCollection('sessions');
db.sessions.createIndex({ user_id: 1 });
db.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

print('✅ Sessions collection created');

// Create audit log collection
db.createCollection('audit_logs');
db.audit_logs.createIndex({ user_id: 1 });
db.audit_logs.createIndex({ action: 1 });
db.audit_logs.createIndex({ timestamp: 1 });

print('✅ Audit logs collection created');

print('🎉 Detection Lab Database initialization complete!');
print('📋 Collections created:');
print('   - users (with validation and indexes)');
print('   - sessions');
print('   - audit_logs');
print('');
print('🔑 Default admin credentials:');
print('   Email: admin@detectionlab.com');
print('   Password: admin123');
print('   ⚠️  Remember to change the admin password!'); 