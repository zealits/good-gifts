// src/context/LoadingContext.js
import React, { createContext, useContext, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingSpinner isLoading={isLoading}>
        {children}
      </LoadingSpinner>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};