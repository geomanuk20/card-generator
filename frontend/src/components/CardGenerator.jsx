import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeBackground } from '@imgly/background-removal';
import PremiumCard from './PremiumCard';
const backendURL = ''; // Use relative paths for production

const CardGenerator = ({ onCardGenerated, globalLogo, editCardData }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: new Date().toISOString().split('T')[0],
    imagePosition: 'right',
    imageSize: 70,
    imageFit: 'cover',
    imageObjectPosition: 'center',
    headlineWidth: 50,
    footerStyle: 'centered',
    footerText: 'www.whiteswantvnews.com',
    footerBgColor: 'transparent',
    footerContentColor: '#ffffff',
    dateBgColor: '#2ba5bc',
    // Title Styles
    titleFontSize: 2.8,
    titleFontWeight: '900',
    titleFontFamily: 'Anek Malayalam',
    titleColor: '#f8f107',
    titleUnderline: false,
    // Subtitle Styles
    subtitleFontSize: 1,
    subtitleFontWeight: 'normal',
    subtitleFontFamily: 'Anek Malayalam',
    subtitleColor: '#ffffff',
    subtitleUnderline: false,
    subtitleShowBox: false,
    subtitleBoxColor: '#000000',
    subtitleBoxWidth: 100,
    // Highlight Box Styles
    extraText: '',
    extraTextShow: false,
    extraTextBgColor: '#1e4b8f',
    extraTextWidth: 100,
    extraTextFontSize: 0.9,
    extraTextFontWeight: 'bold',
    extraTextFontFamily: 'Anek Malayalam',
    extraTextColor: '#ffffff',
    extraTextUnderline: false,
    // Subtitle 2 Styles
    subtitle2: '',
    subtitle2FontSize: 1,
    subtitle2FontWeight: 'normal',
    subtitle2FontFamily: 'Anek Malayalam',
    subtitle2Color: '#f8f107',
    subtitle2Underline: false,
    // Title 2 Styles
    title2: '',
    title2FontSize: 2.8,
    title2FontWeight: '900',
    title2FontFamily: 'Anek Malayalam',
    title2Color: '#f8f107',
    title2Underline: false,
    // Sub-Subject Image Styles
    subImagePosition: 'left',
    subImageSize: 40,
    subImageFit: 'contain',
    subImageObjectPosition: 'center',
    // Card Layout & Background
    cardBgColor: '#002d72',
    contentVerticalOffset: -8,
  });
  const [image, setImage] = useState(null);
  const [subImage, setSubImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [subPreviewUrl, setSubPreviewUrl] = useState('');
  const [isProcessingBG, setIsProcessingBG] = useState(false);
  const [isProcessingSubBG, setIsProcessingSubBG] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeEditTarget, setActiveEditTarget] = useState('main'); // 'main' or 'sub'

  // Load initial state from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('cardGenerator_formData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          // Always reset transient data
          date: new Date().toISOString().split('T')[0],
          title: '',
          subtitle: '',
          subtitle2: '',
          title2: '',
          extraText: ''
        }));
      } catch (e) {
        console.error('Error loading saved card data:', e);
      }
    }
  }, []);

  // Update state when an edit operation is requested
  useEffect(() => {
    if (editCardData) {
      const { 
        image, subImage, logo, _id, createdAt, updatedAt, __v, 
        titleStyle, title2Style, subtitleStyle, subtitle2Style, extraTextStyle,
        ...flatData 
      } = editCardData;

      setFormData(prev => ({
        ...prev,
        ...flatData,
        // Map back nested style objects to flat form structure
        titleFontSize: parseFloat(titleStyle?.fontSize) || 2.8,
        titleFontWeight: titleStyle?.fontWeight || '900',
        titleFontFamily: titleStyle?.fontFamily || 'Anek Malayalam',
        titleColor: titleStyle?.color || '#f8f107',
        titleUnderline: titleStyle?.underline || false,

        title2FontSize: parseFloat(title2Style?.fontSize) || 2.8,
        title2FontWeight: title2Style?.fontWeight || '900',
        title2FontFamily: title2Style?.fontFamily || 'Anek Malayalam',
        title2Color: title2Style?.color || '#f8f107',
        title2Underline: title2Style?.underline || false,

        subtitleFontSize: parseFloat(subtitleStyle?.fontSize) || 1,
        subtitleFontWeight: subtitleStyle?.fontWeight || 'normal',
        subtitleFontFamily: subtitleStyle?.fontFamily || 'Anek Malayalam',
        subtitleColor: subtitleStyle?.color || '#ffffff',
        subtitleUnderline: subtitleStyle?.underline || false,

        subtitle2FontSize: parseFloat(subtitle2Style?.fontSize) || 1,
        subtitle2FontWeight: subtitle2Style?.fontWeight || 'normal',
        subtitle2FontFamily: subtitle2Style?.fontFamily || 'Anek Malayalam',
        subtitle2Color: subtitle2Style?.color || '#f8f107',
        subtitle2Underline: subtitle2Style?.underline || false,

        extraTextFontSize: parseFloat(extraTextStyle?.fontSize) || 0.9,
        extraTextFontWeight: extraTextStyle?.fontWeight || 'bold',
        extraTextFontFamily: extraTextStyle?.fontFamily || 'Anek Malayalam',
        extraTextColor: extraTextStyle?.color || '#ffffff',
        extraTextUnderline: extraTextStyle?.underline || false,
      }));

      // In edit mode, set the previews to the saved URLs, 
      // but wipe the File objects so resubmitting requires new files 
      // OR handle retaining the old string in the backend if no new file is passed.
      // (For this implementation, we will prefill the preview but clear the `image` File state, 
      // requiring re-upload to actually save a new image on the edit.
      // OR if we wanted to support direct saving without reupload, see below approach)
      
      setPreviewUrl(image || '');
      setSubPreviewUrl(subImage || '');
      setImage(null);
      setSubImage(null);
    }
  }, [editCardData]);

  // Save state to localStorage whenever non-content settings change
  useEffect(() => {
    const { 
      title, subtitle, subtitle2, title2, extraText, date, 
      ...settingsToSave 
    } = formData;
    localStorage.setItem('cardGenerator_formData', JSON.stringify(settingsToSave));
  }, [formData]);

  // Update preview URL when image changes
  useEffect(() => {
    if (!image) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (!subImage) {
      setSubPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(subImage);
    setSubPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [subImage]);

  const preprocessImage = async (file) => {
    // If it's already a supported format, just return it
    const supportedFormats = ['image/png', 'image/jpeg', 'image/webp'];
    if (supportedFormats.includes(file.type)) {
      return file;
    }

    console.log(`Preprocessing image of type ${file.type} to PNG...`);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/png');
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Image loading failed'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveBackground = async () => {
    if (!image) return alert('Please upload an image first');
    
    setIsProcessingBG(true);
    try {
      console.log('Starting browser-side background removal...');
      const processedFile = await preprocessImage(image);
      const blob = await removeBackground(processedFile);
      
      // Create a new File object to keep names consistent
      const noBgFile = new File([blob], image.name.replace(/\.[^/.]+$/, "") + "-no-bg.png", { type: "image/png" });
      
      setImage(noBgFile);
      alert('Background removed successfully in your browser!');
    } catch (error) {
      console.error('Browser-side background removal failed:', error);
      alert('AI Background removal failed. Your browser might be under high load, or the image is too large.');
    } finally {
      setIsProcessingBG(false);
    }
  };

  const handleRemoveSubBackground = async () => {
    if (!subImage) return alert('Please upload a sub-image first');
    
    setIsProcessingSubBG(true);
    try {
      console.log('Starting browser-side sub-background removal...');
      const processedFile = await preprocessImage(subImage);
      const blob = await removeBackground(processedFile);
      
      const noBgFile = new File([blob], subImage.name.replace(/\.[^/.]+$/, "") + "-no-bg.png", { type: "image/png" });
      
      setSubImage(noBgFile);
      // Create a blob URL for preview
      setSubPreviewUrl(URL.createObjectURL(blob));
      alert('Sub-image background removed successfully in your browser!');
    } catch (error) {
      console.error('Browser-side sub-background removal failed:', error);
      alert('AI Background removal failed on sub-image.');
    } finally {
      setIsProcessingSubBG(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !editCardData?.image) return alert('Please upload a main image');

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('date', formData.date);
    data.append('imagePosition', formData.imagePosition);
    data.append('imageSize', formData.imageSize);
    data.append('imageFit', formData.imageFit);
    data.append('imageObjectPosition', formData.imageObjectPosition);
    data.append('headlineWidth', formData.headlineWidth);
    data.append('footerStyle', formData.footerStyle);
    data.append('footerText', formData.footerText);
    data.append('footerBgColor', formData.footerBgColor);
    data.append('footerContentColor', formData.footerContentColor);
    data.append('dateBgColor', formData.dateBgColor);
    data.append('cardBgColor', formData.cardBgColor);
    data.append('contentVerticalOffset', formData.contentVerticalOffset);
    data.append('titleFontSize', `${formData.titleFontSize}rem`);
    data.append('titleFontWeight', formData.titleFontWeight);
    data.append('titleFontFamily', formData.titleFontFamily);
    data.append('titleColor', formData.titleColor);
    data.append('titleUnderline', formData.titleUnderline);
    
    data.append('subtitleFontSize', `${formData.subtitleFontSize}rem`);
    data.append('subtitleFontWeight', formData.subtitleFontWeight);
    data.append('subtitleFontFamily', formData.subtitleFontFamily);
    data.append('subtitleColor', formData.subtitleColor);
    data.append('subtitleUnderline', formData.subtitleUnderline);
    data.append('subtitleShowBox', formData.subtitleShowBox);
    data.append('subtitleBoxColor', formData.subtitleBoxColor);
    data.append('subtitleBoxWidth', formData.subtitleBoxWidth);
    
    data.append('extraText', formData.extraText);
    data.append('extraTextShow', formData.extraTextShow);
    data.append('extraTextBgColor', formData.extraTextBgColor);
    data.append('extraTextWidth', formData.extraTextWidth);
    data.append('extraTextFontSize', `${formData.extraTextFontSize}rem`);
    data.append('extraTextFontWeight', formData.extraTextFontWeight);
    data.append('extraTextFontFamily', formData.extraTextFontFamily);
    data.append('extraTextColor', formData.extraTextColor);
    data.append('extraTextUnderline', formData.extraTextUnderline);
    
    data.append('subtitle2', formData.subtitle2);
    data.append('subtitle2FontSize', `${formData.subtitle2FontSize}rem`);
    data.append('subtitle2FontWeight', formData.subtitle2FontWeight);
    data.append('subtitle2FontFamily', formData.subtitle2FontFamily);
    data.append('subtitle2Color', formData.subtitle2Color);
    data.append('subtitle2Underline', formData.subtitle2Underline);

    data.append('title2', formData.title2);
    data.append('title2FontSize', `${formData.title2FontSize}rem`);
    data.append('title2FontWeight', formData.title2FontWeight);
    data.append('title2FontFamily', formData.title2FontFamily);
    data.append('title2Color', formData.title2Color);
    data.append('title2Underline', formData.title2Underline);
    
    // Sub-Subject Image
    data.append('subImagePosition', formData.subImagePosition);
    data.append('subImageSize', formData.subImageSize);
    data.append('subImageFit', formData.subImageFit);
    data.append('subImageObjectPosition', formData.subImageObjectPosition);
    if (subImage) {
      data.append('subImage', subImage);
    } else if (subPreviewUrl) {
      // Pass the existing URL back if no new image was uploaded to avoid wiping it out
      data.append('existingSubImage', subPreviewUrl);
    }

    if (image) {
      data.append('image', image);
    } else if (previewUrl) {
      data.append('existingImage', previewUrl);
    }

    try {
      const response = await axios.post('/api/cards', data);
      onCardGenerated(response.data);
      alert('Card generated successfully!');
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Failed to generate card');
    } finally {
      setLoading(false);
    }
  };

  const previewCardData = {
    title: formData.title || 'HEADING',
    subtitle: formData.subtitle || 'Subtitle',
    date: formData.date,
    imagePosition: formData.imagePosition,
    imageSize: formData.imageSize,
    imageFit: formData.imageFit,
    imageObjectPosition: formData.imageObjectPosition,
    headlineWidth: formData.headlineWidth,
    footerStyle: formData.footerStyle,
    footerText: formData.footerText,
    footerBgColor: formData.footerBgColor,
    footerContentColor: formData.footerContentColor,
    dateBgColor: formData.dateBgColor,
    image: previewUrl || 'https://via.placeholder.com/800x600?text=Upload+Image',
    titleStyle: {
      fontSize: `${formData.titleFontSize}rem`,
      fontWeight: formData.titleFontWeight,
      fontFamily: formData.titleFontFamily,
      color: formData.titleColor,
      underline: formData.titleUnderline,
    },
    subtitleStyle: {
      fontSize: `${formData.subtitleFontSize}rem`,
      fontWeight: formData.subtitleFontWeight,
      fontFamily: formData.subtitleFontFamily,
      color: formData.subtitleColor,
      underline: formData.subtitleUnderline,
    },
    subtitleShowBox: formData.subtitleShowBox,
    subtitleBoxColor: formData.subtitleBoxColor,
    subtitleBoxWidth: formData.subtitleBoxWidth,
    extraText: formData.extraText,
    extraTextShow: formData.extraTextShow,
    extraTextBgColor: formData.extraTextBgColor,
    extraTextWidth: formData.extraTextWidth,
    extraTextStyle: {
      fontSize: `${formData.extraTextFontSize}rem`,
      fontWeight: formData.extraTextFontWeight,
      fontFamily: formData.extraTextFontFamily,
      color: formData.extraTextColor,
      underline: formData.extraTextUnderline,
    },
    subtitle2: formData.subtitle2,
    subtitle2Style: {
      fontSize: `${formData.subtitle2FontSize}rem`,
      fontWeight: formData.subtitle2FontWeight,
      fontFamily: formData.subtitle2FontFamily,
      color: formData.subtitle2Color,
      underline: formData.subtitle2Underline,
    },
    title2: formData.title2,
    title2Style: {
      fontSize: `${formData.title2FontSize}rem`,
      fontWeight: formData.title2FontWeight,
      fontFamily: formData.title2FontFamily,
      color: formData.title2Color,
      underline: formData.title2Underline,
    },
    // Sub-Subject Image
    subImage: subPreviewUrl,
    subImagePosition: formData.subImagePosition,
    subImageSize: formData.subImageSize,
    subImageFit: formData.subImageFit,
    subImageObjectPosition: formData.subImageObjectPosition,
    // Card Layout & Background
    cardBgColor: formData.cardBgColor,
    contentVerticalOffset: formData.contentVerticalOffset
  };

  const handleImagePositionChange = (newPos, target) => {
    const targetToUpdate = target || activeEditTarget;
    if (targetToUpdate === 'main') {
      setFormData(prev => ({ ...prev, imageObjectPosition: newPos }));
    } else {
      setFormData(prev => ({ ...prev, subImageObjectPosition: newPos }));
    }
  };

  return (
    <div className="generator-container" style={{
      display: 'flex',
      gap: '2rem',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      background: '#1a1a1a',
      padding: '2rem',
      borderRadius: '16px',
      marginBottom: '3rem'
    }}>
      <form className="card-form" onSubmit={handleSubmit} style={{ flex: 1, minWidth: '350px', margin: 0 }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create News Card</h2>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', color: '#aaa' }}>Footer Settings</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Footer Style</label>
              <select value={formData.footerStyle} onChange={(e) => setFormData({...formData, footerStyle: e.target.value})} style={{ width: '100%', fontSize: '11px', padding: '6px', background: '#333', color: 'white', border: '1px solid #444' }}>
                <option value="split">Split (Text & Icons)</option>
                <option value="centered">Centered (Text & Icons)</option>
                <option value="icons">Icons Only (Centered)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Footer Text</label>
              <input 
                type="text" 
                value={formData.footerText} 
                onChange={(e) => setFormData({...formData, footerText: e.target.value})} 
                style={{ width: '100%', fontSize: '11px', padding: '6px', background: '#333', color: 'white', border: '1px solid #444' }}
                placeholder="e.g. www.whiteswantvnews.com"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', display: 'block', marginBottom: '3px' }}>BG Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input 
                    type="color" 
                    value={formData.footerBgColor === 'transparent' ? '#ffffff' : formData.footerBgColor} 
                    onChange={(e) => setFormData({...formData, footerBgColor: e.target.value})} 
                    disabled={formData.footerBgColor === 'transparent'}
                    style={{ width: '30px', height: '24px', padding: '0', border: 'none', background: 'none' }} 
                  />
                  <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.footerBgColor === 'transparent'} 
                      onChange={(e) => setFormData({...formData, footerBgColor: e.target.checked ? 'transparent' : '#f8f107'})}
                    /> Trans
                  </label>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', display: 'block', marginBottom: '3px' }}>Content Color</label>
                <input 
                  type="color" 
                  value={formData.footerContentColor} 
                  onChange={(e) => setFormData({...formData, footerContentColor: e.target.value})} 
                  style={{ width: '100%', height: '24px', padding: '0', border: 'none', background: 'none' }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', color: '#aaa' }}>Card Branding & Layout</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Card Background</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="color" 
                  value={formData.cardBgColor} 
                  onChange={(e) => setFormData({...formData, cardBgColor: e.target.value})} 
                  style={{ width: '40px', height: '30px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} 
                />
                <span style={{ fontSize: '11px', color: '#888' }}>{formData.cardBgColor.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Content Vertical Offset ({formData.contentVerticalOffset}px)</label>
              <input 
                type="range" 
                min="-100" 
                max="100" 
                value={formData.contentVerticalOffset} 
                onChange={(e) => setFormData({...formData, contentVerticalOffset: parseInt(e.target.value)})} 
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Heading Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g., Breaking News"
          />
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#252525', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.titleFontFamily} onChange={(e) => setFormData({...formData, titleFontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Anton">Anton</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Oswald">Oswald</option>
                <option value="Poppins">Poppins</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Raleway">Raleway</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Nunito">Nunito</option>
                <option value="PT Sans">PT Sans</option>
                <option value="Arvo">Arvo</option>
                <option value="Lora">Lora</option>
                <option value="Anek Malayalam">Anek Malayalam (MAL)</option>
                <option value="Anek Malayalam Condensed">Anek Malayalam Condensed (MAL)</option>
                <option value="Baloo Chettan 2">Baloo Chettan 2 (MAL)</option>
                <option value="Gayathri">Gayathri (MAL)</option>
                <option value="Manjari">Manjari (MAL)</option>
                <option value="Noto Sans Malayalam">Noto Sans (MAL)</option>
                <option value="Noto Serif Malayalam">Noto Serif (MAL)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Size ({formData.titleFontSize}rem)</label>
              <input 
                type="range" 
                min="1" 
                max="6" 
                step="0.1" 
                value={formData.titleFontSize} 
                onChange={(e) => setFormData({...formData, titleFontSize: parseFloat(e.target.value)})} 
                style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Weight</label>
              <select value={formData.titleFontWeight} onChange={(e) => setFormData({...formData, titleFontWeight: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Color</label>
              <input type="color" value={formData.titleColor} onChange={(e) => setFormData({...formData, titleColor: e.target.value})} style={{ width: '100%', height: '24px', padding: '0', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" checked={formData.titleUnderline} onChange={(e) => setFormData({...formData, titleUnderline: e.target.checked})} />
              <label style={{ fontSize: '10px' }}>U</label>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '5px' }}>
              <label style={{ fontSize: '10px', display: 'block' }}>Headline Box Width ({formData.headlineWidth}%)</label>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={formData.headlineWidth} 
                onChange={(e) => setFormData({...formData, headlineWidth: parseInt(e.target.value)})} 
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            required
            placeholder="e.g., New MERN stack tutorial"
          />
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#252525', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.subtitleFontFamily} onChange={(e) => setFormData({...formData, subtitleFontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Nunito">Nunito</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="PT Sans">PT Sans</option>
                <option value="Raleway">Raleway</option>
                <option value="Anek Malayalam">Anek Malayalam (MAL)</option>
                <option value="Anek Malayalam Condensed">Anek Malayalam Condensed (MAL)</option>
                <option value="Baloo Chettan 2">Baloo Chettan 2 (MAL)</option>
                <option value="Gayathri">Gayathri (MAL)</option>
                <option value="Manjari">Manjari (MAL)</option>
                <option value="Noto Sans Malayalam">Noto Sans (MAL)</option>
                <option value="Noto Serif Malayalam">Noto Serif (MAL)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Size ({formData.subtitleFontSize}rem)</label>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={formData.subtitleFontSize} 
                onChange={(e) => setFormData({...formData, subtitleFontSize: parseFloat(e.target.value)})} 
                style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Weight</label>
              <select value={formData.subtitleFontWeight} onChange={(e) => setFormData({...formData, subtitleFontWeight: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Color</label>
              <input type="color" value={formData.subtitleColor} onChange={(e) => setFormData({...formData, subtitleColor: e.target.value})} style={{ width: '100%', height: '24px', padding: '0', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" checked={formData.subtitleUnderline} onChange={(e) => setFormData({...formData, subtitleUnderline: e.target.checked})} />
              <label style={{ fontSize: '10px' }}>U</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
              <input type="checkbox" id="showBox" checked={formData.subtitleShowBox} onChange={(e) => setFormData({...formData, subtitleShowBox: e.target.checked})} />
              <label htmlFor="showBox" style={{ fontSize: '10px', cursor: 'pointer' }}>Show Box</label>
              <input 
                type="color" 
                value={formData.subtitleBoxColor} 
                onChange={(e) => setFormData({...formData, subtitleBoxColor: e.target.value})} 
                disabled={!formData.subtitleShowBox}
                style={{ width: '30px', height: '20px', padding: '0', border: 'none', background: 'none' }} 
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '5px' }}>
              <label style={{ fontSize: '10px', display: 'block' }}>Subtitle Box Width ({formData.subtitleBoxWidth}%)</label>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={formData.subtitleBoxWidth} 
                onChange={(e) => setFormData({...formData, subtitleBoxWidth: parseInt(e.target.value)})} 
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Heading Title 2 (Secondary Headline)</label>
          <input
            type="text"
            value={formData.title2}
            onChange={(e) => setFormData({ ...formData, title2: e.target.value })}
            placeholder="e.g., വയനാട് തുരങ്കപാത നിർമ്മാണത്തിന്റെ"
          />
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#252525', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.title2FontFamily} onChange={(e) => setFormData({...formData, title2FontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Anek Malayalam">Anek (MAL)</option>
                <option value="Anek Malayalam Condensed">Anek Condensed (MAL)</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Baloo Chettan 2">Baloo (MAL)</option>
                <option value="Gayathri">Gayathri (MAL)</option>
                <option value="Manjari">Manjari (MAL)</option>
                <option value="Noto Sans Malayalam">Noto Sans (MAL)</option>
                <option value="Noto Serif Malayalam">Noto Serif (MAL)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Size ({formData.title2FontSize}rem)</label>
              <input type="range" min="0.5" max="5" step="0.1" value={formData.title2FontSize} onChange={(e) => setFormData({...formData, title2FontSize: parseFloat(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Weight</label>
              <select value={formData.title2FontWeight} onChange={(e) => setFormData({...formData, title2FontWeight: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Color</label>
              <input type="color" value={formData.title2Color} onChange={(e) => setFormData({...formData, title2Color: e.target.value})} style={{ width: '100%', height: '24px', padding: '0', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" checked={formData.title2Underline} onChange={(e) => setFormData({...formData, title2Underline: e.target.checked})} />
              <label style={{ fontSize: '10px' }}>U</label>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Subtitle 2 (Extra text - Optional)</label>
          <input
            type="text"
            value={formData.subtitle2}
            onChange={(e) => setFormData({ ...formData, subtitle2: e.target.value })}
            placeholder="e.g., നടത്തി മുഖ്യമന്ത്രി പിണറായി വിജയൻ"
          />
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#252525', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.subtitle2FontFamily} onChange={(e) => setFormData({...formData, subtitle2FontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Anek Malayalam">Anek (MAL)</option>
                <option value="Anek Malayalam Condensed">Anek Condensed (MAL)</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Baloo Chettan 2">Baloo (MAL)</option>
                <option value="Gayathri">Gayathri (MAL)</option>
                <option value="Manjari">Manjari (MAL)</option>
                <option value="Noto Sans Malayalam">Noto Sans (MAL)</option>
                <option value="Noto Serif Malayalam">Noto Serif (MAL)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Size ({formData.subtitle2FontSize}rem)</label>
              <input type="range" min="0.5" max="3" step="0.1" value={formData.subtitle2FontSize} onChange={(e) => setFormData({...formData, subtitle2FontSize: parseFloat(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Weight</label>
              <select value={formData.subtitle2FontWeight} onChange={(e) => setFormData({...formData, subtitle2FontWeight: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Color</label>
              <input type="color" value={formData.subtitle2Color} onChange={(e) => setFormData({...formData, subtitle2Color: e.target.value})} style={{ width: '100%', height: '24px', padding: '0', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" checked={formData.subtitle2Underline} onChange={(e) => setFormData({...formData, subtitle2Underline: e.target.checked})} />
              <label style={{ fontSize: '10px' }}>U</label>
            </div>
          </div>
        </div>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', color: '#aaa' }}>Highlight Box (Bottom)</h4>
          <div className="input-group" style={{ marginBottom: '10px' }}>
             <input 
               type="text" 
               value={formData.extraText} 
               onChange={(e) => setFormData({...formData, extraText: e.target.value})} 
               placeholder="e.g. മന്ത്രി മുഹമ്മദ് റിയാസും ചടങ്ങിൽ പങ്കെടുത്തു"
               style={{ width: '100%' }}
             />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
               <input 
                 type="checkbox" 
                 checked={formData.extraTextShow} 
                 onChange={(e) => setFormData({...formData, extraTextShow: e.target.checked})} 
               /> Show Box
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px' }}>Color</label>
              <input 
                type="color" 
                value={formData.extraTextBgColor} 
                onChange={(e) => setFormData({...formData, extraTextBgColor: e.target.value})} 
                disabled={!formData.extraTextShow}
                style={{ width: '40px', height: '24px', padding: '0', border: 'none', background: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px' }}>Width ({formData.extraTextWidth}%)</label>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={formData.extraTextWidth} 
                onChange={(e) => setFormData({...formData, extraTextWidth: parseInt(e.target.value)})} 
                style={{ width: '80px' }}
              />
            </div>
          </div>
          
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#333', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.extraTextFontFamily} onChange={(e) => setFormData({...formData, extraTextFontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Anek Malayalam">Anek (MAL)</option>
                <option value="Anek Malayalam Condensed">Anek Condensed (MAL)</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Baloo Chettan 2">Baloo (MAL)</option>
                <option value="Gayathri">Gayathri (MAL)</option>
                <option value="Manjari">Manjari (MAL)</option>
                <option value="Noto Sans Malayalam">Noto Sans (MAL)</option>
                <option value="Noto Serif Malayalam">Noto Serif (MAL)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Size ({formData.extraTextFontSize}rem)</label>
              <input type="range" min="0.5" max="2" step="0.1" value={formData.extraTextFontSize} onChange={(e) => setFormData({...formData, extraTextFontSize: parseFloat(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Weight</label>
              <select value={formData.extraTextFontWeight} onChange={(e) => setFormData({...formData, extraTextFontWeight: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '10px' }}>Text Color</label>
              <input type="color" value={formData.extraTextColor} onChange={(e) => setFormData({...formData, extraTextColor: e.target.value})} style={{ width: '100%', height: '24px', padding: '0', border: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" checked={formData.extraTextUnderline} onChange={(e) => setFormData({...formData, extraTextUnderline: e.target.checked})} />
              <label style={{ fontSize: '10px' }}>U</label>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '12px' }}>Badge Color</label>
            <input 
              type="color" 
              value={formData.dateBgColor} 
              onChange={(e) => setFormData({...formData, dateBgColor: e.target.value})} 
              style={{ width: '40px', height: '24px', padding: '0', border: 'none', background: 'none' }} 
            />
            <button 
              type="button" 
              onClick={() => setFormData({...formData, dateBgColor: '#2ba5bc'})}
              style={{ fontSize: '10px', padding: '2px 8px' }}
            >
              Apply Teal
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>Subject Position</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '5px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="radio" 
                name="position" 
                value="left" 
                checked={formData.imagePosition === 'left'}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              /> Left
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="radio" 
                name="position" 
                value="right" 
                checked={formData.imagePosition === 'right'}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              /> Right
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="radio" 
                name="position" 
                value="top" 
                checked={formData.imagePosition === 'top'}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              /> Top
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="radio" 
                name="position" 
                value="bottom" 
                checked={formData.imagePosition === 'bottom'}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              /> Bottom
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="radio" 
                name="position" 
                value="free" 
                checked={formData.imagePosition === 'free'}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              /> Free
            </label>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Image Size ({formData.imageSize}%)</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="1" 
                value={formData.imageSize} 
                onChange={(e) => setFormData({...formData, imageSize: parseInt(e.target.value)})} 
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Fit</label>
              <select value={formData.imageFit} onChange={(e) => setFormData({...formData, imageFit: e.target.value})} style={{ width: '100%', fontSize: '11px', padding: '4px' }}>
                <option value="cover">Cover (Fill)</option>
                <option value="contain">Contain</option>
              </select>
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Focus</label>
              <select value={formData.imageObjectPosition} onChange={(e) => setFormData({...formData, imageObjectPosition: e.target.value})} style={{ width: '100%', fontSize: '11px', padding: '4px' }}>
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top left">Top Left</option>
                <option value="top right">Top Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom right">Bottom Right</option>
                <option value="left center">Center-Left</option>
                <option value="right center">Center-Right</option>
                <option value="center top">Center-Top</option>
                <option value="center bottom">Center-Bottom</option>
              </select>
            </div>
          </div>
        </div>
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ margin: 0 }}>Upload Subject Image</label>
            {(image || previewUrl) && (
              <button 
                type="button" 
                onClick={() => {
                  setImage(null);
                  setPreviewUrl('');
                  const input = document.getElementById('mainImageInput');
                  if (input) input.value = '';
                }}
                style={{ background: '#ff4444', color: 'white', padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
              >
                Remove Image
              </button>
            )}
          </div>
          {(!image && previewUrl) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#333', padding: '10px', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}>
              <img src={previewUrl.startsWith('http') ? previewUrl : `/${previewUrl}`} alt="Current Subject" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} crossOrigin="anonymous" />
              <span style={{ fontSize: '12px', color: '#aaa', flex: 1 }}>Using previously saved image.</span>
            </div>
          ) : (
            <input
              id="mainImageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required={!previewUrl}
              style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: 'white', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}
            />
          )}
          {image && (
            <button 
              type="button" 
              onClick={handleRemoveBackground} 
              disabled={isProcessingBG}
              style={{ 
                width: '100%', 
                background: isProcessingBG ? '#444' : '#2ba5bc', 
                color: 'white', 
                padding: '8px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isProcessingBG ? 'not-allowed' : 'pointer'
              }}
            >
              {isProcessingBG ? (
                <>⏳ AI Removing Background...</>
              ) : (
                <>✨ AI Remove Background</>
              )}
            </button>
          )}
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '8px' }}>
            {isProcessingBG ? 'AI is working hard... please wait (30-60s)' : 'Tip: Use the AI button above to remove backgrounds for a clean cutout look.'}
          </p>
        </div>

        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Sub-Subject Image (Second Image)</h4>
            {(subImage || subPreviewUrl) && (
              <button 
                type="button" 
                onClick={() => {
                  setSubImage(null);
                  setSubPreviewUrl('');
                  const input = document.getElementById('subImageInput');
                  if (input) input.value = '';
                }}
                style={{ background: '#ff4444', color: 'white', padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
              >
                Remove Image
              </button>
            )}
          </div>

          {(!subImage && subPreviewUrl) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#333', padding: '10px', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}>
              <img src={subPreviewUrl.startsWith('http') ? subPreviewUrl : `/${subPreviewUrl}`} alt="Current Sub Subject" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} crossOrigin="anonymous" />
              <span style={{ fontSize: '12px', color: '#aaa', flex: 1 }}>Using previously saved image.</span>
            </div>
          ) : (
            <input
              id="subImageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setSubImage(e.target.files[0])}
              style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: 'white', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}
            />
          )}
          {subImage && (
            <button 
              type="button" 
              onClick={handleRemoveSubBackground} 
              disabled={isProcessingSubBG}
              style={{ 
                width: '100%', 
                background: isProcessingSubBG ? '#444' : '#2ba5bc', 
                color: 'white', 
                padding: '8px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isProcessingSubBG ? 'not-allowed' : 'pointer',
                marginBottom: '10px'
              }}
            >
              {isProcessingSubBG ? (
                <>⏳ AI Removing Background...</>
              ) : (
                <>✨ AI Remove Background (Sub)</>
              )}
            </button>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
            <label style={{ fontSize: '12px', display: 'block' }}>Position</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['left', 'right', 'top', 'bottom', 'free'].map(pos => (
                <label key={pos} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="subPosition" 
                    value={pos} 
                    checked={formData.subImagePosition === pos}
                    onChange={(e) => setFormData({ ...formData, subImagePosition: e.target.value })}
                  /> {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '3px' }}>Size ({formData.subImageSize}%)</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="1" 
                value={formData.subImageSize} 
                onChange={(e) => setFormData({...formData, subImageSize: parseInt(e.target.value)})} 
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '80px' }}>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '3px' }}>Fit</label>
              <select value={formData.subImageFit} onChange={(e) => setFormData({...formData, subImageFit: e.target.value})} style={{ width: '100%', fontSize: '10px', padding: '2px' }}>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </select>
            </div>
            <div style={{ width: '80px' }}>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '3px' }}>Focus</label>
              <select value={formData.subImageObjectPosition} onChange={(e) => setFormData({...formData, subImageObjectPosition: e.target.value})} style={{ width: '100%', fontSize: '10px', padding: '2px' }}>
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top left">Top Left</option>
                <option value="top right">Top Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom right">Bottom Right</option>
                <option value="left center">Center-Left</option>
                <option value="right center">Center-Right</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'AI Processing (30-60s)...' : 'Generate & Save'}
        </button>
      </form>

      <div className="preview-section" style={{ 
        flex: 1, 
        minWidth: '550px', 
        position: 'sticky', 
        top: '20px',
        alignSelf: 'flex-start'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, opacity: 0.8 }}>Live Preview</h3>
          <div className="edit-target-toggle" style={{ display: 'flex', gap: '5px', background: '#252525', padding: '4px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => setActiveEditTarget('main')}
              style={{ 
                fontSize: '11px', 
                padding: '4px 10px', 
                background: activeEditTarget === 'main' ? '#2ba5bc' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Main Image
            </button>
            <button 
              type="button"
              onClick={() => setActiveEditTarget('sub')}
              style={{ 
                fontSize: '11px', 
                padding: '4px 10px', 
                background: activeEditTarget === 'sub' ? '#2ba5bc' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Sub Image
            </button>
          </div>
        </div>
        <div className="preview-wrapper" style={{ 
          filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
        }}>
          <PremiumCard 
            card={previewCardData} 
            globalLogo={globalLogo} 
            isPreview={true} 
            onImagePositionChange={handleImagePositionChange}
            activeEditTarget={activeEditTarget}
            onTargetSelect={setActiveEditTarget}
          />
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;
