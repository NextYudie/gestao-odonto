import React, { useEffect, useRef } from 'react';

interface ToothStatusPopoverProps {
  position: { x: number, y: number };
  onSelect: (status: string) => void;
  onClose: () => void;
  toothNumber: number;
  section: string;
}

const toothStatuses = ['hígido', 'cariado', 'extraído', 'restaurado', 'coroa', 'implante'];

const ToothStatusPopover: React.FC<ToothStatusPopoverProps> = ({ position, onSelect, onClose, toothNumber, section }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      style={{ top: position.y, left: position.x }}
      className="absolute bg-white rounded-lg shadow-lg p-2 z-50"
    >
      <h3 className="text-sm font-bold mb-2">Dente {toothNumber} - Parte {section}</h3>
      <ul className="space-y-1">
        {toothStatuses.map(status => (
          <li
            key={status}
            onClick={() => onSelect(status)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            {status}
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="mt-2 text-xs text-gray-500 hover:text-gray-700">Fechar</button>
    </div>
  );
};

export default ToothStatusPopover;
