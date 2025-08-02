import { Chat, User, Message } from '../types/Chat';

export const mockUsers: User[] = [
  { id: '1', name: 'Alice', initials: 'AS', isOnline: true },
  { id: '2', name: 'Bob Chen', initials: 'BC', isOnline: false },
  { id: '3', name: 'Carol Davis', initials: 'CD', isOnline: true },
  { id: '4', name: 'David Park', initials: 'DP', isOnline: true },
  { id: '5', name: 'Emma Wilson', initials: 'EW', isOnline: false },
  { id: 'me', name: 'You', initials: 'ME', isOnline: true },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey team! I just reviewed the latest VFX shots for Project Alpha. The compositing work looks fantastic, but we need to adjust the lighting in scene 12.',
    timestamp: new Date('2024-01-15T10:30:00'),
    type: 'text',
  },
  {
    id: '2',
    senderId: 'me',
    content: 'Thanks Alice! I agree about scene 12. Should we schedule a review session this afternoon?',
    timestamp: new Date('2024-01-15T10:32:00'),
    type: 'text',
  },
  {
    id: '3',
    senderId: '1',
    content: 'Perfect! I\'ll send over the project brief with the updated requirements.',
    timestamp: new Date('2024-01-15T10:35:00'),
    type: 'text',
  },
  {
    id: '4',
    senderId: '1',
    content: '',
    timestamp: new Date('2024-01-15T10:36:00'),
    type: 'file',
    fileName: 'Project_Alpha_Brief_v2.pdf',
    fileSize: '1.2MB',
  },
  {
    id: '5',
    senderId: 'me',
    content: 'Got it! Let me also share the voice memo from yesterday\'s client call.',
    timestamp: new Date('2024-01-15T10:40:00'),
    type: 'text',
  },
  {
    id: '6',
    senderId: 'me',
    content: '',
    timestamp: new Date('2024-01-15T10:41:00'),
    type: 'voice',
    fileName: 'Brief_Update_Voicememo.mp3',
    fileSize: '800KB',
  },
  {
    id: '7',
    senderId: '2',
    content: 'Just joined the conversation. Are we still on track for the Friday deadline?',
    timestamp: new Date('2024-01-15T11:15:00'),
    type: 'text',
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    title: 'Alice',
    subtitle: 'Big Studio',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[5]],
    lastMessage: mockMessages[6],
    unreadCount: 2,
    isActive: true,
  },
  {
    id: '2',
    title: 'Project Alpha Team',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[5]],
    lastMessage: {
      id: 'last1',
      senderId: '2',
      content: 'The rendering is complete for scenes 1-5',
      timestamp: new Date('2024-01-15T09:45:00'),
      type: 'text',
    },
    unreadCount: 0,
  },
  {
    id: '3',
    title: 'VFX Supervisors',
    participants: [mockUsers[2], mockUsers[3], mockUsers[5]],
    lastMessage: {
      id: 'last2',
      senderId: '3',
      content: 'Can we schedule a review for tomorrow?',
      timestamp: new Date('2024-01-15T08:30:00'),
      type: 'text',
    },
    unreadCount: 1,
  },
  {
    id: '4',
    title: 'David Park',
    subtitle: 'Motion Craft',
    participants: [mockUsers[3], mockUsers[5]],
    lastMessage: {
      id: 'last3',
      senderId: '4',
      content: 'The motion graphics are ready for review',
      timestamp: new Date('2024-01-14T16:20:00'),
      type: 'text',
    },
    unreadCount: 0,
  },
  {
    id: '5',
    title: 'Emma Wilson',
    subtitle: 'Render Farm Studios',
    participants: [mockUsers[4], mockUsers[5]],
    lastMessage: {
      id: 'last4',
      senderId: '5',
      content: 'Server maintenance scheduled for tonight',
      timestamp: new Date('2024-01-14T14:15:00'),
      type: 'text',
    },
    unreadCount: 3,
  },
];