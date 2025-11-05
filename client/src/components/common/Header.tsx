"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ChatButton from "@/components/chat/ChatButton";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide header when scrolling down (after 100px)
      else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 glass-strong shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } hover:translate-y-0`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PeerFusion</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/feed" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Feed
            </Link>
            <Link href="/network" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Network
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Projects
            </Link>
            <Link href="/search" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Search
            </Link>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <NotificationBell />
                <ChatButton />
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.first_name?.[0] || user.email?.[0] || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block font-medium">{user.first_name || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 glass-strong rounded-lg shadow-xl py-2 z-50 border border-border">
                        <Link
                          href={`/profile/${user.id || 'me'}`}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 rounded-md mx-1 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 rounded-md mx-1 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-1 border-border/50 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md mx-1 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary hover:bg-muted"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary font-medium px-3 py-2 rounded-md hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="text-foreground hover:text-primary font-medium px-3 py-2 rounded-md hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/search"
                className="text-foreground hover:text-primary font-medium px-3 py-2 rounded-md hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
