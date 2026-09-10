import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Taswiyah Hub API is running',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Taswiyah Hub API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
  });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Mock authentication
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        username: 'admin',
        role: 'admin',
        email: 'admin@taswiyah-hub.com',
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║    Taswiyah Hub API Server Started        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API Server:  http://${HOST}:${PORT}`);
  console.log(`🔗 Health:      http://${HOST}:${PORT}/health`);
  console.log(`ℹ️  Info:        http://${HOST}:${PORT}/api/info`);
  console.log('');
  console.log('📝 Mock Credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('');
  console.log('⏹️  Press Ctrl+C to stop the server');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n[INFO] Shutting down API server...');
  process.exit(0);
});
