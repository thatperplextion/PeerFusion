// src/app/login/page.tsx - Fix client-side login with better error handling
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Attempting login for:", email);
      
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051'}/api/auth/login`;
      console.log("📡 API URL:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📊 Response status:", res.status);
      
      // Read response text first
      const responseText = await res.text();
      console.log("📄 Response text:", responseText);

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response isn't JSON, use the text as error
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = JSON.parse(responseText);
      console.log("✅ Login successful:", data);
      
      if (data.token && data.user) {
        login(data.token, data.user);
        console.log("🔄 Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response format: missing token or user data");
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during login";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-center animate-fade-in mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-foreground animate-slide-in mb-3">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Or{' '}
          <Link href="/register" className="font-medium text-primary hover:opacity-90 transition-smooth">
            create a new account
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-border">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in">
                <strong>Login Failed:</strong> {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center py-3 text-base font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}