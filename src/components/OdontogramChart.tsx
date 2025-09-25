import React from 'react';

interface OdontogramChartProps {
  chartData: any;
  onToothClick: (toothNumber: number, section: string, event: React.MouseEvent) => void;
  selectedTooth: { toothNumber: number, section: string } | null;
}

const OdontogramChart: React.FC<OdontogramChartProps> = ({ chartData, onToothClick, selectedTooth }) => {
  const teeth = {
    upperLeft: [18, 17, 16, 15, 14, 13, 12, 11],
    upperRight: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerLeft: [48, 47, 46, 45, 44, 43, 42, 41],
    lowerRight: [31, 32, 33, 34, 35, 36, 37, 38],
  };

  const renderTooth = (toothNumber: number) => {
    const toothData = chartData[toothNumber] || {};

    const getSectionColor = (section: string) => {
      const status = toothData[section] || 'hígido';
      switch (status) {
        case 'hígido':
          return '#0000FF';
        case 'cariado':
          return '#FF0000';
        case 'restaurado':
          return '#008000';
        case 'extraído':
          return '#808080';
        case 'coroa':
          return '#FFFF00';
        case 'implante':
          return '#800080';
        default:
          return '#FFFFFF';
      }
    };

    const isSelected = selectedTooth?.toothNumber === toothNumber;

    return (
      <g key={toothNumber}>
        <rect x="0" y="0" width="100" height="100" stroke={isSelected ? '#FBBF24' : '#000'} strokeWidth={isSelected ? 5 : 2} fill="none" />
        {/* Center */}
        <rect x="30" y="30" width="40" height="40" fill={getSectionColor('center')} onClick={(e) => onToothClick(toothNumber, 'center', e)} style={{ cursor: 'pointer' }} />
        {/* Top */}
        <rect x="30" y="0" width="40" height="30" fill={getSectionColor('top')} onClick={(e) => onToothClick(toothNumber, 'top', e)} style={{ cursor: 'pointer' }} />
        {/* Bottom */}
        <rect x="30" y="70" width="40" height="30" fill={getSectionColor('bottom')} onClick={(e) => onToothClick(toothNumber, 'bottom', e)} style={{ cursor: 'pointer' }} />
        {/* Left */}
        <rect x="0" y="30" width="30" height="40" fill={getSectionColor('left')} onClick={(e) => onToothClick(toothNumber, 'left', e)} style={{ cursor: 'pointer' }} />
        {/* Right */}
        <rect x="70" y="30" width="30" height="40" fill={getSectionColor('right')} onClick={(e) => onToothClick(toothNumber, 'right', e)} style={{ cursor: 'pointer' }} />
        <text x={50} y={120} textAnchor="middle" fontSize="24">{toothNumber}</text>
      </g>
    );
  };

  return (
    <svg width="100%" viewBox="0 0 2200 800">
      {/* Upper Arch */}
      <g transform="translate(100, 100)">
        {teeth.upperLeft.map((tooth, index) => (
          <g key={tooth} transform={`translate(${index * 120}, 0)`}>
            {renderTooth(tooth)}
          </g>
        ))}
      </g>
      <g transform="translate(1100, 100)">
        {teeth.upperRight.map((tooth, index) => (
          <g key={tooth} transform={`translate(${index * 120}, 0)`}>
            {renderTooth(tooth)}
          </g>
        ))}
      </g>

      {/* Lower Arch */}
      <g transform="translate(100, 400)">
        {teeth.lowerLeft.map((tooth, index) => (
          <g key={tooth} transform={`translate(${index * 120}, 0)`}>
            {renderTooth(tooth)}
          </g>
        ))}
      </g>
      <g transform="translate(1100, 400)">
        {teeth.lowerRight.map((tooth, index) => (
          <g key={tooth} transform={`translate(${index * 120}, 0)`}>
            {renderTooth(tooth)}
          </g>
        ))}
      </g>
    </svg>
  );
};

export default OdontogramChart;