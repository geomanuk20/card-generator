const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const cardRoutes = require('./routes/cardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

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
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Card Generator API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
