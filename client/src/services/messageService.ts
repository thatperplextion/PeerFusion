// client/src/services/messageService.ts - Messaging API service
import api from './api';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface Conversation {
  id: number;
  last_message_at: string;
  last_message_id: number | null;
  last_message_content: string | null;
  last_message_sender_id: number | null;
  other_user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export const messageService = {
  // Get all conversations for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/api/messages/conversations');
      return response.data;
    } catch (error) {
      // Return empty array if endpoint not available
      return [];
    }
  },

  // Get chat history between two users
  async getChatHistory(userId: number): Promise<Message[]> {
    try {
      const response = await api.get(`/api/messages/chat/${userId}`);
      return response.data;
    } catch (error) {
      // Return empty array if endpoint not available
      return [];
    }
  },

  // Send a message
  async sendMessage(receiverId: number, content: string, messageType: string = 'text'): Promise<Message | null> {
    try {
      const response = await api.post('/api/messages/send', {
        receiverId,
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      // Return null if endpoint not available
      return null;
    }
  },

  // Mark messages as read
  async markAsRead(senderId: number): Promise<void> {
    try {
      await api.put(`/api/messages/read/${senderId}`);
    } catch (error) {
      // Silently fail if endpoint not available
    }
  },

  // Get unread message count
  async getUnreadCount(): Promise<{ unreadCount: number }> {
    try {
      const response = await api.get('/api/messages/unread/count');
      return response.data;
    } catch (error) {
      // Return 0 if endpoint not available (not yet migrated)
      return { unreadCount: 0 };
    }
  }
};
