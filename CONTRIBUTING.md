# Contributing to PeerFusion 🤝

Thank you for your interest in contributing to PeerFusion! This document provides guidelines and steps for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on collaboration and learning
- Help maintain a positive community

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Git
- VS Code (recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/PeerFusion.git
   cd PeerFusion
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Configure environment**
   ```bash
   # Server .env
   cd server
   cp .env.example .env
   # Edit .env with your MySQL credentials
   
   # Client .env.local
   cd ../client
   echo "NEXT_PUBLIC_API_URL=http://localhost:5051" > .env.local
   ```

4. **Setup database**
   ```bash
   cd server
   # Run the MySQL setup script
   mysql -u root -p < setup-db.sql
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

## 💻 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/notification-system`)
- `fix/` - Bug fixes (e.g., `fix/auth-logout-bug`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-context`)
- `style/` - UI/styling changes (e.g., `style/dark-mode-theme`)

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// ✅ Good
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
}

// ❌ Bad
let data: any = {};
```

### React Components

- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop types
- Extract complex logic into custom hooks

```typescript
// ✅ Good
interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  // Component logic
}
```

### Styling

- Use Tailwind CSS utility classes
- Use theme variables for colors
- Follow the existing design system
- Ensure responsive design

```tsx
// ✅ Good
<div className="bg-background text-foreground rounded-lg p-4">

// ❌ Bad
<div className="bg-white text-black rounded-lg p-4">
```

### Backend (Express/TypeScript)

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate input data
- Use prepared statements for SQL queries

```typescript
// ✅ Good
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 📋 Commit Guidelines

We follow conventional commits for clear history:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add persistent session with localStorage caching

- Implement user data caching
- Add smart error handling for 401/403
- Prevent logout on network errors

Fixes #42

---

fix(profile): resolve avatar upload issue

---

docs(readme): update installation instructions
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main-2
   git pull origin main-2
   git checkout your-branch
   git rebase main-2
   ```

2. **Test your changes**
   - Run the application locally
   - Test all affected features
   - Check for console errors
   - Verify responsive design

3. **Review your code**
   - Remove console.logs
   - Check for commented code
   - Ensure proper formatting
   - Update documentation if needed

### Submitting PR

1. **Push your branch**
   ```bash
   git push origin your-branch
   ```

2. **Create Pull Request on GitHub**
   - Clear title describing the change
   - Detailed description of what and why
   - Reference any related issues
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Code refactoring
   
   ## Testing
   - [ ] Tested locally
   - [ ] No console errors
   - [ ] Responsive design verified
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Fixes #123
   ```

### After Submission

- Respond to review comments
- Make requested changes
- Keep PR updated with main branch
- Be patient and respectful

## 🐛 Reporting Bugs

Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/error logs
- Environment details (OS, browser, Node version)

## 💡 Suggesting Features

- Check existing issues first
- Provide clear use case
- Explain the benefit
- Consider implementation complexity

## ❓ Questions?

- Open a GitHub Discussion
- Tag relevant maintainers
- Check existing documentation

## 🙏 Thank You!

Your contributions make PeerFusion better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
