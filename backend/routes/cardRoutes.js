const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Card = require('../models/Card');
// Background removal moved to frontend
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Cloudinary config is handled globally in server.js

// Helper function to upload to Cloudinary and delete local file
const uploadToCloudinary = async (localPath, folder = 'cards') => {
  try {
    const result = await cloudinary.uploader.upload(localPath, { folder });
    // Cleanup local file after upload
    await fs.unlink(localPath).catch(err => console.error('Local cleanup failed:', err));
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Configure Multer for temporary disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/cards
// @desc    Upload image/logo and save card data
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'subImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      title, subtitle, date, imagePosition, imageSize, imageFit, imageObjectPosition,
      footerStyle, footerText, footerBgColor, footerContentColor, dateBgColor,
      cardBgColor, contentVerticalOffset,
      headlineWidth,
      subtitleShowBox, subtitleBoxColor, subtitleBoxWidth,
      extraText, extraTextShow, extraTextBgColor, extraTextWidth,
      extraTextFontSize, extraTextFontWeight, extraTextFontFamily, extraTextColor, extraTextUnderline,
      titleFontSize, titleFontWeight, titleFontFamily, titleColor, titleUnderline,
      title2, title2FontSize, title2FontWeight, title2FontFamily, title2Color, title2Underline,
      subtitleFontSize, subtitleFontWeight, subtitleFontFamily, subtitleColor, subtitleUnderline,
      subtitle2, subtitle2FontSize, subtitle2FontWeight, subtitle2FontFamily, subtitle2Color, subtitle2Underline,
      subImagePosition, subImageSize, subImageFit, subImageObjectPosition
    } = req.body;
    let imagePath = '';
    let logoPath = '';
    let subImagePath = '';

    if (req.files['image']) {
      imagePath = await uploadToCloudinary(req.files['image'][0].path);
    }
    if (req.files['logo']) {
      logoPath = await uploadToCloudinary(req.files['logo'][0].path, 'logos');
    }
    if (req.files['subImage']) {
      subImagePath = await uploadToCloudinary(req.files['subImage'][0].path);
    }

    if (!imagePath) {
      return res.status(400).json({ error: 'Main image is required' });
    }

    const newCard = new Card({
      title,
      subtitle,
      date,
      image: imagePath,
      imagePosition: imagePosition || 'right',
      imageSize: parseInt(imageSize) || 70,
      imageFit: imageFit || 'cover',
      imageObjectPosition: imageObjectPosition || 'center',
      footerStyle: footerStyle || 'split',
      footerText: footerText || 'www.whiteswantvnews.com',
      footerBgColor: footerBgColor || '#f8f107',
      footerContentColor: footerContentColor || '#000000',
      dateBgColor: dateBgColor || '#2ba5bc',
      cardBgColor: cardBgColor || '#002d72',
      contentVerticalOffset: parseInt(contentVerticalOffset) || -8,
      headlineWidth: headlineWidth || 50,
      subtitleShowBox: subtitleShowBox === 'true' || subtitleShowBox === true,
      subtitleBoxColor: subtitleBoxColor || 'rgba(0,0,0,0.5)',
      subtitleBoxWidth: subtitleBoxWidth || 100,
      extraText: extraText || '',
      extraTextShow: extraTextShow === 'true' || extraTextShow === true,
      extraTextBgColor: extraTextBgColor || '#1e4b8f',
      extraTextWidth: parseInt(extraTextWidth) || 100,
      logo: logoPath,
      subImage: subImagePath,
      subImagePosition: subImagePosition || 'left',
      subImageSize: parseInt(subImageSize) || 40,
      subImageFit: subImageFit || 'contain',
      subImageObjectPosition: subImageObjectPosition || 'center',
      titleStyle: {
        fontSize: titleFontSize || '2.8rem',
        fontWeight: titleFontWeight || '900',
        fontFamily: titleFontFamily || 'Inter',
        color: titleColor || '#f8f107',
        underline: titleUnderline === 'true' || titleUnderline === true
      },
      title2: title2 || '',
      title2Style: {
        fontSize: title2FontSize || '2.8rem',
        fontWeight: title2FontWeight || '900',
        fontFamily: title2FontFamily || 'Anek Malayalam',
        color: title2Color || '#f8f107',
        underline: title2Underline === 'true' || title2Underline === true
      },
      subtitleStyle: {
        fontSize: subtitleFontSize || '1rem',
        fontWeight: subtitleFontWeight || 'normal',
        fontFamily: subtitleFontFamily || 'Anek Malayalam',
        color: subtitleColor || '#ffffff',
        underline: subtitleUnderline === 'true' || subtitleUnderline === true
      },
      subtitle2: subtitle2 || '',
      subtitle2Style: {
        fontSize: subtitle2FontSize || '1rem',
        fontWeight: subtitle2FontWeight || 'normal',
        fontFamily: subtitle2FontFamily || 'Anek Malayalam',
        color: subtitle2Color || '#f8f107',
        underline: subtitle2Underline === 'true' || subtitle2Underline === true
      },
      extraTextStyle: {
        fontSize: extraTextFontSize || '0.9rem',
        fontWeight: extraTextFontWeight || 'bold',
        fontFamily: extraTextFontFamily || 'Anek Malayalam',
        color: extraTextColor || '#ffffff',
        underline: extraTextUnderline === 'true' || extraTextUnderline === true
      }
    });

    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/cards
// @desc    Get all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
