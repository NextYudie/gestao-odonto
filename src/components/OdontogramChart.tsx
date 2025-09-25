import React, { useState } from 'react';

// Define tooth data for adult teeth (FDI numbering)
const adultTeeth = [
  // Upper Right Quadrant (10s)
  { number: 18, name: 'Terceiro Molar Superior Direito' },
  { number: 17, name: 'Segundo Molar Superior Direito' },
  { number: 16, name: 'Primeiro Molar Superior Direito' },
  { number: 15, name: 'Segundo Pré-Molar Superior Direito' },
  { number: 14, name: 'Primeiro Pré-Molar Superior Direito' },
  { number: 13, name: 'Canino Superior Direito' },
  { number: 12, name: 'Incisivo Lateral Superior Direito' },
  { number: 11, name: 'Incisivo Central Superior Direito' },
  // Upper Left Quadrant (20s)
  { number: 21, name: 'Incisivo Central Superior Esquerdo' },
  { number: 22, name: 'Incisivo Lateral Superior Esquerdo' },
  { number: 23, name: 'Canino Superior Esquerdo' },
  { number: 24, name: 'Primeiro Pré-Molar Superior Esquerdo' },
  { number: 25, name: 'Segundo Pré-Molar Superior Esquerdo' },
  { number: 26, name: 'Primeiro Molar Superior Esquerdo' },
  { number: 27, name: 'Segundo Molar Superior Esquerdo' },
  { number: 28, name: 'Terceiro Molar Superior Esquerdo' },
  // Lower Left Quadrant (30s)
  { number: 38, name: 'Terceiro Molar Inferior Esquerdo' },
  { number: 37, name: 'Segundo Molar Inferior Esquerdo' },
  { number: 36, name: 'Primeiro Molar Inferior Esquerdo' },
  { number: 35, name: 'Segundo Pré-Molar Inferior Esquerdo' },
  { number: 34, name: 'Primeiro Pré-Molar Inferior Esquerdo' },
  { number: 33, name: 'Canino Inferior Esquerdo' },
  { number: 32, name: 'Incisivo Lateral Inferior Esquerdo' },
  { number: 31, name: 'Incisivo Central Inferior Esquerdo' },
  // Lower Right Quadrant (40s)
  { number: 41, name: 'Incisivo Central Inferior Direito' },
  { number: 42, name: 'Incisivo Lateral Inferior Direito' },
  { number: 43, name: 'Canino Inferior Direito' },
  { number: 44, name: 'Primeiro Pré-Molar Inferior Direito' },
  { number: 45, name: 'Segundo Pré-Molar Inferior Direito' },
  { number: 46, name: 'Primeiro Molar Inferior Direito' },
  { number: 47, name: 'Segundo Molar Inferior Direito' },
  { number: 48, name: 'Terceiro Molar Inferior Direito' },
];

const OdontogramChart = ({ chartData = {}, onToothClick }) => {
  const handleToothClick = (toothNumber) => {
    if (onToothClick) {
      onToothClick(toothNumber);
    }
  };

  return (
    <div className="odontogram-chart p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Odontograma</h3>
      <div className="grid grid-cols-8 gap-2 text-center">
        {adultTeeth.map((tooth) => (
          <div
            key={tooth.number}
            className="tooth-item p-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => handleToothClick(tooth.number)}
          >
            <div className="font-semibold text-gray-700">{tooth.number}</div>
            <div className="text-xs text-gray-500">{tooth.name.split(' ')[0]}</div> {/* Display only first word of name */}
            {/* Basic visual representation of a tooth (placeholder) */}
            <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mt-1">
              <rect x="10" y="5" width="20" height="30" fill="#e0e0e0" stroke="#9e9e9e" strokeWidth="1" />
              {/* Display status if available */}
              {chartData[tooth.number] && chartData[tooth.number].status && (
                <text x="20" y="25" textAnchor="middle" fontSize="10" fill="black">
                  {chartData[tooth.number].status.substring(0, 3)} {/* Display first 3 chars of status */}
                </text>
              )}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OdontogramChart;
