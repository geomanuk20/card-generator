const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ 
  path: path.join(__dirname, '.env'),
  override: true 
});

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cardRoutes = require('./routes/cardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// DB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://geomanuk20_db_user:Mb501xSaDSSFb85n@cluster0.9fqub7b.mongodb.net/';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/cards', cardRoutes);
app.use('/api/settings', settingsRoutes);

// Production Static Assets
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  
  // Use a fallback middleware instead of a wildcard route to avoid Express 5 path-to-regexp issues
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send('Card Generator API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  
  // Verify Cloudinary connection
  cloudinary.api.ping()
    .then(() => console.log('✅ Cloudinary Connected and Configured Successfully'))
    .catch((err) => {
      console.error('❌ Cloudinary Configuration Error:', err.message);
      if (err.http_code === 401) {
        console.error('   Hint: Please check if your CLOUDINARY_API_SECRET or API_KEY in .env matches your Cloudinary dashboard exactly.');
      }
    });
});
