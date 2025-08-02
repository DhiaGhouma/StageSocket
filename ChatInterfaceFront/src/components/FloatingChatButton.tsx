import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';

interface FloatingChatButtonProps {
  onOpenChat: () => void;
  onSimulateMessage: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  onOpenChat, 
  onSimulateMessage 
}) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col space-y-3">
      {/* Open Chat Button */}
      <button
        onClick={onOpenChat}
        className="w-14 h-14 bg-[#2D99A7] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2D99A7]/80 transition-all duration-200 hover:scale-105"
        title="Open Chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
      
      {/* Simulate Message Button */}
      <button
        onClick={onSimulateMessage}
        className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center shadow-lg hover:bg-[#27AE60]/80 transition-all duration-200 hover:scale-105"
        title="Simulate Incoming Message"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default FloatingChatButton;