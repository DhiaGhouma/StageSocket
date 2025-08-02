import React, { useState } from 'react';
import NavigationHeader from './components/NavigationHeader';
import ChatSidebar from './components/ChatSidebar';
import ChatPanel from './components/ChatPanel';
import DropdownChatWindow from './components/DropDownChatWindow';
import FloatingChatButton from './components/FloatingChatButton';
import { mockChats, mockMessages, mockUsers } from './data/mockChats';
import { Chat, Message, DropdownChat } from './types/Chat';

function App() {
  const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [dropdownChats, setDropdownChats] = useState<DropdownChat[]>([]);
  const currentUser = mockUsers.find(u => u.id === 'me')!;

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  const handleSendMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleOpenDropdownChat = () => {
    const aliceChat = mockChats[0];
    const existingChat = dropdownChats.find(dc => dc.chat.id === aliceChat.id);

    if (!existingChat) {
      const newDropdownChat: DropdownChat = {
        id: `dropdown-${aliceChat.id}`,
        chat: aliceChat,
        isMinimized: false,
        messages: messages.slice(0, 3),
        hasNewMessages: false,
      };
      setDropdownChats(prev => [...prev, newDropdownChat]);
    } else if (existingChat.isMinimized) {
      setDropdownChats(prev =>
        prev.map(dc =>
          dc.id === existingChat.id
            ? { ...dc, isMinimized: false, hasNewMessages: false }
            : dc
        )
      );
    }
  };

  const handleSimulateMessage = () => {
    if (dropdownChats.length > 0) {
      const randomChat = dropdownChats[Math.floor(Math.random() * dropdownChats.length)];
      const simulatedMessage: Message = {
        id: `sim-${Date.now()}`,
        senderId: randomChat.chat.participants[0].id,
        content: `Simulated message at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        type: 'text',
      };

      setDropdownChats(prev =>
        prev.map(dc =>
          dc.id === randomChat.id
            ? {
                ...dc,
                messages: [...dc.messages, simulatedMessage],
                hasNewMessages: dc.isMinimized,
              }
            : dc
        )
      );
    }
  };

  const handleMinimizeDropdownChat = (id: string) => {
    setDropdownChats(prev =>
      prev.map(dc =>
        dc.id === id
          ? { ...dc, isMinimized: !dc.isMinimized, hasNewMessages: false }
          : dc
      )
    );
  };

  const handleCloseDropdownChat = (id: string) => {
    setDropdownChats(prev => prev.filter(dc => dc.id !== id));
  };

  const handleSendDropdownMessage = (chatId: string, message: Message) => {
    setDropdownChats(prev =>
      prev.map(dc =>
        dc.id === chatId
          ? { ...dc, messages: [...dc.messages, message] }
          : dc
      )
    );
  };

  return (
    <div className="h-screen bg-[#121318] flex flex-col">
      <NavigationHeader />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          chats={mockChats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        <ChatPanel
          chat={activeChat}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>
      <FloatingChatButton
        onOpenChat={handleOpenDropdownChat}
        onSimulateMessage={handleSimulateMessage}
      />
      <div className="fixed bottom-0 right-6 flex space-x-2">
        {dropdownChats.map((dropdownChat, index) => (
          <DropdownChatWindow
            key={dropdownChat.id}
            dropdownChat={dropdownChat}
            currentUser={currentUser}
            onMinimize={handleMinimizeDropdownChat}
            onClose={handleCloseDropdownChat}
            onSendMessage={handleSendDropdownMessage}
            style={{
              width: '320px',
              height: dropdownChat.isMinimized ? 'auto' : '400px',
              zIndex: 1000 + index,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;