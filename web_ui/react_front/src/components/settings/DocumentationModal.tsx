'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Book, Shield, Zap, Database, Code, Globe, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface DocumentationModalProps {
  isOpen: boolean
  onClose: () => void
}

const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    description: 'Quick start guide and basic concepts',
    content: `
# Welcome to Detection Lab

The Detection Lab is an advanced cybersecurity platform for APT simulation, detection analysis, and MITRE ATT&CK mapping.

## Quick Start Guide

### 1. Dashboard Overview
The main dashboard provides an overview of system status and key metrics:
- **System Health**: Monitor platform status and performance
- **Recent Activity**: View latest simulations and detections  
- **Key Metrics**: Coverage statistics and analysis results

### 2. Navigation
- **Sidebar Navigation**: Use the left sidebar to switch between modules
- **Interactive Elements**: Click on cards and charts for detailed views
- **User Menu**: Access settings via the dropdown in the top-right corner

### 3. Core Modules
- **Simulation**: Launch APT group attack simulations
- **Detection**: Analyze detection coverage and results
- **Reports**: Generate and view comprehensive security reports
- **MITRE ATT&CK**: Explore framework mappings and technique coverage

### 4. Basic Workflow
1. **Start** with the Dashboard to understand current system state
2. **Run Simulations** to test your security controls
3. **Analyze Detection Results** to identify gaps
4. **Generate Reports** for stakeholders and compliance
5. **Review MITRE Coverage** for technique mapping

## Key Features

### Real-time Monitoring
- Live system status updates
- Instant notification of security events
- Dynamic performance metrics

### Advanced Analytics
- Machine learning-powered detection analysis
- Statistical correlation and pattern recognition
- Predictive threat modeling capabilities

### Comprehensive Reporting
- Automated report generation
- Customizable templates and formats
- Export capabilities (PDF, CSV, JSON)
    `
  },
  {
    id: 'authentication',
    title: 'Authentication & Security',
    icon: Shield,
    description: 'User management and security features',
    content: `
# Authentication & Security

## User Management System

### User Roles & Permissions
The platform supports three primary user roles:

**Administrator**
- Full system access and configuration
- User management and role assignment
- System settings and security policies
- Advanced debugging and maintenance tools

**Security Analyst**
- Security analysis and investigation capabilities
- Report generation and data export
- Simulation execution and result analysis
- Detection rule configuration

**Viewer**
- Read-only access to reports and dashboards
- Basic metric viewing and data consumption
- Limited export capabilities
- No system modification permissions

### Security Features

**JWT Authentication**
- Secure token-based authentication system
- Automatic token refresh for seamless sessions
- Configurable token expiration policies
- Multi-device session management

**Password Security**
- Strong password requirements and validation
- Secure bcrypt hashing with salt
- Password history tracking
- Account lockout protection

**Session Management**
- Configurable session timeout policies
- Active session monitoring and control
- Remote logout capabilities
- Concurrent session limits

**Data Protection**
- End-to-end encryption for sensitive data
- CORS protection for API endpoints
- Input validation and sanitization
- Audit logging for all security events

### Account Management

**Profile Settings**
- Update personal information and preferences
- Change passwords with validation
- Configure notification preferences
- Set timezone and display options

**Security Settings**
- Enable two-factor authentication (coming soon)
- View and manage active sessions
- Review login history and audit logs
- Configure security alerts

**Access Control**
- Role-based permissions system
- Resource-level access controls
- API endpoint authorization
- Feature-based restrictions
    `
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: Code,
    description: 'API endpoints and integration guide',
    content: `
# API Integration Guide

## Authentication Endpoints

### Login
\`POST /auth/login\`

Request body:
\`\`\`json
{
  "email": "user@example.com",
  "password": "secure_password"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "data": {
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "analyst"
    }
  }
}
\`\`\`

### Registration
\`POST /auth/register\`

Request body:
\`\`\`json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password"
}
\`\`\`

### Token Refresh
\`POST /auth/refresh\`

Headers:
\`\`\`
Authorization: Bearer refresh_token
\`\`\`

## Simulation Endpoints

### Start Simulation
\`POST /api/simulate\`

Request body:
\`\`\`json
{
  "aptGroup": "APT29",
  "techniques": ["T1055", "T1003"],
  "duration": 3600,
  "targets": ["workstation-01", "server-02"]
}
\`\`\`

### Get Simulation Results
\`GET /api/simulations/{id}\`

Response includes:
- Execution timeline and events
- Detection coverage analysis
- MITRE ATT&CK technique mapping
- Performance metrics and statistics

## Detection Endpoints

### Evaluate Detection Rules
\`POST /api/evaluate\`

Request body:
\`\`\`json
{
  "ruleId": "rule_123",
  "timeRange": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-02T00:00:00Z"
  },
  "datasets": ["sysmon", "security"]
}
\`\`\`

### Get Detection Results
\`GET /api/detections\`

Query parameters:
- \`limit\`: Number of results (default: 50)
- \`offset\`: Pagination offset
- \`severity\`: Filter by severity level
- \`status\`: Filter by detection status

## Error Handling

All API endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
\`\`\`

## Rate Limiting

API endpoints are protected by rate limiting:
- **Authentication**: 5 requests per minute
- **Simulation**: 10 requests per hour
- **General API**: 100 requests per 15 minutes

Rate limit headers are included in responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`
    `
  },
  {
    id: 'database',
    title: 'Database Schema',
    icon: Database,
    description: 'Data models and database structure',
    content: `
# Database Schema & Data Models

## Collections Overview

The Detection Lab uses MongoDB with the following primary collections:

### Users Collection
Stores user account information and authentication data.

\`\`\`javascript
{
  _id: ObjectId("..."),
  user_id: "user_abc123",
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$hashed_password_string",
  role: "analyst",
  avatar: "https://example.com/avatar.jpg",
  preferences: {
    theme: "dark",
    notifications: true,
    timezone: "UTC"
  },
  security: {
    last_login: ISODate("2024-01-15T10:30:00Z"),
    login_attempts: 0,
    locked_until: null,
    password_changed: ISODate("2023-12-01T00:00:00Z")
  },
  created_at: ISODate("2023-11-01T00:00:00Z"),
  updated_at: ISODate("2024-01-15T10:30:00Z"),
  is_active: true
}
\`\`\`

### Sessions Collection
Manages user authentication sessions and tokens.

\`\`\`javascript
{
  _id: ObjectId("..."),
  session_id: "sess_xyz789",
  user_id: "user_abc123",
  refresh_token: "jwt_refresh_token_hash",
  device_info: {
    user_agent: "Mozilla/5.0...",
    ip_address: "192.168.1.100",
    device_type: "desktop"
  },
  created_at: ISODate("2024-01-15T10:30:00Z"),
  expires_at: ISODate("2024-01-22T10:30:00Z"),
  last_accessed: ISODate("2024-01-15T14:20:00Z"),
  is_active: true
}
\`\`\`

### Simulations Collection
Stores APT simulation configurations and results.

\`\`\`javascript
{
  _id: ObjectId("..."),
  simulation_id: "sim_def456",
  name: "APT29 Cozy Bear Simulation",
  apt_group: {
    name: "APT29",
    aliases: ["Cozy Bear", "The Dukes"],
    description: "Russian state-sponsored group"
  },
  configuration: {
    techniques: ["T1055", "T1003", "T1082"],
    targets: ["workstation-01", "server-02"],
    duration: 3600,
    stealth_level: "medium"
  },
  results: {
    executed_techniques: ["T1055", "T1003"],
    detections: {
      triggered: 2,
      missed: 1,
      false_positives: 0
    },
    timeline: [
      {
        timestamp: ISODate("2024-01-15T11:00:00Z"),
        technique: "T1055",
        action: "process_injection",
        detected: true,
        detection_rule: "rule_001"
      }
    ]
  },
  status: "completed",
  created_by: "user_abc123",
  created_at: ISODate("2024-01-15T10:45:00Z"),
  completed_at: ISODate("2024-01-15T11:45:00Z")
}
\`\`\`

### Audit Logs Collection
Comprehensive logging for security and compliance.

\`\`\`javascript
{
  _id: ObjectId("..."),
  log_id: "log_ghi789",
  event_type: "user_login",
  severity: "info",
  user_id: "user_abc123",
  details: {
    action: "successful_login",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0...",
    session_id: "sess_xyz789"
  },
  metadata: {
    request_id: "req_123456",
    endpoint: "/auth/login",
    response_time: 245
  },
  timestamp: ISODate("2024-01-15T10:30:00Z")
}
\`\`\`

## Data Relationships

### User → Sessions (1:N)
- One user can have multiple active sessions
- Sessions expire automatically or via manual logout

### User → Simulations (1:N)
- Users create and manage their own simulations
- Admins can view all simulations

### Simulations → Audit Logs (1:N)
- All simulation activities are logged
- Includes creation, execution, and result analysis

## Indexes and Performance

### Primary Indexes
- Users: \`email\` (unique), \`user_id\` (unique)
- Sessions: \`session_id\` (unique), \`user_id\`, \`expires_at\`
- Simulations: \`simulation_id\` (unique), \`created_by\`, \`status\`
- Audit Logs: \`timestamp\`, \`user_id\`, \`event_type\`

### Compound Indexes
- Sessions: \`{user_id: 1, is_active: 1}\`
- Audit Logs: \`{user_id: 1, timestamp: -1}\`
- Simulations: \`{created_by: 1, created_at: -1}\`
    `
  },
  {
    id: 'deployment',
    title: 'Deployment Guide',
    icon: Globe,
    description: 'Production deployment and configuration',
    content: `
# Production Deployment Guide

## Environment Setup

### MongoDB Database

**MongoDB Atlas (Recommended)**
1. Create a MongoDB Atlas account
2. Set up a new cluster (M10+ for production)
3. Configure network access and database users
4. Obtain connection string

**Self-Hosted MongoDB**
1. Install MongoDB 6.0+ on your server
2. Configure authentication and SSL/TLS
3. Set up replica sets for high availability
4. Configure backup strategies

### Application Configuration

**Environment Variables**
Create a \`.env\` file with the following configuration:

\`\`\`bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/detection_lab
MONGODB_OPTIONS=retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-random-secret-key-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=30

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

## Deployment Options

### Docker Deployment (Recommended)

**1. Create Dockerfile**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

**2. Docker Compose Setup**
\`\`\`yaml
version: '3.8'
services:
  detection-lab-backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
    restart: unless-stopped

  detection-lab-frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secure_password
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
\`\`\`

### Cloud Deployment

**AWS EC2/ECS**
1. Set up EC2 instances or ECS tasks
2. Configure Application Load Balancer
3. Set up SSL certificates with AWS Certificate Manager
4. Use RDS for MongoDB or MongoDB Atlas

**Google Cloud Platform**
1. Deploy to Google Cloud Run or Compute Engine
2. Use Cloud Load Balancing
3. Configure SSL certificates
4. Use Cloud Firestore or MongoDB Atlas

**Azure**
1. Deploy to Azure App Service or Container Instances
2. Set up Azure Load Balancer
3. Configure SSL with Azure certificates
4. Use Azure Cosmos DB or MongoDB Atlas

## Security Considerations

### SSL/TLS Configuration
- Always use HTTPS in production
- Configure proper SSL certificate chains
- Enable HSTS headers
- Use strong cipher suites

### Network Security
- Configure firewalls to restrict access
- Use VPCs or private networks
- Implement IP whitelisting where appropriate
- Set up monitoring and intrusion detection

### Database Security
- Enable MongoDB authentication
- Use strong passwords and rotate regularly
- Configure SSL/TLS for database connections
- Implement proper backup and recovery procedures

### Application Security
- Regular security updates and patches
- Input validation and sanitization
- Rate limiting and DDoS protection
- Security monitoring and logging

## Monitoring and Maintenance

### Health Checks
Implement health check endpoints:
\`\`\`javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
\`\`\`

### Logging
- Use structured logging (JSON format)
- Implement log rotation
- Set up centralized log aggregation
- Configure alerting for errors

### Backup Strategy
- Automated daily database backups
- Test backup restoration procedures
- Store backups in multiple locations
- Document recovery procedures

### Performance Monitoring
- Set up application performance monitoring (APM)
- Monitor database performance and query optimization
- Track user experience metrics
- Set up alerting for performance degradation
    `
  }
]

