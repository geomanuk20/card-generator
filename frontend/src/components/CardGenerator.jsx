import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PremiumCard from './PremiumCard';
const backendURL = ''; // Use relative paths for production

const CardGenerator = ({ onCardGenerated, globalLogo }) => {
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
  });
  const [image, setImage] = useState(null);
  const [subImage, setSubImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [subPreviewUrl, setSubPreviewUrl] = useState('');
  const [isProcessingBG, setIsProcessingBG] = useState(false);
  const [isProcessingSubBG, setIsProcessingSubBG] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleRemoveBackground = async () => {
    if (!image) return alert('Please upload an image first');
    
    setIsProcessingBG(true);
    const bgData = new FormData();
    bgData.append('image', image);

    try {
      const response = await axios.post('/api/cards/remove-bg', bgData);
      if (response.data.success) {
        // We need to fetch the processed image and set it back to the image state
        // or just update how we handle the preview. 
        // For simplicity and to ensure final generation uses the no-bg version,
        // we'll fetch the image from the server and create a new File/Blob.
        const imageUrl = `/${response.data.imagePath}`;
        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();
        
        // Create a new File object to keep names consistent
        const noBgFile = new File([blob], image.name.replace(/\.[^/.]+$/, "") + "-no-bg.png", { type: "image/png" });
        
        setImage(noBgFile);
        alert('Background removed successfully!');
      }
    } catch (error) {
      console.error('Background removal failed:', error);
      alert('AI Background removal failed. Please try again or use a different image.');
    } finally {
      setIsProcessingBG(false);
    }
  };

  const handleRemoveSubBackground = async () => {
    if (!subImage) return alert('Please upload a sub-image first');
    
    setIsProcessingSubBG(true);
    const bgData = new FormData();
    bgData.append('image', subImage);

    try {
      const response = await axios.post('/api/cards/remove-bg', bgData);
      if (response.data.imagePath) {
        const imageUrl = `/${response.data.imagePath}`;
        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();
        const noBgFile = new File([blob], subImage.name.replace(/\.[^/.]+$/, "") + "-no-bg.png", { type: "image/png" });
        setSubImage(noBgFile);
        alert('Sub-image background removed successfully!');
      }
    } catch (error) {
      console.error('Sub-image background removal failed:', error);
      alert('AI Background removal failed for sub-image.');
    } finally {
      setIsProcessingSubBG(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload a main image');

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
    if (subImage) data.append('subImage', subImage);

    data.append('image', image);

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
    subImageObjectPosition: formData.subImageObjectPosition
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
          </div>
          
          <div className="styling-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '10px', background: '#333', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontSize: '10px' }}>Family</label>
              <select value={formData.extraTextFontFamily} onChange={(e) => setFormData({...formData, extraTextFontFamily: e.target.value})} style={{ width: '100%', fontSize: '11px' }}>
                <option value="Anek Malayalam">Anek (MAL)</option>
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
          <label>Upload Subject Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: 'white', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}
          />
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
          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', color: '#aaa' }}>Sub-Subject Image (Second Image)</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSubImage(e.target.files[0])}
            style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: 'white', borderRadius: '4px', border: '1px solid #444', marginBottom: '10px' }}
          />
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
              {['left', 'right', 'top', 'bottom'].map(pos => (
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
        <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Live Preview</h3>
        <div className="preview-wrapper" style={{ 
          filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
        }}>
          <PremiumCard card={previewCardData} globalLogo={globalLogo} isPreview={true} />
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;
