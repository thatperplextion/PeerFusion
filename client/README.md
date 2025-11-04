# PeerFusion Client 🚀

Modern frontend application for the PeerFusion collaborative research platform, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Modern ChatGPT-inspired Theme** - Clean, focused grayish color palette
- 🌓 **Dark/Light Mode** - Smooth theme transitions with system detection
- 🔔 **Real-time Notifications** - Live notification system with auto-refresh
- 💬 **Live Messaging** - Socket.IO powered real-time chat
- 📊 **Enhanced Profiles** - Rich profiles with stats, publications, and endorsements
- 🚀 **Fast & Responsive** - Optimized performance with Next.js 15

## 🛠️ Tech Stack

- **Framework:** Next.js 15.4.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom theme variables
- **State Management:** React Context API
- **Authentication:** JWT with Bearer tokens + localStorage caching
- **Real-time:** Socket.IO for live features
- **HTTP Client:** Fetch API with custom service layer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5051" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── projects/          # Project management
│   │   ├── profile/           # User profiles
│   │   ├── search/            # Search functionality
│   │   ├── skills/            # Skills management
│   │   └── settings/          # User settings
│   ├── components/
│   │   ├── chat/              # Chat components
│   │   └── common/            # Shared components (Header, NotificationBell, ThemeToggle)
│   ├── contexts/              # React contexts (Auth, Socket, Theme)
│   ├── hooks/                 # Custom React hooks
│   └── services/              # API service layer
├── public/                    # Static assets
└── package.json
```

## 🎨 Theme System

The application uses a modern, ChatGPT-inspired color palette:

### Light Mode
- Background: `#f7f7f8` (soft gray)
- Cards: `#ffffff` (white)
- Primary: `#10a37f` (teal)

### Dark Mode
- Background: `#212121` (dark gray)
- Cards: `#2f2f2f` (lighter dark)
- Primary: `#10a37f` (teal)

## 🔐 Authentication

- JWT-based authentication with Bearer tokens
- Persistent sessions using localStorage caching
- Automatic token refresh on page load
- Smart error handling (only logout on 401/403)
- Protected routes via AuthContext

## 🔔 Notification System

- Real-time notification bell in header
- Unread count badge
- Auto-refresh every 30 seconds
- Notification types:
  - 📧 Messages
  - 🎯 Project invites
  - ⭐ Skill endorsements
  - 💬 Mentions
  - 📢 Project updates

## 🤝 Contributing

This is part of a collaborative research platform. Feel free to submit pull requests!

## 📄 License

MIT License

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
