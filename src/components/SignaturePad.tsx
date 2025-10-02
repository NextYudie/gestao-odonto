import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onEnd: (signature: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (sigCanvas.current) {
      onEnd(sigCanvas.current.toDataURL());
    }
  };

  const clear = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div>
      <div style={{ border: '1px solid black', width: 500, height: 200 }}>
        <SignatureCanvas
          ref={sigCanvas}
          penColor='black'
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          onEnd={handleEnd}
        />
      </div>
      <button onClick={clear} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        Limpar
      </button>
    </div>
  );
};

export default SignaturePad;
