"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  institution?: string;
  field_of_study?: string;
  avatar?: string;
  joined_date?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔐 Checking for existing token:", !!token);
        
        if (token) {
          // Try to get cached user data first for instant loading
          const cachedUser = localStorage.getItem("user");
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
              console.log("💾 Loaded user from cache");
            } catch (e) {
              console.warn("⚠️ Failed to parse cached user");
            }
          }

          console.log("📡 Fetching user data...");
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051'}/api/auth/me`;
          
          const response = await fetch(apiUrl, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          
          console.log("🌐 Auth response status:", response.status);
          
          if (!response.ok) {
            // Only clear token if it's actually invalid (401/403)
            // Don't clear on network errors or server issues (500, etc.)
            if (response.status === 401 || response.status === 403) {
              console.error("❌ Token is invalid or expired");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              console.warn("⚠️ Server error, keeping token:", response.status);
              // Keep the user logged in, they can try again
            }
          } else {
            const userData = await response.json();
            console.log("✅ User data received:", userData);
            setUser(userData);
            // Cache user data for instant loading on refresh
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else {
          console.log("❌ No token found");
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        // Don't remove token on network errors - keep user logged in
        console.warn("⚠️ Network error during auth check, keeping user session");
      } finally {
        setLoading(false);
        console.log("🏁 Auth initialization complete");
      }
    };

    initAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    try {
      console.log("🔑 Logging in user:", userData.email);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log("✅ Login successful");
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  const logout = () => {
    console.log("🚪 Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      console.log("📝 Updating user data:", userData);
      setUser({ ...user, ...userData });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}