# 🗳️ Polling App

A secure, modern polling application built with Next.js 14, Supabase, and TypeScript. Create, manage, and vote on polls with real-time results.

## ✨ Features

- **🔐 Secure Authentication** - User registration and login with Supabase Auth
- **📊 Real-time Polling** - Create polls and see results update instantly
- **👤 User Dashboard** - Manage your polls and view analytics
- **🛡️ Admin Panel** - Administrative oversight and poll management
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🔒 Enterprise Security** - Row-level security, session management, and access controls

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/polling-app.git
cd polling-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**
```bash
# Run the SQL schema in your Supabase dashboard
# File: lib/supabase/schema.sql
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running!

## 📱 Screenshots

<!-- Add your screenshots here -->
```
[Login Page] [Dashboard] [Poll Creation] [Results View]
```

## 🏗️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React

## 🔒 Security Features

This application has undergone a comprehensive security audit and implements enterprise-grade security measures:

### ✅ Authentication & Authorization
- Secure session management with Supabase Auth
- Row-level security (RLS) policies
- Protected routes with middleware
- User isolation (users can only access their own data)

### ✅ Access Control
- Server-side session validation
- Client-side auth state management
- Automatic redirection for unauthorized access
- Admin role separation

### ✅ Error Handling
- Graceful failure modes
- Defensive programming practices
- No sensitive information in error messages
- Proper input validation

### ✅ Recent Security Fixes
- **Fixed:** Authentication bypass vulnerability
- **Fixed:** Broken access control on `/polls` endpoint  
- **Fixed:** Runtime crashes in admin dashboard
- **Fixed:** Session management issues

[View Full Security Audit](./docs/SECURITY_AUDIT.md)

## 📖 Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Create Polls** - Add questions with multiple choice options
3. **Vote** - Participate in polls from other users
4. **View Results** - See real-time voting results and analytics
5. **Manage** - Edit or delete your own polls

### For Admins
1. Access the admin dashboard at `/admin`
2. View all polls across the platform
3. Monitor user activity and poll performance
4. Moderate content as needed

## 🛠️ Development

### Project Structure
```
polling-app/
├── app/                    # Next.js 14 app directory
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── auth/              # Authentication pages
│   ├── lib/               # Utility functions and actions
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Database and utility functions
├── public/               # Static assets
└── docs/                 # Documentation
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:reset     # Reset database schema
npm run db:migrate   # Run database migrations

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Linting & Formatting
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues
npm run format       # Prettier formatting
```

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🧪 Testing

### Security Testing
We've implemented comprehensive security testing:

```bash
# Test authentication flows
npm run dev
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Poll creation and editing
- [ ] Voting functionality
- [ ] Real-time result updates
- [ ] Access control (users can't see others' private polls)
- [ ] Admin dashboard functionality
- [ ] Mobile responsiveness

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```




## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and security checks
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure security measures are maintained
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- **Bug Reports:** [GitHub Issues](https://github.com/yourusername/polling-app/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/yourusername/polling-app/discussions)
- **Security Issues:** Please email security@yourapp.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components


---

**⭐ Star this repo if you found it helpful!**

Audit Made with ❤️ by [Faustine](https://github.com/faustine-van/)