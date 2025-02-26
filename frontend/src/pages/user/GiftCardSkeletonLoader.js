import React, { useEffect, useState, useRef, useCallback } from 'react';
import './GiftCardSkeletonLoader.css';

const GiftCardSkeletonLoader = ({ visibleCards, onLoadMore }) => {
  const [skeletonCount, setSkeletonCount] = useState(3);
  const observer = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkeletonCount((prev) => prev + 3);
          if (onLoadMore) onLoadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [onLoadMore]
  );

  return (
    <div className="skeleton-container">
      {[...Array(skeletonCount)].map((_, index) => (
        <div 
          className="skeleton-card" 
          key={index} 
          ref={index === skeletonCount - 1 ? lastCardRef : null}
        >
          <div className="skeleton-image-container">
            <div className="skeleton-image pulse"></div>
            <div className="skeleton-tag pulse"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-title pulse"></div>
            <div className="skeleton-description pulse"></div>
            <div className="skeleton-description pulse" style={{ width: '80%' }}></div>
            <div className="skeleton-info">
              <div className="skeleton-price pulse"></div>
              <div className="skeleton-discount pulse"></div>
            </div>
            <div className="skeleton-button pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GiftCardSkeletonLoader;