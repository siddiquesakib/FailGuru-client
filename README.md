<div align="center">

# FailGuru

### Digital Life Lessons Platform

*Learn from failures. Grow together. Share wisdom.*

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com)

</div>

---

## ✨ Features

### 🎓 **Learning Platform**
- Browse and search life lessons from real experiences
- Featured lessons curated by the community
- Category and emotional tone filtering
- Premium content with Stripe integration

### 👤 **User Dashboard**
- Personal profile management
- Create and manage your own lessons
- Track favorites and saved lessons
- View lesson analytics

### 🛡️ **Admin Panel**
- User management and role assignment
- Content moderation tools
- Reported lessons management
- Featured lesson curation

### 🔐 **Authentication**
- Firebase email/password authentication
- Google OAuth integration
- Role-based access control
- Protected routes

---

## 🛠️ Tech Stack

**Frontend Framework**
- React 19 with Vite
- React Router for navigation
- React Query for data fetching

**UI & Styling**
- TailwindCSS & DaisyUI
- Framer Motion animations
- Swiper for carousels
- React Icons

**Backend Integration**
- Axios for API calls
- Firebase Authentication
- Stripe checkout sessions

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/siddiquesakib/FailGuru-client.git

# Navigate to project
cd FailGuru-client

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The `dist/` folder contains the optimized production build ready for deployment.

---


## 🎯 Key Features Explained

### Role-Based Access
Users are assigned roles (`user` or `admin`) managed via backend API. The `useRole` hook fetches user roles, and `AdminRoute` component protects admin-only pages.

### Lesson System
- **Public Lessons**: Browse all lessons with search and filters
- **Featured Lessons**: Curated content displayed on homepage
- **Premium Lessons**: Accessible only to premium subscribers
- **My Lessons**: Personal lesson management for creators

### Payment Integration
Stripe checkout sessions handle premium subscription payments. Users can upgrade to access premium content.

---

<div align="center">

**Designed & Developed by Siddique Sakib**

[Github](https://github.com/siddiquesakib/) · [Linkedin](https://www.linkedin.com/in/mohammad-siddique-sakib/)

</div>
