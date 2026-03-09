import React, { useState } from 'react';
import axios from 'axios';

const GlobalBranding = ({ brandingSettings, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('logoSize', brandingSettings.logoSize);
    formData.append('logoBgColor', brandingSettings.logoBgColor);

    try {
      const response = await axios.post('/api/settings/logo', formData);
      onUpdate(response.data);
      alert('Logo updated successfully!');
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingUpdate = async (field, value) => {
    const updated = { ...brandingSettings, [field]: value };
    onUpdate(updated); // Optimistic update

    try {
      await axios.post('/api/settings/update-branding', {
        [field]: value
      });
    } catch (error) {
      console.error('Error updating branding settings:', error);
    }
  };

  const logoUrl = brandingSettings.value ? (brandingSettings.value.startsWith('http') ? brandingSettings.value : `/${brandingSettings.value}`) : null;

  return (
    <div className="global-branding" style={{
      background: '#1a1a1a',
      padding: '1.5rem',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '1000px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #333',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--secondary-yellow)' }}>Global Branding Settings</h3>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="current-logo-preview" style={{
          width: '120px',
          height: '120px',
          background: brandingSettings.logoBgColor || '#002d72',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid #333',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        }}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Global Logo" 
              style={{ 
                maxWidth: `${brandingSettings.logoSize || 80}%`, 
                maxHeight: `${brandingSettings.logoSize || 80}%`,
                objectFit: 'contain',
                transition: 'all 0.3s ease'
              }} 
            />
          ) : (
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>No Logo</span>
          )}
        </div>

        <div className="logo-controls" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              Logo Size ({brandingSettings.logoSize || 80}%)
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={brandingSettings.logoSize || 80}
              onChange={(e) => handleSettingUpdate('logoSize', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
              Background Color
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="color" 
                value={brandingSettings.logoBgColor || '#002d72'}
                onChange={(e) => handleSettingUpdate('logoBgColor', e.target.value)}
                style={{ width: '50px', height: '30px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
              <input 
                type="text" 
                value={brandingSettings.logoBgColor || '#002d72'}
                onChange={(e) => handleSettingUpdate('logoBgColor', e.target.value)}
                style={{ background: '#333', color: 'white', border: '1px solid #444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', width: '100px' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={loading}
              id="global-logo-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="global-logo-input" style={{
              padding: '0.6rem 1.2rem',
              background: 'var(--secondary-yellow)',
              color: 'black',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              {loading ? 'Uploading...' : 'Update Logo Image'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalBranding;
