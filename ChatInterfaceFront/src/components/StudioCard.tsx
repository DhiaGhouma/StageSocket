import React from 'react';
import { Star, Check, Clock, MessageCircle } from 'lucide-react';
import { Studio } from '../types/Studio';

interface StudioCardProps {
  studio: Studio;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio }) => {
  const getServiceColor = (color: string) => {
    const colors = {
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-black',
      blue: 'bg-blue-500 text-white',
      mint: 'bg-teal-400 text-black',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="bg-[#21242C] rounded-lg p-6 transition-all duration-300 hover:bg-[#252831] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{studio.initials}</span>
          </div>

          {/* Studio Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-white text-xl font-bold">{studio.name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(studio.rating)}
                <span className="text-white text-sm ml-1">({studio.rating.toFixed(1)})</span>
              </div>
            </div>
            
            <p className="text-[#A0A0A0] text-sm mb-3">Added by {studio.addedBy}</p>
            
            {/* Services */}
            <div className="flex flex-wrap gap-2 mb-4">
              {studio.services.map((service, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceColor(service.color)}`}
                >
                  {service.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="bg-[#17181D] text-white px-4 py-2 rounded-lg hover:bg-[#1a1b21] transition-colors duration-200 font-medium">
                View Profile
              </button>
              <button className="bg-[#17181D] border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-[#1a1b21] hover:border-gray-500 transition-all duration-200 flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="ml-6">
          {studio.status === 'approved' ? (
            <div className="bg-[#27AE60] text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span className="font-medium">Approved</span>
            </div>
          ) : (
            <div className="bg-[#F1C40F] text-black px-4 py-2 rounded-full flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Pending Approval</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioCard;