import React from 'react';
import { Search } from 'lucide-react';
import { Chat } from '../types/Chat';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, activeChat, onChatSelect }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const truncateMessage = (message: string, maxLength: number = 40) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="bg-[#20222C] w-[280px] h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#2C2E3A]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0B3B8]" />
          <input
            type="text"
            placeholder="Search Conversation..."
            className="w-full bg-[#2C2E3A] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D99A7]"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`p-4 border-b border-[#2C2E3A] cursor-pointer hover:bg-[#2C2E3A] transition-colors ${
              activeChat?.id === chat.id ? 'bg-[#2C2E3A]' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-[#2D99A7] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {chat.participants[0]?.initials || 'GR'}
                  </span>
                </div>
                {chat.participants[0]?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#20222C]"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {chat.title}
                    </h3>
                    {chat.subtitle && (
                      <p className="text-[#B0B3B8] text-xs">{chat.subtitle}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {chat.lastMessage && (
                      <span className="text-[#B0B3B8] text-xs">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-[#2D99A7] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {chat.lastMessage && (
                  <p className="text-[#B0B3B8] text-sm mt-1">
                    {chat.lastMessage.type === 'file' 
                      ? `📎 ${chat.lastMessage.fileName}`
                      : chat.lastMessage.type === 'voice'
                      ? `🎤 Voice message`
                      : truncateMessage(chat.lastMessage.content)
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;