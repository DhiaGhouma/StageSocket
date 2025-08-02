export interface User {
  id: string;
  name: string;
  initials: string;
  isOnline: boolean;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'file';
  timestamp: Date;
  fileName?: string;
  fileSize?: string;
  filePath?: string;
}


export interface Chat {
  id: string;
  title: string;
  subtitle?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isActive?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'voice' | 'image' | 'document';
}

export interface DropdownChat {
  id: string;
  chat: Chat;
  isMinimized: boolean;
  messages: Message[];
  hasNewMessages: boolean;
}