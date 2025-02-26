import React, { useEffect, useState } from 'react';
import './GiftCardLoader.css';

const GiftCardLoader = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="gift-card-loader">
      <div className="loader-content">
        <div className="card-animation">
          <div className="card-shine"></div>
        </div>
        
        <h2 className="loader-title">Loading Your Gift Card</h2>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="loader-message">
          {progress < 30 && "Preparing your dining experience..."}
          {progress >= 30 && progress < 60 && "Finding the best offers..."}
          {progress >= 60 && progress < 90 && "Almost ready..."}
          {progress >= 90 && "Get ready for delicious savings!"}
        </div>
        
        <div className="loader-icons">
          <span className="icon-container">🍽️</span>
          <span className="icon-container">🎁</span>
          <span className="icon-container">💳</span>
        </div>
      </div>
    </div>
  );
};

export default GiftCardLoader;