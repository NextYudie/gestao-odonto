import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg mb-4">
          <i className="fas fa-heartbeat text-3xl text-blue-600 animate-pulse"></i>
        </div>
        
        <div className="relative">
          <div className="w-12 h-12 mx-auto border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        
        <p className="text-gray-600 mt-4 font-medium">Carregando sistema...</p>
        <p className="text-gray-400 text-sm">Clínica Saúde Total</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;