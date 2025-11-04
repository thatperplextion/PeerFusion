# Changelog

All notable changes to PeerFusion will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Modern ChatGPT-inspired theme with focused grayish color palette
- Comprehensive contributing guidelines
- Client environment variables example file
- Enhanced client README with detailed documentation

### Changed
- Updated color scheme for better focus and readability
- Improved header styling with semantic color classes
- Enhanced home page with modern card designs

## [1.2.0] - 2024-11-04

### Added
- Real-time notification system with bell icon in header
- Notification types: messages, project invites, skill endorsements, mentions, system
- Auto-refresh notifications every 30 seconds
- Unread notification count badge
- Enhanced user profiles with statistics cards
- Profile view analytics
- Publications showcase on profile pages
- Skill endorsement system
- Social media links (LinkedIn, GitHub, Google Scholar, ORCID, Website)
- Profile tabs: Overview, Skills, Publications

### Fixed
- **CRITICAL:** Authentication persistence bug preventing logout on navigation
- User session now persists across page navigation and refreshes
- Smart error handling - only logout on 401/403 authentication failures
- Network errors and server issues no longer clear authentication tokens
- Added localStorage caching for instant user data loading

### Changed
- Improved AuthContext with user data caching
- Enhanced error handling in API calls
- Better session management across the application

## [1.1.0] - 2024-11-03

### Added
- Complete MySQL database integration
- User skills management system
- Project creation and listing functionality
- Search functionality for users and projects
- Settings page for user preferences
- Help, Contact, and FAQ pages
- Real-time messaging with Socket.IO
- Dark mode theme support with smooth transitions

### Changed
- Migrated from PostgreSQL to MySQL
- Updated all database queries to use MySQL syntax
- Refactored authentication system
- Improved error handling across the application

### Fixed
- Registration and login authentication issues
- Profile page TypeScript errors
- Backend server port configurations
- Database connection pooling

## [1.0.0] - 2024-11-01

### Added
- Initial release of PeerFusion
- User authentication (register/login)
- Basic user profiles
- Dashboard view
- Project management foundation
- Skills sharing foundation
- Responsive design with Tailwind CSS
- Next.js 15 App Router architecture
- TypeScript throughout the application
- JWT-based authentication
- Express.js backend with TypeScript
- MySQL database schema

### Technical Stack
- **Frontend:** Next.js 15.4.6, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL 8.0
- **Authentication:** JWT with bcrypt
- **Real-time:** Socket.IO
- **Development:** ESLint, TypeScript ESLint

---

## Version History Summary

- **v1.2.0** - Notification system, enhanced profiles, authentication fixes
- **v1.1.0** - MySQL integration, messaging, search, dark mode
- **v1.0.0** - Initial release with core features

## Upcoming Features

### Planned for v1.3.0
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Project collaboration tools
- [ ] File upload system for projects
- [ ] User reputation system
- [ ] Trending projects/skills dashboard
- [ ] AI-powered recommendations

### Planned for v2.0.0
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API documentation with Swagger
- [ ] Comprehensive testing suite

---

**Note:** Dates follow YYYY-MM-DD format.
