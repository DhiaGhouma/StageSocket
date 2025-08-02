import React from 'react';
import StudioCard from './StudioCard';
import { Studio } from '../types/Studio';

interface StudioListProps {
  studios: Studio[];
}

const StudioList: React.FC<StudioListProps> = ({ studios }) => {
  return (
    <div className="space-y-4">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  );
};

export default StudioList;