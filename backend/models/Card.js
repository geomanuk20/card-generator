const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  imagePosition: { type: String, default: 'right' },
  imageSize: { type: Number, default: 70 },
  imageFit: { type: String, default: 'cover' },
  imageObjectPosition: { type: String, default: 'center' },
  headlineWidth: { type: Number, default: 50 },
  footerStyle: { type: String, default: 'centered' },
  footerText: { type: String, default: 'www.whiteswantvnews.com' },
  footerBgColor: { type: String, default: 'transparent' },
  footerContentColor: { type: String, default: '#ffffff' },
  dateBgColor: { type: String, default: '#2ba5bc' },
  subtitleShowBox: { type: Boolean, default: false },
  subtitleBoxColor: { type: String, default: 'rgba(0,0,0,0.5)' },
  subtitleBoxWidth: { type: Number, default: 100 },
  extraText: { type: String, default: '' },
  extraTextShow: { type: Boolean, default: false },
  extraTextBgColor: { type: String, default: '#1e4b8f' },
  extraTextWidth: { type: Number, default: 100 },
  subtitle2: { type: String, default: '' },
  title2: { type: String, default: '' },
  logo: { type: String },
  // Sub-subject image
  subImage: { type: String },
  subImagePosition: { type: String, default: 'left' },
  subImageSize: { type: Number, default: 40 },
  subImageFit: { type: String, default: 'contain' },
  subImageObjectPosition: { type: String, default: 'center' },
  // Typography styles
  titleStyle: {
    fontSize: { type: String, default: '2.8rem' },
    fontWeight: { type: String, default: '900' },
    fontFamily: { type: String, default: 'Anek Malayalam' },
    color: { type: String, default: '#f8f107' },
    underline: { type: Boolean, default: false }
  },
  title2Style: {
    fontSize: { type: String, default: '2.8rem' },
    fontWeight: { type: String, default: '900' },
    fontFamily: { type: String, default: 'Anek Malayalam' },
    color: { type: String, default: '#f8f107' },
    underline: { type: Boolean, default: false }
  },
  subtitleStyle: {
    fontSize: { type: String, default: '1rem' },
    fontWeight: { type: String, default: 'normal' },
    fontFamily: { type: String, default: 'Anek Malayalam' },
    color: { type: String, default: '#ffffff' },
    underline: { type: Boolean, default: false }
  },
  subtitle2Style: {
    fontSize: { type: String, default: '1rem' },
    fontWeight: { type: String, default: 'normal' },
    fontFamily: { type: String, default: 'Anek Malayalam' },
    color: { type: String, default: '#f8f107' },
    underline: { type: Boolean, default: false }
  },
  extraTextStyle: {
    fontSize: { type: String, default: '0.9rem' },
    fontWeight: { type: String, default: 'bold' },
    fontFamily: { type: String, default: 'Anek Malayalam' },
    color: { type: String, default: '#ffffff' },
    underline: { type: Boolean, default: false }
  },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
