import React from 'react';
import { Building2, Users, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <Building2 className="w-8 h-8 text-white" />
        <h1 className="text-white text-3xl font-bold">VFX Studios Directory</h1>
      </div>
      
      <div className="flex space-x-6">
        <div className="bg-[#21242C] rounded-lg p-4 flex items-center space-x-3">
          <Users className="w-5 h-5 text-[#27AE60]" />
          <div>
            <p className="text-white font-semibold">Total Studios</p>
            <p className="text-[#A0A0A0] text-sm">6 registered</p>
          </div>
        </div>
        
        <div className="bg-[#21242C] rounded-lg p-4 flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-[#F1C40F]" />
          <div>
            <p className="text-white font-semibold">Pending Reviews</p>
            <p className="text-[#A0A0A0] text-sm">2 awaiting approval</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;