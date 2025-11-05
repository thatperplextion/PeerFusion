import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/authMiddleware';
import userRoutes from './routes/user';
import projectsRoutes from './routes/projects';
import messagesRoutes from './routes/messages';
import searchRoutes from './routes/search';
import notificationsRoutes from './routes/notifications';
import postsRoutes from './routes/posts';
import connectionsRoutes from './routes/connections';

const app = express();
const httpServer = createServer(app);
// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'https://peerfusion-client.onrender.com', // Production frontend
  process.env.FRONTEND_URL // Optional: set this in Render env vars
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security + Logging
app.use(helmet());
app.use(morgan('dev'));

// JSON parsing
app.use(express.json());

// CORS (only once, with correct settings)
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'PeerFusion API running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data!', user: (req as any).user });
});
app.use('/api/users', userRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined room: user_${userId}`);
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    const { receiverId, message } = data;
    io.to(`user_${receiverId}`).emit('new_message', message);
    console.log(`💬 Private message sent to user ${receiverId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { receiverId, isTyping } = data;
    socket.to(`user_${receiverId}`).emit('user_typing', {
      userId: socket.id,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

export { app, httpServer, io };