export function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeSection, setActiveSection] = useState(documentationSections[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const activeDoc = documentationSections.find(section => section.id === activeSection)
  
  // Debug logging
  console.log('DocumentationModal Debug:', {
    isOpen,
    activeSection,
    activeDoc: activeDoc?.title,
    totalSections: documentationSections.length
  })

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay modal-documentation"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden modal-content"
        >
          <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <Book className="h-6 w-6 text-blue-400" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">Documentation</CardTitle>
                  <CardDescription className="text-slate-400">
                    Complete guide to Detection Lab platform
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <div className="flex h-[calc(95vh-8rem)]">
              {/* Enhanced Sidebar */}
              <div className="w-80 border-r border-slate-700/50 overflow-hidden bg-slate-900/30">
                {/* Search */}
                <div className="p-4 border-b border-slate-700/30">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-4 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Documentation Sections
                    </h3>
                  </div>
                  <nav className="space-y-2">
                    {filteredSections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            console.log('Clicked section:', section.id, section.title)
                            setActiveSection(section.id)
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-300 border border-blue-500/30 shadow-lg'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              activeSection === section.id ? 'bg-blue-500/20' : 'bg-slate-700/50'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm">{section.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed pl-9">
                            {section.description}
                          </p>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {/* Enhanced Content Area */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <div className="p-8 max-w-4xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeDoc ? (
                          <>
                            {/* Header */}
                            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-700/30">
                              <div className="p-3 bg-blue-500/20 rounded-xl">
                                <activeDoc.icon className="h-8 w-8 text-blue-400" />
                              </div>
                              <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{activeDoc.title}</h1>
                                <p className="text-lg text-slate-400">{activeDoc.description}</p>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-invert prose-slate max-w-none">
                              <div 
                                className="text-slate-200 leading-relaxed space-y-6"
                                style={{ fontSize: '16px', lineHeight: '1.7' }}
                                dangerouslySetInnerHTML={{ 
                                  __html: activeDoc.content
                                    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-6 border-b-2 border-blue-500/30 pb-3">$1</h1>')
                                    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-white mt-8 mb-5 border-b border-slate-700/50 pb-2">$1</h2>')
                                    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-white mt-6 mb-4">$1</h3>')
                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                                    .replace(/\*(.+?)\*/g, '<em class="text-blue-300">$1</em>')
                                    .replace(/`([^`]+)`/g, '<code class="bg-slate-800/80 text-emerald-300 px-2 py-1 rounded-md text-sm font-mono border border-slate-700/30">$1</code>')
                                    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900/80 text-slate-200 p-4 rounded-lg border border-slate-700/50 overflow-x-auto my-6 text-sm"><code class="font-mono">$2</code></pre>')
                                    .replace(/^- (.+)$/gm, '<div class="flex items-start space-x-3 mb-2"><span class="text-blue-400 mt-1 text-lg">•</span><span class="text-slate-200">$1</span></div>')
                                    .replace(/^\d+\. (.+)$/gm, '<div class="flex items-start space-x-3 mb-2"><span class="text-blue-400 font-semibold min-w-[1.5rem]">•</span><span class="text-slate-200">$1</span></div>')
                                    .replace(/\n\n/g, '<br/><br/>')
                                    .replace(/\n/g, '<br/>')
                                }}
                              />
                            </div>
                            
                            {/* Debug info */}
                            <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                              <p className="text-xs text-slate-400">
                                Debug: Section ID: {activeSection} | Content length: {activeDoc.content.length} characters
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Book className="h-12 w-12 text-slate-600 mb-4" />
                            <h3 className="text-lg font-medium text-slate-400 mb-2">
                              No documentation selected
                            </h3>
                            <p className="text-sm text-slate-500">
                              Please select a section from the sidebar to view documentation.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 