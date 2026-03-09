import React, { useState } from 'react';
import axios from 'axios';

const GlobalBranding = ({ currentLogo, onLogoUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await axios.post('/api/settings/logo', formData);
      onLogoUpdate(response.data.value);
      alert('Logo updated successfully!');
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo');
    } finally {
      setLoading(false);
    }
  };

  const logoUrl = currentLogo ? (currentLogo.startsWith('http') ? currentLogo : `/${currentLogo}`) : null;

  return (
    <div className="global-branding" style={{
      background: '#1e1e1e',
      padding: '1.5rem',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '500px',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div className="current-logo-preview" style={{
        width: '80px',
        height: '80px',
        background: '#002d72',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Global Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ) : (
          <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>No Logo</span>
        )}
      </div>
      <div className="logo-upload-controls" style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Global Branding Logo</h3>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>
          Upload your logo once to apply it to all generated cards.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          disabled={loading}
          id="global-logo-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="global-logo-input" style={{
          padding: '0.5rem 1rem',
          background: 'var(--secondary-yellow)',
          color: 'black',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          {loading ? 'Uploading...' : 'Change Logo'}
        </label>
      </div>
    </div>
  );
};

export default GlobalBranding;
