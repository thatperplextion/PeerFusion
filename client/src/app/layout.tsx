// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "PeerFusion",
  description: "Collaborative Research & Skill-Sharing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <div className="relative min-h-screen">
                <Header />
                <main className="w-full pt-16">{children}</main>
              </div>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
