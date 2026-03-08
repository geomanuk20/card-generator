const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const Settings = require('../models/Settings');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload to Cloudinary and delete local file
const uploadToCloudinary = async (localPath, folder = 'logos') => {
  try {
    const result = await cloudinary.uploader.upload(localPath, { folder });
    await fs.unlink(localPath).catch(err => console.error('Local cleanup failed:', err));
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Configure Multer for logo storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'global_logo_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// @route   GET /api/settings/logo
// @desc    Get current global logo
router.get('/logo', async (req, res) => {
  try {
    const logoSetting = await Settings.findOne({ key: 'global_logo' });
    res.json(logoSetting || { value: '' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/settings/logo
// @desc    Upload/Update global logo
router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    const cloudinaryUrl = await uploadToCloudinary(logoPath);

    const updatedSetting = await Settings.findOneAndUpdate(
      { key: 'global_logo' },
      { value: cloudinaryUrl },
      { upsert: true, returnDocument: 'after' }
    );

    res.json(updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
