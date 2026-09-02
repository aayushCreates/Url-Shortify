# Url-Shortify

A modern, full-stack URL shortener built for speed, security, and detailed analytics. 

Url-Shortify isn't just about making links smaller—it's a comprehensive link management platform. It offers advanced features like custom slugs, password protection, click limits, and real-time geographical analytics, all wrapped in a premium, highly responsive user interface.

## ✨ Features

- **Advanced URL Management**: Generate secure short links, customize your own slugs, and manage them effortlessly from your dashboard.
- **Access Controls**: Secure your sensitive links with passwords, set expiration dates, or enforce maximum click limits.
- **Real-Time Analytics**: Track how your links are performing with in-depth statistics. View clicks over time, top referrers, device types, and geographical locations (powered by GeoLite2).
- **High Performance**: Built with Redis caching to ensure lightning-fast redirects and asynchronous analytics processing via queues.
- **Secure Authentication**: Robust user authentication system using JWTs and secure httpOnly refresh tokens.
- **Profile Management**: Update your user profile and seamlessly upload custom avatars (integrated with Cloudinary).
- **Beautiful Error Handling**: Premium, custom-designed UI pages for password-protected links or unavailable URLs.

## 🚀 Tech Stack

### Frontend
- **React 18** with **Vite** for lightning-fast builds
- **Tailwind CSS** for beautiful, responsive, utility-first styling
- **React Query** for powerful data fetching and state management
- **React Hook Form & Zod** for robust form validation
- **React Router** for seamless client-side routing
- **Lucide React** for crisp, scalable icons

### Backend
- **Node.js & Express** for a scalable, non-blocking API
- **Prisma ORM** for type-safe database interactions
- **Redis** for high-performance caching (redirects) and background queues (analytics)
- **Cloudinary & Multer** for secure image uploads and storage
- **JWT & bcrypt** for authentication and password hashing

## 📂 Project Structure

- `/client` - Contains the React frontend application.
- `/server` - Contains the Node.js/Express backend application, Prisma schema, and API routes.

## 🛠️ Getting Started

*(Instructions for setting up the environment variables, installing dependencies, and running the dev servers will go here).*
