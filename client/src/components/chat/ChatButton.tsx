// client/src/components/chat/ChatButton.tsx - Chat button with unread count
"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { messageService } from '@/services/messageService';
import Chat from './Chat';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Load initial unread count
    loadUnreadCount();

    // Set up interval to check for new messages
    const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const loadUnreadCount = async () => {
    try {
      const { unreadCount } = await messageService.getUnreadCount();
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Messages"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Side Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Panel */}
          <div 
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] z-50 glass-strong shadow-2xl border-l border-border animate-slide-in-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-card/50 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Messages</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
