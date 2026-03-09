import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardGenerator from './components/CardGenerator';
import PremiumCard from './components/PremiumCard';
import GlobalBranding from './components/GlobalBranding';

const App = () => {
  const [cards, setCards] = useState([]);
  const [brandingSettings, setBrandingSettings] = useState({ value: '', logoSize: 80, logoBgColor: '#002d72' });

  const fetchCards = async () => {
    try {
      const response = await axios.get('/api/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchBrandingSettings = async () => {
    try {
      const response = await axios.get('/api/settings/logo');
      if (response.data) {
        setBrandingSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching global logo:', error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchBrandingSettings();
  }, []);

  const handleCardGenerated = (newCard) => {
    setCards([newCard, ...cards]);
  };

  return (
    <div className="container">
      <h1>Card Generator</h1>

      <GlobalBranding
        brandingSettings={brandingSettings}
        onUpdate={(updated) => setBrandingSettings(updated)}
      />

      <CardGenerator
        onCardGenerated={handleCardGenerated}
        brandingSettings={brandingSettings}
      />

      <div className="content-list">
        {cards.map((card) => (
          <PremiumCard
            key={card._id}
            card={card}
            brandingSettings={brandingSettings}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
