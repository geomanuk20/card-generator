import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardGenerator from './components/CardGenerator';
import PremiumCard from './components/PremiumCard';
import GlobalBranding from './components/GlobalBranding';

const App = () => {
  const [cards, setCards] = useState([]);
  const [globalLogo, setGlobalLogo] = useState('');

  const fetchCards = async () => {
    try {
      const response = await axios.get('/api/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchGlobalLogo = async () => {
    try {
      const response = await axios.get('/api/settings/logo');
      setGlobalLogo(response.data.value);
    } catch (error) {
      console.error('Error fetching global logo:', error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchGlobalLogo();
  }, []);

  const handleCardGenerated = (newCard) => {
    setCards([newCard, ...cards]);
  };

  return (
    <div className="container">
      <h1>Card Generator</h1>

      <GlobalBranding
        currentLogo={globalLogo}
        onLogoUpdate={(newLogo) => setGlobalLogo(newLogo)}
      />

      <CardGenerator
        onCardGenerated={handleCardGenerated}
        globalLogo={globalLogo}
      />

      <div className="content-list">
        {cards.map((card) => (
          <PremiumCard
            key={card._id}
            card={card}
            globalLogo={globalLogo}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
