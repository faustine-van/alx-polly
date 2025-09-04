# 🗳️ ALX Polly: Security-Audited Polling Application

> **An ALX Portfolio Project** - A secure, modern polling application built with Next.js 14, Supabase, and TypeScript. This project demonstrates advanced security practices through comprehensive vulnerability assessment and remediation.

[![ALX](https://img.shields.io/badge/ALX-Portfolio%20Project-blue.svg)](https://www.alxafrica.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-Audited-green.svg)](#security-features)
[![AI Assisted](https://img.shields.io/badge/AI-Assisted%20Development-purple.svg)](#ai-assisted-development)

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [The ALX Challenge](#the-alx-challenge)
- [Security Audit Results](#security-audit-results)
- [Features](#features)
- [Quick Start](#quick-start)
- [AI-Assisted Development](#ai-assisted-development)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 About the Project

**ALX Polly** is a full-stack polling application that serves as both a functional web application and a comprehensive security learning project. Built as part of the ALX Software Engineering curriculum, this project demonstrates:

- Modern web development with Next.js App Router
- Secure authentication and authorization patterns
- Database security with Row-Level Security (RLS)
- Real-world security vulnerability identification and remediation
- AI-assisted development practices

### 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS + Shadcn/UI
- **Development:** AI-assisted with Claude/GPT

## 🎓 The ALX Challenge

This project was originally built with **intentional security vulnerabilities** as part of an ALX security audit exercise. The challenge involved:

### 📝 Original Objectives:
1. **Identify Vulnerabilities** - Act as a security engineer auditing the codebase
2. **Understand Impact** - Analyze potential damage from each security flaw  
3. **Implement Fixes** - Remediate vulnerabilities with secure coding practices
4. **Document Process** - Create comprehensive security documentation

### 🔍 Methodology:
- Static code analysis of authentication flows
- Dynamic testing of access controls
- AI-assisted vulnerability assessment
- Implementation of enterprise-grade security measures

## 🛡️ Security Audit Results

### 📊 Vulnerability Summary

| Vulnerability Type | Severity | Status | Impact |
|-------------------|----------|--------|---------|
| Authentication Bypass | **🔴 Critical** | ✅ **FIXED** | Complete access control failure |
| Broken Access Control | **🔴 High** | ✅ **FIXED** | Unauthorized data access |
| Runtime Crashes | **🟡 Medium** | ✅ **FIXED** | Service availability issues |
| Deprecated Patterns | **🟢 Low** | ✅ **FIXED** | Future compatibility risks |

### 🔧 Security Fixes Implemented

#### 1. **Authentication System Overhaul** 
```typescript
// Before: Vulnerable middleware checking all routes
if (!user && !pathname.startsWith('/login')) { /* crashes */ }

// After: Smart route protection with proper error handling
const publicRoutes = ['/login', '/register', '/auth', '/', '/api']
const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

if (isPublicRoute) return supabaseResponse
try {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.redirect('/login')
} catch (error) {
  return NextResponse.redirect('/login')
}
```

#### 2. **Server-Side Session Validation**
```typescript
// Added comprehensive session checks to all data operations
export async function getUserPolls() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }
  // Proceed with authorized query...
}
```

#### 3. **Defensive Programming Practices**
```typescript
// Before: Crash-prone code
{poll.options.map((option) => <div>{option.text}</div>)}

// After: Defensive checks with graceful fallbacks
{poll.options && Array.isArray(poll.options) && poll.options.length > 0 ? (
  poll.options.map((option) => <div key={option.id}>{option.text}</div>))
) : (
  <div>No options available.</div>
)}
```

[📄 **View Complete Security Audit Documentation**](https://docs.google.com/document/d/1c5_km653hdwabqhms3nEE14nvGBGDdD6URWcOFJ8_uc/edit?usp=sharing)

## ✨ Features

### 🔐 **Security-First Design**
- Enterprise-grade authentication with Supabase
- Row-Level Security (RLS) database policies
- Protected routes with smart middleware
- User data isolation and access controls

### 📊 **Core Functionality**
- **User Authentication** - Secure registration and login
- **Poll Management** - Create, edit, and delete polls
- **Real-time Voting** - Live vote tracking and results
- **User Dashboard** - Personal poll analytics
- **Admin Panel** - Administrative oversight tools
- **Mobile Responsive** - Optimized for all devices

### 🎨 **Modern UI/UX**
- Clean, intuitive interface with Tailwind CSS
- Accessible components with Shadcn/UI
- Real-time updates without page refreshes
- Responsive design for all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/faustine-van/alx-polly.git
cd alx-polly

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Configuration
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `lib/supabase/schema.sql`
3. Enable Row Level Security on tables

### Start Development
```bash
npm run dev
# Visit http://localhost:3000
```

## 🤖 AI-Assisted Development

This project showcases modern AI-assisted development practices:

### 🧠 **AI Tools Used:**
- **Code Analysis:** AI-powered vulnerability scanning
- **Security Auditing:** Automated security pattern detection  
- **Code Generation:** AI-assisted secure code implementation
- **Documentation:** AI-enhanced technical writing

### 📚 **Learning Outcomes:**
- How to leverage AI for security analysis
- Prompt engineering for code review
- AI-assisted debugging and optimization
- Collaborative human-AI development workflow

### 💡 **Best Practices Demonstrated:**
- Using AI as a security consultant
- Validating AI suggestions with manual review
- Combining AI insights with security expertise
- Documenting AI-assisted development process


## 🔒 Security Features

### ✅ **Authentication & Authorization**
- **Session Management:** Secure JWT handling with Supabase
- **Route Protection:** Middleware-level access control
- **User Isolation:** RLS policies prevent data leakage
- **Role-Based Access:** Admin vs user permissions

### ✅ **Data Protection**
- **Input Validation:** Server-side data sanitization
- **SQL Injection Prevention:** Parameterized queries via Supabase
- **XSS Protection:** Proper output encoding
- **CSRF Protection:** Built-in Next.js protections

### ✅ **Error Handling**
- **Graceful Failures:** No system crashes on errors
- **Information Disclosure:** Sanitized error messages
- **Logging:** Security event monitoring
- **Fallback UI:** User-friendly error states

### ✅ **Infrastructure Security**
- **HTTPS Enforcement:** Secure communication
- **Environment Variables:** Secrets management
- **Database Security:** Row-level security policies
- **Deployment Security:** Vercel security headers

## 🧪 Testing

### Security Testing Checklist

```bash
# Authentication Flow Tests
✅ User registration works correctly
✅ Login/logout functionality secure  
✅ Session persistence across browser refresh
✅ Unauthorized access redirects to login

# Access Control Tests  
✅ Users can only see their own polls
✅ Admin panel restricted to admin users
✅ API endpoints validate authentication
✅ Direct URL access properly controlled

# Error Handling Tests
✅ Invalid poll IDs show proper errors
✅ Network errors handled gracefully  
✅ Database errors don't crash application
✅ User input validation prevents crashes
```

### Manual Testing

1. **Authentication Security**
   ```bash
   # Test unauthenticated access
   curl -X GET http://localhost:3000/polls
   # Should redirect to login
   ```

2. **Data Access Control**
   - Create polls with User A
   - Login as User B 
   - Verify User B cannot see User A's polls

3. **Error Resilience**
   - Test with invalid poll IDs
   - Test with network disconnection
   - Verify graceful error handling

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy ALX Polly"
git push origin main

# 2. Deploy to Vercel
# - Import from GitHub
# - Add environment variables
# - Deploy!
```

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🤝 Contributing

This is an ALX educational project

### Development Guidelines
- Follow ALX coding standards
- Maintain security-first approach
- Use AI assistance responsibly
- Document security considerations
- Write comprehensive tests

### Pull Request Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/security-improvement`)
3. Implement changes with security in mind
4. Run security tests
5. Update documentation
6. Submit PR with detailed description


## 🙏 Acknowledgments

### 🎓 **ALX Africa**
- Providing world-class software engineering education
- Creating practical, real-world learning experiences  
- Fostering innovation in African tech talent

### 🤖 **AI Development Partners**
- **Claude (Anthropic)** - Security analysis and code generation
- **Trae IDE (AI-assisted)** – Provided intelligent code completion and suggestions  
- **ChatGPT** - Documentation and debugging assistance

### 🛠️ **Technology Stack**
- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful UI components

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/faustine-van/alx-polly?style=social)
![GitHub forks](https://img.shields.io/github/forks/faustine-van/alx-polly?style=social)
![Security Audit](https://img.shields.io/badge/Security-Audited%20%26%20Fixed-green)
![ALX Project](https://img.shields.io/badge/ALX-Portfolio%20Project-blue)

---

## 🌟 About the Developer

**Faustine Van** - ALX Software Engineering Student  
📧 Email: [faustinemuhayemariya@.com](mailto:faustinemuhayemariya@.com)  
🐙 GitHub: [@faustine-van](https://github.com/faustine-van)

> *"Security is not a product, but a process. This project demonstrates the importance of building security into every layer of modern web applications."*

---

**⭐ Star this repo if it helped you learn about web security!**  
**🔄 Fork it to practice your own security auditing skills!**

*Built with ❤️ the ALX community*