# MongoDB Setup Guide for Detection Lab

This guide will help you set up MongoDB for the Detection Lab authentication system.

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### Option 2: Local MongoDB Installation

#### Windows
1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for Windows
   - Run the installer with default settings

2. **Start MongoDB Service**
   ```cmd
   # MongoDB should start automatically as a Windows service
   # If not, run:
   net start MongoDB
   ```

3. **Verify Installation**
   ```cmd
   mongosh
   # Should connect to MongoDB shell
   ```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create source list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 3: Docker (Easiest for Development)

1. **Create docker-compose.yml** (already created for you):
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:7.0
       container_name: detection_lab_mongo
       restart: unless-stopped
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: admin123
         MONGO_INITDB_DATABASE: detection_lab
       volumes:
         - mongodb_data:/data/db
         - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

   volumes:
     mongodb_data:
   ```

2. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Update Environment Variables**
   ```bash
   MONGODB_URI=mongodb://admin:admin123@localhost:27017/detection_lab?authSource=admin
   ```

## 📝 Environment Configuration

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your settings:
   ```env
   # Authentication Server Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_ALGORITHM=HS256

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/
   MONGODB_DATABASE=detection_lab
   MONGODB_COLLECTION_USERS=users

   # Server Configuration
   AUTH_HOST=0.0.0.0
   AUTH_PORT=5000
   CORS_ORIGINS=http://localhost:3000

   # Environment
   ENVIRONMENT=development
   ```

## 🔧 Installation Steps

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements-auth.txt
   ```

2. **Start MongoDB** (choose one method above)

3. **Start the Authentication Server**
   ```bash
   python auth_server_mongo.py
   ```

4. **Verify Connection**
   - Visit: http://localhost:5000/health
   - Should show database status as "connected"

## 🧪 Testing the Setup

1. **Test Database Connection**
   ```bash
   # Using mongosh (MongoDB shell)
   mongosh "mongodb://localhost:27017/detection_lab"
   
   # List databases
   show dbs
   
   # Use your database
   use detection_lab
   
   # List collections
   show collections
   ```

2. **Test Authentication Endpoints**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Register a test user
   curl -X POST http://localhost:5000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "confirmPassword": "password123"
     }'
   ```

## 🔒 Security Considerations

### For Production:
1. **Change Default Credentials**
   - Use strong, unique passwords
   - Update JWT_SECRET to a random 256-bit key

2. **Enable Authentication**
   ```bash
   # In MongoDB config file (/etc/mongod.conf)
   security:
     authorization: enabled
   ```

3. **Network Security**
   - Use firewall rules to limit access
   - Enable SSL/TLS for connections
   - Use VPN or private networks

4. **Regular Backups**
   ```bash
   # Create backup
   mongodump --uri="mongodb://localhost:27017/detection_lab" --out=backup/
   
   # Restore backup
   mongorestore --uri="mongodb://localhost:27017/detection_lab" backup/detection_lab/
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Refused**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Or on Windows
   sc query MongoDB
   ```

2. **Permission Denied**
   ```bash
   # Check MongoDB logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

3. **Authentication Failed**
   - Verify connection string
   - Check username/password
   - Ensure user has proper permissions

4. **Port Already in Use**
   ```bash
   # Find what's using port 27017
   netstat -tulpn | grep 27017
   
   # Or use different port in .env
   MONGODB_URI=mongodb://localhost:27018/
   ```

## 📊 Database Schema

The system creates these collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  user_id: "user_abc123",
  name: "John Doe",
  email: "john@example.com", 
  password: "hashed_password",
  role: "analyst", // analyst, admin
  avatar: "url_to_image",
  created_at: ISODate,
  updated_at: ISODate,
  last_login: ISODate,
  is_active: true
}
```

### Indexes Created:
- `email` (unique)
- `user_id` (unique)

## 🎯 Next Steps

After setting up MongoDB:

1. **Update auth-api.ts** to use the new endpoints
2. **Test registration and login** in your React app
3. **Add user management features** in the admin panel
4. **Set up monitoring** for production deployments

Your MongoDB-powered authentication system is now ready! 🎉 