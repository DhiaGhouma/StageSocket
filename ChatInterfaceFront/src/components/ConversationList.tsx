import React from 'react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div className="fixed bottom-24 left-6 w-72 bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Conversations</h3>
      <ul>
        {conversations.map((conv) => (
          <li 
            key={conv.id} 
            onClick={() => onSelectConversation(conv)}
            className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded"
          >
            <div className="font-medium">{conv.name}</div>
            <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
