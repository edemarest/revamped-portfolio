import React from 'react';

type Model = {
  url: string;
  thumbnail: string;
  camera: { position: [number, number, number]; fov: number };
  tags: string[];
};

interface Props {
  models: Model[];
}

const MobileModelViewer: React.FC<Props> = ({ models }) => {
  return (
    <div>
      {/* Mobile model grid will be implemented here */}
      {models.map((model, idx: number) => (
        <div key={idx}>
          <img src={model.thumbnail} alt={model.url} style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
    </div>
  );
};

export default MobileModelViewer;
