# 🎓 PeerFusion

**PeerFusion** is a comprehensive academic collaboration platform designed to connect students, researchers, and academics for meaningful project partnerships and knowledge exchange.

## ✨ Features

### 👥 User Management
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- **Rich User Profiles** - Customizable profiles with bio, institution, field of study, and avatar
- **Skills & Expertise** - Tag and showcase your technical skills and research interests

### 🚀 Project Collaboration
- **Project Creation** - Post and manage academic projects seeking collaborators
- **Project Discovery** - Browse and search projects by status, field, or keywords
- **Collaboration Requests** - Connect with project creators and join teams

### 💬 Communication
- **Real-time Messaging** - Direct messaging between users with Socket.IO
- **Notifications** - Stay updated on project invites, messages, and connections
- **Connection System** - Build your academic network with connection requests

### 📱 Social Features
- **Activity Feed** - Share updates, research findings, and academic achievements
- **Post Interactions** - Like, comment, and engage with community posts
- **User Search** - Find peers by name, institution, or research interests

### 🎨 User Experience
- **Dark/Light Mode** - Comfortable viewing in any environment
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe API development
- **Supabase** - PostgreSQL database and authentication
- **Socket.IO** - WebSocket server for real-time features
- **JWT** - Secure token-based authentication

### Infrastructure
- **Render** - Cloud hosting for both frontend and backend
- **Supabase** - Database, authentication, and storage
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Falco0906/PeerFusion.git
cd PeerFusion
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Configure environment variables**

**Backend** (`server/.env`):
```env
NODE_ENV=development
PORT=5050
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

4. **Set up the database**
- Go to your Supabase Dashboard → SQL Editor
- Run the schema from `server/src/database/supabase_schema.sql`

5. **Start development servers**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

6. **Open your browser**
- Frontend: http://localhost:3002
- Backend API: http://localhost:5050

## 📁 Project Structure

```
PeerFusion/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth, Theme, Socket)
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── database/      # Database schemas
│   │   └── utils/         # Utility functions
│   └── dist/              # Compiled TypeScript
│
├── render.yaml            # Render deployment config
└── README.md
```

## 🌐 Deployment

The application is configured for deployment on Render with automated CI/CD from GitHub.

### Deploy to Render

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect `render.yaml` and deploy both services
4. Configure environment variables in Render dashboard

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Supabase ORM)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Faisal Khan**
- GitHub: [@Falco0906](https://github.com/Falco0906)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- The open-source community

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for the academic community**