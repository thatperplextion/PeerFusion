// client/src/components/chat/ChatButton.tsx - Chat button with unread count
"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Search, Filter, Archive, Star, Users, Settings, MoreVertical, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { messageService } from '@/services/messageService';
import Chat from './Chat';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[650px] md:w-[750px] lg:w-[850px] z-50 bg-[#2a2a2a] shadow-2xl border-l border-white/10 animate-slide-in-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-white/10 bg-[#1f1f1f]">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Messages</h2>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                    {unreadCount} new
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {/* TODO: New message */}}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    title="New message"
                  >
                    <Edit className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${showFilters ? 'bg-primary/20' : ''}`}
                    title="Filters"
                  >
                    <Filter className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => {/* TODO: Settings */}}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                  >
                    <X className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 pb-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">All</span>
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all relative ${
                    activeTab === 'unread' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <MessageCircle className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-current"></span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Unread</span>
                </button>
                <button
                  onClick={() => setActiveTab('starred')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'starred' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Starred</span>
                </button>
                <button
                  onClick={() => setActiveTab('archived')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'archived' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span className="text-sm font-medium">Archived</span>
                </button>
              </div>

              {/* Filters Dropdown */}
              {showFilters && (
                <div className="px-4 pb-3 border-t border-white/10 pt-3 bg-[#1a1a1a]">
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Users className="w-3 h-3 inline mr-1" />
                      Group chats
                    </button>
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Media
                    </button>
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Links
                    </button>
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Files
                    </button>
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Today
                    </button>
                    <button className="px-3 py-1.5 text-xs text-gray-300 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                      This week
                    </button>
                    <button className="px-3 py-1.5 text-xs text-red-400 border border-red-500/30 rounded-full hover:bg-red-500 hover:text-white transition-all">
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden bg-[#232323]">
              <Chat 
                onClose={() => setIsOpen(false)}
              />
            </div>

            {/* Footer - Quick Actions */}
            <div className="flex-shrink-0 border-t border-white/10 bg-[#1f1f1f] px-4 py-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span>{unreadCount} unread messages</span>
                  <span>•</span>
                  <button className="hover:text-primary transition-colors">
                    Mark all as read
                  </button>
                </div>
                <button className="hover:text-primary transition-colors flex items-center gap-1">
                  <MoreVertical className="w-3 h-3" />
                  More options
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
