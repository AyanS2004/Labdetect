# MongoDB Compass Guide for Detection Lab

## 🎯 Overview
MongoDB Compass is the official GUI for MongoDB that allows you to visually manage your Detection Lab database without using command line tools.

## 📥 Installation & Setup

### 1. Download & Install
- Visit: https://www.mongodb.com/try/download/compass
- Download for Windows
- Run installer and follow setup wizard

### 2. Connection Strings
Choose the connection string that matches your MongoDB setup:

**Local MongoDB (Default):**
```
mongodb://localhost:27017
```

**Docker Setup:**
```
mongodb://admin:admin123@localhost:27017/?authSource=admin
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
```

## 🗄️ Database Structure

After connecting, navigate to `detection_lab` database to see:

### Users Collection
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_abc123",
  "name": "John Doe", 
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "analyst",
  "avatar": null,
  "created_at": ISODate("2024-01-15T10:30:00Z"),
  "updated_at": ISODate("2024-01-15T10:30:00Z"),
  "last_login": ISODate("2024-01-15T11:45:00Z"),
  "is_active": true
}
```

### Sessions Collection (Future)
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_abc123",
  "session_token": "jwt_token_here",
  "created_at": ISODate("..."),
  "expires_at": ISODate("...")
}
```

### Audit Logs Collection (Future)
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_abc123",
  "action": "login",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "timestamp": ISODate("...")
}
```

## 🔧 Common Operations

### 1. View All Users
- Navigate to `detection_lab` → `users`
- Click on the collection to see all user documents
- Use the filter bar to search: `{"role": "admin"}`

### 2. Create a New User Manually
Click "Insert Document" and use this template:
```json
{
  "user_id": "user_manual_001",
  "name": "Manual User",
  "email": "manual@detectionlab.com",
  "password": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", 
  "role": "analyst",
  "avatar": null,
  "created_at": {"$date": "2024-01-15T10:30:00.000Z"},
  "updated_at": {"$date": "2024-01-15T10:30:00.000Z"},
  "last_login": null,
  "is_active": true
}
```
*Note: The password hash above is for "admin123" - change it!*

### 3. Update User Role
- Find the user document
- Click the edit icon (pencil)
- Change the "role" field: `"analyst"` → `"admin"`
- Click "Update"

### 4. Deactivate a User
- Find the user document
- Edit the document
- Change `"is_active": true` to `"is_active": false`
- Click "Update"

### 5. Search Users
Use the filter bar with MongoDB queries:

**Find admins:**
```json
{"role": "admin"}
```

**Find active users:**
```json
{"is_active": true}
```

**Find users by email domain:**
```json
{"email": {"$regex": "@detectionlab.com$"}}
```

**Find recent logins:**
```json
{"last_login": {"$gte": {"$date": "2024-01-01T00:00:00.000Z"}}}
```

## 📊 Useful Compass Features

### 1. Schema Analysis
- Click the "Schema" tab in any collection
- See data type distribution
- Identify common patterns and outliers

### 2. Performance Insights
- Click "Performance" tab
- Monitor slow queries
- View index usage

### 3. Real-time Monitoring
- Use the "Real Time" view
- See operations as they happen
- Monitor authentication attempts

### 4. Index Management
- Click "Indexes" tab
- View existing indexes:
  - `email_1` (unique)
  - `user_id_1` (unique)
- Create new indexes for performance

### 5. Aggregation Pipeline
Create complex queries using the visual pipeline builder:

**Example: Count users by role**
```javascript
[
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
]
```

**Example: Find recently active users**
```javascript
[
  {
    $match: {
      last_login: {
        $gte: new Date(Date.now() - 7*24*60*60*1000) // Last 7 days
      }
    }
  },
  {
    $project: {
      name: 1,
      email: 1, 
      last_login: 1,
      role: 1
    }
  },
  {
    $sort: { last_login: -1 }
  }
]
```

## 🔒 Security Best Practices

### 1. Regular Monitoring
- Check for suspicious login patterns
- Monitor failed authentication attempts
- Review user creation/deletion activity

### 2. Data Backup
- Use Compass to export collections
- Tools → Export Collection
- Choose JSON or CSV format
- Store backups securely

### 3. User Management
- Regularly review user accounts
- Deactivate unused accounts
- Monitor role assignments

## 🚨 Troubleshooting

### Connection Issues
1. **Can't connect to localhost:27017**
   - Check if MongoDB service is running: `net start MongoDB`
   - Verify port 27017 is not blocked by firewall

2. **Authentication failed**
   - Verify connection string credentials
   - Check if authentication is enabled in MongoDB

3. **Database not showing**
   - Make sure auth server has created data
   - Register a test user through your app first

### Performance Issues
1. **Slow queries**
   - Check indexes are being used
   - Add indexes for frequently queried fields

2. **Large collections**
   - Use query filters to limit results
   - Implement pagination in your app

## 🎯 Detection Lab Specific Tips

### 1. User Registration Testing
After a user registers through your React app:
- Refresh Compass
- Navigate to users collection
- Verify the new user document appears
- Check password is properly hashed

### 2. Authentication Debugging
When login issues occur:
- Check `last_login` timestamps
- Verify `is_active` status
- Compare password hashes

### 3. Role Management
- Use Compass to quickly promote users to admin
- Monitor role distribution
- Audit permission changes

### 4. Data Cleanup
- Remove test accounts
- Clean up expired sessions
- Archive old audit logs

## 🚀 Advanced Features

### 1. Validation Rules
View the schema validation rules for users collection:
```javascript
{
  $jsonSchema: {
    bsonType: "object",
    required: ["user_id", "name", "email", "password", "role"],
    properties: {
      user_id: { bsonType: "string" },
      name: { bsonType: "string" },
      email: { 
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      },
      role: {
        bsonType: "string",
        enum: ["admin", "analyst", "viewer"]
      }
    }
  }
}
```

### 2. Explain Plans
- Click "Explain" on any query
- See how MongoDB executes the query
- Optimize slow operations

### 3. Collection Stats
- View collection size
- Monitor document count
- Track storage usage

---

## 📋 Quick Reference

### Common Queries
```javascript
// Find user by email
{"email": "user@example.com"}

// Find all admins
{"role": "admin"}

// Find inactive users
{"is_active": false}

// Find users created today
{"created_at": {"$gte": new Date("2024-01-15T00:00:00.000Z")}}

// Find users who never logged in
{"last_login": null}
```

### Useful Aggregations
```javascript
// User count by role
[{$group: {_id: "$role", count: {$sum: 1}}}]

// Recent login activity
[
  {$match: {"last_login": {"$ne": null}}},
  {$sort: {"last_login": -1}}, 
  {$limit: 10}
]

// Email domain distribution
[
  {$group: {
    _id: {$substr: ["$email", {$indexOfCP: ["$email", "@"]}, -1]},
    count: {$sum: 1}
  }}
]
```

MongoDB Compass makes managing your Detection Lab database much easier than command-line tools. Use it for monitoring, debugging, and maintaining your user authentication system! 