import React, { useState, useRef, useEffect } from 'react';
import { Minus, X, Paperclip, Mic, Send } from 'lucide-react';
import { DropdownChat, Message, User } from '../types/Chat';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessage from './VoiceMessage';

interface DropdownChatWindowProps {
  dropdownChat: DropdownChat;
  currentUser: User;
  onMinimize: (id: string) => void;
  onClose: (id: string) => void;
  onSendMessage: (chatId: string, content: string) => void;
  style: React.CSSProperties;
}

const DropdownChatWindow: React.FC<DropdownChatWindowProps> = ({
  dropdownChat,
  currentUser,
  onMinimize,
  onClose,
  onSendMessage,
  style
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dropdownChat.messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(dropdownChat.id, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendVoiceMessage = (audioBlob: Blob, duration: number) => {
    // You can upload or process the audioBlob here if needed.
    const voiceMessage = `Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`;
    onSendMessage(dropdownChat.id, voiceMessage);
    setShowVoiceRecorder(false);
  };

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUserById = (id: string): User | undefined => {
    return dropdownChat.chat.participants.find(p => p.id === id);
  };

  const renderMessage = (message: Message) => {
    const sender = getUserById(message.senderId);
    const isMe = message.senderId === currentUser.id;

    return (
      <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
          {!isMe && (
            <p className="text-[#B0B3B8] text-xs mb-1 ml-1">{sender?.name}</p>
          )}
          
          <div className={`rounded-lg px-3 py-2 ${
            isMe 
              ? 'bg-[#2D99A7] text-white' 
              : 'bg-[#2C2E3A] text-white'
          }`}>
            {message.type === 'text' && (
              <p className="text-sm">{message.content}</p>
            )}
            
            {message.type === 'file' && (
              <div className="flex items-center space-x-2 p-2 bg-black bg-opacity-20 rounded">
                <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">📄</span>
                </div>
                <div>
                  <p className="text-xs font-medium">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize}</p>
                </div>
              </div>
            )}
            
            {message.type === 'voice' && (
              <VoiceMessage
                fileName={message.fileName || 'Voice message'}
                duration={message.fileSize || '0s'}
                audioUrl={message.filePath || ''}
                isMe={isMe}
              />
            )}
          </div>
          
          <p className={`text-[#B0B3B8] text-xs mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  if (dropdownChat.isMinimized) {
    return (
      <div 
        className="bg-[#20222C] rounded-t-lg shadow-lg cursor-pointer hover:bg-[#252831] transition-colors"
        style={style}
        onClick={() => onMinimize(dropdownChat.id)}
      >
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2D99A7] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {dropdownChat.chat.participants[0]?.initials}
              </span>
            </div>
            <span className="text-white font-semibold text-sm">
              {dropdownChat.chat.title}
            </span>
            {dropdownChat.hasNewMessages && (
              <div className="w-2 h-2 bg-[#2D99A7] rounded-full"></div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(dropdownChat.id);
            }}
            className="text-[#B0B3B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#1A1C24] rounded-t-lg shadow-2xl flex flex-col"
      style={style}
    >
      {/* Header */}
      <div className="bg-[#20222C] p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#2D99A7] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {dropdownChat.chat.participants[0]?.initials}
            </span>
          </div>
          <span className="text-white font-semibold text-sm">
            {dropdownChat.chat.title}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMinimize(dropdownChat.id)}
            className="text-[#B0B3B8] hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onClose(dropdownChat.id)}
            className="text-[#B0B3B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {dropdownChat.messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-[#2C2E3A]">
        <div className="flex items-center space-x-2">
          <button className="text-[#B0B3B8] hover:text-white transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-[#2C2E3A] text-white px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2D99A7]"
              disabled={showVoiceRecorder}
            />
          </div>
          
          {showVoiceRecorder ? (
            <div className="flex-1">
              <VoiceRecorder
                onSendVoiceMessage={handleSendVoiceMessage}
                onCancel={handleCancelVoiceRecording}
              />
            </div>
          ) : (
            <button 
              onClick={() => setShowVoiceRecorder(true)}
              className="text-[#B0B3B8] hover:text-white transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={handleSendMessage}
            className={`p-2 rounded-full transition-colors ${
              messageInput.trim() && !showVoiceRecorder
                ? 'bg-[#2D99A7] text-white hover:bg-[#2D99A7]/80' 
                : 'text-[#B0B3B8] hover:text-white'
            }`}
            disabled={showVoiceRecorder}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropdownChatWindow;