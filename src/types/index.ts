export interface UserProfile {
  nickname: string;
  language: string;
  level: string;
  goal: string;
  avatar: string;
}

export interface User extends UserProfile {
  id: string;
  socketId: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  joinedAt: number;
  roomId?: string;
  isHost?: boolean;
}

export interface Room {
  id: string;
  name: string;
  language: string;
  level: string;
  topic: string;
  maxUsers: number;
  isPrivate: boolean;
  createdAt: number;
  hostId: string;
  mode: 'voice' | 'video';
  allowAnyone: boolean;
  users: User[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderNickname: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterNickname: string;
  reportedUserId: string;
  reportedNickname: string;
  roomId: string;
  roomName: string;
  reason: string;
  description: string;
  timestamp: number;
}

export interface AdminStats {
  totalUsers: number;
  activeRooms: number;
  activeVoiceSessions: number;
  messagesPerMin: number;
}

export type SpeakingLevel =
  | 'Beginner'
  | 'Elementary'
  | 'Intermediate'
  | 'Upper Intermediate'
  | 'Advanced'
  | 'Fluent';

export type Language =
  | 'English'
  | 'Telugu'
  | 'Hindi'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Italian'
  | 'Portuguese'
  | 'Arabic'
  | 'Japanese'
  | 'Korean'
  | 'Chinese'
  | 'Russian'
  | 'Other';

export type ConversationGoal =
  | 'Casual Talk'
  | 'Language Practice'
  | 'Interview Practice'
  | 'Travel'
  | 'Business'
  | 'Education'
  | 'Friendship'
  | 'Other';
