const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'https://social-connect-frontend.vercel.app',
  'https://social-connect-frontend-five.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Set JSON payload size limit higher to support base64 images uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// DB Connection
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/posthub';
console.log('Connecting to database:', dbUri);

mongoose.connect(dbUri)
  .then(() => console.log('MongoDB connection established successfully.'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Ensure MongoDB service is running locally or check MONGODB_URI in backend/.env');
  });

// Database connectivity validation interceptor
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is offline. Please make sure MongoDB is started locally, or check the MONGODB_URI configuration in backend/.env file.'
    });
  }
  next();
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Base route for status health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the PostHub REST API Server.',
    time: new Date()
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
// Database connectivity configuration updated
